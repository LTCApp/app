// ===== Order Preparation Functions =====

// Order Preparation Data
let orderPreparationData = {
    newOrders: [],
    preparingOrders: [],
    collectionOrders: [],
    completedOrders: [],
    currentOrder: null,
    currentProduct: null
};

// Initialize Order Preparation
function initializeOrderPreparation() {
    loadSampleOrders();
    setupOrderPrepEventListeners();
    updateOrderCounts();
    checkForNewOrders();
    
    // Check for new orders every 30 seconds
    setInterval(checkForNewOrders, 30000);
}

// Load Sample Orders
function loadSampleOrders() {
    orderPreparationData.newOrders = [
        {
            id: 'ORD-2024-001',
            customer: {
                name: 'أحمد محمد',
                phone: '0512345678',
                address: 'الرياض - حي النخيل - شارع الملك فهد'
            },
            items: [
                {
                    id: 1,
                    name: 'آيفون 15 برو ماكس',
                    price: 5000,
                    quantity: 1,
                    status: 'pending',
                    image: 'https://images.unsplash.com/photo-1592286927505-2fd0d113e4e7?w=200'
                },
                {
                    id: 2,
                    name: 'إير بودز برو',
                    price: 900,
                    quantity: 1,
                    status: 'pending',
                    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=200'
                }
            ],
            paymentMethod: 'كاش',
            totalAmount: 5900,
            status: 'new',
            orderDate: '2024-10-03 14:30',
            notes: 'يرجى التوصيل قبل الساعة 6 مساءً'
        },
        {
            id: 'ORD-2024-002',
            customer: {
                name: 'فاطمة علي',
                phone: '0555123456',
                address: 'الرياض - حي العليا - شارع الأمير سلطان'
            },
            items: [
                {
                    id: 3,
                    name: 'سامسونج جالاكسي S24',
                    price: 3500,
                    quantity: 1,
                    status: 'pending',
                    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200'
                },
                {
                    id: 4,
                    name: 'شاحن لاسلكي',
                    price: 200,
                    quantity: 2,
                    status: 'pending',
                    image: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=200'
                }
            ],
            paymentMethod: 'بطاقة ائتمان',
            totalAmount: 3900,
            status: 'new',
            orderDate: '2024-10-03 14:45',
            notes: 'يرجى الاتصال قبل التوصيل'
        }
    ];
}

// Setup Event Listeners for Order Preparation
function setupOrderPrepEventListeners() {
    // Navigation buttons
    document.querySelectorAll('.prep-nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-prep-tab');
            switchOrderPrepTab(tab);
        });
    });
}

