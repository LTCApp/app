// ===================================
// سوبر ماركت - JavaScript
// ===================================

// متغيرات عامة
let cart = [];
let cartTotal = 0;
let cartCount = 0;

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadCartFromStorage();
    setupEventListeners();
    animateElements();
});

// تهيئة التطبيق
function initializeApp() {
    console.log('🛒 تطبيق سوبر ماركت جاهز!');
    updateCartDisplay();
    
    // إضافة تأثير التحميل للمنتجات
    const products = document.querySelectorAll('.product-card');
    products.forEach((product, index) => {
        setTimeout(() => {
            product.classList.add('fade-in');
        }, index * 50);
    });
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // البحث
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // التنقل في القائمة السفلية
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // إضافة تأثير الاهتزاز
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = '';
            }, 10);
        });
    });
}

// ===================================
// وظائف السلة
// ===================================

// إضافة منتج للسلة
function addToCart(productName, price) {
    // البحث عن المنتج في السلة
    const existingProduct = cart.find(item => item.name === productName);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    // تحديث العداد والمجموع
    cartCount++;
    cartTotal += price;
    
    // حفظ السلة
    saveCartToStorage();
    
    // تحديث العرض
    updateCartDisplay();
    
    // إظهار رسالة نجاح
    showNotification(`✅ تمت إضافة ${productName} إلى السلة`);
    
    // تأثير صوتي (اختياري)
    playAddToCartAnimation();
}

// تحديث عرض السلة
function updateCartDisplay() {
    // تحديث شارة السلة في الهيدر
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
        cartBadge.textContent = cartCount;
        if (cartCount > 0) {
            cartBadge.style.display = 'flex';
        } else {
            cartBadge.style.display = 'none';
        }
    }
    
    // تحديث السلة العائمة
    const floatingCart = document.getElementById('floatingCart');
    const floatingCartCount = document.getElementById('floatingCartCount');
    const floatingCartTotal = document.getElementById('floatingCartTotal');
    
    if (floatingCart && floatingCartCount && floatingCartTotal) {
        if (cartCount > 0) {
            floatingCart.style.display = 'flex';
            floatingCartCount.textContent = cartCount;
            floatingCartTotal.textContent = `${cartTotal} ج.م`;
        } else {
            floatingCart.style.display = 'none';
        }
    }
}

// حفظ السلة في التخزين المحلي
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartCount', cartCount);
    localStorage.setItem('cartTotal', cartTotal);
}

// تحميل السلة من التخزين المحلي
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    const savedCount = localStorage.getItem('cartCount');
    const savedTotal = localStorage.getItem('cartTotal');
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
        cartCount = parseInt(savedCount) || 0;
        cartTotal = parseFloat(savedTotal) || 0;
        updateCartDisplay();
    }
}

