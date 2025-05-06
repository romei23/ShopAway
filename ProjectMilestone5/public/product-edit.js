document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    alert("❌ Missing product ID.");
    window.location.href = "admin-product.html";
    return;
  }

  // Load existing product data
  fetch(`/api/products/${productId}`)
    .then(res => res.json())
    .then(product => {
      document.getElementById("product-id").value = product.id;
      document.getElementById("product-name").value = product.name;
      document.getElementById("product-description").value = product.description;
      document.getElementById("image-path").value = product.image_url;
      document.getElementById("price").value = product.price;
      document.getElementById("category").value = product.category;
    })
    .catch(err => {
      console.error("Error loading product:", err);
      alert("Failed to load product.");
      window.location.href = "admin-product.html";
    });

  // Handle form submission
  document.getElementById("edit-product-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const form = document.getElementById("edit-product-form");
    const formData = new FormData(form);
    const imageInput = document.getElementById("image");

    // If no new file is uploaded, add the existing image_url
    if (imageInput.files.length === 0) {
      const existingImage = document.getElementById("image-path").value;
      formData.append("image_url", existingImage);
    }

    fetch(`/api/products/${productId}`, {
      method: "PUT",
      body: formData
    })
      .then(res => res.json())
      .then(() => {
        alert("✅ Product updated!");
        window.location.href = "admin-product.html";
      })
      .catch(err => {
        console.error("❌ Failed to update product:", err);
        alert("❌ Error updating.");
      });
  });
});
