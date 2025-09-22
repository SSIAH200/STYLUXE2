// Product data
const products = [
    {
        id: 1,
        name: "Classic White Shirt",
        price: 5000,
        category: "shirts",
        image: "images/cloth 1.jpeg",
        sale: true,
        salePrice: 4000
    },
    {
        id: 2,
        name: "Slim Fit Jeans",
        price: 7500,
        category: "pants",
        image: "images/cloth 2.jpeg"
    },
    {
        id: 3,
        name: "Summer Shorts",
        price: 3900,
        category: "shorts",
        image: "images/cloth 3.jpeg",
        sale: true,
        salePrice: 3000
    },
    {
        id: 4,
        name: "Floral Dress",
        price: 8500,
        category: "dresses",
        image: "images/cloth 4.jpeg"
    }
];

// State management
let filteredProducts = [...products];
let activeFilters = {
    categories: new Set(),
    priceRange: {
        min: 0,
        max: Infinity
    },
    searchTerm: ''
};

// Initialize the shop
function initShop() {
    updateProductDisplay();
    setupSearch();
    setupEventListeners();
    updateCartCount();
}

// Setup event listeners
function setupEventListeners() {
    // Category filters
    document.querySelectorAll('.category-filters input').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                activeFilters.categories.add(e.target.value);
            } else {
                activeFilters.categories.delete(e.target.value);
            }
            applyFilters();
        });
    });

    // Price range
    const priceRange = document.getElementById('price-range');
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');

    [minPrice, maxPrice].forEach(input => {
        input.addEventListener('change', () => {
            activeFilters.priceRange.min = Number(minPrice.value) || 0;
            activeFilters.priceRange.max = Number(maxPrice.value) || Infinity;
            applyFilters();
        });
    });

    // Sort
    document.getElementById('sort-by').addEventListener('change', (e) => {
        sortProducts(e.target.value);
    });
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('search');
    const searchBar = searchInput.closest('.search-bar');
    const clearButton = document.getElementById('clear-search');

    searchInput.addEventListener('input', (e) => {
        const hasText = e.target.value.length > 0;
        searchBar.classList.toggle('has-text', hasText);
        activeFilters.searchTerm = e.target.value.toLowerCase();
        applyFilters();
    });

    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        searchBar.classList.remove('has-text');
        activeFilters.searchTerm = '';
        applyFilters();
    });
}

// Apply all filters
function applyFilters() {
    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(activeFilters.searchTerm);
        const matchesCategory = activeFilters.categories.size === 0 || 
                              activeFilters.categories.has(product.category);
        const price = product.sale ? product.salePrice : product.price;
        const matchesPrice = price >= activeFilters.priceRange.min && 
                           price <= activeFilters.priceRange.max;

        return matchesSearch && matchesCategory && matchesPrice;
    });

    updateProductDisplay();
}

// Sort products
function sortProducts(method) {
    switch(method) {
        case 'price-low':
            filteredProducts.sort((a, b) => getPrice(a) - getPrice(b));
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => getPrice(b) - getPrice(a));
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            filteredProducts = [...products];
    }
    updateProductDisplay();
}

function getPrice(product) {
    return product.sale ? product.salePrice : product.price;
}

// Update product display
function updateProductDisplay() {
    const productGrid = document.querySelector('.product-grid');
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div class="no-products">
                <p>No products found matching your criteria</p>
            </div>`;
        return;
    }

    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            ${product.sale ? '<span class="sale-badge">SALE!</span>' : ''}
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="price">
                    ${product.sale ? 
                        `<span class="original-price">₦${product.price.toFixed(2)}</span>
                         <span class="sale-price">₦${product.salePrice.toFixed(2)}</span>` :
                        `<span>₦${product.price.toFixed(2)}</span>`
                    }
                </div>
                <button class="add-to-cart" onclick="addToCart({
                    name: '${product.name}',
                    price: ${product.sale ? product.salePrice : product.price},
                    image: '${product.image}'
                })">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initShop);