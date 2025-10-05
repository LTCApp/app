// حماية صفحة الحساب - التحقق من تسجيل الدخول
(function() {
    'use strict';
    
    // التحقق من تسجيل الدخول عند تحميل الصفحة
    window.addEventListener('DOMContentLoaded', function() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userData = localStorage.getItem('userData');
        
        console.log('Checking login status...', { isLoggedIn, userData });
        
        if (!isLoggedIn || isLoggedIn !== 'true' || !userData) {
            // المستخدم غير مسجل دخول - التوجيه لصفحة تسجيل الدخول
            console.log('User not logged in, redirecting...');
            
            if (confirm('يجب تسجيل الدخول أولاً للوصول إلى صفحة الحساب. هل تريد الانتقال إلى صفحة تسجيل الدخول؟')) {
                window.location.href = 'login.html';
            } else {
                window.location.href = 'index.html';
            }
            return;
        }
        
        console.log('User is logged in, loading account data...');
        // المستخدم مسجل دخول - تحميل البيانات
        loadAccountData();
    });
    
    function loadAccountData() {
        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            console.log('Loading user data:', userData);
            
            if (userData) {
                // تحديث اسم المستخدم في الصفحة
                const userNameElements = document.querySelectorAll('.user-name, .profile-name, .account-name');
                userNameElements.forEach(el => {
                    if (el) {
                        el.textContent = userData.name || 'المستخدم';
                        console.log('Updated name element:', el);
                    }
                });
                
                // تحديث رقم الهاتف
                const phoneElements = document.querySelectorAll('.user-phone, .profile-phone, .account-phone');
                phoneElements.forEach(el => {
                    if (el) {
                        el.textContent = userData.phone || '';
                        console.log('Updated phone element:', el);
                    }
                });
                
                // تحديث البريد الإلكتروني إن وجد
                const emailElements = document.querySelectorAll('.user-email, .profile-email, .account-email');
                emailElements.forEach(el => {
                    if (el && userData.email) {
                        el.textContent = userData.email;
                    }
                });
            }
            
            // تحميل بيانات الأقسام بعد تأخير قصير للتأكد من تحميل الصفحة
            setTimeout(function() {
                console.log('Loading section data...');
                
                if (typeof loadOrders === 'function') {
                    console.log('Loading orders...');
                    loadOrders();
                }
                if (typeof loadFavorites === 'function') {
                    console.log('Loading favorites...');
                    loadFavorites();
                }
                if (typeof loadAddresses === 'function') {
                    console.log('Loading addresses...');
                    loadAddresses();
                }
                if (typeof loadPaymentMethods === 'function') {
                    console.log('Loading payment methods...');
                    loadPaymentMethods();
                }
                if (typeof loadNotificationSettings === 'function') {
                    console.log('Loading notification settings...');
                    loadNotificationSettings();
                }
            }, 100);
            
        } catch (error) {
            console.error('Error loading account data:', error);
        }
    }
    
    // إضافة وظيفة تسجيل الخروج
    window.logoutUser = function() {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userData');
            window.location.href = 'login.html';
        }
    };
    
})();