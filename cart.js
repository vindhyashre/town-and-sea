document.addEventListener('DOMContentLoaded', function() {
    const cartItems = document.getElementById('cartItems');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartCount = document.getElementById('cartCount');

    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart display
    function updateCartDisplay() {
        if (cart.length === 0) {
            cartItems.style.display = 'none';
            emptyCartMessage.style.display = 'block';
            return;
        }

        cartItems.style.display = 'block';
        emptyCartMessage.style.display = 'none';
        
        // Clear current cart items
        cartItems.innerHTML = '';
        
        // Calculate total
        let total = 0;
        
        // Add each item to the cart
        cart.forEach((item, index) => {
            const price = parseFloat(item.price.replace('$', '').replace(',', ''));
            total += price;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item mb-3';
            cartItem.innerHTML = `
                <div class="card">
                    <div class="row g-0">
                        <div class="col-md-3">
                            <img src="${item.image}" class="img-fluid rounded-start" alt="${item.title}">
                        </div>
                        <div class="col-md-9">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <h5 class="card-title">${item.title}</h5>
                                    <button class="btn btn-link text-danger remove-item" data-index="${index}">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                                <p class="card-text">${item.price}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
            
            // Add remove item event listener
            const removeBtn = cartItem.querySelector('.remove-item');
            removeBtn.addEventListener('click', () => removeFromCart(index));
        });
        
        // Update totals
        updateTotals(total);
    }
    
    // Remove item from cart
    function removeFromCart(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
    }
    
    // Update cart count in navbar
    function updateCartCount() {
        if (cartCount) {
            cartCount.textContent = cart.length;
            cartCount.style.display = cart.length > 0 ? 'block' : 'none';
        }
    }
    
    // Update totals
    function updateTotals(total) {
        subtotalElement.textContent = `$${total.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
        
        // Disable/enable checkout button based on cart contents
        checkoutBtn.disabled = total === 0;
    }
    
    // Checkout button click handler
    checkoutBtn.addEventListener('click', function() {
        if (cart.length > 0) {
            window.location.href = 'checkout.html';
        } else {
            alert('Your cart is empty!');
        }
    });
    
    // Initialize the cart display
    updateCartDisplay();
    updateCartCount();
});