// Switch Order Preparation Tab
function switchOrderPrepTab(tab) {
    // Update navigation buttons
    document.querySelectorAll('.prep-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-prep-tab="${tab}"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.prep-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tab}-tab`).classList.add('active');
    
    // Load content for the tab
    loadOrderPrepTab(tab);
}

// Load Order Preparation Tab Content
function loadOrderPrepTab(tab) {
    switch(tab) {
        case 'new-orders':
            loadNewOrders();
            break;
        case 'preparing-orders':
            loadPreparingOrders();
            break;
        case 'collection-orders':
            loadCollectionOrders();
            break;
        case 'completed-orders':
            loadCompletedOrders();
            break;
    }
}

// Load New Orders
function loadNewOrders() {
    const container = document.getElementById('new-orders-list');
    container.innerHTML = '';
    
    if (orderPreparationData.newOrders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bell-slash"></i>
                <h3>لا توجد طلبات جديدة</h3>
                <p>سيتم إشعارك عند وصول طلبات جديدة</p>
            </div>
        `;
        return;
    }
    
    orderPreparationData.newOrders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.innerHTML = `
            <div class="order-header">
                <div class="order-info">
                    <div class="order-number">${order.id}</div>
                    <div class="customer-name">${order.customer.name}</div>
                    <div class="customer-phone">
                        <i class="fas fa-phone"></i>
                        ${order.customer.phone}
                    </div>
                </div>
                <div class="order-status new">جديد</div>
            </div>
            
            <div class="order-details">
                <div class="order-detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${order.customer.address}</span>
                </div>
                <div class="order-detail-item">
                    <i class="fas fa-credit-card"></i>
                    <span>${order.paymentMethod}</span>
                </div>
                <div class="order-detail-item">
                    <i class="fas fa-calendar"></i>
                    <span>${order.orderDate}</span>
                </div>
                <div class="order-detail-item">
                    <i class="fas fa-shopping-bag"></i>
                    <span>${order.items.length} أصناف</span>
                </div>
            </div>
            
            <div class="order-amount">${formatCurrency(order.totalAmount)}</div>
            
            <div class="order-actions">
                <button class="order-action-btn primary" onclick="showOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i>
                    عرض التفاصيل
                </button>
                <button class="order-action-btn success" onclick="startOrderPreparation('${order.id}')">
                    <i class="fas fa-play"></i>
                    بدء التجهيز
                </button>
            </div>
        `;
        container.appendChild(orderCard);
    });
}

// Load Preparing Orders
function loadPreparingOrders() {
    const container = document.getElementById('preparing-orders-list');
    container.innerHTML = '';
    
    if (orderPreparationData.preparingOrders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>لا توجد طلبات قيد التجهيز</h3>
                <p>ابدأ بتجهيز الطلبات الجديدة</p>
            </div>
        `;
        return;
    }
    
    orderPreparationData.preparingOrders.forEach(order => {
        const preparedItems = order.items.filter(item => item.status === 'prepared').length;
        const totalItems = order.items.length;
        const progress = (preparedItems / totalItems) * 100;
        
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.innerHTML = `
            <div class="order-header">
                <div class="order-info">
                    <div class="order-number">${order.id}</div>
                    <div class="customer-name">${order.customer.name}</div>
                </div>
                <div class="order-status preparing">قيد التجهيز</div>
            </div>
            
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="progress-text">${preparedItems} من ${totalItems} تم التجهيز</div>
            
            <div class="order-amount">${formatCurrency(order.totalAmount)}</div>
            
            <div class="order-actions">
                <button class="order-action-btn primary" onclick="showOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i>
                    عرض التفاصيل
                </button>
                ${preparedItems === totalItems ? 
                    `<button class="order-action-btn success" onclick="completeOrderPreparation('${order.id}')">
                        <i class="fas fa-check"></i>
                        إكمال التجهيز
                    </button>` : ''
                }
            </div>
        `;
        container.appendChild(orderCard);
    });
}

// Load Collection Orders
function loadCollectionOrders() {
    const container = document.getElementById('collection-orders-list');
    container.innerHTML = '';
    
    if (orderPreparationData.collectionOrders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-money-bill-wave"></i>
                <h3>لا توجد طلبات تحت التحصيل</h3>
                <p>سيتم إضافة الطلبات الجاهزة هنا</p>
            </div>
        `;
        return;
    }
    
    orderPreparationData.collectionOrders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.innerHTML = `
            <div class="order-header">
                <div class="order-info">
                    <div class="order-number">${order.id}</div>
                    <div class="customer-name">${order.customer.name}</div>
                    <div class="customer-phone">
                        <i class="fas fa-phone"></i>
                        ${order.customer.phone}
                    </div>
                </div>
                <div class="order-status ready">جاهز للتحصيل</div>
            </div>
            
            <div class="order-details">
                <div class="order-detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${order.customer.address}</span>
                </div>
                <div class="order-detail-item">
                    <i class="fas fa-credit-card"></i>
                    <span>${order.paymentMethod}</span>
                </div>
            </div>
            
            <div class="order-amount">${formatCurrency(order.finalAmount || order.totalAmount)}</div>
            
            <div class="order-actions">
                <button class="order-action-btn primary" onclick="showOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i>
                    عرض التفاصيل
                </button>
                <button class="order-action-btn success" onclick="completeCollection('${order.id}')">
                    <i class="fas fa-check"></i>
                    تم التحصيل
                </button>
                <button class="order-action-btn danger" onclick="cancelOrder('${order.id}')">
                    <i class="fas fa-times"></i>
                    إلغاء
                </button>
            </div>
        `;
        container.appendChild(orderCard);
    });
}

// Load Completed Orders
function loadCompletedOrders() {
    const container = document.getElementById('completed-orders-list');
    container.innerHTML = '';
    
    if (orderPreparationData.completedOrders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <h3>لا توجد طلبات مكتملة</h3>
                <p>ستظهر الطلبات المكتملة هنا</p>
            </div>
        `;
        return;
    }
    
    orderPreparationData.completedOrders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.innerHTML = `
            <div class="order-header">
                <div class="order-info">
                    <div class="order-number">${order.id}</div>
                    <div class="customer-name">${order.customer.name}</div>
                </div>
                <div class="order-status ${order.status === 'completed' ? 'completed' : 'cancelled'}">
                    ${order.status === 'completed' ? 'مكتمل' : 'ملغي'}
                </div>
            </div>
            
            <div class="order-details">
                <div class="order-detail-item">
                    <i class="fas fa-calendar"></i>
                    <span>${order.completionDate || order.orderDate}</span>
                </div>
                ${order.notes ? `
                <div class="order-detail-item">
                    <i class="fas fa-sticky-note"></i>
                    <span>${order.notes}</span>
                </div>
                ` : ''}
            </div>
            
            <div class="order-amount">${formatCurrency(order.finalAmount || order.totalAmount)}</div>
            
            <div class="order-actions">
                <button class="order-action-btn primary" onclick="showOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i>
                    عرض التفاصيل
                </button>
            </div>
        `;
        container.appendChild(orderCard);
    });
}

