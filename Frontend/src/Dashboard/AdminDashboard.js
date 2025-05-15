// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaUsers, FaPills, FaReceipt, FaPlusSquare, FaChartBar, FaClipboardCheck, FaSearch, FaTrash } from "react-icons/fa";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
// import { CheckCircle, XCircle } from "lucide-react";
// import "../Dashboard/AdminDashboard.css";

// import { useNavigate } from "react-router-dom";
// // Axios instance with default headers
// const api = axios.create({
//   baseURL: "https://easebilling.onrender.com/api",
// });

// // Add request interceptor to include token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   console.log("Request URL:", config.url, "Token:", token ? "Present" : "Missing");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => Promise.reject(error));

// // Add response interceptor for 401/403 errors

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("API Error:", error.response?.data || error.message);
//     if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//       alert("Session expired or unauthorized. Please log in again.");
//       localStorage.removeItem("token");
//       window.location.reload();
//     }
//     return Promise.reject(error);
//   }
// );

// const AdminDashboard = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
//   const navigate = useNavigate();
//   const [loginForm, setLoginForm] = useState({ email: "", password: "" });
//   const [loginError, setLoginError] = useState("");
//   const [activeTab, setActiveTab] = useState("allStocks");
//   const [stocks, setStocks] = useState([]);
//   const [workers, setWorkers] = useState([]);
//   const [invoices, setInvoices] = useState([]);
//   const [requests, setRequests] = useState([]);
//   const [totalSales, setTotalSales] = useState(0);
//   const [dailySales, setDailySales] = useState([]);
//   const [totalGST, setTotalGST] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedTransaction, setSelectedTransaction] = useState(null);
//   const [transactionSearch, setTransactionSearch] = useState("");
//   const [newWorker, setNewWorker] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "Cashier",
//   });
//   const [formData, setFormData] = useState({
//     itemName: "",
//     brand: "",
//     amps: "",
//     watt: "",
//     inchMm: "",
//     storageLocation: "",
//     stock: "",
//     expiryDate: "",
//     purchasePrice: "",
//     sellingPrice: "",
//     gstTax: "",
//     manufacturer: "",
//     supplier: "",
//     contact: "",
//     image: null,
//   });

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       console.log("Attempting login with:", loginForm);
//       const response = await api.post("/api/login", loginForm);
//       console.log("Login response:", response.data);
//       localStorage.setItem("token", response.data.token);
//       setIsAuthenticated(true);
//       setLoginError("");
//       setLoginForm({ email: "", password: "" });
//       alert("Login successful");
//     } catch (error) {
//       const errorMsg = error.response?.data?.error || "Login failed. Please check your credentials or server status.";
//       console.error("Login error:", errorMsg);
//       setLoginError(errorMsg);
//     }
//   };

//   useEffect(() => {
//     if (isAuthenticated) {
//       const processSalesData = () => {
//         const salesMap = new Map();
//         invoices.forEach((invoice) => {
//           const date = new Date(invoice.date);
//           const day = date.getDate();
//           const formattedDate = `${day}`;
//           if (!salesMap.has(formattedDate)) {
//             salesMap.set(formattedDate, { date: formattedDate, totalSales: 0 });
//           }
//           salesMap.get(formattedDate).totalSales += invoice.totalBill || 0;
//         });
//         const sortedData = Array.from(salesMap.values()).sort((a, b) => a.date - b.date);
//         setDailySales(sortedData);
//       };
//       processSalesData();
//     }
//   }, [invoices, isAuthenticated]);

//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchStocks();
//       fetchWorkers();
//       fetchInvoices();
//       fetchRequests();
//     }
//   }, [isAuthenticated]);

//   const fetchStocks = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("No authentication token found");
//         return;
//       }
//       console.log("Fetching stocks with token:", token);
//       const response = await api.get("/medicines", {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       console.log("Fetched stocks response:", response);
//       setStocks(response.data);
//     } catch (error) {
//       console.error("Error fetching stocks:", error.response?.data || error);
//       if (error.response?.status === 401) {
//         alert("Session expired. Please log in again.");
//         localStorage.removeItem("token");
//         window.location.reload();
//       } else {
//         alert("Failed to fetch stocks. Please try again later.");
//       }
//     }
//   };

//   const fetchWorkers = async () => {
//     try {
//       const response = await api.get("/workers");
//       setWorkers(response.data);
//     } catch (error) {
//       console.error("Error fetching workers:", error);
//       alert("Failed to fetch workers");
//     }
//   };

//   const fetchInvoices = async () => {
//     try {
//       const response = await api.get("/invoices");
//       setInvoices(response.data);
//       setTotalSales(response.data.reduce((sum, inv) => sum + (inv.totalBill || 0), 0));
//       setTotalGST(response.data.reduce((sum, inv) => sum + (inv.totalGST || 0), 0));
//     } catch (error) {
//       console.error("Error fetching invoices:", error);
//       alert("Failed to fetch invoices");
//     }
//   };

//   const fetchRequests = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("No authentication token found");
//         return;
//       }
//       console.log("Fetching requests with token:", token);
//       const response = await api.get("/medicine-requests", {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       console.log("Fetched requests response:", response);
//       setRequests(response.data);
//     } catch (error) {
//       console.error("Error fetching requests:", error.response?.data || error);
//       if (error.response?.status === 401) {
//         alert("Session expired. Please log in again.");
//         localStorage.removeItem("token");
//         window.location.reload();
//       } else {
//         alert("Failed to fetch requests. Please try again later.");
//       }
//     }
//   };

//   const handleImageChange = (e) => {
//     setFormData({ ...formData, image: e.target.files[0] });
//   };

//   const addMedicine = async () => {
//   if (!formData.itemName || !formData.stock || parseInt(formData.stock) <= 0) {
//     alert("Please fill in Item Name and a valid Stock Quantity");
//     return;
//   }
//   try {
//     const formDataToSend = new FormData();
//     formDataToSend.append("name", formData.itemName); // Correct field name for item name
//     formDataToSend.append("batchNumber", formData.brand); // Correct field name for brand
//     formDataToSend.append("category", formData.amps); // Correct field name for amps
//     formDataToSend.append("strengthDosage", formData.watt); // Correct field name for watt
//     formDataToSend.append("composition", formData.inchMm); // Correct field name for inch/mm
//     formDataToSend.append("storageLocation", formData.storageLocation);
//     formDataToSend.append("stockQuantity", parseInt(formData.stock)); // Correct field name for stock quantity
//     formDataToSend.append("expiryDate", formData.expiryDate);
//     formDataToSend.append("purchasePrice", parseFloat(formData.purchasePrice) || 0);
//     formDataToSend.append("sellingPrice", parseFloat(formData.sellingPrice) || 0);
//     formDataToSend.append("gstTaxRate", parseFloat(formData.gstTax) || 0); // Correct field name for GST/Tax
//     formDataToSend.append("manufacturer", formData.manufacturer);
//     formDataToSend.append("supplierName", formData.supplier); // Correct field name for supplier
//     formDataToSend.append("supplierContact", formData.contact); // Correct field name for contact
//     if (formData.image) {
//       formDataToSend.append("image", formData.image);
//     }

//     await api.post("/add-item", formDataToSend, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     alert("Item added successfully");
//     fetchStocks();
//     setFormData({
//       itemName: "",
//       brand: "",
//       amps: "",
//       watt: "",
//       inchMm: "",
//       storageLocation: "",
//       stock: "",
//       expiryDate: "",
//       purchasePrice: "",
//       sellingPrice: "",
//       gstTax: "",
//       manufacturer: "",
//       supplier: "",
//       contact: "",
//       image: null,
//     });
//   } catch (error) {
//     console.error("Error adding item:", error.response?.data || error);
//     alert(`Failed to add item: ${error.response?.data?.error || "Unknown error"}`);
//   }
// };

//   const deleteMedicine = async (id, name) => {
//   console.log("Deleting medicine with ID:", id); // Log the ID

//   if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
//     return;
//   }

//   try {
//     const response = await api.delete(`/delete-medicine/${id}`);

//     if (response.status === 200) {
//       alert(`Medicine "${name}" deleted successfully`);
//       fetchStocks(); // Refresh the stock list
//     }
//   } catch (error) {
//     console.error("Error deleting medicine:", error.response?.data || error);
//     alert(`Failed to delete medicine: ${error.response?.data?.error || "Unknown error"}`);
//   }
// };

//   const handleApproveRequest = async (id) => {
//     try {
//       await api.put(`/approve-request/${id}`);
//       alert("Request approved successfully");
//       fetchRequests();
//       fetchStocks();
//     } catch (error) {
//       console.error("Error approving request:", error.response?.data || error);
//       alert(`Failed to approve request: ${error.response?.data?.error || "Unknown error"}`);
//     }
//   };

//   const handleRejectRequest = async (id) => {
//     try {
//       await api.put(`/reject-request/${id}`);
//       alert("Request rejected successfully");
//       fetchRequests();
//     } catch (error) {
//       console.error("Error rejecting request:", error.response?.data || error);
//       alert(`Failed to reject request: ${error.response?.data?.error || "Unknown error"}`);
//     }
//   };

//   const addWorker = async () => {
//     try {
//       await api.post("/worker", newWorker);
//       alert("Worker added successfully");
//       fetchWorkers();
//       setNewWorker({ name: "", email: "", password: "", role: "Cashier" });
//     } catch (error) {
//       console.error("Error adding worker:", error.response?.data || error);
//       alert(`Failed to add worker: ${error.response?.data?.error || "Unknown error"}`);
//     }
//   };

//   const updateWorkerPassword = async (id, newPassword) => {
//     try {
//       await api.put(`/update-worker/${id}`, { newPassword });
//       alert("Password updated successfully");
//     } catch (error) {
//       console.error("Error updating password:", error.response?.data || error);
//       alert(`Failed to update password: ${error.response?.data?.error || "Unknown error"}`);
//     }
//   };

//   const deleteWorker = async (id) => {
//     try {
//       await api.delete(`/delete-worker/${id}`);
//       alert("Worker deleted successfully");
//       fetchWorkers();
//     } catch (error) {
//       console.error("Error deleting worker:", error.response?.data || error);
//       alert(`Failed to delete worker: ${error.response?.data?.error || "Unknown error"}`);
//     }
//   };