// عرض السلة
function viewCart() {
    if (cart.length === 0) {
        showNotification('🛒 السلة فارغة! ابدأ بإضافة المنتجات');
        return;
    }
    
    let cartHTML = '<div style="background: white; padding: 20px; border-radius: 16px; max-width: 500px; margin: 20px auto;">';
    cartHTML += '<h2 style="color: #E53935; margin-bottom: 20px; text-align: center;">🛒 سلة التسوق</h2>';
    
    cart.forEach((item, index) => {
        cartHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #f0f0f0;">
                <div>
                    <div style="font-weight: bold; margin-bottom: 5px;">${item.name}</div>
                    <div style="color: #757575; font-size: 14px;">الكمية: ${item.quantity}</div>
                </div>
                <div style="text-align: left;">
                    <div style="color: #E53935; font-weight: bold; font-size: 18px;">${item.price * item.quantity} ج.م</div>
                    <button onclick="removeFromCart(${index})" style="background: #ff5252; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 5px;">حذف</button>
                </div>
            </div>
        `;
    });
    
    cartHTML += `
        <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #E53935;">
            <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: bold; margin-bottom: 20px;">
                <span>المجموع الكلي:</span>
                <span style="color: #E53935;">${cartTotal} ج.م</span>
            </div>
            <button onclick="checkout()" style="width: 100%; background: linear-gradient(135deg, #E53935 0%, #C62828 100%); color: white; border: none; padding: 15px; border-radius: 24px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(229, 57, 53, 0.4);">
                إتمام الطلب 🚀
            </button>
            <button onclick="closeModal()" style="width: 100%; background: #f5f5f5; color: #757575; border: none; padding: 12px; border-radius: 24px; font-size: 16px; cursor: pointer; margin-top: 10px;">
                متابعة التسوق
            </button>
        </div>
    `;
    
    cartHTML += '</div>';
    
    showModal(cartHTML);
}

// حذف منتج من السلة
function removeFromCart(index) {
    const item = cart[index];
    cartCount -= item.quantity;
    cartTotal -= item.price * item.quantity;
    cart.splice(index, 1);
    
    saveCartToStorage();
    updateCartDisplay();
    
    // إعادة عرض السلة
    if (cart.length > 0) {
        viewCart();
    } else {
        closeModal();
        showNotification('🛒 تم إفراغ السلة');
    }
}

// إتمام الطلب
function checkout() {
    showNotification('🎉 شكراً لك! جاري معالجة طلبك...');
    
    // محاكاة معالجة الطلب
    setTimeout(() => {
        showNotification('✅ تم تأكيد طلبك بنجاح! سيتم التوصيل خلال 30 دقيقة');
        
        // إفراغ السلة
        cart = [];
        cartCount = 0;
        cartTotal = 0;
        saveCartToStorage();
        updateCartDisplay();
        closeModal();
    }, 2000);
}

// ===================================
// وظائف البحث والتصفية
// ===================================

// البحث عن المنتجات
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const productName = product.querySelector('.product-name').textContent.toLowerCase();
        
        if (productName.includes(searchTerm)) {
            product.style.display = 'block';
            product.classList.add('fade-in');
        } else {
            product.style.display = 'none';
        }
    });
    
    // إظهار رسالة إذا لم يتم العثور على نتائج
    const visibleProducts = Array.from(products).filter(p => p.style.display !== 'none');
    if (visibleProducts.length === 0 && searchTerm !== '') {
        showNotification('😔 لم يتم العثور على منتجات مطابقة');
    }
}

// تصفية حسب الفئة
function filterByCategory(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        
        if (productCategory === category) {
            product.style.display = 'block';
            product.classList.add('fade-in');
        } else {
            product.style.display = 'none';
        }
    });
    
    // التمرير إلى قسم المنتجات
    const productsSection = document.querySelector('.products-section');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    showNotification(`📦 عرض منتجات: ${getCategoryName(category)}`);
}

// الحصول على اسم الفئة بالعربية
function getCategoryName(category) {
    const categories = {
        'fruits': 'الفواكه',
        'vegetables': 'الخضروات',
        'dairy': 'الألبان',
        'meat': 'اللحوم',
        'bakery': 'المخبوزات',
        'beverages': 'المشروبات',
        'snacks': 'الوجبات الخفيفة',
        'frozen': 'المجمدات'
    };
    return categories[category] || category;
}

// ===================================
// وظائف العروض
// ===================================

// عرض العروض الخاصة
function showDeals() {
    const dealsSection = document.querySelector('.deals-section');
    if (dealsSection) {
        dealsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    showNotification('⚡ تصفح العروض الخاصة المحدودة!');
}

// عرض منتجات العرض
function showDealProducts(dealType) {
    if (dealType === 'dairy') {
        filterByCategory('dairy');
    } else if (dealType === 'fresh') {
        // عرض الفواكه والخضروات
        const products = document.querySelectorAll('.product-card');
        products.forEach(product => {
            const category = product.getAttribute('data-category');
            if (category === 'fruits' || category === 'vegetables') {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }
    
    const productsSection = document.querySelector('.products-section');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===================================
// وظائف القائمة والإشعارات
// ===================================

// تبديل القائمة الجانبية
function toggleMenu() {
    showNotification('📱 القائمة الجانبية قيد التطوير');
}

// تبديل الإشعارات
function toggleNotifications() {
    const notifications = [
        '🎉 عرض خاص: خصم 30% على جميع الفواكه!',
        '🚚 طلبك في الطريق - سيصل خلال 15 دقيقة',
        '⭐ منتجات جديدة متوفرة الآن!'
    ];
    
    let notifHTML = '<div style="background: white; padding: 20px; border-radius: 16px; max-width: 400px; margin: 20px auto;">';
    notifHTML += '<h2 style="color: #E53935; margin-bottom: 20px;">🔔 الإشعارات</h2>';
    
    notifications.forEach(notif => {
        notifHTML += `
            <div style="padding: 15px; background: #f5f5f5; border-radius: 8px; margin-bottom: 10px;">
                ${notif}
            </div>
        `;
    });
    
    notifHTML += '<button onclick="closeModal()" style="width: 100%; background: #E53935; color: white; border: none; padding: 12px; border-radius: 24px; font-size: 16px; cursor: pointer; margin-top: 10px;">إغلاق</button>';
    notifHTML += '</div>';
    
    showModal(notifHTML);
}

// ===================================
// وظائف النوافذ المنبثقة
// ===================================

// عرض نافذة منبثقة
function showModal(content) {
    // إنشاء الخلفية
    const overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        animation: fadeIn 0.3s ease;
    `;
    
    // إنشاء المحتوى
    const modal = document.createElement('div');
    modal.style.cssText = `
        max-height: 90vh;
        overflow-y: auto;
        animation: slideUp 0.3s ease;
    `;
    modal.innerHTML = content;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // إغلاق عند النقر على الخلفية
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeModal();
        }
    });
}

// إغلاق النافذة المنبثقة
function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

