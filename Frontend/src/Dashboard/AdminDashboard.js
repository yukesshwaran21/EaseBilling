// "use client"

// import { useEffect, useState } from "react"
// import axios from "axios"
// import {
//   Users,
//   Receipt,
//   PlusSquare,
//   BarChart2,
//   ClipboardCheck,
//   Search,
//   Trash2,
//   CheckCircle,
//   XCircle,
//   LogOut,
//   DollarSign,
//   CreditCard,
//   Package,
//   Filter,
//   Calendar,
//   Plus,
//   FileText,
//   Menu,
//   ArrowUpRight,
//   Loader2,
//   X,
// } from "lucide-react"
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
// import { motion, AnimatePresence } from "framer-motion"
// import "../Dashboard/AdminDashboard.css"

// // Add these imports at the top with the other imports
// import { PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts"

// // Axios instance with default headers
// const api = axios.create({
//   baseURL: "https://easebilling.onrender.com/api",
// })

// // Add request interceptor to include token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token")
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => Promise.reject(error),
// )

// // Add response interceptor for 401/403 errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//       localStorage.removeItem("token")
//       window.location.reload()
//     }
//     return Promise.reject(error)
//   },
// )

// export default function AdminDashboard() {
//   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"))
//   const navigate = (path) => {
//     window.location.href = path
//   }

//   const [loginForm, setLoginForm] = useState({ email: "", password: "" })
//   const [loginError, setLoginError] = useState("")
//   const [activeTab, setActiveTab] = useState("allStocks")
//   const [stocks, setStocks] = useState([])
//   const [workers, setWorkers] = useState([])
//   const [invoices, setInvoices] = useState([])
//   const [requests, setRequests] = useState([])
//   const [totalSales, setTotalSales] = useState(0)
//   const [dailySales, setDailySales] = useState([])
//   const [totalGST, setTotalGST] = useState(0)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedTransaction, setSelectedTransaction] = useState(null)
//   const [transactionSearch, setTransactionSearch] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
//   const [newWorker, setNewWorker] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "Cashier",
//   })
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
//   })

//   const handleLogin = async (e) => {
//     e.preventDefault()
//     setIsLoading(true)
//     try {
//       const response = await api.post("/api/login", loginForm)
//       localStorage.setItem("token", response.data.token)
//       setIsAuthenticated(true)
//       setLoginError("")
//       setLoginForm({ email: "", password: "" })
//     } catch (error) {
//       const errorMsg = error.response?.data?.error || "Login failed. Please check your credentials or server status."
//       setLoginError(errorMsg)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (isAuthenticated) {
//       const processSalesData = () => {
//         const salesMap = new Map()
//         invoices.forEach((invoice) => {
//           const date = new Date(invoice.date)
//           const day = date.getDate()
//           const formattedDate = `${day}`
//           if (!salesMap.has(formattedDate)) {
//             salesMap.set(formattedDate, { date: formattedDate, totalSales: 0 })
//           }
//           salesMap.get(formattedDate).totalSales += invoice.totalBill || 0
//         })
//         const sortedData = Array.from(salesMap.values()).sort((a, b) => a.date - b.date)
//         setDailySales(sortedData)
//       }
//       processSalesData()
//     }
//   }, [invoices, isAuthenticated])

//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchStocks()
//       fetchWorkers()
//       fetchInvoices()
//       fetchRequests()
//     }
//   }, [isAuthenticated])

//   const fetchStocks = async () => {
//     try {
//       const response = await api.get("/medicines")
//       setStocks(response.data)
//     } catch (error) {
//       console.error("Error fetching stocks:", error.response?.data || error)
//     }
//   }

//   const fetchWorkers = async () => {
//     try {
//       const response = await api.get("/workers")
//       setWorkers(response.data)
//     } catch (error) {
//       console.error("Error fetching workers:", error)
//     }
//   }

//   const fetchInvoices = async () => {
//     try {
//       const response = await api.get("/invoices")
//       setInvoices(response.data)
//       setTotalSales(response.data.reduce((sum, inv) => sum + (inv.totalBill || 0), 0))
//       setTotalGST(response.data.reduce((sum, inv) => sum + (inv.totalGST || 0), 0))
//     } catch (error) {
//       console.error("Error fetching invoices:", error)
//     }
//   }

//   const fetchRequests = async () => {
//     try {
//       const response = await api.get("/medicine-requests")
//       setRequests(response.data)
//     } catch (error) {
//       console.error("Error fetching requests:", error.response?.data || error)
//     }
//   }

//   const handleImageChange = (e) => {
//     setFormData({ ...formData, image: e.target.files[0] })
//   }

//   const addMedicine = async () => {
//     if (!formData.itemName || !formData.stock || Number.parseInt(formData.stock) <= 0) {
//       alert("Please fill in Item Name and a valid Stock Quantity")
//       return
//     }
//     setIsLoading(true)
//     try {
//       const formDataToSend = new FormData()
//       formDataToSend.append("name", formData.itemName)
//       formDataToSend.append("batchNumber", formData.brand)
//       formDataToSend.append("category", formData.amps)
//       formDataToSend.append("strengthDosage", formData.watt)
//       formDataToSend.append("composition", formData.inchMm)
//       formDataToSend.append("storageLocation", formData.storageLocation)
//       formDataToSend.append("stockQuantity", Number.parseInt(formData.stock))
//       formDataToSend.append("expiryDate", formData.expiryDate)
//       formDataToSend.append("purchasePrice", Number.parseFloat(formData.purchasePrice) || 0)
//       formDataToSend.append("sellingPrice", Number.parseFloat(formData.sellingPrice) || 0)
//       formDataToSend.append("gstTaxRate", Number.parseFloat(formData.gstTax) || 0)
//       formDataToSend.append("manufacturer", formData.manufacturer)
//       formDataToSend.append("supplierName", formData.supplier)
//       formDataToSend.append("supplierContact", formData.contact)
//       if (formData.image) {
//         formDataToSend.append("image", formData.image)
//       }