//   if (!isAuthenticated) {
//     return (
//       <div className="login-container">
//         <h2>Admin Login</h2>
//         <form onSubmit={handleLogin}>
//           <div className="form-group">
//             <label>Email</label>
//             <input
//               type="email"
//               value={loginForm.email}
//               onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label>Password</label>
//             <input
//               type="password"
//               value={loginForm.password}
//               onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
//               required
//             />
//           </div>
//           {loginError && <div className="alert alert-error">{loginError}</div>}
//           <button type="submit" className="btn btn-green" style={{ width: "100%" }}>
//             Login
//           </button>
//         </form>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-container">
//       <div className="sidebar">
//         <h2 className="dashboard-title">Admin Panel</h2>
//         <button className={`sidebar-button ${activeTab === "allStocks" ? "active" : ""}`} onClick={() => setActiveTab("allStocks")}>
//           <FaPills /> Items
//         </button>
//         <button className={`sidebar-button ${activeTab === "AddStock" ? "active" : ""}`} onClick={() => setActiveTab("AddStock")}>
//           <FaPlusSquare /> Add Items
//         </button>
//         <button className={`sidebar-button ${activeTab === "manageWorkers" ? "active" : ""}`} onClick={() => setActiveTab("manageWorkers")}>
//           <FaUsers /> Manage Workers
//         </button>
//         <button className={`sidebar-button ${activeTab === "salesOverview" ? "active" : ""}`} onClick={() => setActiveTab("salesOverview")}>
//           <FaChartBar /> Sales Overview
//         </button>
//         <button className={`sidebar-button ${activeTab === "transactions" ? "active" : ""}`} onClick={() => setActiveTab("transactions")}>
//           <FaReceipt /> Transactions
//         </button>
//         <button className={`sidebar-button ${activeTab === "stockRequests" ? "active" : ""}`} onClick={() => setActiveTab("stockRequests")}>
//           <FaClipboardCheck /> Stock Requests
//         </button>
//         <button
//   className="sidebar-button"
//   onClick={() => {
//     localStorage.removeItem("token");
//     setIsAuthenticated(false);
//     navigate("/login"); // Redirect to login page
//   }}
// >
//   Logout
// </button>

//       </div>

//       <div className="admin-content">
//         {activeTab === "allStocks" && (
//           <div className="card">
//             <h3>Items Inventory</h3>
//             <div className="search-box">
//               <FaSearch className="search-icon" />
//               <input
//                 type="text"
//                 placeholder="Search by Name, Brand, or Supplier"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
//               />
//             </div>
//             <div className="table-wrapper">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Item Name</th>
//                     <th>Brand</th>
//                     <th>Amps</th>
//                     <th>Watt</th>
//                     <th>inch/mm</th>
//                     <th>Storage Location</th>
//                     <th>Stock</th>
//                     <th>Expiry Date</th>
//                     <th>Purchase Price</th>
//                     <th>Selling Price</th>
//                     <th>GST/Tax</th>
//                     <th>Manufacturer</th>
//                     <th>Supplier</th>
//                     <th>Contact</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {stocks
//                     .filter(
//                       (item) =>
//                         (item.itemName?.toLowerCase() || "").includes(searchTerm) ||
//                         (item.brand?.toLowerCase() || "").includes(searchTerm) ||
//                         (item.supplier?.toLowerCase() || "").includes(searchTerm)
//                     )
//                     .map((item) => (
//                       <tr key={item._id}>
//                         <td>{item.itemName}</td>
//                         <td>{item.brand}</td>
//                         <td>{item.amps}</td>
//                         <td>{item.watt}</td>
//                         <td>{item.inchMm}</td>
//                         <td>{item.storageLocation}</td>
//                         <td>{item.stock} units</td>
//                         <td>{new Date(item.expiryDate).toLocaleDateString()}</td>
//                         <td>₹{item.purchasePrice}</td>
//                         <td>₹{item.sellingPrice}</td>
//                         <td>{item.gstTax}%</td>
//                         <td>{item.manufacturer}</td>
//                         <td>{item.supplier}</td>
//                         <td>{item.contact || "N/A"}</td>
//                         <td>
//                           <button
//                             className="btn btn-red"
//                             title="Remove Item"
//                             onClick={() => deleteMedicine(item._id, item.itemName)}
//                           >
//                             <FaTrash />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {activeTab === "AddStock" && (
//           <div className="card">
//             <h3>Add New Item</h3>
//             <div className="form-group">
//               <input
//                 type="text"
//                 placeholder="Item Name *"
//                 value={formData.itemName}
//                 onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="text"
//                 placeholder="Brand"
//                 value={formData.brand}
//                 onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="text"
//                 placeholder="Amps *"
//                 value={formData.amps}
//                 onChange={(e) => setFormData({ ...formData, amps: e.target.value })}
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="text"
//                 placeholder="Watt *"
//                 value={formData.watt}
//                 onChange={(e) => setFormData({ ...formData, watt: e.target.value })}
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="text"
//                 placeholder="inch/mm"
//                 value={formData.inchMm}
//                 onChange={(e) => setFormData({ ...formData, inchMm: e.target.value })}
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="text"
//                 placeholder="Storage Location (Rack/Shelf)"
//                 value={formData.storageLocation}
//                 onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="number"
//                 placeholder="Stock Quantity *"
//                 value={formData.stock}
//                 onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="date"
//                 placeholder="Expiry Date"
//                 value={formData.expiryDate}
//                 onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="number"
//                 placeholder="Purchase Price"
//                 value={formData.purchasePrice}
//                 onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="number"
//                 placeholder="Selling Price"
//                 value={formData.sellingPrice}
//                 onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="number"
//                 placeholder="GST/Tax Rate"
//                 value={formData.gstTax}
//                 onChange={(e) => setFormData({ ...formData, gstTax: e.target.value })}
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="text"
//                 placeholder="Manufacturer"
//                 value={formData.manufacturer}
//                 onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="text"
//                 placeholder="Supplier Name *"
//                 value={formData.supplier}
//                 onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="tel"
//                 placeholder="Supplier Contact *"
//                 value={formData.contact}
//                 onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
//               />
//             </div>
//             <button className="btn btn-green" onClick={addMedicine}>
//               Add Item
//             </button>
//           </div>
//         )}

//         {activeTab === "manageWorkers" && (
//           <div className="card">
//             <h3>Manage Workers</h3>
//             <div className="worker-form">
//               <input
//                 type="text"
//                 placeholder="Name"
//                 value={newWorker.name}
//                 onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
//               />
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={newWorker.email}
//                 onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })}
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={newWorker.password}
//                 onChange={(e) => setNewWorker({ ...newWorker, password: e.target.value })}
//               />
//              <div className="worker-form div">
//   <select
//     value={newWorker.role}
//     onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value })}
//   >
//     <option value="Cashier">Cashier</option>
//     <option value="Labour">Labour</option>
//   </select>
// </div>
//               <button className="btn btn-green" onClick={addWorker}>
//                 Add Worker
//               </button>
//             </div>
//             <div className="table-wrapper">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Role</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {workers.map((worker) => (
//                     <tr key={worker._id}>
//                       <td>{worker.name}</td>
//                       <td>{worker.email}</td>
//                       <td>{worker.role}</td>
//                       <td>
//                         <button
//                           className="btn btn-blue"
//                           onClick={() => {
//                             const newPassword = prompt("Enter new password:");
//                             if (newPassword) updateWorkerPassword(worker._id, newPassword);
//                           }}
//                         >
//                           Update Password
//                         </button>
//                         <button className="btn btn-red" onClick={() => deleteWorker(worker._id)}>
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {activeTab === "salesOverview" && (
//           <div className="card">
//             <h3>Sales Overview</h3>
//             <div className="sales-stats">
//               <div className="stat-card">
//                 <h4>Total Sales</h4>
//                 <p>₹{totalSales.toFixed(2)}</p>
//               </div>
//               <div className="stat-card">
//                 <h4>Total GST Collected</h4>
//                 <p>₹{totalGST.toFixed(2)}</p>
//               </div>
//             </div>
//             <h4>Daily Sales</h4>
//             <div className="chart-container">
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={dailySales}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="totalSales" fill="#8884d8" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         )}

//         {activeTab === "transactions" && (
//           <div className="card">
//             <h3>Transactions</h3>
//             <div className="search-box">
//               <FaSearch className="search-icon" />
//               <input
//                 type="text"
//                 placeholder="Search by Bill ID or Customer Name"
//                 value={transactionSearch}
//                 onChange={(e) => setTransactionSearch(e.target.value.toLowerCase())}
//               />
//             </div>
//             <div className="table-wrapper">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Bill ID</th>
//                     <th>Customer Name</th>
//                     <th>Phone</th>
//                     <th>Total Bill</th>
//                     <th>Date</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {invoices
//                     .filter(
//                       (inv) =>
//                         inv.billId.toLowerCase().includes(transactionSearch) ||
//                         inv.customerName.toLowerCase().includes(transactionSearch)
//                     )
//                     .map((inv) => (
//                       <tr key={inv._id}>
//                         <td>{inv.billId}</td>
//                         <td>{inv.customerName}</td>
//                         <td>{inv.customerPhone}</td>
//                         <td>₹{inv.totalBill}</td>
//                         <td>{new Date(inv.date).toLocaleDateString()}</td>
//                         <td>
//                           <button
//                             className="btn btn-blue"
//                             onClick={() => setSelectedTransaction(inv)}
//                           >
//                             View
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>
//             {selectedTransaction && (
//               <div className="transaction-details-modal">
//                 <div className="modal-content">
//                   <h2>Transaction Details</h2>
//                   <div className="transaction-info">
//                     <p><strong>Bill ID:</strong> {selectedTransaction.billId}</p>
//                     <p><strong>Date:</strong> {new Date(selectedTransaction.date).toLocaleString()}</p>
//                     <p><strong>Customer Name:</strong> {selectedTransaction.customerName}</p>
//                     <p><strong>Phone:</strong> {selectedTransaction.customerPhone}</p>
//                     <p><strong>Payment Method:</strong> {selectedTransaction.paymentMethod}</p>
//                   </div>
                  
