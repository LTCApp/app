// Admin Dashboard JavaScript

// Global Variables
let currentTab = 'dashboard';
let products = [];
let orders = [];
let users = [];
let isLoggedIn = false;

// Sample Data
const sampleProducts = [
    {
        id: 1,
        name: 'طماطم طازجة',
        category: 'vegetables',
        price: 8.50,
        stock: 120,
        image: 'https://via.placeholder.com/150x150/dc2626/white?text=طماطم',
        description: 'طماطم طازجة من المزارع المحلية',
        status: 'available'
    },
    {
        id: 2,
        name: 'تفاح أحمر',
        category: 'fruits',
        price: 12.00,
        stock: 85,
        image: 'https://via.placeholder.com/150x150/dc2626/white?text=تفاح',
        description: 'تفاح أحمر حلو ومقرمش',
        status: 'available'
    },
    {
        id: 3,
        name: 'لحم بقري',
        category: 'meat',
        price: 45.00,
        stock: 15,
        image: 'https://via.placeholder.com/150x150/dc2626/white?text=لحم',
        description: 'لحم بقري طازج عالي الجودة',
        status: 'low-stock'
    },
    {
        id: 4,
        name: 'حليب كامل الدسم',
        category: 'dairy',
        price: 6.50,
        stock: 0,
        image: 'https://via.placeholder.com/150x150/dc2626/white?text=حليب',
        description: 'حليب طازج كامل الدسم',
        status: 'out-of-stock'
    },
    {
        id: 5,
        name: 'خيار طازج',
        category: 'vegetables',
        price: 4.25,
        stock: 200,
        image: 'https://via.placeholder.com/150x150/dc2626/white?text=خيار',
        description: 'خيار طازج ومقرمش',
        status: 'available'
    },
    {
        id: 6,
        name: 'موز',
        category: 'fruits',
        price: 7.50,
        stock: 150,
        image: 'https://via.placeholder.com/150x150/dc2626/white?text=موز',
        description: 'موز طازج غني بالبوتاسيوم',
        status: 'available'
    }
];

const sampleOrders = [
    {
        id: 12345,
        customerName: 'أحمد محمد العلي',
        customerPhone: '0501234567',
        customerEmail: 'ahmed@example.com',
        orderDate: '2025-09-26T10:30:00',
        status: 'pending',
        total: 450.00,
        items: [
            { name: 'طماطم طازجة', quantity: 5, price: 8.50 },
            { name: 'تفاح أحمر', quantity: 3, price: 12.00 },
            { name: 'لحم بقري', quantity: 10, price: 45.00 }
        ],
        address: 'الرياض، حي النخيل، شارع الملك فهد'
    },
    {
        id: 12344,
        customerName: 'سارة أحمد محمد',
        customerPhone: '0501234568',
        customerEmail: 'sara@example.com',
        orderDate: '2025-09-26T10:05:00',
        status: 'confirmed',
        total: 780.50,
        items: [
            { name: 'حليب كامل الدسم', quantity: 12, price: 6.50 },
            { name: 'خيار طازج', quantity: 8, price: 4.25 },
            { name: 'موز', quantity: 20, price: 7.50 }
        ],
        address: 'جدة، حي الحمراء، طريق الملك عبد العزيز'
    },
    {
        id: 12343,
        customerName: 'محمد علي السلمان',
        customerPhone: '0501234569',
        customerEmail: 'mohammed@example.com',
        orderDate: '2025-09-26T09:20:00',
        status: 'delivered',
        total: 325.75,
        items: [
            { name: 'طماطم طازجة', quantity: 10, price: 8.50 },
            { name: 'خيار طازج', quantity: 15, price: 4.25 },
            { name: 'تفاح أحمر', quantity: 8, price: 12.00 }
        ],
        address: 'الدمام، حي الشاطئ، شارع الخليج'
    }
];

