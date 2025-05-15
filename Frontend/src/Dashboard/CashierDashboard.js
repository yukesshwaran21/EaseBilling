// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ArrowLeft,CheckCircle,Pencil, Trash, Download, X } from "lucide-react"
// import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
// import "./CashierDashboard.css";
// import gpayQR from '../assets/gpay.png';
// import { FaShoppingCart, FaHistory, FaSearch, FaPlus, FaMinus, FaTrash, FaUser, FaPhone, FaCreditCard } from "react-icons/fa";
// import "../Dashboard/CashierDashboard.css";
// import { useLocation } from "react-router-dom";
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

// import { useNavigate } from "react-router-dom";
// // PDF Document Component
// const BillPDF = ({ billId, customerName, customerPhone, selectedMedicines, totalAmount, totalGST, totalBill }) => (
//   <Document>
//     <Page size="A8" style={styles.page}>
//       <View style={styles.section}>
//         <Text style={styles.title}>Sai Ram Electrical</Text>
//         <Text style={styles.subtitle}>46, Main Road, Aval Poondurai, Erode-638115</Text>
//         <Text style={styles.billId}>Bill ID: {billId}</Text>
        
//         <View style={styles.customerInfo}>
//           <Text>Customer Name: {customerName}</Text>
//           <Text>Phone: {customerPhone}</Text>
//         </View>

//         <View style={styles.table}>
//           <View style={styles.tableRow}>
//             <Text style={styles.tableHeader}>Item</Text>
//             <Text style={styles.tableHeader}>Qty</Text>
//             <Text style={styles.tableHeader}>Price</Text>
//             <Text style={styles.tableHeader}>Total</Text>
//           </View>
          
//           {selectedMedicines.map((medicine, index) => (
//             <View key={index} style={styles.tableRow}>
//               <Text style={styles.tableCell}>{medicine.medicineName}</Text>
//               <Text style={styles.tableCell}>{medicine.quantity}</Text>
//               <Text style={styles.tableCell}>₹{medicine.sellingPrice}</Text>
//               <Text style={styles.tableCell}>₹{medicine.totalPrice}</Text>
//             </View>
//           ))}
//         </View>

//         <View style={styles.summary}>
//           <Text style={styles.summaryText}>Total Amount: ₹{totalAmount}</Text>
//           <Text style={styles.summaryText}>Total GST: ₹{totalGST}</Text>
//           <Text style={styles.summaryText}>Total Bill: ₹{totalBill}</Text>
//         </View>

//         <Text style={styles.footer}>Thank you for your purchase!</Text>
//       </View>
//     </Page>
//   </Document>
// );

// // PDF Styles
// const styles = StyleSheet.create({
//   page: {
//     padding: 40,
//     fontSize: 12,
//     fontFamily: 'Helvetica',
//   },
//   section: {
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 20,
//     textAlign: 'center',
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 12,
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   billId: {
//     textAlign: 'right',
//     marginBottom: 10,
//   },
//   customerInfo: {
//     marginBottom: 10,
//   },
//   table: {
//     display: 'table',
//     width: 'auto',
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#000',
//   },
//   tableRow: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//     alignItems: 'center',
//   },
//   tableHeader: {
//     flex: 1,
//     fontWeight: 'bold',
//     padding: 4,
//     backgroundColor: '#eee',
//     textAlign: 'center',
//     borderRightWidth: 1,
//     borderColor: '#ccc',
//   },
//   tableCell: {
//     flex: 1,
//     padding: 4,
//     textAlign: 'center',
//     borderRightWidth: 1,
//     borderColor: '#ccc',
//   },
//   summary: {
//     marginTop: 10,
//     borderTopWidth: 1,
//     borderColor: '#ccc',
//     paddingTop: 10,
//   },
//   summaryText: {
//     marginBottom: 4,
//   },
//   footer: {
//     marginTop: 20,
//     textAlign: 'center',
//     fontStyle: 'italic',
//   }
// });

// const CashierDashboard = () => {
//   const [customerName, setCustomerName] = useState("");
//   const [customerPhone, setCustomerPhone] = useState("");
//   const [customerDetailsEntered, setCustomerDetailsEntered] = useState(false);
//   const [billId, setBillId] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [activeTab, setActiveTab] = useState("billing");
//   const [showSuccessPage, setShowSuccessPage] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedMedicines, setSelectedMedicines] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [totalGST, setTotalGST] = useState(0);
//   const [totalBill, setTotalBill] = useState(0);
//   const [invoiceGenerated, setInvoiceGenerated] = useState(false);
//   const [transactions, setTransactions] = useState([]);
//   const [selectedTransaction, setSelectedTransaction] = useState(null);
//   const [transactionSearch, setTransactionSearch] = useState("");
//   const [showPaymentOptions, setShowPaymentOptions] = useState(false);
//   const [showGPayQR, setShowGPayQR] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [isAuthenticated, setIsAuthenticated] = useState(true);
//   const [loginForm, setLoginForm] = useState({ email: "", password: "" });
//   const [loginError, setLoginError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [stocks, setStocks] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [subtotal, setSubtotal] = useState(0);
//   const [gstRate, setGstRate] = useState(0);
//   const [gstAmount, setGstAmount] = useState(0);
//   const [total, setTotal] = useState(0);
//   const [showBilling, setShowBilling] = useState(false);
//   const [lastBillData, setLastBillData] = useState(null);
//   const location = useLocation();
//   const email = location.state?.email;
//   const navigate = useNavigate();

//   // Add state for payment modal and invoice preview
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
//   const [showInvoicePreview, setShowInvoicePreview] = useState(false);
//   const [showQR, setShowQR] = useState(false);
//   const [pendingInvoiceData, setPendingInvoiceData] = useState(null);

//   useEffect(() => {
//     setBillId(`SRT-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
//   }, []);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setIsAuthenticated(false);
//       setLoginError("Session expired. Please log in again.");
//       return;
//     }
//     axios.get("https://easebilling.onrender.com/api/items", {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     })
//       .then((response) => setStocks(response.data))
//       .catch((error) => {
//         if (error.response && error.response.status === 401) {
//           setIsAuthenticated(false);
//           setLoginError("Session expired or unauthorized. Please log in again.");
//           localStorage.removeItem("token");
//         } else {
//           setLoginError("Error fetching items. Please try again later.");
//         }
//         setStocks([]);
//       });
//   }, []);

//   const fetchTransactions = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await axios.get("https://easebilling.onrender.com/api/invoices", {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       setTransactions(response.data);
//     } catch (error) {
//       console.error("Error fetching transactions:", error);
//       alert("Failed to fetch transaction history. Please refresh the page.");
//     }
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const searchMedicines = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const addMedicineToBill = (medicine, quantity) => {
//     if (!quantity || quantity <= 0) {
//       alert("Please enter a valid quantity.");
//       return;
//     }
  
//     // Check if requested quantity exceeds available stock
//     if (quantity > medicine.stockQuantity) {
//       alert(`Insufficient stock! Only ${medicine.stockQuantity} units available.`);
//       return;
//     }
  
//     const gstRate = medicine.gstTaxRate || 0;
//     const gst = (medicine.sellingPrice * quantity * gstRate) / 100;
//     const totalPrice = medicine.sellingPrice * quantity + gst;
  
//     const newMedicine = {
//       medicineId: medicine._id,
//       medicineName: medicine.name,
//       quantity,
//       sellingPrice: medicine.sellingPrice,
//       gstTaxRate: gstRate,
//       gst,
//       totalPrice,
//       stockQuantity: medicine.stockQuantity // Store original stock for validation
//     };
  
//     const updatedMedicines = [...selectedMedicines, newMedicine];
  
//     const newTotalAmount = updatedMedicines.reduce((sum, med) => sum + med.sellingPrice * med.quantity, 0);
//     const newTotalGST = updatedMedicines.reduce((sum, med) => sum + med.gst, 0);
//     const newTotalBill = newTotalAmount + newTotalGST;
  
//     setSelectedMedicines(updatedMedicines);
//     setTotalAmount(newTotalAmount);
//     setTotalGST(newTotalGST);
//     setTotalBill(newTotalBill);
//   };
  
//   const editMedicineQuantity = (index) => {
//     const newQuantity = parseInt(prompt("Enter new quantity:"), 10);
//     if (!newQuantity || newQuantity <= 0) {
//       alert("Invalid quantity!");
//       return;
//     }
  
//     const updatedMedicines = [...selectedMedicines];
//     const medicine = updatedMedicines[index];
  
//     // Check if new quantity exceeds available stock
//     if (newQuantity > medicine.stockQuantity) {
//       alert(`Insufficient stock! Only ${medicine.stockQuantity} units available.`);
//       return;
//     }
  
//     // Recalculate GST & total price based on database GST percentage
//     const oldTotal = medicine.totalPrice;
//     const oldGST = medicine.gst;
  
//     medicine.quantity = newQuantity;
//     medicine.gst = (medicine.sellingPrice * newQuantity * medicine.gstTaxRate) / 100;
//     medicine.totalPrice = medicine.sellingPrice * newQuantity + medicine.gst;
  
//     const newTotalAmount = totalAmount - (oldTotal - oldGST) + (medicine.totalPrice - medicine.gst);
//     const newTotalGST = totalGST - oldGST + medicine.gst;
//     const newTotalBill = newTotalAmount + newTotalGST;
  
//     setSelectedMedicines(updatedMedicines);
//     setTotalAmount(newTotalAmount);
//     setTotalGST(newTotalGST);
//     setTotalBill(newTotalBill);
//   };
  
  
//   const deleteMedicineFromBill = (index) => {
//     if (!window.confirm("Are you sure you want to delete this item?")) return;
  
//     const updatedMedicines = [...selectedMedicines];
//     const medicine = updatedMedicines[index];
  
//     updatedMedicines.splice(index, 1);
  
//     const newTotalAmount = totalAmount - (medicine.totalPrice - medicine.gst);
//     const newTotalGST = totalGST - medicine.gst;
//     const newTotalBill = newTotalAmount + newTotalGST;
  
//     setSelectedMedicines(updatedMedicines);
//     setTotalAmount(newTotalAmount);
//     setTotalGST(newTotalGST);
//     setTotalBill(newTotalBill);
//   };
  
  
//  const handlePayment = async () => {
//   if (cart.length === 0) {
//     alert("Please add items to the cart first");
//     return;
//   }

//   if (!customerName || !customerPhone) {
//     alert("Please enter customer details");
//     return;
//   }

//   try {
//     // Generate a unique bill ID
//     const billId = `BILL-${Date.now()}`;

//     // Prepare invoice data
//     const invoiceData = {
//       billId,
//       customerName,
//       customerPhone,
//       items: cart.map(item => ({
//         itemId: item._id,
//         itemName: item.itemName,
//         quantity: item.quantity,
//         sellingPrice: item.sellingPrice,
//         gstTax: item.gstTax
//       })),
//       totalAmount: subtotal,
//       totalGST: gstAmount,
//       totalBill: total,
//       paymentMethod: "cash" // Default to cash payment
//     };

//     // First update stock quantities
//     await updateStockQuantities(cart);

//     // Then generate invoice
//     const response = await axios.post(
//       "https://easebilling.onrender.com/api/generate-invoice",
//       invoiceData,
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       }
//     );

//     if (response.data.success) {
//       // Generate PDF
//       const pdfBlob = await pdf(
//         <BillPDF
//           billId={invoiceData.billId}
//           customerName={invoiceData.customerName}
//           customerPhone={invoiceData.customerPhone}
//           selectedMedicines={invoiceData.items.map(item => ({
//             medicineName: item.itemName,
//             quantity: item.quantity,
//             sellingPrice: item.sellingPrice,
//             totalPrice: item.sellingPrice * item.quantity * (1 + (item.gstTax || 0) / 100)
//           }))}
//           totalAmount={invoiceData.totalAmount}
//           totalGST={invoiceData.totalGST}
//           totalBill={invoiceData.totalBill}
//         />
//       ).toBlob();

//       // Create download link
//       const url = URL.createObjectURL(pdfBlob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `Invoice-${billId}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);

//       // Clear cart and customer details
//       setCart([]);
//       setCustomerName("");
//       setCustomerPhone("");
//       setSubtotal(0);
//       setGstAmount(0);
//       setTotal(0);

//       // Refresh stock data
//       await fetchStocks();

//       // Switch to history tab
//       setActiveTab("history");

//       alert("Bill generated successfully!");
//     }
//   } catch (error) {
//     console.error("Error processing payment:", error);
//     alert(error.response?.data?.error || "Error processing payment. Please try again.");
//   }
// };

// const handlePaymentMethodSelect = async (method) => {
//   console.log("Payment method selected:", method); // Debug log
//   setPaymentMethod(method);
  
//   if (method === "cash") {
//     try {
//       console.log("Processing cash payment..."); // Debug log
      
//       // Generate the invoice
//       const response = await axios.post("https://easebilling.onrender.com/api/generate-invoice", {
//         billId,
//         customerName,
//         customerPhone,
//         medicines: selectedMedicines,
//         totalAmount,
//         totalGST,
//         totalBill,
//         paymentMethod: "cash"
//       });

//       console.log("Invoice generated:", response.data); // Debug log

//       // Create and download PDF
//       const doc = (
//         <Document>
//           <Page size="A4" style={styles.page}>
//             <View style={styles.section}>
//               <Text style={styles.title}>Sai Ram Electrical</Text>
//               <Text style={styles.subtitle}>10, Sathy Main Road, Gobichettipalayam, Erode-638115</Text>
//               <Text style={styles.billId}>Bill ID: {billId}</Text>
              
//               <View style={styles.customerInfo}>
//                 <Text>Customer Name: {customerName}</Text>
//                 <Text>Phone: {customerPhone}</Text>
//               </View>

//               <View style={styles.table}>
//                 <View style={styles.tableRow}>
//                   <Text style={styles.tableHeader}>Item</Text>
//                   <Text style={styles.tableHeader}>Qty</Text>
//                   <Text style={styles.tableHeader}>Price</Text>
//                   <Text style={styles.tableHeader}>Total</Text>
//                 </View>
                
//                 {selectedMedicines.map((medicine, index) => (
//                   <View key={index} style={styles.tableRow}>
//                     <Text style={styles.tableCell}>{medicine.medicineName}</Text>
//                     <Text style={styles.tableCell}>{medicine.quantity}</Text>
//                     <Text style={styles.tableCell}>₹{medicine.sellingPrice}</Text>
//                     <Text style={styles.tableCell}>₹{medicine.totalPrice}</Text>
//                   </View>
//                 ))}
//               </View>

//               <View style={styles.summary}>
//                 <Text style={styles.summaryText}>Total Amount: ₹{totalAmount}</Text>
//                 <Text style={styles.summaryText}>Total GST: ₹{totalGST}</Text>
//                 <Text style={styles.summaryText}>Total Bill: ₹{totalBill}</Text>
//                 <Text style={styles.summaryText}>Payment Method: Cash</Text>
//               </View>

//               <Text style={styles.footer}>Thank you for your purchase!</Text>
//             </View>
//           </Page>
//         </Document>
//       );

//       // Download PDF
//       const blob = await pdf(doc).toBlob();
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `bill_${billId}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);

//       // Update stock quantities
//       await updateStockQuantities(selectedMedicines);

//       // Update state
//       setInvoiceGenerated(true);
//       setShowSuccessPage(true);
//       setShowPaymentOptions(false);
//       setShowGPayQR(false);

//       console.log("Cash payment completed successfully"); // Debug log
//     } catch (err) {
//       console.error("Error in cash payment:", err); // Debug log
//       alert("Error processing payment. Please try again.");
//     }
//   } else if (method === "gpay") {
//     setShowGPayQR(true);
//   }
// };

// const generateAndDownloadBill = async () => {
//   try {
//     // First, generate the invoice
//     const response = await axios.post("https://easebilling.onrender.com/api/generate-invoice", {
//       billId,
//       customerName,
//       customerPhone,
//       medicines: selectedMedicines,
//       totalAmount,
//       totalGST,
//       totalBill,
//       paymentMethod
//     });

//     if (response.status === 200) {
//       // Generate and download the PDF
//       const doc = (
//         <Document>
//           <Page size="A4" style={styles.page}>
//             <View style={styles.section}>
//               <img src="C:\Users\HP\Pictures\Screenshots\Screenshot 2025-04-09 141128.png" >Sai</img>
//               <Text style={styles.title}>Sai Ram Electrical</Text>
//               <Text style={styles.subtitle}>10, Sathy Main Road, Gobichettipalayam, Erode-638115</Text>
//               <Text style={styles.billId}>Bill ID: {billId}</Text>
              
//               <View style={styles.customerInfo}>
//                 <Text>Customer Name: {customerName}</Text>
//                 <Text>Phone: {customerPhone}</Text>
//               </View>

//               <View style={styles.table}>
//                 <View style={styles.tableRow}>
//                   <Text style={styles.tableHeader}>Item</Text>
//                   <Text style={styles.tableHeader}>Qty</Text>
//                   <Text style={styles.tableHeader}>Price</Text>
//                   <Text style={styles.tableHeader}>Total</Text>
//                 </View>
                
//                 {selectedMedicines.map((medicine, index) => (
//                   <View key={index} style={styles.tableRow}>
//                     <Text style={styles.tableCell}>{medicine.medicineName}</Text>
//                     <Text style={styles.tableCell}>{medicine.quantity}</Text>
//                     <Text style={styles.tableCell}>₹{medicine.sellingPrice}</Text>
//                     <Text style={styles.tableCell}>₹{medicine.totalPrice}</Text>
//                   </View>
//                 ))}
//               </View>

//               <View style={styles.summary}>
//                 <Text style={styles.summaryText}>Total Amount: ₹{totalAmount}</Text>
//                 <Text style={styles.summaryText}>Total GST: ₹{totalGST}</Text>
//                 <Text style={styles.summaryText}>Total Bill: ₹{totalBill}</Text>
//                 <Text style={styles.summaryText}>Payment Method: {paymentMethod === "cash" ? "Cash" : "GPay"}</Text>
//               </View>

//               <Text style={styles.footer}>Thank you for your purchase!</Text>
//             </View>
//           </Page>
//         </Document>
//       );

//       const blob = await pdf(doc).toBlob();
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `bill_${billId}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);