//                   <div className="items-section">
//                     <h3>Items Purchased</h3>
//                     <table className="items-table">
//                       <thead>
//                         <tr>
//                           <th>Item Name</th>
//                           <th>Quantity</th>
//                           <th>Price</th>
//                           <th>GST</th>
//                           <th>Total</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {selectedTransaction.items && selectedTransaction.items.map((item, index) => (
//                           <tr key={index}>
//                             <td>{item.itemName}</td>
//                             <td>{item.quantity}</td>
//                             <td>₹{item.sellingPrice}</td>
//                             <td>{item.gstTax}%</td>
//                             <td>₹{(item.sellingPrice * item.quantity * (1 + item.gstTax/100)).toFixed(2)}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>

//                   <div className="bill-summary">
//                     <p><strong>Subtotal:</strong> ₹{selectedTransaction.totalAmount}</p>
//                     <p><strong>GST Amount:</strong> ₹{selectedTransaction.totalGST}</p>
//                     <p><strong>Total Bill:</strong> ₹{selectedTransaction.totalBill}</p>
//                   </div>

//                   <button
//                     className="btn btn-red"
//                     onClick={() => setSelectedTransaction(null)}
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === "stockRequests" && (
//           <div className="card">
//             <h3>Stock Requests</h3>
//             <div className="table-wrapper">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Date</th>
//                     <th>Item Name</th>
//                     <th>Brand</th>
//                     <th>Quantity</th>
//                     <th>Supplier Name</th>
//                     <th>Supplier Contact</th>
//                     <th>Status</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {requests.map((req) => (
//                     <tr key={req._id}>
//                       <td>{new Date(req.date).toLocaleDateString()}</td>
//                       <td>{req.medicineName}</td>
//                       <td>{req.batchNumber}</td>
//                       <td>{req.quantity} units</td>
//                       <td>{req.supplier}</td>
//                       <td>{req.supplierContact || "N/A"}</td>
//                       <td>{req.status}</td>
//                       <td>
//                         {req.status === "Pending" && (
//                           <>
//                             <button
//                               className="btn btn-green"
//                               onClick={() => handleApproveRequest(req._id)}
//                             >
//                               <CheckCircle size={16} />
//                             </button>
//                             <button
//                               className="btn btn-red"
//                               onClick={() => handleRejectRequest(req._id)}
//                             >
//                               <XCircle size={16} />
//                             </button>
//                           </>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;




































// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Users, Receipt, PlusSquare, BarChart2, ClipboardCheck, Search, Trash2, CheckCircle, XCircle, LogOut, DollarSign, CreditCard, Package, X } from 'lucide-react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
// import { motion, AnimatePresence } from "framer-motion";
// import "./AdminDashboard.css";

// // Axios instance with default headers
// const api = axios.create({
//   baseURL: "https://easebilling.onrender.com/api",
// });

// // Add request interceptor to include token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Add response interceptor for 401/403 errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//       localStorage.removeItem("token");
//       window.location.reload();
//     }
//     return Promise.reject(error);
//   }
// );

// const AdminDashboard = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
//   const navigate = (path) => {
//     window.location.href = path;
//   };
  
//   const [loginForm, setLoginForm] = useState({ email: "", password: "" });
//   const [loginError, setLoginError] = useState("");
//   const [activeTab, setActiveTab] = useState("allStocks");
//   const [stocks, setStocks] = useState([]);
//   const [workers, setWorkers] = useState([]);
//   const [invoices, setInvoices] = useState([]);
//   const [requests, setRequests] = useState([]);
//   const [totalSales, setTotalSales] = useState(0);
//   const [dailySales, setDailySales] = useState([]);
//   const [totalGST, setTotalGST] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedTransaction, setSelectedTransaction] = useState(null);
//   const [transactionSearch, setTransactionSearch] = useState("");
//   const [newWorker, setNewWorker] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "Cashier",
//   });
//   const [formData, setFormData] = useState({
//     itemName: "",
//     brand: "",
//     amps: "",
//     watt: "",
//     inchMm: "",
//     storageLocation: "",
//     stock: "",
//     expiryDate: "",
//     purchasePrice: "",
//     sellingPrice: "",
//     gstTax: "",
//     manufacturer: "",
//     supplier: "",
//     contact: "",
//     image: null,
//   });

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await api.post("/api/login", loginForm);
//       localStorage.setItem("token", response.data.token);
//       setIsAuthenticated(true);
//       setLoginError("");
//       setLoginForm({ email: "", password: "" });
//     } catch (error) {
//       const errorMsg = error.response?.data?.error || "Login failed. Please check your credentials or server status.";
//       setLoginError(errorMsg);
//     }
//   };

//   useEffect(() => {
//     if (isAuthenticated) {
//       const processSalesData = () => {
//         const salesMap = new Map();
//         invoices.forEach((invoice) => {
//           const date = new Date(invoice.date);
//           const day = date.getDate();
//           const formattedDate = `${day}`;
//           if (!salesMap.has(formattedDate)) {
//             salesMap.set(formattedDate, { date: formattedDate, totalSales: 0 });
//           }
//           salesMap.get(formattedDate).totalSales += invoice.totalBill || 0;
//         });
//         const sortedData = Array.from(salesMap.values()).sort((a, b) => a.date - b.date);
//         setDailySales(sortedData);
//       };
//       processSalesData();
//     }
//   }, [invoices, isAuthenticated]);

//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchStocks();
//       fetchWorkers();
//       fetchInvoices();
//       fetchRequests();
//     }
//   }, [isAuthenticated]);

//   const fetchStocks = async () => {
//     try {
//       const response = await api.get("/medicines");
//       setStocks(response.data);
//     } catch (error) {
//       console.error("Error fetching stocks:", error.response?.data || error);
//     }
//   };

//   const fetchWorkers = async () => {
//     try {
//       const response = await api.get("/workers");
//       setWorkers(response.data);
//     } catch (error) {
//       console.error("Error fetching workers:", error);
//     }
//   };

//   const fetchInvoices = async () => {
//     try {
//       const response = await api.get("/invoices");
//       setInvoices(response.data);
//       setTotalSales(response.data.reduce((sum, inv) => sum + (inv.totalBill || 0), 0));
//       setTotalGST(response.data.reduce((sum, inv) => sum + (inv.totalGST || 0), 0));
//     } catch (error) {
//       console.error("Error fetching invoices:", error);
//     }
//   };

//   const fetchRequests = async () => {
//     try {
//       const response = await api.get("/medicine-requests");
//       setRequests(response.data);
//     } catch (error) {
//       console.error("Error fetching requests:", error.response?.data || error);
//     }
//   };

//   const handleImageChange = (e) => {
//     setFormData({ ...formData, image: e.target.files[0] });
//   };

//   const addMedicine = async () => {
//     if (!formData.itemName || !formData.stock || parseInt(formData.stock) <= 0) {
//       alert("Please fill in Item Name and a valid Stock Quantity");
//       return;
//     }
//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append("name", formData.itemName);
//       formDataToSend.append("batchNumber", formData.brand);
//       formDataToSend.append("category", formData.amps);
//       formDataToSend.append("strengthDosage", formData.watt);
//       formDataToSend.append("composition", formData.inchMm);
//       formDataToSend.append("storageLocation", formData.storageLocation);
//       formDataToSend.append("stockQuantity", parseInt(formData.stock));
//       formDataToSend.append("expiryDate", formData.expiryDate);
//       formDataToSend.append("purchasePrice", parseFloat(formData.purchasePrice) || 0);
//       formDataToSend.append("sellingPrice", parseFloat(formData.sellingPrice) || 0);
//       formDataToSend.append("gstTaxRate", parseFloat(formData.gstTax) || 0);
//       formDataToSend.append("manufacturer", formData.manufacturer);
//       formDataToSend.append("supplierName", formData.supplier);
//       formDataToSend.append("supplierContact", formData.contact);
//       if (formData.image) {
//         formDataToSend.append("image", formData.image);
//       }

//       await api.post("/add-item", formDataToSend, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert("Item added successfully");
//       fetchStocks();
//       setFormData({
//         itemName: "",
//         brand: "",
//         amps: "",
//         watt: "",
//         inchMm: "",
//         storageLocation: "",
//         stock: "",
//         expiryDate: "",
//         purchasePrice: "",
//         sellingPrice: "",
//         gstTax: "",
//         manufacturer: "",
//         supplier: "",
//         contact: "",
//         image: null,
//       });
//     } catch (error) {
//       console.error("Error adding item:", error.response?.data || error);
//       alert(`Failed to add item: ${error.response?.data?.error || "Unknown error"}`);
//     }
//   };

//   const deleteMedicine = async (id, name) => {
//     if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
//       return;
//     }

//     try {
//       const response = await api.delete(`/delete-medicine/${id}`);
//       if (response.status === 200) {
//         alert(`Medicine "${name}" deleted successfully`);
//         fetchStocks();
//       }
//     } catch (error) {
//       console.error("Error deleting medicine:", error.response?.data || error);
//       alert(`Failed to delete medicine: ${error.response?.data?.error || "Unknown error"}`);
//     }
//   };

//   const handleApproveRequest = async (id) => {
//     try {
//       await api.put(`/approve-request/${id}`);
//       alert("Request approved successfully");
//       fetchRequests();
//       fetchStocks();
//     } catch (error) {
//       console.error("Error approving request:", error.response?.data || error);
//       alert(`Failed to approve request: ${error.response?.data?.error || "Unknown error"}`);
//     }
//   };

//   const handleRejectRequest = async (id) => {
//     try {
//       await api.put(`/reject-request/${id}`);
//       alert("Request rejected successfully");
//       fetchRequests();
//     } catch (error) {
//       console.error("Error rejecting request:", error.response?.data || error);
//       alert(`Failed to reject request: ${error.response?.data?.error || "Unknown error"}`);
//     }
//   };

//   const addWorker = async () => {
//     try {
//       await api.post("/worker", newWorker);
//       alert("Worker added successfully");
//       fetchWorkers();
//       setNewWorker({ name: "", email: "", password: "", role: "Cashier" });
//     } catch (error) {
//       console.error("Error adding worker:", error.response?.data || error);
//       alert(`Failed to add worker: ${error.response?.data?.error || "Unknown error"}`);
//     }
//   };

//   const updateWorkerPassword = async (id, newPassword) => {
//     try {
//       await api.put(`/update-worker/${id}`, { newPassword });
//       alert("Password updated successfully");
//     } catch (error) {
//       console.error("Error updating password:", error.response?.data || error);
//       alert(`Failed to update password: ${error.response?.data?.error || "Unknown error"}`);
//     }
//   };

//   const deleteWorker = async (id) => {
//     try {
//       await api.delete(`/delete-worker/${id}`);
//       alert("Worker deleted successfully");
//       fetchWorkers();
//     } catch (error) {
//       console.error("Error deleting worker:", error.response?.data || error);
//       alert(`Failed to delete worker: ${error.response?.data?.error || "Unknown error"}`);
//     }
//   };

//   // Component for sidebar buttons
//   const SidebarButton = ({ icon, label, active, onClick }) => (
//     <motion.button
//       whileHover={{ x: 4 }}
//       whileTap={{ scale: 0.95 }}
//       onClick={onClick}
//       className={`sidebar-button ${active ? "active" : ""}`}
//     >
//       <span className="sidebar-icon">{icon}</span>
//       {label}
//     </motion.button>
//   );

//   // Component for page headers
//   const PageHeader = ({ title, icon }) => (
//     <div className="page-header">
//       <div className="page-header-icon">{icon}</div>
//       <h1 className="page-title">{title}</h1>
//     </div>
//   );

//   // Component for form inputs
//   const FormInput = ({ type = "text", placeholder, value, onChange }) => (
//     <input
//       type={type}
//       placeholder={placeholder}
//       value={value}
//       onChange={onChange}
//       className="form-input"
//     />
//   );

//   // Component for table headers
//   const TableHeader = ({ children }) => (
//     <th className="table-header">{children}</th>
//   );

//   // Component for table cells
//   const TableCell = ({ children }) => (
//     <td className="table-cell">{children}</td>
//   );

//   // Component for tab content with animation
//   const TabContent = ({ children }) => (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       transition={{ duration: 0.3 }}
//       className="tab-content"
//     >
//       {children}
//     </motion.div>
//   );

//   // Component for status badges
//   const StatusBadge = ({ status }) => {
//     let className = "status-badge";

//     switch (status) {
//       case "Approved":
//         className += " approved";
//         break;
//       case "Rejected":
//         className += " rejected";
//         break;
//       default:
//         className += " pending";
//     }

//     return <span className={className}>{status}</span>;
//   };

//   // Component for stat cards
//   const StatCard = ({ title, value, icon, color }) => {
//     const className = `stat-card ${color}`;

//     return (
//       <motion.div whileHover={{ y: -5 }} className={className}>
//         <div className="stat-card-content">
//           <div className={`stat-card-icon ${color}`}>{icon}</div>
//           <div className="stat-card-text">
//             <h3 className="stat-card-title">{title}</h3>
//             <p className="stat-card-value">{value}</p>
//           </div>
//         </div>
//       </motion.div>
//     );
//   };

//   if (!isAuthenticated) {
//     return (
//       <div className="login-container">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="login-card"
//         >
//           <h2 className="login-title">Admin Login</h2>
//           <form onSubmit={handleLogin} className="login-form">
//             <div className="form-group">
//               <label className="form-label">Email</label>
//               <input
//                 type="email"
//                 value={loginForm.email}
//                 onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
//                 className="form-input"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label className="form-label">Password</label>
//               <input
//                 type="password"
//                 value={loginForm.password}
//                 onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
//                 className="form-input"
//                 required
//               />
//             </div>
//             {loginError && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="login-error"
//               >
//                 {loginError}
//               </motion.div>
//             )}
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               type="submit"
//               className="login-button"
//             >
//               Login
//             </motion.button>
//           </form>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-container">
//       {/* Sidebar */}
//       <motion.div
//         initial={{ x: -100, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="sidebar"
//       >
//         <div className="sidebar-header">
//           <h2 className="sidebar-title">Admin Panel</h2>
//         </div>
//         <nav className="sidebar-nav">
//           <SidebarButton
//             icon={<Package />}
//             label="Items"
//             active={activeTab === "allStocks"}
//             onClick={() => setActiveTab("allStocks")}
//           />
//           <SidebarButton
//             icon={<PlusSquare />}
//             label="Add Items"
//             active={activeTab === "AddStock"}
//             onClick={() => setActiveTab("AddStock")}
//           />
//           <SidebarButton
//             icon={<Users />}
//             label="Manage Workers"
//             active={activeTab === "manageWorkers"}
//             onClick={() => setActiveTab("manageWorkers")}
//           />
//           <SidebarButton
//             icon={<BarChart2 />}
//             label="Sales Overview"
//             active={activeTab === "salesOverview"}
//             onClick={() => setActiveTab("salesOverview")}
//           />
//           <SidebarButton
//             icon={<Receipt />}
//             label="Transactions"
//             active={activeTab === "transactions"}
//             onClick={() => setActiveTab("transactions")}
//           />
//           <SidebarButton
//             icon={<ClipboardCheck />}
//             label="Stock Requests"
//             active={activeTab === "stockRequests"}
//             onClick={() => setActiveTab("stockRequests")}
//           />
//           <div className="sidebar-divider"></div>
//           <SidebarButton
//             icon={<LogOut />}
//             label="Logout"
//             onClick={() => {
//               localStorage.removeItem("token");
//               setIsAuthenticated(false);
//               navigate("/login");
//             }}
//           />
//         </nav>
//       </motion.div>

//       {/* Main Content */}
//       <div className="main-content">
//         <AnimatePresence mode="wait">
//           {activeTab === "allStocks" && (
//             <TabContent key="allStocks">
//               <PageHeader title="Items Inventory" icon={<Package />} />

//               <div className="card">
//                 <div className="search-container">
//                   <div className="search-icon">
//                     <Search />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Search by Name, Brand, or Supplier"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
//                     className="search-input"
//                   />
//                 </div>

//                 <div className="table-container">
//                   <table className="data-table">
//                     <thead>
//                       <tr>
//                         <TableHeader>Item Name</TableHeader>
//                         <TableHeader>Brand</TableHeader>
//                         <TableHeader>Amps</TableHeader>
//                         <TableHeader>Watt</TableHeader>
//                         <TableHeader>inch/mm</TableHeader>
//                         <TableHeader>Storage Location</TableHeader>
//                         <TableHeader>Stock</TableHeader>
//                         <TableHeader>Expiry Date</TableHeader>
//                         <TableHeader>Purchase Price</TableHeader>
//                         <TableHeader>Selling Price</TableHeader>
//                         <TableHeader>GST/Tax</TableHeader>
//                         <TableHeader>Manufacturer</TableHeader>
//                         <TableHeader>Supplier</TableHeader>
//                         <TableHeader>Contact</TableHeader>
//                         <TableHeader>Action</TableHeader>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {stocks
//                         .filter(
//                           (item) =>
//                             (item.itemName?.toLowerCase() || "").includes(searchTerm) ||
//                             (item.brand?.toLowerCase() || "").includes(searchTerm) ||
//                             (item.supplier?.toLowerCase() || "").includes(searchTerm)
//                         )
//                         .map((item) => (
//                           <motion.tr
//                             key={item._id}
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0 }}
//                             transition={{ duration: 0.2 }}
//                             className="table-row"
//                           >
//                             <TableCell>{item.itemName}</TableCell>
//                             <TableCell>{item.brand}</TableCell>
//                             <TableCell>{item.amps}</TableCell>
//                             <TableCell>{item.watt}</TableCell>
//                             <TableCell>{item.inchMm}</TableCell>
//                             <TableCell>{item.storageLocation}</TableCell>
//                             <TableCell>
//                               <span
//                                 className={`stock-badge ${
//                                   item.stock > 10
//                                     ? "high"
//                                     : item.stock > 0
//                                     ? "medium"
//                                     : "low"
//                                 }`}
//                               >
//                                 {item.stock} units
//                               </span>
//                             </TableCell>
//                             <TableCell>{new Date(item.expiryDate).toLocaleDateString()}</TableCell>
//                             <TableCell>₹{item.purchasePrice}</TableCell>
//                             <TableCell>₹{item.sellingPrice}</TableCell>
//                             <TableCell>{item.gstTax}%</TableCell>
//                             <TableCell>{item.manufacturer}</TableCell>
//                             <TableCell>{item.supplier}</TableCell>
//                             <TableCell>{item.contact || "N/A"}</TableCell>
//                             <TableCell>
//                               <motion.button
//                                 whileHover={{ scale: 1.1 }}
//                                 whileTap={{ scale: 0.9 }}
//                                 className="action-button delete"
//                                 title="Remove Item"
//                                 onClick={() => deleteMedicine(item._id, item.itemName)}
//                               >
//                                 <Trash2 className="action-icon" />
//                               </motion.button>
//                             </TableCell>
//                           </motion.tr>
//                         ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </TabContent>
//           )}

