const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

async function createInitialUser() {
  try {
    await mongoose.connect("mongodb://localhost:27017/inventory");
    console.log("Connected to MongoDB");

    const adminExists = await User.findOne({ email: "admin@example.com" });
    if (adminExists) {
      console.log("Admin user already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "Admin"
    });

    await adminUser.save();
    console.log("Admin user created successfully");
    console.log("Email: admin@example.com");
    console.log("Password: admin123");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

createInitialUser();