//       // Update stock quantities after successful payment
//       await updateStockQuantities(selectedMedicines);

//       setInvoiceGenerated(true);
//       setShowSuccessPage(true);
//       setShowPaymentOptions(false);
//       setShowGPayQR(false);
//     }
//   } catch (err) {
//     console.error("Error processing payment:", err);
//     alert("Error processing payment. Please try again.");
//   }
// };

// const updateStockQuantities = async (items) => {
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       throw new Error("No authentication token found");
//     }

//     // Update each item's stock
//     for (const item of items) {
//       try {
//         const response = await axios.put(
//           `https://easebilling.onrender.com/api/items/${item._id}/update-stock`,
//           { 
//             quantity: item.quantity,
//             operation: 'decrease'
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`
//             }
//           }
//         );
        
//         if (response.status !== 200) {
//           throw new Error(`Failed to update stock for item: ${item.itemName}`);
//         }
//       } catch (err) {
//         console.error(`Error updating stock for item ${item.itemName}:`, err);
//         throw new Error(`Failed to update stock for item: ${item.itemName} - ${err.response?.data?.error || err.message}`);
//       }
//     }
    
//     // Refresh stock data after all updates
//     await fetchStocks();
//   } catch (error) {
//     console.error("Error updating stock quantities:", error);
//     throw error;
//   }
// };

// const handleGPayPaymentComplete = async () => {
//   try {
//     // Generate the invoice
//     const response = await axios.post("https://easebilling.onrender.com/api/generate-invoice", {
//       billId,
//       customerName,
//       customerPhone,
//       medicines: selectedMedicines,
//       totalAmount,
//       totalGST,
//       totalBill,
//       paymentMethod: "gpay"
//     });

//     if (response.status === 200) {
//       // Create and download PDF
//       const doc = (
//         <Document>
//           <Page size="A4" style={styles.page}>
//             <View style={styles.section}>
//               <Text style={styles.title}>Sai Ram Electrical</Text>
//               <Text style={styles.subtitle}>10, Sathy Main Road, Gobichettipalayam, Erode-638115</Text>
//               <Text style={styles.billId}>Bill ID: {billId}</Text>
              
//               <View style={styles.customerInfo}>
//                 <Text>Customer Name: {customerName}</Text>
//                 <Text>Phone: {customerPhone}</Text>
//               </View>

//               <View style={styles.table}>
//                 <View style={styles.tableRow}>
//                   <Text style={styles.tableHeader}>Item</Text>
//                   <Text style={styles.tableHeader}>Qty</Text>
//                   <Text style={styles.tableHeader}>Price</Text>
//                   <Text style={styles.tableHeader}>Total</Text>
//                 </View>
                
//                 {selectedMedicines.map((medicine, index) => (
//                   <View key={index} style={styles.tableRow}>
//                     <Text style={styles.tableCell}>{medicine.medicineName}</Text>
//                     <Text style={styles.tableCell}>{medicine.quantity}</Text>
//                     <Text style={styles.tableCell}>₹{medicine.sellingPrice}</Text>
//                     <Text style={styles.tableCell}>₹{medicine.totalPrice}</Text>
//                   </View>
//                 ))}
//               </View>

//               <View style={styles.summary}>
//                 <Text style={styles.summaryText}>Total Amount: ₹{totalAmount}</Text>
//                 <Text style={styles.summaryText}>Total GST: ₹{totalGST}</Text>
//                 <Text style={styles.summaryText}>Total Bill: ₹{totalBill}</Text>
//                 <Text style={styles.summaryText}>Payment Method: GPay</Text>
//               </View>

//               <Text style={styles.footer}>Thank you for your purchase!</Text>
//             </View>
//           </Page>
//         </Document>
//       );

//       // Download PDF
//       const blob = await pdf(doc).toBlob();
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `bill_${billId}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);