//           {activeTab === "AddStock" && (
//             <TabContent key="AddStock">
//               <PageHeader title="Add New Item" icon={<PlusSquare />} />

//               <div className="card">
//                 <div className="form-grid">
//                   <FormInput
//                     placeholder="Item Name *"
//                     value={formData.itemName}
//                     onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
//                   />
//                   <FormInput
//                     placeholder="Brand"
//                     value={formData.brand}
//                     onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
//                   />
//                   <FormInput
//                     placeholder="Amps *"
//                     value={formData.amps}
//                     onChange={(e) => setFormData({ ...formData, amps: e.target.value })}
//                   />
//                   <FormInput
//                     placeholder="Watt *"
//                     value={formData.watt}
//                     onChange={(e) => setFormData({ ...formData, watt: e.target.value })}
//                   />
//                   <FormInput
//                     placeholder="inch/mm"
//                     value={formData.inchMm}
//                     onChange={(e) => setFormData({ ...formData, inchMm: e.target.value })}
//                   />
//                   <FormInput
//                     placeholder="Storage Location (Rack/Shelf)"
//                     value={formData.storageLocation}
//                     onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
//                   />
//                   <FormInput
//                     type="number"
//                     placeholder="Stock Quantity *"
//                     value={formData.stock}
//                     onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
//                   />
//                   <FormInput
//                     type="date"
//                     placeholder="Expiry Date"
//                     value={formData.expiryDate}
//                     onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
//                   />
//                   <FormInput
//                     type="number"
//                     placeholder="Purchase Price"
//                     value={formData.purchasePrice}
//                     onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
//                   />
//                   <FormInput
//                     type="number"
//                     placeholder="Selling Price"
//                     value={formData.sellingPrice}
//                     onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
//                   />
//                   <FormInput
//                     type="number"
//                     placeholder="GST/Tax Rate"
//                     value={formData.gstTax}
//                     onChange={(e) => setFormData({ ...formData, gstTax: e.target.value })}
//                   />
//                   <FormInput
//                     placeholder="Manufacturer"
//                     value={formData.manufacturer}
//                     onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
//                   />
//                   <FormInput
//                     placeholder="Supplier Name *"
//                     value={formData.supplier}
//                     onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
//                   />
//                   <FormInput
//                     type="tel"
//                     placeholder="Supplier Contact *"
//                     value={formData.contact}
//                     onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
//                   />
//                 </div>

