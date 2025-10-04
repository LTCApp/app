// Enhanced Smart Kitchen Management System - Professional Supermarket Edition
// Version 2.0 Pro - Advanced JavaScript Controller

class SupermarketKitchenSystem {
    constructor() {
        this.currentUser = null;
        this.currentStation = null;
        this.orders = [];
        this.stations = {};
        this.inventory = {};
        this.analytics = {};
        this.notifications = [];
        this.voiceRecognition = null;
        this.autoRefresh = false;
        this.refreshInterval = null;
        this.soundEnabled = true;
        this.language = 'ar';
        
        this.initializeSystem();
    }

    // ===== SYSTEM INITIALIZATION =====
    async initializeSystem() {
        try {
            this.loadSession();
            this.initializeStations();
            this.initializeOrders();
            this.initializeEventListeners();
            this.startRealTimeUpdates();
            this.initializeVoiceCommands();
            this.initializeCharts();
            this.loadInventory();
            this.updateTimeDisplay();
            
            console.log('🚀 Smart Kitchen System Initialized Successfully');
            this.showNotification('مرحباً بك في المطبخ الذكي! النظام جاهز للعمل', 'success');
        } catch (error) {
            console.error('❌ System Initialization Error:', error);
            this.showNotification('حدث خطأ في تهيئة النظام', 'error');
        }
    }

    loadSession() {
        const session = localStorage.getItem('smartKitchenSession');
        if (!session) {
            window.location.href = 'supermarket-kitchen-login.html';
            return;
        }

        this.currentUser = JSON.parse(session);
        this.currentStation = this.currentUser.station;
        
        // Update UI with user info
        document.getElementById('user-name').textContent = this.getUserDisplayName();
        document.getElementById('user-role').textContent = this.getUserRoleDisplayName();
        document.getElementById('user-avatar').textContent = this.currentUser.username.charAt(0).toUpperCase();
        document.getElementById('current-station').innerHTML = `
            <i class="fas ${this.getStationIcon()}"></i>
            <span>${this.getStationDisplayName()}</span>
        `;
    }

    initializeStations() {
        this.stations = {
            chicken: {
                name: 'محطة الدجاج',
                icon: 'fas fa-drumstick-bite',
                status: 'active',
                orders: 3,
                staff: ['chef-chicken', 'staff1'],
                equipment: ['oven1', 'fryer1', 'prep-table1']
            },
            fish: {
                name: 'محطة الأسماك',
                icon: 'fas fa-fish',
                status: 'busy',
                orders: 5,
                staff: ['chef-fish', 'staff2'],
                equipment: ['grill1', 'steamer1', 'prep-table2']
            },
            bakery: {
                name: 'المخبز',
                icon: 'fas fa-bread-slice',
                status: 'active',
                orders: 2,
                staff: ['chef-bakery'],
                equipment: ['oven2', 'mixer1', 'proofing-cabinet']
            },
            salads: {
                name: 'السلطات',
                icon: 'fas fa-leaf',
                status: 'active',
                orders: 1,
                staff: ['prep1'],
                equipment: ['prep-table3', 'refrigerator1']
            },
            desserts: {
                name: 'الحلويات',
                icon: 'fas fa-birthday-cake',
                status: 'active',
                orders: 1,
                staff: ['chef-desserts', 'prep2'],
                equipment: ['oven3', 'mixer2', 'display-case']
            },
            main: {
                name: 'المحطة الرئيسية',
                icon: 'fas fa-utensils',
                status: 'active',
                orders: 8,
                staff: ['supervisor1', 'supervisor2'],
                equipment: ['pos-system', 'order-display']
            }
        };
    }

