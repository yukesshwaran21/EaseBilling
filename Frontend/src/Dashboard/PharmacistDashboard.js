// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import { FaPills, FaShoppingCart, FaSearch } from "react-icons/fa";
// // import { useLocation } from "react-router-dom";
// // import "./PharmacistDashboard.css";

// // const PharmacistDashboard = () => {
// //   const [activeTab, setActiveTab] = useState("allStocks");
// //   const [medicines, setMedicines] = useState([]);
// //   const [requests, setRequests] = useState([]);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [formData, setFormData] = useState({
// //     medicineName: "",
// //     batchNumber: "",
// //     category: "",
// //     dosage: "",
// //     composition: "",
// //     storageLocation: "",
// //     quantity: "",
// //     expiryDate: "",
// //     purchasePrice: "",
// //     sellingPrice: "",
// //     gstTaxRate: "",
// //     manufacturer: "",
// //     supplier: "",
// //     supplierContact: "",
// //     image: null,
// //   });
// //   const location = useLocation();
// //   const email = location.state?.email;

// //   useEffect(() => {
// //     fetchMedicines();
// //     fetchRequests();
// //   }, []);

// //   const fetchMedicines = async () => {
// //     try {
// //       const token = localStorage.getItem('token');
// //       if (!token) {
// //         console.error('No authentication token found');
// //         return;
// //       }

// //       const response = await axios.get("https://easebilling.onrender.com/api/items", {
// //         headers: {
// //           'Authorization': `Bearer ${token}`
// //         }
// //       });
// //       console.log("Fetched items:", response.data);
// //       setMedicines(response.data);
// //     } catch (error) {
// //       console.error("Error fetching medicines:", error.response?.data || error);
// //       if (error.response?.status === 401) {
// //         alert("Please log in again to continue");
// //       } else {
// //         alert("Failed to fetch items. Please try again later.");
// //       }
// //     }
// //   };

// //   const fetchRequests = async () => {
// //     try {
// //       const token = localStorage.getItem('token');
// //       if (!token) {
// //         console.error('No authentication token found');
// //         return;
// //       }

// //       const response = await axios.get("https://easebilling.onrender.com/api/item-requests", {
// //         headers: {
// //           'Authorization': `Bearer ${token}`
// //         }
// //       });
// //       console.log("Fetched requests:", response.data);
// //       setRequests(response.data);
// //     } catch (error) {
// //       console.error("Error fetching requests:", error.response?.data || error);
// //       if (error.response?.status === 401) {
// //         alert("Please log in again to continue");
// //       } else {
// //         alert("Failed to fetch requests. Please try again later.");
// //       }
// //     }
// //   };

// //   const handleImageChange = (e) => {
// //     setFormData({ ...formData, image: e.target.files[0] });
// //   };

// //   const requestMedicine = async () => {
// //     // Log the form data before validation
// //     console.log("Form Data before validation:", formData);
// //     console.log("Email:", email);

// //     if (
// //       !formData.medicineName ||
// //       !formData.quantity ||
// //       !formData.category ||
// //       !formData.dosage ||
// //       !formData.supplier ||
// //       !formData.supplierContact.trim() ||
// //       !email
// //     ) {
// //       alert("Please fill in all required fields: Item Name, Quantity, Amps, Watt, Supplier Name, Supplier Contact");
// //       return;
// //     }

// //     if (parseInt(formData.quantity) <= 0) {
// //       alert("Quantity must be a positive number");
// //       return;
// //     }

// //     if (!/^\d{10}$/.test(formData.supplierContact.trim())) {
// //       alert("Supplier Contact must be a valid 10-digit phone number");
// //       return;
// //     }

// //     try {
// //       const requestData = {
// //         itemName: formData.medicineName,
// //         brand: formData.batchNumber,
// //         amps: formData.category,
// //         watt: formData.dosage,
// //         inchMm: formData.composition,
// //         storageLocation: formData.storageLocation,
// //         stock: parseInt(formData.quantity),
// //         expiryDate: formData.expiryDate,
// //         purchasePrice: parseFloat(formData.purchasePrice) || 0,
// //         sellingPrice: parseFloat(formData.sellingPrice) || 0,
// //         gstTax: parseFloat(formData.gstTaxRate) || 0,
// //         manufacturer: formData.manufacturer,
// //         supplier: formData.supplier,
// //         contact: formData.supplierContact.trim(),
// //         email: email
// //       };

