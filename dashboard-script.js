// ===== Global Variables =====
let currentTab = 'overview';
let branchStatus = 'open';
let closureTimer = null;

// ===== Data Structure (Replace with actual database connection) =====
const sampleData = {
    sales: {
        today: 0,
        week: [0, 0, 0, 0, 0, 0, 0],
        month: 0
    },
    orders: {
        today: 0,
        total: 0,
        recent: []
    },
    users: {
        total: 0,
        new: 0
    },
    ratings: {
        average: 0,
        total: 0,
        breakdown: {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
        }
    },
    paymentMethods: {
        cash: 0,
        card: 0,
        online: 0
    },
    locations: [],
    topProducts: [],
    reviews: []
};

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    loadOverviewData();
    checkBranchStatus();

});

function initializeDashboard() {
    // Load saved branch status
    const savedStatus = localStorage.getItem('branchStatus');
    if (savedStatus) {
        branchStatus = savedStatus;
        updateBranchStatusDisplay();
    }
    
    // Load saved working hours
    loadWorkingHours();
    
    // Check for temporary closure
    checkTemporaryClosure();
}

function setupEventListeners() {
    // Tab navigation
    const navItems = document.querySelectorAll('.nav-item');
    if (navItems.length > 0) {
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const tab = this.getAttribute('data-tab');
                if (tab) {
                    switchTab(tab);
                }
            });
        });
    } else {
        console.warn('No navigation items found');
    }
    
    // Filter buttons
    document.querySelectorAll('.filter-btn[data-period]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn[data-period]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (this.getAttribute('data-period') === 'custom') {
                document.querySelector('.custom-date-range').style.display = 'flex';
            } else {
                document.querySelector('.custom-date-range').style.display = 'none';
                updateSalesReport(this.getAttribute('data-period'));
            }
        });
    });
    
    // Reviews filter
    document.querySelectorAll('.reviews-filter .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.reviews-filter .filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterReviews(this.getAttribute('data-stars'));
        });
    });
}

// ===== Tab Switching =====
function showTab(tab) {
    // Alias function for compatibility
    switchTab(tab);
}

function switchTab(tab) {
    if (!tab) {
        console.error('Tab parameter is required');
        return;
    }
    
    currentTab = tab;
    
    // Update navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNavItem = document.querySelector(`[data-tab="${tab}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    } else {
        console.warn(`Navigation item for tab "${tab}" not found`);
    }
    
    // Update content
    const allTabContent = document.querySelectorAll('.tab-content');
    allTabContent.forEach(content => {
        content.classList.remove('active');
    });
    
    const targetTabContent = document.getElementById(`${tab}-tab`);
    if (targetTabContent) {
        targetTabContent.classList.add('active');
    } else {
        console.warn(`Tab content for "${tab}-tab" not found`);
    }
    
    // Load tab-specific data
    switch(tab) {
        case 'overview':
            loadOverviewData();
            break;
        case 'sales':
            loadSalesData();
            break;
        case 'reviews':
            loadReviewsData();
            break;
        case 'settings':
            loadSettingsData();
            break;
           case 'products':
               if (typeof initializeProductsManagement === 'function') {
                   initializeProductsManagement();
               } else {
                   console.error('initializeProductsManagement function not found');
               }
               break;
           case 'delivery-prices':
               if (typeof initializeDeliveryPrices === 'function') {
                   initializeDeliveryPrices();
               } else {
                   console.error('initializeDeliveryPrices function not found');
               }
               break;
    }
}

// ===== Overview Tab =====
function loadOverviewData() {
    // Update stats
    document.getElementById('total-sales').textContent = formatCurrency(sampleData.sales.today);
    document.getElementById('total-orders').textContent = sampleData.orders.today;
    document.getElementById('total-users').textContent = sampleData.users.total;
    document.getElementById('avg-rating').textContent = sampleData.ratings.average;
    
    // Load recent orders
    loadRecentOrders();
    
    // Create charts
    createWeeklySalesChart();
    createPaymentMethodsChart();
}

