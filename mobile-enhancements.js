// ===== MOBILE ENHANCEMENTS FOR SMART KITCHEN SYSTEM =====
// Professional Mobile Touch Interactions & Gestures

class MobileEnhancements {
    constructor(kitchenSystem) {
        this.kitchen = kitchenSystem;
        this.isMobile = window.innerWidth <= 768;
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Touch and gesture properties
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.isScrolling = false;
        this.pullToRefreshOffset = 0;
        this.isRefreshing = false;
        this.sidebarOpen = false;
        
        // Performance tracking
        this.lastScrollTime = 0;
        this.scrollTimeout = null;
        
        this.initializeMobileFeatures();
    }

    initializeMobileFeatures() {
        if (!this.isMobile) return;

        this.addMobileNavigation();
        this.initializeTouchGestures();
        this.initializePullToRefresh();
        this.initializeSwipeActions();
        this.initializeMobileKeyboard();
        this.optimizeForMobile();
        this.addMobileBottomNavigation();
        this.initializeHapticFeedback();
        
        console.log('🔥 Mobile enhancements initialized successfully');
    }

    // ===== MOBILE NAVIGATION =====
    addMobileNavigation() {
        // Add mobile menu button to header
        const headerLeft = document.querySelector('.header-left');
        if (headerLeft && !document.querySelector('.mobile-menu-btn')) {
            const menuBtn = document.createElement('button');
            menuBtn.className = 'mobile-menu-btn';
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            menuBtn.addEventListener('click', () => this.toggleSidebar());
            
            headerLeft.insertBefore(menuBtn, headerLeft.firstChild);
        }

        // Add sidebar overlay
        if (!document.querySelector('.sidebar-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.addEventListener('click', () => this.closeSidebar());
            document.body.appendChild(overlay);
        }

        // Handle sidebar swipe to close
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            let startX = 0;
            
            sidebar.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            }, { passive: true });
            
