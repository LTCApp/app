/**
 * Advanced Authentication System
 * Complete system for login, registration, and user management
 * Supports both phone and email authentication
 */

class AuthSystem {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentOTP = null;
        this.otpTimer = null;
        this.otpCountdown = 60;
        this.isLoading = false;
        
        // Initialize system
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeValidation();
        console.log('🔐 نظام المصادقة تم تحميله بنجاح');
    }

    setupEventListeners() {
        // Password visibility toggle
        this.setupPasswordToggles();
        // Real-time validation
        this.setupRealTimeValidation();
        // OTP input handlers
        this.setupOTPInputs();
    }

    setupPasswordToggles() {
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const input = btn.parentElement.querySelector('input');
                const icon = btn.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }

    setupRealTimeValidation() {
        // Phone number validation
        document.querySelectorAll('.phone-input').forEach(input => {
            input.addEventListener('input', (e) => {
                this.validatePhoneNumber(e.target);
            });
        });

        // Email validation
        document.querySelectorAll('input[type="email"]').forEach(input => {
            input.addEventListener('input', (e) => {
                this.validateEmail(e.target);
            });
        });

        // Password strength
        document.querySelectorAll('input[type="password"]').forEach(input => {
            if (input.id.includes('Password') && !input.id.includes('Confirm')) {
                input.addEventListener('input', (e) => {
                    this.checkPasswordStrength(e.target);
                });
            }
        });

        // Password confirmation
        document.querySelectorAll('input[type="password"]').forEach(input => {
            if (input.id.includes('Confirm')) {
                input.addEventListener('input', (e) => {
                    this.validatePasswordMatch(e.target);
                });
            }
        });
    }

    setupOTPInputs() {
        const setupOTPGroup = (selector) => {
            const inputs = document.querySelectorAll(selector);
            inputs.forEach((input, index) => {
                input.addEventListener('input', (e) => {
                    const value = e.target.value;
                    
                    // Only allow numbers
                    if (!/^[0-9]$/.test(value)) {
                        e.target.value = '';
                        return;
                    }
                    
                    // Auto-focus next input
                    if (value && index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    }
                    
                    // Update visual state
                    e.target.classList.toggle('filled', value !== '');
                    
                    // Check if all filled
                    const allFilled = Array.from(inputs).every(inp => inp.value !== '');
                    if (allFilled) {
                        this.highlightOTPComplete(inputs);
                    }
                });
                
                input.addEventListener('keydown', (e) => {
                    // Handle backspace
                    if (e.key === 'Backspace' && !e.target.value && index > 0) {
                        inputs[index - 1].focus();
                        inputs[index - 1].value = '';
                    }
                });
                
                input.addEventListener('paste', (e) => {
                    e.preventDefault();
                    const paste = e.clipboardData.getData('text');
                    const numbers = paste.replace(/\D/g, '').slice(0, 6);
                    
                    numbers.split('').forEach((num, i) => {
                        if (inputs[i]) {
                            inputs[i].value = num;
                            inputs[i].classList.add('filled');
                        }
                    });
                    
                    if (numbers.length === 6) {
                        this.highlightOTPComplete(inputs);
                    }
                });
            });
        };
        
        setupOTPGroup('.otp-digit');
        setupOTPGroup('.otp-digit-register');
    }

    highlightOTPComplete(inputs) {
        inputs.forEach(input => {
            input.style.borderColor = '#00C851';
            input.style.background = 'rgba(0, 200, 81, 0.05)';
        });
        
        setTimeout(() => {
            inputs.forEach(input => {
                input.style.borderColor = '';
                input.style.background = '';
            });
        }, 1000);
    }

    // Validation Methods
    validatePhoneNumber(input) {
        const phone = input.value.replace(/\D/g, '');
        const isValid = phone.length >= 8 && phone.length <= 15;
        
        this.updateInputValidation(input, isValid, isValid ? '' : 'رقم الموبايل غير صحيح');
        return isValid;
    }

    validateEmail(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(input.value) || input.value === '';
        
        this.updateInputValidation(input, isValid, isValid ? '' : 'البريد الإلكتروني غير صحيح');
        return isValid;
    }

    checkPasswordStrength(input) {
        const password = input.value;
        const strengthIndicators = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        const strength = Object.values(strengthIndicators).filter(Boolean).length;
        let strengthLevel, strengthText, strengthColor;
        
        if (strength < 2) {
            strengthLevel = 'weak';
            strengthText = 'ضعيفة';
            strengthColor = '#ff4444';
        } else if (strength < 4) {
            strengthLevel = 'medium';
            strengthText = 'متوسطة';
            strengthColor = '#ffbb33';
        } else {
            strengthLevel = 'strong';
            strengthText = 'قوية';
            strengthColor = '#00C851';
        }
        
        // Update UI
        const strengthFill = document.getElementById(input.id.replace('Password', 'StrengthFill'));
        const strengthTextEl = document.getElementById(input.id.replace('Password', 'StrengthText'));
        
        if (strengthFill && strengthTextEl) {
            strengthFill.className = `strength-fill ${strengthLevel}`;
            strengthTextEl.className = `strength-text ${strengthLevel}`;
            strengthTextEl.textContent = strengthText;
        }
        
        return strength >= 3;
    }

    validatePasswordMatch(confirmInput) {
        const passwordInput = document.getElementById(confirmInput.id.replace('Confirm', ''));
        const isMatch = passwordInput && passwordInput.value === confirmInput.value;
        
        this.updateInputValidation(confirmInput, isMatch, isMatch ? '' : 'كلمات المرور غير متطابقة');
        return isMatch;
    }

    updateInputValidation(input, isValid, message) {
        input.style.borderColor = isValid ? '#00C851' : '#ff4444';
        
        // Remove existing error message
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        // Add error message if invalid
        if (!isValid && message) {
            const errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            errorEl.style.cssText = 'color: #ff4444; font-size: 12px; margin-top: 5px; display: block;';
            errorEl.textContent = message;
            input.parentElement.appendChild(errorEl);
        }
    }

    // Utility Methods
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async hashPassword(password) {
        // Simple hash for demo (use proper hashing in production)
        return btoa(password + 'salt_key_2024');
    }

    async simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    formatPhoneForDisplay(phone) {
        return phone.replace(/(\+\d{1,3})(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4');
    }

    // OTP Timer Management
    startOTPTimer(countdownElement, resendButton) {
        this.otpCountdown = 60;
        
        this.otpTimer = setInterval(() => {
            this.otpCountdown--;
            countdownElement.textContent = this.otpCountdown;
            
            if (this.otpCountdown <= 0) {
                clearInterval(this.otpTimer);
                resendButton.disabled = false;
                resendButton.textContent = 'إعادة إرسال الكود';
                countdownElement.parentElement.textContent = 'يمكنك الآن إعادة إرسال الكود';
            }
        }, 1000);
    }

    clearOTPTimer() {
        if (this.otpTimer) {
            clearInterval(this.otpTimer);
            this.otpTimer = null;
        }
    }

    // Notification System
    showToast(message, type = 'info', duration = 4000) {
        const toast = document.getElementById('toast');
        const icon = toast.querySelector('.toast-icon');
        const messageEl = toast.querySelector('.toast-message');
        
        // Set content
        messageEl.textContent = message;
        
        // Set type
        toast.className = `toast ${type}`;
        
        // Show toast
        toast.style.display = 'flex';
        
        // Auto hide
        setTimeout(() => {
            toast.style.display = 'none';
        }, duration);
    }

    showLoading(text = 'جاري التحميل...') {
        const overlay = document.getElementById('loadingOverlay');
        const textEl = document.getElementById('loadingText');
        
        if (textEl) textEl.textContent = text;
        overlay.style.display = 'flex';
        this.isLoading = true;
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.display = 'none';
        this.isLoading = false;
    }

    // User Management
    async saveUser(userData) {
        // Save to users array
        const existingIndex = this.users.findIndex(u => 
            u.phone === userData.phone || u.email === userData.email
        );
        
        if (existingIndex !== -1) {
            this.users[existingIndex] = userData;
        } else {
            this.users.push(userData);
        }
        
        localStorage.setItem('users', JSON.stringify(this.users));
        
        // Set current user
        this.currentUser = userData;
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        console.log('✅ تم حفظ بيانات المستخدم');
    }

    findUser(identifier, field = 'phone') {
        return this.users.find(user => user[field] === identifier);
    }

    async verifyCredentials(identifier, password, field = 'phone') {
        const user = this.findUser(identifier, field);
        if (!user) return null;
        
        const hashedPassword = await this.hashPassword(password);
        return user.password === hashedPassword ? user : null;
    }

    // Session Management
    login(userData) {
        this.currentUser = userData;
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Redirect to main page
        this.showToast('تم تسجيل الدخول بنجاح! 🎉', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        
        this.showToast('تم تسجيل الخروج بنجاح', 'info');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Error Handling
    handleError(error, context = '') {
        console.error(`❌ خطأ في ${context}:`, error);
        
        let message = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى';
        
        if (error.message) {
            message = error.message;
        }
        
        this.showToast(message, 'error');
        this.hideLoading();
    }

    // Development Helpers
    showOTPInConsole(otp, phone) {
        console.log(`📱 كود التحقق لـ ${phone}: ${otp}`);
        
        // Show in toast for testing (remove in production)
        this.showToast(`كود التحقق: ${otp}`, 'info', 6000);
    }
}

// Initialize the authentication system
const authSystem = new AuthSystem();

// Global helper functions
function togglePasswordVisibility(inputId) {
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

function showTerms() {
    authSystem.showToast('سيتم إضافة صفحة الشروط والأحكام قريباً', 'info');
}

function showPrivacy() {
    authSystem.showToast('سيتم إضافة صفحة سياسة الخصوصية قريباً', 'info');
}

function showForgotPassword() {
    authSystem.showToast('سيتم إضافة خاصية استرداد كلمة المرور قريباً', 'info');
}

// Social Media Login Placeholders
function loginWithGoogle() {
    authSystem.showToast('سيتم تفعيل تسجيل الدخول بـ Google قريباً', 'info');
}

function loginWithFacebook() {
    authSystem.showToast('سيتم تفعيل تسجيل الدخول بـ Facebook قريباً', 'info');
}

function loginWithApple() {
    authSystem.showToast('سيتم تفعيل تسجيل الدخول بـ Apple قريباً', 'info');
}

function registerWithGoogle() {
    authSystem.showToast('سيتم تفعيل التسجيل بـ Google قريباً', 'info');
}

function registerWithFacebook() {
    authSystem.showToast('سيتم تفعيل التسجيل بـ Facebook قريباً', 'info');
}

function registerWithApple() {
    authSystem.showToast('سيتم تفعيل التسجيل بـ Apple قريباً', 'info');
}