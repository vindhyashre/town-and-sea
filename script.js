document.addEventListener('DOMContentLoaded', function() {
    // Shopping Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();

    // Update cart count in navbar
    function updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            cartCount.textContent = cart.length;
            cartCount.style.display = cart.length > 0 ? 'block' : 'none';
        }
    }

    // Add to cart function
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert('Product added to cart!');
    }

    // Add to Cart functionality
    const addToCartButtons = document.querySelectorAll('.btn-primary');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const productCard = e.target.closest('.product-card');
            const product = {
                id: Date.now(), // Unique ID for the cart item
                title: productCard.querySelector('.card-title').textContent,
                price: productCard.querySelector('.card-text').textContent,
                image: productCard.querySelector('img').src
            };
            
            addToCart(product);
            
            // Show success message
            showToast('Product added to cart successfully!');
        });
    });

    // Toast notification function
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Make Offer functionality
    const makeOfferButtons = document.querySelectorAll('.btn-make-offer');
    makeOfferButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const product = {
                id: productCard.dataset.productId,
                title: productCard.querySelector('.card-title').textContent,
                price: parseFloat(productCard.querySelector('.card-text').textContent.replace('$', '').replace(',', '')),
                image: productCard.querySelector('img').src
            };
            
            // Store selected product in localStorage
            localStorage.setItem('selectedProduct', JSON.stringify(product));
            
            // Redirect to make offer page
            window.location.href = `make-offer.html?id=${product.id}`;
        });
    });

    // Handle Make Offer button clicks
    const makeOfferModalButtons = document.querySelectorAll('.make-offer-btn');
    const offerModal = new bootstrap.Modal(document.getElementById('offerModal'));
    let currentProduct = null;

    makeOfferModalButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const productCard = e.target.closest('.product-card');
            currentProduct = {
                title: productCard.querySelector('.card-title').textContent,
                price: productCard.querySelector('.card-text').textContent
            };
            
            // Update modal title with product name
            document.querySelector('.modal-title').textContent = `Make an Offer - ${currentProduct.title}`;
            
            // Clear previous form values
            document.getElementById('offerPrice').value = '';
            document.getElementById('offerMessage').value = '';
            
            offerModal.show();
        });
    });

    // Handle offer form submission
    const offerForm = document.getElementById('offerForm');
    offerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const offerData = {
            product: currentProduct.title,
            originalPrice: currentProduct.price,
            offerPrice: document.getElementById('offerPrice').value,
            message: document.getElementById('offerMessage').value,
            timestamp: new Date().toISOString()
        };

        // For demonstration, log the offer data
        console.log('Offer submitted:', offerData);
        
        // Show success message
        showToast('Your offer has been submitted successfully! We will notify you once the seller responds.');
        
        offerModal.hide();
    });

    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation on scroll for products
    const productCards = document.querySelectorAll('.product-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // Update authentication links based on login state
    function updateAuthLinks() {
        const authLinks = document.getElementById('authLinks');
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (isLoggedIn && currentUser) {
            authLinks.innerHTML = `
                <div class="dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                        ${currentUser.firstName}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item" href="#">My Profile</a></li>
                        <li><a class="dropdown-item" href="#">My Orders</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" onclick="signOut()">Sign Out</a></li>
                    </ul>
                </div>
            `;
        } else {
            authLinks.innerHTML = `<a class="nav-link" href="signin.html">Sign In</a>`;
        }
    }

    // Sign out function
    function signOut() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.reload();
    }

    // Update auth links when page loads
    updateAuthLinks();
});
