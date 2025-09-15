// DOM Elements
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const productsGrid = document.getElementById('productsGrid');
const filterCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');

// Product data for filtering and sorting
let products = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeProducts();
    setupEventListeners();
    animateProductCards();
});

// Initialize products array from DOM
function initializeProducts() {
    const productCards = document.querySelectorAll('.product-card');
    products = Array.from(productCards).map(card => {
        return {
            element: card,
            name: card.querySelector('.product-name').textContent.toLowerCase(),
            price: parseFloat(card.dataset.price),
            category: card.dataset.category,
            amperage: parseInt(card.dataset.amperage),
            line: card.dataset.line,
            rating: card.querySelectorAll('.stars .fas').length
        };
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Sort functionality
    sortSelect.addEventListener('change', handleSort);
    
    // Filter functionality
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleFilter);
    });
    
    // Smooth scroll for anchor links
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
}

// Search functionality
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    products.forEach(product => {
        const isVisible = product.name.includes(searchTerm) || 
                         product.category.includes(searchTerm) ||
                         product.line.includes(searchTerm);
        
        if (isVisible) {
            product.element.style.display = 'block';
            product.element.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
            product.element.style.display = 'none';
        }
    });
    
    updateNoResultsMessage();
}

// Sort functionality
function handleSort(event) {
    const sortValue = event.target.value;
    let sortedProducts = [...products];
    
    switch (sortValue) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'relevance':
        default:
            // Keep original order
            break;
    }
    
    // Reorder DOM elements
    sortedProducts.forEach((product, index) => {
        product.element.style.order = index;
    });
    
    // Add animation delay for visual effect
    sortedProducts.forEach((product, index) => {
        setTimeout(() => {
            product.element.style.animation = 'fadeInUp 0.4s ease forwards';
        }, index * 50);
    });
}

// Filter functionality
function handleFilter() {
    const activeFilters = {
        amperage: [],
        category: [],
        line: []
    };
    
    // Collect active filters
    filterCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const value = checkbox.value;
            
            if (['45', '60', '70', '100'].includes(value)) {
                activeFilters.amperage.push(parseInt(value));
            } else if (['carro', 'suv', 'caminhao', 'moto'].includes(value)) {
                activeFilters.category.push(value);
            } else if (['efb', 'agm', 'clean'].includes(value)) {
                activeFilters.line.push(value);
            }
        }
    });
    
    // Apply filters
    products.forEach(product => {
        let isVisible = true;
        
        // Check amperage filter
        if (activeFilters.amperage.length > 0) {
            isVisible = isVisible && activeFilters.amperage.includes(product.amperage);
        }
        
        // Check category filter
        if (activeFilters.category.length > 0) {
            isVisible = isVisible && activeFilters.category.some(cat => 
                product.category.includes(cat)
            );
        }
        
        // Check line filter
        if (activeFilters.line.length > 0) {
            isVisible = isVisible && activeFilters.line.includes(product.line);
        }
        
        // Show/hide product
        if (isVisible) {
            product.element.style.display = 'block';
            product.element.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
            product.element.style.display = 'none';
        }
    });
    
    updateNoResultsMessage();
}

// Update no results message
function updateNoResultsMessage() {
    const visibleProducts = products.filter(product => 
        product.element.style.display !== 'none'
    );
    
    // Remove existing no results message
    const existingMessage = document.querySelector('.no-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Add no results message if needed
    if (visibleProducts.length === 0) {
        const noResultsMessage = document.createElement('div');
        noResultsMessage.className = 'no-results-message';
        noResultsMessage.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #6b7280;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; color: #d1d5db;"></i>
                <h3 style="margin-bottom: 0.5rem; color: #374151;">Nenhum produto encontrado</h3>
                <p>Tente ajustar os filtros ou termo de busca.</p>
            </div>
        `;
        productsGrid.appendChild(noResultsMessage);
    }
}

// Animate product cards on load
function animateProductCards() {
    const cards = document.querySelectorAll('.product-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Product redirect functionality
function redirectToProduct(productId) {
    // Simulate loading state
    const button = event.target;
    const originalText = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
    button.disabled = true;
    
    // Simulate redirect delay
    setTimeout(() => {
        // In a real application, this would redirect to the product page
        const productUrl = `https://seudominio.com/produto/${productId}`;
        
        // For demo purposes, show an alert
        alert(`Redirecionando para: ${productUrl}\n\nEm uma aplicação real, você seria redirecionado para a página do produto.`);
        
        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
    }, 1500);
}

// Utility function: Debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add to cart functionality (simulation)
function addToCart(productId, productName, price) {
    // Simulate adding to cart
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #059669;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        ">
            <i class="fas fa-check-circle"></i>
            <strong>${productName}</strong> adicionado ao carrinho!
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .product-card:hover .btn-cta {
        transform: translateY(-2px);
    }
    
    .filter-group label:hover {
        background-color: #f3f4f6;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        margin: 0.125rem 0;
    }
    
    .search-bar input:focus {
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .sort-options select:hover {
        border-color: #3b82f6;
    }
`;
document.head.appendChild(style);

// Keyboard navigation support
document.addEventListener('keydown', function(event) {
    // ESC key to clear search
    if (event.key === 'Escape') {
        searchInput.value = '';
        handleSearch({ target: searchInput });
        searchInput.blur();
    }
    
    // Enter key on search
    if (event.key === 'Enter' && event.target === searchInput) {
        event.preventDefault();
        handleSearch(event);
    }
});

// Performance optimization: Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('.product-image img');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                
                img.onload = () => {
                    img.style.opacity = '1';
                };
                
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
setupLazyLoading();

// Add smooth hover effects for better UX
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Console welcome message
console.log(`
🔋 Baterias Moura - E-commerce
Desenvolvido com HTML, CSS e JavaScript
Energia que move o Brasil!

Funcionalidades implementadas:
✅ Busca em tempo real
✅ Filtros por categoria, amperagem e linha
✅ Ordenação por preço e avaliação
✅ Design responsivo
✅ Animações suaves
✅ Acessibilidade
✅ Performance otimizada
`);

