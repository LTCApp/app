/**
 * Register Handler - Handles all registration operations
 * Supports both phone and email registration
 */

class RegisterHandler {
    constructor() {
        this.currentRegisterMethod = 'phone';
        this.pendingRegistration = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeUI();
        console.log('📝 معالج التسجيل جاهز');
    }

    setupEventListeners() {
        // Form submissions
        const phoneRegisterForm = document.getElementById('phoneRegisterForm');
        const emailRegisterForm = document.getElementById('emailRegisterForm');
        const otpRegisterVerifyForm = document.getElementById('otpRegisterVerifyForm');
        
        if (phoneRegisterForm) {
            phoneRegisterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePhoneRegistration();
            });
        }
        
        if (emailRegisterForm) {
            emailRegisterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleEmailRegistration();
            });
        }
        
        if (otpRegisterVerifyForm) {
            otpRegisterVerifyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegisterOTPVerification();
            });
        }
        
        // Resend OTP button
        const resendRegisterBtn = document.getElementById('resendRegisterBtn');
        if (resendRegisterBtn) {
            resendRegisterBtn.addEventListener('click', () => {
                this.resendRegisterOTP();
            });
        }
        
        // Real-time validation
        this.setupRealTimeValidation();
    }

    setupRealTimeValidation() {
        // Phone number validation
        const phoneInputs = ['phoneRegisterNumber', 'emailRegisterPhone'];
        phoneInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('blur', () => {
                    this.checkDuplicatePhone(input);
                });
            }
        });
        
        // Email validation
        const emailInputs = ['phoneRegisterEmail', 'emailRegisterAddress'];
        emailInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('blur', () => {
                    this.checkDuplicateEmail(input);
                });
            }
        });
    }

    initializeUI() {
        // Set default active method
        this.switchRegisterMethod('phone');
    }

    switchRegisterMethod(method) {
        this.currentRegisterMethod = method;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.method === method);
        });
        
        // Show/hide forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.toggle('active', 
                (method === 'phone' && form.id === 'phoneRegisterForm') ||
                (method === 'email' && form.id === 'emailRegisterForm')
            );
        });
        
        // Reset forms
        this.resetForms();
        
        console.log(`🔄 تم التبديل إلى التسجيل بـ ${method === 'phone' ? 'الموبايل' : 'الإيميل'}`);
    }

    async checkDuplicatePhone(input) {
        const phone = input.value.trim();
        if (phone.length < 8) return;
        
        const countryCodeId = input.id.includes('phone') ? 'phoneCountryCode' : 'emailCountryCode';
        const countryCode = document.getElementById(countryCodeId)?.value || '+20';
        const fullPhone = countryCode + phone;
        
        const existingUser = authSystem.findUser(fullPhone, 'phone');
        
        if (existingUser) {
            authSystem.updateInputValidation(input, false, 'رقم الموبايل مسجل بالفعل');
            authSystem.showToast('رقم الموبايل مسجل بالفعل. يمكنك تسجيل الدخول', 'warning');
        } else {
            authSystem.updateInputValidation(input, true, '');
        }
    }

    async checkDuplicateEmail(input) {
        const email = input.value.trim();
        if (!email || !authSystem.validateEmail(input)) return;
        
        const existingUser = authSystem.findUser(email, 'email');
        
        if (existingUser) {
            authSystem.updateInputValidation(input, false, 'البريد الإلكتروني مسجل بالفعل');
            authSystem.showToast('البريد الإلكتروني مسجل بالفعل. يمكنك تسجيل الدخول', 'warning');
        } else {
            authSystem.updateInputValidation(input, true, '');
        }
    }

    async handlePhoneRegistration() {
        try {
            // Get form data
            const formData = this.getPhoneRegistrationData();
            
            // Validate form
            if (!this.validatePhoneRegistrationData(formData)) {
                return;
            }
            
            this.toggleSubmitLoading(true, 'phone');
            
            // Check for duplicates
            const duplicateCheck = await this.checkDuplicateRegistration(formData);
            if (!duplicateCheck.success) {
                this.toggleSubmitLoading(false, 'phone');
                authSystem.showToast(duplicateCheck.message, 'error');
                return;
            }
            
            // Send OTP
            await this.sendRegistrationOTP(formData);
            this.toggleSubmitLoading(false, 'phone');
            
        } catch (error) {
            this.toggleSubmitLoading(false, 'phone');
            authSystem.handleError(error, 'التسجيل بالموبايل');
        }
    }

    async handleEmailRegistration() {
        try {
            // Get form data
            const formData = this.getEmailRegistrationData();
            
            // Validate form
            if (!this.validateEmailRegistrationData(formData)) {
                return;
            }
            
            this.toggleSubmitLoading(true, 'email');
            
            // Check for duplicates
            const duplicateCheck = await this.checkDuplicateRegistration(formData);
            if (!duplicateCheck.success) {
                this.toggleSubmitLoading(false, 'email');
                authSystem.showToast(duplicateCheck.message, 'error');
                return;
            }
            
            // Create account immediately for email registration
            const hashedPassword = await authSystem.hashPassword(formData.password);
            
            const userData = {
                id: authSystem.generateUserId(),
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone || null,
                password: hashedPassword,
                avatar: null,
                joinDate: new Date().toISOString(),
                isVerified: true, // Auto-verify for email registration
                accountType: 'email',
                wallet: 0,
                orders: [],
                favorites: [],
                addresses: []
            };
            
            // Simulate account creation delay
            await authSystem.simulateDelay(2000);
            
            await authSystem.saveUser(userData);
            
            this.toggleSubmitLoading(false, 'email');
            
            authSystem.showToast('تم إنشاء الحساب بنجاح! 🎉', 'success');
            
            // Auto login
            setTimeout(() => {
                authSystem.login(userData);
            }, 1500);
            
        } catch (error) {
            this.toggleSubmitLoading(false, 'email');
            authSystem.handleError(error, 'التسجيل بالإيميل');
        }
    }

    getPhoneRegistrationData() {
        return {
            fullName: document.getElementById('phoneFullName').value.trim(),
            phone: document.getElementById('phoneCountryCode').value + 
                   document.getElementById('phoneRegisterNumber').value.trim(),
            email: document.getElementById('phoneRegisterEmail').value.trim() || null,
            password: document.getElementById('phoneRegisterPassword').value,
            confirmPassword: document.getElementById('phoneConfirmPassword').value,
            acceptTerms: document.getElementById('phoneAcceptTerms').checked,
            method: 'phone'
        };
    }

    getEmailRegistrationData() {
        const phone = document.getElementById('emailRegisterPhone').value.trim();
        const countryCode = document.getElementById('emailCountryCode').value;
        
        return {
            fullName: document.getElementById('emailFullName').value.trim(),
            email: document.getElementById('emailRegisterAddress').value.trim(),
            phone: phone ? countryCode + phone : null,
            password: document.getElementById('emailRegisterPassword').value,
            confirmPassword: document.getElementById('emailConfirmPassword').value,
            acceptTerms: document.getElementById('emailAcceptTerms').checked,
            method: 'email'
        };
    }

    validatePhoneRegistrationData(data) {
        if (!data.fullName) {
            authSystem.showToast('يرجى إدخال الاسم الكامل', 'error');
            return false;
        }
        
        if (data.fullName.length < 3) {
            authSystem.showToast('الاسم يجب أن يكون 3 أحرف على الأقل', 'error');
            return false;
        }
        
        if (!data.phone || data.phone.length < 11) {
            authSystem.showToast('رقم الموبايل غير صحيح', 'error');
            return false;
        }
        
        if (data.email && !authSystem.validateEmail({value: data.email})) {
            authSystem.showToast('البريد الإلكتروني غير صحيح', 'error');
            return false;
        }
        
        if (!data.password || data.password.length < 6) {
            authSystem.showToast('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return false;
        }
        
        if (data.password !== data.confirmPassword) {
            authSystem.showToast('كلمات المرور غير متطابقة', 'error');
            return false;
        }
        
        if (!data.acceptTerms) {
            authSystem.showToast('يجب الموافقة على الشروط والأحكام', 'error');
            return false;
        }
        
        return true;
    }

    validateEmailRegistrationData(data) {
        if (!data.fullName) {
            authSystem.showToast('يرجى إدخال الاسم الكامل', 'error');
            return false;
        }
        
        if (data.fullName.length < 3) {
            authSystem.showToast('الاسم يجب أن يكون 3 أحرف على الأقل', 'error');
            return false;
        }
        
        if (!data.email || !authSystem.validateEmail({value: data.email})) {
            authSystem.showToast('البريد الإلكتروني غير صحيح', 'error');
            return false;
        }
        
        if (data.phone && data.phone.length < 11) {
            authSystem.showToast('رقم الموبايل غير صحيح', 'error');
            return false;
        }
        
        if (!data.password || data.password.length < 6) {
            authSystem.showToast('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return false;
        }
        
        if (data.password !== data.confirmPassword) {
            authSystem.showToast('كلمات المرور غير متطابقة', 'error');
            return false;
        }
        
        if (!data.acceptTerms) {
            authSystem.showToast('يجب الموافقة على الشروط والأحكام', 'error');
            return false;
        }
        
        return true;
    }

    async checkDuplicateRegistration(data) {
        // Check phone
        if (data.phone) {
            const existingPhoneUser = authSystem.findUser(data.phone, 'phone');
            if (existingPhoneUser) {
                return {
                    success: false,
                    message: 'رقم الموبايل مسجل بالفعل'
                };
            }
        }
        
        // Check email
        if (data.email) {
            const existingEmailUser = authSystem.findUser(data.email, 'email');
            if (existingEmailUser) {
                return {
                    success: false,
                    message: 'البريد الإلكتروني مسجل بالفعل'
                };
            }
        }
        
        return { success: true };
    }

    async sendRegistrationOTP(formData) {
        try {
            authSystem.showLoading('جاري إرسال كود التحقق...');
            
            // Generate and "send" OTP
            authSystem.currentOTP = authSystem.generateOTP();
            
            // Store registration data
            this.pendingRegistration = {
                ...formData,
                timestamp: Date.now()
            };
            
            // Simulate SMS sending delay
            await authSystem.simulateDelay(2000);
            
            authSystem.hideLoading();
            
            // Show OTP in console for testing
            authSystem.showOTPInConsole(authSystem.currentOTP, formData.phone);
            
            // Show OTP section
            this.showRegisterOTPSection(formData.phone);
            
            authSystem.showToast('تم إرسال كود التحقق بنجاح!', 'success');
            
        } catch (error) {
            authSystem.hideLoading();
            authSystem.handleError(error, 'إرسال كود التحقق');
        }
    }

    async handleRegisterOTPVerification() {
        try {
            const otpInputs = document.querySelectorAll('.otp-digit-register');
            const enteredOTP = Array.from(otpInputs).map(input => input.value).join('');
            
            if (enteredOTP.length !== 6) {
                authSystem.showToast('يرجى إدخال كود التحقق كاملاً', 'error');
                this.shakeOTPInputs(otpInputs);
                return;
            }
            
            if (enteredOTP !== authSystem.currentOTP) {
                authSystem.showToast('كود التحقق غير صحيح', 'error');
                this.shakeOTPInputs(otpInputs);
                this.clearOTPInputs(otpInputs);
                return;
            }
            
            authSystem.showLoading('جاري إنشاء الحساب...');
            
            // Simulate account creation delay
            await authSystem.simulateDelay(2000);
            
            // Create user account
            const hashedPassword = await authSystem.hashPassword(this.pendingRegistration.password);
            
            const userData = {
                id: authSystem.generateUserId(),
                name: this.pendingRegistration.fullName,
                phone: this.pendingRegistration.phone,
                email: this.pendingRegistration.email,
                password: hashedPassword,
                avatar: null,
                joinDate: new Date().toISOString(),
                isVerified: true,
                accountType: 'phone',
                wallet: 0,
                orders: [],
                favorites: [],
                addresses: []
            };
            
            await authSystem.saveUser(userData);
            
            authSystem.hideLoading();
            
            authSystem.showToast('تم إنشاء الحساب بنجاح! 🎉', 'success');
            
            // Clear pending registration
            this.pendingRegistration = null;
            
            // Auto login
            setTimeout(() => {
                authSystem.login(userData);
            }, 1500);
            
        } catch (error) {
            authSystem.hideLoading();
            authSystem.handleError(error, 'التحقق من الكود');
        }
    }

    showRegisterOTPSection(phone) {
        // Hide forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.style.display = 'none';
        });
        
        // Show OTP section
        const otpSection = document.getElementById('otpRegisterSection');
        otpSection.style.display = 'block';
        
        // Update phone display
        const sentToNumber = document.getElementById('sentToRegisterNumber');
        sentToNumber.textContent = authSystem.formatPhoneForDisplay(phone);
        
        // Start timer
        const countdown = document.getElementById('countdownRegister');
        const resendBtn = document.getElementById('resendRegisterBtn');
        authSystem.startOTPTimer(countdown, resendBtn);
        
        // Focus first OTP input
        setTimeout(() => {
            document.querySelector('.otp-digit-register').focus();
        }, 100);
    }

    async resendRegisterOTP() {
        if (!this.pendingRegistration) {
            authSystem.showToast('لا يوجد طلب تسجيل نشط', 'error');
            return;
        }
        
        try {
            const resendBtn = document.getElementById('resendRegisterBtn');
            resendBtn.disabled = true;
            resendBtn.textContent = 'جاري الإرسال...';
            
            // Generate new OTP
            authSystem.currentOTP = authSystem.generateOTP();
            
            // Simulate sending delay
            await authSystem.simulateDelay(1500);
            
            // Show new OTP
            authSystem.showOTPInConsole(authSystem.currentOTP, this.pendingRegistration.phone);
            
            // Reset timer
            const countdown = document.getElementById('countdownRegister');
            authSystem.clearOTPTimer();
            authSystem.startOTPTimer(countdown, resendBtn);
            
            authSystem.showToast('تم إعادة إرسال كود التحقق', 'success');
            
        } catch (error) {
            authSystem.handleError(error, 'إعادة إرسال الكود');
        }
    }

    backFromRegisterOTP() {
        // Clear timer
        authSystem.clearOTPTimer();
        
        // Hide OTP section
        document.getElementById('otpRegisterSection').style.display = 'none';
        
        // Show appropriate form
        const formId = this.currentRegisterMethod === 'phone' ? 'phoneRegisterForm' : 'emailRegisterForm';
        document.getElementById(formId).style.display = 'block';
        
        // Clear pending registration
        this.pendingRegistration = null;
        
        // Clear OTP inputs
        this.clearOTPInputs(document.querySelectorAll('.otp-digit-register'));
    }

    shakeOTPInputs(inputs) {
        inputs.forEach(input => {
            input.classList.add('error');
            setTimeout(() => input.classList.remove('error'), 500);
        });
    }

    clearOTPInputs(inputs) {
        inputs.forEach(input => {
            input.value = '';
            input.classList.remove('filled');
        });
    }

    toggleSubmitLoading(isLoading, method) {
        const btn = document.querySelector('.register-btn');
        const loader = btn.querySelector('.btn-loader');
        const span = btn.querySelector('span');
        const icon = btn.querySelector('i');
        
        if (isLoading) {
            btn.disabled = true;
            btn.classList.add('loading');
            loader.style.display = 'block';
            span.style.opacity = '0';
            icon.style.opacity = '0';
        } else {
            btn.disabled = false;
            btn.classList.remove('loading');
            loader.style.display = 'none';
            span.style.opacity = '1';
            icon.style.opacity = '1';
        }
    }

    resetForms() {
        // Clear all form inputs
        document.querySelectorAll('input').forEach(input => {
            if (input.type !== 'checkbox') {
                input.value = '';
                input.style.borderColor = '';
            } else {
                input.checked = false;
            }
        });
        
        // Clear error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.remove();
        });
        
        // Reset password strength indicators
        document.querySelectorAll('.strength-fill').forEach(fill => {
            fill.className = 'strength-fill';
        });
        
        document.querySelectorAll('.strength-text').forEach(text => {
            text.textContent = 'ضعيفة';
            text.className = 'strength-text';
        });
    }
}

// Global functions for register page
function switchRegisterMethod(method) {
    if (window.registerHandler) {
        window.registerHandler.switchRegisterMethod(method);
    }
}

function backFromRegisterOTP() {
    if (window.registerHandler) {
        window.registerHandler.backFromRegisterOTP();
    }
}

// Initialize register handler when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.registerHandler = new RegisterHandler();
});