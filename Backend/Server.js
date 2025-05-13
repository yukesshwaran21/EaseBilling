const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const JWT_SECRET = "11a78abe5b06c97ed3caca235459292af353c693049c44ff8b7cd988167b1784e2efe4ac7ba15a67723c69ff3a552198bfa75d2712c35b1dc49b0d85446a7824";

mongoose.connect("mongodb+srv://varunesh:varunesh@cluster0.ztrto.mongodb.net/")
  .then(() => console.log("Connected to MongoDB - Electrical Items Database"))
  .catch((err) => console.error("MongoDB connection error:", err));

const ItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  brand: { type: String, default: "" },
  amps: { type: String, default: "" },
  watt: { type: String, default: "" },
  inchMm: { type: String, default: "" },
  storageLocation: { type: String, default: "" },
  stock: { type: Number, required: true, min: 0 },
  expiryDate: { type: Date, default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
  purchasePrice: { type: Number, default: 0 },
  sellingPrice: { type: Number, default: 0 },
  gstTax: { type: Number, default: 0 },
  manufacturer: { type: String, default: "" },
  supplier: { type: String, default: "" },
  contact: { type: String, default: "" },
});

const Item = mongoose.model("Item", ItemSchema);

const InvoiceSchema = new mongoose.Schema({
  billId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  items: [{
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    itemName: String,
    brand: String,
    amps: String,
    watt: String,
    quantity: Number,
    sellingPrice: Number,
    gstTax: Number
  }],
  totalAmount: { type: Number, required: true },
  totalGST: { type: Number, required: true },
  totalBill: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["cash", "online"],
    required: true
  },
  paymentId: {
    type: String,
    required: function() {
      return this.paymentMethod === "online";
    }
  },
  date: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Invoice = mongoose.model("Invoice", InvoiceSchema);

const ItemRequestSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  itemName: { type: String, required: true },
  brand: { type: String, required: true },
  amps: { type: String, required: true },
  watt: { type: String, required: true },
  inchMm: { type: String },
  storageLocation: { type: String },
  stock: { type: Number, required: true, min: 1 },
  expiryDate: { type: Date },
  purchasePrice: { type: Number },
  sellingPrice: { type: Number },
  gstTax: { type: Number },
  manufacturer: { type: String },
  supplier: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  imageUrl: { type: String },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
});