//       await api.post("/add-item", formDataToSend, {
//         headers: { "Content-Type": "multipart/form-data" },
//       })

//       alert("Item added successfully")
//       fetchStocks()
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
//       })
//     } catch (error) {
//       console.error("Error adding item:", error.response?.data || error)
//       alert(`Failed to add item: ${error.response?.data?.error || "Unknown error"}`)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const deleteMedicine = async (id, name) => {
//     if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
//       return
//     }

//     setIsLoading(true)
//     try {
//       const response = await api.delete(`/delete-medicine/${id}`)
//       if (response.status === 200) {
//         alert(`Medicine "${name}" deleted successfully`)
//         fetchStocks()
//       }
//     } catch (error) {
//       console.error("Error deleting medicine:", error.response?.data || error)
//       alert(`Failed to delete medicine: ${error.response?.data?.error || "Unknown error"}`)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleApproveRequest = async (id) => {
//     setIsLoading(true)
//     try {
//       await api.put(`/approve-request/${id}`)
//       alert("Request approved successfully")
//       fetchRequests()
//       fetchStocks()
//     } catch (error) {
//       console.error("Error approving request:", error.response?.data || error)
//       alert(`Failed to approve request: ${error.response?.data?.error || "Unknown error"}`)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleRejectRequest = async (id) => {
//     setIsLoading(true)
//     try {
//       await api.put(`/reject-request/${id}`)
//       alert("Request rejected successfully")
//       fetchRequests()
//     } catch (error) {
//       console.error("Error rejecting request:", error.response?.data || error)
//       alert(`Failed to reject request: ${error.response?.data?.error || "Unknown error"}`)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const addWorker = async () => {
//     setIsLoading(true)
//     try {
//       await api.post("/worker", newWorker)
//       alert("Worker added successfully")
//       fetchWorkers()
//       setNewWorker({ name: "", email: "", password: "", role: "Cashier" })
//     } catch (error) {
//       console.error("Error adding worker:", error.response?.data || error)
//       alert(`Failed to add worker: ${error.response?.data?.error || "Unknown error"}`)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const updateWorkerPassword = async (id, newPassword) => {
//     setIsLoading(true)
//     try {
//       await api.put(`/update-worker/${id}`, { newPassword })
//       alert("Password updated successfully")
//     } catch (error) {
//       console.error("Error updating password:", error.response?.data || error)
//       alert(`Failed to update password: ${error.response?.data?.error || "Unknown error"}`)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const deleteWorker = async (id) => {
//     setIsLoading(true)
//     try {
//       await api.delete(`/delete-worker/${id}`)
//       alert("Worker deleted successfully")
//       fetchWorkers()
//     } catch (error) {
//       console.error("Error deleting worker:", error.response?.data || error)
//       alert(`Failed to delete worker: ${error.response?.data?.error || "Unknown error"}`)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Login Page
//   if (!isAuthenticated) {
//     return (
//       <div className="login-container">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, ease: "easeOut" }}
//           className="login-card"
//         >
//           <div className="login-header">
//             <div className="login-logo">
//               <Package className="login-logo-icon" />
//             </div>
//             <h1 className="login-title">Admin Login</h1>
//             <p className="login-description">Enter your credentials to access the admin dashboard</p>
//           </div>
//           <div className="login-content">
//             <form onSubmit={handleLogin} className="login-form">
//               <div className="form-group">
//                 <label htmlFor="email" className="form-label">
//                   Email
//                 </label>
//                 <input
//                   id="email"
//                   type="email"
//                   placeholder="admin@example.com"
//                   value={loginForm.email}
//                   onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
//                   required
//                   className="form-input"
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="password" className="form-label">
//                   Password
//                 </label>
//                 <input
//                   id="password"
//                   type="password"
//                   placeholder="••••••••"
//                   value={loginForm.password}
//                   onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
//                   required
//                   className="form-input"
//                 />
//               </div>
//               {loginError && (
//                 <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="login-error">
//                   {loginError}
//                 </motion.div>
//               )}
//               <button type="submit" className="login-button" disabled={isLoading}>
//                 {isLoading ? (
//                   <span className="button-content">
//                     <Loader2 className="button-icon spin" /> Logging in...
//                   </span>
//                 ) : (
//                   "Login"
//                 )}
//               </button>
//             </form>
//           </div>
//         </motion.div>
//       </div>
//     )
//   }

//   // Dashboard
//   return (
//     <div className="dashboard-container">
//       {/* Mobile Menu Button */}
//       <div className="mobile-menu-button">
//         <button onClick={() => setIsMobileMenuOpen(true)} className="icon-button">
//           <Menu className="icon" />
//         </button>
//       </div>