    // ===== ORDERS MANAGEMENT =====
    initializeOrders() {
        // Generate sample orders for demonstration
        this.orders = [
            {
                id: 'ORD-001',
                number: '#1001',
                customer: 'أحمد محمد',
                station: 'chicken',
                priority: 'urgent',
                status: 'new',
                orderTime: new Date(Date.now() - 10 * 60000), // 10 minutes ago
                estimatedTime: 15,
                items: [
                    { name: 'دجاج مشوي', quantity: 2, details: 'متوسط الشوي', station: 'chicken' },
                    { name: 'بطاطس مقلية', quantity: 1, details: 'كبيرة', station: 'main' }
                ],
                type: 'delivery',
                notes: 'بدون بصل'
            },
            {
                id: 'ORD-002',
                number: '#1002',
                customer: 'سارة أحمد',
                station: 'fish',
                priority: 'normal',
                status: 'preparing',
                orderTime: new Date(Date.now() - 15 * 60000),
                estimatedTime: 20,
                items: [
                    { name: 'سمك فيليه مشوي', quantity: 1, details: 'بالليمون', station: 'fish' },
                    { name: 'أرز أبيض', quantity: 1, details: 'متوسط', station: 'main' }
                ],
                type: 'dine-in',
                notes: ''
            },
            {
                id: 'ORD-003',
                number: '#1003',
                customer: 'محمد علي',
                station: 'bakery',
                priority: 'normal',
                status: 'ready',
                orderTime: new Date(Date.now() - 25 * 60000),
                estimatedTime: 10,
                items: [
                    { name: 'خبز فرنسي', quantity: 3, details: 'طازج', station: 'bakery' },
                    { name: 'كرواسان بالزبدة', quantity: 2, details: 'دافئ', station: 'bakery' }
                ],
                type: 'takeaway',
                notes: 'في كيس منفصل'
            }
        ];

        this.renderOrders();
        this.updateOrderStats();
    }

    renderOrders() {
        const ordersGrid = document.getElementById('orders-grid');
        if (!ordersGrid) return;

        ordersGrid.innerHTML = '';

        const filteredOrders = this.orders.filter(order => {
            const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
            if (activeTab === 'new') return order.status === 'new';
            if (activeTab === 'preparing') return order.status === 'preparing';
            if (activeTab === 'ready') return order.status === 'ready';
            if (activeTab === 'completed') return order.status === 'completed';
            return true;
        });

        filteredOrders.forEach(order => {
            const orderCard = this.createOrderCard(order);
            ordersGrid.appendChild(orderCard);
        });
    }