function loadRecentOrders() {
    const tbody = document.getElementById('recent-orders-body');
    tbody.innerHTML = '';
    
    sampleData.orders.recent.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td><strong>${formatCurrency(order.amount)}</strong></td>
            <td><span class="order-status ${order.status}">${getStatusText(order.status)}</span></td>
            <td>${order.date}</td>
        `;
        tbody.appendChild(row);
    });
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'قيد الانتظار',
        'processing': 'قيد المعالجة',
        'completed': 'مكتمل',
        'cancelled': 'ملغي'
    };
    return statusMap[status] || status;
}

// ===== Sales Tab =====
function loadSalesData() {
    // Update payment methods
    document.getElementById('cash-sales').textContent = formatCurrency(sampleData.paymentMethods.cash);
    document.getElementById('card-sales').textContent = formatCurrency(sampleData.paymentMethods.card);
    document.getElementById('online-sales').textContent = formatCurrency(sampleData.paymentMethods.online);
    
    // Load locations table
    loadLocationsTable();
    
    // Load top products
    loadTopProducts();
    
    // Create detailed sales chart
    createDetailedSalesChart();
}

function loadLocationsTable() {
    const tbody = document.getElementById('locations-table-body');
    tbody.innerHTML = '';
    
    sampleData.locations.forEach(location => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${location.name}</strong></td>
            <td>${location.orders}</td>
            <td><strong>${formatCurrency(location.sales)}</strong></td>
            <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div class="location-bar" style="width: ${location.percentage}%; max-width: 100px;"></div>
                    <span>${location.percentage}%</span>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadTopProducts() {
    const container = document.getElementById('top-products-list');
    container.innerHTML = '';
    
    sampleData.topProducts.forEach((product, index) => {
        const item = document.createElement('div');
        item.className = 'product-item';
        item.innerHTML = `
            <div class="product-rank">${index + 1}</div>
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h4>${product.name}</h4>
                <p>${product.category}</p>
            </div>
            <div class="product-sales">
                <div class="amount">${formatCurrency(product.sales)}</div>
                <div class="units">${product.units} وحدة</div>
            </div>
        `;
        container.appendChild(item);
    });
}

function updateSalesReport(period) {
    console.log('Updating sales report for period:', period);
    // Here you would fetch and update data based on the selected period
}

function applyDateFilter() {
    const dateFrom = document.getElementById('date-from').value;
    const dateTo = document.getElementById('date-to').value;
    
    if (!dateFrom || !dateTo) {
        alert('الرجاء اختيار تاريخ البداية والنهاية');
        return;
    }
    
    console.log('Filtering from', dateFrom, 'to', dateTo);
    // Here you would filter data based on custom date range
}

// ===== Reviews Tab =====
function loadReviewsData() {
    loadReviewsList('all');
}

function loadReviewsList(filter) {
    const container = document.getElementById('reviews-list');
    container.innerHTML = '';
    
    let filteredReviews = sampleData.reviews;
    if (filter !== 'all') {
        filteredReviews = sampleData.reviews.filter(r => r.rating === parseInt(filter));
    }
    
    filteredReviews.forEach(review => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
            <div class="review-header">
                <div class="reviewer-info">
                    <img src="${review.avatar}" alt="${review.customer}" class="reviewer-avatar">
                    <div class="reviewer-details">
                        <h4>${review.customer}</h4>
                        <span class="review-date">${review.date}</span>
                    </div>
                </div>
                <div class="review-rating">
                    ${generateStars(review.rating)}
                </div>
            </div>
            <div class="review-content">
                ${review.comment}
            </div>
            <div class="review-actions">
                <button class="review-action-btn">
                    <i class="fas fa-reply"></i>
                    الرد
                </button>
                <button class="review-action-btn">
                    <i class="fas fa-flag"></i>
                    إبلاغ
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterReviews(stars) {
    loadReviewsList(stars);
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 === rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// ===== Settings Tab =====
function loadSettingsData() {
    updateBranchStatusDisplay();
    loadWorkingHours();
}

function loadWorkingHours() {
    const savedHours = localStorage.getItem('workingHours');
    if (savedHours) {
        const hours = JSON.parse(savedHours);
        Object.keys(hours).forEach(day => {
            const openInput = document.querySelector(`input[data-day="${day}"][data-type="open"]`);
            const closeInput = document.querySelector(`input[data-day="${day}"][data-type="close"]`);
            const toggle = document.querySelector(`input[type="checkbox"][data-day="${day}"]`);
            
            if (openInput) openInput.value = hours[day].open;
            if (closeInput) closeInput.value = hours[day].close;
            if (toggle) toggle.checked = hours[day].enabled;
        });
    }
}

function saveWorkingHours() {
    const hours = {};
    const days = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    
    days.forEach(day => {
        const openInput = document.querySelector(`input[data-day="${day}"][data-type="open"]`);
        const closeInput = document.querySelector(`input[data-day="${day}"][data-type="close"]`);
        const toggle = document.querySelector(`input[type="checkbox"][data-day="${day}"]`);
        
        hours[day] = {
            open: openInput.value,
            close: closeInput.value,
            enabled: toggle.checked
        };
    });
    
    localStorage.setItem('workingHours', JSON.stringify(hours));
    alert('✅ تم حفظ ساعات العمل بنجاح!');
}

// ===== Branch Control =====
function openBranch() {
    if (confirm('هل أنت متأكد من فتح الفرع؟')) {
        branchStatus = 'open';
        localStorage.setItem('branchStatus', 'open');
        localStorage.removeItem('closureTime');
        localStorage.removeItem('closureType');
        
        if (closureTimer) {
            clearTimeout(closureTimer);
            closureTimer = null;
        }
        
        updateBranchStatusDisplay();
        alert('✅ تم فتح الفرع بنجاح!');
    }
}

function closeBranch() {
    if (confirm('هل أنت متأكد من إغلاق الفرع؟')) {
        branchStatus = 'closed';
        localStorage.setItem('branchStatus', 'closed');
        updateBranchStatusDisplay();
        alert('❌ تم إغلاق الفرع');
    }
}

function showTempCloseModal() {
    document.getElementById('temp-close-modal').style.display = 'block';
}

function closeTempCloseModal() {
    document.getElementById('temp-close-modal').style.display = 'none';
}

function tempCloseBranch(duration) {
    closeTempCloseModal();
    
    let message = '';
    let reopenTime = new Date();
    
    if (duration === 'end-of-day') {
        // Close until end of day (midnight)
        reopenTime.setHours(23, 59, 59, 999);
        message = 'تم إغلاق الفرع حتى نهاية اليوم. سيتم فتحه تلقائياً في اليوم التالي.';
    } else {
        // Close for specified hours
        reopenTime.setHours(reopenTime.getHours() + duration);
        message = `تم إغلاق الفرع لمدة ${duration} ساعة. سيتم فتحه تلقائياً في ${reopenTime.toLocaleTimeString('ar-EG')}`;
    }
    
    branchStatus = 'closed';
    localStorage.setItem('branchStatus', 'closed');
    localStorage.setItem('closureTime', reopenTime.getTime());
    localStorage.setItem('closureType', duration);
    
    updateBranchStatusDisplay();
    
    // Show closure info
    const closureInfo = document.getElementById('closure-info');
    const closureMessage = document.getElementById('closure-message');
    closureMessage.textContent = message;
    closureInfo.style.display = 'flex';
    
    // Set timer to reopen
    const timeUntilReopen = reopenTime.getTime() - new Date().getTime();
    closureTimer = setTimeout(() => {
        openBranchAutomatically();
    }, timeUntilReopen);
    
    alert('⏰ ' + message);
}

function openBranchAutomatically() {
    branchStatus = 'open';
    localStorage.setItem('branchStatus', 'open');
    localStorage.removeItem('closureTime');
    localStorage.removeItem('closureType');
    
    updateBranchStatusDisplay();
    
    // Hide closure info
    const closureInfo = document.getElementById('closure-info');
    closureInfo.style.display = 'none';
    
    console.log('Branch automatically reopened');
}

function checkTemporaryClosure() {
    const closureTime = localStorage.getItem('closureTime');
    if (closureTime) {
        const reopenTime = parseInt(closureTime);
        const now = new Date().getTime();
        
        if (now < reopenTime) {
            // Still in closure period
            const timeRemaining = reopenTime - now;
            closureTimer = setTimeout(() => {
                openBranchAutomatically();
            }, timeRemaining);
            
            // Show closure info
            const closureInfo = document.getElementById('closure-info');
            const closureMessage = document.getElementById('closure-message');
            const reopenDate = new Date(reopenTime);
            closureMessage.textContent = `الفرع مغلق مؤقتاً. سيتم فتحه تلقائياً في ${reopenDate.toLocaleTimeString('ar-EG')}`;
            closureInfo.style.display = 'flex';
        } else {
            // Closure period has passed
            openBranchAutomatically();
        }
    }
}

function updateBranchStatusDisplay() {
    const indicators = document.querySelectorAll('.status-indicator, #current-status-badge');
    
    indicators.forEach(indicator => {
        const dot = indicator.querySelector('.status-dot');
        const text = indicator.querySelector('.status-text, span:last-child');
        
        if (branchStatus === 'open') {
            dot.className = 'status-dot open';
            text.textContent = 'مفتوح';
        } else {
            dot.className = 'status-dot closed';
            text.textContent = 'مغلق';
        }
    });
}

function checkBranchStatus() {
    // Check every minute
    setInterval(() => {
        checkTemporaryClosure();
    }, 60000);
}

// ===== Charts =====
function createWeeklySalesChart() {
    const ctx = document.getElementById('weekly-sales-chart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
            datasets: [{
                label: 'المبيعات (ج.م)',
                data: sampleData.sales.week,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
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
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

function createPaymentMethodsChart() {
    const ctx = document.getElementById('payment-methods-chart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['كاش', 'بطاقة ائتمان', 'دفع أونلاين'],
            datasets: [{
                data: [
                    sampleData.paymentMethods.cash,
                    sampleData.paymentMethods.card,
                    sampleData.paymentMethods.online
                ],
                backgroundColor: [
                    '#4CAF50',
                    '#2196F3',
                    '#FF9800'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createDetailedSalesChart() {
    const ctx = document.getElementById('detailed-sales-chart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
            datasets: [
                {
                    label: 'كاش',
                    data: [5400, 6750, 6075, 7200, 6525, 7650, 7087.50],
                    backgroundColor: '#4CAF50'
                },
                {
                    label: 'بطاقة',
                    data: [4200, 5250, 4725, 5600, 5075, 5950, 5512.50],
                    backgroundColor: '#2196F3'
                },
                {
                    label: 'أونلاين',
                    data: [2400, 3000, 2700, 3200, 2900, 3400, 3150],
                    backgroundColor: '#FF9800'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

// ===== Utility Functions =====
function formatCurrency(amount) {
    return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
}

function logout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'index.html';
    }
}

// ===== Temporary Closure Functions =====
function tempCloseBranch(hours) {
    let message = '';
    let endTime = '';
    
    if (hours === 'end-of-day') {
        const now = new Date();
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);
        endTime = endOfDay.toLocaleString('ar-EG');
        message = `تم إغلاق الفرع مؤقتاً حتى نهاية اليوم (${endTime})`;
    } else {
        const endDate = new Date(Date.now() + hours * 60 * 60 * 1000);
        endTime = endDate.toLocaleString('ar-EG');
        message = `تم إغلاق الفرع مؤقتاً لمدة ${hours} ساعة حتى ${endTime}`;
    }
    
    alert(message);
    closeTempCloseModal();
}

function closeTempCloseModal() {
    document.getElementById('temp-close-modal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById("temp-close-modal");
    if (event.target === modal) {
        closeTempCloseModal();
    }
}