// عرض إشعار
function showNotification(message) {
    // إزالة الإشعارات السابقة
    const existingNotif = document.getElementById('toast-notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    // إنشاء إشعار جديد
    const notification = document.createElement('div');
    notification.id = 'toast-notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #E53935 0%, #C62828 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 24px;
        box-shadow: 0 8px 24px rgba(229, 57, 53, 0.4);
        z-index: 10001;
        font-weight: 500;
        animation: slideDown 0.3s ease;
        max-width: 90%;
        text-align: center;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // إزالة بعد 3 ثواني
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===================================
// التأثيرات والأنيميشن
// ===================================

// تأثير إضافة للسلة
function playAddToCartAnimation() {
    // يمكن إضافة تأثيرات صوتية أو بصرية هنا
    console.log('🎯 تم إضافة المنتج!');
}

// تحريك العناصر عند التمرير
function animateElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    const elements = document.querySelectorAll('.product-card, .category-card, .deal-card');
    elements.forEach(el => observer.observe(el));
}

// ===================================
// أنماط CSS إضافية للأنيميشن
// ===================================

// إضافة أنماط الأنيميشن ديناميكياً
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideDown {
        from { transform: translate(-50%, -100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// ===================================
// وظائف إضافية
// ===================================

// تحديث الوقت للعروض المحدودة
function updateDealTimers() {
    const timers = document.querySelectorAll('.deal-timer');
    timers.forEach(timer => {
        // محاكاة العد التنازلي
        const text = timer.textContent;
        // يمكن إضافة منطق العد التنازلي الحقيقي هنا
    });
}

// تشغيل تحديث المؤقتات كل دقيقة
setInterval(updateDealTimers, 60000);

// معالجة الأخطاء العامة
window.addEventListener('error', function(e) {
    console.error('حدث خطأ:', e.message);
});

// تسجيل تحميل الصفحة
console.log('✅ تم تحميل جميع السكريبتات بنجاح');
</script>// ===================================
// وظائف التسجيل والدخول
// ===================================

// تبديل إظهار/إخفاء كلمة المرور
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const eye = document.getElementById(inputId + '-eye');
    
    if (input.type === 'password') {
        input.type = 'text';
        eye.textContent = '👁️‍🗨️';
    } else {
        input.type = 'password';
        eye.textContent = '👁️';
    }
}

// معالجة تسجيل حساب جديد
function handleSignup(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const terms = formData.get('terms');
    
    // التحقق من تطابق كلمة المرور
    if (password !== confirmPassword) {
        showNotification('كلمة المرور غير متطابقة', 'error');
        return;
    }
    
    // التحقق من الموافقة على الشروط
    if (!terms) {
        showNotification('يجب الموافقة على الشروط والأحكام', 'error');
        return;
    }
    
    // إظهار مؤشر التحميل
    const submitBtn = form.querySelector('.auth-submit-btn');
    const btnText = submitBtn.querySelector('span:first-child');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    submitBtn.disabled = true;
    
    // محاكاة عملية التسجيل
    setTimeout(() => {
        // حفظ بيانات المستخدم
        const userData = {
            fullName: fullName,
            email: email,
            phone: phone,
            registeredAt: new Date().toISOString()
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        
        // إخفاء مؤشر التحميل
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
        
        // إظهار رسالة نجاح
        showNotification('تم إنشاء الحساب بنجاح! جاري تحويلك...', 'success');
        
        // التحويل للصفحة الرئيسية
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 2000);
}

// معالجة تسجيل الدخول
function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const emailOrPhone = formData.get('emailOrPhone');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // إظهار مؤشر التحميل
    const submitBtn = form.querySelector('.auth-submit-btn');
    const btnText = submitBtn.querySelector('span:first-child');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    submitBtn.disabled = true;
    
    // محاكاة عملية تسجيل الدخول
    setTimeout(() => {
        // التحقق من وجود بيانات مستخدم محفوظة
        const savedUserData = localStorage.getItem('userData');
        
        if (savedUserData) {
            const userData = JSON.parse(savedUserData);
            
            // التحقق من البريد الإلكتروني أو رقم الموبايل
            if (userData.email === emailOrPhone || userData.phone === emailOrPhone) {
                localStorage.setItem('isLoggedIn', 'true');
                
                if (remember) {
                    localStorage.setItem('rememberMe', 'true');
                }
                
                // إخفاء مؤشر التحميل
                btnText.style.display = 'inline-block';
                btnLoader.style.display = 'none';
                submitBtn.disabled = false;
                
                // إظهار رسالة نجاح
                showNotification('تم تسجيل الدخول بنجاح! جاري تحويلك...', 'success');
                
                // التحويل للصفحة الرئيسية
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                // بيانات غير صحيحة
                btnText.style.display = 'inline-block';
                btnLoader.style.display = 'none';
                submitBtn.disabled = false;
                
                showNotification('البريد الإلكتروني أو رقم الموبايل غير صحيح', 'error');
            }
        } else {
            // لا يوجد حساب مسجل
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
            
            showNotification('لا يوجد حساب بهذه البيانات. يرجى إنشاء حساب جديد', 'error');
        }
    }, 2000);
}

// تسجيل الدخول باستخدام Google
function signInWithGoogle() {
    showNotification('جاري تسجيل الدخول باستخدام Google...', 'info');
    
    // محاكاة تسجيل الدخول بـ Google
    setTimeout(() => {
        const userData = {
            fullName: 'مستخدم Google',
            email: 'user@gmail.com',
            phone: '0512345678',
            registeredAt: new Date().toISOString(),
            provider: 'google'
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        
        showNotification('تم تسجيل الدخول بنجاح!', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 1500);
}

// إظهار نافذة نسيت كلمة المرور
function showForgotPassword(event) {
    event.preventDefault();
    const modal = document.getElementById('forgotPasswordModal');
    modal.style.display = 'flex';
}

// إغلاق نافذة نسيت كلمة المرور
function closeForgotPassword() {
    const modal = document.getElementById('forgotPasswordModal');
    modal.style.display = 'none';
}

// معالجة استعادة كلمة المرور
function handleForgotPassword(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const resetEmail = formData.get('resetEmail');
    
    showNotification('تم إرسال رابط استعادة كلمة المرور إلى ' + resetEmail, 'success');
    
    setTimeout(() => {
        closeForgotPassword();
        form.reset();
    }, 2000);
}

// ===================================
// وظائف صفحة الحساب
// ===================================

// تحميل بيانات المستخدم
function loadUserData() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn || isLoggedIn !== 'true') {
        // إذا لم يكن المستخدم مسجل دخول، التحويل لصفحة تسجيل الدخول
        window.location.href = 'login.html';
        return;
    }
    
    const userData = localStorage.getItem('userData');
    
    if (userData) {
        const user = JSON.parse(userData);
        
        // تحديث عناصر الصفحة
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const userPhone = document.getElementById('userPhone');
        
        if (userName) userName.textContent = user.fullName || 'اسم المستخدم';
        if (userEmail) userEmail.textContent = user.email || 'user@example.com';
        if (userPhone) userPhone.textContent = user.phone || '05xxxxxxxx';
        
        // تحديث نموذج التعديل
        const editName = document.getElementById('editName');
        const editEmail = document.getElementById('editEmail');
        const editPhone = document.getElementById('editPhone');
        
        if (editName) editName.value = user.fullName || '';
        if (editEmail) editEmail.value = user.email || '';
        if (editPhone) editPhone.value = user.phone || '';
    }
}

// إظهار نافذة تعديل الملف الشخصي
function showEditProfile() {
    const modal = document.getElementById('editProfileModal');
    modal.style.display = 'flex';
}

// إغلاق نافذة تعديل الملف الشخصي
function closeEditProfile() {
    const modal = document.getElementById('editProfileModal');
    modal.style.display = 'none';
}

// معالجة تعديل الملف الشخصي
function handleEditProfile(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    
    // تحديث بيانات المستخدم
    const userData = {
        fullName: name,
        email: email,
        phone: phone,
        updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    
    showNotification('تم تحديث البيانات بنجاح!', 'success');
    
    setTimeout(() => {
        closeEditProfile();
        loadUserData();
    }, 1500);
}

// إظهار نافذة الطلبات
function showOrders() {
    const modal = document.getElementById('ordersModal');
    modal.style.display = 'flex';
}

// إغلاق نافذة الطلبات
function closeOrders() {
    const modal = document.getElementById('ordersModal');
    modal.style.display = 'none';
}

// إظهار المفضلة
function showFavorites() {
    showNotification('قريباً: صفحة المفضلة', 'info');
}

// إظهار العناوين
function showAddresses() {
    showNotification('قريباً: إدارة العناوين', 'info');
}

// إظهار طرق الدفع
function showPaymentMethods() {
    showNotification('قريباً: إدارة طرق الدفع', 'info');
}

// إظهار الإشعارات
function showNotifications() {
    showNotification('قريباً: إعدادات الإشعارات', 'info');
}

// إظهار اللغة
function showLanguage() {
    showNotification('قريباً: تغيير اللغة', 'info');
}

// إظهار الدعم
function showSupport() {
    showNotification('قريباً: المساعدة والدعم', 'info');
}

// إظهار الشروط
function showTerms() {
    showNotification('قريباً: الشروط والأحكام', 'info');
}

// تسجيل الخروج
function handleLogout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('rememberMe');
        
        showNotification('تم تسجيل الخروج بنجاح', 'success');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
}

// ===================================
// وظائف الإشعارات
// ===================================

function showNotification(message, type = 'info') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        font-size: 14px;
        font-weight: 500;
    `;
    
    notification.textContent = message;
    
    // إضافة الإشعار للصفحة
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 3 ثواني
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// إضافة أنماط الرسوم المتحركة
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
`;
document.head.appendChild(style);

// ===================================
// التهيئة عند تحميل الصفحة
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // إذا كانت صفحة الحساب، تحميل بيانات المستخدم
    if (window.location.pathname.includes('account.html')) {
        loadUserData();
    }
    
    // التحقق من حالة تسجيل الدخول في الصفحة الرئيسية
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        updateLoginStatus();
    }
});

// تحديث حالة تسجيل الدخول في الصفحة الرئيسية
function updateLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    
    if (isLoggedIn === 'true') {
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) {
            logoutLink.style.display = 'flex';
            logoutLink.onclick = function(e) {
                e.preventDefault();
                handleLogout();
            };
        }
    } else {
        if (loginLink) loginLink.style.display = 'flex';
        if (logoutLink) logoutLink.style.display = 'none';
    }
}

