// Delivery Prices Management JavaScript

// Default delivery areas data
let deliveryAreas = [
    { id: 1, name: "الحي الأول", price: 25.00, description: "منطقة سكنية راقية", deliveryTime: 30, active: true, createdAt: new Date() },
    { id: 2, name: "الحي الثاني", price: 30.00, description: "منطقة تجارية", deliveryTime: 35, active: true, createdAt: new Date() },
    { id: 3, name: "الحي الثالث", price: 20.00, description: "منطقة سكنية", deliveryTime: 25, active: true, createdAt: new Date() },
    { id: 4, name: "الحي الرابع", price: 28.00, description: "منطقة سكنية", deliveryTime: 30, active: true, createdAt: new Date() },
    { id: 5, name: "الحي الخامس", price: 32.00, description: "منطقة راقية", deliveryTime: 40, active: true, createdAt: new Date() },
    { id: 6, name: "الحي السادس", price: 22.00, description: "منطقة سكنية", deliveryTime: 28, active: true, createdAt: new Date() },
    { id: 7, name: "الحي السابع", price: 26.00, description: "منطقة سكنية", deliveryTime: 32, active: true, createdAt: new Date() },
    { id: 8, name: "الحي الثامن", price: 24.00, description: "منطقة سكنية", deliveryTime: 30, active: true, createdAt: new Date() },
    { id: 9, name: "الحي التاسع", price: 27.00, description: "منطقة سكنية", deliveryTime: 33, active: true, createdAt: new Date() },
    { id: 10, name: "المنطقة الترفيهية", price: 35.00, description: "منطقة ترفيهية", deliveryTime: 45, active: true, createdAt: new Date() },
    { id: 11, name: "إسكان الشباب", price: 18.00, description: "منطقة سكنية", deliveryTime: 25, active: true, createdAt: new Date() },
    { id: 12, name: "نزهة العبور", price: 30.00, description: "منطقة سكنية راقية", deliveryTime: 35, active: true, createdAt: new Date() },
    { id: 13, name: "جنة العبور", price: 28.00, description: "منطقة سكنية", deliveryTime: 32, active: true, createdAt: new Date() },
    { id: 14, name: "جمعية أحمد عرابي", price: 22.00, description: "منطقة سكنية", deliveryTime: 28, active: true, createdAt: new Date() },
    { id: 15, name: "الجولف سيتي", price: 40.00, description: "منطقة راقية جداً", deliveryTime: 50, active: true, createdAt: new Date() },
    { id: 16, name: "المنطقة الصناعية", price: 35.00, description: "منطقة صناعية", deliveryTime: 45, active: true, createdAt: new Date() },
    { id: 17, name: "العبور الجديدة", price: 25.00, description: "منطقة سكنية حديثة", deliveryTime: 30, active: true, createdAt: new Date() }
];

// Pagination
let currentDeliveryPage = 1;
let deliveryItemsPerPage = 9;
let currentAreaToDelete = null;

// Initialize Delivery Prices Management
function initializeDeliveryPrices() {
    loadDeliveryAreas();
    updateDeliveryStats();
    setupDeliveryEventListeners();
}

// Setup Event Listeners
function setupDeliveryEventListeners() {
    const bulkInput = document.getElementById('bulkDeliveryInput');
    if (bulkInput) {
        bulkInput.addEventListener('input', updateBulkDeliveryCounter);
    }
}

