document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("search");
  const category = params.get("category");

  let apiUrl = "/api/products";
  if (query) {
    apiUrl = `/api/products/search?q=${encodeURIComponent(query)}`;
  } else if (category) {
    apiUrl = `/api/products/category/${encodeURIComponent(category)}`;
  }

  fetch(apiUrl)
    .then(res => res.json())
    .then(products => {
      const container = document.getElementById("product-list");
      if (!container) {
        console.error("❌ Missing #product-list element.");
        return;
      }

      container.innerHTML = "";

      if (!products.length) {
        container.innerHTML = "<p>No products found.</p>";
        return;
      }

      products.forEach(p => {
        const card = document.createElement("div");
        card.className = "product";
        card.innerHTML = `
          <img src="${p.image_url}" alt="${p.name}" class="product-img" />
          <h3>${p.name}</h3>
          <p class="price"><strong>Price:</strong> $${p.price}</p>
          <a href="product-detail.html?id=${p.id}" class="details-button">View Details</a>
        `;
        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("❌ Failed to load products:", err);
      const container = document.getElementById("product-list");
      if (container) {
        container.innerHTML = "<p>Error loading products.</p>";
      }
    });
});