// إظهار/إخفاء قائمة المستخدم
document.addEventListener('click', function(e) {
    const userIcon = document.getElementById('userIcon');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userIcon && userDropdown) {
        if (e.target === userIcon || userIcon.contains(e.target)) {
            userDropdown.classList.toggle('show');
        } else if (!userDropdown.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    }
});// ===================================
// نظام OTP
// ===================================

let otpTimer;
let otpTimeLeft = 60;
let currentOTP = '123456'; // OTP تجريبي
let pendingUserData = null;

// إظهار نافذة OTP
function showOTPModal(phone, userData = null) {
    pendingUserData = userData;
    const modal = document.getElementById('otpModal');
    const phoneDisplay = document.getElementById('otpPhone');
    
    if (phoneDisplay) {
        phoneDisplay.textContent = phone;
    }
    
    // توليد OTP جديد
    currentOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('OTP المرسل:', currentOTP); // للتجربة فقط
    
    modal.style.display = 'flex';
    
    // بدء العد التنازلي
    startOTPTimer();
    
    // التركيز على أول حقل
    setTimeout(() => {
        document.getElementById('otp1').focus();
    }, 300);
}

// بدء مؤقت OTP
function startOTPTimer() {
    otpTimeLeft = 60;
    const timerElement = document.getElementById('otpTimer');
    const resendBtn = document.getElementById('resendOtpBtn');
    
    if (resendBtn) {
        resendBtn.disabled = true;
    }
    
    otpTimer = setInterval(() => {
        otpTimeLeft--;
        if (timerElement) {
            timerElement.textContent = otpTimeLeft;
        }
        
        if (otpTimeLeft <= 0) {
            clearInterval(otpTimer);
            if (resendBtn) {
                resendBtn.disabled = false;
            }
        }
    }, 1000);
}

