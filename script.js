// التطبيق الرئيسي
class SuperMarketApp {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCartCount();
        this.updateFavorites();
        this.startAnimations();
        this.setupIntersectionObserver();
    }

    setupEventListeners() {
        // البحث
        this.setupSearch();
        
        // إضافة للسلة
        this.setupAddToCart();
        
        // المفضلة
        this.setupFavorites();
        
        // التنقل السفلي
        this.setupBottomNav();
        
        // الأزرار التفاعلية
        this.setupInteractiveButtons();
        
        // لمسات الجوال
        this.setupTouchFeedback();
    }

    setupSearch() {
        const searchInput = document.querySelector('.search-box input');
        const voiceSearchBtn = document.querySelector('.voice-search');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
            
            searchInput.addEventListener('focus', () => {
                document.querySelector('.search-box').classList.add('focused');
            });
            
            searchInput.addEventListener('blur', () => {
                document.querySelector('.search-box').classList.remove('focused');
            });
        }
        
        if (voiceSearchBtn) {
            voiceSearchBtn.addEventListener('click', () => {
                this.startVoiceSearch();
            });
        }
    }

    handleSearch(query) {
        if (query.length > 2) {
            // محاكاة البحث مع تأخير
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        }
    }

    performSearch(query) {
        console.log(`البحث عن: ${query}`);
        // هنا يمكن إضافة منطق البحث الفعلي
        this.showSearchResults(query);
    }

    showSearchResults(query) {
        // إنشاء نتائج البحث مؤقتة
        const searchResults = [
            { name: 'زيت طعام', price: 45, category: 'السوبر ماركت' },
            { name: 'منظف أطباق', price: 25, category: 'المنظفات' },
            { name: 'تفاح أحمر', price: 30, category: 'الفواكه' }
        ].filter(item => item.name.includes(query) || item.category.includes(query));
        
        // عرض النتائج (يمكن تطوير هذا أكثر)
        if (searchResults.length > 0) {
            this.displaySearchModal(searchResults);
        }
    }

    startVoiceSearch() {
        const voiceBtn = document.querySelector('.voice-search');
        voiceBtn.innerHTML = '<i class="fas fa-microphone-alt"></i>';
        voiceBtn.style.background = 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)';
        
        // محاكاة البحث الصوتي
        setTimeout(() => {
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceBtn.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
            
            // محاكاة نتيجة البحث الصوتي
            const searchInput = document.querySelector('.search-box input');
            searchInput.value = 'زيت طعام';
            this.handleSearch('زيت طعام');
        }, 2000);
    }

    setupAddToCart() {
        const addToCartBtns = document.querySelectorAll('.add-to-cart');
        
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addToCart(btn);
            });
        });
    }

    addToCart(btn) {
        // تأثير بصري
        btn.innerHTML = '<i class="loading"></i> جاري الإضافة...';
        btn.disabled = true;
        
        // محاكاة إضافة المنتج
        setTimeout(() => {
            const product = this.getProductFromButton(btn);
            this.cart.push(product);
            localStorage.setItem('cart', JSON.stringify(this.cart));
            
            // تحديث العداد
            this.updateCartCount();
            
            // رسالة نجاح
            btn.innerHTML = '<i class="fas fa-check"></i> تم الإضافة';
            btn.style.background = 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)';
            
            // إظهار تأثير الطيران للسلة
            this.flyToCart(btn);
            
            // إعادة تعيين الزر
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-plus"></i> أضف للسلة';
                btn.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                btn.disabled = false;
            }, 2000);
        }, 1000);
    }

    getProductFromButton(btn) {
        const productCard = btn.closest('.product-card');
        const name = productCard.querySelector('h5').textContent;
        const price = productCard.querySelector('.current-price').textContent;
        
        return {
            id: Date.now(),
            name,
            price,
            quantity: 1
        };
    }

    flyToCart(btn) {
        const cart = document.querySelector('.floating-cart');
        const btnRect = btn.getBoundingClientRect();
        const cartRect = cart.getBoundingClientRect();
        
        // إنشاء عنصر طائر
        const flyingElement = document.createElement('div');
        flyingElement.innerHTML = '<i class="fas fa-shopping-cart"></i>';
        flyingElement.style.cssText = `
            position: fixed;
            top: ${btnRect.top}px;
            left: ${btnRect.left}px;
            color: #dc2626;
            font-size: 20px;
            z-index: 10000;
            pointer-events: none;
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        
        document.body.appendChild(flyingElement);
        
        // تحريك للسلة
        requestAnimationFrame(() => {
            flyingElement.style.top = cartRect.top + 'px';
            flyingElement.style.left = cartRect.left + 'px';
            flyingElement.style.transform = 'scale(0.5)';
            flyingElement.style.opacity = '0';
        });
        
        // إزالة العنصر
        setTimeout(() => {
            document.body.removeChild(flyingElement);
            // تأثير نبضة على السلة
            cart.style.animation = 'none';
            cart.offsetHeight; // إعادة تدفق
            cart.style.animation = 'cartPulse 0.6s ease-out';
        }, 800);
    }

    updateCartCount() {
        const cartBadges = document.querySelectorAll('.cart-badge, .cart-count');
        const count = this.cart.length;
        
        cartBadges.forEach(badge => {
            badge.textContent = count;
            if (count > 0) {
                badge.style.display = 'flex';
                badge.style.animation = 'bounce 0.5s ease-out';
            } else {
                badge.style.display = 'none';
            }
        });
    }

    setupFavorites() {
        const favoritesBtns = document.querySelectorAll('.favorite-btn');
        
        favoritesBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleFavorite(btn);
            });
        });
    }

    toggleFavorite(btn) {
        const productCard = btn.closest('.product-card');
        const productName = productCard.querySelector('h5').textContent;
        const icon = btn.querySelector('i');
        
        if (this.favorites.includes(productName)) {
            // إزالة من المفضلة
            this.favorites = this.favorites.filter(item => item !== productName);
            icon.classList.remove('fas');
            icon.classList.add('far');
            btn.style.animation = 'heartBreak 0.6s ease-out';
        } else {
            // إضافة للمفضلة
            this.favorites.push(productName);
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.style.animation = 'heartBeat 0.6s ease-out';
        }
        
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }

    updateFavorites() {
        const favoritesBtns = document.querySelectorAll('.favorite-btn');
        
        favoritesBtns.forEach(btn => {
            const productCard = btn.closest('.product-card');
            const productName = productCard.querySelector('h5').textContent;
            const icon = btn.querySelector('i');
            
            if (this.favorites.includes(productName)) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            }
        });
    }

    setupBottomNav() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                // Handle cart navigation
                if (item.classList.contains('cart-nav')) {
                    this.goToCart();
                    return;
                }
                
                // إزالة الفئة النشطة من جميع العناصر
                navItems.forEach(nav => nav.classList.remove('active'));
                // إضافة للعنصر المضغوط
                item.classList.add('active');
                
                // تأثير نبضة
                item.style.animation = 'navPulse 0.3s ease-out';
            });
        });
        
        // Setup floating cart button
        const floatingCart = document.querySelector('.floating-cart');
        if (floatingCart) {
            floatingCart.addEventListener('click', () => {
                this.goToCart();
            });
        }
    }

    setupInteractiveButtons() {
        const interactiveButtons = document.querySelectorAll('.cta-btn, .see-all, .whatsapp-btn, .contact-number');
        
        interactiveButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // تأثير موجة
                this.createRippleEffect(e);
                
                // إجراءات خاصة لكل زر
                if (btn.classList.contains('whatsapp-btn')) {
                    this.openWhatsApp();
                } else if (btn.classList.contains('contact-number')) {
                    this.makeCall(btn.href);
                }
            });
        });
    }

    createRippleEffect(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    openWhatsApp() {
        const phoneNumber = '01001470449';
        const message = 'مرحباً، أريد الاستفسار عن المنتجات المتوفرة في سوق الجملة';
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    makeCall(phoneUrl) {
        window.location.href = phoneUrl;
    }

    setupTouchFeedback() {
        const touchElements = document.querySelectorAll('.category-card, .offer-card, .product-card');
        
        touchElements.forEach(element => {
            element.classList.add('touch-feedback');
            
            element.addEventListener('touchstart', (e) => {
                element.style.transform = 'scale(0.98)';
            });
            
            element.addEventListener('touchend', (e) => {
                element.style.transform = 'scale(1)';
            });
        });
    }

    startAnimations() {
        // تأثير ظهور تدريجي للعناصر
        this.animateOnScroll();
        
        // تحديث الوقت في العرض المؤقت
        this.updateOfferTimer();
        
        // تأثيرات عشوائية
        this.startRandomAnimations();
    }

    animateOnScroll() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInUp 0.8s ease-out';
                    entry.target.style.opacity = '1';
                }
            });
        }, observerOptions);
        
        // مراقبة العناصر
        const elementsToAnimate = document.querySelectorAll('.category-card, .offer-card, .product-card, .contact-card');
        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }

    updateOfferTimer() {
        const timerElement = document.querySelector('.timer span');
        if (!timerElement) return;
        
        let hours = 2;
        let minutes = 30;
        let seconds = 0;
        
        setInterval(() => {
            if (seconds > 0) {
                seconds--;
            } else if (minutes > 0) {
                minutes--;
                seconds = 59;
            } else if (hours > 0) {
                hours--;
                minutes = 59;
                seconds = 59;
            } else {
                // إعادة تعيين المؤقت
                hours = 2;
                minutes = 30;
                seconds = 0;
            }
            
            const timeString = `ينتهي خلال: ${hours} ساعة ${minutes} دقيقة`;
            timerElement.textContent = timeString;
        }, 1000);
    }

    startRandomAnimations() {
        // تأثيرات عشوائية على الشعار
        setInterval(() => {
            const logo = document.querySelector('.logo');
            if (logo) {
                logo.style.animation = 'none';
                logo.offsetHeight; // إعادة تدفق
                logo.style.animation = 'logoFloat 3s ease-in-out infinite';
            }
        }, 5000);
        
        // تأثير عشوائي على أيقونة العروض
        setInterval(() => {
            const floatingIcon = document.querySelector('.floating-icon');
            if (floatingIcon) {
                floatingIcon.style.animation = 'none';
                floatingIcon.offsetHeight;
                floatingIcon.style.animation = 'floatingIcon 3s ease-in-out infinite';
            }
        }, 4000);
    }

    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        // مراقبة الأقسام
        const sections = document.querySelectorAll('.hero-section, .categories-section, .offers-section, .popular-products, .contact-section');
        sections.forEach(section => observer.observe(section));
    }

    // دالة لعرض رسائل تنبيه جميلة
    showNotification(message, type = 'success') {
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
        `;
        
        document.body.appendChild(notification);
        
        // إظهار الإشعار
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // إخفاء الإشعار
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Navigation to cart page
    goToCart() {
        if (this.cart.length === 0) {
            this.showNotification('سلة التسوق فارغة! أضف بعض المنتجات أولاً', 'error');
            return;
        }
        window.location.href = 'cart.html';
    }
    
    // دالة لإضافة تأثيرات CSS إضافية
    addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            @keyframes heartBeat {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.3); }
            }
            
            @keyframes heartBreak {
                0% { transform: scale(1); }
                50% { transform: scale(1.2) rotate(5deg); }
                100% { transform: scale(1); }
            }
            
            @keyframes navPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            @keyframes cartPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            
            @keyframes bounce {
                0%, 20%, 53%, 80%, 100% { transform: scale(1); }
                40%, 43% { transform: scale(1.2); }
                70% { transform: scale(1.1); }
            }
            
            .search-box.focused {
                box-shadow: 0 12px 40px rgba(220, 38, 38, 0.2) !important;
                transform: translateY(-2px) !important;
            }
            
            .visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            .notification {
                font-family: 'Cairo', sans-serif;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .loading {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: #fff;
                animation: spin 1s linear infinite;
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Navigation function to account page
function goToAccount() {
    window.location.href = 'account.html';
}

// تشغيل التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const app = new SuperMarketApp();
    app.addCustomStyles();
    
    // Listen for cart updates from other windows
    window.addEventListener('message', (event) => {
        if (event.data.type === 'cartUpdate') {
            app.cart = JSON.parse(localStorage.getItem('cart')) || [];
            app.updateCartCount();
        }
    });
    
    // رسالة ترحيب
    setTimeout(() => {
        app.showNotification('مرحباً بكم في سوق الجملة! 🛒', 'success');
    }, 1000);
});

// تفاعل مع تمرير الصفحة
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const header = document.querySelector('.header');
    
    if (scrollTop > lastScrollTop) {
        // التمرير لأسفل
        header.style.transform = 'translateY(-100%)';
    } else {
        // التمرير لأعلى
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// تفاعل مع تغيير حجم الشاشة
window.addEventListener('resize', () => {
    // إعادة حساب التخطيط إذا لزم الأمر
    const container = document.querySelector('.container');
    if (container) {
        container.style.maxWidth = Math.min(414, window.innerWidth) + 'px';
    }
});

// منع النقر الطويل على المنتجات
document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.product-card, .category-card, .offer-card')) {
        e.preventDefault();
    }
});

// تحسين الأداء - lazy loading للصور
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        }
    });
});

// مراقبة الصور للـ lazy loading
document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});