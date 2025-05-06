// Show form on button click
document.querySelector(".add-product-btn").addEventListener("click", () => {
  document.querySelector(".add-product-form").style.display = "block";
});

// Submit new product form
document.getElementById("new-product-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  const categoryValue = formData.get("category");
  if (!categoryValue || categoryValue.trim() === "") {
    alert("⚠️ Please select a category before submitting.");
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
      alert("✅ Product added!");

      // ✅ Hide the form
      document.querySelector(".add-product-form").style.display = "none";

      // ✅ Clear the form fields
      document.getElementById("new-product-form").reset();

      // ✅ Reload the table
      loadProducts();
    })
    .catch(err => {
      console.error("❌ Error adding product:", err);
      alert("❌ Failed to add product.");
    });
});


// Load all products into table
function loadProducts() {
  fetch("/api/products")
    .then(res => res.json())
    .then(products => {
      const tbody = document.getElementById("product-table-body");
      tbody.innerHTML = "";

      products.forEach(p => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${p.id}</td>
          <td><img src="${p.image_url}" alt="${p.name}" width="60"></td>
          <td>${p.name}</td>
          <td>${p.category || "—"}</td>
          <td>${p.description}</td> <!-- ✅ Show description -->
          <td>$${p.price}</td>
          <td>
            <button class="edit-btn" data-id="${p.id}">Edit</button>
            <button class="delete-btn" data-id="${p.id}">Delete</button>
          </td>
        `;

        tbody.appendChild(row);
      });

      // Add handlers
      document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.id;
          if (confirm("Delete this product?")) {
            fetch(`/api/products/${id}`, { method: "DELETE" })
              .then(() => {
                alert("Deleted.");
                loadProducts(); // refresh after delete
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

// Initial product load on page load
loadProducts();

// Logout handler
document.getElementById("logout-btn")?.addEventListener("click", () => {
  fetch("/api/auth/logout", { method: "POST" })
    .then(() => window.location.href = "sign-in.html");
});
