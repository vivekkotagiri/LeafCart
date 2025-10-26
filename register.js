function registerUser(event) {
    event.preventDefault(); // Prevent page refresh

    // Get input values
    const email = document.querySelector('input[type="email"]').value.trim();
    const password = document.querySelector('input[type="password"]').value.trim();

    // Email validation: must end with .com or .in
    const emailPattern = /^[^\s@]+@[^\s@]+\.(com|in)$/i;

    // Basic validation
    if (email === "" || password === "") {
        alert("⚠️ Please fill in both fields!");
        return;
    }

    if (!emailPattern.test(email)) {
        alert("❌ Please enter a valid email ending with .com or .in!");
        return;
    }

    // Check if email is already registered
    const existingEmail = localStorage.getItem("registeredEmail");
    if (existingEmail && existingEmail === email) {
        alert("⚠️ This email is already registered! Please login.");
        window.location.href = "index.html";
        return;
    }

    // Save the user data in localStorage
    localStorage.setItem("registeredEmail", email);
    localStorage.setItem("registeredPassword", password);

    alert("✅ Registration successful! Please login now.");
    window.location.href = "index.html"; // redirect to login page
}

function loginUser(event) {
    event.preventDefault(); // Prevent page refresh
    window.location.href = "index.html";
}
















//  function registerUser() {
//       let email = document.getElementById("email").value;
//       let password = document.getElementById("password").value;

//       if (email == "" || password == "") {
//         alert("Please fill all fields");
//         return;
//       }

//       // Save to localStorage
//       localStorage.setItem("email", email);
//       localStorage.setItem("password", password);

//       alert("Registration successful!");
//       window.location.href = "leafcartlogin.html";
//     }