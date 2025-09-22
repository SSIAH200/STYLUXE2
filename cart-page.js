let cart = JSON.parse(localStorage.getItem('cart')) || [];

function displayCart() {
    const cartItems = document.querySelector('.cart-items');
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <a href="Styluxe.html" class="continue-shopping">Start Shopping</a>
            </div>
        `;
        updateSummary();
        return;
    }

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-info">
                <h3>${item.name}</h3>
                <p>₦${item.price.toFixed(2)}</p>
            </div>
            <div class="item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeItem(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    updateSummary();
}

function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 1500 : 0;
    const total = subtotal + shipping;

    document.querySelector('.subtotal').textContent = `₦${subtotal.toFixed(2)}`;
    document.querySelector('.total-amount').textContent = `₦${total.toFixed(2)}`;
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

document.addEventListener('DOMContentLoaded', () => {
    displayCart();
    
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            // Add checkout logic here
            alert('Proceeding to checkout...');
        });
    }
});