    createOrderCard(order) {
        const card = document.createElement('div');
        card.className = 'order-card';
        card.dataset.orderId = order.id;

        const timeElapsed = Math.floor((Date.now() - order.orderTime) / 60000);
        const priorityClass = order.priority === 'urgent' ? 'priority-urgent' : 'priority-normal';

        card.innerHTML = `
            <div class="order-header">
                <div class="order-number">${order.number}</div>
                <div class="order-priority ${priorityClass}">${order.priority === 'urgent' ? 'عاجل' : 'عادي'}</div>
            </div>
            
            <div class="order-info">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span><i class="fas fa-user"></i> ${order.customer}</span>
                    <span><i class="fas fa-clock"></i> ${timeElapsed} دقيقة</span>
                </div>
                <div style="margin-bottom: 10px;">
                    <span><i class="fas fa-map-marker-alt"></i> ${this.getOrderTypeText(order.type)}</span>
                </div>
            </div>
            
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <div class="item-info">
                            <div class="item-name">${item.name}</div>
                            <div class="item-details">${item.details}</div>
                        </div>
                        <div class="item-quantity">${item.quantity}</div>
                    </div>
                `).join('')}
            </div>
            
            ${order.notes ? `
                <div class="order-notes" style="margin: 10px 0; padding: 8px; background: rgba(255, 193, 7, 0.1); border-radius: 5px; font-size: 12px;">
                    <i class="fas fa-sticky-note"></i> ${order.notes}
                </div>
            ` : ''}
            
            <div class="order-actions">
                ${this.getOrderActions(order)}
            </div>
        `;

        return card;
    }

    getOrderActions(order) {
        const actions = [];
        
        switch (order.status) {
            case 'new':
                actions.push(`
                    <button class="btn btn-primary" onclick="kitchen.acceptOrder('${order.id}')">
                        <i class="fas fa-play"></i> بدء التحضير
                    </button>
                `);
                break;
                
            case 'preparing':
                actions.push(`
                    <button class="btn btn-success" onclick="kitchen.completeOrder('${order.id}')">
                        <i class="fas fa-check"></i> جاهز
                    </button>
                `);
                actions.push(`
                    <button class="btn btn-warning" onclick="kitchen.pauseOrder('${order.id}')">
                        <i class="fas fa-pause"></i> إيقاف مؤقت
                    </button>
                `);
                break;
                
            case 'ready':
                actions.push(`
                    <button class="btn btn-success" onclick="kitchen.deliverOrder('${order.id}')">
                        <i class="fas fa-truck"></i> تم التسليم
                    </button>
                `);
                break;
        }
        
        actions.push(`
            <button class="btn btn-primary" onclick="kitchen.showOrderDetails('${order.id}')">
                <i class="fas fa-info-circle"></i> تفاصيل
            </button>
        `);

        return actions.join('');
    }

    // ===== ORDER ACTIONS =====
    acceptOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'preparing';
            order.startTime = new Date();
            
            this.renderOrders();
            this.updateOrderStats();
            this.showNotification(`تم بدء تحضير الطلب ${order.number}`, 'success');
            this.playNotificationSound('start');
            
            // Add to activity log
            this.logActivity(`بدء تحضير الطلب ${order.number}`, 'order');
        }
    }

    completeOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'ready';
            order.completionTime = new Date();
            
            this.renderOrders();
            this.updateOrderStats();
            this.showNotification(`الطلب ${order.number} جاهز للتسليم!`, 'success');
            this.playNotificationSound('complete');
            
            // Visual feedback
            const orderCard = document.querySelector(`[data-order-id="${orderId}"]`);
            if (orderCard) {
                orderCard.classList.add('success-animation');
            }
            
            this.logActivity(`إكمال الطلب ${order.number}`, 'order');
        }
    }

    deliverOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'completed';
            order.deliveryTime = new Date();
            
            this.renderOrders();
            this.updateOrderStats();
            this.showNotification(`تم تسليم الطلب ${order.number} بنجاح!`, 'success');
            
            this.logActivity(`تسليم الطلب ${order.number}`, 'order');
        }
    }

    pauseOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'paused';
            order.pausedTime = new Date();
            
            this.renderOrders();
            this.showNotification(`تم إيقاف الطلب ${order.number} مؤقتاً`, 'warning');
            
            this.logActivity(`إيقاف الطلب ${order.number} مؤقتاً`, 'order');
        }
    }

    showOrderDetails(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            this.openOrderModal(order);
        }
    }

    // ===== VOICE COMMANDS =====
    initializeVoiceCommands() {
        if ('webkitSpeechRecognition' in window) {
            this.voiceRecognition = new webkitSpeechRecognition();
            this.voiceRecognition.continuous = true;
            this.voiceRecognition.interimResults = true;
            this.voiceRecognition.lang = 'ar-SA';

            this.voiceRecognition.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }

                if (finalTranscript) {
                    this.processVoiceCommand(finalTranscript.trim());
                }
            };

            this.voiceRecognition.onerror = (event) => {
                console.error('Voice recognition error:', event.error);
                this.showNotification('خطأ في التعرف على الصوت', 'error');
            };
        }
    }

    startVoiceCommand() {
        if (this.voiceRecognition) {
            document.getElementById('voice-indicator').style.display = 'block';
            this.voiceRecognition.start();
            this.showNotification('تم تشغيل الأوامر الصوتية، قل أمرك الآن', 'info');
        } else {
            this.showNotification('الأوامر الصوتية غير مدعومة في هذا المتصفح', 'error');
        }
    }

    processVoiceCommand(command) {
        command = command.toLowerCase();
        
        if (command.includes('إنهاء') || command.includes('توقف')) {
            this.stopVoiceRecognition();
            return;
        }

        if (command.includes('طلب جديد') || command.includes('طلبات جديدة')) {
            this.switchTab('new');
        } else if (command.includes('جاهز') || command.includes('جاهزة')) {
            this.switchTab('ready');
        } else if (command.includes('مكتمل') || command.includes('مكتملة')) {
            this.switchTab('completed');
        } else if (command.includes('تحديث')) {
            this.refreshOrders();
        } else if (command.includes('إحصائيات') || command.includes('تحليلات')) {
            this.showSection('analytics');
        } else if (command.includes('مخزون')) {
            this.showSection('inventory');
        } else {
            this.showNotification('لم أفهم الأمر، حاول مرة أخرى', 'warning');
        }
    }

    stopVoiceRecognition() {
        if (this.voiceRecognition) {
            this.voiceRecognition.stop();
            document.getElementById('voice-indicator').style.display = 'none';
            this.showNotification('تم إيقاف الأوامر الصوتية', 'info');
        }
    }

    // ===== QR CODE SCANNER =====
    async scanQR() {
        try {
            // Request camera access
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            
            // Create QR scanner modal
            const modal = this.createQRScannerModal();
            document.body.appendChild(modal);
            
            // Initialize QR code scanner here
            this.showNotification('ماسح QR Code مفتوح، وجه الكاميرا نحو الرمز', 'info');
            
        } catch (error) {
            console.error('QR Scanner Error:', error);
            this.showNotification('خطأ في الوصول للكاميرا', 'error');
        }
    }

    createQRScannerModal() {
        const modal = document.createElement('div');
        modal.className = 'qr-scanner-modal';
        modal.innerHTML = `
            <div class="qr-scanner-content">
                <div class="qr-scanner-header">
                    <h3>ماسح QR Code</h3>
                    <button onclick="this.closest('.qr-scanner-modal').remove()">×</button>
                </div>
                <div class="qr-scanner-body">
                    <video id="qr-video" autoplay></video>
                    <div class="qr-scanner-overlay">
                        <div class="qr-scanning-frame"></div>
                    </div>
                </div>
            </div>
        `;
        return modal;
    }

    // ===== ANALYTICS & CHARTS =====
    initializeCharts() {
        // Orders Chart
        const ordersCtx = document.getElementById('ordersChart');
        if (ordersCtx) {
            new Chart(ordersCtx, {
                type: 'line',
                data: {
                    labels: ['6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
                    datasets: [{
                        label: 'الطلبات',
                        data: [5, 12, 18, 25, 32, 28, 35, 22],
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#ffffff'
                            }
                        }
                    },
                    scales: {
                        y: {
                            ticks: {
                                color: '#ffffff'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#ffffff'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        }
                    }
                }
            });
        }

        // Stations Chart
        const stationsCtx = document.getElementById('stationsChart');
        if (stationsCtx) {
            new Chart(stationsCtx, {
                type: 'doughnut',
                data: {
                    labels: ['دجاج', 'أسماك', 'مخبز', 'سلطات', 'حلويات'],
                    datasets: [{
                        data: [25, 20, 15, 20, 20],
                        backgroundColor: [
                            '#e74c3c',
                            '#3498db',
                            '#f39c12',
                            '#27ae60',
                            '#9b59b6'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#ffffff'
                            }
                        }
                    }
                }
            });
        }
    }

    // ===== REAL-TIME UPDATES =====
    startRealTimeUpdates() {
        // Update time every second
        setInterval(() => {
            this.updateTimeDisplay();
        }, 1000);

        // Auto-refresh orders if enabled
        if (this.autoRefresh) {
            this.refreshInterval = setInterval(() => {
                this.refreshOrders();
            }, 30000); // Every 30 seconds
        }

        // Simulate incoming orders
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                this.simulateNewOrder();
            }
        }, 60000); // Check every minute
    }

    updateTimeDisplay() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ar-SA', {
            hour12: false,
            timeZone: 'Asia/Riyadh'
        });
        const dateString = now.toLocaleDateString('ar-SA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Asia/Riyadh'
        });

        document.getElementById('current-time').textContent = timeString;
        document.getElementById('current-date').textContent = dateString;
    }

    simulateNewOrder() {
        const newOrder = {
            id: 'ORD-' + Date.now(),
            number: '#' + (1000 + this.orders.length + 1),
            customer: 'عميل جديد',
            station: ['chicken', 'fish', 'bakery'][Math.floor(Math.random() * 3)],
            priority: Math.random() < 0.3 ? 'urgent' : 'normal',
            status: 'new',
            orderTime: new Date(),
            estimatedTime: 15 + Math.floor(Math.random() * 20),
            items: [
                { name: 'صنف جديد', quantity: 1, details: 'عادي', station: 'main' }
            ],
            type: ['delivery', 'dine-in', 'takeaway'][Math.floor(Math.random() * 3)],
            notes: ''
        };

        this.orders.unshift(newOrder);
        this.renderOrders();
        this.updateOrderStats();
        
        // Play notification sound
        this.playNotificationSound('new');
        this.showNotification(`طلب جديد: ${newOrder.number}`, 'info');
        
        // Update notification badge
        this.updateNotificationBadge();
    }

    // ===== EVENT LISTENERS =====
    initializeEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Sidebar navigation
        document.querySelectorAll('.menu-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.closest('.menu-link').dataset.section;
                this.showSection(section);
            });
        });

        // Mobile sidebar toggle
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('mobile-menu-btn')) {
                document.getElementById('sidebar').classList.toggle('mobile-open');
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        this.switchTab('new');
                        break;
                    case '2':
                        e.preventDefault();
                        this.switchTab('preparing');
                        break;
                    case '3':
                        e.preventDefault();
                        this.switchTab('ready');
                        break;
                    case 'r':
                        e.preventDefault();
                        this.refreshOrders();
                        break;
                }
            }
        });
    }

    // ===== UI HELPERS =====
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Re-render orders
        this.renderOrders();
    }

    showSection(sectionName) {
        // Update sidebar active state
        document.querySelectorAll('.menu-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Show/hide sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });

        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
    }

    updateOrderStats() {
        const stats = {
            new: this.orders.filter(o => o.status === 'new').length,
            preparing: this.orders.filter(o => o.status === 'preparing').length,
            ready: this.orders.filter(o => o.status === 'ready').length,
            completed: this.orders.filter(o => o.status === 'completed').length
        };

        // Update header stats
        document.getElementById('active-orders').textContent = stats.new + stats.preparing;
        document.getElementById('completed-today').textContent = stats.completed;

        // Update tab badges
        document.querySelector('[data-tab="new"]').textContent = `جديدة (${stats.new})`;
        document.querySelector('[data-tab="preparing"]').textContent = `قيد التحضير (${stats.preparing})`;
        document.querySelector('[data-tab="ready"]').textContent = `جاهزة (${stats.ready})`;
        document.querySelector('[data-tab="completed"]').textContent = `مكتملة (${stats.completed})`;

        // Update sidebar badge
        document.getElementById('orders-badge').textContent = stats.new + stats.preparing;
    }

    // ===== UTILITIES =====
    getUserDisplayName() {
        const names = {
            'admin': 'المدير العام',
            'manager': 'مدير المطبخ',
            'chef-chicken': 'شيف الدجاج',
            'chef-fish': 'شيف الأسماك',
            'chef-bakery': 'شيف المخبز',
            'chef-salads': 'شيف السلطات',
            'chef-desserts': 'شيف الحلويات',
            'kitchen': 'موظف المطبخ',
            'prep1': 'معد الطعام 1',
            'prep2': 'معد الطعام 2',
            'staff1': 'موظف 1',
            'staff2': 'موظف 2',
            'supervisor1': 'مشرف 1',
            'supervisor2': 'مشرف 2'
        };
        return names[this.currentUser.username] || this.currentUser.username;
    }

    getUserRoleDisplayName() {
        const roles = {
            'admin': 'مدير عام',
            'manager': 'مدير',
            'chef': 'شيف رئيسي',
            'staff': 'موظف',
            'prep': 'معد',
            'supervisor': 'مشرف'
        };
        return roles[this.currentUser.role] || this.currentUser.role;
    }

    getStationDisplayName() {
        return this.stations[this.currentStation]?.name || 'المحطة الرئيسية';
    }

    getStationIcon() {
        return this.stations[this.currentStation]?.icon || 'fas fa-utensils';
    }

    getOrderTypeText(type) {
        const types = {
            'delivery': 'توصيل',
            'dine-in': 'تناول في المطعم',
            'takeaway': 'استلام'
        };
        return types[type] || type;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '600',
            zIndex: '9999',
            minWidth: '300px',
            animation: 'slideInRight 0.3s ease'
        });

        // Set background color based on type
        const colors = {
            'success': '#27ae60',
            'error': '#e74c3c',
            'warning': '#f39c12',
            'info': '#3498db'
        };
        notification.style.background = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    playNotificationSound(type) {
        if (!this.soundEnabled) return;

        // Create audio context and play sound
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Different frequencies for different types
            const frequencies = {
                'new': 800,
                'complete': 600,
                'start': 700,
                'error': 400
            };

            oscillator.frequency.setValueAtTime(frequencies[type] || 600, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.warn('Could not play notification sound:', error);
        }
    }

    logActivity(activity, type) {
        const log = {
            timestamp: new Date(),
            user: this.currentUser.username,
            station: this.currentStation,
            activity: activity,
            type: type
        };

        // Store in localStorage for now
        const logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
        logs.unshift(log);
        
        // Keep only last 100 logs
        if (logs.length > 100) {
            logs.splice(100);
        }
        
        localStorage.setItem('activityLogs', JSON.stringify(logs));
    }

    // ===== PUBLIC METHODS =====
    refreshOrders() {
        this.renderOrders();
        this.updateOrderStats();
        this.showNotification('تم تحديث الطلبات', 'success');
    }

    toggleAutoRefresh() {
        this.autoRefresh = !this.autoRefresh;
        
        if (this.autoRefresh) {
            this.refreshInterval = setInterval(() => {
                this.refreshOrders();
            }, 30000);
            this.showNotification('تم تفعيل التحديث التلقائي', 'success');
        } else {
            if (this.refreshInterval) {
                clearInterval(this.refreshInterval);
            }
            this.showNotification('تم إيقاف التحديث التلقائي', 'info');
        }
    }

    updateInventory() {
        this.showNotification('جاري تحديث المخزون...', 'info');
        // Simulate inventory update
        setTimeout(() => {
            this.showNotification('تم تحديث المخزون بنجاح', 'success');
        }, 2000);
    }

    generateReport() {
        this.showNotification('جاري إنشاء التقرير...', 'info');
        // Simulate report generation
        setTimeout(() => {
            this.showNotification('تم إنشاء التقرير بنجاح', 'success');
        }, 3000);
    }

    logout() {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            localStorage.removeItem('smartKitchenSession');
            window.location.href = 'supermarket-kitchen-login.html';
        }
    }
}

// Global functions for HTML onclick handlers
function toggleNotifications() {
    kitchen.showNotification('مركز الإشعارات قيد التطوير', 'info');
}

function toggleAIAssistant() {
    kitchen.showNotification('المساعد الذكي قيد التطوير', 'info');
}

// Initialize the system when DOM is loaded
let kitchen;
document.addEventListener('DOMContentLoaded', () => {
    kitchen = new SupermarketKitchenSystem();
    
    // Add CSS animations
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
});

// Export for debugging
window.kitchen = kitchen;