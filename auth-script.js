// ===================================
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
});