// //       console.log("Sending request data:", requestData);

// //       const response = await axios.post("https://easebilling.onrender.com/api/request-item", requestData, {
// //         headers: { "Content-Type": "application/json" }
// //       });

// //       console.log("Server response:", response.data);
// //       alert("Request sent to admin");
// //       fetchRequests();
// //       setFormData({
// //         medicineName: "",
// //         batchNumber: "",
// //         category: "",
// //         dosage: "",
// //         composition: "",
// //         storageLocation: "",
// //         quantity: "",
// //         expiryDate: "",
// //         purchasePrice: "",
// //         sellingPrice: "",
// //         gstTaxRate: "",
// //         manufacturer: "",
// //         supplier: "",
// //         supplierContact: "",
// //         image: null,
// //       });
// //     } catch (error) {
// //       console.error("Error requesting medicine:", error.response?.data || error);
// //       alert(`Failed to request medicine: ${error.response?.data?.error || "Unknown error"}`);
// //     }
// //   };

// //   return (
// //     <div className="dashboard-container">
// //       <div className="sidebar">
// //         <h2 className="dashboard-title">Labour</h2>
// //         <button
// //           className={`sidebar-button ${activeTab === "allStocks" ? "active" : ""}`}
// //           onClick={() => setActiveTab("allStocks")}
// //         >
// //           <FaPills /> Items
// //         </button>
// //         <button
// //           className={`sidebar-button ${activeTab === "AddStock" ? "active" : ""}`}
// //           onClick={() => setActiveTab("AddStock")}
// //         >
// //           <FaShoppingCart /> Requests
// //         </button>
// //       </div>

// //       <div className="admin-content">
// //         {activeTab === "allStocks" && (
// //           <div className="card card-gray">
// //             <h3>Items</h3>
// //             <div className="search-box">
// //               <FaSearch className="search-icon" />
// //               <input
// //                 type="text"
// //                 placeholder="Search by Name, Batch No, or Supplier"
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
// //               />
// //             </div>