//       {/* Mobile Sidebar */}
//       {isMobileMenuOpen && (
//         <div className="mobile-sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)}>
//           <div className="mobile-sidebar" onClick={(e) => e.stopPropagation()}>
//             <div className="mobile-sidebar-header">
//               <h2 className="mobile-sidebar-title">Admin Dashboard</h2>
//               <p className="mobile-sidebar-description">Navigation Menu</p>
//               <button className="mobile-sidebar-close" onClick={() => setIsMobileMenuOpen(false)}>
//                 <X className="icon" />
//               </button>
//             </div>
//             <div className="mobile-sidebar-content">
//               <MobileSidebarItem
//                 icon={<Package className="icon" />}
//                 label="Items Inventory"
//                 active={activeTab === "allStocks"}
//                 onClick={() => {
//                   setActiveTab("allStocks")
//                   setIsMobileMenuOpen(false)
//                 }}
//               />
//               <MobileSidebarItem
//                 icon={<PlusSquare className="icon" />}
//                 label="Add Items"
//                 active={activeTab === "AddStock"}
//                 onClick={() => {
//                   setActiveTab("AddStock")
//                   setIsMobileMenuOpen(false)
//                 }}
//               />
//               <MobileSidebarItem
//                 icon={<Users className="icon" />}
//                 label="Manage Workers"
//                 active={activeTab === "manageWorkers"}
//                 onClick={() => {
//                   setActiveTab("manageWorkers")
//                   setIsMobileMenuOpen(false)
//                 }}
//               />
//               <MobileSidebarItem
//                 icon={<BarChart2 className="icon" />}
//                 label="Sales Overview"
//                 active={activeTab === "salesOverview"}
//                 onClick={() => {
//                   setActiveTab("salesOverview")
//                   setIsMobileMenuOpen(false)
//                 }}
//               />
//               <MobileSidebarItem
//                 icon={<Receipt className="icon" />}
//                 label="Transactions"
//                 active={activeTab === "transactions"}
//                 onClick={() => {
//                   setActiveTab("transactions")
//                   setIsMobileMenuOpen(false)
//                 }}
//               />
//               <MobileSidebarItem
//                 icon={<ClipboardCheck className="icon" />}
//                 label="Stock Requests"
//                 active={activeTab === "stockRequests"}
//                 onClick={() => {
//                   setActiveTab("stockRequests")
//                   setIsMobileMenuOpen(false)
//                 }}
//               />
//               <div className="sidebar-divider"></div>
//               <MobileSidebarItem
//                 icon={<LogOut className="icon" />}
//                 label="Logout"
//                 onClick={() => {
//                   localStorage.removeItem("token")
//                   setIsAuthenticated(false)
//                   navigate("/login")
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Desktop Sidebar */}
//       <aside className="sidebar">
//         <div className="sidebar-header">
//           <h1 className="sidebar-title">
//             <Package className="sidebar-logo" /> Admin Dashboard
//           </h1>
//         </div>
//         <nav className="sidebar-nav">
//           <SidebarItem
//             icon={<Package className="icon" />}
//             label="Items Inventory"
//             active={activeTab === "allStocks"}
//             onClick={() => setActiveTab("allStocks")}
//           />
//           <SidebarItem
//             icon={<PlusSquare className="icon" />}
//             label="Add Items"
//             active={activeTab === "AddStock"}
//             onClick={() => setActiveTab("AddStock")}
//           />
//           <SidebarItem
//             icon={<Users className="icon" />}
//             label="Manage Workers"
//             active={activeTab === "manageWorkers"}
//             onClick={() => setActiveTab("manageWorkers")}
//           />
//           <SidebarItem
//             icon={<BarChart2 className="icon" />}
//             label="Sales Overview"
//             active={activeTab === "salesOverview"}
//             onClick={() => setActiveTab("salesOverview")}
//           />
//           <SidebarItem
//             icon={<Receipt className="icon" />}
//             label="Transactions"
//             active={activeTab === "transactions"}
//             onClick={() => setActiveTab("transactions")}
//           />
//           <SidebarItem
//             icon={<ClipboardCheck className="icon" />}
//             label="Stock Requests"
//             active={activeTab === "stockRequests"}
//             onClick={() => setActiveTab("stockRequests")}
//           />
//           <div className="sidebar-divider"></div>
//           <SidebarItem
//             icon={<LogOut className="icon" />}
//             label="Logout"
//             onClick={() => {
//               localStorage.removeItem("token")
//               setIsAuthenticated(false)
//               navigate("/login")
//             }}
//           />
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="main-content">
//         <div className="content-container">
//           <AnimatePresence mode="wait">
//             {/* Items Inventory */}
//             {activeTab === "allStocks" && (
//               <motion.div
//                 key="allStocks"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.3 }}
//                 className="content-section"
//               >
//                 <header className="section-header">
//                   <div>
//                     <h1 className="section-title">Items Inventory</h1>
//                     <p className="section-description">Manage your inventory items and stock levels</p>
//                   </div>
//                   <div className="header-actions">
//                     <button className="button button-outline">
//                       <Filter className="button-icon" /> Filter
//                     </button>
//                     <button className="button button-outline">
//                       <Calendar className="button-icon" /> Today
//                     </button>
//                   </div>
//                 </header>

//                 <div className="search-wrapper">
//                   <Search className="search-icon" />
//                   <input
//                     type="text"
//                     placeholder="Search by Name, Brand, or Supplier..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
//                     className="search-input"
//                   />
//                 </div>

//                 <div className="card">
//                   <div className="table-container">
//                     <table className="data-table">
//                       <thead>
//                         <tr>
//                           <th>Item Name</th>
//                           <th>Brand</th>
//                           <th>Amps</th>
//                           <th>Watt</th>
//                           <th>inch/mm</th>
//                           <th>Storage Location</th>
//                           <th>Stock</th>
//                           <th>Expiry Date</th>
//                           <th>Purchase Price</th>
//                           <th>Selling Price</th>
//                           <th>GST/Tax</th>
//                           <th>Manufacturer</th>
//                           <th>Supplier</th>
//                           <th>Contact</th>
//                           <th>Action</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {stocks
//                           .filter(
//                             (item) =>
//                               (item.itemName?.toLowerCase() || "").includes(searchTerm) ||
//                               (item.brand?.toLowerCase() || "").includes(searchTerm) ||
//                               (item.supplier?.toLowerCase() || "").includes(searchTerm),
//                           )
//                           .map((item) => (
//                             <tr key={item._id} className="table-row">
//                               <td className="font-medium">{item.itemName}</td>
//                               <td>{item.brand}</td>
//                               <td>{item.amps}</td>
//                               <td>{item.watt}</td>
//                               <td>{item.inchMm}</td>
//                               <td>{item.storageLocation}</td>
//                               <td>
//                                 <span
//                                   className={`badge ${
//                                     item.stock > 10
//                                       ? "badge-success"
//                                       : item.stock > 0
//                                         ? "badge-warning"
//                                         : "badge-danger"
//                                   }`}
//                                 >
//                                   {item.stock} units
//                                 </span>
//                               </td>
//                               <td>{new Date(item.expiryDate).toLocaleDateString()}</td>
//                               <td>₹{item.purchasePrice}</td>
//                               <td>₹{item.sellingPrice}</td>
//                               <td>{item.gstTax}%</td>
//                               <td>{item.manufacturer}</td>
//                               <td>{item.supplier}</td>
//                               <td>{item.contact || "N/A"}</td>
//                               <td>
//                                 <button
//                                   className="icon-button delete"
//                                   onClick={() => deleteMedicine(item._id, item.itemName)}
//                                 >
//                                   <Trash2 className="icon" />
//                                 </button>
//                               </td>
//                             </tr>
//                           ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {/* Add Items */}
//             {activeTab === "AddStock" && (
//               <motion.div
//                 key="AddStock"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.3 }}
//                 className="content-section"
//               >
//                 <header className="section-header">
//                   <div>
//                     <h1 className="section-title">Add New Item</h1>
//                     <p className="section-description">Add a new item to your inventory</p>
//                   </div>
//                 </header>