// Load and Display Delivery Areas
function loadDeliveryAreas() {
    const container = document.getElementById('deliveryAreasGrid');
    if (!container) return;
    
    const filteredAreas = getFilteredDeliveryAreas();
    const paginatedAreas = getPaginatedDeliveryAreas(filteredAreas);
    
    if (paginatedAreas.length === 0) {
        container.innerHTML = `
            <div class="empty-delivery-state" style="grid-column: 1/-1;">
                <i class="fas fa-map-marked-alt"></i>
                <h3>لا توجد مناطق توصيل</h3>
                <p>ابدأ بإضافة مناطق التوصيل وأسعارها</p>
                <button class="btn-primary" onclick="openAddAreaModal()">
                    <i class="fas fa-plus"></i>
                    إضافة منطقة جديدة
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = paginatedAreas.map(area => createAreaCard(area)).join('');
    updateDeliveryPagination(filteredAreas.length);
}

// Create Area Card
function createAreaCard(area) {
    return `
        <div class="area-card ${area.active ? '' : 'inactive'}">
            <div class="area-card-header">
                <h3 class="area-name">${area.name}</h3>
                <span class="area-status ${area.active ? 'active' : 'inactive'}">
                    ${area.active ? 'نشط' : 'معطل'}
                </span>
            </div>
            
            <div class="area-price-section">
                <div class="area-price-label">سعر التوصيل</div>
                <div class="area-price-value">
                    <input type="number" 
                        class="area-price-input" 
                        value="${area.price}" 
                        step="0.01"
                        onchange="updateAreaPrice(${area.id}, this.value)"
                        onclick="this.select()">
                    <span class="currency">ج.م</span>
                </div>
            </div>
            
            <div class="area-info">
                ${area.deliveryTime ? `
                    <div class="info-row">
                        <i class="fas fa-clock"></i>
                        <span>وقت التوصيل: ${area.deliveryTime} دقيقة</span>
                    </div>
                ` : ''}
                <div class="info-row">
                    <i class="fas fa-calendar"></i>
                    <span>تاريخ الإضافة: ${formatDate(area.createdAt)}</span>
                </div>
            </div>
            
            ${area.description ? `
                <div class="area-description">
                    <i class="fas fa-info-circle"></i>
                    ${area.description}
                </div>
            ` : ''}
            
            <div class="area-actions">
                <button class="area-action-btn edit" onclick="editArea(${area.id})">
                    <i class="fas fa-edit"></i>
                    تعديل
                </button>
                <div class="status-toggle-container">
                    <label class="toggle-switch">
                        <input type="checkbox" ${area.active ? 'checked' : ''} 
                               onchange="toggleAreaStatus(${area.id})">
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="status-text">${area.active ? 'نشط' : 'غير نشط'}</span>
                </div>
                <button class="area-action-btn delete" onclick="openDeleteAreaModal(${area.id})">
                    <i class="fas fa-trash"></i>
                    حذف
                </button>
            </div>
        </div>
    `;
}

// Filter Delivery Areas
function getFilteredDeliveryAreas() {
    const searchTerm = document.getElementById('areaSearch')?.value.toLowerCase() || '';
    const sortBy = document.getElementById('sortBy')?.value || 'name';
    
    let filtered = deliveryAreas.filter(area => 
        area.name.toLowerCase().includes(searchTerm)
    );
    
    // Sort
    switch(sortBy) {
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
            break;
        case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'date':
            filtered.sort((a, b) => b.createdAt - a.createdAt);
            break;
    }
    
    return filtered;
}

// Pagination
function getPaginatedDeliveryAreas(areas) {
    const startIndex = (currentDeliveryPage - 1) * deliveryItemsPerPage;
    const endIndex = startIndex + deliveryItemsPerPage;
    return areas.slice(startIndex, endIndex);
}

function updateDeliveryPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / deliveryItemsPerPage);
    const pageInfo = document.getElementById('deliveryPageInfo');
    const prevBtn = document.getElementById('prevDeliveryBtn');
    const nextBtn = document.getElementById('nextDeliveryBtn');
    
    if (pageInfo) pageInfo.textContent = `صفحة ${currentDeliveryPage} من ${totalPages}`;
    if (prevBtn) prevBtn.disabled = currentDeliveryPage === 1;
    if (nextBtn) nextBtn.disabled = currentDeliveryPage === totalPages || totalPages === 0;
}

function previousDeliveryPage() {
    if (currentDeliveryPage > 1) {
        currentDeliveryPage--;
        loadDeliveryAreas();
    }
}

function nextDeliveryPage() {
    const totalPages = Math.ceil(getFilteredDeliveryAreas().length / deliveryItemsPerPage);
    if (currentDeliveryPage < totalPages) {
        currentDeliveryPage++;
        loadDeliveryAreas();
    }
}

// Filter and Sort
function filterAreas() {
    currentDeliveryPage = 1;
    loadDeliveryAreas();
}

function sortAreas() {
    loadDeliveryAreas();
}

// Update Statistics
function updateDeliveryStats() {
    const totalAreasEl = document.getElementById('totalAreas');
    const avgPriceEl = document.getElementById('avgPrice');
    
    if (totalAreasEl) {
        totalAreasEl.textContent = deliveryAreas.length;
    }
    
    if (avgPriceEl && deliveryAreas.length > 0) {
        const avgPrice = deliveryAreas.reduce((sum, area) => sum + area.price, 0) / deliveryAreas.length;
        avgPriceEl.textContent = avgPrice.toFixed(2);
    }
}

// Update Area Price
function updateAreaPrice(areaId, newPrice) {
    const area = deliveryAreas.find(a => a.id === areaId);
    if (area) {
        area.price = parseFloat(newPrice);
        showSuccessMessage('تم تحديث السعر بنجاح');
        updateDeliveryStats();
        // Save to localStorage or database
        saveDeliveryAreas();
    }
}

// Toggle Area Status
function toggleAreaStatus(areaId) {
    const area = deliveryAreas.find(a => a.id === areaId);
    if (area) {
        area.active = !area.active;
        loadDeliveryAreas();
        showSuccessMessage(`تم ${area.active ? 'تنشيط' : 'تعطيل'} المنطقة بنجاح`);
        saveDeliveryAreas();
    }
}

// Modal Functions
function openAddAreaModal() {
    document.getElementById('areaModalTitle').textContent = 'إضافة منطقة جديدة';
    document.getElementById('areaForm').reset();
    document.getElementById('areaActive').checked = true;
    document.getElementById('areaModal').classList.add('active');
    delete document.getElementById('areaForm').dataset.editId;
}

function closeAreaModal() {
    document.getElementById('areaModal').classList.remove('active');
}

function editArea(areaId) {
    const area = deliveryAreas.find(a => a.id === areaId);
    if (!area) return;
    
    document.getElementById('areaModalTitle').textContent = 'تعديل المنطقة';
    document.getElementById('areaName').value = area.name;
    document.getElementById('areaPrice').value = area.price;
    document.getElementById('areaDescription').value = area.description || '';
    document.getElementById('deliveryTime').value = area.deliveryTime || '';
    document.getElementById('areaActive').checked = area.active;
    
    document.getElementById('areaForm').dataset.editId = areaId;
    document.getElementById('areaModal').classList.add('active');
}

function handleAreaSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('areaName').value,
        price: parseFloat(document.getElementById('areaPrice').value),
        description: document.getElementById('areaDescription').value,
        deliveryTime: parseInt(document.getElementById('deliveryTime').value) || null,
        active: document.getElementById('areaActive').checked
    };
    
    const editId = document.getElementById('areaForm').dataset.editId;
    
    if (editId) {
        // Update existing area
        const area = deliveryAreas.find(a => a.id === parseInt(editId));
        if (area) {
            Object.assign(area, formData);
            showSuccessMessage('تم تحديث المنطقة بنجاح');
        }
    } else {
        // Add new area
        const newArea = {
            id: deliveryAreas.length > 0 ? Math.max(...deliveryAreas.map(a => a.id)) + 1 : 1,
            ...formData,
            createdAt: new Date()
        };
        deliveryAreas.push(newArea);
        showSuccessMessage('تم إضافة المنطقة بنجاح');
    }
    
    closeAreaModal();
    loadDeliveryAreas();
    updateDeliveryStats();
    saveDeliveryAreas();
}

// Delete Area
function openDeleteAreaModal(areaId) {
    currentAreaToDelete = areaId;
    document.getElementById('deleteAreaModal').classList.add('active');
}

function closeDeleteAreaModal() {
    currentAreaToDelete = null;
    document.getElementById('deleteAreaModal').classList.remove('active');
}

function confirmDeleteArea() {
    if (currentAreaToDelete) {
        deliveryAreas = deliveryAreas.filter(a => a.id !== currentAreaToDelete);
        closeDeleteAreaModal();
        loadDeliveryAreas();
        updateDeliveryStats();
        showSuccessMessage('تم حذف المنطقة بنجاح');
        saveDeliveryAreas();
    }
}

// Bulk Update
function openBulkDeliveryModal() {
    document.getElementById('bulkDeliveryModal').classList.add('active');
}

function closeBulkDeliveryModal() {
    document.getElementById('bulkDeliveryModal').classList.remove('active');
}

function updateBulkDeliveryCounter() {
    const input = document.getElementById('bulkDeliveryInput');
    const counter = document.getElementById('bulkDeliveryCount');
    if (input && counter) {
        const lines = input.value.trim().split('\n').filter(l => l.trim());
        counter.textContent = lines.length;
    }
}

function applyBulkDeliveryUpdate() {
    const input = document.getElementById('bulkDeliveryInput').value;
    const lines = input.trim().split('\n').filter(l => l.trim());
    
    let updatedCount = 0;
    lines.forEach(line => {
        const [name, price] = line.split(',').map(s => s.trim());
        const area = deliveryAreas.find(a => a.name === name);
        if (area && price) {
            area.price = parseFloat(price);
            updatedCount++;
        }
    });
    
    closeBulkDeliveryModal();
    loadDeliveryAreas();
    updateDeliveryStats();
    showSuccessMessage(`تم تحديث ${updatedCount} منطقة بنجاح`);
    saveDeliveryAreas();
}

// Import/Export
function openImportDeliveryModal() {
    document.getElementById('importDeliveryModal').classList.add('active');
}

function closeImportDeliveryModal() {
    document.getElementById('importDeliveryModal').classList.remove('active');
}

function downloadDeliveryTemplate() {
    const template = [
        ['اسم المنطقة', 'السعر', 'الوصف', 'وقت التوصيل', 'الحالة'],
        ['الحي الأول', '25.00', 'منطقة سكنية', '30', 'نشط'],
        ['الحي الثاني', '30.00', 'منطقة تجارية', '35', 'نشط']
    ];
    
    const csv = template.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'delivery_areas_template.csv';
    link.click();
}

function handleDeliveryExcelUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Simulate import (in real app, use SheetJS library)
    showSuccessMessage('جاري استيراد البيانات...');
    setTimeout(() => {
        closeImportDeliveryModal();
        showSuccessMessage('تم استيراد المناطق بنجاح');
        loadDeliveryAreas();
    }, 1500);
}

function exportDeliveryPrices() {
    const headers = ['اسم المنطقة', 'السعر', 'الوصف', 'وقت التوصيل', 'الحالة'];
    const rows = deliveryAreas.map(a => [
        a.name,
        a.price,
        a.description || '',
        a.deliveryTime || '',
        a.active ? 'نشط' : 'معطل'
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `delivery_prices_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    showSuccessMessage('تم تصدير أسعار التوصيل بنجاح');
}

// Helper Functions
function formatDate(date) {
    if (!(date instanceof Date)) date = new Date(date);
    return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
}

function showSuccessMessage(message) {
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageEl = document.createElement('div');
    messageEl.className = 'success-message';
    messageEl.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        messageEl.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => messageEl.remove(), 300);
    }, 3000);
}

