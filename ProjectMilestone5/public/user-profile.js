document.addEventListener("DOMContentLoaded", () => {
    console.log("📄 profile.js loaded");

    fetch('/api/auth/session', { credentials: 'include' })
        .then(res => res.json())
        .then(session => {
            if (!session.userId) {
                document.body.innerHTML = '<p>Please log in to view your profile.</p>';
                return;
            }

            document.getElementById('user-name').textContent = session.name || 'N/A';
            document.getElementById('user-email').textContent = session.email || 'N/A';

            return fetch('/api/orders/my-orders', { credentials: 'include' });
        })
        .then(res => res.json())
        .then(orders => {
            const container = document.getElementById('orders');
            if (!orders.length) {
                container.innerHTML = '<p>No orders yet.</p>';
                return;
            }

            orders.forEach(order => {
                const div = document.createElement('div');
                div.className = 'order';
                div.innerHTML = `
            <h3>Order #${order.id}</h3>
            <p>Total: $${order.total}</p>
            <p>Date: ${new Date(order.created_at).toLocaleString()}</p>
            <ul>
              ${order.items.map(item => `
                <li>
                  <img src="${item.image_url}" alt="${item.product_name}" width="50" />
                  ${item.product_name} - ${item.quantity} x $${item.price}
                </li>
              `).join('')}
            </ul>
          `;
                container.appendChild(div);
            });
        })
        .catch(err => {
            console.error('❌ Error:', err);
        });
});