//                 <div className="form-actions">
//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={addMedicine}
//                     className="primary-button"
//                   >
//                     Add Item
//                   </motion.button>
//                 </div>
//               </div>
//             </TabContent>
//           )}

//           {activeTab === "manageWorkers" && (
//             <TabContent key="manageWorkers">
//               <PageHeader title="Manage Workers" icon={<Users />} />

//               <div className="card">
//                 <div className="worker-form">
//                   <FormInput
//                     placeholder="Name"
//                     value={newWorker.name}
//                     onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
//                   />
//                   <FormInput
//                     type="email"
//                     placeholder="Email"
//                     value={newWorker.email}
//                     onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })}
//                   />
//                   <FormInput
//                     type="password"
//                     placeholder="Password"
//                     value={newWorker.password}
//                     onChange={(e) => setNewWorker({ ...newWorker, password: e.target.value })}
//                   />
//                   <select
//                     value={newWorker.role}
//                     onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value })}
//                     className="form-select"
//                   >
//                     <option value="Cashier">Cashier</option>
//                     <option value="Labour">Labour</option>
//                   </select>
//                 </div>

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={addWorker}
//                   className="primary-button worker-add-button"
//                 >
//                   Add Worker
//                 </motion.button>

//                 <div className="table-container">
//                   <table className="data-table">
//                     <thead>
//                       <tr>
//                         <TableHeader>Name</TableHeader>
//                         <TableHeader>Email</TableHeader>
//                         <TableHeader>Role</TableHeader>
//                         <TableHeader>Actions</TableHeader>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {workers.map((worker) => (
//                         <motion.tr
//                           key={worker._id}
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           exit={{ opacity: 0 }}
//                           transition={{ duration: 0.2 }}
//                           className="table-row"
//                         >
//                           <TableCell>{worker.name}</TableCell>
//                           <TableCell>{worker.email}</TableCell>
//                           <TableCell>
//                             <span className={`role-badge ${worker.role.toLowerCase()}`}>
//                               {worker.role}
//                             </span>
//                           </TableCell>
//                           <TableCell>
//                             <div className="action-buttons">
//                               <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 className="action-button update"
//                                 onClick={() => {
//                                   const newPassword = prompt("Enter new password:");
//                                   if (newPassword) updateWorkerPassword(worker._id, newPassword);
//                                 }}
//                               >
//                                 Update Password
//                               </motion.button>
//                               <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 className="action-button delete"
//                                 onClick={() => deleteWorker(worker._id)}
//                               >
//                                 Delete
//                               </motion.button>
//                             </div>
//                           </TableCell>
//                         </motion.tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </TabContent>
//           )}

//           {activeTab === "salesOverview" && (
//             <TabContent key="salesOverview">
//               <PageHeader title="Sales Overview" icon={<BarChart2 />} />

//               <div className="stats-grid">
//                 <StatCard
//                   title="Total Sales"
//                   value={`₹${totalSales.toFixed(2)}`}
//                   icon={<DollarSign />}
//                   color="green"
//                 />
//                 <StatCard
//                   title="Total GST Collected"
//                   value={`₹${totalGST.toFixed(2)}`}
//                   icon={<CreditCard />}
//                   color="blue"
//                 />
//               </div>

//               <div className="card">
//                 <h3 className="card-title">Daily Sales</h3>
//                 <div className="chart-container">
//                   <ResponsiveContainer width="100%" height={300}>
//                     <BarChart data={dailySales}>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                       <XAxis dataKey="date" stroke="#6b7280" />
//                       <YAxis stroke="#6b7280" />
//                       <Tooltip
//                         contentStyle={{
//                           backgroundColor: "white",
//                           border: "none",
//                           borderRadius: "8px",
//                           boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//                         }}
//                         formatter={(value) => [`₹${value}`, "Sales"]}
//                         labelFormatter={(label) => `Day ${label}`}
//                       />
//                       <Bar dataKey="totalSales" fill="#4ade80" radius={[4, 4, 0, 0]} barSize={30} />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             </TabContent>
//           )}

//           {activeTab === "transactions" && (
//             <TabContent key="transactions">
//               <PageHeader title="Transactions" icon={<Receipt />} />

//               <div className="card">
//                 <div className="search-container">
//                   <div className="search-icon">
//                     <Search />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Search by Bill ID or Customer Name"
//                     value={transactionSearch}
//                     onChange={(e) => setTransactionSearch(e.target.value.toLowerCase())}
//                     className="search-input"
//                   />
//                 </div>

//                 <div className="table-container">
//                   <table className="data-table">
//                     <thead>
//                       <tr>
//                         <TableHeader>Bill ID</TableHeader>
//                         <TableHeader>Customer Name</TableHeader>
//                         <TableHeader>Phone</TableHeader>
//                         <TableHeader>Total Bill</TableHeader>
//                         <TableHeader>Date</TableHeader>
//                         <TableHeader>Action</TableHeader>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {invoices
//                         .filter(
//                           (inv) =>
//                             inv.billId.toLowerCase().includes(transactionSearch) ||
//                             inv.customerName.toLowerCase().includes(transactionSearch)
//                         )
//                         .map((inv) => (
//                           <motion.tr
//                             key={inv._id}
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0 }}
//                             transition={{ duration: 0.2 }}
//                             className="table-row"
//                           >
//                             <TableCell>{inv.billId}</TableCell>
//                             <TableCell>{inv.customerName}</TableCell>
//                             <TableCell>{inv.customerPhone}</TableCell>
//                             <TableCell>
//                               <span className="price">₹{inv.totalBill}</span>
//                             </TableCell>
//                             <TableCell>{new Date(inv.date).toLocaleDateString()}</TableCell>
//                             <TableCell>
//                               <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 onClick={() => setSelectedTransaction(inv)}
//                                 className="action-button view"
//                               >
//                                 View
//                               </motion.button>
//                             </TableCell>
//                           </motion.tr>
//                         ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               {selectedTransaction && (
//                 <div className="modal-overlay">
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.9 }}
//                     className="modal"
//                   >
//                     <div className="modal-header">
//                       <h2 className="modal-title">Transaction Details</h2>
//                       <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         onClick={() => setSelectedTransaction(null)}
//                         className="modal-close"
//                       >
//                         <X />
//                       </motion.button>
//                     </div>

//                     <div className="transaction-details">
//                       <div className="detail-grid">
//                         <div className="detail-item">
//                           <p className="detail-label">Bill ID</p>
//                           <p className="detail-value">{selectedTransaction.billId}</p>
//                         </div>
//                         <div className="detail-item">
//                           <p className="detail-label">Date</p>
//                           <p className="detail-value">{new Date(selectedTransaction.date).toLocaleString()}</p>
//                         </div>
//                         <div className="detail-item">
//                           <p className="detail-label">Customer Name</p>
//                           <p className="detail-value">{selectedTransaction.customerName}</p>
//                         </div>
//                         <div className="detail-item">
//                           <p className="detail-label">Phone</p>
//                           <p className="detail-value">{selectedTransaction.customerPhone}</p>
//                         </div>
//                         <div className="detail-item">
//                           <p className="detail-label">Payment Method</p>
//                           <p className="detail-value capitalize">{selectedTransaction.paymentMethod}</p>
//                         </div>
//                       </div>

//                       <h3 className="section-title">Items Purchased</h3>
//                       <div className="table-container">
//                         <table className="data-table">
//                           <thead>
//                             <tr>
//                               <th className="table-header">Item Name</th>
//                               <th className="table-header">Quantity</th>
//                               <th className="table-header">Price</th>
//                               <th className="table-header">GST</th>
//                               <th className="table-header">Total</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {selectedTransaction.items &&
//                               selectedTransaction.items.map((item, index) => (
//                                 <tr key={index} className="table-row">
//                                   <td className="table-cell">{item.itemName}</td>
//                                   <td className="table-cell">{item.quantity}</td>
//                                   <td className="table-cell">₹{item.sellingPrice}</td>
//                                   <td className="table-cell">{item.gstTax}%</td>
//                                   <td className="table-cell">
//                                     ₹{(item.sellingPrice * item.quantity * (1 + item.gstTax / 100)).toFixed(2)}
//                                   </td>
//                                 </tr>
//                               ))}
//                           </tbody>
//                         </table>
//                       </div>

//                       <div className="bill-summary">
//                         <div className="summary-row">
//                           <span className="summary-label">Subtotal:</span>
//                           <span className="summary-value">₹{selectedTransaction.totalAmount}</span>
//                         </div>
//                         <div className="summary-row">
//                           <span className="summary-label">GST Amount:</span>
//                           <span className="summary-value">₹{selectedTransaction.totalGST}</span>
//                         </div>
//                         <div className="summary-row total">
//                           <span className="summary-label">Total Bill:</span>
//                           <span className="summary-value">₹{selectedTransaction.totalBill}</span>
//                         </div>
//                       </div>

