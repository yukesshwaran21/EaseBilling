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
    <div className="labour-dashboard-wrapper">
      <AnimatePresence>
        {notification.visible && (
          <motion.div
            className={`labour-notification ${notification.type}`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="labour-dashboard-container">
        <motion.div
          className="labour-sidebar"
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="labour-logo-container">
            <h2 className="labour-dashboard-title">Labour Dashboard</h2>
          </div>

          <div className="labour-nav-links">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`labour-sidebar-button ${activeTab === "allStocks" ? "active" : ""}`}
              onClick={() => setActiveTab("allStocks")}
            >
              <Package2 size={20} />
              <span>Items</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`labour-sidebar-button ${activeTab === "AddStock" ? "active" : ""}`}
              onClick={() => setActiveTab("AddStock")}
            >
              <ShoppingCart size={20} />
              <span>Requests</span>
            </motion.button>
          </div>

          <div className="labour-sidebar-footer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="labour-logout-button"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="labour-main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                className="labour-loading-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader2 className="labour-loading-spinner" size={40} />
                <p>Loading data...</p>
              </motion.div>
            ) : activeTab === "allStocks" ? (
              <motion.div
                key="allStocks"
                className="labour-content-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="labour-section-header">
                  <h1>Items Inventory</h1>
                  <div className="labour-search-container">
                    <Search className="labour-search-icon" size={18} />
                    <input
                      type="text"
                      placeholder="Search by name, brand, or supplier..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                      className="labour-search-input"
                    />
                  </div>
                </div>

                <div className="labour-table-container">
                  {Array.isArray(medicines) && medicines.length > 0 ? (
                    <table className="labour-data-table">
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
                                <span className={`labour-stock-badge ${Number.parseInt(med.stock) <= 10 ? "low" : "normal"}`}>
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
                    <div className="labour-empty-state">
                      <Package2 size={48} />
                      <p>No items available in inventory</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="AddStock"
                className="labour-content-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="labour-section-header">
                  <h1>Request New Items</h1>
                </div>

                <div className="labour-form-container">
                  <div className="labour-form-grid">
                    <div className="labour-form-group">
                      <label>
                        Item Name <span className="labour-required">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter item name"
                        value={formData.medicineName}
                        onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                      />
                    </div>

                    <div className="labour-form-group">
                      <label>Brand</label>
                      <input
                        type="text"
                        placeholder="Enter brand name"
                        value={formData.batchNumber}
                        onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                      />
                    </div>

                    <div className="labour-form-group">
                      <label>
                        Amps <span className="labour-required">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter amps"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      />
                    </div>

                    <div className="labour-form-group">
                      <label>
                        Watt <span className="labour-required">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter watt"
                        value={formData.dosage}
                        onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                      />
                    </div>

                    <div className="labour-form-group">
                      <label>Inch/mm</label>
                      <input
                        type="text"
                        placeholder="Enter inch/mm"
                        value={formData.composition}
                        onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
                      />
                    </div>

                    <div className="labour-form-group">
                      <label>Storage Location</label>
                      <input
                        type="text"
                        placeholder="Enter storage location"
                        value={formData.storageLocation}
                        onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                      />
                    </div>

                    <div className="labour-form-group">
                      <label>
                        Quantity <span className="labour-required">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Enter quantity"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      />
                    </div>

                    <div className="labour-form-group">
                      <label>Expiry Date</label>
                      <input
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      />
                    </div>

                    <div className="labour-form-group">
                      <label>Purchase Price</label>
                      <div className="labour-input-with-icon">
                        <DollarSign size={16} className="labour-input-icon" />
                        <input
                          type="number"
                          placeholder="Enter purchase price"
                          value={formData.purchasePrice}
                          onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="labour-form-group">
                      <label>Selling Price</label>
                      <div className="labour-input-with-icon">
                        <DollarSign size={16} className="labour-input-icon" />
                        <input
                          type="number"
                          placeholder="Enter selling price"
                          value={formData.sellingPrice}
                          onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="labour-form-group">
                      <label>GST/Tax Rate</label>
                      <div className="labour-input-with-icon">
                        <Percent size={16} className="labour-input-icon" />
                        <input
                          type="number"
                          placeholder="Enter GST/tax rate"
                          value={formData.gstTaxRate}
                          onChange={(e) => setFormData({ ...formData, gstTaxRate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="labour-form-group">
                      <label>Manufacturer</label>
                      <div className="labour-input-with-icon">
                        <Factory size={16} className="labour-input-icon" />
                        <input
                          type="text"
                          placeholder="Enter manufacturer"
                          value={formData.manufacturer}
                          onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="labour-form-group">
                      <label>
                        Supplier <span className="labour-required">*</span>
                      </label>
                      <div className="labour-input-with-icon">
                        <Truck size={16} className="labour-input-icon" />
                        <input
                          type="text"
                          placeholder="Enter supplier name"
                          value={formData.supplier}
                          onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="labour-form-group">
                      <label>
                        Supplier Contact <span className="labour-required">*</span>
                      </label>
                      <div className="labour-input-with-icon">
                        <Phone size={16} className="labour-input-icon" />
                        <input
                          type="text"
                          placeholder="Enter 10-digit contact number"
                          value={formData.supplierContact}
                          onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="labour-form-group">
                      <label>Image</label>
                      <input type="file" onChange={handleImageChange} className="labour-file-input" />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="labour-submit-button"
                    onClick={requestMedicine}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="labour-loading-spinner-small" size={20} />
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
                    className="labour-requests-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2>Your Request History</h2>
                    <div className="labour-table-container">
                      <table className="labour-data-table labour-requests-table">
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
                                <span className={`labour-status-badge ${req.status?.toLowerCase() || "pending"}`}>
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
