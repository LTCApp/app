/**
 * Login Handler - Handles all login operations
 * Supports both phone and email authentication
 */

class LoginHandler {
    constructor() {
        this.currentLoginMethod = 'phone';
        this.pendingVerification = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeUI();
        console.log('🔑 معالج تسجيل الدخول جاهز');
    }

    setupEventListeners() {
        // Form submissions
        const phoneLoginForm = document.getElementById('phoneLoginForm');
        const otpVerifyForm = document.getElementById('otpVerifyForm');
        
        if (phoneLoginForm) {
            phoneLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePhoneLogin();
            });
        }
        
        if (otpVerifyForm) {
            otpVerifyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleOTPVerification();
            });
        }
        
        // Resend OTP button
        const resendBtn = document.getElementById('resendBtn');
        if (resendBtn) {
            resendBtn.addEventListener('click', () => {
                this.resendOTP();
            });
        }
        
        // Phone number input for existing user detection
        const phoneInput = document.getElementById('phoneNumber');
        if (phoneInput) {
            phoneInput.addEventListener('blur', () => {
                this.checkExistingUser();
            });
        }
    }

    initializeUI() {
        // Set default active method
        this.switchLoginMethod('phone');
    }

    switchLoginMethod(method) {
        this.currentLoginMethod = 'phone'; // فقط رقم الموبايل مدعوم الآن
        
        // تأكد من أن نموذج الموبايل نشط
        const phoneForm = document.getElementById('phoneLoginForm');
        if (phoneForm) {
            phoneForm.classList.add('active');
        }
        
        // Reset forms
        this.resetForms();
        
        console.log('🔄 تم تعيين تسجيل الدخول بالموبايل فقط');
    }

    async checkExistingUser() {
        const phoneInput = document.getElementById('phoneNumber');
        const countryCode = document.getElementById('countryCode').value;
        const phoneNumber = phoneInput.value.trim();
        
        if (phoneNumber.length < 8) return;
        
        const fullPhone = countryCode + phoneNumber;
        const existingUser = authSystem.findUser(fullPhone, 'phone');
        
        const passwordGroup = document.getElementById('phonePasswordGroup');
        const phoneOptions = document.getElementById('phoneOptions');
        const submitBtn = document.querySelector('.phone-submit span');
        
        if (existingUser) {
            // Show password field for existing user
            passwordGroup.style.display = 'block';
            phoneOptions.style.display = 'flex';
            submitBtn.textContent = 'تسجيل الدخول';
            
            authSystem.showToast('تم العثور على حسابك! أدخل كلمة المرور', 'info');
        } else {
            // Hide password field for new user
            passwordGroup.style.display = 'none';
            phoneOptions.style.display = 'none';
            submitBtn.textContent = 'إرسال كود التحقق';
        }
    }

    async handlePhoneLogin() {
        try {
            const countryCode = document.getElementById('countryCode').value;
            const phoneNumber = document.getElementById('phoneNumber').value.trim();
            const password = document.getElementById('phonePassword').value;
            
            if (!phoneNumber) {
                authSystem.showToast('يرجى إدخال رقم الموبايل', 'error');
                return;
            }
            
            if (!authSystem.validatePhoneNumber(document.getElementById('phoneNumber'))) {
                authSystem.showToast('رقم الموبايل غير صحيح', 'error');
                return;
            }
            
            const fullPhone = countryCode + phoneNumber;
            const existingUser = authSystem.findUser(fullPhone, 'phone');
            
            this.toggleSubmitLoading(true, 'phone');
            
            if (existingUser && password) {
                // Verify password
                await authSystem.simulateDelay(1500);
                
                const user = await authSystem.verifyCredentials(fullPhone, password, 'phone');
                
                if (user) {
                    this.toggleSubmitLoading(false, 'phone');
                    authSystem.showToast('تم التحقق من كلمة المرور بنجاح!', 'success');
                    
                    // Remember user if checkbox is checked
                    const rememberMe = document.getElementById('rememberPhone').checked;
                    if (rememberMe) {
                        localStorage.setItem('rememberedPhone', fullPhone);
                    }
                    
                    // Login immediately
                    authSystem.login(user);
                } else {
                    this.toggleSubmitLoading(false, 'phone');
                    authSystem.showToast('كلمة المرور غير صحيحة', 'error');
                }
            } else {
                // Send OTP for verification
                await this.sendPhoneOTP(fullPhone, existingUser);
                this.toggleSubmitLoading(false, 'phone');
            }
            
        } catch (error) {
            this.toggleSubmitLoading(false, 'phone');
            authSystem.handleError(error, 'تسجيل الدخول بالموبايل');
        }
    }



    async sendPhoneOTP(phone, existingUser = null) {
        try {
            authSystem.showLoading('جاري إرسال كود التحقق...');
            
            // Generate and "send" OTP
            authSystem.currentOTP = authSystem.generateOTP();
            
            // Store verification data
            this.pendingVerification = {
                phone: phone,
                type: 'login',
                timestamp: Date.now(),
                existingUser: existingUser
            };
            
            // Simulate SMS sending delay
            await authSystem.simulateDelay(2000);
            
            authSystem.hideLoading();
            
            // Show OTP in console for testing
            authSystem.showOTPInConsole(authSystem.currentOTP, phone);
            
            // Show OTP section
            this.showOTPSection(phone);
            
            authSystem.showToast('تم إرسال كود التحقق بنجاح!', 'success');
            
        } catch (error) {
            authSystem.hideLoading();
            authSystem.handleError(error, 'إرسال كود التحقق');
        }
    }

    async handleOTPVerification() {
        try {
            const otpInputs = document.querySelectorAll('.otp-digit');
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
            
            authSystem.showLoading('جاري التحقق من الكود...');
            
            // Simulate verification delay
            await authSystem.simulateDelay(1500);
            
            if (this.pendingVerification.existingUser) {
                // Login existing user
                authSystem.hideLoading();
                authSystem.login(this.pendingVerification.existingUser);
            } else {
                // Create new user account
                const newUser = await this.createQuickAccount();
                authSystem.hideLoading();
                authSystem.login(newUser);
            }
            
        } catch (error) {
            authSystem.hideLoading();
            authSystem.handleError(error, 'التحقق من الكود');
        }
    }

    async createQuickAccount() {
        const userData = {
            id: authSystem.generateUserId(),
            name: 'مستخدم جديد',
            phone: this.pendingVerification.phone,
            email: null,
            password: null, // No password for quick account
            avatar: null,
            joinDate: new Date().toISOString(),
            isVerified: true,
            accountType: 'phone_quick',
            wallet: 0,
            orders: [],
            favorites: [],
            addresses: []
        };
        
        await authSystem.saveUser(userData);
        return userData;
    }

    showOTPSection(phone) {
        // Hide forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.style.display = 'none';
        });
        
        // Show OTP section
        const otpSection = document.getElementById('otpSection');
        otpSection.style.display = 'block';
        
        // Update phone display
        const sentToNumber = document.getElementById('sentToNumber');
        sentToNumber.textContent = authSystem.formatPhoneForDisplay(phone);
        
        // Start timer
        const countdown = document.getElementById('countdown');
        const resendBtn = document.getElementById('resendBtn');
        authSystem.startOTPTimer(countdown, resendBtn);
        
        // Focus first OTP input
        setTimeout(() => {
            document.querySelector('.otp-digit').focus();
        }, 100);
    }

    async resendOTP() {
        if (!this.pendingVerification) {
            authSystem.showToast('لا يوجد طلب تحقق نشط', 'error');
            return;
        }
        
        try {
            const resendBtn = document.getElementById('resendBtn');
            resendBtn.disabled = true;
            resendBtn.textContent = 'جاري الإرسال...';
            
            // Generate new OTP
            authSystem.currentOTP = authSystem.generateOTP();
            
            // Simulate sending delay
            await authSystem.simulateDelay(1500);
            
            // Show new OTP
            authSystem.showOTPInConsole(authSystem.currentOTP, this.pendingVerification.phone);
            
            // Reset timer
            const countdown = document.getElementById('countdown');
            authSystem.clearOTPTimer();
            authSystem.startOTPTimer(countdown, resendBtn);
            
            authSystem.showToast('تم إعادة إرسال كود التحقق', 'success');
            
        } catch (error) {
            authSystem.handleError(error, 'إعادة إرسال الكود');
        }
    }

    backFromOTP() {
        // Clear timer
        authSystem.clearOTPTimer();
        
        // Hide OTP section
        document.getElementById('otpSection').style.display = 'none';
        
        // Show appropriate form
        const formId = this.currentLoginMethod === 'phone' ? 'phoneLoginForm' : 'emailLoginForm';
        document.getElementById(formId).style.display = 'block';
        
        // Clear pending verification
        this.pendingVerification = null;
        
        // Clear OTP inputs
        this.clearOTPInputs(document.querySelectorAll('.otp-digit'));
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

    toggleSubmitLoading(isLoading, method = 'phone') {
        const btn = document.querySelector('.phone-submit'); // فقط زر الموبايل
        if (!btn) return;
        
        const loader = btn.querySelector('.btn-loader');
        const span = btn.querySelector('span');
        const icon = btn.querySelector('i');
        
        if (isLoading) {
            btn.disabled = true;
            btn.classList.add('loading');
            if (loader) loader.style.display = 'block';
            if (span) span.style.opacity = '0';
            if (icon) icon.style.opacity = '0';
        } else {
            btn.disabled = false;
            btn.classList.remove('loading');
            if (loader) loader.style.display = 'none';
            if (span) span.style.opacity = '1';
            if (icon) icon.style.opacity = '1';
        }
    }

    resetForms() {
        // Clear all form inputs
        document.querySelectorAll('input').forEach(input => {
            if (input.type !== 'checkbox') {
                input.value = '';
                input.style.borderColor = '';
            }
        });
        
        // Clear error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.remove();
        });
        
        // Hide password sections
        const passwordGroup = document.getElementById('phonePasswordGroup');
        const phoneOptions = document.getElementById('phoneOptions');
        if (passwordGroup) passwordGroup.style.display = 'none';
        if (phoneOptions) phoneOptions.style.display = 'none';
        
        // Reset submit button text
        const phoneSubmitBtn = document.querySelector('.phone-submit span');
        if (phoneSubmitBtn) phoneSubmitBtn.textContent = 'إرسال كود التحقق';
    }
}

// Global functions for login page
function switchLoginMethod(method) {
    if (window.loginHandler) {
        window.loginHandler.switchLoginMethod(method);
    }
}

function backFromOTP() {
    if (window.loginHandler) {
        window.loginHandler.backFromOTP();
    }
}

// Initialize login handler when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.loginHandler = new LoginHandler();
});

// Auto-fill remembered credentials
window.addEventListener('load', () => {
    const rememberedPhone = localStorage.getItem('rememberedPhone');
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    
    if (rememberedPhone) {
        const phoneInput = document.getElementById('phoneNumber');
        if (phoneInput && rememberedPhone.length > 3) {
            const countryCode = rememberedPhone.substring(0, 3);
            const phoneNumber = rememberedPhone.substring(3);
            
            document.getElementById('countryCode').value = countryCode;
            phoneInput.value = phoneNumber;
            document.getElementById('rememberPhone').checked = true;
        }
    }
    
    if (rememberedEmail) {
        const emailInput = document.getElementById('emailAddress');
        if (emailInput) {
            emailInput.value = rememberedEmail;
            document.getElementById('rememberEmail').checked = true;
        }
    }
});