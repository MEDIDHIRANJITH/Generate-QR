// Select DOM elements
const wrapper = document.querySelector(".wrapper");
const qrInput = wrapper.querySelector(".form input");
const generateBtn = wrapper.querySelector(".form button");
const qrImg = wrapper.querySelector(".qr-code img");
let preValue = "";

// Event listener for button click
generateBtn.addEventListener("click", async () => {
  let qrValue = qrInput.value.trim();

  // Check for empty input or duplicate input
  if (!qrValue || preValue === qrValue) return;

  // Store the current value
  preValue = qrValue;

  // Update button text
  generateBtn.innerText = "Generating QR Code...";

  // Set QR code image source using the external QR code generation service
  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrValue}`;

  // Wait for the QR code image to load
  qrImg.addEventListener("load", async () => {
    // Add 'active' class to wrapper for styling
    wrapper.classList.add("active");

    // Reset button text
    generateBtn.innerText = "Generate QR Code";

    // Store the QR code data in MongoDB using the backend API
    await storeQRCodeData(qrValue);
  });
});

// Function to handle keyup events on the input
qrInput.addEventListener("keyup", () => {
  if (!qrInput.value.trim()) {
    // Remove 'active' class from wrapper when input is empty
    wrapper.classList.remove("active");
    preValue = "";
  }
});

// Function to store QR code data in MongoDB using the backend API
async function storeQRCodeData(data) {
  try {
    const response = await fetch("http://localhost:3000/api/qrcodes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });

    // Parse JSON response
    const result = await response.json();

    // Check if the request was successful
    if (response.ok) {
      console.log(result.message);
    } else {
      console.error("Error storing QR code data:", result.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