// //             <div className="table-wrapper">
// //               <div className="table-container">
// //                 <table className="medicine-table">
// //                   <thead>
// //                     <tr>
// //                       <th>Item Name</th>
// //                       <th>Brand</th>
// //                       <th>Amps</th>
// //                       <th>watt</th>
// //                       <th>inch/mm</th>
// //                       <th>Storage Location</th>
// //                       <th>Stock</th>
// //                       <th>Expiry Date</th>
// //                       <th>Purchase Price</th>
// //                       <th>Selling Price</th>
// //                       <th>GST/Tax</th>
// //                       <th>Manufacturer</th>
// //                       <th>Supplier</th>
// //                       <th>Contact</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {medicines
// //                       .filter(
// //                         (med) =>
// //                           med.itemName.toLowerCase().includes(searchTerm) ||
// //                           med.brand.toLowerCase().includes(searchTerm) ||
// //                           med.supplier.toLowerCase().includes(searchTerm)
// //                       )
// //                       .map((med) => (
// //                         <tr key={med._id}>
// //                           <td>{med.itemName}</td>
// //                           <td>{med.brand}</td>
// //                           <td>{med.amps}</td>
// //                           <td>{med.watt}</td>
// //                           <td>{med.inchMm}</td>
// //                           <td>{med.storageLocation}</td>
// //                           <td>{med.stock} units</td>
// //                           <td>{new Date(med.expiryDate).toLocaleDateString()}</td>
// //                           <td>₹{med.purchasePrice}</td>
// //                           <td>₹{med.sellingPrice}</td>
// //                           <td>{med.gstTax}%</td>
// //                           <td>{med.manufacturer}</td>
// //                           <td>{med.supplier}</td>
// //                           <td>{med.contact || "N/A"}</td>
// //                         </tr>
// //                       ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {activeTab === "AddStock" && (
// //           <div className="card card-blue">
// //             <h3>Stock Management</h3>
// //             <input
// //               type="text"
// //               placeholder="Item Name *"
// //               value={formData.medicineName}
// //               onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
// //             />
// //             <input
// //               type="text"
// //               placeholder="Brand"
// //               value={formData.batchNumber}
// //               onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
// //             />
// //             <input
// //               type="text"
// //               placeholder="Amp *"
// //               value={formData.category}
// //               onChange={(e) => setFormData({ ...formData, category: e.target.value })}
// //             />
// //             <input
// //               type="text"
// //               placeholder="Watt *"
// //               value={formData.dosage}
// //               onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
// //             />
// //             <input
// //               type="text"
// //               placeholder="inch/mm"
// //               value={formData.composition}
// //               onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
// //             />
// //             <input
// //               type="text"
// //               placeholder="Storage Location (Rack/Shelf)"
// //               value={formData.storageLocation}
// //               onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
// //             />
// //             <input
// //               type="number"
// //               placeholder="Stock Quantity *"
// //               value={formData.quantity}
// //               onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
// //             />
// //             <input
// //               type="date"
// //               placeholder="Expiry Date"
// //               value={formData.expiryDate}
// //               onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
// //             />
// //             <input
// //               type="number"
// //               placeholder="Purchase Price"
// //               value={formData.purchasePrice}
// //               onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
// //             />
// //             <input
// //               type="number"
// //               placeholder="Selling Price"
// //               value={formData.sellingPrice}
// //               onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
// //             />
// //             <input
// //               type="number"
// //               placeholder="GST/Tax Rate"
// //               value={formData.gstTaxRate}
// //               onChange={(e) => setFormData({ ...formData, gstTaxRate: e.target.value })}
// //             />
// //             <input
// //               type="text"
// //               placeholder="Manufacturer"
// //               value={formData.manufacturer}
// //               onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
// //             />
// //             <input
// //               type="text"
// //               placeholder="Supplier Name *"
// //               value={formData.supplier}
// //               onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
// //             />
// //             <input
// //               type="tel"
// //               placeholder="Supplier Contact *"
// //               value={formData.supplierContact}
// //               onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
// //             />
// //             <button className="btn btn-green" onClick={requestMedicine}>
// //               Request Item
// //             </button>
// //             {requests.length > 0 && (
// //               <>
// //                 <h3>Order Requests</h3>
// //                 <div className="table-container">
// //                   <table className="requests-table">
// //                     <thead>
// //                       <tr>
// //                         <th>Date</th>
// //                         <th>Item Name</th>
// //                         <th>Brand</th>
// //                         <th>Amps</th>
// //                         <th>Watt</th>
// //                         <th>inch/mm</th>
// //                         <th>Quantity</th>
// //                         <th>Supplier Name</th>
// //                         <th>Supplier Contact</th>
// //                         <th>Status</th>
// //                       </tr>
// //                     </thead>
// //                     <tbody>
// //                       {requests.map((req) => (
// //                         <tr key={req._id}>
// //                           <td>{new Date(req.date).toLocaleDateString()}</td>
// //                           <td>{req.medicineName}</td>
// //                           <td>{req.batchNumber}</td>
// //                           <td>{req.category}</td>
// //                           <td>{req.dosage}</td>
// //                           <td>{req.composition}</td>
// //                           <td>{req.quantity} units</td>
// //                           <td>{req.supplier}</td>
// //                           <td>{req.supplierContact || "N/A"}</td>
// //                           <td>
// //                             <strong>{req.status}</strong>
// //                           </td>
// //                         </tr>
// //                       ))}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //               </>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default PharmacistDashboard;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaPills, FaShoppingCart, FaSearch } from "react-icons/fa";
// import { useLocation } from "react-router-dom";
// import "../Dashboard/PharmacistDashboard.css";

// import { useNavigate } from "react-router-dom";
// const PharmacistDashboard = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("allStocks");
//   const [medicines, setMedicines] = useState([]);
//   const [requests, setRequests] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [formData, setFormData] = useState({
//     medicineName: "",
//     batchNumber: "",
//     category: "",
//     dosage: "",
//     composition: "",
//     storageLocation: "",
//     quantity: "",
//     expiryDate: "",
//     purchasePrice: "",
//     sellingPrice: "",
//     gstTaxRate: "",
//     manufacturer: "",
//     supplier: "",
//     supplierContact: "",
//     image: null,
//   });
//   const location = useLocation();
//   const email = location.state?.email;

//   useEffect(() => {
//     fetchMedicines();
//     fetchRequests();
//   }, []);

//   const fetchMedicines = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.error('No authentication token found');
//         return;
//       }