//                 <div className="card">
//                   <div className="card-header">
//                     <h2 className="card-title">Item Details</h2>
//                     <p className="card-description">
//                       Fill in the details of the new item you want to add to your inventory.
//                     </p>
//                   </div>
//                   <div className="card-content">
//                     <div className="form-grid">
//                       <div className="form-group">
//                         <label htmlFor="itemName" className="form-label">
//                           Item Name *
//                         </label>
//                         <input
//                           id="itemName"
//                           type="text"
//                           placeholder="Enter item name"
//                           value={formData.itemName}
//                           onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
//                           className="form-input"
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label htmlFor="brand" className="form-label">
//                           Brand
//                         </label>
//                         <input
//                           id="brand"
//                           type="text"
//                           placeholder="Enter brand name"
//                           value={formData.brand}
//                           onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
//                           className="form-input"
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label htmlFor="amps" className="form-label">
//                           Amps *
//                         </label>
//                         <input
//                           id="amps"
//                           type="text"
//                           placeholder="Enter amps"
//                           value={formData.amps}
//                           onChange={(e) => setFormData({ ...formData, amps: e.target.value })}
//                           className="form-input"
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label htmlFor="watt" className="form-label">
//                           Watt *
//                         </label>
//                         <input
//                           id="watt"
//                           type="text"
//                           placeholder="Enter watt"
//                           value={formData.watt}
//                           onChange={(e) => setFormData({ ...formData, watt: e.target.value })}
//                           className="form-input"
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label htmlFor="inchMm" className="form-label">
//                           inch/mm
//                         </label>
//                         <input
//                           id="inchMm"
//                           type="text"
//                           placeholder="Enter inch/mm"
//                           value={formData.inchMm}
//                           onChange={(e) => setFormData({ ...formData, inchMm: e.target.value })}
//                           className="form-input"
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label htmlFor="storageLocation" className="form-label">
//                           Storage Location
//                         </label>
//                         <input
//                           id="storageLocation"
//                           type="text"
//                           placeholder="Enter rack/shelf"
//                           value={formData.storageLocation}
//                           onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
//                           className="form-input"
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label htmlFor="stock" className="form-label">
//                           Stock Quantity *
//                         </label>
//                         <input
//                           id="stock"
//                           type="number"
//                           placeholder="Enter quantity"
//                           value={formData.stock}
//                           onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
//                           className="form-input"
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label htmlFor="expiryDate" className="form-label">
//                           Expiry Date
//                         </label>
//                         <input
//                           id="expiryDate"
//                           type="date"
//                           value={formData.expiryDate}
//                           onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
//                           className="form-input"
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label htmlFor="purchasePrice" className="form-label">
//                           Purchase Price
//                         </label>
//                         <input
//                           id="purchasePrice"
//                           type="number"
//                           placeholder="Enter purchase price"
//                           value={formData.purchasePrice}
//                           onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
//                           className="form-input"
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label htmlFor="sellingPrice" className="form-label">
//                           Selling Price
//                         </label>
//                         <input
//                           id="sellingPrice"
//                           type="number"
//                           placeholder="Enter selling price"
//                           value={formData.sellingPrice}
//                           onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
//                           className="form-input"
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label htmlFor="gstTax" className="form-label">
//                           GST/Tax Rate (%)
//                         </label>
//                         <input
//                           id="gstTax"
//                           type="number"
//                           placeholder="Enter GST/tax rate"
//                           value={formData.gstTax}
//                           onChange={(e) => setFormData({ ...formData, gstTax: e.target.value })}
//                           className="form-input"
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label htmlFor="manufacturer" className="form-label">
//                           Manufacturer
//                         </label>
//                         <input
//                           id="manufacturer"
//                           type="text"
//                           placeholder="Enter manufacturer"
//                           value={formData.manufacturer}
//                           onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
//                           className="form-input"
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label htmlFor="supplier" className="form-label">
//                           Supplier Name *
//                         </label>
//                         <input
//                           id="supplier"
//                           type="text"
//                           placeholder="Enter supplier name"
//                           value={formData.supplier}
//                           onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
//                           className="form-input"
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label htmlFor="contact" className="form-label">
//                           Supplier Contact *
//                         </label>
//                         <input
//                           id="contact"
//                           type="tel"
//                           placeholder="Enter supplier contact"
//                           value={formData.contact}
//                           onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
//                           className="form-input"
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label htmlFor="image" className="form-label">
//                           Item Image
//                         </label>
//                         <input id="image" type="file" onChange={handleImageChange} className="form-input" />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="card-footer">
//                     <button onClick={addMedicine} className="button button-primary" disabled={isLoading}>
//                       {isLoading ? (
//                         <span className="button-content">
//                           <Loader2 className="button-icon spin" /> Adding...
//                         </span>
//                       ) : (
//                         <span className="button-content">
//                           <Plus className="button-icon" /> Add Item
//                         </span>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {/* Manage Workers */}
//             {activeTab === "manageWorkers" && (
//               <motion.div
//                 key="manageWorkers"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.3 }}
//                 className="content-section"
//               >
//                 <header className="section-header">
//                   <div>
//                     <h1 className="section-title">Manage Workers</h1>
//                     <p className="section-description">Add, update, and manage your team members</p>
//                   </div>
//                 </header>

