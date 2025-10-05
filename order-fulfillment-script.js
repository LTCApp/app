/**
 * نظام تجهيز الأوردرات المتقدم
 * نظام احترافي لإدارة طلبات السوبر ماركت
 * مشابه لنظام موقع طلبات
 */

class OrderFulfillmentSystem {
    constructor() {
        this.orders = [];
        this.currentFilter = 'all';
        this.autoRefreshInterval = null;
        this.notificationQueue = [];
        this.settings = this.loadSettings();
        this.operatorName = localStorage.getItem('operatorName') || 'موظف التجهيز';
        this.audioContext = null;
        this.dataManager = new OrderDataManager(); // إضافة مدير البيانات
        this.reportsGenerator = new OrderReportsGenerator(); // إضافة مولد التقارير
        
        this.init();
    }

    /**
     * تهيئة النظام
     */
    init() {
        this.initializeAudio();
        this.setupEventListeners();
        this.startTimeUpdater();
        this.loadSampleOrders();
        this.setupAutoRefresh();
        this.updateStatistics();
        
        // تحديث اسم المشغل
        document.getElementById('operator-name').textContent = this.operatorName;
        
        console.log('🚀 نظام تجهيز الأوردرات جاهز للعمل');
        this.showNotification('مرحباً! النظام جاهز للعمل', 'success');
    }