//                       <div className="modal-actions">
//                         <motion.button
//                           whileHover={{ scale: 1.02 }}
//                           whileTap={{ scale: 0.98 }}
//                           onClick={() => setSelectedTransaction(null)}
//                           className="secondary-button"
//                         >
//                           Close
//                         </motion.button>
//                       </div>
//                     </div>
//                   </motion.div>
//                 </div>
//               )}
//             </TabContent>
//           )}

//           {activeTab === "stockRequests" && (
//             <TabContent key="stockRequests">
//               <PageHeader title="Stock Requests" icon={<ClipboardCheck />} />

//               <div className="card">
//                 <div className="table-container">
//                   <table className="data-table">
//                     <thead>
//                       <tr>
//                         <TableHeader>Date</TableHeader>
//                         <TableHeader>Item Name</TableHeader>
//                         <TableHeader>Brand</TableHeader>
//                         <TableHeader>Quantity</TableHeader>
//                         <TableHeader>Supplier Name</TableHeader>
//                         <TableHeader>Supplier Contact</TableHeader>
//                         <TableHeader>Status</TableHeader>
//                         <TableHeader>Actions</TableHeader>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {requests.map((req) => (
//                         <motion.tr
//                           key={req._id}
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           exit={{ opacity: 0 }}
//                           transition={{ duration: 0.2 }}
//                           className="table-row"
//                         >
//                           <TableCell>{new Date(req.date).toLocaleDateString()}</TableCell>
//                           <TableCell>{req.medicineName}</TableCell>
//                           <TableCell>{req.batchNumber}</TableCell>
//                           <TableCell>{req.quantity} units</TableCell>
//                           <TableCell>{req.supplier}</TableCell>
//                           <TableCell>{req.supplierContact || "N/A"}</TableCell>
//                           <TableCell>
//                             <StatusBadge status={req.status} />
//                           </TableCell>
//                           <TableCell>
//                             {req.status === "Pending" && (
//                               <div className="action-buttons">
//                                 <motion.button
//                                   whileHover={{ scale: 1.1 }}
//                                   whileTap={{ scale: 0.9 }}
//                                   onClick={() => handleApproveRequest(req._id)}
//                                   className="action-button approve"
//                                 >
//                                   <CheckCircle className="action-icon" />
//                                 </motion.button>
//                                 <motion.button
//                                   whileHover={{ scale: 1.1 }}
//                                   whileTap={{ scale: 0.9 }}
//                                   onClick={() => handleRejectRequest(req._id)}
//                                   className="action-button reject"
//                                 >
//                                   <XCircle className="action-icon" />
//                                 </motion.button>
//                               </div>
//                             )}
//                           </TableCell>
//                         </motion.tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </TabContent>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

























"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  Users,
  Receipt,
  PlusSquare,
  BarChart2,
  ClipboardCheck,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  LogOut,
  DollarSign,
  CreditCard,
  Package,
  Filter,
  Calendar,
  Plus,
  FileText,
  Menu,
  ArrowUpRight,
  Loader2,
  X,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import "./admin-dashboard.css"