//                 <div className="card">
//                   <div className="card-header">
//                     <h2 className="card-title">Add New Worker</h2>
//                     <p className="card-description">Create a new account for a team member</p>
//                   </div>
//                   <div className="card-content">
//                     <div className="form-grid">
//                       <div className="form-group">
//                         <label htmlFor="workerName" className="form-label">
//                           Name
//                         </label>
//                         <input
//                           id="workerName"
//                           type="text"
//                           placeholder="Enter name"
//                           value={newWorker.name}
//                           onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
//                           className="form-input"
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label htmlFor="workerEmail" className="form-label">
//                           Email
//                         </label>
//                         <input
//                           id="workerEmail"
//                           type="email"
//                           placeholder="Enter email"
//                           value={newWorker.email}
//                           onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })}
//                           className="form-input"
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label htmlFor="workerPassword" className="form-label">
//                           Password
//                         </label>
//                         <input
//                           id="workerPassword"
//                           type="password"
//                           placeholder="Enter password"
//                           value={newWorker.password}
//                           onChange={(e) => setNewWorker({ ...newWorker, password: e.target.value })}
//                           className="form-input"
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label htmlFor="workerRole" className="form-label">
//                           Role
//                         </label>
//                         <select
//                           id="workerRole"
//                           value={newWorker.role}
//                           onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value })}
//                           className="form-select"
//                         >
//                           <option value="Cashier">Cashier</option>
//                           <option value="Labour">Labour</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="card-footer">
//                     <button onClick={addWorker} className="button button-primary" disabled={isLoading}>
//                       {isLoading ? (
//                         <span className="button-content">
//                           <Loader2 className="button-icon spin" /> Adding...
//                         </span>
//                       ) : (
//                         <span className="button-content">
//                           <Plus className="button-icon" /> Add Worker
//                         </span>
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 <div className="card">
//                   <div className="card-header">
//                     <h2 className="card-title">Current Workers</h2>
//                     <p className="card-description">Manage your existing team members</p>
//                   </div>
//                   <div className="card-content">
//                     <table className="data-table">
//                       <thead>
//                         <tr>
//                           <th>Name</th>
//                           <th>Email</th>
//                           <th>Role</th>
//                           <th>Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {workers.map((worker) => (
//                           <tr key={worker._id} className="table-row">
//                             <td className="font-medium">{worker.name}</td>
//                             <td>{worker.email}</td>
//                             <td>
//                               <span className={`badge ${worker.role === "Cashier" ? "badge-info" : "badge-purple"}`}>
//                                 {worker.role}
//                               </span>
//                             </td>
//                             <td>
//                               <div className="button-group">
//                                 <button
//                                   className="button button-small"
//                                   onClick={() => {
//                                     const newPassword = prompt("Enter new password for " + worker.name)
//                                     if (newPassword) updateWorkerPassword(worker._id, newPassword)
//                                   }}
//                                 >
//                                   Update Password
//                                 </button>
//                                 <button
//                                   className="button button-small button-danger"
//                                   onClick={() => deleteWorker(worker._id)}
//                                 >
//                                   Delete
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {/* Sales Overview */}
//             {activeTab === "salesOverview" && (
//               <motion.div
//                 key="salesOverview"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.3 }}
//                 className="content-section"
//               >
//                 <header className="section-header">
//                   <div>
//                     <h1 className="section-title">Sales Overview</h1>
//                     <p className="section-description">Monitor your sales performance and metrics</p>
//                   </div>
//                 </header>

//                 <div className="stats-grid">
//                   <div className="stat-card stat-card-green">
//                     <div className="stat-card-header">
//                       <h2 className="stat-card-title">
//                         <DollarSign className="stat-card-icon" /> Total Sales
//                       </h2>
//                     </div>
//                     <div className="stat-card-content">
//                       <div className="stat-card-info">
//                         <p className="stat-card-value">₹{totalSales.toFixed(2)}</p>
//                         <p className="stat-card-label">All time sales revenue</p>
//                       </div>
//                       <div className="stat-card-icon-container">
//                         <ArrowUpRight className="stat-trend-icon" />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="stat-card stat-card-blue">
//                     <div className="stat-card-header">
//                       <h2 className="stat-card-title">
//                         <CreditCard className="stat-card-icon" /> Total GST Collected
//                       </h2>
//                     </div>
//                     <div className="stat-card-content">
//                       <div className="stat-card-info">
//                         <p className="stat-card-value">₹{totalGST.toFixed(2)}</p>
//                         <p className="stat-card-label">All time GST collection</p>
//                       </div>
//                       <div className="stat-card-icon-container">
//                         <FileText className="stat-trend-icon" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Daily Sales Bar Chart */}
//                 <div className="card">
//                   <div className="card-header">
//                     <h2 className="card-title">Daily Sales</h2>
//                     <p className="card-description">Sales performance by day of the month</p>
//                   </div>
//                   <div className="card-content">
//                     <div className="chart-container">
//                       <ResponsiveContainer width="100%" height={350}>
//                         <BarChart data={dailySales}>
//                           <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                           <XAxis
//                             dataKey="date"
//                             stroke="#6b7280"
//                             axisLine={{ stroke: "#e5e7eb" }}
//                             tickLine={{ stroke: "#e5e7eb" }}
//                           />
//                           <YAxis
//                             stroke="#6b7280"
//                             axisLine={{ stroke: "#e5e7eb" }}
//                             tickLine={{ stroke: "#e5e7eb" }}
//                             tickFormatter={(value) => `₹${value}`}
//                           />
//                           <Tooltip
//                             contentStyle={{
//                               backgroundColor: "white",
//                               border: "none",
//                               borderRadius: "8px",
//                               boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//                             }}
//                             formatter={(value) => [`₹${value}`, "Sales"]}
//                             labelFormatter={(label) => `Day ${label}`}
//                           />
//                           <Bar dataKey="totalSales" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={30} />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Payment Methods Pie Chart */}
//                 <div className="card">
//                   <div className="card-header">
//                     <h2 className="card-title">Payment Methods</h2>
//                     <p className="card-description">Distribution of payment methods used by customers</p>
//                   </div>
//                   <div className="card-content">
//                     <div className="chart-container">
//                       <ResponsiveContainer width="100%" height={350}>
//                         <PieChart>
//                           <Pie
//                             data={(() => {
//                               const paymentMethods = invoices.reduce((acc, inv) => {
//                                 const method = inv.paymentMethod || "unknown"
//                                 acc[method] = (acc[method] || 0) + 1
//                                 return acc
//                               }, {})