// إعادة إرسال OTP
function resendOTP() {
    currentOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('OTP الجديد:', currentOTP);
    showNotification('تم إرسال رمز التحقق مرة أخرى', 'success');
    startOTPTimer();
    
    // مسح الحقول
    for (let i = 1; i <= 6; i++) {
        const input = document.getElementById('otp' + i);
        if (input) input.value = '';
    }
    document.getElementById('otp1').focus();
}

// الانتقال للحقل التالي
function moveToNext(current, nextFieldID) {
    if (current.value.length >= 1) {
        if (nextFieldID) {
            document.getElementById(nextFieldID).focus();
        }
    }
}

// الرجوع للحقل السابق
function moveToPrev(event, current, prevFieldID) {
    if (event.key === 'Backspace' && current.value.length === 0) {
        if (prevFieldID) {
            document.getElementById(prevFieldID).focus();
        }
    }
}

// التحقق من OTP للتسجيل
function verifyOTP() {
    let enteredOTP = '';
    for (let i = 1; i <= 6; i++) {
        const input = document.getElementById('otp' + i);
        if (input) {
            enteredOTP += input.value;
        }
    }
    
    if (enteredOTP.length === 6) {
        if (enteredOTP === currentOTP || enteredOTP === '123456') {
            clearInterval(otpTimer);
            
            // حفظ بيانات المستخدم
            if (pendingUserData) {
                localStorage.setItem('userData', JSON.stringify(pendingUserData));
                localStorage.setItem('isLoggedIn', 'true');
            }
            
            showNotification('تم التحقق بنجاح!', 'success');
            
            setTimeout(() => {
                document.getElementById('otpModal').style.display = 'none';
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showNotification('رمز التحقق غير صحيح', 'error');
            // مسح الحقول
            for (let i = 1; i <= 6; i++) {
                const input = document.getElementById('otp' + i);
                if (input) input.value = '';
            }
            document.getElementById('otp1').focus();
        }
    }
}

// التحقق من OTP لتسجيل الدخول
function verifyOTPLogin() {
    verifyOTP(); // نفس الوظيفة
}

// ===================================
// تحديث وظائف التسجيل والدخول
// ===================================

// معالجة تسجيل حساب جديد (محدثة)
function handleSignup(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const fullName = formData.get('fullName');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const terms = formData.get('terms');
    
    // التحقق من تطابق كلمة المرور
    if (password !== confirmPassword) {
        showNotification('كلمة المرور غير متطابقة', 'error');
        return;
    }
    
    // التحقق من الموافقة على الشروط
    if (!terms) {
        showNotification('يجب الموافقة على الشروط والأحكام', 'error');
        return;
    }
    
    // إظهار مؤشر التحميل
    const submitBtn = form.querySelector('.auth-submit-btn');
    const btnText = submitBtn.querySelector('span:first-child');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    submitBtn.disabled = true;
    
    // محاكاة إرسال OTP
    setTimeout(() => {
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
        
        // حفظ البيانات مؤقتاً
        const userData = {
            fullName: fullName,
            phone: phone,
            registeredAt: new Date().toISOString()
        };
        
        // إظهار نافذة OTP
        showOTPModal(phone, userData);
    }, 1500);
}

// معالجة تسجيل الدخول (محدثة)
function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const phone = formData.get('phone');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // إظهار مؤشر التحميل
    const submitBtn = form.querySelector('.auth-submit-btn');
    const btnText = submitBtn.querySelector('span:first-child');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    submitBtn.disabled = true;
    
    // محاكاة عملية تسجيل الدخول
    setTimeout(() => {
        const savedUserData = localStorage.getItem('userData');
        
        if (savedUserData) {
            const userData = JSON.parse(savedUserData);
            
            if (userData.phone === phone) {
                btnText.style.display = 'inline-block';
                btnLoader.style.display = 'none';
                submitBtn.disabled = false;
                
                // إظهار نافذة OTP
                showOTPModal(phone, userData);
                
                if (remember) {
                    localStorage.setItem('rememberMe', 'true');
                }
            } else {
                btnText.style.display = 'inline-block';
                btnLoader.style.display = 'none';
                submitBtn.disabled = false;
                showNotification('رقم الموبايل أو كلمة المرور غير صحيح', 'error');
            }
        } else {
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
            showNotification('لا يوجد حساب بهذا الرقم. يرجى إنشاء حساب جديد', 'error');
        }
    }, 1500);
}

// ===================================
// وظائف صفحة الحساب المحدثة
// ===================================

// تحميل بيانات المستخدم (محدثة)
function loadUserData() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    
    const userData = localStorage.getItem('userData');
    
    if (userData) {
        const user = JSON.parse(userData);
        
        const userName = document.getElementById('userName');
        const userPhone = document.getElementById('userPhone');
        
        if (userName) userName.textContent = user.fullName || 'اسم المستخدم';
        if (userPhone) userPhone.textContent = user.phone || '05xxxxxxxx';
        
        const editName = document.getElementById('editName');
        const editPhone = document.getElementById('editPhone');
        
        if (editName) editName.value = user.fullName || '';
        if (editPhone) editPhone.value = user.phone || '';
    }
    
    // تحميل البيانات الأخرى
    loadOrders();
    loadFavorites();
    loadAddresses();
    loadPaymentMethods();
    loadNotificationSettings();
}