//       // Update stock quantities
//       await updateStockQuantities(selectedMedicines);

//       // Show success page with bill preview
//     setInvoiceGenerated(true);
//       setShowSuccessPage(true);
//       setShowPaymentOptions(false);
//       setShowGPayQR(false);
//     }
//   } catch (err) {
//     console.error("Error processing GPay payment:", err);
//     alert("Error processing payment. Please try again.");
//   }
// };

// const filteredTransactions = transactions.filter((txn) => {
//   return (
//     txn.billId.toLowerCase().includes(transactionSearch.toLowerCase()) ||
//     txn.customerName.toLowerCase().includes(transactionSearch.toLowerCase()) ||
//     txn.customerPhone.includes(transactionSearch) ||
//     new Date(txn.date).toLocaleDateString().includes(transactionSearch)
//   );
// });
// // Function to reset and go back to customer details
// const handleDone = () => {
//   setShowSuccessPage(false);
//   setCustomerDetailsEntered(false);
//   setSelectedMedicines([]);
//   setTotalAmount(0);
//   setTotalGST(0);
//   setTotalBill(0);
//   setBillId(`SRT-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
//   setCustomerName("");
//   setCustomerPhone("");
// };

// const handleDownloadPDF = async () => {
//   try {
//     const doc = (
//       <Document>
//         <Page size="A4" style={styles.page}>
//           <View style={styles.section}>
//             <Text style={styles.title}>Sai Ram Electrical</Text>
//             <Text style={styles.subtitle}>10, Sathy Main Road, Gobichettipalayam, Erode-638115</Text>
//             <Text style={styles.billId}>Bill ID: {billId}</Text>
            
//             <View style={styles.customerInfo}>
//               <Text>Customer Name: {customerName}</Text>
//               <Text>Phone: {customerPhone}</Text>
//             </View>

//             <View style={styles.table}>
//               <View style={styles.tableRow}>
//                 <Text style={styles.tableHeader}>Item</Text>
//                 <Text style={styles.tableHeader}>Qty</Text>
//                 <Text style={styles.tableHeader}>Price</Text>
//                 <Text style={styles.tableHeader}>Total</Text>
//               </View>
              
//               {selectedMedicines.map((medicine, index) => (
//                 <View key={index} style={styles.tableRow}>
//                   <Text style={styles.tableCell}>{medicine.medicineName}</Text>
//                   <Text style={styles.tableCell}>{medicine.quantity}</Text>
//                   <Text style={styles.tableCell}>₹{medicine.sellingPrice}</Text>
//                   <Text style={styles.tableCell}>₹{medicine.totalPrice}</Text>
//                 </View>
//               ))}
//             </View>

//             <View style={styles.summary}>
//               <Text style={styles.summaryText}>Total Amount: ₹{totalAmount}</Text>
//               <Text style={styles.summaryText}>Total GST: ₹{totalGST}</Text>
//               <Text style={styles.summaryText}>Total Bill: ₹{totalBill}</Text>
//             </View>

//             <Text style={styles.footer}>Thank you for your purchase!</Text>
//           </View>
//         </Page>
//       </Document>
//     );

//     const blob = await pdf(doc).toBlob();
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `bill_${billId}.pdf`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     alert('Error generating PDF. Please try again.');
//   }
// };

// const handleDeleteTransaction = async (billId) => {
//   if (window.confirm("Are you sure you want to delete this transaction? This action cannot be undone.")) {
//     try {
//       // First try to delete the invoice
//       const deleteResponse = await axios.delete(`https://easebilling.onrender.com/api/invoices/${billId}`);
      
//       if (deleteResponse.status === 200) {
//         // If successful, refresh the transactions list
//         const response = await axios.get("https://easebilling.onrender.com/api/invoices");
//         setTransactions(response.data);
//         alert("Transaction deleted successfully");
//       } else {
//         throw new Error("Failed to delete transaction");
//       }
//     } catch (err) {
//       console.error("Error deleting transaction:", err);
//       if (err.response) {
//         // The request was made and the server responded with a status code
//         // that falls out of the range of 2xx
//         console.error("Error response:", err.response.data);
//         alert(`Error deleting transaction: ${err.response.data.message || 'Please try again.'}`);
//       } else if (err.request) {
//         // The request was made but no response was received
//         console.error("No response received:", err.request);
//         alert("No response from server. Please check your connection and try again.");
//       } else {
//         // Something happened in setting up the request that triggered an Error
//         console.error("Error setting up request:", err.message);
//         alert("Error setting up request. Please try again.");
//       }
//     }
//   }
// };

// const handleLogin = async (e) => {
//   e.preventDefault();
//   try {
//     const response = await axios.post("https://easebilling.onrender.com/api/login", loginForm);
//     console.log("Login response:", response.data);
    
//     if (response.data.token) {
//       localStorage.setItem("token", response.data.token);
//       setIsAuthenticated(true);
//       setLoginError("");
//       setLoginForm({ email: "", password: "" });
//     } else {
//       setLoginError("Invalid response from server");
//     }
//   } catch (error) {
//     console.error("Login error:", error);
//     const errorMsg = error.response?.data?.error || "Login failed. Please check your credentials.";
//     setLoginError(errorMsg);
//   }
// };

// const handleLogout = () => {
//   localStorage.removeItem("token");
//   setIsAuthenticated(false);
//   navigate("/login");
// };

// const addToCart = async (item) => {
//   try {
//     // Get all items at once
//     const token = localStorage.getItem("token");
//     const response = await axios.get("https://easebilling.onrender.com/api/items", {
//       headers: { Authorization: `Bearer ${token}` }
//     });
    
//     const allItems = response.data;
//     const currentItem = allItems.find(i => i._id === item._id);
    
//     if (!currentItem) {
//       alert("This item is no longer available in stock.");
//       return;
//     }
    
//     const currentStock = currentItem.stock;
    
//     // Prompt for quantity with available stock info
//     const quantity = parseInt(prompt(`Enter quantity for ${item.itemName} (Available: ${currentStock} units):`), 10);
    
//     if (!quantity || isNaN(quantity) || quantity <= 0) {
//       alert("Please enter a valid quantity.");
//       return;
//     }
    
//     if (quantity > currentStock) {
//       alert(`Insufficient stock! Only ${currentStock} units available.`);
//       return;
//     }

//     // Check if item already exists in cart
//     const existingItem = cart.find(cartItem => cartItem._id === item._id);
//     if (existingItem) {
//       const newTotalQuantity = existingItem.quantity + quantity;
//       if (newTotalQuantity > currentStock) {
//         alert(`Cannot add ${quantity} more units. Total quantity would exceed available stock of ${currentStock} units.`);
//         return;
//       }
      
//       setCart(prevCart =>
//         prevCart.map(cartItem =>
//           cartItem._id === item._id
//             ? { ...cartItem, quantity: newTotalQuantity }
//             : cartItem
//         )
//       );
//     } else {
//       setCart(prevCart => [...prevCart, { ...item, quantity }]);
//     }

//     // Recalculate totals
//     const newCart = existingItem 
//       ? cart.map(cartItem => 
//           cartItem._id === item._id 
//             ? { ...cartItem, quantity: cartItem.quantity + quantity }
//             : cartItem
//         )
//       : [...cart, { ...item, quantity }];

//     const newSubtotal = newCart.reduce((sum, cartItem) => 
//       sum + (cartItem.sellingPrice * cartItem.quantity), 0);
//     setSubtotal(newSubtotal);

//     const newGstAmount = newCart.reduce((sum, cartItem) => 
//       sum + (cartItem.sellingPrice * cartItem.quantity * cartItem.gstTax / 100), 0);
//     setGstAmount(newGstAmount);

//     setTotal(newSubtotal + newGstAmount);

//   } catch (error) {
//     console.error("Error adding item to cart:", error);
//     alert("Error adding item to cart. Please try again.");
//   }
// };

// const updateQuantity = (id, change) => {
//   // Implement updating quantity logic here
// };

// const removeFromCart = (id) => {
//   // Implement removing medicine from cart logic here
// };

// const fetchStocks = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       throw new Error("No authentication token found");
//     }

//     const response = await axios.get("https://easebilling.onrender.com/api/items", {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });

//     if (response.data) {
//       setStocks(response.data);
//       console.log("Stocks updated successfully:", response.data);
//     }
//   } catch (error) {
//     console.error("Error fetching stocks:", error);
//     if (error.response?.status === 401) {
//       alert("Session expired. Please log in again.");
//       localStorage.removeItem("token");
//       window.location.reload();
//     } else {
//       alert("Failed to fetch stock data. Please refresh the page.");
//     }
//   }
// };

