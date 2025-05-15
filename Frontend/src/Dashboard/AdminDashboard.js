import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaPills, FaReceipt, FaPlusSquare, FaChartBar, FaClipboardCheck, FaSearch, FaTrash } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { CheckCircle, XCircle } from "lucide-react";
import "../Dashboard/AdminDashboard.css";

import { useNavigate } from "react-router-dom";
// Axios instance with default headers
const api = axios.create({
  baseURL: "https://easebilling.onrender.com/api",
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Request URL:", config.url, "Token:", token ? "Present" : "Missing");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Add response interceptor for 401/403 errors

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      alert("Session expired or unauthorized. Please log in again.");
      localStorage.removeItem("token");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("allStocks");
  const [stocks, setStocks] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [requests, setRequests] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [dailySales, setDailySales] = useState([]);
  const [totalGST, setTotalGST] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionSearch, setTransactionSearch] = useState("");
  const [newWorker, setNewWorker] = useState({
    name: "",
    email: "",
    password: "",
    role: "Cashier",
  });
  const [formData, setFormData] = useState({
    itemName: "",
    brand: "",
    amps: "",
    watt: "",
    inchMm: "",
    storageLocation: "",
    stock: "",
    expiryDate: "",
    purchasePrice: "",
    sellingPrice: "",
    gstTax: "",
    manufacturer: "",
    supplier: "",
    contact: "",
    image: null,
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting login with:", loginForm);
      const response = await api.post("/api/login", loginForm);
      console.log("Login response:", response.data);
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      setLoginError("");
      setLoginForm({ email: "", password: "" });
      alert("Login successful");
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Login failed. Please check your credentials or server status.";
      console.error("Login error:", errorMsg);
      setLoginError(errorMsg);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const processSalesData = () => {
        const salesMap = new Map();
        invoices.forEach((invoice) => {
          const date = new Date(invoice.date);
          const day = date.getDate();
          const formattedDate = `${day}`;
          if (!salesMap.has(formattedDate)) {
            salesMap.set(formattedDate, { date: formattedDate, totalSales: 0 });
          }
          salesMap.get(formattedDate).totalSales += invoice.totalBill || 0;
        });
        const sortedData = Array.from(salesMap.values()).sort((a, b) => a.date - b.date);
        setDailySales(sortedData);
      };
      processSalesData();
    }
  }, [invoices, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStocks();
      fetchWorkers();
      fetchInvoices();
      fetchRequests();
    }
  }, [isAuthenticated]);

  const fetchStocks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }
      console.log("Fetching stocks with token:", token);
      const response = await api.get("/medicines", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Fetched stocks response:", response);
      setStocks(response.data);
    } catch (error) {
      console.error("Error fetching stocks:", error.response?.data || error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.reload();
      } else {
        alert("Failed to fetch stocks. Please try again later.");
      }
    }
  };

  const fetchWorkers = async () => {
    try {
      const response = await api.get("/workers");
      setWorkers(response.data);
    } catch (error) {
      console.error("Error fetching workers:", error);
      alert("Failed to fetch workers");
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await api.get("/invoices");
      setInvoices(response.data);
      setTotalSales(response.data.reduce((sum, inv) => sum + (inv.totalBill || 0), 0));
      setTotalGST(response.data.reduce((sum, inv) => sum + (inv.totalGST || 0), 0));
    } catch (error) {
      console.error("Error fetching invoices:", error);
      alert("Failed to fetch invoices");
    }
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }
      console.log("Fetching requests with token:", token);
      const response = await api.get("/medicine-requests", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Fetched requests response:", response);
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error.response?.data || error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.reload();
      } else {
        alert("Failed to fetch requests. Please try again later.");
      }
    }
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const addMedicine = async () => {
  if (!formData.itemName || !formData.stock || parseInt(formData.stock) <= 0) {
    alert("Please fill in Item Name and a valid Stock Quantity");
    return;
  }
  try {
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.itemName); // Correct field name for item name
    formDataToSend.append("batchNumber", formData.brand); // Correct field name for brand
    formDataToSend.append("category", formData.amps); // Correct field name for amps
    formDataToSend.append("strengthDosage", formData.watt); // Correct field name for watt
    formDataToSend.append("composition", formData.inchMm); // Correct field name for inch/mm
    formDataToSend.append("storageLocation", formData.storageLocation);
    formDataToSend.append("stockQuantity", parseInt(formData.stock)); // Correct field name for stock quantity
    formDataToSend.append("expiryDate", formData.expiryDate);
    formDataToSend.append("purchasePrice", parseFloat(formData.purchasePrice) || 0);
    formDataToSend.append("sellingPrice", parseFloat(formData.sellingPrice) || 0);
    formDataToSend.append("gstTaxRate", parseFloat(formData.gstTax) || 0); // Correct field name for GST/Tax
    formDataToSend.append("manufacturer", formData.manufacturer);
    formDataToSend.append("supplierName", formData.supplier); // Correct field name for supplier
    formDataToSend.append("supplierContact", formData.contact); // Correct field name for contact
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    await api.post("/add-item", formDataToSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("Item added successfully");
    fetchStocks();
    setFormData({
      itemName: "",
      brand: "",
      amps: "",
      watt: "",
      inchMm: "",
      storageLocation: "",
      stock: "",
      expiryDate: "",
      purchasePrice: "",
      sellingPrice: "",
      gstTax: "",
      manufacturer: "",
      supplier: "",
      contact: "",
      image: null,
    });
  } catch (error) {
    console.error("Error adding item:", error.response?.data || error);
    alert(`Failed to add item: ${error.response?.data?.error || "Unknown error"}`);
  }
};

  const deleteMedicine = async (id, name) => {
  console.log("Deleting medicine with ID:", id); // Log the ID

  if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
    return;
  }

  try {
    const response = await api.delete(`/delete-medicine/${id}`);

    if (response.status === 200) {
      alert(`Medicine "${name}" deleted successfully`);
      fetchStocks(); // Refresh the stock list
    }
  } catch (error) {
    console.error("Error deleting medicine:", error.response?.data || error);
    alert(`Failed to delete medicine: ${error.response?.data?.error || "Unknown error"}`);
  }
};

  const handleApproveRequest = async (id) => {
    try {
      await api.put(`/approve-request/${id}`);
      alert("Request approved successfully");
      fetchRequests();
      fetchStocks();
    } catch (error) {
      console.error("Error approving request:", error.response?.data || error);
      alert(`Failed to approve request: ${error.response?.data?.error || "Unknown error"}`);
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      await api.put(`/reject-request/${id}`);
      alert("Request rejected successfully");
      fetchRequests();
    } catch (error) {
      console.error("Error rejecting request:", error.response?.data || error);
      alert(`Failed to reject request: ${error.response?.data?.error || "Unknown error"}`);
    }
  };

  const addWorker = async () => {
    try {
      await api.post("/worker", newWorker);
      alert("Worker added successfully");
      fetchWorkers();
      setNewWorker({ name: "", email: "", password: "", role: "Cashier" });
    } catch (error) {
      console.error("Error adding worker:", error.response?.data || error);
      alert(`Failed to add worker: ${error.response?.data?.error || "Unknown error"}`);
    }
  };

  const updateWorkerPassword = async (id, newPassword) => {
    try {
      await api.put(`/update-worker/${id}`, { newPassword });
      alert("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error.response?.data || error);
      alert(`Failed to update password: ${error.response?.data?.error || "Unknown error"}`);
    }
  };

  const deleteWorker = async (id) => {
    try {
      await api.delete(`/delete-worker/${id}`);
      alert("Worker deleted successfully");
      fetchWorkers();
    } catch (error) {
      console.error("Error deleting worker:", error.response?.data || error);
      alert(`Failed to delete worker: ${error.response?.data?.error || "Unknown error"}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              required
            />
          </div>
          {loginError && <div className="alert alert-error">{loginError}</div>}
          <button type="submit" className="btn btn-green" style={{ width: "100%" }}>
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2 className="dashboard-title">Admin Panel</h2>
        <button className={`sidebar-button ${activeTab === "allStocks" ? "active" : ""}`} onClick={() => setActiveTab("allStocks")}>
          <FaPills /> Items
        </button>
        <button className={`sidebar-button ${activeTab === "AddStock" ? "active" : ""}`} onClick={() => setActiveTab("AddStock")}>
          <FaPlusSquare /> Add Items
        </button>
        <button className={`sidebar-button ${activeTab === "manageWorkers" ? "active" : ""}`} onClick={() => setActiveTab("manageWorkers")}>
          <FaUsers /> Manage Workers
        </button>
        <button className={`sidebar-button ${activeTab === "salesOverview" ? "active" : ""}`} onClick={() => setActiveTab("salesOverview")}>
          <FaChartBar /> Sales Overview
        </button>
        <button className={`sidebar-button ${activeTab === "transactions" ? "active" : ""}`} onClick={() => setActiveTab("transactions")}>
          <FaReceipt /> Transactions
        </button>
        <button className={`sidebar-button ${activeTab === "stockRequests" ? "active" : ""}`} onClick={() => setActiveTab("stockRequests")}>
          <FaClipboardCheck /> Stock Requests
        </button>
        <button
  className="sidebar-button"
  onClick={() => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login"); // Redirect to login page
  }}
>
  Logout
</button>

      </div>

      <div className="admin-content">
        {activeTab === "allStocks" && (
          <div className="card">
            <h3>Items Inventory</h3>
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by Name, Brand, or Supplier"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              />
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Brand</th>
                    <th>Amps</th>
                    <th>Watt</th>
                    <th>inch/mm</th>
                    <th>Storage Location</th>
                    <th>Stock</th>
                    <th>Expiry Date</th>
                    <th>Purchase Price</th>
                    <th>Selling Price</th>
                    <th>GST/Tax</th>
                    <th>Manufacturer</th>
                    <th>Supplier</th>
                    <th>Contact</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks
                    .filter(
                      (item) =>
                        (item.itemName?.toLowerCase() || "").includes(searchTerm) ||
                        (item.brand?.toLowerCase() || "").includes(searchTerm) ||
                        (item.supplier?.toLowerCase() || "").includes(searchTerm)
                    )
                    .map((item) => (
                      <tr key={item._id}>
                        <td>{item.itemName}</td>
                        <td>{item.brand}</td>
                        <td>{item.amps}</td>
                        <td>{item.watt}</td>
                        <td>{item.inchMm}</td>
                        <td>{item.storageLocation}</td>
                        <td>{item.stock} units</td>
                        <td>{new Date(item.expiryDate).toLocaleDateString()}</td>
                        <td>₹{item.purchasePrice}</td>
                        <td>₹{item.sellingPrice}</td>
                        <td>{item.gstTax}%</td>
                        <td>{item.manufacturer}</td>
                        <td>{item.supplier}</td>
                        <td>{item.contact || "N/A"}</td>
                        <td>
                          <button
                            className="btn btn-red"
                            title="Remove Item"
                            onClick={() => deleteMedicine(item._id, item.itemName)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "AddStock" && (
          <div className="card">
            <h3>Add New Item</h3>
            <div className="form-group">
              <input
                type="text"
                placeholder="Item Name *"
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Amps *"
                value={formData.amps}
                onChange={(e) => setFormData({ ...formData, amps: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Watt *"
                value={formData.watt}
                onChange={(e) => setFormData({ ...formData, watt: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="inch/mm"
                value={formData.inchMm}
                onChange={(e) => setFormData({ ...formData, inchMm: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Storage Location (Rack/Shelf)"
                value={formData.storageLocation}
                onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="Stock Quantity *"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="date"
                placeholder="Expiry Date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="Purchase Price"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="Selling Price"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="GST/Tax Rate"
                value={formData.gstTax}
                onChange={(e) => setFormData({ ...formData, gstTax: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Manufacturer"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Supplier Name *"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                placeholder="Supplier Contact *"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
            </div>
            <button className="btn btn-green" onClick={addMedicine}>
              Add Item
            </button>
          </div>
        )}

        {activeTab === "manageWorkers" && (
          <div className="card">
            <h3>Manage Workers</h3>
            <div className="worker-form">
              <input
                type="text"
                placeholder="Name"
                value={newWorker.name}
                onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={newWorker.email}
                onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                value={newWorker.password}
                onChange={(e) => setNewWorker({ ...newWorker, password: e.target.value })}
              />
             <div className="worker-form div">
  <select
    value={newWorker.role}
    onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value })}
  >
    <option value="Cashier">Cashier</option>
    <option value="Labour">Labour</option>
  </select>
</div>
              <button className="btn btn-green" onClick={addWorker}>
                Add Worker
              </button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((worker) => (
                    <tr key={worker._id}>
                      <td>{worker.name}</td>
                      <td>{worker.email}</td>
                      <td>{worker.role}</td>
                      <td>
                        <button
                          className="btn btn-blue"
                          onClick={() => {
                            const newPassword = prompt("Enter new password:");
                            if (newPassword) updateWorkerPassword(worker._id, newPassword);
                          }}
                        >
                          Update Password
                        </button>
                        <button className="btn btn-red" onClick={() => deleteWorker(worker._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "salesOverview" && (
          <div className="card">
            <h3>Sales Overview</h3>
            <div className="sales-stats">
              <div className="stat-card">
                <h4>Total Sales</h4>
                <p>₹{totalSales.toFixed(2)}</p>
              </div>
              <div className="stat-card">
                <h4>Total GST Collected</h4>
                <p>₹{totalGST.toFixed(2)}</p>
              </div>
            </div>
            <h4>Daily Sales</h4>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalSales" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="card">
            <h3>Transactions</h3>
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by Bill ID or Customer Name"
                value={transactionSearch}
                onChange={(e) => setTransactionSearch(e.target.value.toLowerCase())}
              />
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Bill ID</th>
                    <th>Customer Name</th>
                    <th>Phone</th>
                    <th>Total Bill</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices
                    .filter(
                      (inv) =>
                        inv.billId.toLowerCase().includes(transactionSearch) ||
                        inv.customerName.toLowerCase().includes(transactionSearch)
                    )
                    .map((inv) => (
                      <tr key={inv._id}>
                        <td>{inv.billId}</td>
                        <td>{inv.customerName}</td>
                        <td>{inv.customerPhone}</td>
                        <td>₹{inv.totalBill}</td>
                        <td>{new Date(inv.date).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="btn btn-blue"
                            onClick={() => setSelectedTransaction(inv)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {selectedTransaction && (
              <div className="transaction-details-modal">
                <div className="modal-content">
                  <h2>Transaction Details</h2>
                  <div className="transaction-info">
                    <p><strong>Bill ID:</strong> {selectedTransaction.billId}</p>
                    <p><strong>Date:</strong> {new Date(selectedTransaction.date).toLocaleString()}</p>
                    <p><strong>Customer Name:</strong> {selectedTransaction.customerName}</p>
                    <p><strong>Phone:</strong> {selectedTransaction.customerPhone}</p>
                    <p><strong>Payment Method:</strong> {selectedTransaction.paymentMethod}</p>
                  </div>
                  
                  <div className="items-section">
                    <h3>Items Purchased</h3>
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>Item Name</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>GST</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedTransaction.items && selectedTransaction.items.map((item, index) => (
                          <tr key={index}>
                            <td>{item.itemName}</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.sellingPrice}</td>
                            <td>{item.gstTax}%</td>
                            <td>₹{(item.sellingPrice * item.quantity * (1 + item.gstTax/100)).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bill-summary">
                    <p><strong>Subtotal:</strong> ₹{selectedTransaction.totalAmount}</p>
                    <p><strong>GST Amount:</strong> ₹{selectedTransaction.totalGST}</p>
                    <p><strong>Total Bill:</strong> ₹{selectedTransaction.totalBill}</p>
                  </div>

                  <button
                    className="btn btn-red"
                    onClick={() => setSelectedTransaction(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "stockRequests" && (
          <div className="card">
            <h3>Stock Requests</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Item Name</th>
                    <th>Brand</th>
                    <th>Quantity</th>
                    <th>Supplier Name</th>
                    <th>Supplier Contact</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req._id}>
                      <td>{new Date(req.date).toLocaleDateString()}</td>
                      <td>{req.medicineName}</td>
                      <td>{req.batchNumber}</td>
                      <td>{req.quantity} units</td>
                      <td>{req.supplier}</td>
                      <td>{req.supplierContact || "N/A"}</td>
                      <td>{req.status}</td>
                      <td>
                        {req.status === "Pending" && (
                          <>
                            <button
                              className="btn btn-green"
                              onClick={() => handleApproveRequest(req._id)}
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              className="btn btn-red"
                              onClick={() => handleRejectRequest(req._id)}
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;