const sampleUsers = [
    {
        id: 1,
        name: 'أحمد محمد العلي',
        email: 'ahmed@example.com',
        phone: '0501234567',
        joinDate: '2024-01-15',
        lastLogin: '2025-09-26T09:30:00',
        status: 'active',
        type: 'regular',
        totalOrders: 25,
        totalSpent: 2850.00,
        avatar: 'https://via.placeholder.com/60x60/dc2626/white?text=أ'
    },
    {
        id: 2,
        name: 'سارة أحمد محمد',
        email: 'sara@example.com',
        phone: '0501234568',
        joinDate: '2024-03-20',
        lastLogin: '2025-09-26T08:45:00',
        status: 'active',
        type: 'premium',
        totalOrders: 42,
        totalSpent: 5240.00,
        avatar: 'https://via.placeholder.com/60x60/dc2626/white?text=س'
    },
    {
        id: 3,
        name: 'محمد علي السلمان',
        email: 'mohammed@example.com',
        phone: '0501234569',
        joinDate: '2023-11-10',
        lastLogin: '2025-09-25T15:20:00',
        status: 'active',
        type: 'wholesale',
        totalOrders: 78,
        totalSpent: 12450.00,
        avatar: 'https://via.placeholder.com/60x60/dc2626/white?text=م'
    },
    {
        id: 4,
        name: 'فاطمة خالد النور',
        email: 'fatima@example.com',
        phone: '0501234570',
        joinDate: '2024-07-08',
        lastLogin: '2025-09-24T12:15:00',
        status: 'inactive',
        type: 'regular',
        totalOrders: 12,
        totalSpent: 890.00,
        avatar: 'https://via.placeholder.com/60x60/dc2626/white?text=ف'
    }
];

// Admin Credentials
const adminCredentials = {
    username: 'admin',
    password: 'admin123'
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load sample data
    products = [...sampleProducts];
    orders = [...sampleOrders];
    users = [...sampleUsers];
    
    // Setup event listeners
    setupEventListeners();
    
    // Show login modal
    showLoginModal();
}

function setupEventListeners() {
    // Admin login form
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
    
    // Navigation tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchTab(tabName);
        });
    });
    
    // Product form
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
    }
    
    const editProductForm = document.getElementById('editProductForm');
    if (editProductForm) {
        editProductForm.addEventListener('submit', handleEditProduct);
    }
    
    // Search and filter event listeners
    setupSearchAndFilters();
}

function setupSearchAndFilters() {
    // Product search
    const productSearch = document.getElementById('productSearch');
    if (productSearch) {
        productSearch.addEventListener('input', filterProducts);
    }
    
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterProducts);
    }
    
    // Order search
    const orderSearch = document.getElementById('orderSearch');
    if (orderSearch) {
        orderSearch.addEventListener('input', filterOrders);
    }
    
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', filterOrders);
    }
    
    // User search
    const userSearch = document.getElementById('userSearch');
    if (userSearch) {
        userSearch.addEventListener('input', filterUsers);
    }
    
    const userStatusFilter = document.getElementById('userStatusFilter');
    if (userStatusFilter) {
        userStatusFilter.addEventListener('change', filterUsers);
    }
}

function showLoginModal() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function hideLoginModal() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function handleAdminLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    if (username === adminCredentials.username && password === adminCredentials.password) {
        isLoggedIn = true;
        hideLoginModal();
        showAdminDashboard();
        initializeDashboard();
        showToast('تم تسجيل الدخول بنجاح!', 'success');
        
        // Update welcome name
        const welcomeName = document.getElementById('adminWelcomeName');
        if (welcomeName) {
            welcomeName.textContent = 'المدير العام';
        }
    } else {
        showToast('اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
    }
}

function showAdminDashboard() {
    const dashboard = document.getElementById('adminDashboard');
    if (dashboard) {
        dashboard.style.display = 'block';
    }
}

function adminLogout() {
    isLoggedIn = false;
    const dashboard = document.getElementById('adminDashboard');
    if (dashboard) {
        dashboard.style.display = 'none';
    }
    showLoginModal();
    showToast('تم تسجيل الخروج بنجاح', 'success');
}