//                               return Object.entries(paymentMethods).map(([name, value]) => ({
//                                 name: name.charAt(0).toUpperCase() + name.slice(1),
//                                 value,
//                               }))
//                             })()}
//                             cx="50%"
//                             cy="50%"
//                             labelLine={true}
//                             outerRadius={120}
//                             fill="#8884d8"
//                             dataKey="value"
//                             nameKey="name"
//                             label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                           >
//                             {(() => {
//                               const COLORS = ["#4f46e5", "#3b82f6", "#10b981", "#f59e0b"]
//                               const paymentMethods = invoices.reduce((acc, inv) => {
//                                 const method = inv.paymentMethod || "unknown"
//                                 acc[method] = (acc[method] || 0) + 1
//                                 return acc
//                               }, {})

//                               return Object.keys(paymentMethods).map((_, index) => (
//                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                               ))
//                             })()}
//                           </Pie>
//                           <Tooltip
//                             formatter={(value) => [`${value} transactions`, "Count"]}
//                             contentStyle={{
//                               backgroundColor: "white",
//                               border: "none",
//                               borderRadius: "8px",
//                               boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//                             }}
//                           />
//                           <Legend />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Monthly Sales Trend Line Chart */}
//                 <div className="card">
//                   <div className="card-header">
//                     <h2 className="card-title">Monthly Sales Trend</h2>
//                     <p className="card-description">Sales performance over the past months</p>
//                   </div>
//                   <div className="card-content">
//                     <div className="chart-container">
//                       <ResponsiveContainer width="100%" height={350}>
//                         <LineChart
//                           data={(() => {
//                             const monthlyData = invoices.reduce((acc, inv) => {
//                               const date = new Date(inv.date)
//                               const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`

//                               if (!acc[monthYear]) {
//                                 acc[monthYear] = {
//                                   month: monthYear,
//                                   sales: 0,
//                                   gst: 0,
//                                   transactions: 0,
//                                 }
//                               }

//                               acc[monthYear].sales += inv.totalBill || 0
//                               acc[monthYear].gst += inv.totalGST || 0
//                               acc[monthYear].transactions += 1

//                               return acc
//                             }, {})

//                             return Object.values(monthlyData).sort((a, b) => {
//                               const [aMonth, aYear] = a.month.split("/").map(Number)
//                               const [bMonth, bYear] = b.month.split("/").map(Number)

//                               if (aYear !== bYear) return aYear - bYear
//                               return aMonth - bMonth
//                             })
//                           })()}
//                           margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
//                         >
//                           <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                           <XAxis dataKey="month" stroke="#6b7280" />
//                           <YAxis yAxisId="left" stroke="#4f46e5" tickFormatter={(value) => `₹${value}`} />
//                           <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
//                           <Tooltip
//                             contentStyle={{
//                               backgroundColor: "white",
//                               border: "none",
//                               borderRadius: "8px",
//                               boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//                             }}
//                             formatter={(value, name) => {
//                               if (name === "sales") return [`₹${value.toFixed(2)}`, "Sales"]
//                               if (name === "gst") return [`₹${value.toFixed(2)}`, "GST"]
//                               if (name === "transactions") return [value, "Transactions"]
//                               return [value, name]
//                             }}
//                           />
//                           <Legend />
//                           <Line
//                             yAxisId="left"
//                             type="monotone"
//                             dataKey="sales"
//                             stroke="#4f46e5"
//                             strokeWidth={2}
//                             name="Sales"
//                             dot={{ r: 4 }}
//                             activeDot={{ r: 6 }}
//                           />
//                           <Line
//                             yAxisId="left"
//                             type="monotone"
//                             dataKey="gst"
//                             stroke="#3b82f6"
//                             strokeWidth={2}
//                             name="GST"
//                             dot={{ r: 4 }}
//                           />
//                           <Line
//                             yAxisId="right"
//                             type="monotone"
//                             dataKey="transactions"
//                             stroke="#10b981"
//                             strokeWidth={2}
//                             name="Transactions"
//                             dot={{ r: 4 }}
//                           />
//                         </LineChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {/* Transactions */}
//             {activeTab === "transactions" && (
//               <motion.div
//                 key="transactions"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.3 }}
//                 className="content-section"
//               >
//                 <header className="section-header">
//                   <div>
//                     <h1 className="section-title">Transactions</h1>
//                     <p className="section-description">View and manage all sales transactions</p>
//                   </div>
//                 </header>

//                 <div className="search-wrapper">
//                   <Search className="search-icon" />
//                   <input
//                     type="text"
//                     placeholder="Search by Bill ID or Customer Name..."
//                     value={transactionSearch}
//                     onChange={(e) => setTransactionSearch(e.target.value.toLowerCase())}
//                     className="search-input"
//                   />
//                 </div>

