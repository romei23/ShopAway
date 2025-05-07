document.addEventListener("DOMContentLoaded", () => {
  // LOGIN FORM HANDLER
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (!email || !password) {
        alert("Please enter both email and password.");
        return;
      }

      fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            alert(`Login failed: ${data.error}`);
            return;
          }

          // Redirect based on user type
          if (data.userType === "admin") {
            window.location.href = "admin-upload.html";
          } else {
            window.location.href = "index.html";
          }
        })
        .catch((err) => {
          console.error("Login error:", err);
          alert("Login failed. Please try again.");
        });
    });
  }

  // SIGN-UP FORM HANDLER
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (!name || !email || !password) {
        alert("Please fill in all fields.");
        return;
      }

      fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            alert(`Signup failed: ${data.error}`);
            return;
          }

          alert("Account created! You can now sign in.");
          window.location.href = "sign-in.html";
        })
        .catch((err) => {
          console.error("Signup error:", err);
          alert("Signup failed. Please try again.");
        });
    });
  }

  // LOGOUT HANDLER
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      fetch("/api/auth/logout")
        .then(() => {
          window.location.href = "index.html";
        })
        .catch((err) => {
          console.error("Logout error:", err);
          alert("Logout failed.");
        });
    });
  }

  // SESSION CHECK TO TOGGLE NAV
  fetch("/api/auth/session")
    .then(res => res.json())
    .then(data => {
      if (data.userId) {
        const signInLink = document.getElementById("sign-in-link");
        const logoutBtn = document.getElementById("logout-btn");

        if (signInLink) signInLink.style.display = "none";
        if (logoutBtn) {
          logoutBtn.style.display = "inline-block";

          // (Optional) Redundant but safe in case logoutBtn didn't exist above
          logoutBtn.addEventListener("click", () => {
            fetch("/api/auth/logout")
              .then(() => {
                window.location.href = "sign-in.html";
              })
              .catch(err => {
                console.error("Logout failed:", err);
                alert("Logout failed.");
              });
          });
        }
      }
    })
    .catch(err => {
      console.error("Session check failed:", err);
    });
}); 
