// Kitchen Dashboard Functions

// Kitchen Order Data
let kitchenData = {
    newOrders: [],
    preparingOrders: [],
    readyOrders: [],
    completedOrders: [],
    currentOrder: null,
    currentProduct: null,
    filters: {
        sortBy: 'time-desc',
        orderTypes: ['dine-in', 'takeaway', 'delivery']
    }
};

// Initialize Kitchen Dashboard
function initializeKitchenDashboard() {
    loadSampleKitchenOrders();
    updateOrderCounts();
    loadOrdersByStatus('new');
    checkForNewOrders();
    
    // Auto-refresh every 30 seconds
    setInterval(() => {
        refreshOrders();
    }, 30000);
}

// Load Sample Kitchen Orders
function loadSampleKitchenOrders() {
    kitchenData.newOrders = [
        {
            id: 'ORD-2025-001',
            customer: {
                name: 'أحمد محمد',
                phone: '01234567890',
                address: 'القاهرة - مدينة نصر - شارع مصطفى النحاس'
            },
            type: 'delivery',
            items: [
                {
                    id: 1,
                    name: 'برجر لحم مشوي',
                    price: 45,
                    quantity: 2,
                    status: 'pending',
                    notes: 'بدون بصل'
                },
                {
                    id: 2,
                    name: 'بطاطس مقلية كبيرة',
                    price: 25,
                    quantity: 1,
                    status: 'pending'
                },
                {
                    id: 3,
                    name: 'كوكا كولا',
                    price: 15,
                    quantity: 2,
                    status: 'ready'
                }
            ],
            totalAmount: 130,
            orderDate: new Date().toLocaleString('ar-EG'),
            priority: 'normal',
            paymentMethod: 'كاش',
            estimatedTime: 25,
            notes: 'طلب عاجل - عميل مهم'
        },
        {
            id: 'ORD-2025-002',
            customer: {
                name: 'فاطمة أحمد',
                phone: '01098765432'
            },
            type: 'takeaway',
            items: [
                {
                    id: 4,
                    name: 'شاورما دجاج',
                    price: 35,
                    quantity: 1,
                    status: 'pending'
                },
                {
                    id: 5,
                    name: 'سلطة خضراء',
                    price: 20,
                    quantity: 1,
                    status: 'pending'
                }
            ],
            totalAmount: 55,
            orderDate: new Date().toLocaleString('ar-EG'),
            priority: 'urgent',
            paymentMethod: 'بطاقة ائتمان',
            estimatedTime: 15
        },
        {
            id: 'ORD-2025-003',
            customer: {
                name: 'محمد علي',
                phone: '01156789043',
                tableNumber: 5
            },
            type: 'dine-in',
            items: [
                {
                    id: 6,
                    name: 'فراخ مشوية',
                    price: 80,
                    quantity: 1,
                    status: 'pending'
                },
                {
                    id: 7,
                    name: 'أرز أبيض',
                    price: 15,
                    quantity: 2,
                    status: 'pending'
                },
                {
                    id: 8,
                    name: 'شوربة عدس',
                    price: 12,
                    quantity: 1,
                    status: 'pending'
                }
            ],
            totalAmount: 122,
            orderDate: new Date().toLocaleString('ar-EG'),
            priority: 'normal',
            paymentMethod: 'كاش',
            estimatedTime: 30
        }
    ];
    
    kitchenData.preparingOrders = [
        {
            id: 'ORD-2025-004',
            customer: {
                name: 'سارة حسن',
                phone: '01067890123'
            },
            type: 'delivery',
            items: [
                {
                    id: 9,
                    name: 'بيتزا مارجريتا',
                    price: 65,
                    quantity: 1,
                    status: 'preparing'
                },
                {
                    id: 10,
                    name: 'عصير برتقال طازج',
                    price: 18,
                    quantity: 1,
                    status: 'ready'
                }
            ],
            totalAmount: 83,
            orderDate: new Date(Date.now() - 600000).toLocaleString('ar-EG'),
            priority: 'normal',
            paymentMethod: 'فيزا',
            estimatedTime: 20,
            startedAt: new Date(Date.now() - 300000)
        }
    ];
}

// Update Order Counts
function updateOrderCounts() {
    document.getElementById('new-orders-count').textContent = kitchenData.newOrders.length;
    document.getElementById('preparing-orders-count').textContent = kitchenData.preparingOrders.length;
    document.getElementById('ready-orders-count').textContent = kitchenData.readyOrders.length;
    document.getElementById('completed-orders-count').textContent = kitchenData.completedOrders.length;
    
    const totalActive = kitchenData.newOrders.length + kitchenData.preparingOrders.length + kitchenData.readyOrders.length;
    document.getElementById('total-active-orders').textContent = totalActive;
}