//                 <div className="card">
//                   <table className="data-table">
//                     <thead>
//                       <tr>
//                         <th>Bill ID</th>
//                         <th>Customer Name</th>
//                         <th>Phone</th>
//                         <th>Total Bill</th>
//                         <th>Date</th>
//                         <th>Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {invoices
//                         .filter(
//                           (inv) =>
//                             inv.billId.toLowerCase().includes(transactionSearch) ||
//                             inv.customerName.toLowerCase().includes(transactionSearch),
//                         )
//                         .map((inv) => (
//                           <tr key={inv._id} className="table-row">
//                             <td className="font-medium">{inv.billId}</td>
//                             <td>{inv.customerName}</td>
//                             <td>{inv.customerPhone}</td>
//                             <td>
//                               <span className="price">₹{inv.totalBill}</span>
//                             </td>
//                             <td>{new Date(inv.date).toLocaleDateString()}</td>
//                             <td>
//                               <button className="button button-small" onClick={() => setSelectedTransaction(inv)}>
//                                 View Details
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Transaction Details Modal */}
//                 {selectedTransaction && (
//                   <div className="modal-overlay" onClick={() => setSelectedTransaction(null)}>
//                     <div className="modal" onClick={(e) => e.stopPropagation()}>
//                       <div className="modal-header">
//                         <h2 className="modal-title">Transaction Details</h2>
//                         <p className="modal-description">
//                           Bill ID: {selectedTransaction.billId} | Date:{" "}
//                           {new Date(selectedTransaction.date).toLocaleString()}
//                         </p>
//                         <button className="modal-close" onClick={() => setSelectedTransaction(null)}>
//                           <X className="icon" />
//                         </button>
//                       </div>

//                       <div className="modal-content">
//                         <div className="customer-details">
//                           <div className="detail-item">
//                             <p className="detail-label">Customer Name</p>
//                             <p className="detail-value">{selectedTransaction.customerName}</p>
//                           </div>
//                           <div className="detail-item">
//                             <p className="detail-label">Phone</p>
//                             <p className="detail-value">{selectedTransaction.customerPhone}</p>
//                           </div>
//                           <div className="detail-item">
//                             <p className="detail-label">Payment Method</p>
//                             <p className="detail-value capitalize">{selectedTransaction.paymentMethod}</p>
//                           </div>
//                         </div>

//                         <div className="divider"></div>

//                         <div className="items-section">
//                           <h3 className="section-subtitle">Items Purchased</h3>
//                           <table className="data-table">
//                             <thead>
//                               <tr>
//                                 <th>Item Name</th>
//                                 <th>Quantity</th>
//                                 <th>Price</th>
//                                 <th>GST</th>
//                                 <th>Total</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {selectedTransaction.items &&
//                                 selectedTransaction.items.map((item, index) => (
//                                   <tr key={index}>
//                                     <td className="font-medium">{item.itemName}</td>
//                                     <td>{item.quantity}</td>
//                                     <td>₹{item.sellingPrice}</td>
//                                     <td>{item.gstTax}%</td>
//                                     <td>₹{(item.sellingPrice * item.quantity * (1 + item.gstTax / 100)).toFixed(2)}</td>
//                                   </tr>
//                                 ))}
//                             </tbody>
//                           </table>
//                         </div>

//                         <div className="divider"></div>

//                         <div className="bill-summary">
//                           <div className="summary-row">
//                             <span className="summary-label">Subtotal:</span>
//                             <span className="summary-value">₹{selectedTransaction.totalAmount}</span>
//                           </div>
//                           <div className="summary-row">
//                             <span className="summary-label">GST Amount:</span>
//                             <span className="summary-value">₹{selectedTransaction.totalGST}</span>
//                           </div>
//                           <div className="divider"></div>
//                           <div className="summary-row total">
//                             <span className="summary-label">Total Bill:</span>
//                             <span className="summary-value">₹{selectedTransaction.totalBill}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </motion.div>
//             )}

//             {/* Stock Requests */}
//             {activeTab === "stockRequests" && (
//               <motion.div
//                 key="stockRequests"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.3 }}
//                 className="content-section"
//               >
//                 <header className="section-header">
//                   <div>
//                     <h1 className="section-title">Stock Requests</h1>
//                     <p className="section-description">Manage incoming stock requests from your team</p>
//                   </div>
//                 </header>

//                 <div className="card">
//                   <table className="data-table">
//                     <thead>
//                       <tr>
//                         <th>Date</th>
//                         <th>Item Name</th>
//                         <th>Brand</th>
//                         <th>Quantity</th>
//                         <th>Supplier Name</th>
//                         <th>Supplier Contact</th>
//                         <th>Status</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {requests.map((req) => (
//                         <tr key={req._id} className="table-row">
//                           <td>{new Date(req.date).toLocaleDateString()}</td>
//                           <td className="font-medium">{req.itemName}</td>
//                           <td>{req.brand}</td>
//                           <td>{req.stock} units</td>
//                           <td>{req.supplier}</td>
//                           <td>{req.contact || "N/A"}</td>
//                           <td>
//                             <span
//                               className={`badge ${
//                                 req.status === "Approved"
//                                   ? "badge-success"
//                                   : req.status === "Rejected"
//                                     ? "badge-danger"
//                                     : "badge-warning"
//                               }`}
//                             >
//                               {req.status}
//                             </span>
//                           </td>
//                           <td>
//                             {req.status === "Pending" && (
//                               <div className="button-group">
//                                 <button
//                                   className="button button-small button-success"
//                                   onClick={() => handleApproveRequest(req._id)}
//                                 >
//                                   <CheckCircle className="button-icon" /> Approve
//                                 </button>
//                                 <button
//                                   className="button button-small button-danger"
//                                   onClick={() => handleRejectRequest(req._id)}
//                                 >
//                                   <XCircle className="button-icon" /> Reject
//                                 </button>
//                               </div>
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </main>
//     </div>
//   )
// }

// // Sidebar Item Component
// function SidebarItem({ icon, label, active, onClick }) {
//   return (
//     <motion.button
//       whileHover={{ x: 4 }}
//       whileTap={{ scale: 0.95 }}
//       onClick={onClick}
//       className={`sidebar-item ${active ? "active" : ""}`}
//     >
//       <span className={`sidebar-item-icon ${active ? "active" : ""}`}>{icon}</span>
//       {label}
//       {active && (
//         <motion.div
//           layoutId="activeIndicator"
//           className="active-indicator"
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ type: "spring", stiffness: 500, damping: 30 }}
//         />
//       )}
//     </motion.button>
//   )
// }

