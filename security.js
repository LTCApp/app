// Security Manager - Enhanced Security Features

class SecurityManager {
    constructor() {
        this.csrfToken = this.generateToken();
        this.sessionManager = new SessionManager();
        this.rateLimiter = new RateLimiter();
        this.init();
    }
    
    init() {
        // Add CSRF token to all forms
        this.addCSRFTokenToForms();
        // Setup security headers
        this.setupSecurityHeaders();
    }
    
    // Generate CSRF Token
    generateToken() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
    
    // Add CSRF Token to Forms
    addCSRFTokenToForms() {
        document.querySelectorAll('form').forEach(form => {
            if (!form.querySelector('input[name="csrf_token"]')) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'csrf_token';
                input.value = this.csrfToken;
                form.appendChild(input);
            }
        });
    }
    
    // Validate CSRF Token
    validateCSRFToken(token) {
        return token === this.csrfToken;
    }
    
    // Validate Input
    validateInput(input, type) {
        if (!input) return false;
        
        const patterns = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^[0-9]{10,11}$/,
            price: /^\d+(\.\d{1,2})?$/,
            barcode: /^[0-9]+$/,
            text: /^[\u0600-\u06FFa-zA-Z\s]+$/,
            number: /^\d+$/,
            alphanumeric: /^[a-zA-Z0-9]+$/
        };
        
        return patterns[type] ? patterns[type].test(input) : true;
    }
    
    // Sanitize HTML
    sanitizeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    // Sanitize Input (remove dangerous characters)
    sanitizeInput(input) {
        if (!input) return '';
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }
    
    // Validate Password Strength
    validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return {
            valid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
            strength: this.calculatePasswordStrength(password),
            requirements: {
                minLength: password.length >= minLength,
                hasUpperCase,
                hasLowerCase,
                hasNumbers,
                hasSpecialChar
            }
        };
    }
    
    calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
        
        if (strength <= 2) return 'ضعيف';
        if (strength <= 4) return 'متوسط';
        return 'قوي';
    }
    
    // Setup Security Headers (for display purposes)
    setupSecurityHeaders() {
        // These should be set on the server side, but we can add meta tags
        const headers = [
            { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
            { 'http-equiv': 'X-Frame-Options', content: 'DENY' },
            { 'http-equiv': 'X-XSS-Protection', content: '1; mode=block' }
        ];
        
        headers.forEach(header => {
            const meta = document.createElement('meta');
            meta.httpEquiv = header['http-equiv'];
            meta.content = header.content;
            document.head.appendChild(meta);
        });
    }
    
    // Encrypt Data (simple XOR encryption for demo)
    encryptData(data, key) {
        let encrypted = '';
        for (let i = 0; i < data.length; i++) {
            encrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return btoa(encrypted);
    }
    
    // Decrypt Data
    decryptData(encrypted, key) {
        const data = atob(encrypted);
        let decrypted = '';
        for (let i = 0; i < data.length; i++) {
            decrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return decrypted;
    }
    
    // Log Security Event
    logSecurityEvent(event, details) {
        const log = {
            timestamp: new Date().toISOString(),
            event,
            details,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // Store in localStorage (in production, send to server)
        const logs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
        logs.push(log);
        // Keep only last 100 logs
        if (logs.length > 100) logs.shift();
        localStorage.setItem('securityLogs', JSON.stringify(logs));
    }
}

class SessionManager {
    constructor(timeout = 30 * 60 * 1000) { // 30 minutes default
        this.timeout = timeout;
        this.lastActivity = Date.now();
        this.warningShown = false;
        this.startMonitoring();
        this.setupActivityListeners();
    }
    
    startMonitoring() {
        setInterval(() => {
            const inactiveTime = Date.now() - this.lastActivity;
            const warningTime = this.timeout - (5 * 60 * 1000); // 5 minutes before timeout
            
            if (inactiveTime > this.timeout) {
                this.logout('انتهت الجلسة بسبب عدم النشاط');
            } else if (inactiveTime > warningTime && !this.warningShown) {
                this.showWarning();
            }
        }, 60000); // Check every minute
    }
    
    setupActivityListeners() {
        ['click', 'keypress', 'scroll', 'mousemove', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => this.updateActivity(), { passive: true });
        });
    }
    
    updateActivity() {
        this.lastActivity = Date.now();
        this.warningShown = false;
    }
    
    showWarning() {
        this.warningShown = true;
        const warning = document.createElement('div');
        warning.className = 'session-warning';
        warning.innerHTML = `
            <div class="warning-content">
                <i class="fas fa-exclamation-triangle"></i>
                <p>ستنتهي جلستك خلال 5 دقائق بسبب عدم النشاط</p>
                <button onclick="securityManager.sessionManager.updateActivity(); this.parentElement.parentElement.remove();">
                    متابعة العمل
                </button>
            </div>
        `;
        document.body.appendChild(warning);
    }
    
    logout(reason) {
        securityManager.logSecurityEvent('logout', { reason });
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = 'login.html';
    }
    
    getRemainingTime() {
        const remaining = this.timeout - (Date.now() - this.lastActivity);
        return Math.max(0, remaining);
    }
}

class RateLimiter {
    constructor() {
        this.attempts = {};
    }
    
    check(key, maxAttempts = 5, timeWindow = 60000) {
        const now = Date.now();
        
        if (!this.attempts[key]) {
            this.attempts[key] = [];
        }
        
        // Remove old attempts outside time window
        this.attempts[key] = this.attempts[key].filter(time => now - time < timeWindow);
        
        if (this.attempts[key].length >= maxAttempts) {
            securityManager.logSecurityEvent('rate_limit_exceeded', { key, attempts: this.attempts[key].length });
            return false;
        }
        
        this.attempts[key].push(now);
        return true;
    }
    
    reset(key) {
        delete this.attempts[key];
    }
    
    getRemainingAttempts(key, maxAttempts = 5) {
        if (!this.attempts[key]) return maxAttempts;
        return Math.max(0, maxAttempts - this.attempts[key].length);
    }
}

// Input Validator Class
class InputValidator {
    static validate(input, rules) {
        const errors = [];
        
        if (rules.required && !input) {
            errors.push('هذا الحقل مطلوب');
        }
        
        if (rules.minLength && input.length < rules.minLength) {
            errors.push(`الحد الأدنى ${rules.minLength} أحرف`);
        }
        
        if (rules.maxLength && input.length > rules.maxLength) {
            errors.push(`الحد الأقصى ${rules.maxLength} أحرف`);
        }
        
        if (rules.pattern && !rules.pattern.test(input)) {
            errors.push(rules.patternMessage || 'تنسيق غير صحيح');
        }
        
        if (rules.min && parseFloat(input) < rules.min) {
            errors.push(`القيمة يجب أن تكون ${rules.min} على الأقل`);
        }
        
        if (rules.max && parseFloat(input) > rules.max) {
            errors.push(`القيمة يجب أن تكون ${rules.max} على الأكثر`);
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
}

// Error Handler Class
class ErrorHandler {
    static handle(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        // Log error
        securityManager.logSecurityEvent('error', {
            context,
            message: error.message,
            stack: error.stack
        });
        
        // Show user-friendly message
        this.showError('حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.');
    }
    
    static showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => errorDiv.remove(), 300);
        }, 5000);
    }
}

// Initialize Security Manager
const securityManager = new SecurityManager();

// Add CSS for security warnings
const style = document.createElement('style');
style.textContent = `
    .session-warning {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }
    
    .warning-content {
        background: white;
        padding: 40px;
        border-radius: 12px;
        text-align: center;
        max-width: 400px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    
    .warning-content i {
        font-size: 64px;
        color: #f57c00;
        margin-bottom: 20px;
    }
    
    .warning-content p {
        font-size: 18px;
        color: #495057;
        margin-bottom: 25px;
    }
    
    .warning-content button {
        padding: 12px 30px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .warning-content button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }
    
    .error-message {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #f8d7da;
        color: #721c24;
        padding: 15px 30px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideDown 0.3s ease;
        border: 2px solid #f5c6cb;
    }
    
    .error-message i {
        font-size: 20px;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
    }
`;
document.head.appendChild(style);

// Export for use in other modules
window.securityManager = securityManager;
window.InputValidator = InputValidator;
window.ErrorHandler = ErrorHandler;

console.log('🔒 Security Manager initialized successfully');