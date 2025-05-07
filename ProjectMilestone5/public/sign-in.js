document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const email = form.email.value;
      const password = form.password.value;
  
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password })
        });
  
        const data = await res.json();
  
        if (!res.ok) throw new Error(data.error || "Login failed");
  
        if (data.userType === "admin") {
          window.location.href = "admin-upload.html";
        } else {
          window.location.href = "index.html";
        }
      } catch (err) {
        console.error("❌ Login error:", err.message);
        document.getElementById("login-status").textContent = err.message;
      }
    });
  });
  