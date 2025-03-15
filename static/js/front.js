// Open the modal and set the form based on the action (login or signup)
function openModal(action, userType) {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';

    // Set the user type for hidden input
    document.getElementById('user-type').value = userType;
    document.getElementById('user-type-signup').value = userType;

    // Show login form by default
    if (action === 'login') {
        showLoginForm();
    } else {
        showSignupForm();
    }
}

// Show login form
function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('modal-title').innerText = 'Login';
}

// Show signup form
function showSignupForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('modal-title').innerText = 'Sign Up';
}

// Close the modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Toggle between login and signup forms
function toggleForm() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm.style.display === 'none') {
        showLoginForm();
    } else {
        showSignupForm();
    }
}

// Handle form submission
function submitForm(event) {
    event.preventDefault(); // Prevent form from reloading the page

    const form = event.target;
    const formData = new FormData(form);
    const action = form.id === 'auth-form' ? 'login' : 'signup';
    formData.append('action', action);

    // Disable the submit button to prevent multiple submissions
    const submitButton = form.querySelector('button');
    submitButton.disabled = true;
    submitButton.innerText = 'Submitting...';

    fetch('http://127.0.0.1:5000/auth', { // Replace with your backend URL
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            submitButton.disabled = false;  // Enable submit button after response
            submitButton.innerText = action === 'login' ? 'Login' : 'Sign Up'; // Reset button text depending on the action
            if (data.status === 'success') {
                alert('Success: ' + data.message);
                closeModal(); // Close the modal on success
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            submitButton.disabled = false;  // Enable submit button after error
            submitButton.innerText = action === 'login' ? 'Login' : 'Sign Up'; // Reset button text depending on the action
            console.error('Error:', error);
            alert('There was an error. Please try again.');
        });
}

// Event listeners
document.getElementById('close-modal').addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
    if (event.target === document.getElementById('modal')) {
        closeModal();
    }
});

// Toggle password visibility function
function togglePassword(id) {
    var passwordField = document.getElementById(id);
    var toggleIcon = id === 'password' ? document.getElementById('toggle-icon') : document.getElementById('toggle-icon-signup');

    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleIcon.textContent = "🙈"; // Change icon to indicate password is visible
    } else {
        passwordField.type = "password";
        toggleIcon.textContent = "👁️"; // Change icon to indicate password is hidden
    }
}