//       const response = await axios.get("https://easebilling.onrender.com/api/items", {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       console.log("Fetched items:", response.data);
      
//       // Ensure the response data is an array
//       setMedicines(Array.isArray(response.data) ? response.data : []);
//     } catch (error) {
//       console.error("Error fetching medicines:", error.response?.data || error);
//       if (error.response?.status === 401) {
//         alert("Please log in again to continue");
//       } else {
//         alert("Failed to fetch items. Please try again later.");
//       }
//     }
//   };

//   const fetchRequests = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.error('No authentication token found');
//         return;
//       }

//       const response = await axios.get("https://easebilling.onrender.com/api/item-requests", {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       console.log("Fetched requests:", response.data);
//       setRequests(response.data);
//     } catch (error) {
//       console.error("Error fetching requests:", error.response?.data || error);
//       if (error.response?.status === 401) {
//         alert("Please log in again to continue");
//       } else {
//         alert("Failed to fetch requests. Please try again later.");
//       }
//     }
//   };

//   const handleImageChange = (e) => {
//     setFormData({ ...formData, image: e.target.files[0] });
//   };

//   const requestMedicine = async () => {
//     // Log the form data before validation
//     console.log("Form Data before validation:", formData);
//     console.log("Email:", email);

//     if (
//       !formData.medicineName ||
//       !formData.quantity ||
//       !formData.category ||
//       !formData.dosage ||
//       !formData.supplier ||
//       !formData.supplierContact.trim() ||
//       !email
//     ) {
//       alert("Please fill in all required fields: Item Name, Quantity, Amps, Watt, Supplier Name, Supplier Contact");
//       return;
//     }

//     if (parseInt(formData.quantity) <= 0) {
//       alert("Quantity must be a positive number");
//       return;
//     }

//     if (!/^\d{10}$/.test(formData.supplierContact.trim())) {
//       alert("Supplier Contact must be a valid 10-digit phone number");
//       return;
//     }

//     try {
//       const requestData = {
//         itemName: formData.medicineName,
//         brand: formData.batchNumber,
//         amps: formData.category,
//         watt: formData.dosage,
//         inchMm: formData.composition,
//         storageLocation: formData.storageLocation,
//         stock: parseInt(formData.quantity),
//         expiryDate: formData.expiryDate,
//         purchasePrice: parseFloat(formData.purchasePrice) || 0,
//         sellingPrice: parseFloat(formData.sellingPrice) || 0,
//         gstTax: parseFloat(formData.gstTaxRate) || 0,
//         manufacturer: formData.manufacturer,
//         supplier: formData.supplier,
//         contact: formData.supplierContact.trim(),
//         email: email
//       };

//       console.log("Sending request data:", requestData);

//       const response = await axios.post("https://easebilling.onrender.com/api/request-item", requestData, {
//         headers: { "Content-Type": "application/json" }
//       });

//       console.log("Server response:", response.data);
//       alert("Request sent to admin");
//       fetchRequests();
//       setFormData({
//         medicineName: "",
//         batchNumber: "",
//         category: "",
//         dosage: "",
//         composition: "",
//         storageLocation: "",
//         quantity: "",
//         expiryDate: "",
//         purchasePrice: "",
//         sellingPrice: "",
//         gstTaxRate: "",
//         manufacturer: "",
//         supplier: "",
//         supplierContact: "",
//         image: null,
//       });
//     } catch (error) {
//       console.error("Error requesting medicine:", error.response?.data || error);
//       alert(`Failed to request medicine: ${error.response?.data?.error || "Unknown error"}`);
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       <div className="sidebar">
//         <h2 className="dashboard-title">Labour</h2>
//         <button
//           className={`sidebar-button ${activeTab === "allStocks" ? "active" : ""}`}
//           onClick={() => setActiveTab("allStocks")}
//         >
//           <FaPills /> Items
//         </button>
//         <button
//           className={`sidebar-button ${activeTab === "AddStock" ? "active" : ""}`}
//           onClick={() => setActiveTab("AddStock")}
//         >
//           <FaShoppingCart /> Requests
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
//           <div className="card card-gray">
//             <h3>Items</h3>
//             <div className="search-box">
//               <FaSearch className="search-icon" />
//               <input
//                 type="text"
//                 placeholder="Search by Name, Batch No, or Supplier"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
//               />
//             </div>

