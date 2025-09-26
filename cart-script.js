// Cart Management System
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.coupons = {
            'SAVE10': { discount: 10, type: 'percentage', description: 'خصم 10%' },
            'SAVE20': { discount: 20, type: 'fixed', description: 'خصم 20 جنيه' },
            'FIRST50': { discount: 50, type: 'fixed', description: 'خصم 50 جنيه للطلب الأول' },
            'WELCOME': { discount: 15, type: 'percentage', description: 'خصم ترحيبي 15%' }
        };
        this.appliedCoupon = null;
        this.currentEditingItem = null;
        this.currentDeletingItem = null;
        this.shippingFee = 0; // Free shipping
        this.init();
    }

    init() {
        this.renderCart();
        this.updateCartSummary();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Handle enter key in coupon input
        const couponInput = document.getElementById('coupon-code');
        if (couponInput) {
            couponInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applyCoupon();
                }
            });
        }
    }

    renderCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCartState = document.getElementById('empty-cart');
        const cartSummary = document.getElementById('cart-summary');

        if (this.cart.length === 0) {
            emptyCartState.style.display = 'block';
            cartSummary.style.display = 'none';
            cartItemsContainer.innerHTML = '';
            return;
        }

        emptyCartState.style.display = 'none';
        cartSummary.style.display = 'block';

        cartItemsContainer.innerHTML = this.cart.map((item, index) => `
            <div class="cart-item" data-index="${index}">
                <div class="item-content">
                    <div class="item-image">
                        🛒
                    </div>
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-price">${item.price}</div>
                        <div class="item-controls">
                            <div class="quantity-display" onclick="cartManager.openQuantityModal(${index})">
                                <i class="fas fa-edit"></i>
                                <span>الكمية: ${item.quantity}</span>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                        </div>
                    </div>
                    <div class="item-actions">
                        <button class="edit-btn" onclick="cartManager.openQuantityModal(${index})" title="تعديل الكمية">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" onclick="cartManager.openDeleteModal(${index})" title="حذف المنتج">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add animation to new items
        setTimeout(() => {
            const cartItems = document.querySelectorAll('.cart-item');
            cartItems.forEach((item, index) => {
                item.style.animation = `slideInUp 0.5s ease-out ${index * 0.1}s both`;
            });
        }, 100);
    }

    updateCartSummary() {
        const subtotal = this.calculateSubtotal();
        const discountAmount = this.calculateDiscount(subtotal);
        const total = subtotal - discountAmount + this.shippingFee;

        document.getElementById('subtotal').textContent = `${subtotal} جنيه`;
        document.getElementById('shipping').textContent = this.shippingFee === 0 ? 'مجاناً' : `${this.shippingFee} جنيه`;
        document.getElementById('discount').textContent = discountAmount > 0 ? `-${discountAmount} جنيه` : '0 جنيه';
        document.getElementById('total').textContent = `${total} جنيه`;
    }

    calculateSubtotal() {
        return this.cart.reduce((total, item) => {
            const price = parseFloat(item.price.replace(' جنيه', '')) || 0;
            return total + (price * item.quantity);
        }, 0);
    }

    calculateDiscount(subtotal) {
        if (!this.appliedCoupon) return 0;

        const coupon = this.coupons[this.appliedCoupon];
        if (coupon.type === 'percentage') {
            return Math.round(subtotal * (coupon.discount / 100));
        } else {
            return Math.min(coupon.discount, subtotal);
        }
    }

    openQuantityModal(index) {
        this.currentEditingItem = index;
        const item = this.cart[index];
        const modal = document.getElementById('quantity-modal');
        const quantityInput = document.getElementById('quantity-input');
        
        quantityInput.value = item.quantity;
        modal.style.display = 'flex';
        quantityInput.focus();
        quantityInput.select();
    }

    closeQuantityModal() {
        document.getElementById('quantity-modal').style.display = 'none';
        this.currentEditingItem = null;
    }

    increaseQuantity() {
        const input = document.getElementById('quantity-input');
        const currentValue = parseInt(input.value) || 1;
        if (currentValue < 50) {
            input.value = currentValue + 1;
        }
    }

    decreaseQuantity() {
        const input = document.getElementById('quantity-input');
        const currentValue = parseInt(input.value) || 1;
        if (currentValue > 1) {
            input.value = currentValue - 1;
        }
    }

    saveQuantity() {
        const newQuantity = parseInt(document.getElementById('quantity-input').value) || 1;
        
        if (newQuantity < 1 || newQuantity > 50) {
            this.showNotification('الكمية يجب أن تكون بين 1 و 50', 'error');
            return;
        }

        if (this.currentEditingItem !== null) {
            this.cart[this.currentEditingItem].quantity = newQuantity;
            this.saveCartToStorage();
            this.renderCart();
            this.updateCartSummary();
            this.closeQuantityModal();
            this.showNotification('تم تحديث الكمية بنجاح', 'success');
            
            // Update cart count in navigation
            this.updateCartCount();
        }
    }

    openDeleteModal(index) {
        this.currentDeletingItem = index;
        document.getElementById('delete-modal').style.display = 'flex';
    }

    closeDeleteModal() {
        document.getElementById('delete-modal').style.display = 'none';
        this.currentDeletingItem = null;
    }

    confirmDelete() {
        if (this.currentDeletingItem !== null) {
            const item = this.cart[this.currentDeletingItem];
            this.cart.splice(this.currentDeletingItem, 1);
            this.saveCartToStorage();
            this.renderCart();
            this.updateCartSummary();
            this.closeDeleteModal();
            this.showNotification(`تم حذف "${item.name}" من السلة`, 'success');
            
            // Update cart count in navigation
            this.updateCartCount();
        }
    }

    applyCoupon() {
        const couponInput = document.getElementById('coupon-code');
        const couponCode = couponInput.value.trim().toUpperCase();
        
        // Remove any existing coupon messages
        const existingMessages = document.querySelectorAll('.coupon-success, .coupon-error');
        existingMessages.forEach(msg => msg.remove());

        if (!couponCode) {
            this.showCouponMessage('يرجى إدخال كود الخصم', 'error');
            return;
        }

        if (this.appliedCoupon === couponCode) {
            this.showCouponMessage('هذا الكود مُطبق بالفعل', 'error');
            return;
        }

        if (this.coupons[couponCode]) {
            this.appliedCoupon = couponCode;
            const coupon = this.coupons[couponCode];
            couponInput.value = '';
            this.updateCartSummary();
            this.showCouponMessage(`تم تطبيق الكود: ${coupon.description}`, 'success');
            
            // Animate the summary update
            const totalElement = document.getElementById('total');
            totalElement.style.animation = 'bounce 0.6s ease-out';
        } else {
            this.showCouponMessage('كود خصم غير صحيح', 'error');
        }
    }

    showCouponMessage(message, type) {
        const couponSection = document.querySelector('.coupon-section');
        const messageDiv = document.createElement('div');
        messageDiv.className = `coupon-${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        `;
        
        couponSection.appendChild(messageDiv);
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    clearCart() {
        if (this.cart.length === 0) {
            this.showNotification('السلة فارغة بالفعل', 'error');
            return;
        }

        if (confirm('هل أنت متأكد من إفراغ السلة بالكامل؟')) {
            this.cart = [];
            this.appliedCoupon = null;
            this.saveCartToStorage();
            this.renderCart();
            this.updateCartSummary();
            this.updateCartCount();
            this.showNotification('تم إفراغ السلة بنجاح', 'success');
        }
    }

    saveCartToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update floating cart and bottom nav counters
        const cartBadges = document.querySelectorAll('.cart-badge, .cart-count');
        cartBadges.forEach(badge => {
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        });
        
        // Update parent page if available
        if (window.opener && !window.opener.closed) {
            try {
                window.opener.postMessage({
                    type: 'cartUpdate',
                    count: totalItems
                }, '*');
            } catch (e) {
                console.log('Could not update parent cart count');
            }
        }
    }

    goToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('لا يمكن إتمام طلب فارغ', 'error');
            return;
        }

        // Save cart state including applied coupon
        const checkoutData = {
            cart: this.cart,
            appliedCoupon: this.appliedCoupon,
            subtotal: this.calculateSubtotal(),
            discount: this.calculateDiscount(this.calculateSubtotal()),
            shipping: this.shippingFee,
            total: this.calculateSubtotal() - this.calculateDiscount(this.calculateSubtotal()) + this.shippingFee
        };
        
        localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
        window.location.href = 'checkout.html';
    }

    showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'};
            color: white;
            padding: 15px 20px;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: all 0.3s ease;
            font-family: 'Cairo', sans-serif;
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Hide notification
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
}

// Global functions
function goBack() {
    if (document.referrer && document.referrer.includes(window.location.hostname)) {
        window.history.back();
    } else {
        window.location.href = 'index.html';
    }
}

function goToHome() {
    window.location.href = 'index.html';
}

function clearCart() {
    cartManager.clearCart();
}

function applyCoupon() {
    cartManager.applyCoupon();
}

function goToCheckout() {
    cartManager.goToCheckout();
}

function closeQuantityModal() {
    cartManager.closeQuantityModal();
}

function increaseQuantity() {
    cartManager.increaseQuantity();
}

function decreaseQuantity() {
    cartManager.decreaseQuantity();
}

function saveQuantity() {
    cartManager.saveQuantity();
}

function closeDeleteModal() {
    cartManager.closeDeleteModal();
}

function confirmDelete() {
    cartManager.confirmDelete();
}

// Initialize cart manager when page loads
let cartManager;
document.addEventListener('DOMContentLoaded', () => {
    cartManager = new CartManager();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any open modals
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (modal.style.display === 'flex') {
                    modal.style.display = 'none';
                }
            });
        }
    });
    
    // Handle modal background clicks
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Welcome message
    setTimeout(() => {
        if (cartManager.cart.length > 0) {
            cartManager.showNotification(`لديك ${cartManager.cart.length} منتج في السلة`, 'success');
        }
    }, 500);
});

// Handle messages from parent window (for cart count updates)
window.addEventListener('message', (event) => {
    if (event.data.type === 'cartUpdate') {
        // Refresh cart if needed
        cartManager.cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartManager.renderCart();
        cartManager.updateCartSummary();
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    .notification {
        font-family: 'Cairo', sans-serif;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% { transform: scale(1); }
        40%, 43% { transform: scale(1.05); }
        70% { transform: scale(1.02); }
    }
`;
document.head.appendChild(style);