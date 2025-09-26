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

// Order Preparation System Variables
let currentOrderTab = 'new';
let soundEnabled = true;
let currentReplacementContext = null;
let customerConfirmationTimer = null;

// Enhanced Sample Orders Data for Order Preparation
const samplePreparationOrders = [
    // New Orders
    {
        id: 15001,
        customerName: 'أحمد محمد العلي',
        customerPhone: '0501234567',
        customerEmail: 'ahmed@example.com',
        orderDate: '2025-09-26T13:30:00',
        status: 'new',
        total: 450.00,
        paymentMethod: 'cash',
        items: [
            { id: 1, name: 'طماطم طازجة', quantity: 5, price: 8.50, image: 'https://via.placeholder.com/150x150/dc2626/white?text=طماطم', status: 'pending' },
            { id: 2, name: 'تفاح أحمر', quantity: 3, price: 12.00, image: 'https://via.placeholder.com/150x150/dc2626/white?text=تفاح', status: 'pending' },
            { id: 3, name: 'لحم بقري', quantity: 2, price: 45.00, image: 'https://via.placeholder.com/150x150/dc2626/white?text=لحم', status: 'pending' }
        ],
        address: 'الرياض، حي النخيل، شارع الملك فهد',
        urgent: true
    },
    {
        id: 15002,
        customerName: 'سارة أحمد محمد',
        customerPhone: '0501234568',
        customerEmail: 'sara@example.com',
        orderDate: '2025-09-26T13:20:00',
        status: 'new',
        total: 280.50,
        paymentMethod: 'instapay',
        items: [
            { id: 4, name: 'حليب كامل الدسم', quantity: 4, price: 6.50, image: 'https://via.placeholder.com/150x150/dc2626/white?text=حليب', status: 'pending' },
            { id: 5, name: 'خيار طازج', quantity: 8, price: 4.25, image: 'https://via.placeholder.com/150x150/dc2626/white?text=خيار', status: 'pending' }
        ],
        address: 'جدة، حي الحمراء، طريق الملك عبد العزيز',
        urgent: false
    },
    {
        id: 15003,
        customerName: 'خالد عبد الله القحطاني',
        customerPhone: '0501234569',
        customerEmail: 'khalid@example.com',
        orderDate: '2025-09-26T13:15:00',
        status: 'new',
        total: 175.25,
        paymentMethod: 'cash',
        items: [
            { id: 6, name: 'موز', quantity: 10, price: 7.50, image: 'https://via.placeholder.com/150x150/dc2626/white?text=موز', status: 'pending' },
            { id: 1, name: 'طماطم طازجة', quantity: 12, price: 8.50, image: 'https://via.placeholder.com/150x150/dc2626/white?text=طماطم', status: 'pending' }
        ],
        address: 'الدمام، حي الشاطئ، شارع الخليج',
        urgent: false
    },
    
    // Preparing Orders
    {
        id: 14998,
        customerName: 'مريم علي الناصر',
        customerPhone: '0501234570',
        customerEmail: 'mariam@example.com',
        orderDate: '2025-09-26T12:45:00',
        status: 'preparing',
        total: 320.75,
        paymentMethod: 'instapay',
        items: [
            { id: 2, name: 'تفاح أحمر', quantity: 5, price: 12.00, image: 'https://via.placeholder.com/150x150/dc2626/white?text=تفاح', status: 'prepared' },
            { id: 5, name: 'خيار طازج', quantity: 15, price: 4.25, image: 'https://via.placeholder.com/150x150/dc2626/white?text=خيار', status: 'preparing' },
            { id: 3, name: 'لحم بقري', quantity: 3, price: 45.00, image: 'https://via.placeholder.com/150x150/dc2626/white?text=لحم', status: 'pending' }
        ],
        address: 'مكة المكرمة، حي العزيزية، شارع الحرم',
        urgent: false
    },
    
    // More preparing orders...
    {
        id: 14999,
        customerName: 'فهد محمد العتيبي',
        customerPhone: '0501234571',
        customerEmail: 'fahad@example.com',
        orderDate: '2025-09-26T12:30:00',
        status: 'preparing',
        total: 195.50,
        paymentMethod: 'cash',
        items: [
            { id: 4, name: 'حليب كامل الدسم', quantity: 6, price: 6.50, image: 'https://via.placeholder.com/150x150/dc2626/white?text=حليب', status: 'prepared' },
            { id: 6, name: 'موز', quantity: 8, price: 7.50, image: 'https://via.placeholder.com/150x150/dc2626/white?text=موز', status: 'preparing' },
            { id: 1, name: 'طماطم طازجة', quantity: 10, price: 8.50, image: 'https://via.placeholder.com/150x150/dc2626/white?text=طماطم', status: 'replaced' }
        ],
        address: 'المدينة المنورة، حي قباء، شارع قباء',
        urgent: false
    },
    
    // Completed Orders
    {
        id: 14995,
        customerName: 'نورة عبد الرحمن',
        customerPhone: '0501234572',
        customerEmail: 'nora@example.com',
        orderDate: '2025-09-26T11:15:00',
        status: 'completed',
        total: 540.25,
        paymentMethod: 'instapay',
        items: [
            { id: 2, name: 'تفاح أحمر', quantity: 8, price: 12.00, image: 'https://via.placeholder.com/150x150/dc2626/white?text=تفاح', status: 'prepared' },
            { id: 3, name: 'لحم بقري', quantity: 5, price: 45.00, image: 'https://via.placeholder.com/150x150/dc2626/white?text=لحم', status: 'prepared' },
            { id: 4, name: 'حليب كامل الدسم', quantity: 10, price: 6.50, image: 'https://via.placeholder.com/150x150/dc2626/white?text=حليب', status: 'prepared' }
        ],
        address: 'الطائف، حي الشهداء، شارع الملك فيصل',
        urgent: false
    }
];

// Initialize preparation orders
let preparationOrders = [...samplePreparationOrders];