// Load Orders by Status
function loadOrdersByStatus(status) {
    const container = document.getElementById(`${status}-orders-grid`);
    let orders = [];
    
    switch(status) {
        case 'new':
            orders = kitchenData.newOrders;
            break;
        case 'preparing':
            orders = kitchenData.preparingOrders;
            break;
        case 'ready':
            orders = kitchenData.readyOrders;
            break;
        case 'completed':
            orders = kitchenData.completedOrders;
            break;
    }
    
    if (orders.length === 0) {
        container.innerHTML = getEmptyStateHTML(status);
        return;
    }
    
    // Apply filters
    orders = applyOrderFilters(orders);
    
    container.innerHTML = orders.map(order => createOrderCardHTML(order, status)).join('');
}

// Get Empty State HTML
function getEmptyStateHTML(status) {
    const messages = {
        'new': {
            icon: 'fa-bell-slash',
            title: 'لا توجد طلبات جديدة',
            message: 'ابدأ بتجهيز الطلبات الجديدة'
        },
        'preparing': {
            icon: 'fa-box',
            title: 'لا توجد طلبات قيد التجهيز',
            message: 'سيتم عرض الطلبات التي تتم معالجتها هنا'
        },
        'ready': {
            icon: 'fa-check-circle',
            title: 'لا توجد طلبات جاهزة',
            message: 'الطلبات الجاهزة للتسليم ستظهر هنا'
        },
        'completed': {
            icon: 'fa-archive',
            title: 'لا توجد طلبات مكتملة',
            message: 'الطلبات المكتملة ستظهر هنا'
        }
    };
    
    const msg = messages[status];
    return `
        <div class="empty-state">
            <i class="fas ${msg.icon}"></i>
            <h3>${msg.title}</h3>
            <p>${msg.message}</p>
        </div>
    `;
}

