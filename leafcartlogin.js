function loginUser(event) {
    event.preventDefault(); // Prevent page refresh

    // Get input values
    const email = document.querySelector('input[type="email"]').value.trim();
    const password = document.querySelector('input[type="password"]').value.trim();

    if (email === "" || password === "") {
        alert("⚠️ Please fill in both fields!");
        return;
    }

    // Get stored registered credentials from localStorage
    const registeredEmail = localStorage.getItem("registeredEmail");
    const registeredPassword = localStorage.getItem("registeredPassword");

    // Check credentials
    if (email === registeredEmail && password === registeredPassword) {
        alert("✅ Login successful!");
        // Redirect to home/dashboard (replace with your page)
        window.location.href = "leafcart.html";
    } else {
        alert("❌ Invalid email or password!");
    }
}

// Redirect to registration page
function goToRegister() {
    window.location.href = "register.html";
}
















//  function loginUser() {
//       let email = document.getElementById("email").value;
//       let password = document.getElementById("password").value;

//       let storedEmail = localStorage.getItem("email");
//       let storedPassword = localStorage.getItem("password");

//       if (email == storedEmail && password == storedPassword) {
//         alert("Login successful!");
//         window.location.href = "leafcart.html";
//       } else {
//         alert("Invalid credentials...!");
//       }
//     }