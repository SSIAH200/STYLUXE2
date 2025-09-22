document.addEventListener('DOMContentLoaded', () => {
    displayOrderSummary();
    setupFormValidation();
});

function displayOrderSummary() {
    const summaryItems = document.querySelector('.summary-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (!summaryItems) return;

    summaryItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="summary-item-info">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.quantity}</p>
                <p>₦${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        </div>
    `).join('');

    updateTotals();
}

function updateTotals() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 1500 : 0;
    const total = subtotal + shipping;

    document.querySelector('.subtotal').textContent = `₦${subtotal.toFixed(2)}`;
    document.querySelector('.total-amount').textContent = `₦${total.toFixed(2)}`;
}

function setupFormValidation() {
    // Card number formatting
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = value.substring(0, 19);
        });
    }

    // Expiry date formatting
    const expiry = document.getElementById('expiry');
    if (expiry) {
        expiry.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value.substring(0, 5);
        });
    }

    // CVV validation
    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }

    // Form submission
    const placeOrderBtn = document.querySelector('.place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', handlePlaceOrder);
    }
}

function handlePlaceOrder(e) {
    e.preventDefault();
    
    // Basic form validation
    const requiredFields = [
        'firstName', 'lastName', 'email', 'address', 
        'city', 'state', 'zipcode', 'cardName', 
        'cardNumber', 'expiry', 'cvv'
    ];

    const isValid = requiredFields.every(field => {
        const input = document.getElementById(field);
        if (!input || !input.value.trim()) {
            alert(`Please fill in all required fields`);
            return false;
        }
        return true;
    });

    if (!isValid) return;

    // Simulate order processing
    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = 'Processing...';

    setTimeout(() => {
        // Clear cart
        localStorage.setItem('cart', '[]');
        
        // Redirect to success page or show success message
        alert('Order placed successfully!');
        window.location.href = 'Styluxe.html';
    }, 2000);
}