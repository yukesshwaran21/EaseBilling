const addMedicine = async (e) => {
  e.preventDefault();
  console.log("=== Starting addMedicine function ===");
  console.log("Form data before submission:", formData);

  // Check if token exists
  const token = localStorage.getItem("token");
  console.log("Token present:", !!token);

  // Validate and format the data
  const itemName = formData.itemName?.toString().trim();
  const stock = formData.stock?.toString().trim();

  console.log("Validated values:", { 
    itemName, 
    stock,
    itemNameType: typeof itemName,
    stockType: typeof stock
  });

  // Validate required fields with specific messages
  if (!itemName) {
    console.log("Validation failed: Item name is empty");
    alert("Please enter an Item Name");
    return;
  }

  if (itemName.trim() === "") {
    console.log("Validation failed: Item name is only whitespace");
    alert("Item Name cannot be empty");
    return;
  }

  if (!stock) {
    console.log("Validation failed: Stock is empty");
    alert("Please enter a Stock Quantity");
    return;
  }

  if (stock.trim() === "") {
    console.log("Validation failed: Stock is only whitespace");
    alert("Stock Quantity cannot be empty");
    return;
  }

  const stockNumber = parseInt(stock);
  console.log("Parsed stock number:", stockNumber);

  if (isNaN(stockNumber)) {
    console.log("Validation failed: Stock is not a number");
    alert("Stock Quantity must be a number");
    return;
  }

  if (stockNumber <= 0) {
    console.log("Validation failed: Stock is not positive");
    alert("Stock Quantity must be greater than 0");
    return;
  }

  try {
    // Create a plain object with validated data
    const dataToSend = {
      itemName,
      brand: formData.brand?.toString().trim() || "",
      amps: formData.amps?.toString().trim() || "",
      watt: formData.watt?.toString().trim() || "",
      inchMm: formData.inchMm?.toString().trim() || "",
      storageLocation: formData.storageLocation?.toString().trim() || "",
      stock: stockNumber,
      expiryDate: formData.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      purchasePrice: parseFloat(formData.purchasePrice) || 0,
      sellingPrice: parseFloat(formData.sellingPrice) || 0,
      gstTax: parseFloat(formData.gstTax) || 0,
      manufacturer: formData.manufacturer?.toString().trim() || "",
      supplier: formData.supplier?.toString().trim() || "",
      contact: formData.contact?.toString().trim() || ""
    };

    console.log("Sending data to server:", dataToSend);
    console.log("Request URL:", "https://easebilling.onrender.com/api/add-item");
    console.log("Request headers:", {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    });

    const response = await axios.post(
      "https://easebilling.onrender.com/api/add-item",
      dataToSend,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Server response:", response.data);
    alert("Item added successfully!");
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
    fetchItems();
  } catch (error) {
    console.error("=== Error Details ===");
    console.error("Error object:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    console.error("Error headers:", error.response?.headers);
    
    // Show more specific error message
    const errorMessage = error.response?.data?.error || "Failed to add item";
    alert(`Error: ${errorMessage}`);
  }
}; 