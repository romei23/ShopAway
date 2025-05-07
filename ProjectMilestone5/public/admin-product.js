document.addEventListener("DOMContentLoaded", () => {
  // Show form on button click
  const addBtn = document.querySelector(".add-product-btn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      document.querySelector(".add-product-form").style.display = "block";
    });
  }

  // Submit new product form
  const form = document.getElementById("new-product-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(form);
      const categoryValue = formData.get("category");

      if (!categoryValue || categoryValue.trim() === "") {
        alert("Please select a category before submitting.");
        return;
      }

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      fetch("/api/products", {
        method: "POST",
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          alert("Product added!");
          document.querySelector(".add-product-form").style.display = "none";
          form.reset();
          loadProducts();
        })
        .catch(err => {
          console.error("Error adding product:", err);
          alert("Failed to add product.");
        });
    });
  }

  // Logout handler
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      fetch("/api/auth/logout", { method: "POST" })
        .then(() => window.location.href = "sign-in.html");
    });
  }

  // Load all products
  loadProducts();
});

// Load all products into the table
function loadProducts() {
  fetch("/api/products")
    .then(res => res.json())
    .then(products => {
      const tbody = document.getElementById("product-table-body");
      if (!tbody) return;

      tbody.innerHTML = "";

      products.forEach(p => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${p.id}</td>
          <td><img src="${p.image_url}" alt="${p.name}" width="60"></td>
          <td>${p.name}</td>
          <td>${p.category || "—"}</td>
          <td>${p.description}</td>
          <td>$${p.price}</td>
          <td>
            <button class="edit-btn" data-id="${p.id}">Edit</button>
            <button class="delete-btn" data-id="${p.id}">Delete</button>
          </td>
        `;
        tbody.appendChild(row);
      });

      document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.id;
          if (confirm("Delete this product?")) {
            fetch(`/api/products/${id}`, { method: "DELETE" })
              .then(() => {
                alert("Deleted.");
                loadProducts();
              });
          }
        });
      });

      document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.id;
          window.location.href = `product-edit.html?id=${id}`;
        });
      });
    });
}
