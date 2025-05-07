document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    alert("Missing product ID.");
    return;
  }

  // Fetch product data from backend
  fetch(`/api/products/${productId}`)
    .then(res => {
      if (!res.ok) throw new Error("Product not found");
      return res.json();
    })
    .then(product => {
      const container = document.getElementById("product-detail");

      container.innerHTML = `
        <div class="detail-card">
          <img src="${product.image_url}" alt="${product.name}" class="detail-img" />
          <div class="detail-info">
            <h2>${product.name}</h2>
            <p><strong>Category:</strong> ${product.category || "—"}</p>
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <button class="add-to-cart">Add to Cart</button>
          </div>
        </div>
      `;

      // Add to cart functionality
      document.querySelector(".add-to-cart").addEventListener("click", () => {
        fetch("/api/auth/session", { credentials: "include" })
          .then(res => res.json())
          .then(session => {
            if (!session.userId) {
              alert("Please log in to add items to your cart.");
              return;
            }

            const userId = session.userId;
            const quantity = 1;

            fetch("/api/cart/add", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ userId, productId, quantity })
            })
              .then(res => {
                if (!res.ok) throw new Error("Add to cart failed");
                return res.json();
              })
              .then(() => {
                alert("Product added to cart!");
              })
              .catch(err => {
                console.error("Add to cart error:", err);
                alert("Could not add to cart.");
              });
          })
          .catch(err => {
            console.error("Session check error:", err);
            alert("Please log in to use the cart.");
          });
      });
    })
    .catch(err => {
      console.error("Product load error:", err);
      document.getElementById("product-detail").innerHTML = "<p>Product not found.</p>";
    });
});