//             <div className="table-wrapper">
//               <div className="table-container">
//                 <table className="medicine-table">
//                   <thead>
//                     <tr>
//                       <th>Item Name</th>
//                       <th>Brand</th>
//                       <th>Amps</th>
//                       <th>watt</th>
//                       <th>inch/mm</th>
//                       <th>Storage Location</th>
//                       <th>Stock</th>
//                       <th>Expiry Date</th>
//                       <th>Purchase Price</th>
//                       <th>Selling Price</th>
//                       <th>GST/Tax</th>
//                       <th>Manufacturer</th>
//                       <th>Supplier</th>
//                       <th>Contact</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {Array.isArray(medicines) && medicines.length > 0 ? (
//                       medicines
//                         .filter(
//                           (med) =>
//                             med.itemName.toLowerCase().includes(searchTerm) ||
//                             med.brand.toLowerCase().includes(searchTerm) ||
//                             med.supplier.toLowerCase().includes(searchTerm)
//                         )
//                         .map((med) => (
//                           <tr key={med._id}>
//                             <td>{med.itemName}</td>
//                             <td>{med.brand}</td>
//                             <td>{med.amps}</td>
//                             <td>{med.watt}</td>
//                             <td>{med.inchMm}</td>
//                             <td>{med.storageLocation}</td>
//                             <td>{med.stock} units</td>
//                             <td>{new Date(med.expiryDate).toLocaleDateString()}</td>
//                             <td>₹{med.purchasePrice}</td>
//                             <td>₹{med.sellingPrice}</td>
//                             <td>{med.gstTax}%</td>
//                             <td>{med.manufacturer}</td>
//                             <td>{med.supplier}</td>
//                             <td>{med.contact || "N/A"}</td>
//                           </tr>
//                         ))
//                     ) : (
//                       <tr>
//                         <td colSpan="13">No medicines available</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === "AddStock" && (
//           <div className="card card-blue">
//             <h3>Stock Management</h3>
//             <input
//               type="text"
//               placeholder="Item Name *"
//               value={formData.medicineName}
//               onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
//             />
//             <input
//               type="text"
//               placeholder="Brand"
//               value={formData.batchNumber}
//               onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
//             />
//             <input
//               type="text"
//               placeholder="Amp *"
//               value={formData.category}
//               onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//             />
//             <input
//               type="text"
//               placeholder="Watt *"
//               value={formData.dosage}
//               onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
//             />
//             <input
//               type="text"
//               placeholder="Composition"
//               value={formData.composition}
//               onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
//             />
//             <input
//               type="text"
//               placeholder="Storage Location"
//               value={formData.storageLocation}
//               onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
//             />
//             <input
//               type="number"
//               placeholder="Quantity *"
//               value={formData.quantity}
//               onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
//             />
//             <input
//               type="date"
//               placeholder="Expiry Date"
//               value={formData.expiryDate}
//               onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
//             />
//             <input
//               type="number"
//               placeholder="Purchase Price"
//               value={formData.purchasePrice}
//               onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
//             />
//             <input
//               type="number"
//               placeholder="Selling Price"
//               value={formData.sellingPrice}
//               onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
//             />
//             <input
//               type="number"
//               placeholder="GST Tax Rate"
//               value={formData.gstTaxRate}
//               onChange={(e) => setFormData({ ...formData, gstTaxRate: e.target.value })}
//             />
//             <input
//               type="text"
//               placeholder="Manufacturer"
//               value={formData.manufacturer}
//               onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
//             />
//             <input
//               type="text"
//               placeholder="Supplier *"
//               value={formData.supplier}
//               onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
//             />
//             <input
//               type="text"
//               placeholder="Supplier Contact *"
//               value={formData.supplierContact}
//               onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
//             />
//             <input type="file" onChange={handleImageChange} />
//             <button onClick={requestMedicine}>Submit Request</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PharmacistDashboard;







































"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Package,
  ShoppingCart,
  Search,
  LogOut,
  Calendar,
  DollarSign,
  Truck,
  User,
  Phone,
  Layers,
  Grid,
  Zap,
  MapPin,
  Box,
  Clock,
  Plus,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import "../Dashboard/PharmacistDashboard.css"