const ItemRequest = mongoose.model("ItemRequest", ItemRequestSchema);

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied: No token provided" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt received:", { email, password });

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Email and password must be strings" });
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database connection is not established");
    }

    const user = await User.findOne({ email }).select("email password role");

    if (!user) {
      console.log(`Login attempt failed: No user found with email ${email}`);
      return res.status(401).json({ error: "User not found" });
    }

    if (!user.password) {
      console.log(`Login attempt failed: No password set for user ${email}`);
      return res.status(500).json({ error: "User password is missing in the database" });
    }

    if (!user.role) {
      console.log(`Login attempt failed: No role set for user ${email}`);
      return res.status(500).json({ error: "User role is missing in the database" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Login attempt failed: Incorrect password for user ${email}`);
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", {
      message: error.message,
      stack: error.stack,
    });
    if (error.message.includes("Database connection")) {
      res.status(500).json({ error: "Failed to connect to the database" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.get("/api/search-item", async (req, res) => {
  try {
    const { itemName } = req.query;
    let items;

    if (itemName) {
      items = await Item.find({
        itemName: { $regex: itemName, $options: "i" },
      });
    } else {
      items = await Item.find();
    }

    res.json(items);
  } catch (err) {
    console.error("Error searching items:", err.message);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

app.get("/api/workers", authenticateToken, async (req, res) => {
  try {
    const workers = await User.find();
    res.json(workers);
  } catch (error) {
    console.error("Error fetching workers:", error.message);
    res.status(500).json({ error: "Failed to fetch workers" });
  }
});

app.post("/api/worker", authenticateToken, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newWorker = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newWorker.save();
    res.json({ message: "Worker added successfully", worker: newWorker });
  } catch (error) {
    console.error("Error adding worker:", error.message);
    res.status(500).json({ error: "Error adding worker" });
  }
});

app.put("/api/update-worker/:id", authenticateToken, async (req, res) => {
  try {
    const { newPassword } = req.body;
    const worker = await User.findById(req.params.id);

    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    worker.password = hashedPassword;
    await worker.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error.message);
    res.status(500).json({ error: "Error updating password" });
  }
});

app.delete("/api/delete-worker/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const worker = await User.findByIdAndDelete(id);
    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }
    res.json({ message: "Worker deleted successfully" });
  } catch (error) {
    console.error("Error deleting worker:", error.message);
    res.status(500).json({ error: "Error deleting worker" });
  }
});

app.get("/api/items", authenticateToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database connection is not established");
    }

    const items = await Item.find();
    if (items.length === 0) {
      return res.status(200).json({ message: "No items found", items: [] });
    }

    res.json(items);
  } catch (err) {
    console.error("Error fetching items:", {
      message: err.message,
      stack: err.stack,
    });
    if (err.message.includes("Database connection")) {
      res.status(500).json({ error: "Failed to connect to the database" });
    } else {
      res.status(500).json({ error: "Failed to fetch items" });
    }
  }
});

const multer = require('multer');
const upload = multer();

app.post("/api/add-item", authenticateToken, upload.none(), async (req, res) => {
  try {
    console.log("Parsed form data:", req.body);

    const {
      name,
      batchNumber,
      category,
      strengthDosage,
      composition,
      storageLocation,
      stockQuantity,
      expiryDate,
      purchasePrice,
      sellingPrice,
      gstTaxRate,
      manufacturer,
      supplierName,
      supplierContact,
    } = req.body;

    if (!name || !stockQuantity || isNaN(stockQuantity) || parseInt(stockQuantity) <= 0) {
      return res.status(400).json({ error: "Item name and valid stock quantity are required" });
    }

    const item = new Item({
      itemName: name,
      brand: batchNumber || "",
      amps: category || "",
      watt: strengthDosage || "",
      inchMm: composition || "",
      storageLocation: storageLocation || "",
      stock: parseInt(stockQuantity),
      expiryDate: expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      purchasePrice: parseFloat(purchasePrice) || 0,
      sellingPrice: parseFloat(sellingPrice) || 0,
      gstTax: parseFloat(gstTaxRate) || 0,
      manufacturer: manufacturer || "",
      supplier: supplierName || "",
      contact: supplierContact || "",
    });

    await item.save();

    res.status(201).json({ message: "Item added successfully", item });
  } catch (err) {
    console.error("Error adding item:", err.message);
    res.status(500).json({ error: err.message || "Failed to add item" });
  }
});

app.delete("/api/delete-item/:id", authenticateToken, async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Error deleting item:", err.message);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

app.delete("/api/delete-medicine/:id", authenticateToken, async (req, res) => {
  const itemId = req.params.id;
  console.log("Received ID:", itemId);

  try {
    const deletedItem = await Item.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    res.status(200).json({
      message: "Medicine deleted successfully",
      deletedItem: deletedItem
    });
  } catch (err) {
    console.error("Error deleting item:", err.message);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

app.put("/api/items/:id/update-stock", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (item.stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    item.stock -= quantity;
    await item.save();

    res.json({ message: "Stock updated successfully", item });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ error: "Failed to update stock" });
  }
});

app.post("/api/generate-invoice", authenticateToken, async (req, res) => {
  try {
    console.log("Received invoice generation request:", req.body);
    const {
      billId,
      customerName,
      customerPhone,
      items,
      totalAmount,
      totalGST,
      totalBill,
      paymentMethod,
      date
    } = req.body;
    console.log('Fields received:', { billId, customerName, customerPhone, items, totalAmount, totalGST, totalBill, paymentMethod });
    if (!billId || !customerName || !customerPhone || !items || !totalAmount || !totalGST || !totalBill || !paymentMethod) {
      console.error("Missing required fields:", { billId, customerName, customerPhone, items, totalAmount, totalGST, totalBill, paymentMethod });
      return res.status(400).json({ error: "Missing required fields", fields: { billId, customerName, customerPhone, items, totalAmount, totalGST, totalBill, paymentMethod } });
    }
    if (!Array.isArray(items) || items.length === 0) {
      console.error("Invalid items data:", items);
      return res.status(400).json({ error: "Invalid items data", items });
    }

    for (const item of items) {
      console.log("Processing item:", item);
      const stockItem = await Item.findById(item.itemId);
      if (!stockItem) {
        console.error("Item not found:", item.itemId);
        return res.status(404).json({ error: `Item not found: ${item.itemName}` });
      }
      console.log("Current stock:", stockItem.stock, "Requested quantity:", item.quantity);
      if (stockItem.stock < item.quantity) {
        console.error("Insufficient stock:", { 
          itemName: item.itemName, 
          available: stockItem.stock, 
          requested: item.quantity 
        });
        return res.status(400).json({ 
          error: `Insufficient stock for ${item.itemName}. Available: ${stockItem.stock}, Requested: ${item.quantity}` 
        });
      }
      stockItem.stock -= item.quantity;
      await stockItem.save();
      console.log("Stock updated for item:", item.itemName);
    }

    const invoice = new Invoice({
      billId,
      customerName,
      customerPhone,
      items,
      totalAmount,
      totalGST,
      totalBill,
      paymentMethod,
      date: date || new Date(),
      createdBy: req.user.userId
    });

    console.log("Saving invoice:", invoice);
    await invoice.save();

    res.status(200).json({
      message: "Invoice generated successfully",
      invoice
    });

  } catch (error) {
    console.error("Error in invoice generation:", error);
    res.status(500).json({ 
      error: "Failed to generate invoice",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.get("/api/invoices", authenticateToken, async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .sort({ date: -1 })
      .populate("createdBy", "name email");
    res.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
});

app.get("/api/invoice-details/:billId", async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ billId: req.params.billId });
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.json(invoice);
  } catch (err) {
    console.error("Error fetching invoice details:", err.message);
    res.status(500).json({ error: "Failed to fetch invoice details" });
  }
});

app.delete("/api/invoices/:billId", authenticateToken, async (req, res) => {
  try {
    const { billId } = req.params;

    const invoice = await Invoice.findOne({ billId });
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    await Invoice.deleteOne({ billId });

    for (const item of invoice.items) {
      await Item.updateOne(
        { _id: item.itemId },
        { $inc: { stock: item.quantity } }
      );
    }

    res.json({ message: "Invoice deleted successfully" });
  } catch (err) {
    console.error("Error deleting invoice:", err.message);
    res.status(500).json({ error: "Failed to delete invoice" });
  }
});

app.get("/api/expiry-alerts", async (req, res) => {
  try {
    const today = new Date();
    const sixtyDaysLater = new Date();
    sixtyDaysLater.setDate(today.getDate() + 60);

    const expiredItems = await Item.find({
      expiryDate: { $lt: today },
    });

    const expiringSoon = await Item.find({
      expiryDate: { $gte: today, $lte: sixtyDaysLater },
    });

    res.json({
      expired: expiredItems,
      expiringSoon: expiringSoon,
    });
  } catch (err) {
    console.error("Error fetching expiry alerts:", err.message);
    res.status(500).json({ error: "Failed to fetch expiry alerts" });
  }
});

app.post("/api/request-item", async (req, res) => {
  try {
    const {
      itemName,
      brand,
      amps,
      watt,
      inchMm,
      storageLocation,
      stock,
      expiryDate,
      purchasePrice,
      sellingPrice,
      gstTax,
      manufacturer,
      supplier,
      contact,
      email,
    } = req.body;

    if (!itemName || !stock || !brand || !amps || !watt || !supplier || !contact || !email) {
      return res.status(400).json({ error: "Item name, stock, brand, amps, watt, supplier, contact, and email are required" });
    }

    if (parseInt(stock) <= 0) {
      return res.status(400).json({ error: "Stock must be a positive number" });
    }

    const newRequest = new ItemRequest({
      itemName,
      brand,
      amps,
      watt,
      inchMm: inchMm || "",
      storageLocation: storageLocation || "",
      stock: parseInt(stock),
      expiryDate: expiryDate || null,
      purchasePrice: parseFloat(purchasePrice) || 0,
      sellingPrice: parseFloat(sellingPrice) || 0,
      gstTax: parseFloat(gstTax) || 0,
      manufacturer: manufacturer || "",
      supplier,
      contact,
      email,
      imageUrl: null,
      status: "Pending",
    });

    await newRequest.save();
    res.status(201).json({ message: "Item request submitted", request: newRequest });
  } catch (err) {
    console.error("Error requesting item:", err.message);
    res.status(500).json({ error: err.message || "Failed to request item" });
  }
});

app.get("/api/item-requests", authenticateToken, async (req, res) => {
  try {
    const requests = await ItemRequest.find();
    res.json(requests);
  } catch (err) {
    console.error("Error fetching item requests:", err.message);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

app.put("/api/approve-request/:id", authenticateToken, async (req, res) => {
  try {
    const request = await ItemRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({ error: "Request is already processed" });
    }

    request.status = "Approved";
    await request.save();

    const itemData = {
      itemName: request.itemName,
      brand: request.brand || "",
      amps: request.amps || "",
      watt: request.watt || "",
      inchMm: request.inchMm || "",
      storageLocation: request.storageLocation || "",
      stock: parseInt(request.stock),
      expiryDate: request.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      purchasePrice: parseFloat(request.purchasePrice) || 0,
      sellingPrice: parseFloat(request.sellingPrice) || 0,
      gstTax: parseFloat(request.gstTax) || 0,
      manufacturer: request.manufacturer || "",
      supplier: request.supplier || "",
      contact: request.contact || "",
      imageUrl: request.imageUrl || null,
    };

    const item = new Item(itemData);
    await item.save();

    res.status(200).json({ message: "Request approved and item added successfully", request });
  } catch (err) {
    console.error("Error approving request:", err.message);
    res.status(500).json({ error: err.message || "Failed to approve request" });
  }
});

app.put("/api/reject-request/:id", authenticateToken, async (req, res) => {
  try {
    const request = await ItemRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({ error: "Request is already processed" });
    }

    request.status = "Rejected";
    await request.save();
    res.status(200).json({ message: "Request rejected successfully", request });
  } catch (err) {
    console.error("Error rejecting request:", err.message);
    res.status(500).json({ error: err.message || "Failed to reject request" });
  }
});

app.get("/api/medicines", authenticateToken, async (req, res) => {
  try {
    const medicines = await Item.find();
    res.json(medicines);
  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.status(500).json({ error: "Failed to fetch medicines" });
  }
});

app.post("/api/medicines", authenticateToken, async (req, res) => {
  try {
    const {
      itemName,
      brand,
      amps,
      watt,
      inchMm,
      storageLocation,
      stock,
      expiryDate,
      purchasePrice,
      sellingPrice,
      gstTax,
      manufacturer,
      supplier,
      contact,
      email,
    } = req.body;

    if (!itemName || !amps || !watt || !supplier || !contact || !email || !stock) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    const newMedicine = new Item({
      itemName,
      brand,
      amps,
      watt,
      inchMm,
      storageLocation,
      stock,
      expiryDate,
      purchasePrice,
      sellingPrice,
      gstTax,
      manufacturer,
      supplier,
      contact,
      email,
      createdAt: new Date(),
    });

    await newMedicine.save();

    res.status(201).json({ message: "Medicine added successfully", data: newMedicine });
  } catch (error) {
    console.error("Error adding medicine:", error);
    res.status(500).json({ error: "Failed to add medicine" });
  }
});

app.get("/api/medicine-requests", authenticateToken, async (req, res) => {
  try {
    const requests = await ItemRequest.find();
    res.json(requests);
  } catch (error) {
    console.error("Error fetching medicine requests:", error);
    res.status(500).json({ error: "Failed to fetch medicine requests" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please free the port or choose a different one.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});