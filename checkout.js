document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        // Store current page URL for redirect after login
        localStorage.setItem('redirectAfterLogin', window.location.href);
        // Redirect to sign in page
        window.location.href = 'signin.html?redirect=checkout';
        return;
    }

    const orderItems = document.getElementById('orderItems');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');
    const checkoutForm = document.getElementById('checkoutForm');

    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Pre-fill user information if available
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('firstName').value = currentUser.firstName || '';
        document.getElementById('lastName').value = currentUser.lastName || '';
        document.getElementById('email').value = currentUser.email || '';
    }

    // Display order summary
    function displayOrderSummary() {
        orderItems.innerHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            const price = parseFloat(item.price.replace('$', '').replace(',', ''));
            subtotal += price;

            const itemElement = document.createElement('div');
            itemElement.className = 'mb-2';
            itemElement.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-0">${item.title}</h6>
                        <small class="text-muted">Quantity: 1</small>
                    </div>
                    <span>${item.price}</span>
                </div>
            `;
            orderItems.appendChild(itemElement);
        });

        // Calculate shipping (flat rate for demo)
        const shipping = cart.length > 0 ? 10 : 0;
        const total = subtotal + shipping;

        // Update totals
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        shippingElement.textContent = `$${shipping.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }

    // Format credit card number
    document.getElementById('cardNumber').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 16) value = value.slice(0, 16);
        const parts = value.match(/.{1,4}/g) || [];
        e.target.value = parts.join(' ');
    });

    // Format expiry date
    document.getElementById('expiryDate').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) value = value.slice(0, 4);
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        e.target.value = value;
    });

    // Format CVV
    document.getElementById('cvv').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 3) value = value.slice(0, 3);
        e.target.value = value;
    });

    // Handle form submission
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zipCode: document.getElementById('zipCode').value,
            cardNumber: document.getElementById('cardNumber').value,
            expiryDate: document.getElementById('expiryDate').value,
            cvv: document.getElementById('cvv').value
        };

        // Simple validation
        for (let field in formData) {
            if (!formData[field]) {
                alert('Please fill in all fields');
                return;
            }
        }

        // Process order (in a real application, this would be sent to a server)
        const order = {
            items: cart,
            customer: formData,
            total: parseFloat(totalElement.textContent.replace('$', '')),
            orderDate: new Date().toISOString()
        };

        // Clear cart
        localStorage.removeItem('cart');
        
        // Show success message and redirect
        alert('Order placed successfully! Thank you for your purchase.');
        window.location.href = 'index.html';
    });

    // Initialize order summary
    displayOrderSummary();
});