// Settings Variables
let storeSettings = {
    status: 'open', // 'open', 'closed', 'temp-closed'
    tempCloseUntil: null,
    tempCloseReason: '',
    workHours: {
        saturday: { enabled: true, start: '08:00', end: '22:00' },
        sunday: { enabled: true, start: '08:00', end: '22:00' },
        monday: { enabled: true, start: '08:00', end: '22:00' },
        tuesday: { enabled: true, start: '08:00', end: '22:00' },
        wednesday: { enabled: true, start: '08:00', end: '22:00' },
        thursday: { enabled: true, start: '08:00', end: '22:00' },
        friday: { enabled: false, start: '08:00', end: '22:00' }
    },
    notifications: {
        orderSound: true,
        lowStockSound: true,
        desktopNotifications: true,
        badgeCount: true
    },
    currency: 'ر.س',
    minOrderAmount: 50,
    deliveryFee: 15,
    preparationTime: 30,
    deliveryTime: 45,
    deliveryRadius: 25
};

let tempCloseTimer = null;

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
    preparationOrders = [...samplePreparationOrders];
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
        case 'settings':
            loadSettingsData();
            break;
    }
}

function initializeDashboard() {
    loadDashboardData();
    loadProductsData();
    loadOrdersData();  // This will now load the order preparation system
    loadUsersData();
}

