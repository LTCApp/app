// Account Management System
class AccountManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.otpTimer = null;
        this.otpCountdown = 60;
        this.currentOTP = null;
        this.isAuthenticated = false;
        
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupEventListeners();
        this.setupPasswordStrength();
        this.setupOTPInputs();
        this.setupGoogleAuth();
        this.startAnimations();
    }

    checkAuthStatus() {
        if (this.currentUser) {
            this.showUserProfile();
        } else {
            this.showAuthContainer();
        }
    }

    setupEventListeners() {
        // Form submissions
        document.getElementById('phoneLoginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePhoneLogin();
        });

        document.getElementById('phoneRegisterForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePhoneRegister();
        });

        document.getElementById('otpForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleOTPVerification();
        });

        // Resend OTP
        document.getElementById('resendBtn').addEventListener('click', () => {
            this.resendOTP();
        });

        // Input validations
        document.getElementById('phoneLogin').addEventListener('input', (e) => {
            this.validatePhone(e.target);
        });

        document.getElementById('phoneRegister').addEventListener('input', (e) => {
            this.validatePhone(e.target);
        });

        document.getElementById('passwordRegister').addEventListener('input', (e) => {
            this.checkPasswordStrength(e.target.value);
            this.validatePasswordMatch();
        });

        document.getElementById('confirmPassword').addEventListener('input', () => {
            this.validatePasswordMatch();
        });

        // Real-time validations
        document.getElementById('fullName').addEventListener('input', (e) => {
            this.validateName(e.target);
        });

        document.getElementById('email').addEventListener('input', (e) => {
            this.validateEmail(e.target);
        });
    }

    showLogin() {
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const welcomeTitle = document.getElementById('welcomeTitle');
        const welcomeSubtitle = document.getElementById('welcomeSubtitle');

        // Update buttons
        loginBtn.classList.add('active');
        registerBtn.classList.remove('active');

        // Update content
        welcomeTitle.textContent = 'مرحباً بعودتك!';
        welcomeSubtitle.textContent = 'سجل دخولك للاستمتاع بتجربة تسوق مميزة';

        // Show/hide forms with animation
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        loginForm.classList.add('fade-in');

        // Reset OTP section
        this.hideOTPSection();
    }

    showRegister() {
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const welcomeTitle = document.getElementById('welcomeTitle');
        const welcomeSubtitle = document.getElementById('welcomeSubtitle');

        // Update buttons
        registerBtn.classList.add('active');
        loginBtn.classList.remove('active');

        // Update content
        welcomeTitle.textContent = 'مرحباً بك!';
        welcomeSubtitle.textContent = 'أنشئ حسابك الجديد وابدأ تجربة تسوق رائعة';

        // Show/hide forms with animation
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        registerForm.classList.add('fade-in');

        // Reset OTP section
        this.hideOTPSection();
    }

    async handlePhoneLogin() {
        const countryCode = document.getElementById('countryCode').value;
        const phoneNumber = document.getElementById('phoneLogin').value;
        const fullPhone = countryCode + phoneNumber;

        if (!this.validatePhoneNumber(phoneNumber)) {
            this.showError('يرجى إدخال رقم موبايل صحيح');
            return;
        }

        this.showLoading('جاري التحقق من البيانات...');

        try {
            // Simulate API call
            await this.simulateDelay(2000);
            
            // Generate OTP and send
            this.currentOTP = this.generateOTP();
            console.log('OTP Generated for login:', this.currentOTP); // For testing
            
            // Store phone for verification
            sessionStorage.setItem('verificationPhone', fullPhone);
            sessionStorage.setItem('verificationType', 'login');
            
            this.hideLoading();
            this.showOTPSection(fullPhone);
            this.startOTPTimer();
            
            this.showSuccess('تم إرسال كود التحقق إلى هاتفك');
            
        } catch (error) {
            this.hideLoading();
            this.showError('حدث خطأ في إرسال كود التحقق. يرجى المحاولة مرة أخرى');
        }
    }

    async handlePhoneRegister() {
        const fullName = document.getElementById('fullName').value;
        const countryCode = document.getElementById('countryCodeRegister').value;
        const phoneNumber = document.getElementById('phoneRegister').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('passwordRegister').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const acceptTerms = document.getElementById('acceptTerms').checked;

        // Validations
        if (!fullName.trim()) {
            this.showError('يرجى إدخال الاسم الكامل');
            return;
        }

        if (!this.validatePhoneNumber(phoneNumber)) {
            this.showError('يرجى إدخال رقم موبايل صحيح');
            return;
        }

        if (email && !this.validateEmailFormat(email)) {
            this.showError('يرجى إدخال بريد إلكتروني صحيح');
            return;
        }

        if (password.length < 8) {
            this.showError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('كلمات المرور غير متطابقة');
            return;
        }

        if (!acceptTerms) {
            this.showError('يجب الموافقة على الشروط والأحكام');
            return;
        }

        const fullPhone = countryCode + phoneNumber;

        this.showLoading('جاري إنشاء الحساب...');

        try {
            // Simulate API call
            await this.simulateDelay(2000);
            
            // Generate OTP and send
            this.currentOTP = this.generateOTP();
            console.log('OTP Generated for registration:', this.currentOTP); // For testing
            
            // Store user data for completion after verification
            const userData = {
                fullName,
                phone: fullPhone,
                email,
                password: await this.hashPassword(password),
                registrationDate: new Date().toISOString()
            };
            
            sessionStorage.setItem('pendingUser', JSON.stringify(userData));
            sessionStorage.setItem('verificationPhone', fullPhone);
            sessionStorage.setItem('verificationType', 'register');
            
            this.hideLoading();
            this.showOTPSection(fullPhone);
            this.startOTPTimer();
            
            this.showSuccess('تم إرسال كود التحقق لإكمال التسجيل');
            
        } catch (error) {
            this.hideLoading();
            this.showError('حدث خطأ في إنشاء الحساب. يرجى المحاولة مرة أخرى');
        }
    }

    async handleOTPVerification() {
        const otpInputs = document.querySelectorAll('.otp-digit');
        const enteredOTP = Array.from(otpInputs).map(input => input.value).join('');

        if (enteredOTP.length !== 6) {
            this.showError('يرجى إدخال كود التحقق كاملاً');
            this.shakeOTPInputs();
            return;
        }

        if (enteredOTP !== this.currentOTP) {
            this.showError('كود التحقق غير صحيح');
            this.shakeOTPInputs();
            this.clearOTPInputs();
            return;
        }

        this.showLoading('جاري التحقق...');

        try {
            await this.simulateDelay(1500);

            const verificationType = sessionStorage.getItem('verificationType');
            
            if (verificationType === 'register') {
                // Complete registration
                const userData = JSON.parse(sessionStorage.getItem('pendingUser'));
                await this.completeRegistration(userData);
            } else {
                // Complete login
                await this.completeLogin();
            }

            // Clear session data
            sessionStorage.removeItem('pendingUser');
            sessionStorage.removeItem('verificationPhone');
            sessionStorage.removeItem('verificationType');
            
            this.hideLoading();
            this.showSuccess('تم التحقق بنجاح!');
            
            // Show user profile after delay
            setTimeout(() => {
                this.showUserProfile();
            }, 1000);
            
        } catch (error) {
            this.hideLoading();
            this.showError('حدث خطأ في التحقق. يرجى المحاولة مرة أخرى');
        }
    }

    async completeRegistration(userData) {
        // Simulate account creation
        const user = {
            id: this.generateUserId(),
            name: userData.fullName,
            phone: userData.phone,
            email: userData.email,
            avatar: null,
            joinDate: userData.registrationDate,
            isVerified: true,
            wallet: 0,
            orders: [],
            favorites: [],
            addresses: []
        };

        // Save user data
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
        this.isAuthenticated = true;

        // Add to users list (for future login)
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({
            phone: userData.phone,
            password: userData.password,
            userData: user
        });
        localStorage.setItem('users', JSON.stringify(users));
    }

    async completeLogin() {
        const phone = sessionStorage.getItem('verificationPhone');
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.phone === phone);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user.userData));
            this.currentUser = user.userData;
        } else {
            // Create guest user for first-time login
            const guestUser = {
                id: this.generateUserId(),
                name: 'مستخدم جديد',
                phone: phone,
                email: null,
                avatar: null,
                joinDate: new Date().toISOString(),
                isVerified: true,
                wallet: 0,
                orders: [],
                favorites: [],
                addresses: []
            };
            
            localStorage.setItem('currentUser', JSON.stringify(guestUser));
            this.currentUser = guestUser;
        }
        
        this.isAuthenticated = true;
    }

    showOTPSection(phoneNumber) {
        const otpSection = document.getElementById('otpSection');
        const sentToNumber = document.getElementById('sentToNumber');
        const phoneLoginForm = document.getElementById('phoneLoginForm');
        const phoneRegisterForm = document.getElementById('phoneRegisterForm');

        // Hide forms
        phoneLoginForm.style.display = 'none';
        phoneRegisterForm.style.display = 'none';
        
        // Show OTP section
        otpSection.style.display = 'block';
        sentToNumber.textContent = this.formatPhoneDisplay(phoneNumber);
        
        // Focus first OTP input
        setTimeout(() => {
            document.querySelector('.otp-digit').focus();
        }, 300);
        
        // Add animation
        otpSection.classList.add('slide-up');
    }

    hideOTPSection() {
        const otpSection = document.getElementById('otpSection');
        const phoneLoginForm = document.getElementById('phoneLoginForm');
        const phoneRegisterForm = document.getElementById('phoneRegisterForm');
        
        otpSection.style.display = 'none';
        
        // Show appropriate form based on current mode
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn.classList.contains('active')) {
            phoneLoginForm.style.display = 'block';
        } else {
            phoneRegisterForm.style.display = 'block';
        }
        
        // Clear OTP inputs and timer
        this.clearOTPInputs();
        if (this.otpTimer) {
            clearInterval(this.otpTimer);
        }
    }

    setupOTPInputs() {
        const otpInputs = document.querySelectorAll('.otp-digit');
        
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                
                if (value && /^[0-9]$/.test(value)) {
                    e.target.classList.add('filled');
                    
                    // Move to next input
                    if (index < otpInputs.length - 1) {
                        otpInputs[index + 1].focus();
                    }
                    
                    // Check if all inputs are filled
                    const allFilled = Array.from(otpInputs).every(inp => inp.value);
                    if (allFilled) {
                        // Auto-submit after short delay
                        setTimeout(() => {
                            document.getElementById('otpForm').dispatchEvent(new Event('submit'));
                        }, 500);
                    }
                } else {
                    e.target.classList.remove('filled');
                    e.target.value = '';
                }
            });
            
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });
            
            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pastedData = e.clipboardData.getData('text').slice(0, 6);
                
                if (/^[0-9]+$/.test(pastedData)) {
                    pastedData.split('').forEach((digit, idx) => {
                        if (idx < otpInputs.length) {
                            otpInputs[idx].value = digit;
                            otpInputs[idx].classList.add('filled');
                        }
                    });
                    
                    // Focus last filled input
                    const lastIndex = Math.min(pastedData.length - 1, otpInputs.length - 1);
                    otpInputs[lastIndex].focus();
                }
            });
        });
    }

    startOTPTimer() {
        this.otpCountdown = 60;
        const timerElement = document.getElementById('timer');
        const resendBtn = document.getElementById('resendBtn');
        
        resendBtn.disabled = true;
        
        this.otpTimer = setInterval(() => {
            this.otpCountdown--;
            timerElement.innerHTML = `إعادة الإرسال خلال: <strong>${this.otpCountdown}</strong> ثانية`;
            
            if (this.otpCountdown <= 0) {
                clearInterval(this.otpTimer);
                timerElement.innerHTML = 'يمكنك الآن إعادة إرسال الكود';
                resendBtn.disabled = false;
            }
        }, 1000);
    }

    async resendOTP() {
        const resendBtn = document.getElementById('resendBtn');
        resendBtn.disabled = true;
        resendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
        
        try {
            await this.simulateDelay(2000);
            
            // Generate new OTP
            this.currentOTP = this.generateOTP();
            console.log('New OTP:', this.currentOTP); // For testing
            
            // Restart timer
            this.startOTPTimer();
            
            resendBtn.innerHTML = '<i class="fas fa-redo"></i> إعادة إرسال الكود';
            this.showSuccess('تم إرسال كود جديد');
            
        } catch (error) {
            resendBtn.innerHTML = '<i class="fas fa-redo"></i> إعادة إرسال الكود';
            this.showError('فشل في إرسال الكود. يرجى المحاولة مرة أخرى');
        }
    }

    clearOTPInputs() {
        const otpInputs = document.querySelectorAll('.otp-digit');
        otpInputs.forEach(input => {
            input.value = '';
            input.classList.remove('filled');
        });
    }

    shakeOTPInputs() {
        const otpInputs = document.querySelector('.otp-inputs');
        otpInputs.classList.add('error-shake');
        setTimeout(() => {
            otpInputs.classList.remove('error-shake');
        }, 600);
    }

    setupPasswordStrength() {
        const passwordInput = document.getElementById('passwordRegister');
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                this.checkPasswordStrength(e.target.value);
            });
        }
    }

    checkPasswordStrength(password) {
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        
        if (!strengthFill || !strengthText) return;
        
        let strength = 0;
        let strengthLabel = 'ضعيفة';
        
        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // Character variety checks
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        // Set strength level
        strengthFill.classList.remove('weak', 'fair', 'good', 'strong');
        strengthText.classList.remove('weak', 'fair', 'good', 'strong');
        
        if (strength <= 2) {
            strengthFill.classList.add('weak');
            strengthText.classList.add('weak');
            strengthLabel = 'ضعيفة';
        } else if (strength <= 3) {
            strengthFill.classList.add('fair');
            strengthText.classList.add('fair');
            strengthLabel = 'متوسطة';
        } else if (strength <= 4) {
            strengthFill.classList.add('good');
            strengthText.classList.add('good');
            strengthLabel = 'جيدة';
        } else {
            strengthFill.classList.add('strong');
            strengthText.classList.add('strong');
            strengthLabel = 'قوية جداً';
        }
        
        strengthText.textContent = strengthLabel;
    }

    validatePasswordMatch() {
        const password = document.getElementById('passwordRegister').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const confirmInput = document.getElementById('confirmPassword');
        
        if (confirmPassword && password !== confirmPassword) {
            confirmInput.style.borderColor = '#ef4444';
            confirmInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        } else if (confirmPassword) {
            confirmInput.style.borderColor = '#16a34a';
            confirmInput.style.boxShadow = '0 0 0 3px rgba(16, 163, 74, 0.1)';
        } else {
            confirmInput.style.borderColor = '#e5e7eb';
            confirmInput.style.boxShadow = 'none';
        }
    }

    validatePhone(input) {
        const phoneNumber = input.value.replace(/[^0-9]/g, '');
        input.value = phoneNumber;
        
        if (phoneNumber && !this.validatePhoneNumber(phoneNumber)) {
            input.style.borderColor = '#ef4444';
            input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        } else if (phoneNumber) {
            input.style.borderColor = '#16a34a';
            input.style.boxShadow = '0 0 0 3px rgba(16, 163, 74, 0.1)';
        } else {
            input.style.borderColor = '#e5e7eb';
            input.style.boxShadow = 'none';
        }
    }

    validateName(input) {
        const name = input.value.trim();
        
        if (name && name.length < 2) {
            input.style.borderColor = '#ef4444';
            input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        } else if (name) {
            input.style.borderColor = '#16a34a';
            input.style.boxShadow = '0 0 0 3px rgba(16, 163, 74, 0.1)';
        } else {
            input.style.borderColor = '#e5e7eb';
            input.style.boxShadow = 'none';
        }
    }

    validateEmail(input) {
        const email = input.value.trim();
        
        if (email && !this.validateEmailFormat(email)) {
            input.style.borderColor = '#ef4444';
            input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        } else if (email) {
            input.style.borderColor = '#16a34a';
            input.style.boxShadow = '0 0 0 3px rgba(16, 163, 74, 0.1)';
        } else {
            input.style.borderColor = '#e5e7eb';
            input.style.boxShadow = 'none';
        }
    }

    validatePhoneNumber(phone) {
        // Basic phone validation - adjust regex as needed
        const phoneRegex = /^[0-9]{9,15}$/;
        return phoneRegex.test(phone);
    }

    validateEmailFormat(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setupGoogleAuth() {
        // Initialize Google Sign-In
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.initialize({
                client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
                callback: this.handleGoogleSignIn.bind(this)
            });
        }
        
        // Manual Google Sign-In button click
        document.getElementById('googleSignInBtn').addEventListener('click', () => {
            this.handleGoogleSignInClick();
        });
    }

    handleGoogleSignInClick() {
        // Simulate Google Sign-In for demo
        this.showLoading('جاري تسجيل الدخول مع Google...');
        
        setTimeout(() => {
            // Simulate successful Google authentication
            const googleUser = {
                id: this.generateUserId(),
                name: 'مستخدم Google',
                phone: null,
                email: 'user@gmail.com',
                avatar: 'https://via.placeholder.com/100x100?text=G',
                joinDate: new Date().toISOString(),
                isVerified: true,
                authProvider: 'google',
                wallet: 0,
                orders: [],
                favorites: [],
                addresses: []
            };
            
            localStorage.setItem('currentUser', JSON.stringify(googleUser));
            this.currentUser = googleUser;
            this.isAuthenticated = true;
            
            this.hideLoading();
            this.showSuccess('تم تسجيل الدخول بنجاح مع Google!');
            
            setTimeout(() => {
                this.showUserProfile();
            }, 1000);
        }, 2000);
    }

    handleGoogleSignIn(response) {
        // Handle actual Google Sign-In response
        const credential = response.credential;
        
        this.showLoading('جاري تسجيل الدخول مع Google...');
        
        // Decode JWT token (in real app, verify on server)
        try {
            const payload = JSON.parse(atob(credential.split('.')[1]));
            
            const googleUser = {
                id: this.generateUserId(),
                name: payload.name,
                phone: null,
                email: payload.email,
                avatar: payload.picture,
                joinDate: new Date().toISOString(),
                isVerified: true,
                authProvider: 'google',
                googleId: payload.sub,
                wallet: 0,
                orders: [],
                favorites: [],
                addresses: []
            };
            
            localStorage.setItem('currentUser', JSON.stringify(googleUser));
            this.currentUser = googleUser;
            this.isAuthenticated = true;
            
            this.hideLoading();
            this.showSuccess('تم تسجيل الدخول بنجاح مع Google!');
            
            setTimeout(() => {
                this.showUserProfile();
            }, 1000);
            
        } catch (error) {
            this.hideLoading();
            this.showError('حدث خطأ في تسجيل الدخول مع Google');
        }
    }

    showUserProfile() {
        const authContainer = document.getElementById('authContainer');
        const userProfile = document.getElementById('userProfile');
        
        // Update profile information
        document.getElementById('userName').textContent = `مرحباً ${this.currentUser.name}!`;
        document.getElementById('userPhone').textContent = this.currentUser.phone || 'غير محدد';
        
        // Update avatar
        if (this.currentUser.avatar) {
            document.getElementById('userAvatar').src = this.currentUser.avatar;
            document.getElementById('userAvatar').style.display = 'block';
            document.getElementById('avatarPlaceholder').style.display = 'none';
        } else {
            document.getElementById('userAvatar').style.display = 'none';
            document.getElementById('avatarPlaceholder').style.display = 'flex';
        }
        
        // Hide auth container and show profile
        authContainer.style.display = 'none';
        userProfile.style.display = 'block';
        userProfile.classList.add('fade-in');
    }

    showAuthContainer() {
        const authContainer = document.getElementById('authContainer');
        const userProfile = document.getElementById('userProfile');
        
        userProfile.style.display = 'none';
        authContainer.style.display = 'block';
        authContainer.classList.add('fade-in');
    }

    startAnimations() {
        // Add touch ripple effect to buttons
        const buttons = document.querySelectorAll('.auth-btn, .social-btn, .toggle-btn');
        buttons.forEach(button => {
            button.classList.add('touch-ripple');
        });
        
        // Add random floating animations
        setInterval(() => {
            const welcomeIcon = document.querySelector('.welcome-icon');
            if (welcomeIcon) {
                welcomeIcon.style.animation = 'none';
                welcomeIcon.offsetHeight; // Trigger reflow
                welcomeIcon.style.animation = 'welcomeIcon 3s ease-in-out infinite';
            }
        }, 5000);
    }

    // Utility functions
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    }

    async hashPassword(password) {
        // Simple hash for demo - use proper hashing in production
        return btoa(password + 'salt123');
    }

    formatPhoneDisplay(phone) {
        // Format phone number for display
        if (phone.startsWith('+20')) {
            return phone.replace('+20', '+20 ') + ' ****';
        }
        return phone.substring(0, 6) + '****';
    }

    simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showLoading(text = 'جاري التحميل...') {
        const overlay = document.getElementById('loadingOverlay');
        const loadingText = document.getElementById('loadingText');
        
        loadingText.textContent = text;
        overlay.style.display = 'flex';
        overlay.classList.add('fade-in');
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.display = 'none';
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

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
            background: ${type === 'success' ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'};
            color: white;
            padding: 15px 20px;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            z-index: 10001;
            transform: translateX(100%);
            transition: all 0.3s ease;
            font-family: 'Cairo', sans-serif;
            max-width: 300px;
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
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Profile menu functions
function editProfile() {
    accountManager.showNotification('سيتم إضافة هذه الميزة قريباً', 'success');
}

function viewOrders() {
    accountManager.showNotification('سيتم إضافة صفحة الطلبات قريباً', 'success');
}

function viewFavorites() {
    // Navigate to favorites (can be implemented)
    window.location.href = 'index.html#favorites';
}

function viewAddresses() {
    accountManager.showNotification('سيتم إضافة إدارة العناوين قريباً', 'success');
}

function viewWallet() {
    accountManager.showNotification('سيتم إضافة المحفظة الإلكترونية قريباً', 'success');
}

function viewNotifications() {
    accountManager.showNotification('سيتم إضافة مركز الإشعارات قريباً', 'success');
}

function contactSupport() {
    // Open WhatsApp or call
    const phoneNumber = '01001470449';
    const message = 'مرحباً، أحتاج مساعدة في حسابي';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function appSettings() {
    accountManager.showNotification('سيتم إضافة إعدادات التطبيق قريباً', 'success');
}

function logout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        localStorage.removeItem('currentUser');
        accountManager.currentUser = null;
        accountManager.isAuthenticated = false;
        accountManager.showAuthContainer();
        accountManager.showSuccess('تم تسجيل الخروج بنجاح');
    }
}

function continueAsGuest() {
    // Navigate back to main app as guest
    window.location.href = 'index.html';
}

function goBack() {
    // Navigate back to main page
    window.location.href = 'index.html';
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.toggle-password');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Global functions for HTML onclick handlers
window.showLogin = () => accountManager.showLogin();
window.showRegister = () => accountManager.showRegister();
window.togglePassword = togglePassword;
window.editProfile = editProfile;
window.viewOrders = viewOrders;
window.viewFavorites = viewFavorites;
window.viewAddresses = viewAddresses;
window.viewWallet = viewWallet;
window.viewNotifications = viewNotifications;
window.contactSupport = contactSupport;
window.appSettings = appSettings;
window.logout = logout;
window.continueAsGuest = continueAsGuest;
window.goBack = goBack;

// Initialize account manager
let accountManager;

document.addEventListener('DOMContentLoaded', () => {
    accountManager = new AccountManager();
    
    // Welcome message
    setTimeout(() => {
        accountManager.showSuccess('مرحباً بكم في صفحة الحساب! 👤');
    }, 1000);
});

// Handle back button and navigation
window.addEventListener('popstate', () => {
    goBack();
});

// Prevent context menu on sensitive elements
document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.otp-digit, .auth-form')) {
        e.preventDefault();
    }
});

// Handle page visibility for security
document.addEventListener('visibilitychange', () => {
    if (document.hidden && accountManager.otpTimer) {
        // Pause timer when page is hidden
        clearInterval(accountManager.otpTimer);
    } else if (!document.hidden && accountManager.otpCountdown > 0) {
        // Resume timer when page becomes visible
        accountManager.startOTPTimer();
    }
});

// Auto-logout after inactivity (optional)
let inactivityTimer;
const INACTIVITY_TIME = 30 * 60 * 1000; // 30 minutes

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        if (accountManager.isAuthenticated) {
            logout();
            accountManager.showNotification('تم تسجيل الخروج تلقائياً بسبب عدم النشاط', 'error');
        }
    }, INACTIVITY_TIME);
}

// Reset timer on user activity
['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetInactivityTimer, true);
});

// Initialize timer
resetInactivityTimer();