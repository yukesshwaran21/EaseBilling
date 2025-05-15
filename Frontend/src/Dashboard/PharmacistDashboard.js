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
  Package2,
  ShoppingCart,
  Search,
  LogOut,
  DollarSign,
  Percent,
  Factory,
  Truck,
  Phone,
  Plus,
  Loader2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import "./PharmacistDashboard.css"

const PharmacistDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"))
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("allStocks")
  const [medicines, setMedicines] = useState([])
  const [requests, setRequests] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
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
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([fetchMedicines(), fetchRequests()])
      setLoading(false)
    }

    fetchData()
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
      setMedicines(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error("Error fetching medicines:", error.response?.data || error)
      if (error.response?.status === 401) {
        showNotification("Session expired. Please log in again.", "error")
        handleLogout()
      } else {
        showNotification("Failed to fetch items. Please try again later.", "error")
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
        showNotification("Session expired. Please log in again.", "error")
        handleLogout()
      } else {
        showNotification("Failed to fetch requests. Please try again later.", "error")
      }
    }
  }

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] })
  }

  const [notification, setNotification] = useState({ message: "", type: "", visible: false })

  const showNotification = (message, type = "success") => {
    setNotification({ message, type, visible: true })
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }))
    }, 3000)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsAuthenticated(false)
    navigate("/login")
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
      showNotification(
        "Please fill in all required fields: Item Name, Quantity, Amps, Watt, Supplier Name, Supplier Contact",
        "error",
      )
      return
    }

    if (Number.parseInt(formData.quantity) <= 0) {
      showNotification("Quantity must be a positive number", "error")
      return
    }

    if (!/^\d{10}$/.test(formData.supplierContact.trim())) {
      showNotification("Supplier Contact must be a valid 10-digit phone number", "error")
      return
    }

    try {
      setSubmitting(true)
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
      showNotification("Request sent to admin successfully!")
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
      showNotification(`Failed to request medicine: ${error.response?.data?.error || "Unknown error"}`, "error")
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (e) {
      return "Invalid Date"
    }
  }

  return (
    <div className="dashboard-wrapper">
      <AnimatePresence>
        {notification.visible && (
          <motion.div
            className={`notification ${notification.type}`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="dashboard-container">
        <motion.div
          className="sidebar"
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="logo-container">
            <h2 className="dashboard-title">Labour Dashboard</h2>
          </div>

          <div className="nav-links">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`sidebar-button ${activeTab === "allStocks" ? "active" : ""}`}
              onClick={() => setActiveTab("allStocks")}
            >
              <Package2 size={20} />
              <span>Items</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`sidebar-button ${activeTab === "AddStock" ? "active" : ""}`}
              onClick={() => setActiveTab("AddStock")}
            >
              <ShoppingCart size={20} />
              <span>Requests</span>
            </motion.button>
          </div>

          <div className="sidebar-footer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="logout-button"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                className="loading-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader2 className="loading-spinner" size={40} />
                <p>Loading data...</p>
              </motion.div>
            ) : activeTab === "allStocks" ? (
              <motion.div
                key="allStocks"
                className="content-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="section-header">
                  <h1>Items Inventory</h1>
                  <div className="search-container">
                    <Search className="search-icon" size={18} />
                    <input
                      type="text"
                      placeholder="Search by name, brand, or supplier..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                      className="search-input"
                    />
                  </div>
                </div>

                <div className="table-container">
                  {Array.isArray(medicines) && medicines.length > 0 ? (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Item Name</th>
                          <th>Brand</th>
                          <th>Amps</th>
                          <th>Watt</th>
                          <th>Inch/mm</th>
                          <th>Location</th>
                          <th>Stock</th>
                          <th>Expiry</th>
                          <th>Purchase</th>
                          <th>Selling</th>
                          <th>GST/Tax</th>
                          <th>Manufacturer</th>
                          <th>Supplier</th>
                          <th>Contact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {medicines
                          .filter(
                            (med) =>
                              med.itemName?.toLowerCase().includes(searchTerm) ||
                              med.brand?.toLowerCase().includes(searchTerm) ||
                              med.supplier?.toLowerCase().includes(searchTerm),
                          )
                          .map((med, index) => (
                            <motion.tr
                              key={med._id || index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ backgroundColor: "#f0f7ff" }}
                            >
                              <td>{med.itemName || "N/A"}</td>
                              <td>{med.brand || "N/A"}</td>
                              <td>{med.amps || "N/A"}</td>
                              <td>{med.watt || "N/A"}</td>
                              <td>{med.inchMm || "N/A"}</td>
                              <td>{med.storageLocation || "N/A"}</td>
                              <td>
                                <span className={`stock-badge ${Number.parseInt(med.stock) <= 10 ? "low" : "normal"}`}>
                                  {med.stock || 0} units
                                </span>
                              </td>
                              <td>{formatDate(med.expiryDate)}</td>
                              <td>₹{med.purchasePrice || 0}</td>
                              <td>₹{med.sellingPrice || 0}</td>
                              <td>{med.gstTax || 0}%</td>
                              <td>{med.manufacturer || "N/A"}</td>
                              <td>{med.supplier || "N/A"}</td>
                              <td>{med.contact || "N/A"}</td>
                            </motion.tr>
                          ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="empty-state">
                      <Package2 size={48} />
                      <p>No items available in inventory</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="AddStock"
                className="content-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="section-header">
                  <h1>Request New Items</h1>
                </div>

                <div className="form-container">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>
                        Item Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter item name"
                        value={formData.medicineName}
                        onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Brand</label>
                      <input
                        type="text"
                        placeholder="Enter brand name"
                        value={formData.batchNumber}
                        onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        Amps <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter amps"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        Watt <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter watt"
                        value={formData.dosage}
                        onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Inch/mm</label>
                      <input
                        type="text"
                        placeholder="Enter inch/mm"
                        value={formData.composition}
                        onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Storage Location</label>
                      <input
                        type="text"
                        placeholder="Enter storage location"
                        value={formData.storageLocation}
                        onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        Quantity <span className="required">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Enter quantity"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Purchase Price</label>
                      <div className="input-with-icon">
                        <DollarSign size={16} className="input-icon" />
                        <input
                          type="number"
                          placeholder="Enter purchase price"
                          value={formData.purchasePrice}
                          onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Selling Price</label>
                      <div className="input-with-icon">
                        <DollarSign size={16} className="input-icon" />
                        <input
                          type="number"
                          placeholder="Enter selling price"
                          value={formData.sellingPrice}
                          onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>GST/Tax Rate</label>
                      <div className="input-with-icon">
                        <Percent size={16} className="input-icon" />
                        <input
                          type="number"
                          placeholder="Enter GST/tax rate"
                          value={formData.gstTaxRate}
                          onChange={(e) => setFormData({ ...formData, gstTaxRate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Manufacturer</label>
                      <div className="input-with-icon">
                        <Factory size={16} className="input-icon" />
                        <input
                          type="text"
                          placeholder="Enter manufacturer"
                          value={formData.manufacturer}
                          onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>
                        Supplier <span className="required">*</span>
                      </label>
                      <div className="input-with-icon">
                        <Truck size={16} className="input-icon" />
                        <input
                          type="text"
                          placeholder="Enter supplier name"
                          value={formData.supplier}
                          onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>
                        Supplier Contact <span className="required">*</span>
                      </label>
                      <div className="input-with-icon">
                        <Phone size={16} className="input-icon" />
                        <input
                          type="text"
                          placeholder="Enter 10-digit contact number"
                          value={formData.supplierContact}
                          onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Image</label>
                      <input type="file" onChange={handleImageChange} className="file-input" />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="submit-button"
                    onClick={requestMedicine}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="loading-spinner-small" size={20} />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={20} />
                        <span>Submit Request</span>
                      </>
                    )}
                  </motion.button>
                </div>

                {requests.length > 0 && (
                  <motion.div
                    className="requests-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2>Your Request History</h2>
                    <div className="table-container">
                      <table className="data-table requests-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Item Name</th>
                            <th>Brand</th>
                            <th>Amps</th>
                            <th>Watt</th>
                            <th>Inch/mm</th>
                            <th>Quantity</th>
                            <th>Supplier</th>
                            <th>Contact</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requests.map((req, index) => (
                            <motion.tr
                              key={req._id || index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ backgroundColor: "#f0f7ff" }}
                            >
                              <td>{formatDate(req.date)}</td>
                              <td>{req.medicineName || req.itemName || "N/A"}</td>
                              <td>{req.batchNumber || req.brand || "N/A"}</td>
                              <td>{req.category || req.amps || "N/A"}</td>
                              <td>{req.dosage || req.watt || "N/A"}</td>
                              <td>{req.composition || req.inchMm || "N/A"}</td>
                              <td>{req.quantity || req.stock || 0} units</td>
                              <td>{req.supplier || "N/A"}</td>
                              <td>{req.supplierContact || req.contact || "N/A"}</td>
                              <td>
                                <span className={`status-badge ${req.status?.toLowerCase() || "pending"}`}>
                                  {req.status || "Pending"}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default PharmacistDashboard
