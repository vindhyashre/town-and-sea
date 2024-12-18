document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPage = urlParams.get('redirect');
    
    // Set redirect URL based on parameter
    if (redirectPage) {
        let redirectUrl = 'index.html';
        switch(redirectPage) {
            case 'checkout':
                redirectUrl = 'checkout.html';
                break;
            case 'offer':
                redirectUrl = localStorage.getItem('redirectAfterLogin') || 'index.html';
                break;
        }
        localStorage.setItem('redirectAfterLogin', redirectUrl);
    }

    // Get form elements
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordStrength = document.getElementById('passwordStrength');
    const strengthText = document.getElementById('strengthText');

    // Toggle password visibility
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.querySelector('i').classList.toggle('fa-eye');
            togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    // Password strength checker
    if (passwordInput && passwordStrength) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = checkPasswordStrength(password);
            updatePasswordStrength(strength);
        });
    }

    // Check password strength
    function checkPasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (password.match(/[a-z]+/)) strength += 25;
        if (password.match(/[A-Z]+/)) strength += 25;
        if (password.match(/[0-9]+/)) strength += 25;
        return strength;
    }

    // Update password strength indicator
    function updatePasswordStrength(strength) {
        if (passwordStrength) {
            const progressBar = passwordStrength.querySelector('.progress-bar');
            progressBar.style.width = strength + '%';
            
            if (strength < 50) {
                progressBar.className = 'progress-bar bg-danger';
                strengthText.textContent = 'Weak';
            } else if (strength < 75) {
                progressBar.className = 'progress-bar bg-warning';
                strengthText.textContent = 'Medium';
            } else {
                progressBar.className = 'progress-bar bg-success';
                strengthText.textContent = 'Strong';
            }
        }
    }

    // Handle sign in form submission
    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;

            // Get stored users
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Store authentication state
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify({
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }));

                if (rememberMe) {
                    localStorage.setItem('rememberedUser', email);
                } else {
                    localStorage.removeItem('rememberedUser');
                }

                // Get redirect URL from localStorage or default to home
                const redirectUrl = localStorage.getItem('redirectAfterLogin') || 'index.html';
                localStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectUrl;
            } else {
                alert('Invalid email or password');
            }
        });
    }

    // Handle sign up form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validate password match
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            // Validate password strength
            if (checkPasswordStrength(password) < 75) {
                alert('Please choose a stronger password');
                return;
            }

            // Get existing users and check for duplicates
            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(user => user.email === email)) {
                alert('An account with this email already exists');
                return;
            }

            // Add new user
            users.push({
                firstName,
                lastName,
                email,
                password
            });
            localStorage.setItem('users', JSON.stringify(users));

            // Auto login after signup
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify({
                email,
                firstName,
                lastName
            }));

            // Redirect to home page
            window.location.href = 'index.html';
        });
    }

    // Check if user is remembered
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser && signinForm) {
        document.getElementById('email').value = rememberedUser;
        document.getElementById('rememberMe').checked = true;
    }
});