    /**
     * تهيئة الصوت
     */
    initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Audio context not supported:', error);
        }
    }

    /**
     * إعداد مستمعات الأحداث
     */
    setupEventListeners() {
        // أزرار التصفية
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // إغلاق النماذج المنبثقة
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
                this.closeSettingsModal();
            }
        });

        // اختصارات لوحة المفاتيح
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // منع النقر بالزر الأيمن في وضع الإنتاج
        document.addEventListener('contextmenu', (e) => {
            if (this.settings.productionMode) {
                e.preventDefault();
            }
        });
    }

    /**
     * التعامل مع اختصارات لوحة المفاتيح
     */
    handleKeyboardShortcuts(e) {
        // Ctrl + R: تحديث الطلبات
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            this.refreshOrders();
        }
        
        // F5: تحديث الصفحة
        if (e.key === 'F5') {
            e.preventDefault();
            this.refreshOrders();
        }
        
        // Escape: إغلاق النماذج المنبثقة
        if (e.key === 'Escape') {
            this.closeModal();
            this.closeSettingsModal();
        }
        
        // Ctrl + P: طباعة التقرير
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            this.printDailyReport();
        }
    }

    /**
     * بدء مؤقت الوقت
     */
    startTimeUpdater() {
        const updateTime = () => {
            const now = new Date();
            const timeOptions = { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: false 
            };
            const dateOptions = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            
            document.getElementById('current-time').textContent = 
                now.toLocaleTimeString('ar-SA', timeOptions);
            document.getElementById('current-date').textContent = 
                now.toLocaleDateString('ar-SA', dateOptions);
                
            // تحديث أوقات الطلبات
            this.updateOrderTimers();
        };
        
        updateTime();
        setInterval(updateTime, 1000);
    }

    /**
     * تحديث مؤقتات الطلبات
     */
    updateOrderTimers() {
        this.orders.forEach(order => {
            if (order.status !== 'completed') {
                order.timeElapsed = this.calculateTimeElapsed(order.timestamp);
            }
        });
        this.renderOrders();
    }

    /**
     * حساب الوقت المنقضي
     */
    calculateTimeElapsed(timestamp) {
        const now = Date.now();
        const elapsed = now - timestamp;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        if (minutes > 60) {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return `${hours}س ${remainingMinutes}د`;
        }
        
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * تحميل طلبات نموذجية للاختبار
     */
    loadSampleOrders() {
        // استخدام مدير البيانات لإنشاء طلبات واقعية
        this.orders = this.dataManager.generateMultipleOrders(6);

        // إضافة حساب الوقت المنقضي لكل طلب
        this.orders.forEach(order => {
            order.timeElapsed = this.calculateTimeElapsed(order.timestamp);
        });

        this.renderOrders();
        this.updateStatistics();
    }

    /**
     * عرض الطلبات
     */
    renderOrders() {
        const grid = document.getElementById('orders-grid');
        let filteredOrders = this.orders;

        // تطبيق التصفية
        if (this.currentFilter !== 'all') {
            filteredOrders = this.orders.filter(order => {
                if (this.currentFilter === 'priority') {
                    return order.priority === 'high' || order.priority === 'urgent';
                }
                return order.status === this.currentFilter;
            });
        }

        // ترتيب الطلبات حسب الأولوية والوقت
        filteredOrders.sort((a, b) => {
            // الطلبات العاجلة أولاً
            if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
            if (b.priority === 'urgent' && a.priority !== 'urgent') return 1;
            
            // الطلبات عالية الأولوية
            if (a.priority === 'high' && b.priority === 'normal') return -1;
            if (b.priority === 'high' && a.priority === 'normal') return 1;
            
            // ترتيب حسب الوقت (الأقدم أولاً)
            return a.timestamp - b.timestamp;
        });

        grid.innerHTML = filteredOrders.map(order => this.createOrderCard(order)).join('');
    }

    /**
     * إنشاء كارت الطلب
     */
    createOrderCard(order) {
        const priorityBadge = order.priority === 'high' || order.priority === 'urgent' 
            ? `<div class="priority-badge">${order.priority === 'urgent' ? 'عاجل جداً' : 'أولوية عالية'}</div>` 
            : '';

        const statusClass = order.status;
        const statusText = this.getStatusText(order.status);
        
        const orderTypeIcon = order.orderType === 'delivery' 
            ? '<i class="fas fa-truck"></i> توصيل' 
            : '<i class="fas fa-walking"></i> استلام';

        const itemsHtml = order.items.map(item => `
            <div class="item">
                <div>
                    <div class="item-name">${item.name}</div>
                    ${item.notes ? `<div class="item-notes">${item.notes}</div>` : ''}
                </div>
                <div class="item-quantity">${item.quantity}</div>
            </div>
        `).join('');

        const actionsHtml = this.getOrderActions(order);

        return `
            <div class="order-card ${statusClass} ${order.priority === 'urgent' ? 'priority' : ''}" 
                 data-order-id="${order.id}">
                ${priorityBadge}
                
                <div class="order-header">
                    <div class="order-number">#${order.id}</div>
                    <div class="order-time">
                        <div>${orderTypeIcon}</div>
                        <div class="time-elapsed">${order.timeElapsed}</div>
                    </div>
                </div>

                <div class="order-status status-${statusClass}">
                    ${statusText}
                </div>

                <div class="customer-info">
                    <div class="customer-name">
                        <i class="fas fa-user"></i> ${order.customerName}
                    </div>
                    <div class="customer-details">
                        <div><i class="fas fa-phone"></i> ${order.customerPhone}</div>
                        <div><i class="fas fa-map-marker-alt"></i> ${order.customerAddress}</div>
                        ${order.specialInstructions ? `<div><i class="fas fa-exclamation-circle"></i> ${order.specialInstructions}</div>` : ''}
                    </div>
                </div>

                <div class="order-items">
                    <h4><i class="fas fa-list"></i> عناصر الطلب (${order.items.length})</h4>
                    ${itemsHtml}
                </div>

                <div class="order-total">
                    <span>إجمالي المبلغ:</span>
                    <span>${order.total.toFixed(2)} ج.م</span>
                </div>

                <div class="order-actions">
                    ${actionsHtml}
                </div>
            </div>
        `;
    }

    /**
     * الحصول على نص الحالة
     */
    getStatusText(status) {
        const statusTexts = {
            'pending': 'في الانتظار',
            'preparing': 'قيد التجهيز',
            'ready': 'جاهز للتسليم',
            'completed': 'مكتمل'
        };
        return statusTexts[status] || status;
    }

    /**
     * الحصول على إجراءات الطلب
     */
    getOrderActions(order) {
        let actions = '';
        
        switch (order.status) {
            case 'pending':
                actions = `
                    <button class="action-btn-small btn-start" onclick="orderSystem.startOrder('${order.id}')">
                        <i class="fas fa-play"></i> بدء التجهيز
                    </button>
                `;
                break;
            case 'preparing':
                actions = `
                    <button class="action-btn-small btn-ready" onclick="orderSystem.markReady('${order.id}')">
                        <i class="fas fa-check"></i> جاهز
                    </button>
                `;
                break;
            case 'ready':
                actions = `
                    <button class="action-btn-small btn-ready" onclick="orderSystem.completeOrder('${order.id}')">
                        <i class="fas fa-check-double"></i> تم التسليم
                    </button>
                `;
                break;
        }
        
        // إضافة الأزرار المشتركة
        actions += `
            <button class="action-btn-small btn-details" onclick="orderSystem.showOrderDetails('${order.id}')">
                <i class="fas fa-info-circle"></i> التفاصيل
            </button>
            <button class="action-btn-small btn-print" onclick="orderSystem.printOrder('${order.id}')">
                <i class="fas fa-print"></i> طباعة
            </button>
        `;
        
        // زر الإلغاء للطلبات غير المكتملة
        if (order.status !== 'completed') {
            actions += `
                <button class="action-btn-small btn-cancel" onclick="orderSystem.showCancelDialog('${order.id}')">
                    <i class="fas fa-times"></i> إلغاء
                </button>
            `;
        }
        
        return actions;
    }

    /**
     * بدء تجهيز الطلب
     */
    startOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'preparing';
            order.startTime = Date.now();
            
            this.renderOrders();
            this.updateStatistics();
            this.playSound('order-start');
            this.showNotification(`تم بدء تجهيز الطلب #${orderId}`, 'success');
            
            // تسجيل النشاط
            console.log(`🎯 بدء تجهيز الطلب: ${orderId}`);
        }
    }

    /**
     * تجهيز الطلب جاهز
     */
    markReady(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'ready';
            order.readyTime = Date.now();
            
            this.renderOrders();
            this.updateStatistics();
            this.playSound('order-ready');
            this.showNotification(`الطلب #${orderId} جاهز للتسليم!`, 'success');
            
            // طباعة تلقائية إذا كانت مفعلة
            if (this.settings.autoPrint) {
                this.printOrder(orderId);
            }
            
            console.log(`✅ الطلب جاهز: ${orderId}`);
        }
    }

    /**
     * إكمال الطلب
     */
    completeOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'completed';
            order.completedTime = Date.now();
            
            // إضافة تأثير الإكمال
            const orderCard = document.querySelector(`[data-order-id="${orderId}"]`);
            if (orderCard) {
                orderCard.classList.add('completed');
                
                // إخفاء الطلب بعد 3 ثوان
                setTimeout(() => {
                    orderCard.classList.add('fade-out');
                    setTimeout(() => {
                        this.renderOrders();
                        this.updateStatistics();
                    }, 500);
                }, 3000);
            }
            
            this.playSound('order-complete');
            this.showNotification(`تم تسليم الطلب #${orderId} بنجاح!`, 'success');
            
            console.log(`🎉 تم إكمال الطلب: ${orderId}`);
        }
    }

    /**
     * إظهار تفاصيل الطلب
     */
    showOrderDetails(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;
        
        document.getElementById('modal-order-id').textContent = order.id;
        
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <div class="order-details-content">
                <div class="detail-section">
                    <h3><i class="fas fa-user"></i> معلومات العميل</h3>
                    <p><strong>الاسم:</strong> ${order.customerName}</p>
                    <p><strong>الهاتف:</strong> ${order.customerPhone}</p>
                    <p><strong>العنوان:</strong> ${order.customerAddress}</p>
                    <p><strong>نوع الطلب:</strong> ${order.orderType === 'delivery' ? 'توصيل' : 'استلام'}</p>
                    ${order.loyaltyPoints ? `<p><strong>نقاط الولاء:</strong> ${order.loyaltyPoints} نقطة</p>` : ''}
                    ${order.orderHistory ? `<p><strong>عدد الطلبات السابقة:</strong> ${order.orderHistory} طلب</p>` : ''}
                    ${order.customerNotes ? `<p><strong>ملاحظات العميل:</strong> ${order.customerNotes}</p>` : ''}
                </div>
                
                <div class="detail-section">
                    <h3><i class="fas fa-clock"></i> معلومات التوقيت</h3>
                    <p><strong>وقت الطلب:</strong> ${new Date(order.timestamp).toLocaleString('ar-SA')}</p>
                    <p><strong>الوقت المنقضي:</strong> ${order.timeElapsed}</p>
                    <p><strong>الوقت المتوقع:</strong> ${order.estimatedTime} دقيقة</p>
                    ${order.startTime ? `<p><strong>وقت بدء التجهيز:</strong> ${new Date(order.startTime).toLocaleTimeString('ar-SA')}</p>` : ''}
                    ${order.readyTime ? `<p><strong>وقت الجاهزية:</strong> ${new Date(order.readyTime).toLocaleTimeString('ar-SA')}</p>` : ''}
                </div>
                
                <div class="detail-section">
                    <h3><i class="fas fa-list"></i> تفاصيل الطلب</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8f9fa; border-bottom: 2px solid #dee2e6;">
                                <th style="padding: 0.8rem; text-align: right;">الصنف</th>
                                <th style="padding: 0.8rem; text-align: center;">الكمية</th>
                                <th style="padding: 0.8rem; text-align: center;">السعر</th>
                                <th style="padding: 0.8rem; text-align: center;">الملاحظات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr style="border-bottom: 1px solid #dee2e6;">
                                    <td style="padding: 0.8rem;">${item.name}</td>
                                    <td style="padding: 0.8rem; text-align: center;">${item.quantity}</td>
                                    <td style="padding: 0.8rem; text-align: center;">${item.price.toFixed(2)} ج.م</td>
                                    <td style="padding: 0.8rem; text-align: center;">${item.notes || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr style="background: #f8f9fa; font-weight: bold;">
                                <td colspan="2" style="padding: 1rem; text-align: right;">الإجمالي:</td>
                                <td style="padding: 1rem; text-align: center;">${order.total.toFixed(2)} ج.م</td>
                                <td style="padding: 1rem;"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                <div class="detail-section">
                    <h3><i class="fas fa-credit-card"></i> معلومات الدفع</h3>
                    <p><strong>طريقة الدفع:</strong> ${order.paymentMethod === 'cash' ? 'نقدي' : 'بطاقة'}</p>
                    <p><strong>الأولوية:</strong> ${this.getPriorityText(order.priority)}</p>
                    ${order.specialInstructions ? `<p><strong>تعليمات خاصة:</strong> ${order.specialInstructions}</p>` : ''}
                </div>
            </div>
        `;
        
        document.getElementById('order-details-modal').style.display = 'block';
    }

    /**
     * الحصول على نص الأولوية
     */
    getPriorityText(priority) {
        const priorityTexts = {
            'normal': 'عادي',
            'high': 'عالي',
            'urgent': 'عاجل جداً'
        };
        return priorityTexts[priority] || priority;
    }

    /**
     * طباعة الطلب
     */
    printOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;
        
        const printWindow = window.open('', '_blank');
        const printContent = this.generatePrintContent(order);
        
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
        
        this.showNotification(`تم إرسال الطلب #${orderId} للطباعة`, 'info');
    }

    /**
     * إنشاء محتوى الطباعة
     */
    generatePrintContent(order) {
        const now = new Date().toLocaleString('ar-SA');
        
        return `
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
                <meta charset="UTF-8">
                <title>طلب #${order.id}</title>
                <style>
                    body { font-family: Arial, sans-serif; direction: rtl; margin: 20px; }
                    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
                    .section { margin-bottom: 15px; }
                    .section h3 { background: #f0f0f0; padding: 5px; margin: 0 0 10px 0; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
                    th, td { border: 1px solid #000; padding: 8px; text-align: center; }
                    th { background: #f0f0f0; }
                    .total { font-weight: bold; background: #f0f0f0; }
                    .footer { text-align: center; margin-top: 30px; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>السوبر ماركت الرائد</h1>
                    <h2>فاتورة طلب #${order.id}</h2>
                    <p>تاريخ الطباعة: ${now}</p>
                </div>
                
                <div class="section">
                    <h3>معلومات العميل</h3>
                    <p><strong>الاسم:</strong> ${order.customerName}</p>
                    <p><strong>الهاتف:</strong> ${order.customerPhone}</p>
                    <p><strong>العنوان:</strong> ${order.customerAddress}</p>
                    <p><strong>نوع الطلب:</strong> ${order.orderType === 'delivery' ? 'توصيل' : 'استلام'}</p>
                </div>
                
                <div class="section">
                    <h3>تفاصيل الطلب</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>الصنف</th>
                                <th>الكمية</th>
                                <th>السعر</th>
                                <th>الإجمالي</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.quantity}</td>
                                    <td>${item.price.toFixed(2)} ج.م</td>
                                    <td>${(item.quantity * item.price).toFixed(2)} ج.م</td>
                                </tr>
                            `).join('')}
                            <tr class="total">
                                <td colspan="3">الإجمالي الكلي</td>
                                <td>${order.total.toFixed(2)} ج.م</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="section">
                    <h3>معلومات إضافية</h3>
                    <p><strong>طريقة الدفع:</strong> ${order.paymentMethod === 'cash' ? 'نقدي' : 'بطاقة'}</p>
                    <p><strong>وقت الطلب:</strong> ${new Date(order.timestamp).toLocaleString('ar-SA')}</p>
                    ${order.specialInstructions ? `<p><strong>تعليمات خاصة:</strong> ${order.specialInstructions}</p>` : ''}
                </div>
                
                <div class="footer">
                    <p>شكراً لتعاملكم معنا</p>
                    <p>خدمة العملاء: 19999 | www.supermarket.com</p>
                </div>
            </body>
            </html>
        `;
    }

    /**
     * إظهار حوار الإلغاء
     */
    showCancelDialog(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;
        
        const reason = prompt(`هل أنت متأكد من إلغاء الطلب #${orderId}؟\n\nيرجى إدخال سبب الإلغاء:`);
        
        if (reason !== null && reason.trim() !== '') {
            this.cancelOrder(orderId, reason.trim());
        }
    }

    /**
     * إلغاء الطلب
     */
    cancelOrder(orderId, reason) {
        const orderIndex = this.orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            const order = this.orders[orderIndex];
            order.status = 'cancelled';
            order.cancelReason = reason;
            order.cancelTime = Date.now();
            
            // إزالة الطلب من القائمة بعد 2 ثانية
            setTimeout(() => {
                this.orders.splice(orderIndex, 1);
                this.renderOrders();
                this.updateStatistics();
            }, 2000);
            
            this.playSound('order-cancel');
            this.showNotification(`تم إلغاء الطلب #${orderId}\nالسبب: ${reason}`, 'warning');
            
            console.log(`❌ تم إلغاء الطلب: ${orderId} - السبب: ${reason}`);
        }
    }

    /**
     * تحديث الإحصائيات
     */
    updateStatistics() {
        const pending = this.orders.filter(o => o.status === 'pending').length;
        const active = this.orders.filter(o => o.status === 'preparing').length;
        const ready = this.orders.filter(o => o.status === 'ready').length;
        
        document.getElementById('pending-count').textContent = pending;
        document.getElementById('active-count').textContent = active;
        document.getElementById('ready-count').textContent = ready;
        
        // تحديث عنوان الصفحة
        const totalActive = pending + active + ready;
        document.title = totalActive > 0 
            ? `(${totalActive}) نظام تجهيز الأوردرات` 
            : 'نظام تجهيز الأوردرات';
    }

    /**
     * تطبيق التصفية
     */
    setFilter(filter) {
        this.currentFilter = filter;
        
        // تحديث أزرار التصفية
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.renderOrders();
    }

    /**
     * تحديث الطلبات
     */
    refreshOrders() {
        // محاكاة تحديث الطلبات من الخادم
        this.showNotification('جاري تحديث الطلبات...', 'info');
        
        // إضافة طلب جديد عشوائي أحياناً
        if (Math.random() > 0.7) {
            this.addNewRandomOrder();
        }
        
        this.renderOrders();
        this.updateStatistics();
        
        setTimeout(() => {
            this.showNotification('تم تحديث الطلبات بنجاح', 'success');
        }, 1000);
    }

    /**
     * إضافة طلب جديد عشوائي
     */
    addNewRandomOrder() {
        // استخدام مدير البيانات لإنشاء طلب واقعي جديد
        const newOrder = this.dataManager.generateRandomOrder();
        
        this.orders.unshift(newOrder);
        this.playSound('new-order');
        this.showNotification(`طلب جديد #${newOrder.id}`, 'info');
        
        // إضافة تأثير الطلب الجديد
        setTimeout(() => {
            const newCard = document.querySelector(`[data-order-id="${newOrder.id}"]`);
            if (newCard) {
                newCard.classList.add('new-order');
                setTimeout(() => newCard.classList.remove('new-order'), 2000);
            }
        }, 100);
    }

    /**
     * تشغيل الصوت
     */
    playSound(type) {
        if (!this.settings.soundNotifications) return;
        
        try {
            let audioElement;
            switch (type) {
                case 'new-order':
                    audioElement = document.getElementById('new-order-sound');
                    break;
                case 'order-ready':
                    audioElement = document.getElementById('order-ready-sound');
                    break;
                default:
                    return;
            }
            
            if (audioElement) {
                audioElement.volume = this.settings.volume / 100;
                audioElement.currentTime = 0;
                audioElement.play().catch(e => console.warn('Could not play sound:', e));
            }
        } catch (error) {
            console.warn('Audio playback error:', error);
        }
    }

    /**
     * إظهار إشعار
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        const panel = document.getElementById('notifications-panel');
        panel.appendChild(notification);
        
        // إزالة الإشعار بعد 5 ثوان
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    /**
     * إعداد التحديث التلقائي
     */
    setupAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
        }
        
        if (this.settings.autoRefresh) {
            const interval = this.settings.refreshInterval * 1000;
            this.autoRefreshInterval = setInterval(() => {
                this.refreshOrders();
            }, interval);
        }
    }

    /**
     * إظهار الإعدادات
     */
    openSettings() {
        // تحديث قيم الإعدادات في النموذج
        document.getElementById('sound-notifications').checked = this.settings.soundNotifications;
        document.getElementById('volume-control').value = this.settings.volume;
        document.getElementById('auto-refresh').checked = this.settings.autoRefresh;
        document.getElementById('refresh-interval').value = this.settings.refreshInterval;
        document.getElementById('auto-print').checked = this.settings.autoPrint;
        document.getElementById('print-font-size').value = this.settings.printFontSize;
        
        document.getElementById('settings-modal').style.display = 'block';
    }

    /**
     * حفظ الإعدادات
     */
    saveSettings() {
        this.settings = {
            soundNotifications: document.getElementById('sound-notifications').checked,
            volume: parseInt(document.getElementById('volume-control').value),
            autoRefresh: document.getElementById('auto-refresh').checked,
            refreshInterval: parseInt(document.getElementById('refresh-interval').value),
            autoPrint: document.getElementById('auto-print').checked,
            printFontSize: document.getElementById('print-font-size').value
        };
        
        localStorage.setItem('orderSystemSettings', JSON.stringify(this.settings));
        this.setupAutoRefresh();
        this.closeSettingsModal();
        this.showNotification('تم حفظ الإعدادات بنجاح', 'success');
    }

    /**
     * تحميل الإعدادات
     */
    loadSettings() {
        const defaultSettings = {
            soundNotifications: true,
            volume: 70,
            autoRefresh: true,
            refreshInterval: 30,
            autoPrint: true,
            printFontSize: 'medium',
            productionMode: false
        };
        
        try {
            const saved = localStorage.getItem('orderSystemSettings');
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch (error) {
            console.warn('Could not load settings:', error);
            return defaultSettings;
        }
    }

    /**
     * طباعة التقرير اليومي
     */
    printDailyReport() {
        const reportData = this.reportsGenerator.generateDailyReport(this.orders);
        const reportHTML = this.reportsGenerator.generatePrintableReport(reportData);
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(reportHTML);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
        
        this.showNotification('تم إرسال التقرير اليومي المتقدم للطباعة', 'info');
    }

    /**
     * وضع الطوارئ
     */
    emergencyMode() {
        const isEmergency = confirm('هل تريد تفعيل وضع الطوارئ؟\n\nسيتم:\n- إيقاف التحديث التلقائي\n- إعطاء أولوية عالية لجميع الطلبات الجديدة\n- تفعيل التنبيهات الصوتية بحد أقصى');
        
        if (isEmergency) {
            this.settings.autoRefresh = false;
            this.settings.soundNotifications = true;
            this.settings.volume = 100;
            this.setupAutoRefresh();
            
            // تغيير أولوية جميع الطلبات المعلقة
            this.orders.forEach(order => {
                if (order.status === 'pending') {
                    order.priority = 'urgent';
                }
            });
            
            this.renderOrders();
            this.showNotification('تم تفعيل وضع الطوارئ!', 'warning');
            
            // تغيير لون الخلفية
            document.body.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
            
            // إعادة تعيين وضع الطوارئ بعد 10 دقائق
            setTimeout(() => {
                this.exitEmergencyMode();
            }, 600000);
        }
    }

    /**
     * الخروج من وضع الطوارئ
     */
    exitEmergencyMode() {
        document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        this.settings.autoRefresh = true;
        this.setupAutoRefresh();
        this.showNotification('تم إلغاء وضع الطوارئ', 'info');
    }

    /**
     * إغلاق النموذج المنبثق
     */
    closeModal() {
        document.getElementById('order-details-modal').style.display = 'none';
    }

    /**
     * إغلاق نموذج الإعدادات
     */
    closeSettingsModal() {
        document.getElementById('settings-modal').style.display = 'none';
    }

    /**
     * تحديث حالة الطلب من النموذج المنبثق
     */
    updateOrderStatus() {
        const orderId = document.getElementById('modal-order-id').textContent;
        const order = this.orders.find(o => o.id === orderId);
        
        if (order) {
            switch (order.status) {
                case 'pending':
                    this.startOrder(orderId);
                    break;
                case 'preparing':
                    this.markReady(orderId);
                    break;
                case 'ready':
                    this.completeOrder(orderId);
                    break;
            }
            this.closeModal();
        }
    }

    /**
     * تسجيل الخروج
     */
    logout() {
        const confirm = window.confirm('هل أنت متأكد من تسجيل الخروج؟');
        if (confirm) {
            localStorage.removeItem('operatorName');
            window.location.href = 'login.html';
        }
    }
}

