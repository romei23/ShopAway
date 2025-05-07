document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/auth/session", { credentials: "include" })
      .then(res => res.json())
      .then(user => {
        if (user.userType === "admin") {
          // Redirect admin users away from customer pages
          window.location.href = "admin-upload.html";
        }
      })
      .catch(err => {
        console.warn("Session check failed:", err);
      });
  });
  