function loadDashboardData() {
    // تأخير قصير لضمان تحميل DOM بالكامل
    setTimeout(() => {
        // Initialize charts
        initializeSalesChart();
        initializeProductsChart();
    }, 300);
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
                    tension: 0.4,
                    pointBackgroundColor: '#dc2626',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#333',
                        bodyColor: '#666',
                        borderColor: '#dc2626',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        titleFont: {
                            family: 'Cairo',
                            size: 14,
                            weight: '600'
                        },
                        bodyFont: {
                            family: 'Cairo',
                            size: 13
                        },
                        callbacks: {
                            label: function(context) {
                                return 'المبيعات: ' + context.parsed.y.toLocaleString('ar-SA') + ' ر.س';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Cairo',
                                size: 12
                            },
                            color: '#666'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                family: 'Cairo',
                                size: 12
                            },
                            color: '#666',
                            callback: function(value) {
                                return (value / 1000) + 'ك ر.س';
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
        const chart = new Chart(ctx, {
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
                    borderWidth: 0,
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                interaction: {
                    intersect: false
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: {
                                family: 'Cairo',
                                size: 12,
                                weight: '500'
                            },
                            color: '#666'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#333',
                        bodyColor: '#666',
                        borderColor: '#e5e5e5',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        titleFont: {
                            family: 'Cairo',
                            size: 14,
                            weight: '600'
                        },
                        bodyFont: {
                            family: 'Cairo',
                            size: 13
                        },
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return label + ': ' + percentage + '%';
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1000
                }
            },
            plugins: [{
                id: 'centerText',
                beforeDraw: function(chart) {
                    const ctx = chart.ctx;
                    const centerX = chart.width / 2;
                    const centerY = chart.height / 2;
                    
                    ctx.save();
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#333';
                    ctx.font = 'bold 18px Cairo';
                    ctx.fillText('100%', centerX, centerY - 5);
                    ctx.font = '12px Cairo';
                    ctx.fillStyle = '#666';
                    ctx.fillText('إجمالي المنتجات', centerX, centerY + 15);
                    ctx.restore();
                }
            }]
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

// ============================================
// Order Preparation System Functions
// ============================================

// Load Orders Data for Preparation System
function loadOrdersData() {
    console.log('Loading orders data...');
    console.log('Current preparation orders:', preparationOrders);
    
    // Ensure data is loaded
    if (!preparationOrders || preparationOrders.length === 0) {
        console.log('No preparation orders found, reloading data...');
        preparationOrders = [...samplePreparationOrders];
    }
    
    loadPreparationData();
    updateOrderCounters();
    loadOrderSections();
    
    console.log('Orders loaded successfully:', preparationOrders.length, 'orders');
}

// Load all preparation data
function loadPreparationData() {
    // This will be called when switching to orders tab
    switchOrderTab(currentOrderTab);
}

// Update order counters
function updateOrderCounters() {
    const newOrders = preparationOrders.filter(order => order.status === 'new');
    const preparingOrders = preparationOrders.filter(order => order.status === 'preparing');
    const completedOrders = preparationOrders.filter(order => {
        const today = new Date();
        const orderDate = new Date(order.orderDate);
        return order.status === 'completed' && 
               today.toDateString() === orderDate.toDateString();
    });
    
    // Update counter displays
    const newCountElement = document.getElementById('newOrdersCount');
    const preparingCountElement = document.getElementById('preparingOrdersCount');
    const completedCountElement = document.getElementById('completedOrdersCount');
    const newTabCountElement = document.getElementById('newTabCount');
    const preparingTabCountElement = document.getElementById('preparingTabCount');
    const completedTabCountElement = document.getElementById('completedTabCount');
    
    if (newCountElement) newCountElement.textContent = newOrders.length;
    if (preparingCountElement) preparingCountElement.textContent = preparingOrders.length;
    if (completedCountElement) completedCountElement.textContent = completedOrders.length;
    if (newTabCountElement) newTabCountElement.textContent = newOrders.length;
    if (preparingTabCountElement) preparingTabCountElement.textContent = preparingOrders.length;
    if (completedTabCountElement) completedTabCountElement.textContent = completedOrders.length;
}

// Switch between order tabs
function switchOrderTab(tabName) {
    currentOrderTab = tabName;
    
    // Update active tab
    const tabs = document.querySelectorAll('.order-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.onclick && tab.onclick.toString().includes(tabName)) {
            tab.classList.add('active');
        }
    });
    
    // Update active section
    const sections = document.querySelectorAll('.order-section');
    sections.forEach(section => section.classList.remove('active'));
    
    const activeSection = document.getElementById(`${tabName}OrdersSection`);
    if (activeSection) {
        activeSection.classList.add('active');
    }
    
    // Load orders for the selected tab
    loadOrderSections();
}

// Load order sections
function loadOrderSections() {
    loadNewOrders();
    loadPreparingOrders();
    loadCompletedOrders();
}

// Load new orders
function loadNewOrders() {
    const newOrdersGrid = document.getElementById('newOrdersGrid');
    if (!newOrdersGrid) return;
    
    const newOrders = preparationOrders.filter(order => order.status === 'new');
    newOrdersGrid.innerHTML = '';
    
    newOrders.forEach(order => {
        const orderCard = createPreparationOrderCard(order);
        newOrdersGrid.appendChild(orderCard);
    });
    
    if (newOrders.length === 0) {
        newOrdersGrid.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">لا توجد طلبات جديدة</p>';
    }
}

// Load preparing orders
function loadPreparingOrders() {
    const preparingOrdersGrid = document.getElementById('preparingOrdersGrid');
    if (!preparingOrdersGrid) return;
    
    const preparingOrders = preparationOrders.filter(order => order.status === 'preparing');
    preparingOrdersGrid.innerHTML = '';
    
    preparingOrders.forEach(order => {
        const orderCard = createPreparationOrderCard(order);
        preparingOrdersGrid.appendChild(orderCard);
    });
    
    if (preparingOrders.length === 0) {
        preparingOrdersGrid.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">لا توجد طلبات قيد التجهيز</p>';
    }
}

// Load completed orders
function loadCompletedOrders() {
    const completedOrdersGrid = document.getElementById('completedOrdersGrid');
    if (!completedOrdersGrid) return;
    
    const today = new Date();
    const completedOrders = preparationOrders.filter(order => {
        const orderDate = new Date(order.orderDate);
        return order.status === 'completed' && 
               today.toDateString() === orderDate.toDateString();
    });
    
    completedOrdersGrid.innerHTML = '';
    
    completedOrders.forEach(order => {
        const orderCard = createPreparationOrderCard(order);
        completedOrdersGrid.appendChild(orderCard);
    });
    
    if (completedOrders.length === 0) {
        completedOrdersGrid.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">لا توجد طلبات مكتملة اليوم</p>';
    }
}

// Create preparation order card
function createPreparationOrderCard(order) {
    const card = document.createElement('div');
    card.className = `order-card ${order.status} ${order.urgent ? 'urgent' : ''}`;
    
    // Add event listener instead of inline onclick for better debugging
    card.addEventListener('click', function() {
        console.log('Order card clicked, ID:', order.id);
        showOrderDetailsModal(order.id);
    });
    
    const orderTime = getTimeAgo(order.orderDate);
    const paymentMethodClass = order.paymentMethod === 'cash' ? 'cash' : 'instapay';
    const paymentMethodText = order.paymentMethod === 'cash' ? 'نقدي' : 'إنستاباي';
    const paymentMethodIcon = order.paymentMethod === 'cash' ? 'fas fa-money-bill' : 'fab fa-cc-visa';
    
    card.innerHTML = `
        <div class="order-header">
            <div class="order-id">#${order.id}</div>
            <div class="order-time">${orderTime}</div>
        </div>
        
        <div class="customer-details">
            <div class="customer-name">
                <i class="fas fa-user"></i>
                ${order.customerName}
            </div>
            <div class="customer-contact">
                <span><i class="fas fa-phone"></i> ${order.customerPhone}</span>
                <span><i class="fas fa-envelope"></i> ${order.customerEmail}</span>
            </div>
            <div class="customer-address">
                <i class="fas fa-map-marker-alt"></i>
                ${order.address}
            </div>
        </div>
        
        <div class="order-summary">
            <div class="order-total">
                <span>المجموع:</span>
                <span>${order.total.toFixed(2)} ر.س</span>
            </div>
            <div class="payment-method ${paymentMethodClass}">
                <i class="${paymentMethodIcon}"></i>
                ${paymentMethodText}
            </div>
            <div class="order-items-count">
                <i class="fas fa-shopping-basket"></i>
                ${order.items.length} منتج (${order.items.reduce((sum, item) => sum + item.quantity, 0)} قطعة)
            </div>
        </div>
        
        ${order.status === 'new' ? `
            <div class="order-actions">
                <button class="btn-prepare" onclick="event.stopPropagation(); showOrderDetailsModal(${order.id})">
                    <i class="fas fa-play"></i> بدء التجهيز
                </button>
            </div>
        ` : ''}
    `;
    
    return card;
}

// Show order details modal
function showOrderDetailsModal(orderId) {
    console.log('Opening order details for ID:', orderId);
    const order = preparationOrders.find(o => o.id === orderId);
    console.log('Found order:', order);
    
    if (!order) {
        console.error('Order not found:', orderId);
        showToast('خطأ: لم يتم العثور على الطلب', 'error');
        return;
    }
    
    // Ensure modal exists before proceeding
    const modal = document.getElementById('orderDetailsModal');
    if (!modal) {
        console.error('Order details modal not found');
        showToast('خطأ: نافذة التفاصيل غير موجودة', 'error');
        return;
    }
    
    // Wait for DOM to be ready then update content
    setTimeout(() => {
        // Update customer info
        const customerInfo = document.getElementById('customerInfo');
        console.log('Customer info element:', customerInfo);
        
        if (customerInfo) {
            customerInfo.innerHTML = `
                <h4><i class="fas fa-user"></i> معلومات العميل</h4>
                <div class="customer-details-grid">
                    <div class="detail-item">
                        <span class="detail-label">الاسم:</span>
                        <span class="detail-value">${order.customerName}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">الهاتف:</span>
                        <span class="detail-value">${order.customerPhone}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">الإيميل:</span>
                        <span class="detail-value">${order.customerEmail}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">العنوان:</span>
                        <span class="detail-value">${order.address}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">المجموع:</span>
                        <span class="detail-value">${order.total.toFixed(2)} ر.س</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">طريقة الدفع:</span>
                        <span class="detail-value">${order.paymentMethod === 'cash' ? 'نقدي' : 'إنستاباي'}</span>
                    </div>
                </div>
            `;
            console.log('Customer info updated successfully');
        } else {
            console.error('Customer info element not found');
        }
        
        // Update order items
        const orderItems = document.getElementById('orderItems');
        console.log('Order items element:', orderItems);
        console.log('Order items data:', order.items);
        
        if (orderItems && order.items && order.items.length > 0) {
            const itemsHtml = order.items.map(item => {
                const itemStatusClass = item.status === 'prepared' ? 'prepared' : 
                                       item.status === 'replaced' ? 'replaced' : '';
                
                return `
                    <div class="order-item ${itemStatusClass}" data-item-id="${item.id}">
                        <div class="item-info">
                            <img src="${item.image || 'https://via.placeholder.com/60x60/dc2626/white?text=منتج'}" alt="${item.name}" class="item-image">
                            <div class="item-details">
                                <div class="item-name">${item.name}</div>
                                <div class="item-price">الكمية: ${item.quantity} | السعر: ${item.price.toFixed(2)} ر.س</div>
                            </div>
                            <div class="item-quantity">×${item.quantity}</div>
                        </div>
                        
                        ${item.status === 'pending' || item.status === 'preparing' ? `
                            <div class="item-actions">
                                <button class="btn-item-ready" onclick="markItemReady(${order.id}, ${item.id})">
                                    <i class="fas fa-check"></i> تم
                                </button>
                                <button class="btn-item-replace" onclick="showReplaceProductModal(${order.id}, ${item.id})">
                                    <i class="fas fa-exchange-alt"></i> استبدال
                                </button>
                                <button class="btn-item-delete" onclick="deleteOrderItem(${order.id}, ${item.id})">
                                    <i class="fas fa-trash"></i> حذف
                                </button>
                            </div>
                        ` : ''}
                    </div>
                `;
            }).join('');
            
            orderItems.innerHTML = `
                <h4><i class="fas fa-shopping-basket"></i> منتجات الطلب</h4>
                <div class="item-list">
                    ${itemsHtml}
                </div>
            `;
            console.log('Order items updated successfully');
        } else {
            console.error('Order items element not found or no items in order');
            if (orderItems) {
                orderItems.innerHTML = `
                    <h4><i class="fas fa-shopping-basket"></i> منتجات الطلب</h4>
                    <div class="item-list">
                        <p style="text-align: center; padding: 20px; color: #999;">لا توجد منتجات في هذا الطلب</p>
                    </div>
                `;
            }
        }
        
        // Add order title to modal header
        const modalTitle = document.querySelector('#orderDetailsModal .modal-header h3');
        if (modalTitle) {
            modalTitle.innerHTML = `<i class="fas fa-clipboard-list"></i> تفاصيل الطلب #${order.id}`;
        }
        
    }, 100); // Small delay to ensure DOM is ready
    
    showModal('orderDetailsModal');
}

// Start preparing order
function startPreparingOrder() {
    const modal = document.getElementById('orderDetailsModal');
    if (modal && modal.style.display !== 'none') {
        // Get the order ID from the currently opened modal
        // This is a simplified approach - in a real app, you'd store the current order ID
        showToast('تم بدء تجهيز الطلب', 'success');
        closeModal('orderDetailsModal');
    }
}

// ============================================
// Sound System Functions
// ============================================

// Toggle notification sound
function toggleNotificationSound() {
    soundEnabled = !soundEnabled;
    const soundBtn = document.getElementById('soundToggle');
    const soundIcon = document.getElementById('soundIcon');
    const soundText = document.getElementById('soundText');
    
    if (soundEnabled) {
        soundBtn.classList.add('active');
        soundBtn.classList.remove('inactive');
        soundIcon.className = 'fas fa-volume-up';
        soundText.textContent = 'الصوت مفعل';
    } else {
        soundBtn.classList.remove('active');
        soundBtn.classList.add('inactive');
        soundIcon.className = 'fas fa-volume-mute';
        soundText.textContent = 'الصوت معطل';
    }
}

// Play new order notification
function playNewOrderNotification() {
    if (!soundEnabled) return;
    
    const audio = document.getElementById('newOrderNotification');
    if (audio) {
        audio.play().catch(e => {
            console.log('Could not play notification sound:', e);
        });
    }
}

// ============================================
// Order Item Management Functions
// ============================================

// Mark item as ready
function markItemReady(orderId, itemId) {
    const orderIndex = preparationOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;
    
    const itemIndex = preparationOrders[orderIndex].items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;
    
    // Mark item as prepared
    preparationOrders[orderIndex].items[itemIndex].status = 'prepared';
    
    // Check if all items are prepared
    const allItemsPrepared = preparationOrders[orderIndex].items.every(item => item.status === 'prepared');
    if (allItemsPrepared) {
        preparationOrders[orderIndex].status = 'completed';
        showToast('تم إكمال تجهيز الطلب بالكامل! 🎉', 'success');
    } else {
        // Update order status to preparing if not already
        if (preparationOrders[orderIndex].status === 'new') {
            preparationOrders[orderIndex].status = 'preparing';
        }
        showToast('تم تجهيز المنتج بنجاح', 'success');
    }
    
    // Refresh the modal and counters
    showOrderDetailsModal(orderId);
    updateOrderCounters();
    loadOrderSections();
}

// Delete order item
function deleteOrderItem(orderId, itemId) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج من الطلب؟')) {
        return;
    }
    
    const orderIndex = preparationOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;
    
    const itemIndex = preparationOrders[orderIndex].items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;
    
    // Remove item from order
    const removedItem = preparationOrders[orderIndex].items.splice(itemIndex, 1)[0];
    
    // Update order total
    preparationOrders[orderIndex].total -= removedItem.price * removedItem.quantity;
    
    // Check if order has no items left
    if (preparationOrders[orderIndex].items.length === 0) {
        if (confirm('لا توجد منتجات متبقية في الطلب. هل تريد إلغاء الطلب بالكامل؟')) {
            preparationOrders[orderIndex].status = 'cancelled';
            closeModal('orderDetailsModal');
        }
    }
    
    showToast('تم حذف المنتج من الطلب', 'success');
    
    // Refresh the modal and data
    showOrderDetailsModal(orderId);
    updateOrderCounters();
    loadOrderSections();
}