// تحميل الطلبات
function loadOrders() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    // بيانات تجريبية
    const orders = [
        {
            id: '#12345',
            date: '2024-10-01',
            status: 'completed',
            statusText: 'تم التوصيل',
            items: [
                { name: 'تفاح أحمر', quantity: 2, price: 15 },
                { name: 'حليب كامل الدسم', quantity: 1, price: 12 }
            ],
            total: 42
        },
        {
            id: '#12344',
            date: '2024-09-28',
            status: 'processing',
            statusText: 'قيد التجهيز',
            items: [
                { name: 'خبز أبيض', quantity: 2, price: 5 },
                { name: 'جبنة شيدر', quantity: 1, price: 21 }
            ],
            total: 31
        },
        {
            id: '#12343',
            date: '2024-09-25',
            status: 'pending',
            statusText: 'قيد الانتظار',
            items: [
                { name: 'موز', quantity: 1, price: 10 },
                { name: 'عصير برتقال', quantity: 2, price: 17 }
            ],
            total: 44
        }
    ];
    
    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📦</span>
                <h3>لا توجد طلبات بعد</h3>
                <p>ابدأ التسوق الآن واستمتع بعروضنا المميزة</p>
                <a href="index.html" class="btn-primary">تسوق الآن</a>
            </div>
        `;
    } else {
        ordersList.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-number">طلب ${order.id}</div>
                        <div class="order-date">${order.date}</div>
                    </div>
                    <span class="order-status status-${order.status}">${order.statusText}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.quantity}x ${item.name}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">
                    <span>الإجمالي:</span>
                    <span>${order.total} ج.م</span>
                </div>
            </div>
        `).join('');
    }
}

// إظهار الطلبات
function showOrders() {
    loadOrders();
    const modal = document.getElementById('ordersModal');
    modal.style.display = 'flex';
}

// إغلاق الطلبات
function closeOrders() {
    const modal = document.getElementById('ordersModal');
    modal.style.display = 'none';
}

