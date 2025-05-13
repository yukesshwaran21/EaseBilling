// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaPills, FaShoppingCart, FaSearch } from "react-icons/fa";
// import { useLocation } from "react-router-dom";
// import "./PharmacistDashboard.css";

// const PharmacistDashboard = () => {
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

//       const response = await axios.get("http://localhost:5000/api/items", {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       console.log("Fetched items:", response.data);
//       setMedicines(response.data);
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

//       const response = await axios.get("http://localhost:5000/api/item-requests", {
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

//       const response = await axios.post("http://localhost:5000/api/request-item", requestData, {
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
//                     {medicines
//                       .filter(
//                         (med) =>
//                           med.itemName.toLowerCase().includes(searchTerm) ||
//                           med.brand.toLowerCase().includes(searchTerm) ||
//                           med.supplier.toLowerCase().includes(searchTerm)
//                       )
//                       .map((med) => (
//                         <tr key={med._id}>
//                           <td>{med.itemName}</td>
//                           <td>{med.brand}</td>
//                           <td>{med.amps}</td>
//                           <td>{med.watt}</td>
//                           <td>{med.inchMm}</td>
//                           <td>{med.storageLocation}</td>
//                           <td>{med.stock} units</td>
//                           <td>{new Date(med.expiryDate).toLocaleDateString()}</td>
//                           <td>₹{med.purchasePrice}</td>
//                           <td>₹{med.sellingPrice}</td>
//                           <td>{med.gstTax}%</td>
//                           <td>{med.manufacturer}</td>
//                           <td>{med.supplier}</td>
//                           <td>{med.contact || "N/A"}</td>
//                         </tr>
//                       ))}
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
//               placeholder="inch/mm"
//               value={formData.composition}
//               onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
//             />
//             <input
//               type="text"
//               placeholder="Storage Location (Rack/Shelf)"
//               value={formData.storageLocation}
//               onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
//             />
//             <input
//               type="number"
//               placeholder="Stock Quantity *"
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
//               placeholder="GST/Tax Rate"
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
//               placeholder="Supplier Name *"
//               value={formData.supplier}
//               onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
//             />
//             <input
//               type="tel"
//               placeholder="Supplier Contact *"
//               value={formData.supplierContact}
//               onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
//             />
//             <button className="btn btn-green" onClick={requestMedicine}>
//               Request Item
//             </button>
//             {requests.length > 0 && (
//               <>
//                 <h3>Order Requests</h3>
//                 <div className="table-container">
//                   <table className="requests-table">
//                     <thead>
//                       <tr>
//                         <th>Date</th>
//                         <th>Item Name</th>
//                         <th>Brand</th>
//                         <th>Amps</th>
//                         <th>Watt</th>
//                         <th>inch/mm</th>
//                         <th>Quantity</th>
//                         <th>Supplier Name</th>
//                         <th>Supplier Contact</th>
//                         <th>Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {requests.map((req) => (
//                         <tr key={req._id}>
//                           <td>{new Date(req.date).toLocaleDateString()}</td>
//                           <td>{req.medicineName}</td>
//                           <td>{req.batchNumber}</td>
//                           <td>{req.category}</td>
//                           <td>{req.dosage}</td>
//                           <td>{req.composition}</td>
//                           <td>{req.quantity} units</td>
//                           <td>{req.supplier}</td>
//                           <td>{req.supplierContact || "N/A"}</td>
//                           <td>
//                             <strong>{req.status}</strong>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PharmacistDashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPills, FaShoppingCart, FaSearch } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import "../Dashboard/PharmacistDashboard.css";

