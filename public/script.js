const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const uploadForm = document.getElementById("uploadForm");
const message = document.getElementById("message");

// Update filename text
fileInput.addEventListener("change", () => {
  fileName.textContent = fileInput.files.length
    ? fileInput.files[0].name
    : "No file selected";
});

// Handle upload & conversion
uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!fileInput.files.length) {
    message.textContent = "⚠️ Please select a DOCX file.";
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  message.textContent = "⏳ Converting...";

  try {
    const response = await fetch("/api/convert", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Conversion failed.");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.pdf";
    a.click();
    window.URL.revokeObjectURL(url);

    message.textContent = "✅ Conversion successful!";
  } catch (err) {
    console.error(err);
    message.textContent = "❌ Conversion failed.";
  }
});