// تحميل المفضلة
function loadFavorites() {
    const favoritesList = document.getElementById('favoritesList');
    if (!favoritesList) return;
    
    // بيانات تجريبية
    const favorites = [
        { id: 1, name: 'تفاح أحمر', price: 15, icon: '🍎' },
        { id: 2, name: 'موز', price: 10, icon: '🍌' },
        { id: 3, name: 'حليب', price: 12, icon: '🥛' },
        { id: 4, name: 'خبز', price: 5, icon: '🍞' }
    ];
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">❤️</span>
                <h3>لا توجد منتجات مفضلة</h3>
                <p>أضف منتجاتك المفضلة للوصول السريع</p>
                <a href="index.html" class="btn-primary">تصفح المنتجات</a>
            </div>
        `;
    } else {
        favoritesList.innerHTML = favorites.map(item => `
            <div class="favorite-item">
                <button class="remove-favorite" onclick="removeFavorite(${item.id})">×</button>
                <div class="favorite-icon">${item.icon}</div>
                <div class="favorite-name">${item.name}</div>
                <div class="favorite-price">${item.price} ج.م</div>
            </div>
        `).join('');
    }
}

// إظهار المفضلة
function showFavorites() {
    loadFavorites();
    const modal = document.getElementById('favoritesModal');
    modal.style.display = 'flex';
}

// إغلاق المفضلة
function closeFavorites() {
    const modal = document.getElementById('favoritesModal');
    modal.style.display = 'none';
}

// حذف من المفضلة
function removeFavorite(id) {
    showNotification('تم الحذف من المفضلة', 'success');
    loadFavorites();
}

// تحميل العناوين
function loadAddresses() {
    const addressesList = document.getElementById('addressesList');
    if (!addressesList) return;
    
    // بيانات تجريبية
    const addresses = [
        {
            id: 1,
            title: 'المنزل',
            city: 'الرياض',
            district: 'النخيل',
            street: 'شارع الملك فهد',
            building: '1234',
            isDefault: true
        },
        {
            id: 2,
            title: 'العمل',
            city: 'الرياض',
            district: 'العليا',
            street: 'طريق الملك عبدالعزيز',
            building: '5678',
            isDefault: false
        }
    ];
    
    if (addresses.length === 0) {
        addressesList.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📍</span>
                <h3>لا توجد عناوين محفوظة</h3>
                <p>أضف عنوان التوصيل الخاص بك</p>
            </div>
        `;
    } else {
        addressesList.innerHTML = addresses.map(address => `
            <div class="address-card ${address.isDefault ? 'default' : ''}">
                <div class="address-title">${address.title} ${address.isDefault ? '(افتراضي)' : ''}</div>
                <div class="address-details">
                    ${address.city}، ${address.district}<br>
                    ${address.street}، مبنى ${address.building}
                </div>
                <div class="address-actions">
                    <button class="address-btn" onclick="editAddress(${address.id})">تعديل</button>
                    ${!address.isDefault ? `<button class="address-btn" onclick="setDefaultAddress(${address.id})">جعله افتراضي</button>` : ''}
                    <button class="address-btn delete" onclick="deleteAddress(${address.id})">حذف</button>
                </div>
            </div>
        `).join('');
    }
}

// إظهار العناوين
function showAddresses() {
    loadAddresses();
    const modal = document.getElementById('addressesModal');
    modal.style.display = 'flex';
}

// إغلاق العناوين
function closeAddresses() {
    const modal = document.getElementById('addressesModal');
    modal.style.display = 'none';
}

// إظهار نافذة إضافة عنوان
function showAddAddress() {
    const modal = document.getElementById('addAddressModal');
    modal.style.display = 'flex';
}

// إغلاق نافذة إضافة عنوان
function closeAddAddress() {
    const modal = document.getElementById('addAddressModal');
    modal.style.display = 'none';
}

// معالجة إضافة عنوان
function handleAddAddress(event) {
    event.preventDefault();
    showNotification('تم إضافة العنوان بنجاح', 'success');
    closeAddAddress();
    loadAddresses();
}

// تعديل عنوان
function editAddress(id) {
    showNotification('قريباً: تعديل العنوان', 'info');
}

// جعل عنوان افتراضي
function setDefaultAddress(id) {
    showNotification('تم تعيين العنوان كافتراضي', 'success');
    loadAddresses();
}

// حذف عنوان
function deleteAddress(id) {
    if (confirm('هل أنت متأكد من حذف هذا العنوان؟')) {
        showNotification('تم حذف العنوان', 'success');
        loadAddresses();
    }
}