// Show Order Details
function showOrderDetails(orderId) {
    const order = findOrderById(orderId);
    if (!order) return;
    
    orderPreparationData.currentOrder = order;
    
    const modal = document.getElementById('order-details-modal');
    const content = document.getElementById('order-details-content');
    
    content.innerHTML = `
        <div class="order-details-content">
            <div class="order-details-header">
                <div class="customer-info">
                    <h4>معلومات العميل</h4>
                    <p><strong>الاسم:</strong> ${order.customer.name}</p>
                    <p><strong>الهاتف:</strong> ${order.customer.phone}</p>
                    <p><strong>العنوان:</strong> ${order.customer.address}</p>
                </div>
                <div class="order-summary">
                    <h4>ملخص الطلب</h4>
                    <p><strong>رقم الطلب:</strong> ${order.id}</p>
                    <p><strong>طريقة الدفع:</strong> ${order.paymentMethod}</p>
                    <p><strong>التاريخ:</strong> ${order.orderDate}</p>
                    <p><strong>الإجمالي:</strong> ${formatCurrency(order.totalAmount)}</p>
                </div>
            </div>
            
            <div class="products-list">
                <h4>الأصناف (${order.items.length})</h4>
                ${order.items.map(item => `
                    <div class="product-item">
                        <div class="product-info">
                            <img src="${item.image}" alt="${item.name}" class="product-image">
                            <div class="product-details">
                                <h5>${item.name}</h5>
                                <p>${formatCurrency(item.price)} × ${item.quantity}</p>
                            </div>
                        </div>
                        <div class="product-actions">
                            <span class="product-price">${formatCurrency(item.price * item.quantity)}</span>
                            ${item.status === 'pending' ? `
                                <button class="order-action-btn success" onclick="markProductPrepared(${item.id})">
                                    <i class="fas fa-check"></i>
                                    تم التجهيز
                                </button>
                                <button class="order-action-btn warning" onclick="handleOutOfStock(${item.id})">
                                    <i class="fas fa-exclamation-triangle"></i>
                                    انتهى من المخزون
                                </button>
                            ` : `
                                <span class="product-status ${item.status}">
                                    ${getProductStatusText(item.status)}
                                </span>
                            `}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            ${order.notes ? `
            <div class="order-notes">
                <h4>ملاحظات</h4>
                <p>${order.notes}</p>
            </div>
            ` : ''}
            
            <div class="order-total">
                <h3>الإجمالي: ${formatCurrency(order.totalAmount)}</h3>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Get Product Status Text
function getProductStatusText(status) {
    const statusMap = {
        'pending': 'قيد الانتظار',
        'prepared': 'تم التجهيز',
        'replaced': 'تم الاستبدال',
        'deleted': 'تم الحذف'
    };
    return statusMap[status] || status;
}

// Find Order by ID
function findOrderById(orderId) {
    const allOrders = [
        ...orderPreparationData.newOrders,
        ...orderPreparationData.preparingOrders,
        ...orderPreparationData.collectionOrders,
        ...orderPreparationData.completedOrders
    ];
    return allOrders.find(order => order.id === orderId);
}

// Start Order Preparation
function startOrderPreparation(orderId) {
    const orderIndex = orderPreparationData.newOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return;
    
    const order = orderPreparationData.newOrders.splice(orderIndex, 1)[0];
    order.status = 'preparing';
    orderPreparationData.preparingOrders.push(order);
    
    updateOrderCounts();
    loadNewOrders();
    loadPreparingOrders();
    
    // Play notification sound
    playNotificationSound();
    
    alert('✅ تم نقل الطلب إلى قيد التجهيز');
}

// Mark Product as Prepared
function markProductPrepared(productId) {
    if (!orderPreparationData.currentOrder) return;
    
    const product = orderPreparationData.currentOrder.items.find(item => item.id === productId);
    if (product) {
        product.status = 'prepared';
        showOrderDetails(orderPreparationData.currentOrder.id);
        
        // Check if all products are prepared
        const allPrepared = orderPreparationData.currentOrder.items.every(item => item.status !== 'pending');
        if (allPrepared) {
            setTimeout(() => {
                alert('🎉 تم تجهيز جميع الأصناف! يمكنك الآن إكمال الطلب.');
            }, 500);
        }
    }
}

// Handle Out of Stock
function handleOutOfStock(productId) {
    if (!orderPreparationData.currentOrder) return;
    
    orderPreparationData.currentProduct = orderPreparationData.currentOrder.items.find(item => item.id === productId);
    document.getElementById('out-of-stock-modal').style.display = 'block';
}

// Call Customer
function callCustomer() {
    if (!orderPreparationData.currentOrder) return;
    
    const phoneNumber = orderPreparationData.currentOrder.customer.phone;
    window.open(`tel:${phoneNumber}`, '_self');
    closeOutOfStockModal();
}

// Show Product Replacement Modal
function showProductReplacementModal() {
    closeOutOfStockModal();
    
    // Load available products for replacement
    const availableProducts = [
        {
            id: 101,
            name: 'آيفون 15 برو',
            price: 4500,
            stock: 5,
            image: 'https://images.unsplash.com/photo-1592286927505-2fd0d113e4e7?w=200'
        },
        {
            id: 102,
            name: 'سامسونج جالاكسي S24 ألترا',
            price: 4200,
            stock: 3,
            image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200'
        },
        {
            id: 103,
            name: 'ماك بوك برو M3',
            price: 8000,
            stock: 2,
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200'
        }
    ];
    
    const container = document.getElementById('replacement-products-list');
    container.innerHTML = '';
    
    availableProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h5>${product.name}</h5>
            <p class="price">${formatCurrency(product.price)}</p>
            <p class="stock">المخزون: ${product.stock}</p>
        `;
        productCard.onclick = () => replaceProduct(product);
        container.appendChild(productCard);
    });
    
    document.getElementById('product-replacement-modal').style.display = 'block';
}

// Replace Product
function replaceProduct(newProduct) {
    if (!orderPreparationData.currentOrder || !orderPreparationData.currentProduct) return;
    
    const oldProduct = orderPreparationData.currentProduct;
    const oldPrice = oldProduct.price * oldProduct.quantity;
    const newPrice = newProduct.price * oldProduct.quantity;
    
    // Update product information
    oldProduct.id = newProduct.id;
    oldProduct.name = newProduct.name;
    oldProduct.price = newProduct.price;
    oldProduct.image = newProduct.image;
    oldProduct.status = 'replaced';
    
    // Update order total
    orderPreparationData.currentOrder.totalAmount += (newPrice - oldPrice);
    
    closeProductReplacementModal();
    showOrderDetails(orderPreparationData.currentOrder.id);
    
    // Show customer notification options
    setTimeout(() => {
        document.getElementById('customer-notification-modal').style.display = 'block';
    }, 500);
}

// Delete Product from Order
function deleteProductFromOrder() {
    if (!orderPreparationData.currentOrder || !orderPreparationData.currentProduct) return;
    
    const product = orderPreparationData.currentProduct;
    const productTotal = product.price * product.quantity;
    
    // Update product status
    product.status = 'deleted';
    
    // Update order total
    orderPreparationData.currentOrder.totalAmount -= productTotal;
    
    closeOutOfStockModal();
    showOrderDetails(orderPreparationData.currentOrder.id);
    
    alert('✅ تم حذف الصنف من الطلب');
}

// Send Customer Notification
function sendCustomerNotification() {
    const notificationType = document.querySelector('input[name="notification-type"]:checked').value;
    const message = document.getElementById('notification-message').value;
    
    // Here you would implement the actual notification sending
    console.log('Sending notification:', notificationType, message);
    
    closeCustomerNotificationModal();
    alert('✅ تم إرسال الإشعار للعميل');
}

// Complete Order Preparation
function completeOrderPreparation(orderId) {
    const orderIndex = orderPreparationData.preparingOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return;
    
    const order = orderPreparationData.preparingOrders.splice(orderIndex, 1)[0];
    order.status = 'ready';
    orderPreparationData.collectionOrders.push(order);
    
    updateOrderCounts();
    loadPreparingOrders();
    loadCollectionOrders();
    
    alert('✅ تم إكمال تجهيز الطلب');
}

// Complete Collection
function completeCollection(orderId) {
    const orderIndex = orderPreparationData.collectionOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return;
    
    const order = orderPreparationData.collectionOrders.splice(orderIndex, 1)[0];
    
    // Show completion modal
    orderPreparationData.currentOrder = order;
    document.getElementById('order-completion-modal').style.display = 'block';
    
    // Populate order summary
    const summaryContent = document.getElementById('order-summary-content');
    summaryContent.innerHTML = `
        <div class="summary-item">
            <span>رقم الطلب:</span>
            <span>${order.id}</span>
        </div>
        <div class="summary-item">
            <span>العميل:</span>
            <span>${order.customer.name}</span>
        </div>
        <div class="summary-item">
            <span>طريقة الدفع:</span>
            <span>${order.paymentMethod}</span>
        </div>
        <div class="summary-item total">
            <span>المبلغ:</span>
            <span>${formatCurrency(order.totalAmount)}</span>
        </div>
    `;
    
    document.getElementById('final-amount').value = order.totalAmount;
}

// Complete Order
function completeOrder() {
    if (!orderPreparationData.currentOrder) return;
    
    const finalAmount = parseFloat(document.getElementById('final-amount').value);
    const notes = document.getElementById('order-notes').value;
    
    if (!finalAmount || finalAmount <= 0) {
        alert('⚠️ يرجى إدخال المبلغ النهائي');
        return;
    }
    
    const order = orderPreparationData.currentOrder;
    order.finalAmount = finalAmount;
    order.notes = notes;
    order.status = 'completed';
    order.completionDate = new Date().toLocaleString('ar-EG');
    
    // Move to completed orders
    orderPreparationData.completedOrders.push(order);
    
    closeOrderCompletionModal();
    updateOrderCounts();
    loadCollectionOrders();
    loadCompletedOrders();
    
    alert('✅ تم إكمال الطلب بنجاح!');
}

// Cancel Order
function cancelOrder(orderId) {
    if (!confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) return;
    
    const orderIndex = orderPreparationData.collectionOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return;
    
    const order = orderPreparationData.collectionOrders.splice(orderIndex, 1)[0];
    order.status = 'cancelled';
    order.completionDate = new Date().toLocaleString('ar-EG');
    orderPreparationData.completedOrders.push(order);
    
    updateOrderCounts();
    loadCollectionOrders();
    loadCompletedOrders();
    
    alert('❌ تم إلغاء الطلب');
}

// Update Order Counts
function updateOrderCounts() {
    const newOrdersElement = document.getElementById('new-orders-count');
    const preparingOrdersElement = document.getElementById('preparing-orders-count');
    const collectionOrdersElement = document.getElementById('collection-orders-count');
    const completedOrdersElement = document.getElementById('completed-orders-count');
    
    if (newOrdersElement) newOrdersElement.textContent = orderPreparationData.newOrders.length;
    if (preparingOrdersElement) preparingOrdersElement.textContent = orderPreparationData.preparingOrders.length;
    if (collectionOrdersElement) collectionOrdersElement.textContent = orderPreparationData.collectionOrders.length;
    if (completedOrdersElement) completedOrdersElement.textContent = orderPreparationData.completedOrders.length;
}

// Check for New Orders
function checkForNewOrders() {
    // Simulate new orders arriving
    const random = Math.random();
    if (random < 0.3) { // 30% chance of new order
        const newOrder = generateRandomOrder();
        orderPreparationData.newOrders.push(newOrder);
        updateOrderCounts();
        loadNewOrders();
        playNotificationSound();
        
        // Show notification
        if (Notification.permission === "granted") {
            new Notification("طلب جديد", {
                body: `وصل طلب جديد من ${newOrder.customer.name}`,
                icon: "https://via.placeholder.com/64"
            });
        }
    }
}

// Generate Random Order
function generateRandomOrder() {
    const customers = [
        { name: "سعيد أحمد", phone: "0501234567", address: "جدة - حي الكورنيش" },
        { name: "نورة خالد", phone: "0542345678", address: "مكة - حي الزاهر" },
        { name: "عبدالله محمد", phone: "0553456789", address: "المدينة - حي العزيزية" }
    ];
    
    const products = [
        { name: "آيباد برو", price: 2500, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200" },
        { name: "سماعة بلوتوث", price: 300, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200" },
        { name: "شاحن سريع", price: 150, image: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=200" }
    ];
    
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    
    return {
        id: `ORD-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        customer: customer,
        items: [{
            id: Date.now(),
            name: product.name,
            price: product.price,
            quantity: 1,
            status: 'pending',
            image: product.image
        }],
        paymentMethod: Math.random() > 0.5 ? 'كاش' : 'بطاقة ائتمان',
        totalAmount: product.price,
        status: 'new',
        orderDate: new Date().toLocaleString('ar-EG'),
        notes: ''
    };
}