// Show replace product modal
function showReplaceProductModal(orderId, itemId) {
    const order = preparationOrders.find(o => o.id === orderId);
    const item = order?.items.find(i => i.id === itemId);
    
    if (!order || !item) return;
    
    // Store current replacement context
    currentReplacementContext = { orderId, itemId };
    
    // Show original product info
    const originalProduct = document.getElementById('originalProduct');
    if (originalProduct) {
        originalProduct.innerHTML = `
            <h4>المنتج المطلوب استبداله:</h4>
            <div style="display: flex; align-items: center; gap: 15px;">
                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; border-radius: 8px;">
                <div>
                    <div style="font-weight: 700; margin-bottom: 5px;">${item.name}</div>
                    <div style="color: #666; font-size: 12px;">الكمية: ${item.quantity} | السعر: ${item.price.toFixed(2)} ر.س</div>
                </div>
            </div>
        `;
    }
    
    // Load replacement products
    loadReplacementProducts();
    
    showModal('replaceProductModal');
}

// Load replacement products
function loadReplacementProducts() {
    const replacementProductsContainer = document.getElementById('replacementProducts');
    if (!replacementProductsContainer) return;
    
    replacementProductsContainer.innerHTML = '';
    
    // Filter available products (excluding current item)
    const availableProducts = products.filter(product => product.stock > 0);
    
    availableProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'replacement-item';
        productElement.onclick = () => selectReplacement(product);
        
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; border-radius: 8px;">
            <div style="flex: 1;">
                <div style="font-weight: 700; margin-bottom: 5px;">${product.name}</div>
                <div style="color: #666; font-size: 12px;">السعر: ${product.price.toFixed(2)} ر.س | المتوفر: ${product.stock}</div>
                <div style="color: #666; font-size: 12px;">${getCategoryName(product.category)}</div>
            </div>
            <div style="color: #10b981; font-weight: 600;">
                <i class="fas fa-plus"></i> اختيار
            </div>
        `;
        
        replacementProductsContainer.appendChild(productElement);
    });
}

// Select replacement product
function selectReplacement(replacementProduct) {
    if (!currentReplacementContext) return;
    
    const { orderId, itemId } = currentReplacementContext;
    const order = preparationOrders.find(o => o.id === orderId);
    const originalItem = order?.items.find(i => i.id === itemId);
    
    if (!order || !originalItem) return;
    
    // Show customer confirmation modal
    showCustomerConfirmationModal(order, originalItem, replacementProduct);
    closeModal('replaceProductModal');
}

// Show customer confirmation modal
function showCustomerConfirmationModal(order, originalItem, replacementProduct) {
    // Update customer info
    document.getElementById('confirmationCustomerName').textContent = order.customerName;
    document.getElementById('confirmationCustomerPhone').textContent = order.customerPhone;
    
    // Update product comparison
    const originalProductDiv = document.getElementById('confirmationOriginalProduct');
    const replacementProductDiv = document.getElementById('confirmationReplacementProduct');
    
    if (originalProductDiv) {
        originalProductDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${originalItem.image}" alt="${originalItem.name}" style="width: 50px; height: 50px; border-radius: 8px;">
                <div>
                    <div style="font-weight: 600;">${originalItem.name}</div>
                    <div style="font-size: 12px; color: #92400e;">الكمية: ${originalItem.quantity} | ${originalItem.price.toFixed(2)} ر.س</div>
                </div>
            </div>
        `;
    }
    
    if (replacementProductDiv) {
        replacementProductDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${replacementProduct.image}" alt="${replacementProduct.name}" style="width: 50px; height: 50px; border-radius: 8px;">
                <div>
                    <div style="font-weight: 600;">${replacementProduct.name}</div>
                    <div style="font-size: 12px; color: #059669;">الكمية: ${originalItem.quantity} | ${replacementProduct.price.toFixed(2)} ر.س</div>
                </div>
            </div>
        `;
    }
    
    // Store replacement data for later use
    window.currentReplacementData = { order, originalItem, replacementProduct };
    
    // Start playing notification sound
    startCustomerConfirmationSound();
    
    showModal('customerConfirmationModal');
}

// Start customer confirmation sound loop
function startCustomerConfirmationSound() {
    if (!soundEnabled) return;
    
    playNewOrderNotification();
    
    // Play notification every 3 seconds until user responds
    customerConfirmationTimer = setInterval(() => {
        playNewOrderNotification();
    }, 3000);
}

// Stop customer confirmation sound
function stopCustomerConfirmationSound() {
    if (customerConfirmationTimer) {
        clearInterval(customerConfirmationTimer);
        customerConfirmationTimer = null;
    }
}

// Customer approved replacement
function customerApproved() {
    if (!window.currentReplacementData) return;
    
    const { order, originalItem, replacementProduct } = window.currentReplacementData;
    
    // Find order and item
    const orderIndex = preparationOrders.findIndex(o => o.id === order.id);
    const itemIndex = preparationOrders[orderIndex].items.findIndex(i => i.id === originalItem.id);
    
    if (orderIndex !== -1 && itemIndex !== -1) {
        // Update the item with replacement
        preparationOrders[orderIndex].items[itemIndex] = {
            ...originalItem,
            name: replacementProduct.name,
            price: replacementProduct.price,
            image: replacementProduct.image,
            status: 'replaced'
        };
        
        // Update order total
        const priceDifference = (replacementProduct.price - originalItem.price) * originalItem.quantity;
        preparationOrders[orderIndex].total += priceDifference;
        
        showToast('تم قبول الاستبدال وتحديث الطلب', 'success');
    }
    
    // Clean up
    stopCustomerConfirmationSound();
    closeModal('customerConfirmationModal');
    currentReplacementContext = null;
    window.currentReplacementData = null;
    
    // Refresh data
    updateOrderCounters();
    loadOrderSections();
}

// Customer rejected replacement
function customerRejected() {
    showToast('العميل رفض الاستبدال', 'warning');
    
    // Clean up
    stopCustomerConfirmationSound();
    closeModal('customerConfirmationModal');
    currentReplacementContext = null;
    window.currentReplacementData = null;
}

// Cancel replacement
function cancelReplacement() {
    // Clean up
    stopCustomerConfirmationSound();
    closeModal('customerConfirmationModal');
    currentReplacementContext = null;
    window.currentReplacementData = null;
}

// Search replacement products
function searchReplacementProducts() {
    const searchTerm = document.getElementById('replaceProductSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('replaceCategoryFilter').value;
    
    let filteredProducts = products.filter(product => {
        if (product.stock <= 0) return false;
        
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                             product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });
    
    displayFilteredReplacements(filteredProducts);
}

// Display filtered replacement products
function displayFilteredReplacements(filteredProducts) {
    const replacementProductsContainer = document.getElementById('replacementProducts');
    if (!replacementProductsContainer) return;
    
    replacementProductsContainer.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'replacement-item';
        productElement.onclick = () => selectReplacement(product);
        
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; border-radius: 8px;">
            <div style="flex: 1;">
                <div style="font-weight: 700; margin-bottom: 5px;">${product.name}</div>
                <div style="color: #666; font-size: 12px;">السعر: ${product.price.toFixed(2)} ر.س | المتوفر: ${product.stock}</div>
                <div style="color: #666; font-size: 12px;">${getCategoryName(product.category)}</div>
            </div>
            <div style="color: #10b981; font-weight: 600;">
                <i class="fas fa-plus"></i> اختيار
            </div>
        `;
        
        replacementProductsContainer.appendChild(productElement);
    });
    
    if (filteredProducts.length === 0) {
        replacementProductsContainer.innerHTML = '<p style="text-align: center; padding: 20px; color: #999;">لم يتم العثور على منتجات مطابقة للبحث</p>';
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
    console.log('Showing modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        // Use class-based approach that matches CSS
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        console.log('Modal displayed successfully');
    } else {
        console.error('Modal not found:', modalId);
    }
}