// const handleGenerateBill = async () => {
//   if (!customerName.trim() || !customerPhone.trim()) {
//     alert("Please enter both customer name and phone number.");
//     return;
//   }
//   if (cart.length === 0) {
//     alert("Please add at least one item to the bill.");
//     return;
//   }
//   try {
//     const token = localStorage.getItem("token");
//     // Get all items at once
//     const itemsResponse = await axios.get("https://easebilling.onrender.com/api/items", {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     const allItems = itemsResponse.data;
//     const itemsMap = new Map(allItems.map(item => [item._id, item]));
//     // Validate stock for all items in cart
//     for (const cartItem of cart) {
//       const item = itemsMap.get(cartItem._id);
//       if (!item) {
//         alert(`Item ${cartItem.itemName} is no longer available in stock.`);
//         return;
//       }
//       if (item.stock < cartItem.quantity) {
//         alert(`Insufficient stock for ${cartItem.itemName}. Only ${item.stock} units available.`);
//         return;
//       }
//     }
//     // If all validations pass, proceed with bill generation
//     const invoicePayload = {
//       billId,
//       customerName,
//       customerPhone,
//       items: cart.map(item => ({
//         itemId: item._id,
//         itemName: item.itemName,
//         quantity: item.quantity,
//         sellingPrice: item.sellingPrice,
//         gstTax: item.gstTax
//       })),
//       totalAmount: subtotal,
//       totalGST: gstAmount,
//       totalBill: total,
//       paymentMethod: selectedPaymentMethod
//     };
//     console.log('Sending invoice payload:', invoicePayload);
//     const response = await axios.post("https://easebilling.onrender.com/api/generate-invoice", invoicePayload, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     if (response.status === 200) {
//       // Automatically generate and download the PDF
//       const doc = (
//         <Document>
//           <Page size="A4" style={styles.page}>
//             <View style={styles.section}>
//               <Text style={styles.title}>Sai Ram Electrical</Text>
//               <Text style={styles.subtitle}>10, Sathy Main Road, Gobichettipalayam, Erode-638115</Text>
//               <Text style={styles.billId}>Bill ID: {billId}</Text>
//               <View style={styles.customerInfo}>
//                 <Text>Customer Name: {customerName}</Text>
//                 <Text>Phone: {customerPhone}</Text>
//               </View>
//               <View style={styles.table}>
//                 <View style={styles.tableRow}>
//                   <Text style={styles.tableHeader}>Item</Text>
//                   <Text style={styles.tableHeader}>Qty</Text>
//                   <Text style={styles.tableHeader}>Price</Text>
//                   <Text style={styles.tableHeader}>Total</Text>
//                 </View>
//                 {cart.map((item, index) => (
//                   <View key={index} style={styles.tableRow}>
//                     <Text style={styles.tableCell}>{item.itemName}</Text>
//                     <Text style={styles.tableCell}>{item.quantity}</Text>
//                     <Text style={styles.tableCell}>₹{item.sellingPrice}</Text>
//                     <Text style={styles.tableCell}>₹{(item.sellingPrice * item.quantity * (1 + (item.gstTax || 0) / 100)).toFixed(2)}</Text>
//                   </View>
//                 ))}
//               </View>
//               <View style={styles.summary}>
//                 <Text style={styles.summaryText}>Total Amount: ₹{subtotal}</Text>
//                 <Text style={styles.summaryText}>Total GST: ₹{gstAmount}</Text>
//                 <Text style={styles.summaryText}>Total Bill: ₹{total}</Text>
//                 <Text style={styles.summaryText}>Payment Method: {selectedPaymentMethod === 'gpay' ? 'GPay' : selectedPaymentMethod}</Text>
//               </View>
//               <Text style={styles.footer}>Thank you for your purchase!</Text>
//             </View>
//           </Page>
//         </Document>
//       );
//       const blob = await pdf(doc).toBlob();
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `bill_${billId}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//       // Update stock quantities after successful bill generation
//       await updateStockQuantities(cart);
//       // Clear cart and reset totals
//       setCart([]);
//       setSubtotal(0);
//       setGstAmount(0);
//       setTotal(0);
//       setCustomerName("");
//       setCustomerPhone("");
//       // Show success message
//       alert("Bill generated successfully!");
//       // Refresh stock data
//       await fetchStocks();
//     }
//   } catch (error) {
//     console.error("Error generating bill:", error);
//     alert(error.response?.data?.error || "Error generating bill. Please try again.");
//   }
// };

// const handleCustomerSubmit = (e) => {
//   e.preventDefault();
//   if (!customerName.trim() || !customerPhone.trim()) {
//     alert("Please enter both customer name and phone number");
//     return;
//   }
//   if (!/^\d{10}$/.test(customerPhone.trim())) {
//     alert("Please enter a valid 10-digit phone number");
//     return;
//   }
//   setShowBilling(true);
// };

// // Add function to update stock in database
// const updateStockInDatabase = async (itemId, quantity) => {
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       throw new Error("No authentication token found");
//     }

//     const response = await axios.put(
//       `https://easebilling.onrender.com/api/items/${itemId}/update-stock`,
//       { quantity },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }
//     );

//     if (response.status !== 200) {
//       throw new Error("Failed to update stock");
//     }

//     return response.data;
//   } catch (error) {
//     console.error("Error updating stock:", error);
//     throw error;
//   }
// };

// // Add this function to handle invoice deletion
// const handleDeleteInvoice = async (invoiceId) => {
//   if (!window.confirm("Are you sure you want to delete this invoice? This action cannot be undone.")) {
//     return;
//   }

//   try {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       throw new Error("No authentication token found");
//     }

//     // Find the invoice to get its billId
//     const invoice = transactions.find(t => t._id === invoiceId);
//     if (!invoice) {
//       throw new Error("Invoice not found");
//     }

//     console.log("Attempting to delete invoice with billId:", invoice.billId); // Debug log

//     // Delete the invoice using billId
//     const response = await axios.delete(
//       `https://easebilling.onrender.com/api/invoices/${invoice.billId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     console.log("Delete response:", response); // Debug log

//     if (response.status === 200 || response.status === 204) {
//       // Remove the deleted invoice from the local state
//       setTransactions(prevTransactions => 
//         prevTransactions.filter(transaction => transaction._id !== invoiceId)
//       );
      
//       // Show success message
//       alert("Invoice deleted successfully");
      
//       // Refresh the transactions list
//       await fetchTransactions();
//     } else {
//       throw new Error("Failed to delete invoice");
//     }
//   } catch (error) {
//     console.error("Error deleting invoice:", error);
    
//     // More detailed error message
//     if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       console.error("Error response data:", error.response.data);
//       console.error("Error response status:", error.response.status);
//       alert(`Failed to delete invoice: ${error.response.data.error || 'Server error occurred'}`);
//     } else if (error.request) {
//       // The request was made but no response was received
//       console.error("No response received:", error.request);
//       alert("No response from server. Please check your connection and try again.");
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       console.error("Error setting up request:", error.message);
//       alert("Error setting up request. Please try again.");
//     }
//   }
// };

// // Add Razorpay script
// useEffect(() => {
//   const script = document.createElement('script');
//   script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//   script.async = true;
//   document.body.appendChild(script);

//   return () => {
//     document.body.removeChild(script);
//   };
// }, []);

// const initializeRazorpay = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       throw new Error("No authentication token found");
//     }

//     // Create order on backend
//     const response = await axios.post(
//       "https://easebilling.onrender.com/api/create-order",
//       {
//         amount: total * 100, // Razorpay expects amount in paise
//         currency: "INR",
//         receipt: billId
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }
//     );

//     const options = {
//       key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay key
//       amount: total * 100,
//       currency: "INR",
//       name: "Sai Ram Electrical",
//       description: `Bill ID: ${billId}`,
//       order_id: response.data.id,
//       handler: function (response) {
//         handlePaymentSuccess(response);
//       },
//       prefill: {
//         name: customerName,
//         contact: customerPhone
//       },
//       theme: {
//         color: "#4CAF50"
//       }
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   } catch (error) {
//     console.error("Error initializing Razorpay:", error);
//     alert("Error initializing payment. Please try again.");
//   }
// };

// const handlePaymentSuccess = async (response) => {
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       throw new Error("No authentication token found");
//     }

//     // Verify payment on backend
//     const verifyResponse = await axios.post(
//       "https://easebilling.onrender.com/api/verify-payment",
//       {
//         razorpay_payment_id: response.razorpay_payment_id,
//         razorpay_order_id: response.razorpay_order_id,
//         razorpay_signature: response.razorpay_signature
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }
//     );

//     if (verifyResponse.data.verified) {
//       // Generate bill with payment details
//       await handleGenerateBill();
//       alert("Payment successful! Bill generated.");
//     } else {
//       throw new Error("Payment verification failed");
//     }
//   } catch (error) {
//     console.error("Error verifying payment:", error);
//     alert("Error verifying payment. Please contact support.");
//   }
// };

// // Validate cart items before billing
// const validateCartItems = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await axios.get("https://easebilling.onrender.com/api/items", {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     const backendItems = response.data;
//     const validIds = new Set(backendItems.map(item => item._id));
//     const invalidItems = cart.filter(item => !validIds.has(item._id));
//     if (invalidItems.length > 0) {
//       alert(
//         "Some items in your cart are no longer available in stock and will be removed: " +
//         invalidItems.map(i => i.itemName).join(", ")
//       );
//       setCart(cart.filter(item => validIds.has(item._id)));
//       return false;
//     }
//     return true;
//   } catch (error) {
//     alert("Failed to validate cart items. Please try again.");
//     return false;
//   }
// };

// const filterCartByBackend = async () => {
//   const token = localStorage.getItem("token");
//   const response = await axios.get("https://easebilling.onrender.com/api/items", {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   const backendIds = new Set(response.data.map(item => item._id));
//   const validCart = cart.filter(item => backendIds.has(item._id));
//   if (validCart.length !== cart.length) {
//     alert("Some items in your cart are no longer available and have been removed. Please review your cart.");
//     setCart(validCart);
//     return false;
//   }
//   return true;
// };

// if (!isAuthenticated) {
//   return (
//     <div className="login-container">
//       <h2>Cashier Login</h2>
//       <form onSubmit={handleLogin}>
//         <div className="form-group">
//           <label>Email</label>
//           <input
//             type="email"
//             value={loginForm.email}
//             onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Password</label>
//           <input
//             type="password"
//             value={loginForm.password}
//             onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
//             required
//           />
//         </div>
//         {loginError && <div className="alert alert-error">{loginError}</div>}
//         <button type="submit" className="btn btn-green" style={{ width: "100%" }}>
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }

// return (
//   <div className="dashboard-container">
//     <div className="sidebar">
//       <h2 className="dashboard-title">Cashier Panel</h2>
//       <button className={`sidebar-button ${activeTab === "billing" ? "active" : ""}`} onClick={() => setActiveTab("billing")}>
//         <FaShoppingCart /> Billing
//       </button>
//       <button className={`sidebar-button ${activeTab === "history" ? "active" : ""}`} onClick={() => setActiveTab("history")}>
//         <FaHistory /> History
//       </button>
//       <button className="sidebar-button" onClick={handleLogout}>
//         Logout
//       </button>
//     </div>

