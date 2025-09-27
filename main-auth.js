/**
 * Main Authentication Handler for Index Page
 * Manages user authentication state and UI updates
 */

class MainAuthHandler {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.isMenuOpen = false;
        
        this.init();
    }

    init() {
        this.updateUI();
        this.setupEventListeners();
        this.setupClickOutside();
        
        console.log('🏠 نظام المصادقة للصفحة الرئيسية تم تحميله');
        
        if (this.currentUser) {
            console.log(`👋 مرحباً ${this.currentUser.name}!`);
        }
    }

    setupEventListeners() {
        // Check auth status on page focus
        window.addEventListener('focus', () => {
            this.checkAuthStatus();
        });
        
        // Check auth status on storage change
        window.addEventListener('storage', (e) => {
            if (e.key === 'currentUser') {
                this.checkAuthStatus();
            }
        });
        
        // Listen for custom auth events
        window.addEventListener('userLoggedIn', (e) => {
            this.currentUser = e.detail;
            this.updateUI();
        });
        
        window.addEventListener('userLoggedOut', () => {
            this.currentUser = null;
            this.updateUI();
        });
    }

    setupClickOutside() {
        document.addEventListener('click', (e) => {
            const userProfile = document.getElementById('userProfile');
            const userMenu = document.getElementById('userMenu');
            
            if (userProfile && userMenu && this.isMenuOpen) {
                if (!userProfile.contains(e.target)) {
                    this.closeUserMenu();
                }
            }
        });
    }

    checkAuthStatus() {
        const storedUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (this.currentUser && !storedUser) {
            // User logged out
            this.currentUser = null;
            this.updateUI();
            this.showWelcomeMessage('تم تسجيل الخروج بنجاح');
        } else if (!this.currentUser && storedUser) {
            // User logged in
            this.currentUser = storedUser;
            this.updateUI();
            this.showWelcomeMessage(`مرحباً بعودتك ${storedUser.name}! 👋`);
        } else if (this.currentUser && storedUser && this.currentUser.id !== storedUser.id) {
            // User changed
            this.currentUser = storedUser;
            this.updateUI();
            this.showWelcomeMessage(`مرحباً ${storedUser.name}!`);
        }
    }

    updateUI() {
        const authButtons = document.getElementById('authButtons');
        const userProfile = document.getElementById('userProfile');
        
        if (this.currentUser) {
            // Show user profile, hide auth buttons
            if (authButtons) authButtons.style.display = 'none';
            if (userProfile) {
                userProfile.style.display = 'block';
                this.updateUserProfile();
            }
        } else {
            // Show auth buttons, hide user profile
            if (authButtons) authButtons.style.display = 'flex';
            if (userProfile) userProfile.style.display = 'none';
        }
    }

    updateUserProfile() {
        if (!this.currentUser) return;
        
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');
        const userIcon = document.getElementById('userIcon');
        
        if (userName) {
            // Truncate long names
            const displayName = this.currentUser.name.length > 12 
                ? this.currentUser.name.substring(0, 12) + '...' 
                : this.currentUser.name;
            userName.textContent = displayName;
        }
        
        if (userAvatar && userIcon) {
            if (this.currentUser.avatar) {
                userAvatar.src = this.currentUser.avatar;
                userAvatar.style.display = 'block';
                userIcon.style.display = 'none';
            } else {
                userAvatar.style.display = 'none';
                userIcon.style.display = 'block';
            }
        }
    }

    toggleUserMenu() {
        const userMenu = document.getElementById('userMenu');
        
        if (this.isMenuOpen) {
            this.closeUserMenu();
        } else {
            this.openUserMenu();
        }
    }

    openUserMenu() {
        const userMenu = document.getElementById('userMenu');
        const profileBtn = document.querySelector('.profile-btn .fa-chevron-down');
        
        if (userMenu) {
            userMenu.style.display = 'block';
            this.isMenuOpen = true;
        }
        
        if (profileBtn) {
            profileBtn.style.transform = 'rotate(180deg)';
        }
    }

    closeUserMenu() {
        const userMenu = document.getElementById('userMenu');
        const profileBtn = document.querySelector('.profile-btn .fa-chevron-down');
        
        if (userMenu) {
            userMenu.style.display = 'none';
            this.isMenuOpen = false;
        }
        
        if (profileBtn) {
            profileBtn.style.transform = 'rotate(0deg)';
        }
    }

    logoutUser() {
        // Show confirmation
        if (!confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            return;
        }
        
        // Clear user data
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        
        // Close menu
        this.closeUserMenu();
        
        // Update UI
        this.updateUI();
        
        // Show message
        this.showWelcomeMessage('تم تسجيل الخروج بنجاح');
        
        // Dispatch logout event
        window.dispatchEvent(new CustomEvent('userLoggedOut'));
        
        console.log('👋 تم تسجيل الخروج');
    }

    showWelcomeMessage(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'welcome-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: white;
            color: #333;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
            font-family: 'Cairo', sans-serif;
            font-weight: 600;
            min-width: 250px;
        `;
        
        const toastContent = toast.querySelector('.toast-content');
        if (toastContent) {
            toastContent.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
            `;
        }
        
        const icon = toast.querySelector('i');
        if (icon) {
            icon.style.cssText = `
                color: #00C851;
                font-size: 18px;
            `;
        }
        
        // Add animation styles
        if (!document.getElementById('welcome-toast-styles')) {
            const styles = document.createElement('style');
            styles.id = 'welcome-toast-styles';
            styles.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
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
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Add to page
        document.body.appendChild(toast);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }

    // Utility methods for other parts of the site
    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    requireAuth(callback, errorMessage = 'يجب تسجيل الدخول أولاً') {
        if (this.isLoggedIn()) {
            callback();
        } else {
            this.showWelcomeMessage(errorMessage);
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    }

    // Cart and wishlist helpers
    addToCart(product) {
        this.requireAuth(() => {
            // Add to cart logic here
            this.showWelcomeMessage('تم إضافة المنتج إلى السلة');
        });
    }

    addToWishlist(product) {
        this.requireAuth(() => {
            // Add to wishlist logic here
            this.showWelcomeMessage('تم إضافة المنتج إلى المفضلة');
        });
    }
}

// Global functions for HTML onclick events
function toggleUserMenu() {
    if (window.mainAuth) {
        window.mainAuth.toggleUserMenu();
    }
}

function logoutUser() {
    if (window.mainAuth) {
        window.mainAuth.logoutUser();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.mainAuth = new MainAuthHandler();
});

// Auto-check auth status every 30 seconds
setInterval(() => {
    if (window.mainAuth) {
        window.mainAuth.checkAuthStatus();
    }
}, 30000);

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.mainAuth && window.mainAuth.isMenuOpen) {
        window.mainAuth.closeUserMenu();
    }
});