// Save to localStorage
function saveDeliveryAreas() {
    try {
        localStorage.setItem('deliveryAreas', JSON.stringify(deliveryAreas));
    } catch (e) {
        console.error('Error saving delivery areas:', e);
    }
}

// Load from localStorage
function loadDeliveryAreasFromStorage() {
    try {
        const saved = localStorage.getItem('deliveryAreas');
        if (saved) {
            deliveryAreas = JSON.parse(saved).map(area => ({
                ...area,
                createdAt: new Date(area.createdAt)
            }));
        }
    } catch (e) {
        console.error('Error loading delivery areas:', e);
    }
}

// Get delivery areas for dropdown (for customer address management)
function getActiveDeliveryAreas() {
    return deliveryAreas.filter(area => area.active).sort((a, b) => a.name.localeCompare(b.name, 'ar'));
}

// Get delivery price by area name
function getDeliveryPrice(areaName) {
    const area = deliveryAreas.find(a => a.name === areaName && a.active);
    return area ? area.price : 0;
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadDeliveryAreasFromStorage();
        initializeDeliveryPrices();
    });
} else {
    loadDeliveryAreasFromStorage();
    initializeDeliveryPrices();
}

// Export functions for use in other modules
window.getActiveDeliveryAreas = getActiveDeliveryAreas;
window.getDeliveryPrice = getDeliveryPrice;