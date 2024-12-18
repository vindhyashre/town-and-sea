document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        // Store current page URL for redirect after login
        localStorage.setItem('redirectAfterLogin', window.location.href);
        // Show login message and hide offer form
        document.getElementById('loginMessage').classList.remove('d-none');
        document.getElementById('offerForm').style.display = 'none';
        return;
    }

    // Get product ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    // Load product details
    const product = JSON.parse(localStorage.getItem('selectedProduct')) || {
        title: 'Sample Product',
        price: 8000,
        image: 'sample.jpg'
    };

    // Display product information
    document.getElementById('productInfo').innerHTML = `
        <div class="text-center mb-4">
            <img src="${product.image}" alt="${product.title}" class="img-fluid mb-3" style="max-height: 300px;">
            <h4>${product.title}</h4>
            <p class="h5">Asking Price: $${product.price.toLocaleString()}</p>
        </div>
    `;

    // Set minimum offer price (50% of asking price)
    const minOfferPrice = product.price * 0.5;

    // Update offer summary
    function updateOfferSummary(offerAmount) {
        const originalPrice = product.price;
        const savings = originalPrice - offerAmount;
        
        document.getElementById('originalPrice').textContent = `$${originalPrice.toLocaleString()}`;
        document.getElementById('summaryOffer').textContent = `$${offerAmount.toLocaleString()}`;
        document.getElementById('savingsAmount').textContent = `$${savings.toLocaleString()}`;
    }

    // Handle quick offer buttons
    document.querySelectorAll('.quick-offers button').forEach(button => {
        button.addEventListener('click', function() {
            const discount = parseFloat(this.dataset.discount);
            const discountedPrice = product.price * (1 - discount/100);
            document.getElementById('offerPrice').value = discountedPrice.toFixed(2);
            updateOfferSummary(discountedPrice);
        });
    });

    // Handle offer price input
    const offerPriceInput = document.getElementById('offerPrice');
    offerPriceInput.addEventListener('input', function() {
        const offerAmount = parseFloat(this.value) || 0;
        updateOfferSummary(offerAmount);

        // Validate minimum offer
        if (offerAmount < minOfferPrice) {
            this.classList.add('is-invalid');
            document.getElementById('offerError').textContent = 
                `Offer price must be at least $${minOfferPrice.toLocaleString()}`;
        } else {
            this.classList.remove('is-invalid');
        }
    });

    // Handle form submission
    document.getElementById('offerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const offerAmount = parseFloat(offerPriceInput.value);
        if (offerAmount < minOfferPrice) {
            alert(`Offer must be at least $${minOfferPrice.toLocaleString()}`);
            return;
        }

        // Create offer object
        const offer = {
            productId: productId,
            productTitle: product.title,
            originalPrice: product.price,
            offerAmount: offerAmount,
            message: document.getElementById('offerMessage').value,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        // Save offer to localStorage (in a real app, this would be sent to a server)
        const offers = JSON.parse(localStorage.getItem('offers')) || [];
        offers.push(offer);
        localStorage.setItem('offers', JSON.stringify(offers));

        // Show success message and redirect
        alert('Your offer has been submitted successfully!');
        window.location.href = 'index.html';
    });

    // Initialize offer summary with asking price
    updateOfferSummary(product.price);
});