//     <div className="admin-content">
//       {activeTab === "billing" && (
//         <>
//           {!showBilling ? (
//             <div className="card card-blue">
//               <h3>Customer Information</h3>
//               <form onSubmit={handleCustomerSubmit} className="customer-form">
//                 <div className="form-group">
//                   <label><FaUser /> Customer Name</label>
//                   <input
//                     type="text"
//                     placeholder="Enter customer name"
//                     value={customerName}
//                     onChange={(e) => setCustomerName(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label><FaPhone /> Phone Number</label>
//                   <input
//                     type="tel"
//                     placeholder="Enter 10-digit phone number"
//                     value={customerPhone}
//                     onChange={(e) => setCustomerPhone(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <button type="submit" className="btn btn-green">Proceed to Billing</button>
//               </form>
//             </div>
//           ) : (
//             <>
//               <div className="card card-blue">
//                 <h3>Generate Invoice</h3>
//                 <div className="customer-info">
//                   <p><strong>Customer:</strong> {customerName}</p>
//                   <p><strong>Phone:</strong> {customerPhone}</p>
//                 </div>
                
//                 <div className="search-container">
//                   <div className="search-box">
//                     <FaSearch className="search-icon" />
//                     <input
//                       type="text"
//                       placeholder="Search items by name, brand, or supplier..."
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
//                       className="search-input"
//                     />
//                   </div>
                  
//                   {searchQuery && (
//                     <div className="search-results">
//                       {stocks
//                         .filter(
//                           (item) =>
//                             (item.itemName || "").toLowerCase().includes(searchQuery) ||
//                             (item.brand || "").toLowerCase().includes(searchQuery) ||
//                             (item.supplier || "").toLowerCase().includes(searchQuery)
//                         )
//                         .map((item) => (
//                           <div key={item._id} className="search-result-item">
//                             <div className="item-details">
//                               <div className="item-info">
//                                 <h4>{item.itemName}</h4>
//                                 <p className="item-brand">{item.brand}</p>
//                                 <p className="item-specs">
//                                   <span>Amps: {item.amps}</span>
//                                   <span>Watt: {item.watt}</span>
//                                 </p>
//                                 <p className="item-stock">
//                                   Available Stock: {item.stock} units
//                                 </p>
//                               </div>
//                               <div className="item-price-info">
//                                 <p className="item-price">₹{item.sellingPrice}</p>
//                                 <p className="item-gst">GST: {item.gstTax}%</p>
//                                 <button
//                                   className="btn btn-blue"
//                                   onClick={() => addToCart(item)}
//                                   disabled={item.stock <= 0}
//                                 >
//                                   Add to Bill
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       {/* Show a message if no results */}
//                       {stocks.filter(
//                         (item) =>
//                           (item.itemName || "").toLowerCase().includes(searchQuery) ||
//                           (item.brand || "").toLowerCase().includes(searchQuery) ||
//                           (item.supplier || "").toLowerCase().includes(searchQuery)
//                       ).length === 0 && (
//                         <div className="search-result-item">No products found.</div>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 <div className="current-bill">
//                   <h4>Current Bill Items</h4>
//                   <div className="bill-summary">
//                     <div className="summary-row">
//                       <span>Subtotal:</span>
//                       <span>
//                         ₹
//                         {cart
//                           .reduce(
//                             (sum, item) =>
//                               sum + item.sellingPrice * item.quantity,
//                             0
//                           )
//                           .toFixed(2)}
//                       </span>
//                     </div>
//                     <div className="summary-row">
//                       <span>GST:</span>
//                       <span>
//                         ₹
//                         {cart
//                           .reduce(
//                             (sum, item) =>
//                               sum +
//                               (item.sellingPrice *
//                                 item.quantity *
//                                 item.gstTax) /
//                                 100,
//                             0
//                           )
//                           .toFixed(2)}
//                       </span>
//                     </div>
//                     <div className="summary-row total">
//                       <span>Total:</span>
//                       <span>
//                         ₹
//                         {cart
//                           .reduce(
//                             (sum, item) =>
//                               sum +
//                               item.sellingPrice *
//                                 item.quantity *
//                                 (1 + item.gstTax / 100),
//                             0
//                           )
//                           .toFixed(2)}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="bill-actions">
//                     <button
//                       className="btn btn-red"
//                       onClick={() => {
//                         setCart([]);
//                         setCustomerName("");
//                         setCustomerPhone("");
//                         setShowBilling(false);
//                       }}
//                     >
//                       Cancel Bill
//                     </button>
//                     <button 
//                       className="btn btn-green" 
//                       onClick={() => setShowPaymentModal(true)}
//                       disabled={cart.length === 0}
//                     >
//                       Proceed to Payment
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </>
//       )}

//       {activeTab === "history" && (
//         <div className="card card-gray">
//           <h3>Transaction History</h3>
//           <div className="search-box">
//             <FaSearch className="search-icon" />
//             <input
//               type="text"
//               placeholder="Search by Bill ID, Customer Name, or Phone"
//               value={transactionSearch}
//               onChange={(e) => setTransactionSearch(e.target.value.toLowerCase())}
//             />
//           </div>

//           <div className="table-wrapper">
//             <div className="table-container">
//               <table className="medicine-table">
//                 <thead>
//                   <tr>
//                     <th>Bill ID</th>
//                     <th>Date</th>
//                     <th>Customer</th>
//                     <th>Phone</th>
//                     <th>Items</th>
//                     <th>Total Amount</th>
//                     <th>GST</th>
//                     <th>Final Amount</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {transactions
//                     .filter(
//                       (transaction) =>
//                         transaction.billId
//                           .toLowerCase()
//                           .includes(transactionSearch) ||
//                         transaction.customerName
//                           .toLowerCase()
//                           .includes(transactionSearch) ||
//                         transaction.customerPhone.includes(transactionSearch)
//                     )
//                     .map((transaction) => (
//                       <tr key={transaction._id}>
//                         <td>{transaction.billId}</td>
//                         <td>
//                           {new Date(transaction.date).toLocaleDateString()}
//                         </td>
//                         <td>{transaction.customerName}</td>
//                         <td>{transaction.customerPhone}</td>
//                         <td>{transaction.items.length} items</td>
//                         <td>₹{transaction.totalAmount.toFixed(2)}</td>
//                         <td>₹{transaction.totalGST.toFixed(2)}</td>
//                         <td>₹{transaction.totalBill.toFixed(2)}</td>
//                         <td>
//                           <button
//                             className="btn btn-red"
//                             onClick={() => handleDeleteInvoice(transaction._id)}
//                             title="Delete Invoice"
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
//         </div>
//       )}
//     </div>

//     {showSuccessPage && lastBillData && (
//       <div className="success-modal" style={{ textAlign: 'center', margin: '30px 0', background: '#fff', borderRadius: 12, boxShadow: '0 4px 15px rgba(0,0,0,0.1)', padding: 40, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
//         <h2 className="success-title">Bill Generated Successfully!</h2>
//         <p className="success-message">You can now download the bill as a PDF and hand it to the customer.</p>
//         {console.log('Rendering PDFDownloadLink with lastBillData:', lastBillData)}
//         <pre style={{textAlign: 'left', background: '#eee', padding: 10, borderRadius: 8, fontSize: 12}}>
//           {JSON.stringify(lastBillData, null, 2)}
//         </pre>
//         <PDFDownloadLink
//           document={
//             <BillPDF
//               billId={lastBillData.billId}
//               customerName={lastBillData.customerName}
//               customerPhone={lastBillData.customerPhone}
//               selectedMedicines={
//                 Array.isArray(lastBillData.items)
//                   ? lastBillData.items.map(item => ({
//                       medicineName: item.itemName || item.medicineName,
//                       quantity: item.quantity,
//                       sellingPrice: item.sellingPrice,
//                       totalPrice: item.sellingPrice * item.quantity * (1 + (item.gstTax || 0) / 100)
//                     }))
//                   : []
//               }
//               totalAmount={lastBillData.totalAmount}
//               totalGST={lastBillData.totalGST}
//               totalBill={lastBillData.totalBill}
//             />
//           }
//           fileName={`bill_${lastBillData.billId}.pdf`}
//           className="download-button"
//         >
//           {({ loading }) => {
//             console.log('PDFDownloadLink loading:', loading);
//             return loading ? 'Preparing PDF...' : 'Download Bill as PDF';
//           }}
//         </PDFDownloadLink>
//         <br />
//         <button className="done-button" onClick={() => {
//           setShowSuccessPage(false);
//           setLastBillData(null);
//           setCustomerName("");
//           setCustomerPhone("");
//           setBillId(`SRT-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
//         }}>
//           Done
//         </button>
//       </div>
//     )}

//     {showPaymentModal && (
//       <div className="modal-overlay">
//         <div className="modal-content">
//           <h3>Select Payment Method</h3>
//           <div className="payment-buttons">
//             <button className="btn btn-green" onClick={() => { setSelectedPaymentMethod("cash"); setShowInvoicePreview(true); setShowPaymentModal(false); }}>Cash</button>
//             <button className="btn btn-blue" onClick={() => { setSelectedPaymentMethod("gpay"); setShowQR(true); setShowPaymentModal(false); }}>GPay</button>
//           </div>
//           <button className="btn btn-red" onClick={() => setShowPaymentModal(false)}>Cancel</button>
//         </div>
//       </div>
//     )}

//     {showQR && (
//       <div className="modal-overlay">
//         <div className="modal-content" style={{textAlign: 'center'}}>
//           <h3>Scan to Pay with GPay</h3>
//           <img src={gpayQR} alt="GPay QR Code" style={{width: 250, height: 250, margin: '20px auto'}} />
//           <p>UPI ID: yukesshwaran6@okicici</p>
//           <button className="btn btn-green" onClick={() => { setShowQR(false); setShowInvoicePreview(true); }}>I have paid</button>
//           <button className="btn btn-red" onClick={() => setShowQR(false)}>Cancel</button>
//         </div>
//       </div>
//     )}

//     {showInvoicePreview && (
//       <div className="modal-overlay">
//         <div className="modal-content" style={{maxWidth: 600}}>
//           <h3>Invoice Preview</h3>
//           <BillPDF
//             billId={`BILL-${Date.now()}`}
//             customerName={customerName}
//             customerPhone={customerPhone}
//             selectedMedicines={cart.map(item => ({
//               medicineName: item.itemName,
//               quantity: item.quantity,
//               sellingPrice: item.sellingPrice,
//               totalPrice: item.sellingPrice * item.quantity * (1 + (item.gstTax || 0) / 100)
//             }))}
//             totalAmount={subtotal}
//             totalGST={gstAmount}
//             totalBill={total}
//           />
//           <p><strong>Payment Method:</strong> {selectedPaymentMethod === 'GPay' ? 'GPay' : 'Cash'}</p>
//           <button className="btn btn-green" onClick={handleGenerateBill}>
//             Generate {selectedPaymentMethod === 'gpay' ? 'Invoice' : 'Bill'}
//           </button>
//           <button className="btn btn-red" onClick={() => setShowInvoicePreview(false)}>Cancel</button>
//         </div>
//       </div>
//     )}
//   </div>
// );
// };