function closeModal(modalId) {
    console.log('Closing modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        // Use class-based approach that matches CSS
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        console.log('Modal closed successfully');
    } else {
        console.error('Modal not found:', modalId);
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

// Add event listeners for replacement search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Replace product search - use setTimeout to ensure modal elements are created
    setTimeout(() => {
        const replaceProductSearch = document.getElementById('replaceProductSearch');
        if (replaceProductSearch) {
            replaceProductSearch.addEventListener('input', searchReplacementProducts);
        }
        
        const replaceCategoryFilter = document.getElementById('replaceCategoryFilter');
        if (replaceCategoryFilter) {
            replaceCategoryFilter.addEventListener('change', searchReplacementProducts);
        }
    }, 1000); // Delay to ensure elements are created
});

// Settings Functions

function loadSettingsData() {
    loadStoreStatus();
    loadWorkHours();
    loadNotificationSettings();
    loadSystemSettings();
    checkTempCloseStatus();
}

function loadStoreStatus() {
    const statusText = document.getElementById('storeStatusText');
    const statusDot = document.getElementById('storeStatusDot');
    const statusCard = document.querySelector('.store-status-card');
    const currentClosureInfo = document.getElementById('currentClosureInfo');
    
    // Reset all status classes
    const statusBtns = document.querySelectorAll('.status-btn');
    statusBtns.forEach(btn => btn.classList.remove('active'));
    
    if (statusText && statusDot && statusCard) {
        statusCard.className = 'setting-card store-status-card';
        
        switch(storeSettings.status) {
            case 'open':
                statusText.textContent = 'مفتوح';
                statusText.className = 'status-text';
                statusDot.className = 'status-dot open';
                statusCard.classList.add('open');
                document.getElementById('openBtn').classList.add('active');
                if (currentClosureInfo) currentClosureInfo.style.display = 'none';
                break;
                
            case 'temp-closed':
                statusText.textContent = 'مغلق مؤقتاً';
                statusText.className = 'status-text temp-closed';
                statusDot.className = 'status-dot temp-closed';
                statusCard.classList.add('temp-closed');
                document.getElementById('tempCloseBtn').classList.add('active');
                showClosureInfo();
                break;
                
            case 'closed':
                statusText.textContent = 'مغلق';
                statusText.className = 'status-text closed';
                statusDot.className = 'status-dot closed';
                statusCard.classList.add('closed');
                document.getElementById('closedBtn').classList.add('active');
                if (currentClosureInfo) currentClosureInfo.style.display = 'none';
                break;
        }
    }
}

