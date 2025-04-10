document.addEventListener("DOMContentLoaded", function () {
    function updateTotals() {
        let subtotal = 0;
        document.querySelectorAll(".cart-item").forEach(item => {
            let quantity = item.querySelector(".item-quantity").value;
            let price = item.querySelector(".item-quantity").dataset.price;
            let total = quantity * price;
            item.querySelector(".item-total").textContent = `Total: $${total.toFixed(2)}`;
            subtotal += total;
        });

        let tax = subtotal * 0.0675;
        let serviceFee = 5.00; // Flat fee
        let total = subtotal + tax + serviceFee;

        document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById("tax").textContent = `$${tax.toFixed(2)}`;
        document.getElementById("service-fee").textContent = `$${serviceFee.toFixed(2)}`;
        document.getElementById("total").textContent = `$${total.toFixed(2)}`;
    }

    document.querySelectorAll(".item-quantity").forEach(input => {
        input.addEventListener("change", updateTotals);
    });

    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", function () {
            this.closest(".cart-item").remove();
            updateTotals();
        });
    });

    updateTotals();
});
