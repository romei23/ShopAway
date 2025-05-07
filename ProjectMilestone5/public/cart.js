document.addEventListener("DOMContentLoaded", function () {
    const cartContainer = document.getElementById("cart-items");
    const checkoutBtn = document.getElementById("checkout-btn");
  
    // Step 1: Get the session user
    fetch("/api/auth/session", { credentials: "include" })
      .then(res => res.json())
      .then(session => {
        if (!session.userId) {
          cartContainer.innerHTML = "<p>Please log in to view your cart.</p>";
          return;
        }
  
        // Step 2: Load cart from backend (no userId in URL)
        fetch("/api/cart", { credentials: "include" })
          .then(res => res.json())
          .then(cartItems => {
            cartContainer.innerHTML = "";
  
            if (cartItems.length === 0) {
              cartContainer.innerHTML = "<p>Your cart is empty.</p>";
              return;
            }
  
            cartItems.forEach(renderCartItem);
            updateTotals();
  
            document.querySelectorAll(".item-quantity").forEach(input => {
              input.addEventListener("input", updateTotals);
            });
  
            document.querySelectorAll(".remove-item").forEach(button => {
              button.addEventListener("click", () => {
                const productId = button.dataset.id;
                fetch(`/api/cart/${productId}`, {
                  method: "DELETE",
                  credentials: "include"
                })
                  .then(() => {
                    button.closest(".cart-item").remove();
                    updateTotals();
                  })
                  .catch(err => console.error("Remove failed:", err));
              });
            });
          })
          .catch(err => {
            console.error("Failed to load cart:", err);
            cartContainer.innerHTML = "<p>Failed to load your cart.</p>";
          });
      });
  
    // Totals calculation
    function updateTotals() {
      let subtotal = 0;
      document.querySelectorAll(".cart-item").forEach(item => {
        const quantity = parseInt(item.querySelector(".item-quantity").value);
        const price = parseFloat(item.querySelector(".item-quantity").dataset.price);
        const total = quantity * price;
  
        item.querySelector(".item-total").textContent = `Total: $${total.toFixed(2)}`;
        subtotal += total;
      });
  
      const tax = subtotal * 0.0675;
      const serviceFee = 5.00;
      const grandTotal = subtotal + tax + serviceFee;
  
      document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
      document.getElementById("tax").textContent = `$${tax.toFixed(2)}`;
      document.getElementById("service-fee").textContent = `$${serviceFee.toFixed(2)}`;
      document.getElementById("total").textContent = `$${grandTotal.toFixed(2)}`;
    }
  
    // Item renderer
    function renderCartItem(item) {
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <img src="${item.image_url || 'images/placeholder.png'}" alt="${item.name}">
        <div class="item-details">
          <h3>${item.name}</h3>
          <p>Price: $${item.price}</p>
          <label>Quantity: 
            <input type="number" value="${item.quantity}" min="1" class="item-quantity" data-price="${item.price}">
          </label>
          <p class="item-total">Total: $${(item.price * item.quantity).toFixed(2)}</p>
          <button class="remove-item" data-id="${item.product_id}">Remove</button>
        </div>
      `;
      cartContainer.appendChild(div);
    }
  
    // Checkout listener
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        fetch("/api/cart/checkout", {
          method: "POST",
          credentials: "include",
        })
          .then(res => {
            if (!res.ok) throw new Error("Checkout failed");
            return res.json();
          })
          .then(data => {
            alert("Order placed successfully!");
            window.location.href = "user-profile.html";
          })
          .catch(err => {
            console.error("Checkout error:", err);
            alert("Checkout failed. Please try again.");
          });
      });
    }
  });
  