// // Mobile Sidebar Item Component
// function MobileSidebarItem({ icon, label, active, onClick }) {
//   return (
//     <motion.button
//       whileTap={{ scale: 0.95 }}
//       onClick={onClick}
//       className={`mobile-sidebar-item ${active ? "active" : ""}`}
//     >
//       <span className={`mobile-sidebar-item-icon ${active ? "active" : ""}`}>{icon}</span>
//       {label}
//       {active && (
//         <motion.div
//           layoutId="mobileActiveIndicator"
//           className="active-indicator"
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ type: "spring", stiffness: 500, damping: 30 }}
//         />
//       )}
//     </motion.button>
//   )
// }





































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
import "../Dashboard/AdminDashboard.css"

// Add these imports at the top with the other imports
import { PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts"

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

                {/* Payment Methods Pie Chart */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Payment Methods</h2>
                    <p className="card-description">Distribution of payment methods used by customers</p>
                  </div>
                  <div className="card-content">
                    <div className="chart-container">
                      <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                          <Pie
                            data={(() => {
                              const paymentMethods = invoices.reduce((acc, inv) => {
                                const method = inv.paymentMethod || "unknown"
                                acc[method] = (acc[method] || 0) + 1
                                return acc
                              }, {})

                              return Object.entries(paymentMethods).map(([name, value]) => ({
                                name: name.charAt(0).toUpperCase() + name.slice(1),
                                value,
                              }))
                            })()}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {(() => {
                              const COLORS = ["#4f46e5", "#3b82f6", "#10b981", "#f59e0b"]
                              const paymentMethods = invoices.reduce((acc, inv) => {
                                const method = inv.paymentMethod || "unknown"
                                acc[method] = (acc[method] || 0) + 1
                                return acc
                              }, {})

                              return Object.keys(paymentMethods).map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))
                            })()}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value} transactions`, "Count"]}
                            contentStyle={{
                              backgroundColor: "white",
                              border: "none",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Monthly Sales Trend Line Chart */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Monthly Sales Trend</h2>
                    <p className="card-description">Sales performance over the past months</p>
                  </div>
                  <div className="card-content">
                    <div className="chart-container">
                      <ResponsiveContainer width="100%" height={350}>
                        <LineChart
                          data={(() => {
                            const monthlyData = invoices.reduce((acc, inv) => {
                              const date = new Date(inv.date)
                              const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`

                              if (!acc[monthYear]) {
                                acc[monthYear] = {
                                  month: monthYear,
                                  sales: 0,
                                  gst: 0,
                                  transactions: 0,
                                }
                              }

                              acc[monthYear].sales += inv.totalBill || 0
                              acc[monthYear].gst += inv.totalGST || 0
                              acc[monthYear].transactions += 1

                              return acc
                            }, {})

                            return Object.values(monthlyData).sort((a, b) => {
                              const [aMonth, aYear] = a.month.split("/").map(Number)
                              const [bMonth, bYear] = b.month.split("/").map(Number)

                              if (aYear !== bYear) return aYear - bYear
                              return aMonth - bMonth
                            })
                          })()}
                          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="month" stroke="#6b7280" />
                          <YAxis yAxisId="left" stroke="#4f46e5" tickFormatter={(value) => `₹${value}`} />
                          <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "none",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            }}
                            formatter={(value, name) => {
                              if (name === "sales") return [`₹${value.toFixed(2)}`, "Sales"]
                              if (name === "gst") return [`₹${value.toFixed(2)}`, "GST"]
                              if (name === "transactions") return [value, "Transactions"]
                              return [value, name]
                            }}
                          />
                          <Legend />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="sales"
                            stroke="#4f46e5"
                            strokeWidth={2}
                            name="Sales"
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="gst"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            name="GST"
                            dot={{ r: 4 }}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="transactions"
                            stroke="#10b981"
                            strokeWidth={2}
                            name="Transactions"
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Top Selling Items Bar Chart */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Top Selling Items</h2>
                    <p className="card-description">Most frequently sold items by quantity</p>
                  </div>
                  <div className="card-content">
                    <div className="chart-container">
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart
                          data={(() => {
                            const itemSales = {}

                            invoices.forEach((invoice) => {
                              if (invoice.items && Array.isArray(invoice.items)) {
                                invoice.items.forEach((item) => {
                                  if (!itemSales[item.itemName]) {
                                    itemSales[item.itemName] = {
                                      name: item.itemName,
                                      quantity: 0,
                                      revenue: 0,
                                    }
                                  }
                                  itemSales[item.itemName].quantity += item.quantity || 0
                                  itemSales[item.itemName].revenue += item.sellingPrice * item.quantity || 0
                                })
                              }
                            })

                            return Object.values(itemSales)
                              .sort((a, b) => b.quantity - a.quantity)
                              .slice(0, 10)
                          })()}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 100, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                          <XAxis type="number" stroke="#6b7280" />
                          <YAxis
                            dataKey="name"
                            type="category"
                            stroke="#6b7280"
                            width={100}
                            tickFormatter={(value) => (value.length > 15 ? `${value.substring(0, 15)}...` : value)}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "none",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            }}
                            formatter={(value, name) => {
                              if (name === "quantity") return [value, "Units Sold"]
                              if (name === "revenue") return [`₹${value.toFixed(2)}`, "Revenue"]
                              return [value, name]
                            }}
                          />
                          <Legend />
                          <Bar dataKey="quantity" name="Units Sold" fill="#4f46e5" radius={[0, 4, 4, 0]} />
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
                          <td className="font-medium">{req.itemName}</td>
                          <td>{req.brand}</td>
                          <td>{req.stock} units</td>
                          <td>{req.supplier}</td>
                          <td>{req.contact || "N/A"}</td>
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
