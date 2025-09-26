// Checkout Management System
class CheckoutManager {
    constructor() {
        this.checkoutData = JSON.parse(localStorage.getItem('checkoutData')) || null;
        this.currentStep = 1;
        this.customerData = {
            name: '',
            phone: '',
            email: '',
            address: '',
            city: '',
            district: '',
            notes: '',
            deliveryType: 'home',
            paymentMethod: 'cash'
        };
        this.init();
    }

    init() {
        if (!this.checkoutData || !this.checkoutData.cart || this.checkoutData.cart.length === 0) {
            this.showNotification('لا توجد منتجات في الطلب', 'error');
            setTimeout(() => {
                window.location.href = 'cart.html';
            }, 2000);
            return;
        }

        this.setupEventListeners();
        this.populateOrderSummary();
        this.loadSavedData();
    }

    setupEventListeners() {
        // Delivery option selection
        const deliveryOptions = document.querySelectorAll('.delivery-option');
        deliveryOptions.forEach(option => {
            option.addEventListener('click', () => {
                deliveryOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                this.customerData.deliveryType = option.dataset.type;
                this.toggleAddressSection();
            });
        });

        // Payment method selection
        const paymentMethods = document.querySelectorAll('.payment-method');
        paymentMethods.forEach(method => {
            method.addEventListener('click', () => {
                paymentMethods.forEach(m => m.classList.remove('active'));
                method.classList.add('active');
                this.customerData.paymentMethod = method.dataset.method;
            });
        });

        // Form inputs
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.saveFormData());
            input.addEventListener('blur', () => this.validateField(input));
        });

        // Phone number formatting
        const phoneInput = document.getElementById('customer-phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', this.formatPhoneNumber.bind(this));
        }
    }

    formatPhoneNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Egyptian phone number format
        if (value.startsWith('20')) {
            value = '+' + value;
        } else if (value.startsWith('01')) {
            value = '+20' + value;
        } else if (value.length === 10 && value.startsWith('1')) {
            value = '+20' + value;
        }
        
        e.target.value = value;
    }

    toggleAddressSection() {
        const addressSection = document.getElementById('address-section');
        if (this.customerData.deliveryType === 'pickup') {
            addressSection.classList.add('hidden');
            this.clearAddressFields();
        } else {
            addressSection.classList.remove('hidden');
        }
    }

    clearAddressFields() {
        document.getElementById('customer-address').value = '';
        document.getElementById('customer-city').value = '';
        document.getElementById('customer-district').value = '';
        document.getElementById('delivery-notes').value = '';
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        switch (field.id) {
            case 'customer-name':
                isValid = value.length >= 2;
                message = 'الاسم يجب أن يكون على الأقل حرفين';
                break;
            case 'customer-phone':
                const phoneRegex = /^\+?[0-9]{10,15}$/;
                isValid = phoneRegex.test(value.replace(/\s/g, ''));
                message = 'رقم هاتف غير صحيح';
                break;
            case 'customer-email':
                if (value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    isValid = emailRegex.test(value);
                    message = 'بريد إلكتروني غير صحيح';
                }
                break;
            case 'customer-address':
                if (this.customerData.deliveryType === 'home') {
                    isValid = value.length >= 10;
                    message = 'العنوان يجب أن يكون مفصلاً';
                }
                break;
            case 'customer-city':
                if (this.customerData.deliveryType === 'home') {
                    isValid = value.length >= 2;
                    message = 'المدينة مطلوبة';
                }
                break;
        }

        this.showFieldValidation(field, isValid, message);
        return isValid;
    }

    showFieldValidation(field, isValid, message) {
        // Remove existing validation messages
        const existingMessage = field.parentNode.querySelector('.validation-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        if (!isValid && message) {
            field.style.borderColor = '#dc2626';
            
            const validationDiv = document.createElement('div');
            validationDiv.className = 'validation-message';
            validationDiv.textContent = message;
            validationDiv.style.cssText = `
                color: #dc2626;
                font-size: 14px;
                margin-top: 5px;
                animation: fadeIn 0.3s ease;
            `;
            
            field.parentNode.appendChild(validationDiv);
        } else {
            field.style.borderColor = isValid ? '#16a34a' : '#e5e7eb';
        }
    }

    saveFormData() {
        this.customerData.name = document.getElementById('customer-name').value;
        this.customerData.phone = document.getElementById('customer-phone').value;
        this.customerData.email = document.getElementById('customer-email').value;
        this.customerData.address = document.getElementById('customer-address').value;
        this.customerData.city = document.getElementById('customer-city').value;
        this.customerData.district = document.getElementById('customer-district').value;
        this.customerData.notes = document.getElementById('delivery-notes').value;
        
        localStorage.setItem('customerData', JSON.stringify(this.customerData));
    }

    loadSavedData() {
        const savedData = JSON.parse(localStorage.getItem('customerData'));
        if (savedData) {
            this.customerData = { ...this.customerData, ...savedData };
            
            // Populate form fields
            document.getElementById('customer-name').value = this.customerData.name || '';
            document.getElementById('customer-phone').value = this.customerData.phone || '';
            document.getElementById('customer-email').value = this.customerData.email || '';
            document.getElementById('customer-address').value = this.customerData.address || '';
            document.getElementById('customer-city').value = this.customerData.city || '';
            document.getElementById('customer-district').value = this.customerData.district || '';
            document.getElementById('delivery-notes').value = this.customerData.notes || '';
            
            // Set delivery type
            const deliveryOption = document.querySelector(`[data-type="${this.customerData.deliveryType}"]`);
            if (deliveryOption) {
                document.querySelectorAll('.delivery-option').forEach(opt => opt.classList.remove('active'));
                deliveryOption.classList.add('active');
            }
            
            // Set payment method
            const paymentMethod = document.querySelector(`[data-method="${this.customerData.paymentMethod}"]`);
            if (paymentMethod) {
                document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
                paymentMethod.classList.add('active');
            }
            
            this.toggleAddressSection();
        }
    }

    populateOrderSummary() {
        const orderItemsContainer = document.getElementById('order-items');
        const { cart, subtotal, discount, shipping, total } = this.checkoutData;
        
        // Populate order items
        orderItemsContainer.innerHTML = cart.map(item => `
            <div class="order-item">
                <div class="item-info">
                    <h5>${item.name}</h5>
                    <div class="item-quantity">الكمية: ${item.quantity}</div>
                </div>
                <div class="item-price">${parseFloat(item.price.replace(' جنيه', '')) * item.quantity} جنيه</div>
            </div>
        `).join('');
        
        // Populate totals
        document.getElementById('order-subtotal').textContent = `${subtotal} جنيه`;
        document.getElementById('order-shipping').textContent = shipping === 0 ? 'مجاناً' : `${shipping} جنيه`;
        document.getElementById('order-total').textContent = `${total} جنيه`;
        
        if (discount > 0) {
            document.getElementById('order-discount').textContent = `-${discount} جنيه`;
            document.getElementById('discount-row').style.display = 'flex';
        }
    }

    goToStep(stepNumber) {
        if (stepNumber > this.currentStep) {
            // Validate current step before proceeding
            if (!this.validateCurrentStep()) {
                return;
            }
        }
        
        // Hide current step
        document.getElementById(`step-${this.currentStep}`).classList.remove('active');
        
        // Show new step
        document.getElementById(`step-${stepNumber}`).classList.add('active');
        
        // Update step indicators
        this.updateStepIndicators(stepNumber);
        
        // Update current step
        this.currentStep = stepNumber;
        
        // Special actions for step 3
        if (stepNumber === 3) {
            this.populateCustomerReview();
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.validateStep1();
            case 2:
                return this.validateStep2();
            default:
                return true;
        }
    }

    validateStep1() {
        const nameValid = this.validateField(document.getElementById('customer-name'));
        const phoneValid = this.validateField(document.getElementById('customer-phone'));
        const emailValid = this.validateField(document.getElementById('customer-email'));
        
        if (!nameValid || !phoneValid || !emailValid) {
            this.showNotification('يرجى تصحيح البيانات المطلوبة', 'error');
            return false;
        }
        
        this.saveFormData();
        return true;
    }

    validateStep2() {
        if (this.customerData.deliveryType === 'home') {
            const addressValid = this.validateField(document.getElementById('customer-address'));
            const cityValid = this.validateField(document.getElementById('customer-city'));
            
            if (!addressValid || !cityValid) {
                this.showNotification('يرجى إدخال بيانات العنوان كاملة', 'error');
                return false;
            }
        }
        
        this.saveFormData();
        return true;
    }

    updateStepIndicators(currentStep) {
        const steps = document.querySelectorAll('.step');
        const stepLines = document.querySelectorAll('.step-line');
        
        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber < currentStep) {
                step.classList.add('completed');
                step.innerHTML = '<i class="fas fa-check"></i>';
            } else if (stepNumber === currentStep) {
                step.classList.add('active');
                step.innerHTML = `<span>${stepNumber}</span>`;
            } else {
                step.innerHTML = `<span>${stepNumber}</span>`;
            }
        });
        
        stepLines.forEach((line, index) => {
            if (index < currentStep - 1) {
                line.classList.add('completed');
            } else {
                line.classList.remove('completed');
            }
        });
    }

    populateCustomerReview() {
        const reviewContainer = document.getElementById('customer-info-review');
        const deliveryText = this.customerData.deliveryType === 'home' ? 'توصيل منزلي' : 'استلام من المتجر';
        const paymentText = {
            'cash': 'دفع عند الاستلام',
            'card': 'بطاقة ائتمانية',
            'wallet': 'محفظة إلكترونية'
        }[this.customerData.paymentMethod];
        
        let addressInfo = '';
        if (this.customerData.deliveryType === 'home') {
            addressInfo = `
                <strong>العنوان:</strong> ${this.customerData.address}<br>
                <strong>المدينة:</strong> ${this.customerData.city}
                ${this.customerData.district ? `<br><strong>الحي:</strong> ${this.customerData.district}` : ''}
                ${this.customerData.notes ? `<br><strong>ملاحظات:</strong> ${this.customerData.notes}` : ''}
            `;
        }
        
        reviewContainer.innerHTML = `
            <strong>الاسم:</strong> ${this.customerData.name}<br>
            <strong>الهاتف:</strong> ${this.customerData.phone}<br>
            ${this.customerData.email ? `<strong>البريد:</strong> ${this.customerData.email}<br>` : ''}
            <strong>طريقة التسليم:</strong> ${deliveryText}<br>
            ${addressInfo}
            <strong>طريقة الدفع:</strong> ${paymentText}
        `;
    }

    confirmOrder() {
        if (!this.validateCurrentStep()) {
            return;
        }
        
        // Show loading modal
        this.showLoadingModal();
        
        // Simulate order processing
        setTimeout(() => {
            this.processOrder();
        }, 2000);
    }

    showLoadingModal() {
        document.getElementById('loading-modal').style.display = 'flex';
    }

    processOrder() {
        // Generate order number
        const orderNumber = 'ORD' + Date.now().toString().slice(-6);
        
        // Create order object
        const order = {
            orderNumber,
            customer: this.customerData,
            items: this.checkoutData.cart,
            totals: {
                subtotal: this.checkoutData.subtotal,
                discount: this.checkoutData.discount,
                shipping: this.checkoutData.shipping,
                total: this.checkoutData.total
            },
            appliedCoupon: this.checkoutData.appliedCoupon,
            orderDate: new Date().toISOString(),
            status: 'pending'
        };
        
        // Save order to localStorage (in real app, this would be sent to server)
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Clear cart and checkout data
        localStorage.removeItem('cart');
        localStorage.removeItem('checkoutData');
        localStorage.removeItem('customerData');
        
        // Hide loading modal and show success
        document.getElementById('loading-modal').style.display = 'none';
        this.showSuccessModal(orderNumber);
    }

    showSuccessModal(orderNumber) {
        document.getElementById('order-number-display').textContent = '#' + orderNumber;
        document.getElementById('success-modal').style.display = 'flex';
        
        // Send message to update cart count on other pages
        try {
            if (window.opener && !window.opener.closed) {
                window.opener.postMessage({
                    type: 'cartUpdate',
                    count: 0
                }, '*');
            }
        } catch (e) {
            console.log('Could not update parent cart count');
        }
    }

    goToHome() {
        window.location.href = 'index.html';
    }

    trackOrder() {
        // Redirect to order tracking page (would be implemented)
        this.showNotification('ميزة تتبع الطلبات قريباً!', 'success');
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
function goBackToCart() {
    window.location.href = 'cart.html';
}

function goToStep(stepNumber) {
    checkoutManager.goToStep(stepNumber);
}

function confirmOrder() {
    checkoutManager.confirmOrder();
}

function goToHome() {
    checkoutManager.goToHome();
}

function trackOrder() {
    checkoutManager.trackOrder();
}

// Initialize checkout manager
let checkoutManager;
document.addEventListener('DOMContentLoaded', () => {
    checkoutManager = new CheckoutManager();
    
    // Handle modal background clicks
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal && modal.id !== 'loading-modal') {
                modal.style.display = 'none';
            }
        });
    });
    
    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            // Ctrl+Enter to proceed to next step or confirm order
            const nextBtn = document.querySelector('.next-btn:not([style*="display: none"]), .confirm-order-btn');
            if (nextBtn) {
                nextBtn.click();
            }
        }
    });
});

// Add custom styles
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
    
    .validation-message {
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);