function showClosureInfo() {
    const currentClosureInfo = document.getElementById('currentClosureInfo');
    const closureReason = document.getElementById('closureReason');
    const closureTime = document.getElementById('closureTime');
    
    if (currentClosureInfo && storeSettings.status === 'temp-closed') {
        currentClosureInfo.style.display = 'block';
        
        if (closureReason) {
            closureReason.textContent = storeSettings.tempCloseReason || 'إغلاق مؤقت';
        }
        
        if (closureTime && storeSettings.tempCloseUntil) {
            const reopenDate = new Date(storeSettings.tempCloseUntil);
            const now = new Date();
            const timeDiff = reopenDate - now;
            
            if (timeDiff > 0) {
                const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                
                closureTime.textContent = `سيفتح بعد ${hours} ساعة و ${minutes} دقيقة`;
            } else {
                closureTime.textContent = 'انتهى وقت الإغلاق المؤقت';
            }
        }
    }
}

function loadWorkHours() {
    const workHoursGrid = document.getElementById('workHoursGrid');
    if (!workHoursGrid) return;
    
    const days = {
        'saturday': 'السبت',
        'sunday': 'الأحد', 
        'monday': 'الاثنين',
        'tuesday': 'الثلاثاء',
        'wednesday': 'الأربعاء',
        'thursday': 'الخميس',
        'friday': 'الجمعة'
    };
    
    let html = '';
    Object.keys(days).forEach(dayKey => {
        const day = storeSettings.workHours[dayKey];
        const isDisabled = !day.enabled ? 'disabled' : '';
        
        html += `
            <div class="work-day ${isDisabled}">
                <div class="day-name">${days[dayKey]}</div>
                <div class="time-range">
                    <input type="time" id="${dayKey}_start" value="${day.start}" ${!day.enabled ? 'disabled' : ''}>
                    <span>إلى</span>
                    <input type="time" id="${dayKey}_end" value="${day.end}" ${!day.enabled ? 'disabled' : ''}>
                </div>
                <div class="day-toggle">
                    <label class="toggle-switch">
                        <input type="checkbox" ${day.enabled ? 'checked' : ''} onchange="toggleWorkDay('${dayKey}', this.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
        `;
    });
    
    workHoursGrid.innerHTML = html;
}

