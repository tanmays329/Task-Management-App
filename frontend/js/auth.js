const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        try {

            showLoader();

            const response = await fetch("https://task-management-app-jvb6.onrender.com/api/auth/register", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })

            });
            
            hideLoader();
            const data = await response.json();

            if (data.success) {

                showToast("Registration Successful!");

                window.location.href = "login.html";

            } else {

                showToast(data.message);

            }

        } catch (error) {
            hideLoader();

            console.error(error);

            showToast("Something went wrong.");

        }

    });

}

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();

        try {

            const response = await fetch("https://task-management-app-jvb6.onrender.com/api/auth/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })

            });

            const data = await response.json();
            console.log(data);

            if (data.success) {

                // Store JWT
                localStorage.setItem("token", data.token);

                // Store logged-in user
                localStorage.setItem("user", JSON.stringify(data.user));

                showToast("Login Successful!");

                window.location.href = "dashboard.html";

            } else {

                showToast(data.message);

            }

        } catch (error) {

            console.error(error);

            showToast("Something went wrong");

        }

    });

}