// Axios instance with default headers
const api = axios.create({
  baseURL: "https://easebilling.onrender.com/api",
})

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add response interceptor for 401/403 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("token")
      window.location.reload()
    }
    return Promise.reject(error)
  },
)

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"))
  const navigate = (path) => {
    window.location.href = path
  }

  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [loginError, setLoginError] = useState("")
  const [activeTab, setActiveTab] = useState("allStocks")
  const [stocks, setStocks] = useState([])
  const [workers, setWorkers] = useState([])
  const [invoices, setInvoices] = useState([])
  const [requests, setRequests] = useState([])
  const [totalSales, setTotalSales] = useState(0)
  const [dailySales, setDailySales] = useState([])
  const [totalGST, setTotalGST] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [transactionSearch, setTransactionSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [newWorker, setNewWorker] = useState({
    name: "",
    email: "",
    password: "",
    role: "Cashier",
  })
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
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await api.post("/api/login", loginForm)
      localStorage.setItem("token", response.data.token)
      setIsAuthenticated(true)
      setLoginError("")
      setLoginForm({ email: "", password: "" })
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Login failed. Please check your credentials or server status."
      setLoginError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      const processSalesData = () => {
        const salesMap = new Map()
        invoices.forEach((invoice) => {
          const date = new Date(invoice.date)
          const day = date.getDate()
          const formattedDate = `${day}`
          if (!salesMap.has(formattedDate)) {
            salesMap.set(formattedDate, { date: formattedDate, totalSales: 0 })
          }
          salesMap.get(formattedDate).totalSales += invoice.totalBill || 0
        })
        const sortedData = Array.from(salesMap.values()).sort((a, b) => a.date - b.date)
        setDailySales(sortedData)
      }
      processSalesData()
    }
  }, [invoices, isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      fetchStocks()
      fetchWorkers()
      fetchInvoices()
      fetchRequests()
    }
  }, [isAuthenticated])

  const fetchStocks = async () => {
    try {
      const response = await api.get("/medicines")
      setStocks(response.data)
    } catch (error) {
      console.error("Error fetching stocks:", error.response?.data || error)
    }
  }

  const fetchWorkers = async () => {
    try {
      const response = await api.get("/workers")
      setWorkers(response.data)
    } catch (error) {
      console.error("Error fetching workers:", error)
    }
  }

  const fetchInvoices = async () => {
    try {
      const response = await api.get("/invoices")
      setInvoices(response.data)
      setTotalSales(response.data.reduce((sum, inv) => sum + (inv.totalBill || 0), 0))
      setTotalGST(response.data.reduce((sum, inv) => sum + (inv.totalGST || 0), 0))
    } catch (error) {
      console.error("Error fetching invoices:", error)
    }
  }

  const fetchRequests = async () => {
    try {
      const response = await api.get("/medicine-requests")
      setRequests(response.data)
    } catch (error) {
      console.error("Error fetching requests:", error.response?.data || error)
    }
  }

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] })
  }

  const addMedicine = async () => {
    if (!formData.itemName || !formData.stock || Number.parseInt(formData.stock) <= 0) {
      alert("Please fill in Item Name and a valid Stock Quantity")
      return
    }
    setIsLoading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.itemName)
      formDataToSend.append("batchNumber", formData.brand)
      formDataToSend.append("category", formData.amps)
      formDataToSend.append("strengthDosage", formData.watt)
      formDataToSend.append("composition", formData.inchMm)
      formDataToSend.append("storageLocation", formData.storageLocation)
      formDataToSend.append("stockQuantity", Number.parseInt(formData.stock))
      formDataToSend.append("expiryDate", formData.expiryDate)
      formDataToSend.append("purchasePrice", Number.parseFloat(formData.purchasePrice) || 0)
      formDataToSend.append("sellingPrice", Number.parseFloat(formData.sellingPrice) || 0)
      formDataToSend.append("gstTaxRate", Number.parseFloat(formData.gstTax) || 0)
      formDataToSend.append("manufacturer", formData.manufacturer)
      formDataToSend.append("supplierName", formData.supplier)
      formDataToSend.append("supplierContact", formData.contact)
      if (formData.image) {
        formDataToSend.append("image", formData.image)
      }

      await api.post("/add-item", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      alert("Item added successfully")
      fetchStocks()
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
      })
    } catch (error) {
      console.error("Error adding item:", error.response?.data || error)
      alert(`Failed to add item: ${error.response?.data?.error || "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteMedicine = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return
    }

    setIsLoading(true)
    try {
      const response = await api.delete(`/delete-medicine/${id}`)
      if (response.status === 200) {
        alert(`Medicine "${name}" deleted successfully`)
        fetchStocks()
      }
    } catch (error) {
      console.error("Error deleting medicine:", error.response?.data || error)
      alert(`Failed to delete medicine: ${error.response?.data?.error || "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveRequest = async (id) => {
    setIsLoading(true)
    try {
      await api.put(`/approve-request/${id}`)
      alert("Request approved successfully")
      fetchRequests()
      fetchStocks()
    } catch (error) {
      console.error("Error approving request:", error.response?.data || error)
      alert(`Failed to approve request: ${error.response?.data?.error || "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectRequest = async (id) => {
    setIsLoading(true)
    try {
      await api.put(`/reject-request/${id}`)
      alert("Request rejected successfully")
      fetchRequests()
    } catch (error) {
      console.error("Error rejecting request:", error.response?.data || error)
      alert(`Failed to reject request: ${error.response?.data?.error || "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const addWorker = async () => {
    setIsLoading(true)
    try {
      await api.post("/worker", newWorker)
      alert("Worker added successfully")
      fetchWorkers()
      setNewWorker({ name: "", email: "", password: "", role: "Cashier" })
    } catch (error) {
      console.error("Error adding worker:", error.response?.data || error)
      alert(`Failed to add worker: ${error.response?.data?.error || "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const updateWorkerPassword = async (id, newPassword) => {
    setIsLoading(true)
    try {
      await api.put(`/update-worker/${id}`, { newPassword })
      alert("Password updated successfully")
    } catch (error) {
      console.error("Error updating password:", error.response?.data || error)
      alert(`Failed to update password: ${error.response?.data?.error || "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteWorker = async (id) => {
    setIsLoading(true)
    try {
      await api.delete(`/delete-worker/${id}`)
      alert("Worker deleted successfully")
      fetchWorkers()
    } catch (error) {
      console.error("Error deleting worker:", error.response?.data || error)
      alert(`Failed to delete worker: ${error.response?.data?.error || "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Login Page
  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="login-card"
        >
          <div className="login-header">
            <div className="login-logo">
              <Package className="login-logo-icon" />
            </div>
            <h1 className="login-title">Admin Login</h1>
            <p className="login-description">Enter your credentials to access the admin dashboard</p>
          </div>
          <div className="login-content">
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              {loginError && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="login-error">
                  {loginError}
                </motion.div>
              )}
              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? (
                  <span className="button-content">
                    <Loader2 className="button-icon spin" /> Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    )
  }

  // Dashboard
  return (
    <div className="dashboard-container">
      {/* Mobile Menu Button */}
      <div className="mobile-menu-button">
        <button onClick={() => setIsMobileMenuOpen(true)} className="icon-button">
          <Menu className="icon" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="mobile-sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-sidebar-header">
              <h2 className="mobile-sidebar-title">Admin Dashboard</h2>
              <p className="mobile-sidebar-description">Navigation Menu</p>
              <button className="mobile-sidebar-close" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="icon" />
              </button>
            </div>
            <div className="mobile-sidebar-content">
              <MobileSidebarItem
                icon={<Package className="icon" />}
                label="Items Inventory"
                active={activeTab === "allStocks"}
                onClick={() => {
                  setActiveTab("allStocks")
                  setIsMobileMenuOpen(false)
                }}
              />
              <MobileSidebarItem
                icon={<PlusSquare className="icon" />}
                label="Add Items"
                active={activeTab === "AddStock"}
                onClick={() => {
                  setActiveTab("AddStock")
                  setIsMobileMenuOpen(false)
                }}
              />
              <MobileSidebarItem
                icon={<Users className="icon" />}
                label="Manage Workers"
                active={activeTab === "manageWorkers"}
                onClick={() => {
                  setActiveTab("manageWorkers")
                  setIsMobileMenuOpen(false)
                }}
              />
              <MobileSidebarItem
                icon={<BarChart2 className="icon" />}
                label="Sales Overview"
                active={activeTab === "salesOverview"}
                onClick={() => {
                  setActiveTab("salesOverview")
                  setIsMobileMenuOpen(false)
                }}
              />
              <MobileSidebarItem
                icon={<Receipt className="icon" />}
                label="Transactions"
                active={activeTab === "transactions"}
                onClick={() => {
                  setActiveTab("transactions")
                  setIsMobileMenuOpen(false)
                }}
              />
              <MobileSidebarItem
                icon={<ClipboardCheck className="icon" />}
                label="Stock Requests"
                active={activeTab === "stockRequests"}
                onClick={() => {
                  setActiveTab("stockRequests")
                  setIsMobileMenuOpen(false)
                }}
              />
              <div className="sidebar-divider"></div>
              <MobileSidebarItem
                icon={<LogOut className="icon" />}
                label="Logout"
                onClick={() => {
                  localStorage.removeItem("token")
                  setIsAuthenticated(false)
                  navigate("/login")
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">
            <Package className="sidebar-logo" /> Admin Dashboard
          </h1>
        </div>
        <nav className="sidebar-nav">
          <SidebarItem
            icon={<Package className="icon" />}
            label="Items Inventory"
            active={activeTab === "allStocks"}
            onClick={() => setActiveTab("allStocks")}
          />
          <SidebarItem
            icon={<PlusSquare className="icon" />}
            label="Add Items"
            active={activeTab === "AddStock"}
            onClick={() => setActiveTab("AddStock")}
          />
          <SidebarItem
            icon={<Users className="icon" />}
            label="Manage Workers"
            active={activeTab === "manageWorkers"}
            onClick={() => setActiveTab("manageWorkers")}
          />
          <SidebarItem
            icon={<BarChart2 className="icon" />}
            label="Sales Overview"
            active={activeTab === "salesOverview"}
            onClick={() => setActiveTab("salesOverview")}
          />
          <SidebarItem
            icon={<Receipt className="icon" />}
            label="Transactions"
            active={activeTab === "transactions"}
            onClick={() => setActiveTab("transactions")}
          />
          <SidebarItem
            icon={<ClipboardCheck className="icon" />}
            label="Stock Requests"
            active={activeTab === "stockRequests"}
            onClick={() => setActiveTab("stockRequests")}
          />
          <div className="sidebar-divider"></div>
          <SidebarItem
            icon={<LogOut className="icon" />}
            label="Logout"
            onClick={() => {
              localStorage.removeItem("token")
              setIsAuthenticated(false)
              navigate("/login")
            }}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          <AnimatePresence mode="wait">
            {/* Items Inventory */}
            {activeTab === "allStocks" && (
              <motion.div
                key="allStocks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="content-section"
              >
                <header className="section-header">
                  <div>
                    <h1 className="section-title">Items Inventory</h1>
                    <p className="section-description">Manage your inventory items and stock levels</p>
                  </div>
                  <div className="header-actions">
                    <button className="button button-outline">
                      <Filter className="button-icon" /> Filter
                    </button>
                    <button className="button button-outline">
                      <Calendar className="button-icon" /> Today
                    </button>
                  </div>
                </header>

                <div className="search-wrapper">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by Name, Brand, or Supplier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                    className="search-input"
                  />
                </div>

                <div className="card">
                  <div className="table-container">
                    <table className="data-table">
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
                              (item.supplier?.toLowerCase() || "").includes(searchTerm),
                          )
                          .map((item) => (
                            <tr key={item._id} className="table-row">
                              <td className="font-medium">{item.itemName}</td>
                              <td>{item.brand}</td>
                              <td>{item.amps}</td>
                              <td>{item.watt}</td>
                              <td>{item.inchMm}</td>
                              <td>{item.storageLocation}</td>
                              <td>
                                <span
                                  className={`badge ${
                                    item.stock > 10
                                      ? "badge-success"
                                      : item.stock > 0
                                        ? "badge-warning"
                                        : "badge-danger"
                                  }`}
                                >
                                  {item.stock} units
                                </span>
                              </td>
                              <td>{new Date(item.expiryDate).toLocaleDateString()}</td>
                              <td>₹{item.purchasePrice}</td>
                              <td>₹{item.sellingPrice}</td>
                              <td>{item.gstTax}%</td>
                              <td>{item.manufacturer}</td>
                              <td>{item.supplier}</td>
                              <td>{item.contact || "N/A"}</td>
                              <td>
                                <button
                                  className="icon-button delete"
                                  onClick={() => deleteMedicine(item._id, item.itemName)}
                                >
                                  <Trash2 className="icon" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Add Items */}
            {activeTab === "AddStock" && (
              <motion.div
                key="AddStock"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="content-section"
              >
                <header className="section-header">
                  <div>
                    <h1 className="section-title">Add New Item</h1>
                    <p className="section-description">Add a new item to your inventory</p>
                  </div>
                </header>

                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Item Details</h2>
                    <p className="card-description">
                      Fill in the details of the new item you want to add to your inventory.
                    </p>
                  </div>
                  <div className="card-content">
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="itemName" className="form-label">
                          Item Name *
                        </label>
                        <input
                          id="itemName"
                          type="text"
                          placeholder="Enter item name"
                          value={formData.itemName}
                          onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="brand" className="form-label">
                          Brand
                        </label>
                        <input
                          id="brand"
                          type="text"
                          placeholder="Enter brand name"
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="amps" className="form-label">
                          Amps *
                        </label>
                        <input
                          id="amps"
                          type="text"
                          placeholder="Enter amps"
                          value={formData.amps}
                          onChange={(e) => setFormData({ ...formData, amps: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="watt" className="form-label">
                          Watt *
                        </label>
                        <input
                          id="watt"
                          type="text"
                          placeholder="Enter watt"
                          value={formData.watt}
                          onChange={(e) => setFormData({ ...formData, watt: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="inchMm" className="form-label">
                          inch/mm
                        </label>
                        <input
                          id="inchMm"
                          type="text"
                          placeholder="Enter inch/mm"
                          value={formData.inchMm}
                          onChange={(e) => setFormData({ ...formData, inchMm: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="storageLocation" className="form-label">
                          Storage Location
                        </label>
                        <input
                          id="storageLocation"
                          type="text"
                          placeholder="Enter rack/shelf"
                          value={formData.storageLocation}
                          onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="stock" className="form-label">
                          Stock Quantity *
                        </label>
                        <input
                          id="stock"
                          type="number"
                          placeholder="Enter quantity"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="expiryDate" className="form-label">
                          Expiry Date
                        </label>
                        <input
                          id="expiryDate"
                          type="date"
                          value={formData.expiryDate}
                          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="purchasePrice" className="form-label">
                          Purchase Price
                        </label>
                        <input
                          id="purchasePrice"
                          type="number"
                          placeholder="Enter purchase price"
                          value={formData.purchasePrice}
                          onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="sellingPrice" className="form-label">
                          Selling Price
                        </label>
                        <input
                          id="sellingPrice"
                          type="number"
                          placeholder="Enter selling price"
                          value={formData.sellingPrice}
                          onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="gstTax" className="form-label">
                          GST/Tax Rate (%)
                        </label>
                        <input
                          id="gstTax"
                          type="number"
                          placeholder="Enter GST/tax rate"
                          value={formData.gstTax}
                          onChange={(e) => setFormData({ ...formData, gstTax: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="manufacturer" className="form-label">
                          Manufacturer
                        </label>
                        <input
                          id="manufacturer"
                          type="text"
                          placeholder="Enter manufacturer"
                          value={formData.manufacturer}
                          onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="supplier" className="form-label">
                          Supplier Name *
                        </label>
                        <input
                          id="supplier"
                          type="text"
                          placeholder="Enter supplier name"
                          value={formData.supplier}
                          onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="contact" className="form-label">
                          Supplier Contact *
                        </label>
                        <input
                          id="contact"
                          type="tel"
                          placeholder="Enter supplier contact"
                          value={formData.contact}
                          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="image" className="form-label">
                          Item Image
                        </label>
                        <input id="image" type="file" onChange={handleImageChange} className="form-input" />
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button onClick={addMedicine} className="button button-primary" disabled={isLoading}>
                      {isLoading ? (
                        <span className="button-content">
                          <Loader2 className="button-icon spin" /> Adding...
                        </span>
                      ) : (
                        <span className="button-content">
                          <Plus className="button-icon" /> Add Item
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Manage Workers */}
            {activeTab === "manageWorkers" && (
              <motion.div
                key="manageWorkers"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="content-section"
              >
                <header className="section-header">
                  <div>
                    <h1 className="section-title">Manage Workers</h1>
                    <p className="section-description">Add, update, and manage your team members</p>
                  </div>
                </header>

                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Add New Worker</h2>
                    <p className="card-description">Create a new account for a team member</p>
                  </div>
                  <div className="card-content">
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="workerName" className="form-label">
                          Name
                        </label>
                        <input
                          id="workerName"
                          type="text"
                          placeholder="Enter name"
                          value={newWorker.name}
                          onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="workerEmail" className="form-label">
                          Email
                        </label>
                        <input
                          id="workerEmail"
                          type="email"
                          placeholder="Enter email"
                          value={newWorker.email}
                          onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="workerPassword" className="form-label">
                          Password
                        </label>
                        <input
                          id="workerPassword"
                          type="password"
                          placeholder="Enter password"
                          value={newWorker.password}
                          onChange={(e) => setNewWorker({ ...newWorker, password: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="workerRole" className="form-label">
                          Role
                        </label>
                        <select
                          id="workerRole"
                          value={newWorker.role}
                          onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value })}
                          className="form-select"
                        >
                          <option value="Cashier">Cashier</option>
                          <option value="Labour">Labour</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button onClick={addWorker} className="button button-primary" disabled={isLoading}>
                      {isLoading ? (
                        <span className="button-content">
                          <Loader2 className="button-icon spin" /> Adding...
                        </span>
                      ) : (
                        <span className="button-content">
                          <Plus className="button-icon" /> Add Worker
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Current Workers</h2>
                    <p className="card-description">Manage your existing team members</p>
                  </div>
                  <div className="card-content">
                    <table className="data-table">
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
                          <tr key={worker._id} className="table-row">
                            <td className="font-medium">{worker.name}</td>
                            <td>{worker.email}</td>
                            <td>
                              <span className={`badge ${worker.role === "Cashier" ? "badge-info" : "badge-purple"}`}>
                                {worker.role}
                              </span>
                            </td>
                            <td>
                              <div className="button-group">
                                <button
                                  className="button button-small"
                                  onClick={() => {
                                    const newPassword = prompt("Enter new password for " + worker.name)
                                    if (newPassword) updateWorkerPassword(worker._id, newPassword)
                                  }}
                                >
                                  Update Password
                                </button>
                                <button
                                  className="button button-small button-danger"
                                  onClick={() => deleteWorker(worker._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Sales Overview */}
            {activeTab === "salesOverview" && (
              <motion.div
                key="salesOverview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="content-section"
              >
                <header className="section-header">
                  <div>
                    <h1 className="section-title">Sales Overview</h1>
                    <p className="section-description">Monitor your sales performance and metrics</p>
                  </div>
                </header>

                <div className="stats-grid">
                  <div className="stat-card stat-card-green">
                    <div className="stat-card-header">
                      <h2 className="stat-card-title">
                        <DollarSign className="stat-card-icon" /> Total Sales
                      </h2>
                    </div>
                    <div className="stat-card-content">
                      <div className="stat-card-info">
                        <p className="stat-card-value">₹{totalSales.toFixed(2)}</p>
                        <p className="stat-card-label">All time sales revenue</p>
                      </div>
                      <div className="stat-card-icon-container">
                        <ArrowUpRight className="stat-trend-icon" />
                      </div>
                    </div>
                  </div>

                  <div className="stat-card stat-card-blue">
                    <div className="stat-card-header">
                      <h2 className="stat-card-title">
                        <CreditCard className="stat-card-icon" /> Total GST Collected
                      </h2>
                    </div>
                    <div className="stat-card-content">
                      <div className="stat-card-info">
                        <p className="stat-card-value">₹{totalGST.toFixed(2)}</p>
                        <p className="stat-card-label">All time GST collection</p>
                      </div>
                      <div className="stat-card-icon-container">
                        <FileText className="stat-trend-icon" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Daily Sales</h2>
                    <p className="card-description">Sales performance by day of the month</p>
                  </div>
                  <div className="card-content">
                    <div className="chart-container">
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={dailySales}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis
                            dataKey="date"
                            stroke="#6b7280"
                            axisLine={{ stroke: "#e5e7eb" }}
                            tickLine={{ stroke: "#e5e7eb" }}
                          />
                          <YAxis
                            stroke="#6b7280"
                            axisLine={{ stroke: "#e5e7eb" }}
                            tickLine={{ stroke: "#e5e7eb" }}
                            tickFormatter={(value) => `₹${value}`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "none",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            }}
                            formatter={(value) => [`₹${value}`, "Sales"]}
                            labelFormatter={(label) => `Day ${label}`}
                          />
                          <Bar dataKey="totalSales" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Transactions */}
            {activeTab === "transactions" && (
              <motion.div
                key="transactions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="content-section"
              >
                <header className="section-header">
                  <div>
                    <h1 className="section-title">Transactions</h1>
                    <p className="section-description">View and manage all sales transactions</p>
                  </div>
                </header>

                <div className="search-wrapper">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by Bill ID or Customer Name..."
                    value={transactionSearch}
                    onChange={(e) => setTransactionSearch(e.target.value.toLowerCase())}
                    className="search-input"
                  />
                </div>

                <div className="card">
                  <table className="data-table">
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
                            inv.customerName.toLowerCase().includes(transactionSearch),
                        )
                        .map((inv) => (
                          <tr key={inv._id} className="table-row">
                            <td className="font-medium">{inv.billId}</td>
                            <td>{inv.customerName}</td>
                            <td>{inv.customerPhone}</td>
                            <td>
                              <span className="price">₹{inv.totalBill}</span>
                            </td>
                            <td>{new Date(inv.date).toLocaleDateString()}</td>
                            <td>
                              <button className="button button-small" onClick={() => setSelectedTransaction(inv)}>
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Transaction Details Modal */}
                {selectedTransaction && (
                  <div className="modal-overlay" onClick={() => setSelectedTransaction(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                      <div className="modal-header">
                        <h2 className="modal-title">Transaction Details</h2>
                        <p className="modal-description">
                          Bill ID: {selectedTransaction.billId} | Date:{" "}
                          {new Date(selectedTransaction.date).toLocaleString()}
                        </p>
                        <button className="modal-close" onClick={() => setSelectedTransaction(null)}>
                          <X className="icon" />
                        </button>
                      </div>

                      <div className="modal-content">
                        <div className="customer-details">
                          <div className="detail-item">
                            <p className="detail-label">Customer Name</p>
                            <p className="detail-value">{selectedTransaction.customerName}</p>
                          </div>
                          <div className="detail-item">
                            <p className="detail-label">Phone</p>
                            <p className="detail-value">{selectedTransaction.customerPhone}</p>
                          </div>
                          <div className="detail-item">
                            <p className="detail-label">Payment Method</p>
                            <p className="detail-value capitalize">{selectedTransaction.paymentMethod}</p>
                          </div>
                        </div>

                        <div className="divider"></div>

                        <div className="items-section">
                          <h3 className="section-subtitle">Items Purchased</h3>
                          <table className="data-table">
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
                              {selectedTransaction.items &&
                                selectedTransaction.items.map((item, index) => (
                                  <tr key={index}>
                                    <td className="font-medium">{item.itemName}</td>
                                    <td>{item.quantity}</td>
                                    <td>₹{item.sellingPrice}</td>
                                    <td>{item.gstTax}%</td>
                                    <td>₹{(item.sellingPrice * item.quantity * (1 + item.gstTax / 100)).toFixed(2)}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="divider"></div>

                        <div className="bill-summary">
                          <div className="summary-row">
                            <span className="summary-label">Subtotal:</span>
                            <span className="summary-value">₹{selectedTransaction.totalAmount}</span>
                          </div>
                          <div className="summary-row">
                            <span className="summary-label">GST Amount:</span>
                            <span className="summary-value">₹{selectedTransaction.totalGST}</span>
                          </div>
                          <div className="divider"></div>
                          <div className="summary-row total">
                            <span className="summary-label">Total Bill:</span>
                            <span className="summary-value">₹{selectedTransaction.totalBill}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Stock Requests */}
            {activeTab === "stockRequests" && (
              <motion.div
                key="stockRequests"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="content-section"
              >
                <header className="section-header">
                  <div>
                    <h1 className="section-title">Stock Requests</h1>
                    <p className="section-description">Manage incoming stock requests from your team</p>
                  </div>
                </header>

                <div className="card">
                  <table className="data-table">
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
                        <tr key={req._id} className="table-row">
                          <td>{new Date(req.date).toLocaleDateString()}</td>
                          <td className="font-medium">{req.medicineName}</td>
                          <td>{req.batchNumber}</td>
                          <td>{req.quantity} units</td>
                          <td>{req.supplier}</td>
                          <td>{req.supplierContact || "N/A"}</td>
                          <td>
                            <span
                              className={`badge ${
                                req.status === "Approved"
                                  ? "badge-success"
                                  : req.status === "Rejected"
                                    ? "badge-danger"
                                    : "badge-warning"
                              }`}
                            >
                              {req.status}
                            </span>
                          </td>
                          <td>
                            {req.status === "Pending" && (
                              <div className="button-group">
                                <button
                                  className="button button-small button-success"
                                  onClick={() => handleApproveRequest(req._id)}
                                >
                                  <CheckCircle className="button-icon" /> Approve
                                </button>
                                <button
                                  className="button button-small button-danger"
                                  onClick={() => handleRejectRequest(req._id)}
                                >
                                  <XCircle className="button-icon" /> Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

// Sidebar Item Component
function SidebarItem({ icon, label, active, onClick }) {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`sidebar-item ${active ? "active" : ""}`}
    >
      <span className={`sidebar-item-icon ${active ? "active" : ""}`}>{icon}</span>
      {label}
      {active && (
        <motion.div
          layoutId="activeIndicator"
          className="active-indicator"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  )
}

// Mobile Sidebar Item Component
function MobileSidebarItem({ icon, label, active, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`mobile-sidebar-item ${active ? "active" : ""}`}
    >
      <span className={`mobile-sidebar-item-icon ${active ? "active" : ""}`}>{icon}</span>
      {label}
      {active && (
        <motion.div
          layoutId="mobileActiveIndicator"
          className="active-indicator"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  )
}