// Play Notification Sound
function playNotificationSound() {
    const audio = document.getElementById("new-order-sound");
    if (audio) {
        audio.play().catch(e => console.log("Audio play failed:", e));
    }
}

// Modal Functions
function closeOrderDetailsModal() {
    const modal = document.getElementById("order-details-modal");
    if (modal) modal.style.display = "none";
}

function closeProductReplacementModal() {
    const modal = document.getElementById("product-replacement-modal");
    if (modal) modal.style.display = "none";
}

function closeCustomerNotificationModal() {
    const modal = document.getElementById("customer-notification-modal");
    if (modal) modal.style.display = "none";
}

function closeOutOfStockModal() {
    const modal = document.getElementById("out-of-stock-modal");
    if (modal) modal.style.display = "none";
}

function closeOrderCompletionModal() {
    const modal = document.getElementById("order-completion-modal");
    if (modal) modal.style.display = "none";
}

// Search Products
function searchProducts() {
    const searchTerm = document.getElementById("product-search").value.toLowerCase();
    const products = document.querySelectorAll(".product-card");
    
    products.forEach(product => {
        const productName = product.querySelector("h5").textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}

// Request Notification Permission
if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
}

// Add CSS for progress bar
const style = document.createElement('style');
style.textContent = `
    .progress-bar {
        width: 100%;
        height: 8px;
        background: #f5f7fa;
        border-radius: 4px;
        margin: 0.5rem 0;
        overflow: hidden;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        border-radius: 4px;
        transition: width 0.3s ease;
    }
    
    .progress-text {
        text-align: center;
        font-size: 0.9rem;
        color: #666;
        margin-bottom: 1rem;
    }
    
    .empty-state {
        text-align: center;
        padding: 3rem;
        color: #666;
    }
    
    .empty-state i {
        font-size: 3rem;
        color: #ccc;
        margin-bottom: 1rem;
    }
    
    .empty-state h3 {
        margin-bottom: 0.5rem;
        color: #999;
    }
`;
document.head.appendChild(style);