export default function PharmacistDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"))
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("allStocks")
  const [medicines, setMedicines] = useState([])
  const [requests, setRequests] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    medicineName: "",
    batchNumber: "",
    category: "",
    dosage: "",
    composition: "",
    storageLocation: "",
    quantity: "",
    expiryDate: "",
    purchasePrice: "",
    sellingPrice: "",
    gstTaxRate: "",
    manufacturer: "",
    supplier: "",
    supplierContact: "",
    image: null,
  })
  const location = useLocation()
  const email = location.state?.email

  useEffect(() => {
    fetchMedicines()
    fetchRequests()
  }, [])

  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("No authentication token found")
        return
      }

      const response = await axios.get("https://easebilling.onrender.com/api/items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Fetched items:", response.data)

      // Ensure the response data is an array
      setMedicines(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error("Error fetching medicines:", error.response?.data || error)
      if (error.response?.status === 401) {
        alert("Please log in again to continue")
      } else {
        alert("Failed to fetch items. Please try again later.")
      }
    }
  }

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("No authentication token found")
        return
      }

      const response = await axios.get("https://easebilling.onrender.com/api/item-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log("Fetched requests:", response.data)
      setRequests(response.data)
    } catch (error) {
      console.error("Error fetching requests:", error.response?.data || error)
      if (error.response?.status === 401) {
        alert("Please log in again to continue")
      } else {
        alert("Failed to fetch requests. Please try again later.")
      }
    }
  }

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] })
  }

  const requestMedicine = async () => {
    // Log the form data before validation
    console.log("Form Data before validation:", formData)
    console.log("Email:", email)

    if (
      !formData.medicineName ||
      !formData.quantity ||
      !formData.category ||
      !formData.dosage ||
      !formData.supplier ||
      !formData.supplierContact.trim() ||
      !email
    ) {
      alert("Please fill in all required fields: Item Name, Quantity, Amps, Watt, Supplier Name, Supplier Contact")
      return
    }

    if (Number.parseInt(formData.quantity) <= 0) {
      alert("Quantity must be a positive number")
      return
    }

    if (!/^\d{10}$/.test(formData.supplierContact.trim())) {
      alert("Supplier Contact must be a valid 10-digit phone number")
      return
    }

    try {
      const requestData = {
        itemName: formData.medicineName,
        brand: formData.batchNumber,
        amps: formData.category,
        watt: formData.dosage,
        inchMm: formData.composition,
        storageLocation: formData.storageLocation,
        stock: Number.parseInt(formData.quantity),
        expiryDate: formData.expiryDate,
        purchasePrice: Number.parseFloat(formData.purchasePrice) || 0,
        sellingPrice: Number.parseFloat(formData.sellingPrice) || 0,
        gstTax: Number.parseFloat(formData.gstTaxRate) || 0,
        manufacturer: formData.manufacturer,
        supplier: formData.supplier,
        contact: formData.supplierContact.trim(),
        email: email,
      }

      console.log("Sending request data:", requestData)

      const response = await axios.post("https://easebilling.onrender.com/api/request-item", requestData, {
        headers: { "Content-Type": "application/json" },
      })

      console.log("Server response:", response.data)
      alert("Request sent to admin")
      fetchRequests()
      setFormData({
        medicineName: "",
        batchNumber: "",
        category: "",
        dosage: "",
        composition: "",
        storageLocation: "",
        quantity: "",
        expiryDate: "",
        purchasePrice: "",
        sellingPrice: "",
        gstTaxRate: "",
        manufacturer: "",
        supplier: "",
        supplierContact: "",
        image: null,
      })
    } catch (error) {
      console.error("Error requesting medicine:", error.response?.data || error)
      alert(`Failed to request medicine: ${error.response?.data?.error || "Unknown error"}`)
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-r from-sky-50 to-indigo-50 font-sans">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-gradient-to-b from-sky-600 to-indigo-700 text-white shadow-xl"
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8 text-center text-white">Labour Dashboard</h1>

          <nav className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab("allStocks")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === "allStocks"
                  ? "bg-white text-indigo-700 font-medium shadow-md"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <Package size={20} />
              <span>Items Inventory</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab("AddStock")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === "AddStock"
                  ? "bg-white text-indigo-700 font-medium shadow-md"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <ShoppingCart size={20} />
              <span>Request Items</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                localStorage.removeItem("token")
                setIsAuthenticated(false)
                navigate("/login")
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-all duration-200 mt-auto"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </motion.button>
          </nav>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "allStocks" && (
            <motion.div
              key="allStocks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full overflow-auto p-6"
            >
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Items Inventory</h2>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                      className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 w-64"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-100">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Brand
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amps
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Watt
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Inch/mm
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Expiry
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Purchase
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Selling
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          GST/Tax
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Manufacturer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Supplier
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Array.isArray(medicines) && medicines.length > 0 ? (
                        medicines
                          .filter(
                            (med) =>
                              med.itemName.toLowerCase().includes(searchTerm) ||
                              med.brand.toLowerCase().includes(searchTerm) ||
                              med.supplier.toLowerCase().includes(searchTerm),
                          )
                          .map((med, index) => (
                            <motion.tr
                              key={med._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                              className="hover:bg-gray-50 transition-colors duration-150"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {med.itemName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.brand}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.amps}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.watt}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.inchMm}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {med.storageLocation}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {med.stock} units
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(med.expiryDate).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ₹{med.purchasePrice}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{med.sellingPrice}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.gstTax}%</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.manufacturer}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.supplier}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {med.contact || "N/A"}
                              </td>
                            </motion.tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan="14" className="px-6 py-4 text-center text-sm text-gray-500">
                            No items available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "AddStock" && (
            <motion.div
              key="AddStock"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full overflow-auto p-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Request Form */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <Plus className="mr-2 text-indigo-600" size={24} />
                    Request New Item
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Item Name *</label>
                      <div className="relative">
                        <Box className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Item Name"
                          value={formData.medicineName}
                          onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                          className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Brand</label>
                      <div className="relative">
                        <Layers
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="text"
                          placeholder="Brand"
                          value={formData.batchNumber}
                          onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                          className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Amps *</label>
                      <div className="relative">
                        <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Amps"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Watt *</label>
                      <div className="relative">
                        <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Watt"
                          value={formData.dosage}
                          onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                          className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Inch/mm</label>
                      <div className="relative">
                        <Grid className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Inch/mm"
                          value={formData.composition}
                          onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
                          className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Storage Location</label>
                      <div className="relative">
                        <MapPin
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="text"
                          placeholder="Storage Location"
                          value={formData.storageLocation}
                          onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                          className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Quantity *</label>
                      <div className="relative">
                        <Box className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="number"
                          placeholder="Quantity"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                      <div className="relative">
                        <Calendar
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="date"
                          value={formData.expiryDate}
                          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                          className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Purchase Price</label>
                      <div className="relative">
                        <DollarSign
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="number"
                          placeholder="Purchase Price"
                          value={formData.purchasePrice}
                          onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                          className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Selling Price</label>
                      <div className="relative">
                        <DollarSign
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="number"
                          placeholder="Selling Price"
                          value={formData.sellingPrice}
                          onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                          className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">GST/Tax Rate</label>
                      <div className="relative">
                        <DollarSign
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="number"
                          placeholder="GST/Tax Rate"
                          value={formData.gstTaxRate}
                          onChange={(e) => setFormData({ ...formData, gstTaxRate: e.target.value })}
                          className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Manufacturer</label>
                      <div className="relative">
                        <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Manufacturer"
                          value={formData.manufacturer}
                          onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                          className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Supplier Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Supplier Name"
                          value={formData.supplier}
                          onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                          className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Supplier Contact *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="tel"
                          placeholder="10-digit phone number"
                          value={formData.supplierContact}
                          onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
                          className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Item Image</label>
                      <input
                        type="file"
                        onChange={handleImageChange}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={requestMedicine}
                    className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
                  >
                    <ShoppingCart className="mr-2" size={18} />
                    Submit Request
                  </motion.button>
                </motion.div>

                {/* Request History */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <Clock className="mr-2 text-indigo-600" size={24} />
                    Request History
                  </h2>

                  {requests.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-gray-100">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Item Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Brand
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amps
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Watt
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantity
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {requests.map((req, index) => (
                            <motion.tr
                              key={req._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                              className="hover:bg-gray-50 transition-colors duration-150"
                            >
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {new Date(req.date).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {req.medicineName}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{req.batchNumber}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{req.category}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{req.dosage}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {req.quantity} units
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    req.status === "Approved"
                                      ? "bg-green-100 text-green-800"
                                      : req.status === "Rejected"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {req.status}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">No request history available</div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