// Create Order Card HTML
function createOrderCardHTML(order, status) {
    const timeElapsed = getTimeElapsed(order.orderDate);
    const urgentClass = order.priority === 'urgent' ? 'urgent' : '';
    const preparingTime = order.startedAt ? getTimeElapsed(order.startedAt) : null;
    
    return `
        <div class="order-card ${urgentClass}" data-order-id="${order.id}">
            <div class="order-header">
                <div class="order-id">${order.id}</div>
                <div class="order-time">${timeElapsed}</div>
            </div>
            
            <div class="customer-info">
                <div class="customer-name">
                    <i class="fas fa-user"></i>
                    ${order.customer.name}
                </div>
                <div class="customer-phone">
                    <i class="fas fa-phone"></i>
                    ${order.customer.phone}
                </div>
                ${order.customer.tableNumber ? `
                    <div class="table-number">
                        <i class="fas fa-utensils"></i>
                        طاولة رقم ${order.customer.tableNumber}
                    </div>
                ` : ''}
                <div class="order-type ${order.type}">
                    ${getOrderTypeText(order.type)}
                </div>
            </div>
            
            ${preparingTime ? `
                <div class="preparing-time">
                    <i class="fas fa-clock"></i>
                    وقت التجهيز: ${preparingTime}
                </div>
            ` : ''}
            
            <div class="order-items">
                <h4><i class="fas fa-list"></i> الأصناف (${order.items.length})</h4>
                <div class="items-list">
                    ${order.items.map(item => `
                        <div class="item-row" onclick="openProductActionModal('${order.id}', ${item.id})">
                            <div class="item-info">
                                <div class="item-name">${item.name}</div>
                                <div class="item-quantity">الكمية: ${item.quantity}</div>
                                ${item.notes ? `<div class="item-notes">ملاحظة: ${item.notes}</div>` : ''}
                            </div>
                            <div class="item-status ${item.status}">
                                ${getItemStatusText(item.status)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="order-total">
                المجموع: ${order.totalAmount} ج.م
            </div>
            
            ${order.notes ? `
                <div class="order-notes">
                    <i class="fas fa-sticky-note"></i>
                    ${order.notes}
                </div>
            ` : ''}
            
            <div class="order-actions">
                ${getOrderActionButtons(order, status)}
            </div>
        </div>
    `;
}

// Get Order Type Text
function getOrderTypeText(type) {
    const typeMap = {
        'delivery': 'توصيل',
        'takeaway': 'استلام',
        'dine-in': 'تناول في المطعم'
    };
    return typeMap[type] || type;
}

// Get Item Status Text
function getItemStatusText(status) {
    const statusMap = {
        'pending': 'قيد الانتظار',
        'preparing': 'يتم التجهيز',
        'ready': 'جاهز',
        'unavailable': 'غير متاح'
    };
    return statusMap[status] || status;
}

// Get Order Action Buttons
function getOrderActionButtons(order, status) {
    switch(status) {
        case 'new':
            return `
                <button class="btn btn-info" onclick="showOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i> عرض التفاصيل
                </button>
                <button class="btn btn-primary" onclick="startOrderPreparation('${order.id}')">
                    <i class="fas fa-play"></i> بدء التجهيز
                </button>
            `;
        case 'preparing':
            return `
                <button class="btn btn-info" onclick="showOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i> عرض التفاصيل
                </button>
                <button class="btn btn-success" onclick="markOrderReady('${order.id}')">
                    <i class="fas fa-check"></i> جاهز للتسليم
                </button>
            `;
        case 'ready':
            return `
                <button class="btn btn-info" onclick="showOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i> عرض التفاصيل
                </button>
                <button class="btn btn-primary" onclick="completeOrder('${order.id}')">
                    <i class="fas fa-truck"></i> تم التسليم
                </button>
            `;
        case 'completed':
            return `
                <button class="btn btn-info" onclick="showOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i> عرض التفاصيل
                </button>
            `;
        default:
            return '';
    }
}

// Get Time Elapsed
function getTimeElapsed(dateString) {
    const orderTime = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - orderTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `${diffInMinutes} دقيقة`;
    
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    
    if (hours < 24) {
        return minutes > 0 ? `${hours} ساعة و ${minutes} دقيقة` : `${hours} ساعة`;
    }
    
    const days = Math.floor(hours / 24);
    return `${days} يوم`;
}

// Start Order Preparation
function startOrderPreparation(orderId) {
    const orderIndex = kitchenData.newOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return;
    
    const order = kitchenData.newOrders.splice(orderIndex, 1)[0];
    order.status = 'preparing';
    order.startedAt = new Date();
    kitchenData.preparingOrders.push(order);
    
    updateOrderCounts();
    loadOrdersByStatus('new');
    loadOrdersByStatus('preparing');
    
    playNotificationSound();
    showSuccessMessage('تم نقل الطلب إلى قيد التجهيز');
}

// Mark Order Ready
function markOrderReady(orderId) {
    const orderIndex = kitchenData.preparingOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return;
    
    const order = kitchenData.preparingOrders.splice(orderIndex, 1)[0];
    order.status = 'ready';
    order.readyAt = new Date();
    kitchenData.readyOrders.push(order);
    
    updateOrderCounts();
    loadOrdersByStatus('preparing');
    loadOrdersByStatus('ready');
    
    playNotificationSound();
    showSuccessMessage('تم وضع الطلب كجاهز للتسليم');
}

// Complete Order
function completeOrder(orderId) {
    const orderIndex = kitchenData.readyOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return;
    
    const order = kitchenData.readyOrders.splice(orderIndex, 1)[0];
    order.status = 'completed';
    order.completedAt = new Date();
    kitchenData.completedOrders.push(order);
    
    updateOrderCounts();
    loadOrdersByStatus('ready');
    loadOrdersByStatus('completed');
    
    showSuccessMessage('تم تسليم الطلب بنجاح');
}

// Show Order Details
function showOrderDetails(orderId) {
    const order = findOrderById(orderId);
    if (!order) return;
    
    const modal = document.getElementById('order-details-modal');
    const content = document.getElementById('order-details-content');
    
    content.innerHTML = `
        <div class="order-details-header">
            <div class="order-summary">
                <h4>معلومات الطلب</h4>
                <div class="detail-row"><strong>رقم الطلب:</strong> ${order.id}</div>
                <div class="detail-row"><strong>اسم العميل:</strong> ${order.customer.name}</div>
                <div class="detail-row"><strong>رقم الهاتف:</strong> ${order.customer.phone}</div>
                ${order.customer.address ? `<div class="detail-row"><strong>العنوان:</strong> ${order.customer.address}</div>` : ''}
                ${order.customer.tableNumber ? `<div class="detail-row"><strong>رقم الطاولة:</strong> ${order.customer.tableNumber}</div>` : ''}
                <div class="detail-row"><strong>نوع الطلب:</strong> ${getOrderTypeText(order.type)}</div>
                <div class="detail-row"><strong>طريقة الدفع:</strong> ${order.paymentMethod}</div>
                <div class="detail-row"><strong>تاريخ الطلب:</strong> ${order.orderDate}</div>
                <div class="detail-row"><strong>الأولوية:</strong> ${order.priority === 'urgent' ? 'عاجل' : 'عادي'}</div>
            </div>
        </div>
        
        <div class="order-items-details">
            <h4>تفاصيل الأصناف</h4>
            <div class="items-detailed-list">
                ${order.items.map(item => `
                    <div class="item-detailed-row">
                        <div class="item-details">
                            <h5>${item.name}</h5>
                            <div class="item-price">السعر: ${item.price} ج.م</div>
                            <div class="item-quantity">الكمية: ${item.quantity}</div>
                            <div class="item-total">المجموع: ${item.price * item.quantity} ج.م</div>
                            ${item.notes ? `<div class="item-notes">ملاحظات: ${item.notes}</div>` : ''}
                        </div>
                        <div class="item-status-badge ${item.status}">
                            ${getItemStatusText(item.status)}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        ${order.notes ? `
            <div class="order-notes-section">
                <h4>ملاحظات الطلب</h4>
                <p>${order.notes}</p>
            </div>
        ` : ''}
        
        <div class="order-total-section">
            <h3>إجمالي الطلب: ${order.totalAmount} ج.م</h3>
        </div>
    `;
    
    modal.classList.add('show');
}

// Close Order Details Modal
function closeOrderDetailsModal() {
    document.getElementById('order-details-modal').classList.remove('show');
}

// Open Product Action Modal
function openProductActionModal(orderId, itemId) {
    const order = findOrderById(orderId);
    if (!order) return;
    
    const item = order.items.find(i => i.id === itemId);
    if (!item) return;
    
    kitchenData.currentOrder = order;
    kitchenData.currentProduct = item;
    
    const modal = document.getElementById('product-action-modal');
    const content = document.getElementById('current-product-info');
    
    content.innerHTML = `
        <h4>${item.name}</h4>
        <div class="product-details">
            <p><strong>السعر:</strong> ${item.price} ج.م</p>
            <p><strong>الكمية:</strong> ${item.quantity}</p>
            <p><strong>الحالة:</strong> ${getItemStatusText(item.status)}</p>
            ${item.notes ? `<p><strong>ملاحظات:</strong> ${item.notes}</p>` : ''}
        </div>
    `;
    
    modal.classList.add('show');
}

// Close Product Action Modal
function closeProductActionModal() {
    document.getElementById('product-action-modal').classList.remove('show');
    kitchenData.currentOrder = null;
    kitchenData.currentProduct = null;
}

// Mark Product Ready
function markProductReady() {
    if (!kitchenData.currentProduct) return;
    
    kitchenData.currentProduct.status = 'ready';
    
    updateOrderDisplay();
    closeProductActionModal();
    showSuccessMessage('تم وضع الصنف كجاهز');
}

// Mark Product Out of Stock
function markProductOutOfStock() {
    if (!kitchenData.currentProduct) return;
    
    kitchenData.currentProduct.status = 'unavailable';
    
    updateOrderDisplay();
    closeProductActionModal();
    openCustomerNotificationModal('نأسف، الصنف غير متاح حالياً');
}

// Request Replacement
function requestReplacement() {
    if (!kitchenData.currentProduct) return;
    
    showSuccessMessage('تم إرسال طلب استبدال للإدارة');
    closeProductActionModal();
}

// Cancel Product
function cancelProduct() {
    if (!kitchenData.currentProduct || !kitchenData.currentOrder) return;
    
    if (confirm('هل أنت متأكد من إلغاء هذا الصنف؟')) {
        const itemIndex = kitchenData.currentOrder.items.findIndex(item => item.id === kitchenData.currentProduct.id);
        if (itemIndex > -1) {
            kitchenData.currentOrder.items.splice(itemIndex, 1);
            kitchenData.currentOrder.totalAmount -= (kitchenData.currentProduct.price * kitchenData.currentProduct.quantity);
        }
        
        updateOrderDisplay();
        closeProductActionModal();
        openCustomerNotificationModal('تم إلغاء الصنف من الطلب');
    }
}

// Open Customer Notification Modal
function openCustomerNotificationModal(defaultMessage = '') {
    const modal = document.getElementById('customer-notification-modal');
    document.getElementById('notification-message').value = defaultMessage;
    modal.classList.add('show');
}

// Close Customer Notification Modal
function closeCustomerNotificationModal() {
    document.getElementById('customer-notification-modal').classList.remove('show');
}

// Send Customer Notification
function sendCustomerNotification() {
    const message = document.getElementById('notification-message').value;
    
    // Simulate sending notification
    showSuccessMessage('تم إرسال الإشعار للعميل');
    closeCustomerNotificationModal();
}

// Toggle Order Filters
function toggleOrderFilters() {
    const modal = document.getElementById('order-filters-modal');
    modal.classList.add('show');
}

// Close Order Filters Modal
function closeOrderFiltersModal() {
    document.getElementById('order-filters-modal').classList.remove('show');
}

// Apply Order Filters
function applyOrderFilters() {
    const sortBy = document.getElementById('sort-orders').value;
    const orderTypes = Array.from(document.querySelectorAll('#order-filters-modal input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
    
    kitchenData.filters.sortBy = sortBy;
    kitchenData.filters.orderTypes = orderTypes;
    
    // Reload current tab
    const activeTab = document.querySelector('.status-nav-btn.active').getAttribute('data-status');
    loadOrdersByStatus(activeTab);
    
    closeOrderFiltersModal();
    showSuccessMessage('تم تطبيق التصفية');
}

// Reset Order Filters
function resetOrderFilters() {
    kitchenData.filters = {
        sortBy: 'time-desc',
        orderTypes: ['dine-in', 'takeaway', 'delivery']
    };
    
    document.getElementById('sort-orders').value = 'time-desc';
    document.querySelectorAll('#order-filters-modal input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = true;
    });
    
    showSuccessMessage('تم إعادة تعيين التصفية');
}

// Apply Order Filters Function
function applyOrderFilters(orders) {
    // Filter by order type
    let filteredOrders = orders.filter(order => 
        kitchenData.filters.orderTypes.includes(order.type)
    );
    
    // Sort orders
    switch(kitchenData.filters.sortBy) {
        case 'time-asc':
            filteredOrders.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
            break;
        case 'time-desc':
            filteredOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
            break;
        case 'priority':
            filteredOrders.sort((a, b) => {
                const priorityOrder = { 'urgent': 2, 'normal': 1 };
                return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
            });
            break;
        case 'items-count':
            filteredOrders.sort((a, b) => b.items.length - a.items.length);
            break;
    }
    
    return filteredOrders;
}

// Find Order by ID
function findOrderById(orderId) {
    const allOrders = [
        ...kitchenData.newOrders,
        ...kitchenData.preparingOrders,
        ...kitchenData.readyOrders,
        ...kitchenData.completedOrders
    ];
    return allOrders.find(order => order.id === orderId);
}

// Update Order Display
function updateOrderDisplay() {
    const activeTab = document.querySelector('.status-nav-btn.active').getAttribute('data-status');
    loadOrdersByStatus(activeTab);
    updateOrderCounts();
}

// Refresh Orders
function refreshOrders() {
    // Simulate checking for new orders
    checkForNewOrders();
    updateOrderDisplay();
    showSuccessMessage('تم تحديث الطلبات');
}

// Check for New Orders
function checkForNewOrders() {
    // In a real app, this would check with the server
    // For demo, we'll occasionally add a new order
    if (Math.random() < 0.1) { // 10% chance
        addNewRandomOrder();
    }
}

// Add New Random Order (for demo)
function addNewRandomOrder() {
    const newOrder = {
        id: `ORD-2025-${String(Date.now()).slice(-3)}`,
        customer: {
            name: 'عميل جديد',
            phone: '01234567890'
        },
        type: ['delivery', 'takeaway', 'dine-in'][Math.floor(Math.random() * 3)],
        items: [
            {
                id: Date.now(),
                name: 'طلب جديد',
                price: 50,
                quantity: 1,
                status: 'pending'
            }
        ],
        totalAmount: 50,
        orderDate: new Date().toLocaleString('ar-EG'),
        priority: Math.random() < 0.3 ? 'urgent' : 'normal',
        paymentMethod: 'كاش',
        estimatedTime: 20
    };
    
    kitchenData.newOrders.unshift(newOrder);
    updateOrderCounts();
    
    if (document.querySelector('.status-nav-btn.active').getAttribute('data-status') === 'new') {
        loadOrdersByStatus('new');
    }
    
    playNewOrderSound();
}

// Play Notification Sound
function playNotificationSound() {
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwgBDWDzfPJdi4DJ2nA7+KJPQ0VaLXx3J1TGw1PqOHwrEYaDF6x5O+bSAQDAA==');
        audio.play().catch(() => {}); // Ignore errors
    } catch (e) {
        // Ignore audio errors
    }
}

// Play New Order Sound
function playNewOrderSound() {
    try {
        const audio = document.getElementById('new-order-sound');
        if (audio) {
            audio.play().catch(() => {});
        }
    } catch (e) {
        // Ignore audio errors
    }
}

// Show Success Message
function showSuccessMessage(message) {
    // Create and show a temporary success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-toast';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #4caf50, #45a049);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Add required CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .success-toast {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 600;
    }
`;
document.head.appendChild(style);