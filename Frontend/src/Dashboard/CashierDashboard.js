import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft,CheckCircle,Pencil, Trash, Download, X } from "lucide-react"
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import "./CashierDashboard.css";
import gpayQR from '../assets/gpay.png';
import { FaShoppingCart, FaHistory, FaSearch, FaPlus, FaMinus, FaTrash, FaUser, FaPhone, FaCreditCard } from "react-icons/fa";
import "../Dashboard/CashierDashboard.css";
import { useLocation } from "react-router-dom";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { useNavigate } from "react-router-dom";
// PDF Document Component
const BillPDF = ({ billId, customerName, customerPhone, selectedMedicines, totalAmount, totalGST, totalBill }) => (
  <Document>
    <Page size="A8" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Sai Ram Electrical</Text>
        <Text style={styles.subtitle}>46, Main Road, Aval Poondurai, Erode-638115</Text>
        <Text style={styles.billId}>Bill ID: {billId}</Text>
        
        <View style={styles.customerInfo}>
          <Text>Customer Name: {customerName}</Text>
          <Text>Phone: {customerPhone}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Item</Text>
            <Text style={styles.tableHeader}>Qty</Text>
            <Text style={styles.tableHeader}>Price</Text>
            <Text style={styles.tableHeader}>Total</Text>
          </View>
          
          {selectedMedicines.map((medicine, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{medicine.medicineName}</Text>
              <Text style={styles.tableCell}>{medicine.quantity}</Text>
              <Text style={styles.tableCell}>₹{medicine.sellingPrice}</Text>
              <Text style={styles.tableCell}>₹{medicine.totalPrice}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryText}>Total Amount: ₹{totalAmount}</Text>
          <Text style={styles.summaryText}>Total GST: ₹{totalGST}</Text>
          <Text style={styles.summaryText}>Total Bill: ₹{totalBill}</Text>
        </View>

        <Text style={styles.footer}>Thank you for your purchase!</Text>
      </View>
    </Page>
  </Document>
);

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  billId: {
    textAlign: 'right',
    marginBottom: 10,
  },
  customerInfo: {
    marginBottom: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  tableHeader: {
    flex: 1,
    fontWeight: 'bold',
    padding: 4,
    backgroundColor: '#eee',
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    padding: 4,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  summary: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 10,
  },
  summaryText: {
    marginBottom: 4,
  },
  footer: {
    marginTop: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  }
});

const CashierDashboard = () => {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerDetailsEntered, setCustomerDetailsEntered] = useState(false);
  const [billId, setBillId] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("billing");
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalGST, setTotalGST] = useState(0);
  const [totalBill, setTotalBill] = useState(0);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionSearch, setTransactionSearch] = useState("");
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showGPayQR, setShowGPayQR] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [stocks, setStocks] = useState([]);
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [gstRate, setGstRate] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [showBilling, setShowBilling] = useState(false);
  const [lastBillData, setLastBillData] = useState(null);
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();

  // Add state for payment modal and invoice preview
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [pendingInvoiceData, setPendingInvoiceData] = useState(null);

  useEffect(() => {
    setBillId(`SRT-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      setLoginError("Session expired. Please log in again.");
      return;
    }
    axios.get("https://easebilling.onrender.com/api/items", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => setStocks(response.data))
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setIsAuthenticated(false);
          setLoginError("Session expired or unauthorized. Please log in again.");
          localStorage.removeItem("token");
        } else {
          setLoginError("Error fetching items. Please try again later.");
        }
        setStocks([]);
      });
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get("https://easebilling.onrender.com/api/invoices", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      alert("Failed to fetch transaction history. Please refresh the page.");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const searchMedicines = (e) => {
    setSearchQuery(e.target.value);
  };

  const addMedicineToBill = (medicine, quantity) => {
    if (!quantity || quantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }
  
    // Check if requested quantity exceeds available stock
    if (quantity > medicine.stockQuantity) {
      alert(`Insufficient stock! Only ${medicine.stockQuantity} units available.`);
      return;
    }
  
    const gstRate = medicine.gstTaxRate || 0;
    const gst = (medicine.sellingPrice * quantity * gstRate) / 100;
    const totalPrice = medicine.sellingPrice * quantity + gst;
  
    const newMedicine = {
      medicineId: medicine._id,
      medicineName: medicine.name,
      quantity,
      sellingPrice: medicine.sellingPrice,
      gstTaxRate: gstRate,
      gst,
      totalPrice,
      stockQuantity: medicine.stockQuantity // Store original stock for validation
    };
  
    const updatedMedicines = [...selectedMedicines, newMedicine];
  
    const newTotalAmount = updatedMedicines.reduce((sum, med) => sum + med.sellingPrice * med.quantity, 0);
    const newTotalGST = updatedMedicines.reduce((sum, med) => sum + med.gst, 0);
    const newTotalBill = newTotalAmount + newTotalGST;
  
    setSelectedMedicines(updatedMedicines);
    setTotalAmount(newTotalAmount);
    setTotalGST(newTotalGST);
    setTotalBill(newTotalBill);
  };
  
  const editMedicineQuantity = (index) => {
    const newQuantity = parseInt(prompt("Enter new quantity:"), 10);
    if (!newQuantity || newQuantity <= 0) {
      alert("Invalid quantity!");
      return;
    }
  
    const updatedMedicines = [...selectedMedicines];
    const medicine = updatedMedicines[index];
  
    // Check if new quantity exceeds available stock
    if (newQuantity > medicine.stockQuantity) {
      alert(`Insufficient stock! Only ${medicine.stockQuantity} units available.`);
      return;
    }
  
    // Recalculate GST & total price based on database GST percentage
    const oldTotal = medicine.totalPrice;
    const oldGST = medicine.gst;
  
    medicine.quantity = newQuantity;
    medicine.gst = (medicine.sellingPrice * newQuantity * medicine.gstTaxRate) / 100;
    medicine.totalPrice = medicine.sellingPrice * newQuantity + medicine.gst;
  
    const newTotalAmount = totalAmount - (oldTotal - oldGST) + (medicine.totalPrice - medicine.gst);
    const newTotalGST = totalGST - oldGST + medicine.gst;
    const newTotalBill = newTotalAmount + newTotalGST;
  
    setSelectedMedicines(updatedMedicines);
    setTotalAmount(newTotalAmount);
    setTotalGST(newTotalGST);
    setTotalBill(newTotalBill);
  };
  
  
  const deleteMedicineFromBill = (index) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
  
    const updatedMedicines = [...selectedMedicines];
    const medicine = updatedMedicines[index];
  
    updatedMedicines.splice(index, 1);
  
    const newTotalAmount = totalAmount - (medicine.totalPrice - medicine.gst);
    const newTotalGST = totalGST - medicine.gst;
    const newTotalBill = newTotalAmount + newTotalGST;
  
    setSelectedMedicines(updatedMedicines);
    setTotalAmount(newTotalAmount);
    setTotalGST(newTotalGST);
    setTotalBill(newTotalBill);
  };
  
  
 const handlePayment = async () => {
  if (cart.length === 0) {
    alert("Please add items to the cart first");
    return;
  }

  if (!customerName || !customerPhone) {
    alert("Please enter customer details");
    return;
  }

  try {
    // Generate a unique bill ID
    const billId = `BILL-${Date.now()}`;

    // Prepare invoice data
    const invoiceData = {
      billId,
      customerName,
      customerPhone,
      items: cart.map(item => ({
        itemId: item._id,
        itemName: item.itemName,
        quantity: item.quantity,
        sellingPrice: item.sellingPrice,
        gstTax: item.gstTax
      })),
      totalAmount: subtotal,
      totalGST: gstAmount,
      totalBill: total,
      paymentMethod: "cash" // Default to cash payment
    };

    // First update stock quantities
    await updateStockQuantities(cart);

    // Then generate invoice
    const response = await axios.post(
      "https://easebilling.onrender.com/api/generate-invoice",
      invoiceData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data.success) {
      // Generate PDF
      const pdfBlob = await pdf(
        <BillPDF
          billId={invoiceData.billId}
          customerName={invoiceData.customerName}
          customerPhone={invoiceData.customerPhone}
          selectedMedicines={invoiceData.items.map(item => ({
            medicineName: item.itemName,
            quantity: item.quantity,
            sellingPrice: item.sellingPrice,
            totalPrice: item.sellingPrice * item.quantity * (1 + (item.gstTax || 0) / 100)
          }))}
          totalAmount={invoiceData.totalAmount}
          totalGST={invoiceData.totalGST}
          totalBill={invoiceData.totalBill}
        />
      ).toBlob();

      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${billId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Clear cart and customer details
      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
      setSubtotal(0);
      setGstAmount(0);
      setTotal(0);

      // Refresh stock data
      await fetchStocks();

      // Switch to history tab
      setActiveTab("history");

      alert("Bill generated successfully!");
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    alert(error.response?.data?.error || "Error processing payment. Please try again.");
  }
};

const handlePaymentMethodSelect = async (method) => {
  console.log("Payment method selected:", method); // Debug log
  setPaymentMethod(method);
  
  if (method === "cash") {
    try {
      console.log("Processing cash payment..."); // Debug log
      
      // Generate the invoice
      const response = await axios.post("https://easebilling.onrender.com/api/generate-invoice", {
        billId,
        customerName,
        customerPhone,
        medicines: selectedMedicines,
        totalAmount,
        totalGST,
        totalBill,
        paymentMethod: "cash"
      });

      console.log("Invoice generated:", response.data); // Debug log

      // Create and download PDF
      const doc = (
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <Text style={styles.title}>Sai Ram Electrical</Text>
              <Text style={styles.subtitle}>10, Sathy Main Road, Gobichettipalayam, Erode-638115</Text>
              <Text style={styles.billId}>Bill ID: {billId}</Text>
              
              <View style={styles.customerInfo}>
                <Text>Customer Name: {customerName}</Text>
                <Text>Phone: {customerPhone}</Text>
              </View>

              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableHeader}>Item</Text>
                  <Text style={styles.tableHeader}>Qty</Text>
                  <Text style={styles.tableHeader}>Price</Text>
                  <Text style={styles.tableHeader}>Total</Text>
                </View>
                
                {selectedMedicines.map((medicine, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{medicine.medicineName}</Text>
                    <Text style={styles.tableCell}>{medicine.quantity}</Text>
                    <Text style={styles.tableCell}>₹{medicine.sellingPrice}</Text>
                    <Text style={styles.tableCell}>₹{medicine.totalPrice}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.summary}>
                <Text style={styles.summaryText}>Total Amount: ₹{totalAmount}</Text>
                <Text style={styles.summaryText}>Total GST: ₹{totalGST}</Text>
                <Text style={styles.summaryText}>Total Bill: ₹{totalBill}</Text>
                <Text style={styles.summaryText}>Payment Method: Cash</Text>
              </View>

              <Text style={styles.footer}>Thank you for your purchase!</Text>
            </View>
          </Page>
        </Document>
      );

      // Download PDF
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bill_${billId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Update stock quantities
      await updateStockQuantities(selectedMedicines);

      // Update state
      setInvoiceGenerated(true);
      setShowSuccessPage(true);
      setShowPaymentOptions(false);
      setShowGPayQR(false);

      console.log("Cash payment completed successfully"); // Debug log
    } catch (err) {
      console.error("Error in cash payment:", err); // Debug log
      alert("Error processing payment. Please try again.");
    }
  } else if (method === "gpay") {
    setShowGPayQR(true);
  }
};

const generateAndDownloadBill = async () => {
  try {
    // First, generate the invoice
    const response = await axios.post("https://easebilling.onrender.com/api/generate-invoice", {
      billId,
      customerName,
      customerPhone,
      medicines: selectedMedicines,
      totalAmount,
      totalGST,
      totalBill,
      paymentMethod
    });

    if (response.status === 200) {
      // Generate and download the PDF
      const doc = (
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <img src="C:\Users\HP\Pictures\Screenshots\Screenshot 2025-04-09 141128.png" >Sai</img>
              <Text style={styles.title}>Sai Ram Electrical</Text>
              <Text style={styles.subtitle}>10, Sathy Main Road, Gobichettipalayam, Erode-638115</Text>
              <Text style={styles.billId}>Bill ID: {billId}</Text>
              
              <View style={styles.customerInfo}>
                <Text>Customer Name: {customerName}</Text>
                <Text>Phone: {customerPhone}</Text>
              </View>

              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableHeader}>Item</Text>
                  <Text style={styles.tableHeader}>Qty</Text>
                  <Text style={styles.tableHeader}>Price</Text>
                  <Text style={styles.tableHeader}>Total</Text>
                </View>
                
                {selectedMedicines.map((medicine, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{medicine.medicineName}</Text>
                    <Text style={styles.tableCell}>{medicine.quantity}</Text>
                    <Text style={styles.tableCell}>₹{medicine.sellingPrice}</Text>
                    <Text style={styles.tableCell}>₹{medicine.totalPrice}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.summary}>
                <Text style={styles.summaryText}>Total Amount: ₹{totalAmount}</Text>
                <Text style={styles.summaryText}>Total GST: ₹{totalGST}</Text>
                <Text style={styles.summaryText}>Total Bill: ₹{totalBill}</Text>
                <Text style={styles.summaryText}>Payment Method: {paymentMethod === "cash" ? "Cash" : "GPay"}</Text>
              </View>

              <Text style={styles.footer}>Thank you for your purchase!</Text>
            </View>
          </Page>
        </Document>
      );

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bill_${billId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Update stock quantities after successful payment
      await updateStockQuantities(selectedMedicines);

      setInvoiceGenerated(true);
      setShowSuccessPage(true);
      setShowPaymentOptions(false);
      setShowGPayQR(false);
    }
  } catch (err) {
    console.error("Error processing payment:", err);
    alert("Error processing payment. Please try again.");
  }
};

const updateStockQuantities = async (items) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Update each item's stock
    for (const item of items) {
      try {
        const response = await axios.put(
          `https://easebilling.onrender.com/api/items/${item._id}/update-stock`,
          { 
            quantity: item.quantity,
            operation: 'decrease'
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (response.status !== 200) {
          throw new Error(`Failed to update stock for item: ${item.itemName}`);
        }
      } catch (err) {
        console.error(`Error updating stock for item ${item.itemName}:`, err);
        throw new Error(`Failed to update stock for item: ${item.itemName} - ${err.response?.data?.error || err.message}`);
      }
    }
    
    // Refresh stock data after all updates
    await fetchStocks();
  } catch (error) {
    console.error("Error updating stock quantities:", error);
    throw error;
  }
};