function toggleWorkDay(day, enabled) {
    storeSettings.workHours[day].enabled = enabled;
    
    const startInput = document.getElementById(`${day}_start`);
    const endInput = document.getElementById(`${day}_end`);
    const workDay = startInput.closest('.work-day');
    
    if (enabled) {
        startInput.disabled = false;
        endInput.disabled = false;
        workDay.classList.remove('disabled');
    } else {
        startInput.disabled = true;
        endInput.disabled = true;
        workDay.classList.add('disabled');
    }
}

function loadNotificationSettings() {
    const settings = storeSettings.notifications;
    
    const orderSoundToggle = document.getElementById('orderSoundToggle');
    const lowStockSoundToggle = document.getElementById('lowStockSoundToggle');
    const desktopNotificationsToggle = document.getElementById('desktopNotificationsToggle');
    const badgeCountToggle = document.getElementById('badgeCountToggle');
    
    if (orderSoundToggle) orderSoundToggle.checked = settings.orderSound;
    if (lowStockSoundToggle) lowStockSoundToggle.checked = settings.lowStockSound;
    if (desktopNotificationsToggle) desktopNotificationsToggle.checked = settings.desktopNotifications;
    if (badgeCountToggle) badgeCountToggle.checked = settings.badgeCount;
}

function loadSystemSettings() {
    const currencySymbol = document.getElementById('currencySymbol');
    const minOrderAmount = document.getElementById('minOrderAmount');
    const deliveryFee = document.getElementById('deliveryFee');
    const preparationTime = document.getElementById('preparationTime');
    const deliveryTime = document.getElementById('deliveryTime');
    const deliveryRadius = document.getElementById('deliveryRadius');
    
    if (currencySymbol) currencySymbol.value = storeSettings.currency;
    if (minOrderAmount) minOrderAmount.value = storeSettings.minOrderAmount;
    if (deliveryFee) deliveryFee.value = storeSettings.deliveryFee;
    if (preparationTime) preparationTime.value = storeSettings.preparationTime;
    if (deliveryTime) deliveryTime.value = storeSettings.deliveryTime;
    if (deliveryRadius) deliveryRadius.value = storeSettings.deliveryRadius;
}

function setStoreStatus(status) {
    if (status === 'temp-closed') return; // Use modal for temp close
    
    storeSettings.status = status;
    storeSettings.tempCloseUntil = null;
    storeSettings.tempCloseReason = '';
    
    if (tempCloseTimer) {
        clearTimeout(tempCloseTimer);
        tempCloseTimer = null;
    }
    
    loadStoreStatus();
    showToast(status === 'open' ? 'تم فتح الفرع بنجاح' : 'تم إغلاق الفرع', 'success');
}

function showTempCloseModal() {
    const modal = document.getElementById('tempCloseModal');
    if (modal) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        const reopenDate = document.getElementById('reopenDate');
        if (reopenDate) {
            reopenDate.min = today;
            reopenDate.value = today;
        }
        
        // Set current time + 1 hour as default
        const now = new Date();
        now.setHours(now.getHours() + 1);
        const timeString = now.toTimeString().slice(0, 5);
        const reopenTime = document.getElementById('reopenTime');
        if (reopenTime) {
            reopenTime.value = timeString;
        }
        
        modal.style.display = 'flex';
    }
}

function selectCloseOption(option) {
    // Remove selected class from all options
    const options = document.querySelectorAll('.close-option');
    options.forEach(opt => opt.classList.remove('selected'));
    
    // Add selected class to clicked option
    const selectedOption = document.querySelector(`.close-option`);
    if (selectedOption) {
        event.currentTarget.classList.add('selected');
    }
    
    // Check the radio button
    const radio = document.getElementById(`close${option.charAt(0).toUpperCase() + option.slice(1)}`);
    if (radio) radio.checked = true;
    
    // Show/hide custom time section
    const customTimeSection = document.getElementById('customTimeSection');
    if (customTimeSection) {
        customTimeSection.style.display = option === 'custom' ? 'block' : 'none';
    }
}