// export default CashierDashboard;























































"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { CheckCircle, X } from "lucide-react"
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer"
import gpayQR from "../assets/gpay.png"
import {
  FaShoppingCart,
  FaHistory,
  FaSearch,
  FaTrash,
  FaUser,
  FaPhone,
  FaArrowLeft,
  FaCheck,
  FaMoneyBillWave,
  FaMobileAlt,
  FaFileInvoice,
} from "react-icons/fa"
import { useLocation, useNavigate } from "react-router-dom"
import "jspdf-autotable"
import { motion, AnimatePresence } from "framer-motion"

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
)

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 10,
  },
  billId: {
    textAlign: "right",
    marginBottom: 10,
  },
  customerInfo: {
    marginBottom: 10,
  },
  table: {
    display: "table",
    width: "auto",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  tableHeader: {
    flex: 1,
    fontWeight: "bold",
    padding: 4,
    backgroundColor: "#eee",
    textAlign: "center",
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
  tableCell: {
    flex: 1,
    padding: 4,
    textAlign: "center",
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
  summary: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingTop: 10,
  },
  summaryText: {
    marginBottom: 4,
  },
  footer: {
    marginTop: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
})

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
  const [isLoading, setIsLoading] = useState(false);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const slideIn = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  const scaleIn = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } }
  };

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
    
    setIsLoading(true);
    axios.get("https://easebilling.onrender.com/api/items", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        setStocks(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setIsAuthenticated(false);
          setLoginError("Session expired or unauthorized. Please log in again.");
          localStorage.removeItem("token");
        } else {
          setLoginError("Error fetching items. Please try again later.");
        }
        setStocks([]);
        setIsLoading(false);
      });
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      alert("Failed to fetch transaction history. Please refresh the page.");
      setIsLoading(false);
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
    const newQuantity = Number.parseInt(prompt("Enter new quantity:"), 10);
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
      setIsLoading(true);
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
        setIsLoading(false);
        alert("Bill generated successfully!");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert(error.response?.data?.error || "Error processing payment. Please try again.");
      setIsLoading(false);
    }
  };

  const handlePaymentMethodSelect = async (method) => {
    console.log("Payment method selected:", method); // Debug log
    setPaymentMethod(method);
    setIsLoading(true);
    
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
        setIsLoading(false);

        console.log("Cash payment completed successfully"); // Debug log
      } catch (err) {
        console.error("Error in cash payment:", err); // Debug log
        alert("Error processing payment. Please try again.");
        setIsLoading(false);
      }
    } else if (method === "gpay") {
      setShowGPayQR(true);
      setIsLoading(false);
    }
  };

  const generateAndDownloadBill = async () => {
    try {
      setIsLoading(true);
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
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error processing payment:", err);
      alert("Error processing payment. Please try again.");
      setIsLoading(false);
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
      setIsLoading(true);
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
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error processing GPay payment:", err);
      alert("Error processing payment. Please try again.");
      setIsLoading(false);
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
      setIsLoading(true);
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
      setIsLoading(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDeleteTransaction = async (billId) => {
    if (window.confirm("Are you sure you want to delete this transaction? This action cannot be undone.")) {
      try {
        setIsLoading(true);
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
        setIsLoading(false);
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
        setIsLoading(false);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg = error.response?.data?.error || "Login failed. Please check your credentials.";
      setLoginError(errorMsg);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const addToCart = async (item) => {
    try {
      setIsLoading(true);
      // Get all items at once
      const token = localStorage.getItem("token");
      const response = await axios.get("https://easebilling.onrender.com/api/items", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const allItems = response.data;
      const currentItem = allItems.find(i => i._id === item._id);
      
      if (!currentItem) {
        alert("This item is no longer available in stock.");
        setIsLoading(false);
        return;
      }
      
      const currentStock = currentItem.stock;
      
      // Prompt for quantity with available stock info
      const quantity = Number.parseInt(prompt(`Enter quantity for ${item.itemName} (Available: ${currentStock} units):`), 10);
      
      if (!quantity || isNaN(quantity) || quantity <= 0) {
        alert("Please enter a valid quantity.");
        setIsLoading(false);
        return;
      }
      
      if (quantity > currentStock) {
        alert(`Insufficient stock! Only ${currentStock} units available.`);
        setIsLoading(false);
        return;
      }

      // Check if item already exists in cart
      const existingItem = cart.find(cartItem => cartItem._id === item._id);
      if (existingItem) {
        const newTotalQuantity = existingItem.quantity + quantity;
        if (newTotalQuantity > currentStock) {
          alert(`Cannot add ${quantity} more units. Total quantity would exceed available stock of ${currentStock} units.`);
          setIsLoading(false);
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
      setIsLoading(false);

    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert("Error adding item to cart. Please try again.");
      setIsLoading(false);
    }
  };

  const updateQuantity = (id, change) => {
    // Implement updating quantity logic here
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item._id !== id));
    
    // Recalculate totals
    const newCart = cart.filter(item => item._id !== id);
    
    const newSubtotal = newCart.reduce((sum, item) => 
      sum + (item.sellingPrice * item.quantity), 0);
    setSubtotal(newSubtotal);

    const newGstAmount = newCart.reduce((sum, item) => 
      sum + (item.sellingPrice * item.quantity * item.gstTax / 100), 0);
    setGstAmount(newGstAmount);

    setTotal(newSubtotal + newGstAmount);
  };

  const fetchStocks = async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching stocks:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.reload();
      } else {
        alert("Failed to fetch stock data. Please refresh the page.");
      }
      setIsLoading(false);
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
      setIsLoading(true);
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
          setIsLoading(false);
          return;
        }
        if (item.stock < cartItem.quantity) {
          alert(`Insufficient stock for ${cartItem.itemName}. Only ${item.stock} units available.`);
          setIsLoading(false);
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
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error generating bill:", error);
      alert(error.response?.data?.error || "Error generating bill. Please try again.");
      setIsLoading(false);
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
      setIsLoading(true);
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
      setIsLoading(false);
      return response.data;
    } catch (error) {
      console.error("Error updating stock:", error);
      setIsLoading(false);
      throw error;
    }
  };

  // Add this function to handle invoice deletion
  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm("Are you sure you want to delete this invoice? This action cannot be undone.")) {
      return;
    }

    try {
      setIsLoading(true);
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
      setIsLoading(false);
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
      setIsLoading(false);
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
      setIsLoading(true);
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
        handler: (response) => {
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
      setIsLoading(false);
    } catch (error) {
      console.error("Error initializing Razorpay:", error);
      alert("Error initializing payment. Please try again.");
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (response) => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    } catch (error) {
      console.error("Error verifying payment:", error);
      alert("Error verifying payment. Please contact support.");
      setIsLoading(false);
    }
  };

  // Validate cart items before billing
  const validateCartItems = async () => {
    try {
      setIsLoading(true);
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
        setIsLoading(false);
        return false;
      }
      setIsLoading(false);
      return true;
    } catch (error) {
      alert("Failed to validate cart items. Please try again.");
      setIsLoading(false);
      return false;
    }
  };

  const filterCartByBackend = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const response = await axios.get("https://easebilling.onrender.com/api/items", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const backendIds = new Set(response.data.map(item => item._id));
    const validCart = cart.filter(item => backendIds.has(item._id));
    if (validCart.length !== cart.length) {
      alert("Some items in your cart are no longer available and have been removed. Please review your cart.");
      setCart(validCart);
      setIsLoading(false);
      return false;
    }
    setIsLoading(false);
    return true;
  };

  // Loading overlay component
  const LoadingOverlay = () => (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
      <p>Processing...</p>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <motion.div 
        className="login-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-card">
          <h2 className="login-title">Cashier Login</h2>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
                className="login-input"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
                className="login-input"
              />
            </div>
            {loginError && <div className="login-error">{loginError}</div>}
            <motion.button 
              type="submit" 
              className="login-button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Login
            </motion.button>
          </form>
        </div>
        {isLoading && <LoadingOverlay />}
      </motion.div>
    );
  }

  return (
    <div className="dashboard-container">
      <motion.div 
        className="sidebar"
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <h2 className="dashboard-title">Cashier Panel</h2>
        <motion.button 
          className={`sidebar-button ${activeTab === "billing" ? "active" : ""}`} 
          onClick={() => setActiveTab("billing")}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaShoppingCart /> Billing
        </motion.button>
        <motion.button 
          className={`sidebar-button ${activeTab === "history" ? "active" : ""}`} 
          onClick={() => setActiveTab("history")}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaHistory /> History
        </motion.button>
        <motion.button 
          className="sidebar-button logout-button" 
          onClick={handleLogout}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaArrowLeft /> Logout
        </motion.button>
      </motion.div>

      <div className="admin-content">
        <AnimatePresence mode="wait">
          {activeTab === "billing" && (
            <motion.div
              key="billing"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeIn}
            >
              {!showBilling ? (
                <motion.div 
                  className="card customer-card"
                  variants={scaleIn}
                >
                  <h3 className="card-title">Customer Information</h3>
                  <form onSubmit={handleCustomerSubmit} className="customer-form">
                    <div className="form-group">
                      <label><FaUser /> Customer Name</label>
                      <input
                        type="text"
                        placeholder="Enter customer name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                        className="form-input"
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
                        className="form-input"
                      />
                    </div>
                    <motion.button 
                      type="submit" 
                      className="btn btn-primary"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Proceed to Billing
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div 
                  className="billing-container"
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                >
                  <motion.div className="card billing-card" variants={scaleIn}>
                    <div className="card-header">
                      <h3 className="card-title">Generate Invoice</h3>
                      <motion.button 
                        className="btn btn-outline"
                        onClick={() => setShowBilling(false)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaArrowLeft /> Back
                      </motion.button>
                    </div>
                    
                    <div className="customer-info">
                      <div className="info-item">
                        <FaUser className="info-icon" />
                        <span>{customerName}</span>
                      </div>
                      <div className="info-item">
                        <FaPhone className="info-icon" />
                        <span>{customerPhone}</span>
                      </div>
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
                      
                      <AnimatePresence>
                        {searchQuery && (
                          <motion.div 
                            className="search-results"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            {stocks
                              .filter(
                                (item) =>
                                  (item.itemName || "").toLowerCase().includes(searchQuery) ||
                                  (item.brand || "").toLowerCase().includes(searchQuery) ||
                                  (item.supplier || "").toLowerCase().includes(searchQuery)
                              )
                              .map((item) => (
                                <motion.div 
                                  key={item._id} 
                                  className="search-result-item"
                                  whileHover={{ backgroundColor: "rgba(124, 58, 237, 0.05)" }}
                                >
                                  <div className  58, 237, 0.05)" }}
                                >\
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
                                      <motion.button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => addToCart(item)}
                                        disabled={item.stock <= 0}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                        Add to Bill
                                      </motion.button>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            {/* Show a message if no results */}
                            {stocks.filter(
                              (item) =>
                                (item.itemName || "").toLowerCase().includes(searchQuery) ||
                                (item.brand || "").toLowerCase().includes(searchQuery) ||
                                (item.supplier || "").toLowerCase().includes(searchQuery)
                            ).length === 0 && (
                              <div className="search-result-item no-results">No products found.</div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="cart-section">
                      <h4 className="section-title">Current Bill Items</h4>
                      
                      {cart.length === 0 ? (
                        <div className="empty-cart">
                          <FaShoppingCart className="empty-cart-icon" />
                          <p>Your cart is empty. Search and add items to create a bill.</p>
                        </div>
                      ) : (
                        <div className="cart-items">
                          {cart.map((item, index) => (
                            <motion.div 
                              key={index} 
                              className="cart-item"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="item-name">{item.itemName}</div>
                              <div className="item-quantity">
                                <span>{item.quantity} × ₹{item.sellingPrice}</span>
                              </div>
                              <div className="item-total">
                                ₹{(item.sellingPrice * item.quantity * (1 + item.gstTax / 100)).toFixed(2)}
                              </div>
                              <motion.button 
                                className="remove-item-btn"
                                onClick={() => removeFromCart(item._id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FaTrash />
                              </motion.button>
                            </motion.div>
                          ))}
                        </div>
                      )}

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
                        <motion.button
                          className="btn btn-danger"
                          onClick={() => {
                            setCart([]);
                            setCustomerName("");
                            setCustomerPhone("");
                            setShowBilling(false);
                          }}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          Cancel Bill
                        </motion.button>
                        <motion.button 
                          className="btn btn-success" 
                          onClick={() => setShowPaymentModal(true)}
                          disabled={cart.length === 0}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          Proceed to Payment
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              key="history"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeIn}
            >
              <motion.div className="card history-card" variants={scaleIn}>
                <h3 className="card-title">Transaction History</h3>
                <div className="search-box">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by Bill ID, Customer Name, or Phone"
                    value={transactionSearch}
                    onChange={(e) => setTransactionSearch(e.target.value.toLowerCase())}
                    className="search-input"
                  />
                </div>

                <div className="table-wrapper">
                  <div className="table-container">
                    <table className="transaction-table">
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
                            <motion.tr 
                              key={transaction._id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
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
                                <motion.button
                                  className="btn btn-danger btn-icon"
                                  onClick={() => handleDeleteInvoice(transaction._id)}
                                  title="Delete Invoice"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <FaTrash />
                                </motion.button>
                              </td>
                            </motion.tr>
                          ))}
                      </tbody>
                    </table>
                    
                    {transactions.filter(
                      (transaction) =>
                        transaction.billId
                          .toLowerCase()
                          .includes(transactionSearch) ||
                        transaction.customerName
                          .toLowerCase()
                          .includes(transactionSearch) ||
                        transaction.customerPhone.includes(transactionSearch)
                    ).length === 0 && (
                      <div className="no-transactions">
                        <p>No transactions found.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showSuccessPage && lastBillData && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="success-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="success-icon">
                <CheckCircle size={60} color="#43e97b" />
              </div>
              <h2 className="success-title">Bill Generated Successfully!</h2>
              <p className="success-message">You can now download the bill as a PDF and hand it to the customer.</p>
              
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
                  return loading ? 'Preparing PDF...' : 'Download Bill as PDF';
                }}
              </PDFDownloadLink>
              
              <motion.button 
                className="done-button"
                onClick={() => {
                  setShowSuccessPage(false);
                  setLastBillData(null);
                  setCustomerName("");
                  setCustomerPhone("");
                  setBillId(`SRT-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaCheck /> Done
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPaymentModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content payment-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h3 className="modal-title">Select Payment Method</h3>
              <div className="payment-options">
                <motion.button 
                  className="payment-option cash"
                  onClick={() => { 
                    setSelectedPaymentMethod("cash"); 
                    setShowInvoicePreview(true); 
                    setShowPaymentModal(false); 
                  }}
                  whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaMoneyBillWave className="payment-icon" />
                  <span>Cash</span>
                </motion.button>
                
                <motion.button 
                  className="payment-option gpay"
                  onClick={() => { 
                    setSelectedPaymentMethod("gpay"); 
                    setShowQR(true); 
                    setShowPaymentModal(false); 
                  }}
                  whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaMobileAlt className="payment-icon" />
                  <span>GPay</span>
                </motion.button>
              </div>
              <motion.button 
                className="btn btn-outline btn-cancel"
                onClick={() => setShowPaymentModal(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={16} /> Cancel
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showQR && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content qr-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h3 className="modal-title">Scan to Pay with GPay</h3>
              <motion.div 
                className="qr-container"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <img src={gpayQR || "/placeholder.svg"} alt="GPay QR Code" className="qr-image" />
              </motion.div>
              <p className="upi-id">UPI ID: yukesshwaran6@okicici</p>
              <div className="qr-actions">
                <motion.button 
                  className="btn btn-success"
                  onClick={() => { 
                    setShowQR(false); 
                    setShowInvoicePreview(true); 
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaCheck /> I have paid
                </motion.button>
                <motion.button 
                  className="btn btn-outline"
                  onClick={() => setShowQR(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={16} /> Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInvoicePreview && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content invoice-preview-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h3 className="modal-title">
                <FaFileInvoice className="title-icon" /> Invoice Preview
              </h3>
              <div className="invoice-preview">
                <div className="invoice-header">
                  <h4>Sai Ram Electrical</h4>
                  <p>10, Sathy Main Road, Gobichettipalayam, Erode-638115</p>
                  <p className="bill-id">Bill ID: {billId}</p>
                </div>
                
                <div className="invoice-customer">
                  <p><strong>Customer:</strong> {customerName}</p>
                  <p><strong>Phone:</strong> {customerPhone}</p>
                </div>
                
                <div className="invoice-items">
                  <table>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item, index) => (
                        <tr key={index}>
                          <td>{item.itemName}</td>
                          <td>{item.quantity}</td>
                          <td>₹{item.sellingPrice}</td>
                          <td>₹{(item.sellingPrice * item.quantity * (1 + (item.gstTax || 0) / 100)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="invoice-summary">
                  <div className="summary-row"><span>Total Amount:</span> <span>₹{subtotal.toFixed(2)}</span></div>
                  <div className="summary-row"><span>Total GST:</span> <span>₹{gstAmount.toFixed(2)}</span></div>
                  <div className="summary-row total"><span>Total Bill:</span> <span>₹{total.toFixed(2)}</span></div>
                  <div className="summary-row"><span>Payment Method:</span> <span>{selectedPaymentMethod === 'gpay' ? 'GPay' : 'Cash'}</span></div>
                </div>
              </div>
              
              <div className="invoice-actions">
                <motion.button 
                  className="btn btn-success"
                  onClick={handleGenerateBill}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaCheck /> Generate {selectedPaymentMethod === 'gpay' ? 'Invoice' : 'Bill'}
                </motion.button>
                <motion.button 
                  className="btn btn-outline"
                  onClick={() => setShowInvoicePreview(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={16} /> Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && <LoadingOverlay />}

      <style jsx>{`
        /* Modern, Professional UI Styles */
        :root {
          --primary: #6366f1;
          --primary-light: #818cf8;
          --primary-dark: #4f46e5;
          --success: #10b981;
          --success-light: #34d399;
          --danger: #ef4444;
          --danger-light: #f87171;
          --warning: #f59e0b;
          --info: #3b82f6;
          --background: #f8fafc;
          --card: #ffffff;
          --text: #1e293b;
          --text-light: #64748b;
          --border: #e2e8f0;
          --border-light: #f1f5f9;
        }

        /* Reset and base styles */
        body, html {
          margin: 0;
          padding: 0;
          font-family: 'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif;
          background: var(--background);
          color: var(--text);
          height: 100%;
          line-height: 1.5;
        }

        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background: var(--background);
          position: relative;
        }

        /* Sidebar */
        .sidebar {
          width: 280px;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 24px 0;
          border-radius: 0 24px 24px 0;
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.15);
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 10;
          overflow-y: auto;
        }

        .dashboard-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0 0 32px 32px;
          letter-spacing: 0.5px;
          color: white;
        }

        .sidebar-button {
          background: none;
          border: none;
          color: white;
          font-size: 1rem;
          padding: 14px 32px;
          width: 100%;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 0 24px 24px 0;
          margin-bottom: 8px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sidebar-button.active {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          font-weight: 600;
        }

        .sidebar-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .logout-button {
          margin-top: auto;
          margin-bottom: 24px;
          color: rgba(255, 255, 255, 0.9);
        }

        /* Content area */
        .admin-content {
          flex: 1;
          padding: 32px;
          background: var(--background);
          min-height: 100vh;
          margin-left: 280px;
          width: calc(100% - 280px);
        }

        /* Cards */
        .card {
          background: var(--card);
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          padding: 24px;
          margin-bottom: 24px;
          width: 100%;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 20px;
          color: var(--primary);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        /* Customer form */
        .customer-form .form-group {
          margin-bottom: 20px;
        }

        .customer-form label {
          font-weight: 500;
          color: var(--primary);
          margin-bottom: 8px;
          display: block;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid var(--border);
          border-radius: 12px;
          font-size: 1rem;
          background: var(--background);
          transition: all 0.2s ease;
          outline: none;
        }

        .form-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          background: white;
        }

        /* Buttons */
        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-right: 12px;
          margin-bottom: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-width: 120px;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }

        .btn-primary:hover {
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3);
        }

        .btn-success {
          background: linear-gradient(135deg, var(--success), var(--success-light));
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
        }

        .btn-success:hover {
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
        }

        .btn-danger {
          background: linear-gradient(135deg, var(--danger), var(--danger-light));
          color: white;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }

        .btn-danger:hover {
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3);
        }

        .btn-outline {
          background: transparent;
          border: 1.5px solid var(--border);
          color: var(--text);
        }

        .btn-outline:hover {
          background: var(--border-light);
        }

        .btn-sm {
          padding: 8px 16px;
          font-size: 0.85rem;
          min-width: auto;
        }

        .btn-icon {
          width: 36px;
          height: 36px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: auto;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Search */
        .search-container {
          margin-bottom: 24px;
        }

        .search-box {
          display: flex;
          align-items: center;
          background: var(--background);
          border-radius: 12px;
          padding: 12px 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 1.5px solid var(--border);
          transition: all 0.2s ease;
        }

        .search-box:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .search-icon {
          color: var(--primary);
          margin-right: 12px;
          font-size: 1.2rem;
        }

        .search-input {
          border: none;
          background: transparent;
          font-size: 1rem;
          width: 100%;
          outline: none;
          color: var(--text);
        }

        .search-results {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          margin-top: 8px;
          max-height: 300px;
          overflow-y: auto;
          border: 1px solid var(--border);
        }

        .search-result-item {
          padding: 16px;
          border-bottom: 1px solid var(--border-light);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .search-result-item:last-child {
          border-bottom: none;
        }

        .item-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .item-info h4 {
          margin: 0 0 4px 0;
          font-size: 1rem;
          color: var(--text);
        }

        .item-brand {
          color: var(--text-light);
          margin: 0 0 4px 0;
          font-size: 0.85rem;
        }

        .item-specs {
          display: flex;
          gap: 12px;
          font-size: 0.85rem;
          color: var(--text-light);
          margin: 4px 0;
        }

        .item-stock {
          font-size: 0.85rem;
          color: var(--primary);
          font-weight: 500;
          margin: 4px 0 0 0;
        }

        .item-price-info {
          text-align: right;
        }

        .item-price {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 4px 0;
        }

        .item-gst {
          font-size: 0.85rem;
          color: var(--text-light);
          margin: 0 0 8px 0;
        }

        .no-results {
          text-align: center;
          padding: 24px;
          color: var(--text-light);
        }

        /* Cart section */
        .cart-section {
          margin-top: 32px;
          background: var(--background);
          border-radius: 16px;
          padding: 24px;
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .section-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--text);
        }

        .empty-cart {
          text-align: center;
          padding: 32px;
          color: var(--text-light);
        }

        .empty-cart-icon {
          font-size: 3rem;
          margin-bottom: 16px;
          color: var(--border);
        }

        .cart-items {
          margin-bottom: 24px;
          max-height: 300px;
          overflow-y: auto;
        }

        .cart-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: white;
          border-radius: 12px;
          margin-bottom: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease;
        }

        .cart-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .item-name {
          flex: 2;
          font-weight: 500;
        }

        .item-quantity {
          flex: 1;
          color: var(--text-light);
        }

        .item-total {
          flex: 1;
          font-weight: 600;
          color: var(--primary);
          text-align: right;
        }

        .remove-item-btn {
          background: none;
          border: none;
          color: var(--danger);
          cursor: pointer;
          padding: 4px;
          margin-left: 12px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .remove-item-btn:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        /* Bill summary */
        .bill-summary {
          background: white;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid var(--border-light);
        }

        .summary-row:last-child {
          border-bottom: none;
        }

        .summary-row.total {
          font-weight: 700;
          color: var(--primary);
          font-size: 1.1rem;
          padding-top: 12px;
        }

        .bill-actions {
          display: flex;
          gap: 16px;
          margin-top: 20px;
        }

        /* Transaction table */
        .table-wrapper {
          margin-top: 24px;
          overflow-x: auto;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .transaction-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          overflow: hidden;
        }

        .transaction-table th, 
        .transaction-table td {
          padding: 16px;
          text-align: left;
        }

        .transaction-table th {
          background: var(--primary-light);
          color: white;
          font-weight: 600;
          position: sticky;
          top: 0;
        }

        .transaction-table tr {
          border-bottom: 1px solid var(--border-light);
          transition: background-color 0.15s ease;
        }

        .transaction-table tr:last-child {
          border-bottom: none;
        }

        .transaction-table tr:hover {
          background: var(--border-light);
        }

        .no-transactions {
          text-align: center;
          padding: 32px;
          color: var(--text-light);
          background: white;
          border-radius: 12px;
        }

        /* Modal styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
          padding: 32px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 24px;
          color: var(--primary);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .title-icon {
          color: var(--primary);
        }

        /* Payment modal */
        .payment-options {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }

        .payment-option {
          flex: 1;
          padding: 24px;
          border-radius: 16px;
          background: var(--background);
          border: 2px solid var(--border);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .payment-option:hover {
          border-color: var(--primary-light);
        }

        .payment-option.cash:hover {
          border-color: var(--success);
        }

        .payment-option.gpay:hover {
          border-color: var(--info);
        }

        .payment-icon {
          font-size: 2rem;
          margin-bottom: 8px;
        }

        .cash .payment-icon {
          color: var(--success);
        }

        .gpay .payment-icon {
          color: var(--info);
        }

        /* QR modal */
        .qr-modal {
          text-align: center;
        }

        .qr-container {
          background: white;
          padding: 16px;
          border-radius: 16px;
          display: inline-block;
          margin: 16px 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .qr-image {
          width: 250px;
          height: 250px;
          object-fit: contain;
        }

        .upi-id {
          font-size: 1rem;
          color: var(--text);
          margin-bottom: 24px;
          font-weight: 500;
        }

        .qr-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
        }

        /* Invoice preview */
        .invoice-preview {
          background: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          border: 1px solid var(--border);
        }

        .invoice-header {
          text-align: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-light);
        }

        .invoice-header h4 {
          font-size: 1.5rem;
          margin: 0 0 8px 0;
          color: var(--primary);
        }

        .invoice-header p {
          margin: 0 0 8px 0;
          color: var(--text-light);
        }

        .bill-id {
          font-weight: 600;
          color: var(--text);
        }

        .invoice-customer {
          margin-bottom: 24px;
        }

        .invoice-customer p {
          margin: 0 0 8px 0;
        }

        .invoice-items {
          margin-bottom: 24px;
          overflow-x: auto;
        }

        .invoice-items table {
          width: 100%;
          border-collapse: collapse;
        }

        .invoice-items th {
          background: var(--border-light);
          padding: 12px;
          text-align: left;
          font-weight: 600;
        }

        .invoice-items td {
          padding: 12px;
          border-bottom: 1px solid var(--border-light);
        }

        .invoice-items tr:last-child td {
          border-bottom: none;
        }

        .invoice-summary {
          padding-top: 16px;
          border-top: 1px solid var(--border-light);
        }

        .invoice-summary .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
        }

        .invoice-summary .total {
          font-weight: 700;
          color: var(--primary);
          font-size: 1.1rem;
          padding-top: 8px;
          margin-top: 8px;
          border-top: 1px solid var(--border-light);
        }

        .invoice-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
        }

        /* Success modal */
        .success-modal {
          background: white;
          border-radius: 24px;
          padding: 40px;
          text-align: center;
          max-width: 500px;
        }

        .success-icon {
          margin-bottom: 24px;
        }

        .success-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 16px;
          color: var(--primary);
        }

        .success-message {
          color: var(--text-light);
          margin-bottom: 32px;
        }

        .download-button {
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 14px 28px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          transition: all 0.2s ease;
          text-decoration: none;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }

        .download-button:hover {
          background: var(--primary-dark);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3);
        }

        .done-button {
          background: var(--success);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 14px 28px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
        }

        .done-button:hover {
          background: var(--success-light);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
        }

        /* Customer info in billing */
        .customer-info {
          display: flex;
          gap: 24px;
          margin-bottom: 24px;
          background: var(--background);
          padding: 16px;
          border-radius: 12px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .info-icon {
          color: var(--primary);
        }

        /* Login styles */
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f0f4ff, #e0e7ff);
          padding: 20px;
        }

        .login-card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 50px rgba(99, 102, 241, 0.1);
          padding: 40px;
          width: 100%;
          max-width: 450px;
        }

        .login-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 32px;
          color: var(--primary);
          text-align: center;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .login-input {
          width: 100%;
          padding: 14px 16px;
          border: 1.5px solid var(--border);
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.2s ease;
          outline: none;
        }

        .login-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .login-error {
          color: var(--danger);
          background: rgba(239, 68, 68, 0.1);
          padding: 12px;
          border-radius: 8px;
          font-size: 0.9rem;
          margin-bottom: 16px;
        }

        .login-button {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }

        .login-button:hover {
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3);
        }

        /* Loading overlay */
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          backdrop-filter: blur(4px);
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(99, 102, 241, 0.1);
          border-radius: 50%;
          border-top-color: var(--primary);
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive design */
        @media (max-width: 1024px) {
          .sidebar {
            width: 240px;
          }
          
          .admin-content {
            margin-left: 240px;
            width: calc(100% - 240px);
            padding: 24px;
          }
        }

        @media (max-width: 768px) {
          .dashboard-container {
            flex-direction: column;
          }
          
          .sidebar {
            width: 100%;
            height: auto;
            position: relative;
            border-radius: 0 0 24px 24px;
            padding: 16px;
          }
          
          .dashboard-title {
            margin: 0 0 16px 0;
            text-align: center;
            font-size: 1.5rem;
          }
          
          .sidebar-button {
            padding: 10px 16px;
            border-radius: 12px;
            margin: 0 8px 8px 0;
            width: auto;
          }
          
          .admin-content {
            margin-left: 0;
            width: 100%;
            padding: 16px;
          }
          
          .logout-button {
            margin-top: 0;
          }
          
          .payment-options {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .card {
            padding: 16px;
          }
          
          .btn {
            width: 100%;
            margin-right: 0;
          }
          
          .bill-actions {
            flex-direction: column;
          }
          
          .customer-info {
            flex-direction: column;
            gap: 8px;
          }
          
          .modal-content {
            padding: 20px;
          }
          
          .invoice-preview {
            padding: 16px;
          }
          
          .invoice-items {
            font-size: 0.85rem;
          }
          
          .invoice-items th,
          .invoice-items td {
            padding: 8px;
          }
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s ease forwards;
        }

        .animate-slideInUp {
          animation: slideInUp 0.3s ease forwards;
        }

        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default CashierDashboard;
