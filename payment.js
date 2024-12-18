document.addEventListener('DOMContentLoaded', function() {
    const stripe = Stripe('your_publishable_key'); // Replace with your Stripe publishable key
    const elements = stripe.elements();

    // Create card element
    const card = elements.create('card', {
        style: {
            base: {
                fontSize: '16px',
                color: '#32325d',
                fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        }
    });

    // Mount the card element
    card.mount('#card-element');

    // Handle real-time validation errors
    card.addEventListener('change', function(event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });

    // Handle form submission
    const form = document.getElementById('payment-form');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const submitButton = document.getElementById('submit-payment');
        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';

        try {
            // Get cart total from localStorage
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Create payment intent
            const response = await fetch('/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: total * 100, // Convert to cents
                    currency: 'usd'
                })
            });

            const data = await response.json();

            // Confirm card payment
            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
                        email: document.getElementById('email').value,
                        address: {
                            line1: document.getElementById('address').value,
                            city: document.getElementById('city').value,
                            state: document.getElementById('state').value,
                            postal_code: document.getElementById('zip').value
                        }
                    }
                }
            });

            if (result.error) {
                // Handle payment error
                const errorElement = document.getElementById('card-errors');
                errorElement.textContent = result.error.message;
                submitButton.disabled = false;
                submitButton.textContent = 'Pay Now';
            } else {
                // Payment successful
                if (result.paymentIntent.status === 'succeeded') {
                    // Clear cart
                    localStorage.removeItem('cart');
                    
                    // Save order details
                    const order = {
                        id: result.paymentIntent.id,
                        amount: total,
                        items: cart,
                        date: new Date().toISOString(),
                        shipping: {
                            name: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
                            email: document.getElementById('email').value,
                            address: document.getElementById('address').value,
                            city: document.getElementById('city').value,
                            state: document.getElementById('state').value,
                            zip: document.getElementById('zip').value
                        }
                    };

                    // Store order in localStorage
                    const orders = JSON.parse(localStorage.getItem('orders')) || [];
                    orders.push(order);
                    localStorage.setItem('orders', JSON.stringify(orders));

                    // Redirect to success page
                    window.location.href = 'order-success.html';
                }
            }
        } catch (error) {
            const errorElement = document.getElementById('card-errors');
            errorElement.textContent = 'An error occurred while processing your payment. Please try again.';
            submitButton.disabled = false;
            submitButton.textContent = 'Pay Now';
        }
    });
});