function confirmTempClose() {
    const selectedOption = document.querySelector('input[name="closeOption"]:checked');
    if (!selectedOption) {
        showToast('يرجى اختيار نوع الإغلاق المؤقت', 'error');
        return;
    }
    
    const reason = document.getElementById('closeReasonText').value || 'إغلاق مؤقت';
    let reopenTime;
    
    switch(selectedOption.value) {
        case '1hour':
            reopenTime = new Date();
            reopenTime.setHours(reopenTime.getHours() + 1);
            break;
            
        case 'custom':
            const dateInput = document.getElementById('reopenDate').value;
            const timeInput = document.getElementById('reopenTime').value;
            
            if (!dateInput || !timeInput) {
                showToast('يرجى تحديد تاريخ ووقت إعادة الفتح', 'error');
                return;
            }
            
            reopenTime = new Date(`${dateInput}T${timeInput}`);
            
            if (reopenTime <= new Date()) {
                showToast('وقت إعادة الفتح يجب أن يكون في المستقبل', 'error');
                return;
            }
            break;
            
        case 'endOfDay':
            reopenTime = new Date();
            reopenTime.setDate(reopenTime.getDate() + 1);
            // Set to next day's opening time (assuming 8 AM)
            reopenTime.setHours(8, 0, 0, 0);
            break;
    }
    
    storeSettings.status = 'temp-closed';
    storeSettings.tempCloseUntil = reopenTime.toISOString();
    storeSettings.tempCloseReason = reason;
    
    // Set timer to automatically reopen
    const timeUntilReopen = reopenTime.getTime() - new Date().getTime();
    if (timeUntilReopen > 0) {
        tempCloseTimer = setTimeout(() => {
            setStoreStatus('open');
            showToast('تم فتح الفرع تلقائياً', 'success');
        }, timeUntilReopen);
    }
    
    loadStoreStatus();
    closeModal('tempCloseModal');
    showToast('تم إغلاق الفرع مؤقتاً', 'success');
}

function reopenStore() {
    setStoreStatus('open');
}

function checkTempCloseStatus() {
    if (storeSettings.status === 'temp-closed' && storeSettings.tempCloseUntil) {
        const reopenTime = new Date(storeSettings.tempCloseUntil);
        const now = new Date();
        
        if (now >= reopenTime) {
            // Time has passed, reopen automatically
            setStoreStatus('open');
            showToast('انتهى وقت الإغلاق المؤقت - تم فتح الفرع', 'success');
        } else {
            // Set timer for automatic reopening
            const timeUntilReopen = reopenTime.getTime() - now.getTime();
            tempCloseTimer = setTimeout(() => {
                setStoreStatus('open');
                showToast('تم فتح الفرع تلقائياً', 'success');
            }, timeUntilReopen);
        }
    }
}

function saveWorkHours() {
    const days = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    
    days.forEach(day => {
        if (storeSettings.workHours[day].enabled) {
            const startInput = document.getElementById(`${day}_start`);
            const endInput = document.getElementById(`${day}_end`);
            
            if (startInput && endInput) {
                storeSettings.workHours[day].start = startInput.value;
                storeSettings.workHours[day].end = endInput.value;
            }
        }
    });
    
    showToast('تم حفظ ساعات العمل بنجاح', 'success');
}

function saveAllSettings() {
    // Save notification settings
    const orderSoundToggle = document.getElementById('orderSoundToggle');
    const lowStockSoundToggle = document.getElementById('lowStockSoundToggle');
    const desktopNotificationsToggle = document.getElementById('desktopNotificationsToggle');
    const badgeCountToggle = document.getElementById('badgeCountToggle');
    
    if (orderSoundToggle) storeSettings.notifications.orderSound = orderSoundToggle.checked;
    if (lowStockSoundToggle) storeSettings.notifications.lowStockSound = lowStockSoundToggle.checked;
    if (desktopNotificationsToggle) storeSettings.notifications.desktopNotifications = desktopNotificationsToggle.checked;
    if (badgeCountToggle) storeSettings.notifications.badgeCount = badgeCountToggle.checked;
    
    // Save system settings
    const currencySymbol = document.getElementById('currencySymbol');
    const minOrderAmount = document.getElementById('minOrderAmount');
    const deliveryFee = document.getElementById('deliveryFee');
    const preparationTime = document.getElementById('preparationTime');
    const deliveryTime = document.getElementById('deliveryTime');
    const deliveryRadius = document.getElementById('deliveryRadius');
    
    if (currencySymbol) storeSettings.currency = currencySymbol.value;
    if (minOrderAmount) storeSettings.minOrderAmount = parseFloat(minOrderAmount.value) || 50;
    if (deliveryFee) storeSettings.deliveryFee = parseFloat(deliveryFee.value) || 15;
    if (preparationTime) storeSettings.preparationTime = parseInt(preparationTime.value) || 30;
    if (deliveryTime) storeSettings.deliveryTime = parseInt(deliveryTime.value) || 45;
    if (deliveryRadius) storeSettings.deliveryRadius = parseInt(deliveryRadius.value) || 25;
    
    // Save work hours
    saveWorkHours();
    
    // Update currency labels
    const currencyLabels = document.querySelectorAll('.currency-label');
    currencyLabels.forEach(label => {
        label.textContent = storeSettings.currency;
    });
    
    showToast('تم حفظ جميع الإعدادات بنجاح', 'success');
}

function resetSettings() {
    if (confirm('هل أنت متأكد من استعادة الإعدادات الافتراضية؟ سيتم فقدان جميع التخصيصات الحالية.')) {
        // Reset to default settings
        storeSettings = {
            status: 'open',
            tempCloseUntil: null,
            tempCloseReason: '',
            workHours: {
                saturday: { enabled: true, start: '08:00', end: '22:00' },
                sunday: { enabled: true, start: '08:00', end: '22:00' },
                monday: { enabled: true, start: '08:00', end: '22:00' },
                tuesday: { enabled: true, start: '08:00', end: '22:00' },
                wednesday: { enabled: true, start: '08:00', end: '22:00' },
                thursday: { enabled: true, start: '08:00', end: '22:00' },
                friday: { enabled: false, start: '08:00', end: '22:00' }
            },
            notifications: {
                orderSound: true,
                lowStockSound: true,
                desktopNotifications: true,
                badgeCount: true
            },
            currency: 'ر.س',
            minOrderAmount: 50,
            deliveryFee: 15,
            preparationTime: 30,
            deliveryTime: 45,
            deliveryRadius: 25
        };
        
        if (tempCloseTimer) {
            clearTimeout(tempCloseTimer);
            tempCloseTimer = null;
        }
        
        loadSettingsData();
        showToast('تم استعادة الإعدادات الافتراضية', 'success');
    }
}

function showSettings() {
    switchTab('settings');
}