// إنشاء النظام وبدء التشغيل
let orderSystem;

document.addEventListener('DOMContentLoaded', () => {
    orderSystem = new OrderFulfillmentSystem();
});

// الوظائف العامة للاستخدام في HTML
function refreshOrders() {
    orderSystem.refreshOrders();
}

function printDailyReport() {
    orderSystem.printDailyReport();
}

function openSettings() {
    orderSystem.openSettings();
}

function emergencyMode() {
    orderSystem.emergencyMode();
}

function closeModal() {
    orderSystem.closeModal();
}

function closeSettingsModal() {
    orderSystem.closeSettingsModal();
}

function updateOrderStatus() {
    orderSystem.updateOrderStatus();
}

function printOrder() {
    const orderId = document.getElementById('modal-order-id').textContent;
    orderSystem.printOrder(orderId);
}

function cancelOrder() {
    const orderId = document.getElementById('modal-order-id').textContent;
    orderSystem.showCancelDialog(orderId);
    orderSystem.closeModal();
}

function saveSettings() {
    orderSystem.saveSettings();
}

function logout() {
    orderSystem.logout();
}

// معالجة الأخطاء العامة
window.addEventListener('error', (event) => {
    console.error('خطأ في النظام:', event.error);
    if (orderSystem) {
        orderSystem.showNotification('حدث خطأ في النظام', 'error');
    }
});

// منع إغلاق الصفحة بالخطأ
window.addEventListener('beforeunload', (event) => {
    if (orderSystem && orderSystem.orders.some(o => o.status !== 'completed')) {
        event.preventDefault();
        event.returnValue = 'يوجد طلبات غير مكتملة. هل أنت متأكد من الخروج؟';
    }
});

console.log('🎯 نظام تجهيز الأوردرات المتقدم تم تحميله بنجاح!');