            sidebar.addEventListener('touchmove', (e) => {
                const currentX = e.touches[0].clientX;
                const diffX = startX - currentX;
                
                if (diffX > 50 && this.sidebarOpen) {
                    this.closeSidebar();
                }
            }, { passive: true });
        }
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (this.sidebarOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    openSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (sidebar && overlay) {
            sidebar.classList.add('mobile-open');
            overlay.classList.add('active');
            this.sidebarOpen = true;
            document.body.style.overflow = 'hidden';
            
            this.triggerHapticFeedback('light');
        }
    }

    closeSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (sidebar && overlay) {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
            this.sidebarOpen = false;
            document.body.style.overflow = '';
            
            this.triggerHapticFeedback('light');
        }
    }

    // ===== TOUCH GESTURES =====
    initializeTouchGestures() {
        // Global touch event handlers
        document.addEventListener('touchstart', (e) => {
            this.handleTouchStart(e);
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            this.handleTouchMove(e);
        }, { passive: false });
        
        document.addEventListener('touchend', (e) => {
            this.handleTouchEnd(e);
        }, { passive: true });

        // Add swipe navigation between tabs
        const ordersGrid = document.querySelector('.orders-grid');
        if (ordersGrid) {
            this.initializeTabSwipeNavigation(ordersGrid);
        }
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.isScrolling = false;
    }

    handleTouchMove(e) {
        if (!this.touchStartX || !this.touchStartY) return;
        
        const touchMoveX = e.touches[0].clientX;
        const touchMoveY = e.touches[0].clientY;
        
        const diffX = this.touchStartX - touchMoveX;
        const diffY = this.touchStartY - touchMoveY;
        
        // Determine if user is scrolling vertically
        if (Math.abs(diffY) > Math.abs(diffX)) {
            this.isScrolling = true;
        }
        
        // Handle pull to refresh
        if (touchMoveY > this.touchStartY && window.scrollY === 0 && !this.isRefreshing) {
            this.handlePullToRefresh(touchMoveY - this.touchStartY);
        }
    }

    handleTouchEnd(e) {
        if (!this.touchStartX || !this.touchStartY) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const diffX = this.touchStartX - touchEndX;
        const diffY = this.touchStartY - touchEndY;
        
        // Reset pull to refresh if not triggered
        if (this.pullToRefreshOffset > 0 && !this.isRefreshing) {
            this.resetPullToRefresh();
        }
        
        // Handle horizontal swipes for navigation
        if (!this.isScrolling && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe left - next tab
                this.navigateToNextTab();
            } else {
                // Swipe right - previous tab
                this.navigateToPreviousTab();
            }
        }
        
        // Reset touch coordinates
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
    }

    // ===== TAB SWIPE NAVIGATION =====
    initializeTabSwipeNavigation(element) {
        let startX = 0;
        let currentTab = 0;
        const tabs = ['new', 'preparing', 'ready', 'completed'];
        
        element.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        element.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 100) { // Minimum swipe distance
                if (diff > 0 && currentTab < tabs.length - 1) {
                    // Swipe left - next tab
                    currentTab++;
                    this.kitchen.switchTab(tabs[currentTab]);
                    this.triggerHapticFeedback('light');
                } else if (diff < 0 && currentTab > 0) {
                    // Swipe right - previous tab
                    currentTab--;
                    this.kitchen.switchTab(tabs[currentTab]);
                    this.triggerHapticFeedback('light');
                }
            }
        }, { passive: true });
    }

    navigateToNextTab() {
        const activeTab = document.querySelector('.tab-btn.active');
        const nextTab = activeTab?.nextElementSibling;
        
        if (nextTab) {
            nextTab.click();
            this.triggerHapticFeedback('light');
        }
    }

    navigateToPreviousTab() {
        const activeTab = document.querySelector('.tab-btn.active');
        const prevTab = activeTab?.previousElementSibling;
        
        if (prevTab) {
            prevTab.click();
            this.triggerHapticFeedback('light');
        }
    }

    // ===== PULL TO REFRESH =====
    initializePullToRefresh() {
        // Create pull to refresh indicator
        const indicator = document.createElement('div');
        indicator.className = 'pull-to-refresh';
        indicator.innerHTML = '<i class="fas fa-sync-alt"></i>';
        
        const contentArea = document.querySelector('.content-area');
        if (contentArea) {
            contentArea.style.position = 'relative';
            contentArea.appendChild(indicator);
        }
    }

    handlePullToRefresh(offset) {
        const indicator = document.querySelector('.pull-to-refresh');
        if (!indicator) return;
        
        this.pullToRefreshOffset = Math.min(offset, 80);
        
        if (this.pullToRefreshOffset > 60 && !this.isRefreshing) {
            indicator.classList.add('active');
            indicator.style.top = `${this.pullToRefreshOffset - 60}px`;
            
            if (this.pullToRefreshOffset >= 80) {
                this.triggerPullToRefresh();
            }
        } else {
            indicator.style.top = `${this.pullToRefreshOffset - 60}px`;
        }
    }

    triggerPullToRefresh() {
        if (this.isRefreshing) return;
        
        this.isRefreshing = true;
        const indicator = document.querySelector('.pull-to-refresh');
        
        if (indicator) {
            indicator.classList.add('active');
            indicator.style.top = '20px';
        }
        
        this.triggerHapticFeedback('medium');
        
        // Simulate refresh
        setTimeout(() => {
            this.kitchen.refreshOrders();
            this.resetPullToRefresh();
            this.kitchen.showNotification('تم تحديث البيانات بنجاح!', 'success');
        }, 1500);
    }

    resetPullToRefresh() {
        const indicator = document.querySelector('.pull-to-refresh');
        if (indicator) {
            indicator.classList.remove('active');
            indicator.style.top = '-60px';
        }
        
        this.pullToRefreshOffset = 0;
        this.isRefreshing = false;
    }

    // ===== SWIPE ACTIONS ON ORDER CARDS =====
    initializeSwipeActions() {
        const observeOrderCards = () => {
            const orderCards = document.querySelectorAll('.order-card');
            orderCards.forEach(card => {
                if (!card.dataset.swipeEnabled) {
                    this.addSwipeActionsToCard(card);
                    card.dataset.swipeEnabled = 'true';
                }
            });
        };

        // Initial setup
        observeOrderCards();
        
        // Observe for dynamically added cards
        const observer = new MutationObserver(observeOrderCards);
        const ordersGrid = document.querySelector('.orders-grid');
        if (ordersGrid) {
            observer.observe(ordersGrid, { childList: true });
        }
    }

    addSwipeActionsToCard(card) {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        // Add swipe action elements
        const leftAction = document.createElement('div');
        leftAction.className = 'swipe-actions left';
        leftAction.innerHTML = '<button class="swipe-action-btn"><i class="fas fa-check"></i></button>';
        
        const rightAction = document.createElement('div');
        rightAction.className = 'swipe-actions right';
        rightAction.innerHTML = '<button class="swipe-action-btn"><i class="fas fa-clock"></i></button>';
        
        card.style.position = 'relative';
        card.appendChild(leftAction);
        card.appendChild(rightAction);
        
        // Touch events
        card.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            card.classList.add('swiping');
        }, { passive: true });
        
        card.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            currentX = e.touches[0].clientX;
            const diffX = currentX - startX;
            
            // Limit swipe distance
            const maxSwipe = 80;
            const constrainedDiff = Math.max(-maxSwipe, Math.min(maxSwipe, diffX));
            
            card.style.transform = `translateX(${constrainedDiff}px)`;
            
            // Show appropriate action
            if (constrainedDiff > 50) {
                card.classList.add('swipe-action-left');
                card.classList.remove('swipe-action-right');
            } else if (constrainedDiff < -50) {
                card.classList.add('swipe-action-right');
                card.classList.remove('swipe-action-left');
            } else {
                card.classList.remove('swipe-action-left', 'swipe-action-right');
            }
        }, { passive: true });
        
        card.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const diffX = currentX - startX;
            isDragging = false;
            card.classList.remove('swiping');
            
            // Trigger action if swipe was significant
            if (Math.abs(diffX) > 60) {
                if (diffX > 0) {
                    // Swiped right - complete action
                    this.handleSwipeAction(card, 'complete');
                } else {
                    // Swiped left - pause action
                    this.handleSwipeAction(card, 'pause');
                }
                
                this.triggerHapticFeedback('medium');
            }
            
            // Reset position
            card.style.transform = '';
            card.classList.remove('swipe-action-left', 'swipe-action-right');
        }, { passive: true });
    }

    handleSwipeAction(card, action) {
        const orderId = card.dataset.orderId;
        if (!orderId) return;
        
        switch (action) {
            case 'complete':
                this.kitchen.completeOrder(orderId);
                break;
            case 'pause':
                this.kitchen.pauseOrder(orderId);
                break;
        }
    }

    // ===== MOBILE KEYBOARD HANDLING =====
    initializeMobileKeyboard() {
        // Handle virtual keyboard appearance
        let viewportHeight = window.innerHeight;
        
        window.addEventListener('resize', () => {
            const currentHeight = window.innerHeight;
            const heightDifference = viewportHeight - currentHeight;
            
            // Virtual keyboard is likely open if height decreased significantly
            if (heightDifference > 150) {
                document.body.classList.add('keyboard-open');
                this.adjustLayoutForKeyboard(true);
            } else {
                document.body.classList.remove('keyboard-open');
                this.adjustLayoutForKeyboard(false);
            }
        });
        
        // Handle input focus
        document.addEventListener('focusin', (e) => {
            if (e.target.matches('input, textarea')) {
                setTimeout(() => {
                    e.target.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 300);
            }
        });
    }

    adjustLayoutForKeyboard(isOpen) {
        const contentArea = document.querySelector('.content-area');
        const aiAssistant = document.querySelector('.ai-assistant');
        
        if (isOpen) {
            if (contentArea) {
                contentArea.style.paddingBottom = '250px';
            }
            if (aiAssistant) {
                aiAssistant.style.display = 'none';
            }
        } else {
            if (contentArea) {
                contentArea.style.paddingBottom = '';
            }
            if (aiAssistant) {
                aiAssistant.style.display = '';
            }
        }
    }

    // ===== MOBILE BOTTOM NAVIGATION =====
    addMobileBottomNavigation() {
        if (document.querySelector('.mobile-bottom-nav')) return;
        
        const bottomNav = document.createElement('div');
        bottomNav.className = 'mobile-bottom-nav';
        bottomNav.innerHTML = `
            <a href="#" class="bottom-nav-item active" data-section="orders">
                <i class="fas fa-list-alt bottom-nav-icon"></i>
                <span class="bottom-nav-label">الطلبات</span>
            </a>
            <a href="#" class="bottom-nav-item" data-section="analytics">
                <i class="fas fa-chart-bar bottom-nav-icon"></i>
                <span class="bottom-nav-label">التحليلات</span>
            </a>
            <a href="#" class="bottom-nav-item" data-section="inventory">
                <i class="fas fa-boxes bottom-nav-icon"></i>
                <span class="bottom-nav-label">المخزون</span>
            </a>
            <a href="#" class="bottom-nav-item" data-section="settings">
                <i class="fas fa-cog bottom-nav-icon"></i>
                <span class="bottom-nav-label">الإعدادات</span>
            </a>
        `;
        
        document.body.appendChild(bottomNav);
        
        // Add click handlers
        bottomNav.addEventListener('click', (e) => {
            e.preventDefault();
            const item = e.target.closest('.bottom-nav-item');
            if (item) {
                // Update active state
                bottomNav.querySelectorAll('.bottom-nav-item').forEach(i => 
                    i.classList.remove('active'));
                item.classList.add('active');
                
                // Navigate to section
                const section = item.dataset.section;
                if (section) {
                    this.kitchen.showSection(section);
                    this.triggerHapticFeedback('light');
                }
            }
        });
    }

    // ===== HAPTIC FEEDBACK =====
    initializeHapticFeedback() {
        // Check if device supports haptic feedback
        this.supportsHaptics = 'vibrate' in navigator;
    }

    triggerHapticFeedback(type = 'light') {
        if (!this.supportsHaptics) return;
        
        const patterns = {
            light: [10],
            medium: [30],
            heavy: [50],
            success: [10, 50, 10],
            error: [100, 100, 100]
        };
        
        const pattern = patterns[type] || patterns.light;
        navigator.vibrate(pattern);
    }

    // ===== MOBILE OPTIMIZATIONS =====
    optimizeForMobile() {
        // Optimize scrolling performance
        this.optimizeScrolling();
        
        // Improve touch response
        this.improveTouchResponse();
        
        // Add connection status monitoring
        this.monitorConnection();
        
        // Optimize for low memory devices
        this.optimizeForLowMemory();
    }

    optimizeScrolling() {
        let ticking = false;
        
        const updateScrollState = () => {
            // Add scroll state class for CSS optimizations
            document.body.classList.add('scrolling');
            
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                document.body.classList.remove('scrolling');
            }, 150);
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollState);
                ticking = true;
            }
        }, { passive: true });
    }

    improveTouchResponse() {
        // Add fast-click class to improve button responsiveness
        document.addEventListener('touchstart', (e) => {
            if (e.target.closest('.btn, .menu-link, .tab-btn')) {
                e.target.closest('.btn, .menu-link, .tab-btn').classList.add('touching');
            }
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            setTimeout(() => {
                document.querySelectorAll('.touching').forEach(el => {
                    el.classList.remove('touching');
                });
            }, 100);
        }, { passive: true });
    }

    monitorConnection() {
        if ('onLine' in navigator) {
            const updateConnectionStatus = () => {
                if (navigator.onLine) {
                    document.body.classList.remove('offline');
                    this.kitchen.showNotification('تم استعادة الاتصال بالإنترنت', 'success');
                } else {
                    document.body.classList.add('offline');
                    this.kitchen.showNotification('انقطع الاتصال بالإنترنت', 'warning');
                }
            };
            
            window.addEventListener('online', updateConnectionStatus);
            window.addEventListener('offline', updateConnectionStatus);
        }
    }

    optimizeForLowMemory() {
        // Monitor memory usage (if supported)
        if ('memory' in performance) {
            setInterval(() => {
                const memInfo = performance.memory;
                const memoryUsagePercent = (memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit) * 100;
                
                if (memoryUsagePercent > 80) {
                    // Reduce animations and complex effects
                    document.body.classList.add('low-memory-mode');
                    console.warn('Low memory detected, reducing visual effects');
                }
            }, 10000); // Check every 10 seconds
        }
    }

    // ===== PUBLIC METHODS =====
    refreshMobileState() {
        this.isMobile = window.innerWidth <= 768;
        
        if (this.isMobile && !document.querySelector('.mobile-menu-btn')) {
            this.initializeMobileFeatures();
        }
    }

    showMobileNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `mobile-notification mobile-notification-${type}`;
        notification.textContent = message;
        
        // Style for mobile
        Object.assign(notification.style, {
            position: 'fixed',
            top: '70px',
            left: '10px',
            right: '10px',
            padding: '15px',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '600',
            zIndex: '9999',
            fontSize: '14px',
            textAlign: 'center',
            transform: 'translateY(-100%)',
            transition: 'transform 0.3s ease'
        });
        
        // Set background color
        const colors = {
            'success': '#27ae60',
            'error': '#e74c3c',
            'warning': '#f39c12',
            'info': '#3498db'
        };
        notification.style.background = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
        
        this.triggerHapticFeedback('light');
    }

    destroy() {
        // Clean up event listeners and timers
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
        
        // Remove mobile-specific elements
        const mobileElements = document.querySelectorAll(
            '.mobile-menu-btn, .sidebar-overlay, .mobile-bottom-nav, .pull-to-refresh'
        );
        mobileElements.forEach(el => el.remove());
        
        console.log('Mobile enhancements cleaned up');
    }
}

// Auto-initialize mobile enhancements when kitchen system is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for kitchen system to be available
    const initMobileEnhancements = () => {
        if (window.kitchen) {
            window.mobileEnhancements = new MobileEnhancements(window.kitchen);
        } else {
            setTimeout(initMobileEnhancements, 100);
        }
    };
    
    initMobileEnhancements();
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.mobileEnhancements) {
        window.mobileEnhancements.refreshMobileState();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileEnhancements;
}