function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

function toggleProfileMenu() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Close profile menu when clicking outside
document.addEventListener('click', function(e) {
    const profile = document.querySelector('.admin-profile');
    const dropdown = document.getElementById('profileDropdown');
    
    if (!profile.contains(e.target) && dropdown) {
        dropdown.classList.remove('show');
    }
});

function switchTab(tabName) {
    currentTab = tabName;
    
    // Update active tab
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
    });
    
    // Update active content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    const activeContent = document.getElementById(tabName);
    if (activeContent) {
        activeContent.classList.add('active');
    }
    
    // Load tab specific data
    switch(tabName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'products':
            loadProductsData();
            break;
        case 'orders':
            loadOrdersData();
            break;
        case 'users':
            loadUsersData();
            break;
    }
}

function initializeDashboard() {
    loadDashboardData();
    loadProductsData();
    loadOrdersData();
    loadUsersData();
}

function loadDashboardData() {
    // Initialize charts
    initializeSalesChart();
    initializeProductsChart();
}

function initializeSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
                datasets: [{
                    label: 'المبيعات (ر.س)',
                    data: [65000, 78000, 92000, 85000, 103000, 125000],
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString('ar-SA') + ' ر.س';
                            }
                        }
                    }
                }
            }
        });
    }
}

function initializeProductsChart() {
    const ctx = document.getElementById('productsChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['خضروات', 'فواكه', 'لحوم', 'ألبان'],
                datasets: [{
                    data: [45, 30, 15, 10],
                    backgroundColor: [
                        '#10b981',
                        '#f59e0b',
                        '#dc2626',
                        '#3b82f6'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

function loadProductsData() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const stockStatus = getStockStatus(product.stock);
    const stockClass = stockStatus.class;
    const stockText = stockStatus.text;
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <div class="product-category">${getCategoryName(product.category)}</div>
            <h3>${product.name}</h3>
            <div class="product-price">${product.price.toFixed(2)} ر.س</div>
            <div class="product-stock ${stockClass}">
                <i class="fas fa-box"></i>
                ${stockText}: ${product.stock}
            </div>
            <p>${product.description}</p>
        </div>
        <div class="product-actions">
            <button class="btn-edit" onclick="editProduct(${product.id})">
                <i class="fas fa-edit"></i> تعديل
            </button>
            <button class="btn-delete" onclick="deleteProduct(${product.id})">
                <i class="fas fa-trash"></i> حذف
            </button>
        </div>
    `;
    
    return card;
}

function getStockStatus(stock) {
    if (stock === 0) {
        return { class: 'stock-low', text: 'نفد المخزون' };
    } else if (stock < 20) {
        return { class: 'stock-medium', text: 'مخزون منخفض' };
    } else {
        return { class: 'stock-high', text: 'متوفر' };
    }
}

function getCategoryName(category) {
    const categories = {
        'vegetables': 'خضروات',
        'fruits': 'فواكه',
        'meat': 'لحوم',
        'dairy': 'ألبان'
    };
    return categories[category] || category;
}

function filterProducts() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        const matchesStatus = !statusFilter || product.status === statusFilter;
        
        return matchesSearch && matchesCategory && matchesStatus;
    });
    
    displayFilteredProducts(filteredProducts);
}

function displayFilteredProducts(filteredProducts) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">لم يتم العثور على منتجات مطابقة للبحث</p>';
    }
}

function showAddProductModal() {
    showModal('addProductModal');
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Fill edit form
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductCategory').value = product.category;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductStock').value = product.stock;
    document.getElementById('editProductDescription').value = product.description;
    
    // Show current image
    const currentImageDiv = document.getElementById('currentProductImage');
    if (currentImageDiv) {
        currentImageDiv.innerHTML = `<img src="${product.image}" alt="${product.name}">`;
    }
    
    showModal('editProductModal');
}

function deleteProduct(productId) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        products = products.filter(p => p.id !== productId);
        loadProductsData();
        showToast('تم حذف المنتج بنجاح', 'success');
    }
}

function handleAddProduct(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newProduct = {
        id: Date.now(), // Simple ID generation
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        description: document.getElementById('productDescription').value,
        image: 'https://via.placeholder.com/150x150/dc2626/white?text=' + encodeURIComponent(document.getElementById('productName').value.charAt(0)),
        status: 'available'
    };
    
    products.push(newProduct);
    loadProductsData();
    closeModal('addProductModal');
    showToast('تم إضافة المنتج بنجاح', 'success');
    
    // Reset form
    document.getElementById('addProductForm').reset();
}

function handleEditProduct(e) {
    e.preventDefault();
    
    const productId = parseInt(document.getElementById('editProductId').value);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex !== -1) {
        products[productIndex] = {
            ...products[productIndex],
            name: document.getElementById('editProductName').value,
            category: document.getElementById('editProductCategory').value,
            price: parseFloat(document.getElementById('editProductPrice').value),
            stock: parseInt(document.getElementById('editProductStock').value),
            description: document.getElementById('editProductDescription').value
        };
        
        loadProductsData();
        closeModal('editProductModal');
        showToast('تم تحديث المنتج بنجاح', 'success');
    }
}

function loadOrdersData() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    ordersList.innerHTML = '';
    
    orders.forEach(order => {
        const orderCard = createOrderCard(order);
        ordersList.appendChild(orderCard);
    });
}

function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'order-card';
    
    const orderDate = new Date(order.orderDate);
    const formattedDate = orderDate.toLocaleDateString('ar-SA') + ' ' + orderDate.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    
    card.innerHTML = `
        <div class="order-header">
            <div class="order-basic-info">
                <h3>طلب رقم #${order.id}</h3>
                <div class="order-customer-info">
                    <i class="fas fa-user"></i> ${order.customerName}<br>
                    <i class="fas fa-phone"></i> ${order.customerPhone}<br>
                    <i class="fas fa-calendar"></i> ${formattedDate}
                </div>
            </div>
            <div class="order-status-section">
                <div class="order-total">${order.total.toFixed(2)} ر.س</div>
                <div class="order-status ${order.status}">${getOrderStatusName(order.status)}</div>
            </div>
        </div>
        
        <div class="order-body">
            <div class="order-items">
                <h4>المنتجات المطلوبة:</h4>
                <div class="order-item-list">
                    ${order.items.map(item => `
                        <div class="order-item-row">
                            <span class="order-item-name">${item.name}</span>
                            <span class="order-item-details">${item.quantity} × ${item.price.toFixed(2)} ر.س</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="order-address">
                <h4>عنوان التوصيل:</h4>
                <p><i class="fas fa-map-marker-alt"></i> ${order.address}</p>
            </div>
        </div>
        
        <div class="order-actions">
            <select class="status-select" onchange="updateOrderStatus(${order.id}, this.value)">
                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>قيد المراجعة</option>
                <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>مؤكد</option>
                <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>قيد التحضير</option>
                <option value="out-for-delivery" ${order.status === 'out-for-delivery' ? 'selected' : ''}>خارج للتوصيل</option>
                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>تم التسليم</option>
                <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>ملغي</option>
            </select>
            <button class="btn-view" onclick="viewOrderDetails(${order.id})">
                <i class="fas fa-eye"></i> التفاصيل
            </button>
        </div>
    `;
    
    return card;
}

function getOrderStatusName(status) {
    const statuses = {
        'pending': 'قيد المراجعة',
        'confirmed': 'مؤكد',
        'preparing': 'قيد التحضير',
        'out-for-delivery': 'خارج للتوصيل',
        'delivered': 'تم التسليم',
        'cancelled': 'ملغي'
    };
    return statuses[status] || status;
}

function updateOrderStatus(orderId, newStatus) {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        loadOrdersData();
        showToast('تم تحديث حالة الطلب بنجاح', 'success');
    }
}

function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const modal = document.getElementById('orderDetailsModal');
    const idSpan = document.getElementById('orderDetailsId');
    const content = document.getElementById('orderDetailsContent');
    
    if (idSpan) {
        idSpan.textContent = `#${order.id}`;
    }
    
    if (content) {
        const orderDate = new Date(order.orderDate);
        const formattedDate = orderDate.toLocaleDateString('ar-SA') + ' ' + orderDate.toLocaleTimeString('ar-SA');
        
        content.innerHTML = `
            <div class="order-details-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                <div class="order-customer-details">
                    <h4>تفاصيل العميل</h4>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-top: 15px;">
                        <p><strong>الاسم:</strong> ${order.customerName}</p>
                        <p><strong>الهاتف:</strong> ${order.customerPhone}</p>
                        <p><strong>البريد الإلكتروني:</strong> ${order.customerEmail}</p>
                        <p><strong>تاريخ الطلب:</strong> ${formattedDate}</p>
                        <p><strong>العنوان:</strong> ${order.address}</p>
                    </div>
                </div>
                
                <div class="order-summary">
                    <h4>ملخص الطلب</h4>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-top: 15px;">
                        <div class="order-items-detailed">
                            ${order.items.map(item => `
                                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                                    <span>${item.name}</span>
                                    <span>${item.quantity} × ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)} ر.س</span>
                                </div>
                            `).join('')}
                        </div>
                        <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #dc2626; font-weight: bold; font-size: 18px;">
                            الإجمالي: ${order.total.toFixed(2)} ر.س
                        </div>
                        <div style="margin-top: 10px;">
                            <span class="order-status ${order.status}" style="padding: 10px 20px; border-radius: 20px; font-weight: 700;">
                                ${getOrderStatusName(order.status)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    showModal('orderDetailsModal');
}

function filterOrders() {
    const searchTerm = document.getElementById('orderSearch').value.toLowerCase();
    const statusFilter = document.getElementById('orderStatusFilter').value;
    const dateFilter = document.getElementById('orderDateFilter').value;
    
    let filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toString().includes(searchTerm) || 
                            order.customerName.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || order.status === statusFilter;
        
        let matchesDate = true;
        if (dateFilter) {
            const orderDate = new Date(order.orderDate).toISOString().split('T')[0];
            matchesDate = orderDate === dateFilter;
        }
        
        return matchesSearch && matchesStatus && matchesDate;
    });
    
    displayFilteredOrders(filteredOrders);
}

function displayFilteredOrders(filteredOrders) {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    ordersList.innerHTML = '';
    
    filteredOrders.forEach(order => {
        const orderCard = createOrderCard(order);
        ordersList.appendChild(orderCard);
    });
    
    if (filteredOrders.length === 0) {
        ordersList.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">لم يتم العثور على طلبات مطابقة للبحث</p>';
    }
}

function loadUsersData() {
    const usersList = document.getElementById('usersList');
    if (!usersList) return;
    
    usersList.innerHTML = '';
    
    users.forEach(user => {
        const userCard = createUserCard(user);
        usersList.appendChild(userCard);
    });
}

function createUserCard(user) {
    const card = document.createElement('div');
    card.className = 'user-card';
    
    const joinDate = new Date(user.joinDate);
    const lastLogin = new Date(user.lastLogin);
    const formattedJoinDate = joinDate.toLocaleDateString('ar-SA');
    const formattedLastLogin = lastLogin.toLocaleDateString('ar-SA');
    
    card.innerHTML = `
        <div class="user-header">
            <img src="${user.avatar}" alt="${user.name}" class="user-avatar">
            <div class="user-basic-info">
                <h3>${user.name}</h3>
                <div class="user-email">${user.email}</div>
                <div class="user-phone">${user.phone}</div>
            </div>
        </div>
        
        <div class="user-stats">
            <div class="user-stat">
                <span class="user-stat-number">${user.totalOrders}</span>
                <span class="user-stat-label">إجمالي الطلبات</span>
            </div>
            <div class="user-stat">
                <span class="user-stat-number">${user.totalSpent.toFixed(2)} ر.س</span>
                <span class="user-stat-label">إجمالي المشتريات</span>
            </div>
        </div>
        
        <div class="user-status">
            <div>
                <span class="user-type ${user.type}">${getUserTypeName(user.type)}</span>
                <span class="user-status-badge ${user.status}" style="margin-right: 10px; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">
                    ${getUserStatusName(user.status)}
                </span>
            </div>
        </div>
        
        <div style="margin: 15px 0; font-size: 12px; color: #666;">
            <div>تاريخ الانضمام: ${formattedJoinDate}</div>
            <div>آخر دخول: ${formattedLastLogin}</div>
        </div>
        
        <div class="user-actions">
            ${user.status === 'active' ? 
                `<button class="btn-block" onclick="blockUser(${user.id})">
                    <i class="fas fa-ban"></i> حظر
                </button>` : 
                `<button class="btn-unblock" onclick="unblockUser(${user.id})">
                    <i class="fas fa-check"></i> إلغاء الحظر
                </button>`
            }
            <button class="btn-view" onclick="viewUserDetails(${user.id})">
                <i class="fas fa-eye"></i> التفاصيل
            </button>
        </div>
    `;
    
    return card;
}

function getUserTypeName(type) {
    const types = {
        'regular': 'عادي',
        'premium': 'مميز',
        'wholesale': 'جملة'
    };
    return types[type] || type;
}

function getUserStatusName(status) {
    const statuses = {
        'active': 'نشط',
        'inactive': 'غير نشط',
        'blocked': 'محظور'
    };
    return statuses[status] || status;
}

function blockUser(userId) {
    if (confirm('هل أنت متأكد من حظر هذا المستخدم؟')) {
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            users[userIndex].status = 'blocked';
            loadUsersData();
            showToast('تم حظر المستخدم بنجاح', 'success');
        }
    }
}

function unblockUser(userId) {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users[userIndex].status = 'active';
        loadUsersData();
        showToast('تم إلغاء حظر المستخدم بنجاح', 'success');
    }
}

function viewUserDetails(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    // This would show a detailed modal similar to order details
    showToast('عرض تفاصيل المستخدم - ميزة قريباً', 'warning');
}

function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const statusFilter = document.getElementById('userStatusFilter').value;
    const typeFilter = document.getElementById('userTypeFilter').value;
    
    let filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm) || 
                            user.email.toLowerCase().includes(searchTerm) ||
                            user.phone.includes(searchTerm);
        const matchesStatus = !statusFilter || user.status === statusFilter;
        const matchesType = !typeFilter || user.type === typeFilter;
        
        return matchesSearch && matchesStatus && matchesType;
    });
    
    displayFilteredUsers(filteredUsers);
}

function displayFilteredUsers(filteredUsers) {
    const usersList = document.getElementById('usersList');
    if (!usersList) return;
    
    usersList.innerHTML = '';
    
    filteredUsers.forEach(user => {
        const userCard = createUserCard(user);
        usersList.appendChild(userCard);
    });
    
    if (filteredUsers.length === 0) {
        usersList.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">لم يتم العثور على مستخدمين مطابقين للبحث</p>';
    }
}

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
    }
});

// Settings Function
function showSettings() {
    showToast('إعدادات النظام - ميزة قريباً', 'warning');
}

// Toast Function
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Set icon based on type
    let icon = 'fas fa-check';
    if (type === 'error') icon = 'fas fa-times';
    if (type === 'warning') icon = 'fas fa-exclamation-triangle';
    
    toastIcon.innerHTML = `<i class="${icon}"></i>`;
    toastMessage.textContent = message;
    
    // Set toast type class
    toast.className = `toast ${type}`;
    
    // Show toast
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR'
    }).format(amount);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getTimeAgo(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) {
        return `منذ ${minutes} دقيقة`;
    } else if (hours < 24) {
        return `منذ ${hours} ساعة`;
    } else {
        return `منذ ${days} يوم`;
    }
}