// تحميل طرق الدفع
function loadPaymentMethods() {
    const paymentMethodsList = document.getElementById('paymentMethodsList');
    if (!paymentMethodsList) return;
    
    // بيانات تجريبية
    const cards = [
        // Cards will be loaded from database
    ];
    
    if (cards.length === 0) {
        paymentMethodsList.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">💳</span>
                <h3>لا توجد بطاقات محفوظة</h3>
                <p>أضف بطاقة دفع لتسهيل عملية الشراء</p>
            </div>
        `;
    } else {
        paymentMethodsList.innerHTML = cards.map(card => `
            <div class="payment-card">
                <button class="delete-card" onclick="deleteCard(${card.id})">×</button>
                <div class="card-type">${card.type}</div>
                <div class="card-number">${card.number}</div>
                <div class="card-info">
                    <span>${card.name}</span>
                    <span>${card.expiry}</span>
                </div>
            </div>
        `).join('');
    }
}

// إظهار طرق الدفع
function showPaymentMethods() {
    loadPaymentMethods();
    const modal = document.getElementById('paymentMethodsModal');
    modal.style.display = 'flex';
}

// إغلاق طرق الدفع
function closePaymentMethods() {
    const modal = document.getElementById('paymentMethodsModal');
    modal.style.display = 'none';
}

// إظهار نافذة إضافة بطاقة
function showAddCard() {
    const modal = document.getElementById('addCardModal');
    modal.style.display = 'flex';
}

// إغلاق نافذة إضافة بطاقة
function closeAddCard() {
    const modal = document.getElementById('addCardModal');
    modal.style.display = 'none';
}

// معالجة إضافة بطاقة
function handleAddCard(event) {
    event.preventDefault();
    showNotification('تم إضافة البطاقة بنجاح', 'success');
    closeAddCard();
    loadPaymentMethods();
}

// حذف بطاقة
function deleteCard(id) {
    if (confirm('هل أنت متأكد من حذف هذه البطاقة؟')) {
        showNotification('تم حذف البطاقة', 'success');
        loadPaymentMethods();
    }
}

// تحميل إعدادات الإشعارات
function loadNotificationSettings() {
    const orderNotifications = localStorage.getItem('orderNotifications') !== 'false';
    const offersNotifications = localStorage.getItem('offersNotifications') !== 'false';
    const newProductsNotifications = localStorage.getItem('newProductsNotifications') === 'true';
    
    const orderInput = document.getElementById('orderNotifications');
    const offersInput = document.getElementById('offersNotifications');
    const newProductsInput = document.getElementById('newProductsNotifications');
    
    if (orderInput) orderInput.checked = orderNotifications;
    if (offersInput) offersInput.checked = offersNotifications;
    if (newProductsInput) newProductsInput.checked = newProductsNotifications;
}

// حفظ إعدادات الإشعارات
function saveNotificationSettings() {
    const orderNotifications = document.getElementById('orderNotifications').checked;
    const offersNotifications = document.getElementById('offersNotifications').checked;
    const newProductsNotifications = document.getElementById('newProductsNotifications').checked;
    
    localStorage.setItem('orderNotifications', orderNotifications);
    localStorage.setItem('offersNotifications', offersNotifications);
    localStorage.setItem('newProductsNotifications', newProductsNotifications);
    
    showNotification('تم حفظ الإعدادات', 'success');
}

// إظهار الإشعارات
function showNotifications() {
    loadNotificationSettings();
    const modal = document.getElementById('notificationsModal');
    modal.style.display = 'flex';
}

// إغلاق الإشعارات
function closeNotificationsModal() {
    const modal = document.getElementById('notificationsModal');
    modal.style.display = 'none';
}

// إظهار الدعم
function showSupport() {
    const modal = document.getElementById('supportModal');
    modal.style.display = 'flex';
}

// إغلاق الدعم
function closeSupportModal() {
    const modal = document.getElementById('supportModal');
    modal.style.display = 'none';
}

// إظهار الشروط
function showTermsPage() {
    const modal = document.getElementById('termsModal');
    modal.style.display = 'flex';
}

// إظهار الشروط من صفحة التسجيل
function showTerms(event) {
    event.preventDefault();
    showTermsPage();
}

// إغلاق الشروط
function closeTermsModal() {
    const modal = document.getElementById('termsModal');
    modal.style.display = 'none';
}

// معالجة تعديل الملف الشخصي (محدثة)
function handleEditProfile(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const name = formData.get('name');
    const phone = formData.get('phone');
    
    const userData = {
        fullName: name,
        phone: phone,
        updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    
    showNotification('تم تحديث البيانات بنجاح!', 'success');
    
    setTimeout(() => {
        closeEditProfile();
        loadUserData();
    }, 1500);
}

// ===================================
// حماية صفحة الحساب في الصفحة الرئيسية
// ===================================

// التحقق من تسجيل الدخول عند الضغط على "حسابي"
function checkLoginBeforeAccount(event) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn || isLoggedIn !== 'true') {
        event.preventDefault();
        
        // إظهار رسالة وتوجيه للتسجيل
        if (confirm('يجب تسجيل الدخول أولاً. هل تريد تسجيل الدخول الآن؟')) {
            window.location.href = 'login.html';
        }
    }
}

// إضافة حماية لرابط حسابي في الصفحة الرئيسية
document.addEventListener('DOMContentLoaded', function() {
    // حماية رابط حسابي في القائمة السفلية
    const accountLinks = document.querySelectorAll('a[href="account.html"]');
    accountLinks.forEach(link => {
        link.addEventListener('click', checkLoginBeforeAccount);
    });
});