const handleGPayPaymentComplete = async () => {
  try {
    // Generate the invoice
    const response = await axios.post("https://easebilling.onrender.com/api/generate-invoice", {
      billId,
      customerName,
      customerPhone,
      medicines: selectedMedicines,
      totalAmount,
      totalGST,
      totalBill,
      paymentMethod: "gpay"
    });

    if (response.status === 200) {
      // Create and download PDF
      const doc = (
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <Text style={styles.title}>Sai Ram Electrical</Text>
              <Text style={styles.subtitle}>10, Sathy Main Road, Gobichettipalayam, Erode-638115</Text>
              <Text style={styles.billId}>Bill ID: {billId}</Text>
              
              <View style={styles.customerInfo}>
                <Text>Customer Name: {customerName}</Text>
                <Text>Phone: {customerPhone}</Text>
              </View>

              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableHeader}>Item</Text>
                  <Text style={styles.tableHeader}>Qty</Text>
                  <Text style={styles.tableHeader}>Price</Text>
                  <Text style={styles.tableHeader}>Total</Text>
                </View>
                
                {selectedMedicines.map((medicine, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{medicine.medicineName}</Text>
                    <Text style={styles.tableCell}>{medicine.quantity}</Text>
                    <Text style={styles.tableCell}>₹{medicine.sellingPrice}</Text>
                    <Text style={styles.tableCell}>₹{medicine.totalPrice}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.summary}>
                <Text style={styles.summaryText}>Total Amount: ₹{totalAmount}</Text>
                <Text style={styles.summaryText}>Total GST: ₹{totalGST}</Text>
                <Text style={styles.summaryText}>Total Bill: ₹{totalBill}</Text>
                <Text style={styles.summaryText}>Payment Method: GPay</Text>
              </View>

              <Text style={styles.footer}>Thank you for your purchase!</Text>
            </View>
          </Page>
        </Document>
      );

      // Download PDF
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bill_${billId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Update stock quantities
      await updateStockQuantities(selectedMedicines);

      // Show success page with bill preview
    setInvoiceGenerated(true);
      setShowSuccessPage(true);
      setShowPaymentOptions(false);
      setShowGPayQR(false);
    }
  } catch (err) {
    console.error("Error processing GPay payment:", err);
    alert("Error processing payment. Please try again.");
  }
};

const filteredTransactions = transactions.filter((txn) => {
  return (
    txn.billId.toLowerCase().includes(transactionSearch.toLowerCase()) ||
    txn.customerName.toLowerCase().includes(transactionSearch.toLowerCase()) ||
    txn.customerPhone.includes(transactionSearch) ||
    new Date(txn.date).toLocaleDateString().includes(transactionSearch)
  );
});
// Function to reset and go back to customer details
const handleDone = () => {
  setShowSuccessPage(false);
  setCustomerDetailsEntered(false);
  setSelectedMedicines([]);
  setTotalAmount(0);
  setTotalGST(0);
  setTotalBill(0);
  setBillId(`SRT-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
  setCustomerName("");
  setCustomerPhone("");
};

const handleDownloadPDF = async () => {
  try {
    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>Sai Ram Electrical</Text>
            <Text style={styles.subtitle}>10, Sathy Main Road, Gobichettipalayam, Erode-638115</Text>
            <Text style={styles.billId}>Bill ID: {billId}</Text>
            
            <View style={styles.customerInfo}>
              <Text>Customer Name: {customerName}</Text>
              <Text>Phone: {customerPhone}</Text>
            </View>

            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Item</Text>
                <Text style={styles.tableHeader}>Qty</Text>
                <Text style={styles.tableHeader}>Price</Text>
                <Text style={styles.tableHeader}>Total</Text>
              </View>
              
              {selectedMedicines.map((medicine, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{medicine.medicineName}</Text>
                  <Text style={styles.tableCell}>{medicine.quantity}</Text>
                  <Text style={styles.tableCell}>₹{medicine.sellingPrice}</Text>
                  <Text style={styles.tableCell}>₹{medicine.totalPrice}</Text>
                </View>
              ))}
            </View>

            <View style={styles.summary}>
              <Text style={styles.summaryText}>Total Amount: ₹{totalAmount}</Text>
              <Text style={styles.summaryText}>Total GST: ₹{totalGST}</Text>
              <Text style={styles.summaryText}>Total Bill: ₹{totalBill}</Text>
            </View>

            <Text style={styles.footer}>Thank you for your purchase!</Text>
          </View>
        </Page>
      </Document>
    );

    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bill_${billId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};

const handleDeleteTransaction = async (billId) => {
  if (window.confirm("Are you sure you want to delete this transaction? This action cannot be undone.")) {
    try {
      // First try to delete the invoice
      const deleteResponse = await axios.delete(`https://easebilling.onrender.com/api/invoices/${billId}`);
      
      if (deleteResponse.status === 200) {
        // If successful, refresh the transactions list
        const response = await axios.get("https://easebilling.onrender.com/api/invoices");
        setTransactions(response.data);
        alert("Transaction deleted successfully");
      } else {
        throw new Error("Failed to delete transaction");
      }
    } catch (err) {
      console.error("Error deleting transaction:", err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response:", err.response.data);
        alert(`Error deleting transaction: ${err.response.data.message || 'Please try again.'}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
        alert("No response from server. Please check your connection and try again.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", err.message);
        alert("Error setting up request. Please try again.");
      }
    }
  }
};

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("https://easebilling.onrender.com/api/login", loginForm);
    console.log("Login response:", response.data);
    
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      setLoginError("");
      setLoginForm({ email: "", password: "" });
    } else {
      setLoginError("Invalid response from server");
    }
  } catch (error) {
    console.error("Login error:", error);
    const errorMsg = error.response?.data?.error || "Login failed. Please check your credentials.";
    setLoginError(errorMsg);
  }
};

const handleLogout = () => {
  localStorage.removeItem("token");
  setIsAuthenticated(false);
  navigate("/login");
};

const addToCart = async (item) => {
  try {
    // Get all items at once
    const token = localStorage.getItem("token");
    const response = await axios.get("https://easebilling.onrender.com/api/items", {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const allItems = response.data;
    const currentItem = allItems.find(i => i._id === item._id);
    
    if (!currentItem) {
      alert("This item is no longer available in stock.");
      return;
    }
    
    const currentStock = currentItem.stock;
    
    // Prompt for quantity with available stock info
    const quantity = parseInt(prompt(`Enter quantity for ${item.itemName} (Available: ${currentStock} units):`), 10);
    
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }
    
    if (quantity > currentStock) {
      alert(`Insufficient stock! Only ${currentStock} units available.`);
      return;
    }

    // Check if item already exists in cart
    const existingItem = cart.find(cartItem => cartItem._id === item._id);
    if (existingItem) {
      const newTotalQuantity = existingItem.quantity + quantity;
      if (newTotalQuantity > currentStock) {
        alert(`Cannot add ${quantity} more units. Total quantity would exceed available stock of ${currentStock} units.`);
        return;
      }
      
      setCart(prevCart =>
        prevCart.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: newTotalQuantity }
            : cartItem
        )
      );
    } else {
      setCart(prevCart => [...prevCart, { ...item, quantity }]);
    }

    // Recalculate totals
    const newCart = existingItem 
      ? cart.map(cartItem => 
          cartItem._id === item._id 
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        )
      : [...cart, { ...item, quantity }];

    const newSubtotal = newCart.reduce((sum, cartItem) => 
      sum + (cartItem.sellingPrice * cartItem.quantity), 0);
    setSubtotal(newSubtotal);

    const newGstAmount = newCart.reduce((sum, cartItem) => 
      sum + (cartItem.sellingPrice * cartItem.quantity * cartItem.gstTax / 100), 0);
    setGstAmount(newGstAmount);

    setTotal(newSubtotal + newGstAmount);

  } catch (error) {
    console.error("Error adding item to cart:", error);
    alert("Error adding item to cart. Please try again.");
  }
};

const updateQuantity = (id, change) => {
  // Implement updating quantity logic here
};

const removeFromCart = (id) => {
  // Implement removing medicine from cart logic here
};

const fetchStocks = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get("https://easebilling.onrender.com/api/items", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data) {
      setStocks(response.data);
      console.log("Stocks updated successfully:", response.data);
    }
  } catch (error) {
    console.error("Error fetching stocks:", error);
    if (error.response?.status === 401) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      window.location.reload();
    } else {
      alert("Failed to fetch stock data. Please refresh the page.");
    }
  }
};

const handleGenerateBill = async () => {
  if (!customerName.trim() || !customerPhone.trim()) {
    alert("Please enter both customer name and phone number.");
    return;
  }
  if (cart.length === 0) {
    alert("Please add at least one item to the bill.");
    return;
  }
  try {
    const token = localStorage.getItem("token");
    // Get all items at once
    const itemsResponse = await axios.get("https://easebilling.onrender.com/api/items", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const allItems = itemsResponse.data;
    const itemsMap = new Map(allItems.map(item => [item._id, item]));
    // Validate stock for all items in cart
    for (const cartItem of cart) {
      const item = itemsMap.get(cartItem._id);
      if (!item) {
        alert(`Item ${cartItem.itemName} is no longer available in stock.`);
        return;
      }
      if (item.stock < cartItem.quantity) {
        alert(`Insufficient stock for ${cartItem.itemName}. Only ${item.stock} units available.`);
        return;
      }
    }
    // If all validations pass, proceed with bill generation
    const invoicePayload = {
      billId,
      customerName,
      customerPhone,
      items: cart.map(item => ({
        itemId: item._id,
        itemName: item.itemName,
        quantity: item.quantity,
        sellingPrice: item.sellingPrice,
        gstTax: item.gstTax
      })),
      totalAmount: subtotal,
      totalGST: gstAmount,
      totalBill: total,
      paymentMethod: selectedPaymentMethod
    };
    console.log('Sending invoice payload:', invoicePayload);
    const response = await axios.post("https://easebilling.onrender.com/api/generate-invoice", invoicePayload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.status === 200) {
      // Automatically generate and download the PDF
      const doc = (
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <Text style={styles.title}>Sai Ram Electrical</Text>
              <Text style={styles.subtitle}>10, Sathy Main Road, Gobichettipalayam, Erode-638115</Text>
              <Text style={styles.billId}>Bill ID: {billId}</Text>
              <View style={styles.customerInfo}>
                <Text>Customer Name: {customerName}</Text>
                <Text>Phone: {customerPhone}</Text>
              </View>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableHeader}>Item</Text>
                  <Text style={styles.tableHeader}>Qty</Text>
                  <Text style={styles.tableHeader}>Price</Text>
                  <Text style={styles.tableHeader}>Total</Text>
                </View>
                {cart.map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{item.itemName}</Text>
                    <Text style={styles.tableCell}>{item.quantity}</Text>
                    <Text style={styles.tableCell}>₹{item.sellingPrice}</Text>
                    <Text style={styles.tableCell}>₹{(item.sellingPrice * item.quantity * (1 + (item.gstTax || 0) / 100)).toFixed(2)}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.summary}>
                <Text style={styles.summaryText}>Total Amount: ₹{subtotal}</Text>
                <Text style={styles.summaryText}>Total GST: ₹{gstAmount}</Text>
                <Text style={styles.summaryText}>Total Bill: ₹{total}</Text>
                <Text style={styles.summaryText}>Payment Method: {selectedPaymentMethod === 'gpay' ? 'GPay' : selectedPaymentMethod}</Text>
              </View>
              <Text style={styles.footer}>Thank you for your purchase!</Text>
            </View>
          </Page>
        </Document>
      );
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bill_${billId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      // Update stock quantities after successful bill generation
      await updateStockQuantities(cart);
      // Clear cart and reset totals
      setCart([]);
      setSubtotal(0);
      setGstAmount(0);
      setTotal(0);
      setCustomerName("");
      setCustomerPhone("");
      // Show success message
      alert("Bill generated successfully!");
      // Refresh stock data
      await fetchStocks();
    }
  } catch (error) {
    console.error("Error generating bill:", error);
    alert(error.response?.data?.error || "Error generating bill. Please try again.");
  }
};

const handleCustomerSubmit = (e) => {
  e.preventDefault();
  if (!customerName.trim() || !customerPhone.trim()) {
    alert("Please enter both customer name and phone number");
    return;
  }
  if (!/^\d{10}$/.test(customerPhone.trim())) {
    alert("Please enter a valid 10-digit phone number");
    return;
  }
  setShowBilling(true);
};

// Add function to update stock in database
const updateStockInDatabase = async (itemId, quantity) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.put(
      `https://easebilling.onrender.com/api/items/${itemId}/update-stock`,
      { quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to update stock");
    }

    return response.data;
  } catch (error) {
    console.error("Error updating stock:", error);
    throw error;
  }
};

// Add this function to handle invoice deletion
const handleDeleteInvoice = async (invoiceId) => {
  if (!window.confirm("Are you sure you want to delete this invoice? This action cannot be undone.")) {
    return;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Find the invoice to get its billId
    const invoice = transactions.find(t => t._id === invoiceId);
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    console.log("Attempting to delete invoice with billId:", invoice.billId); // Debug log

    // Delete the invoice using billId
    const response = await axios.delete(
      `https://easebilling.onrender.com/api/invoices/${invoice.billId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("Delete response:", response); // Debug log

    if (response.status === 200 || response.status === 204) {
      // Remove the deleted invoice from the local state
      setTransactions(prevTransactions => 
        prevTransactions.filter(transaction => transaction._id !== invoiceId)
      );
      
      // Show success message
      alert("Invoice deleted successfully");
      
      // Refresh the transactions list
      await fetchTransactions();
    } else {
      throw new Error("Failed to delete invoice");
    }
  } catch (error) {
    console.error("Error deleting invoice:", error);
    
    // More detailed error message
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      alert(`Failed to delete invoice: ${error.response.data.error || 'Server error occurred'}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      alert("No response from server. Please check your connection and try again.");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
      alert("Error setting up request. Please try again.");
    }
  }
};

// Add Razorpay script
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
}, []);

const initializeRazorpay = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Create order on backend
    const response = await axios.post(
      "https://easebilling.onrender.com/api/create-order",
      {
        amount: total * 100, // Razorpay expects amount in paise
        currency: "INR",
        receipt: billId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay key
      amount: total * 100,
      currency: "INR",
      name: "Sai Ram Electrical",
      description: `Bill ID: ${billId}`,
      order_id: response.data.id,
      handler: function (response) {
        handlePaymentSuccess(response);
      },
      prefill: {
        name: customerName,
        contact: customerPhone
      },
      theme: {
        color: "#4CAF50"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Error initializing Razorpay:", error);
    alert("Error initializing payment. Please try again.");
  }
};

const handlePaymentSuccess = async (response) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Verify payment on backend
    const verifyResponse = await axios.post(
      "https://easebilling.onrender.com/api/verify-payment",
      {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (verifyResponse.data.verified) {
      // Generate bill with payment details
      await handleGenerateBill();
      alert("Payment successful! Bill generated.");
    } else {
      throw new Error("Payment verification failed");
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    alert("Error verifying payment. Please contact support.");
  }
};

// Validate cart items before billing
const validateCartItems = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("https://easebilling.onrender.com/api/items", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const backendItems = response.data;
    const validIds = new Set(backendItems.map(item => item._id));
    const invalidItems = cart.filter(item => !validIds.has(item._id));
    if (invalidItems.length > 0) {
      alert(
        "Some items in your cart are no longer available in stock and will be removed: " +
        invalidItems.map(i => i.itemName).join(", ")
      );
      setCart(cart.filter(item => validIds.has(item._id)));
      return false;
    }
    return true;
  } catch (error) {
    alert("Failed to validate cart items. Please try again.");
    return false;
  }
};

const filterCartByBackend = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get("https://easebilling.onrender.com/api/items", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const backendIds = new Set(response.data.map(item => item._id));
  const validCart = cart.filter(item => backendIds.has(item._id));
  if (validCart.length !== cart.length) {
    alert("Some items in your cart are no longer available and have been removed. Please review your cart.");
    setCart(validCart);
    return false;
  }
  return true;
};

if (!isAuthenticated) {
  return (
    <div className="login-container">
      <h2>Cashier Login</h2>
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
      <h2 className="dashboard-title">Cashier Panel</h2>
      <button className={`sidebar-button ${activeTab === "billing" ? "active" : ""}`} onClick={() => setActiveTab("billing")}>
        <FaShoppingCart /> Billing
      </button>
      <button className={`sidebar-button ${activeTab === "history" ? "active" : ""}`} onClick={() => setActiveTab("history")}>
        <FaHistory /> History
      </button>
      <button className="sidebar-button" onClick={handleLogout}>
        Logout
      </button>
    </div>

    <div className="admin-content">
      {activeTab === "billing" && (
        <>
          {!showBilling ? (
            <div className="card card-blue">
              <h3>Customer Information</h3>
              <form onSubmit={handleCustomerSubmit} className="customer-form">
                <div className="form-group">
                  <label><FaUser /> Customer Name</label>
                  <input
                    type="text"
                    placeholder="Enter customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label><FaPhone /> Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-green">Proceed to Billing</button>
              </form>
            </div>
          ) : (
            <>
              <div className="card card-blue">
                <h3>Generate Invoice</h3>
                <div className="customer-info">
                  <p><strong>Customer:</strong> {customerName}</p>
                  <p><strong>Phone:</strong> {customerPhone}</p>
                </div>
                
                <div className="search-container">
                  <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search items by name, brand, or supplier..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                      className="search-input"
                    />
                  </div>
                  
                  {searchQuery && (
                    <div className="search-results">
                      {stocks
                        .filter(
                          (item) =>
                            (item.itemName || "").toLowerCase().includes(searchQuery) ||
                            (item.brand || "").toLowerCase().includes(searchQuery) ||
                            (item.supplier || "").toLowerCase().includes(searchQuery)
                        )
                        .map((item) => (
                          <div key={item._id} className="search-result-item">
                            <div className="item-details">
                              <div className="item-info">
                                <h4>{item.itemName}</h4>
                                <p className="item-brand">{item.brand}</p>
                                <p className="item-specs">
                                  <span>Amps: {item.amps}</span>
                                  <span>Watt: {item.watt}</span>
                                </p>
                                <p className="item-stock">
                                  Available Stock: {item.stock} units
                                </p>
                              </div>
                              <div className="item-price-info">
                                <p className="item-price">₹{item.sellingPrice}</p>
                                <p className="item-gst">GST: {item.gstTax}%</p>
                                <button
                                  className="btn btn-blue"
                                  onClick={() => addToCart(item)}
                                  disabled={item.stock <= 0}
                                >
                                  Add to Bill
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      {/* Show a message if no results */}
                      {stocks.filter(
                        (item) =>
                          (item.itemName || "").toLowerCase().includes(searchQuery) ||
                          (item.brand || "").toLowerCase().includes(searchQuery) ||
                          (item.supplier || "").toLowerCase().includes(searchQuery)
                      ).length === 0 && (
                        <div className="search-result-item">No products found.</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="current-bill">
                  <h4>Current Bill Items</h4>
                  <div className="bill-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>
                        ₹
                        {cart
                          .reduce(
                            (sum, item) =>
                              sum + item.sellingPrice * item.quantity,
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span>GST:</span>
                      <span>
                        ₹
                        {cart
                          .reduce(
                            (sum, item) =>
                              sum +
                              (item.sellingPrice *
                                item.quantity *
                                item.gstTax) /
                                100,
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>
                        ₹
                        {cart
                          .reduce(
                            (sum, item) =>
                              sum +
                              item.sellingPrice *
                                item.quantity *
                                (1 + item.gstTax / 100),
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="bill-actions">
                    <button
                      className="btn btn-red"
                      onClick={() => {
                        setCart([]);
                        setCustomerName("");
                        setCustomerPhone("");
                        setShowBilling(false);
                      }}
                    >
                      Cancel Bill
                    </button>
                    <button 
                      className="btn btn-green" 
                      onClick={() => setShowPaymentModal(true)}
                      disabled={cart.length === 0}
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {activeTab === "history" && (
        <div className="card card-gray">
          <h3>Transaction History</h3>
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by Bill ID, Customer Name, or Phone"
              value={transactionSearch}
              onChange={(e) => setTransactionSearch(e.target.value.toLowerCase())}
            />
          </div>

          <div className="table-wrapper">
            <div className="table-container">
              <table className="medicine-table">
                <thead>
                  <tr>
                    <th>Bill ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Items</th>
                    <th>Total Amount</th>
                    <th>GST</th>
                    <th>Final Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions
                    .filter(
                      (transaction) =>
                        transaction.billId
                          .toLowerCase()
                          .includes(transactionSearch) ||
                        transaction.customerName
                          .toLowerCase()
                          .includes(transactionSearch) ||
                        transaction.customerPhone.includes(transactionSearch)
                    )
                    .map((transaction) => (
                      <tr key={transaction._id}>
                        <td>{transaction.billId}</td>
                        <td>
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td>{transaction.customerName}</td>
                        <td>{transaction.customerPhone}</td>
                        <td>{transaction.items.length} items</td>
                        <td>₹{transaction.totalAmount.toFixed(2)}</td>
                        <td>₹{transaction.totalGST.toFixed(2)}</td>
                        <td>₹{transaction.totalBill.toFixed(2)}</td>
                        <td>
                          <button
                            className="btn btn-red"
                            onClick={() => handleDeleteInvoice(transaction._id)}
                            title="Delete Invoice"
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
        </div>
      )}
    </div>

    {showSuccessPage && lastBillData && (
      <div className="success-modal" style={{ textAlign: 'center', margin: '30px 0', background: '#fff', borderRadius: 12, boxShadow: '0 4px 15px rgba(0,0,0,0.1)', padding: 40, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
        <h2 className="success-title">Bill Generated Successfully!</h2>
        <p className="success-message">You can now download the bill as a PDF and hand it to the customer.</p>
        {console.log('Rendering PDFDownloadLink with lastBillData:', lastBillData)}
        <pre style={{textAlign: 'left', background: '#eee', padding: 10, borderRadius: 8, fontSize: 12}}>
          {JSON.stringify(lastBillData, null, 2)}
        </pre>
        <PDFDownloadLink
          document={
            <BillPDF
              billId={lastBillData.billId}
              customerName={lastBillData.customerName}
              customerPhone={lastBillData.customerPhone}
              selectedMedicines={
                Array.isArray(lastBillData.items)
                  ? lastBillData.items.map(item => ({
                      medicineName: item.itemName || item.medicineName,
                      quantity: item.quantity,
                      sellingPrice: item.sellingPrice,
                      totalPrice: item.sellingPrice * item.quantity * (1 + (item.gstTax || 0) / 100)
                    }))
                  : []
              }
              totalAmount={lastBillData.totalAmount}
              totalGST={lastBillData.totalGST}
              totalBill={lastBillData.totalBill}
            />
          }
          fileName={`bill_${lastBillData.billId}.pdf`}
          className="download-button"
        >
          {({ loading }) => {
            console.log('PDFDownloadLink loading:', loading);
            return loading ? 'Preparing PDF...' : 'Download Bill as PDF';
          }}
        </PDFDownloadLink>
        <br />
        <button className="done-button" onClick={() => {
          setShowSuccessPage(false);
          setLastBillData(null);
          setCustomerName("");
          setCustomerPhone("");
          setBillId(`SRT-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
        }}>
          Done
        </button>
      </div>
    )}

    {showPaymentModal && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Select Payment Method</h3>
          <div className="payment-buttons">
            <button className="btn btn-green" onClick={() => { setSelectedPaymentMethod("cash"); setShowInvoicePreview(true); setShowPaymentModal(false); }}>Cash</button>
            <button className="btn btn-blue" onClick={() => { setSelectedPaymentMethod("gpay"); setShowQR(true); setShowPaymentModal(false); }}>GPay</button>
          </div>
          <button className="btn btn-red" onClick={() => setShowPaymentModal(false)}>Cancel</button>
        </div>
      </div>
    )}

    {showQR && (
      <div className="modal-overlay">
        <div className="modal-content" style={{textAlign: 'center'}}>
          <h3>Scan to Pay with GPay</h3>
          <img src={gpayQR} alt="GPay QR Code" style={{width: 250, height: 250, margin: '20px auto'}} />
          <p>UPI ID: yukesshwaran6@okicici</p>
          <button className="btn btn-green" onClick={() => { setShowQR(false); setShowInvoicePreview(true); }}>I have paid</button>
          <button className="btn btn-red" onClick={() => setShowQR(false)}>Cancel</button>
        </div>
      </div>
    )}

    {showInvoicePreview && (
      <div className="modal-overlay">
        <div className="modal-content" style={{maxWidth: 600}}>
          <h3>Invoice Preview</h3>
          <BillPDF
            billId={`BILL-${Date.now()}`}
            customerName={customerName}
            customerPhone={customerPhone}
            selectedMedicines={cart.map(item => ({
              medicineName: item.itemName,
              quantity: item.quantity,
              sellingPrice: item.sellingPrice,
              totalPrice: item.sellingPrice * item.quantity * (1 + (item.gstTax || 0) / 100)
            }))}
            totalAmount={subtotal}
            totalGST={gstAmount}
            totalBill={total}
          />
          <p><strong>Payment Method:</strong> {selectedPaymentMethod === 'GPay' ? 'GPay' : 'Cash'}</p>
          <button className="btn btn-green" onClick={handleGenerateBill}>
            Generate {selectedPaymentMethod === 'gpay' ? 'Invoice' : 'Bill'}
          </button>
          <button className="btn btn-red" onClick={() => setShowInvoicePreview(false)}>Cancel</button>
        </div>
      </div>
    )}
  </div>
);
};

export default CashierDashboard;