import { useNavigate } from "react-router-dom";
const PharmacistDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("allStocks");
  const [medicines, setMedicines] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
  });
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    fetchMedicines();
    fetchRequests();
  }, []);

  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await axios.get("http://localhost:5000/api/items", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("Fetched items:", response.data);
      
      // Ensure the response data is an array
      setMedicines(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching medicines:", error.response?.data || error);
      if (error.response?.status === 401) {
        alert("Please log in again to continue");
      } else {
        alert("Failed to fetch items. Please try again later.");
      }
    }
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await axios.get("http://localhost:5000/api/item-requests", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log("Fetched requests:", response.data);
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error.response?.data || error);
      if (error.response?.status === 401) {
        alert("Please log in again to continue");
      } else {
        alert("Failed to fetch requests. Please try again later.");
      }
    }
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const requestMedicine = async () => {
    // Log the form data before validation
    console.log("Form Data before validation:", formData);
    console.log("Email:", email);

    if (
      !formData.medicineName ||
      !formData.quantity ||
      !formData.category ||
      !formData.dosage ||
      !formData.supplier ||
      !formData.supplierContact.trim() ||
      !email
    ) {
      alert("Please fill in all required fields: Item Name, Quantity, Amps, Watt, Supplier Name, Supplier Contact");
      return;
    }

    if (parseInt(formData.quantity) <= 0) {
      alert("Quantity must be a positive number");
      return;
    }

    if (!/^\d{10}$/.test(formData.supplierContact.trim())) {
      alert("Supplier Contact must be a valid 10-digit phone number");
      return;
    }

    try {
      const requestData = {
        itemName: formData.medicineName,
        brand: formData.batchNumber,
        amps: formData.category,
        watt: formData.dosage,
        inchMm: formData.composition,
        storageLocation: formData.storageLocation,
        stock: parseInt(formData.quantity),
        expiryDate: formData.expiryDate,
        purchasePrice: parseFloat(formData.purchasePrice) || 0,
        sellingPrice: parseFloat(formData.sellingPrice) || 0,
        gstTax: parseFloat(formData.gstTaxRate) || 0,
        manufacturer: formData.manufacturer,
        supplier: formData.supplier,
        contact: formData.supplierContact.trim(),
        email: email
      };

      console.log("Sending request data:", requestData);

      const response = await axios.post("http://localhost:5000/api/request-item", requestData, {
        headers: { "Content-Type": "application/json" }
      });

      console.log("Server response:", response.data);
      alert("Request sent to admin");
      fetchRequests();
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
      });
    } catch (error) {
      console.error("Error requesting medicine:", error.response?.data || error);
      alert(`Failed to request medicine: ${error.response?.data?.error || "Unknown error"}`);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2 className="dashboard-title">Labour</h2>
        <button
          className={`sidebar-button ${activeTab === "allStocks" ? "active" : ""}`}
          onClick={() => setActiveTab("allStocks")}
        >
          <FaPills /> Items
        </button>
        <button
          className={`sidebar-button ${activeTab === "AddStock" ? "active" : ""}`}
          onClick={() => setActiveTab("AddStock")}
        >
          <FaShoppingCart /> Requests
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
          <div className="card card-gray">
            <h3>Items</h3>
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by Name, Batch No, or Supplier"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              />
            </div>

            <div className="table-wrapper">
              <div className="table-container">
                <table className="medicine-table">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Brand</th>
                      <th>Amps</th>
                      <th>watt</th>
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
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(medicines) && medicines.length > 0 ? (
                      medicines
                        .filter(
                          (med) =>
                            med.itemName.toLowerCase().includes(searchTerm) ||
                            med.brand.toLowerCase().includes(searchTerm) ||
                            med.supplier.toLowerCase().includes(searchTerm)
                        )
                        .map((med) => (
                          <tr key={med._id}>
                            <td>{med.itemName}</td>
                            <td>{med.brand}</td>
                            <td>{med.amps}</td>
                            <td>{med.watt}</td>
                            <td>{med.inchMm}</td>
                            <td>{med.storageLocation}</td>
                            <td>{med.stock} units</td>
                            <td>{new Date(med.expiryDate).toLocaleDateString()}</td>
                            <td>₹{med.purchasePrice}</td>
                            <td>₹{med.sellingPrice}</td>
                            <td>{med.gstTax}%</td>
                            <td>{med.manufacturer}</td>
                            <td>{med.supplier}</td>
                            <td>{med.contact || "N/A"}</td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="13">No medicines available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "AddStock" && (
          <div className="card card-blue">
            <h3>Stock Management</h3>
            <input
              type="text"
              placeholder="Item Name *"
              value={formData.medicineName}
              onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Brand"
              value={formData.batchNumber}
              onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
            />
            <input
              type="text"
              placeholder="Amp *"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
            <input
              type="text"
              placeholder="Watt *"
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
            />
            <input
              type="text"
              placeholder="Composition"
              value={formData.composition}
              onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
            />
            <input
              type="text"
              placeholder="Storage Location"
              value={formData.storageLocation}
              onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
            />
            <input
              type="number"
              placeholder="Quantity *"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            />
            <input
              type="date"
              placeholder="Expiry Date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            />
            <input
              type="number"
              placeholder="Purchase Price"
              value={formData.purchasePrice}
              onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
            />
            <input
              type="number"
              placeholder="Selling Price"
              value={formData.sellingPrice}
              onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
            />
            <input
              type="number"
              placeholder="GST Tax Rate"
              value={formData.gstTaxRate}
              onChange={(e) => setFormData({ ...formData, gstTaxRate: e.target.value })}
            />
            <input
              type="text"
              placeholder="Manufacturer"
              value={formData.manufacturer}
              onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            />
            <input
              type="text"
              placeholder="Supplier *"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            />
            <input
              type="text"
              placeholder="Supplier Contact *"
              value={formData.supplierContact}
              onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
            />
            <input type="file" onChange={handleImageChange} />
            <button onClick={requestMedicine}>Submit Request</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacistDashboard;
