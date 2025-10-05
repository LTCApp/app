// Products Management JavaScript

// Sample Products Data (will be replaced with actual database)
let productsData = [
    {
        id: 1,
        name: "مانجو عويس وزن",
        barcode: "0055",
        price: 25.50,
        unit: "كيلو",
        category: "فواكه",
        brand: "ذات نواة",
        description: "مانجو طازج عالي الجودة",
        image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400",
        active: true
    },
    {
        id: 2,
        name: "مانجو عويس",
        barcode: "0079",
        price: 30.00,
        unit: "كيلو",
        category: "فواكه",
        brand: "ذات نواة",
        description: "مانجو عويس ممتاز",
        image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400",
        active: true,
        soldByWeight: true
    },
    {
        id: 3,
        name: "مانجو مصري عويس",
        barcode: "0082",
        price: 35.75,
        unit: "كيلو",
        category: "فواكه",
        brand: "ذات نواة",
        description: "مانجو مصري أصلي",
        image: "https://images.unsplash.com/photo-1605027990121-cbae9d3ce6bb?w=400",
        active: true,
        soldByWeight: true
    }
];

// Pagination
let currentPage = 1;
let itemsPerPage = 12;
let currentView = 'list';
let selectedProducts = new Set();

// Initialize Products Management
function initializeProductsManagement() {
    // Set default view to grid and make view button active
    setDefaultView();
    loadProducts();
    setupEventListeners();
    updateBarcodeCounter();
    updatePriceCounter();
}

// Set Default View
function setDefaultView() {
    // Remove active class from all view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to list view button (default)
    const listViewBtn = document.querySelector('.view-btn[data-view="list"]');
    if (listViewBtn) {
        listViewBtn.classList.add('active');
    }
    
    // Ensure currentView variable is set correctly
    currentView = 'list';
}

// Setup Event Listeners
function setupEventListeners() {
    // Barcode counter
    const barcodesInput = document.getElementById('barcodesInput');
    if (barcodesInput) {
        barcodesInput.addEventListener('input', updateBarcodeCounter);
    }
    
    // Price counter
    const pricesInput = document.getElementById('pricesInput');
    if (pricesInput) {
        pricesInput.addEventListener('input', updatePriceCounter);
    }
    
    // Product form submit
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }
    
    // Drag and drop for Excel upload
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleDrop);
    }
}

// Load and Display Products
function loadProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    const filteredProducts = getFilteredProducts();
    const paginatedProducts = getPaginatedProducts(filteredProducts);
    
    if (paginatedProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-box-open"></i>
                <h3>لا توجد منتجات</h3>
                <p>ابدأ بإضافة منتجات جديدة أو قم بتعديل الفلاتر</p>
                <button class="btn-primary" onclick="openAddProductModal()">
                    <i class="fas fa-plus"></i>
                    إضافة منتج جديد
                </button>
            </div>
        `;
        return;
    }
    
    if (currentView === 'grid') {
        container.className = 'products-grid';
        container.innerHTML = paginatedProducts.map(product => createProductCard(product)).join('');
    } else {
        container.className = 'products-list';
        container.innerHTML = paginatedProducts.map(product => createProductListItem(product)).join('');
    }
    
    updatePagination(filteredProducts.length);
    updateBulkActionButtons();
}

// Create Product Card (Grid View)
function createProductCard(product) {
    return `
        <div class="product-card ${product.active ? '' : 'inactive'}" data-product-id="${product.id}">
            <div class="product-card-header">
                <input type="checkbox" class="product-checkbox" 
                    ${selectedProducts.has(product.id) ? 'checked' : ''}
                    onchange="toggleProductSelection(${product.id})">
                <span class="product-status-badge ${product.active ? 'active' : 'inactive'}">
                    ${product.active ? 'نشط' : 'غير نشط'}
                </span>
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
            </div>
            <div class="product-card-body">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-barcode">
                    <i class="fas fa-barcode"></i> ${product.barcode}
                </p>
                <span class="product-category">${product.category}</span>
                <div class="product-price-section">
                    <div class="product-price-edit">
                        <input type="number" class="product-price-input" 
                            value="${product.price}" 
                            step="0.01"
                            onchange="updateProductPrice(${product.id}, this.value)"
                            onclick="this.select()">
                        <span style="font-size: 14px; color: #6c757d;">ج.م</span>
                    </div>
                    <span style="font-size: 13px; color: #6c757d;">/${product.unit}</span>
                </div>
                <div class="product-actions">
                    <button class="action-btn edit" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                        تعديل
                    </button>
                    <div class="status-toggle-container">
                        <label class="toggle-switch">
                            <input type="checkbox" ${product.active ? 'checked' : ''} 
                                   onchange="toggleProductStatus(${product.id})">
                            <span class="toggle-slider"></span>
                        </label>
                        <span class="status-text">${product.active ? 'نشط' : 'غير نشط'}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Create Product List Item (List View)
function createProductListItem(product) {
    return `
        <div class="product-list-item ${product.active ? '' : 'inactive'}" data-product-id="${product.id}">
            <input type="checkbox" class="product-checkbox" 
                ${selectedProducts.has(product.id) ? 'checked' : ''}
                onchange="toggleProductSelection(${product.id})">
            <div class="product-list-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/80?text=No+Image'">
            </div>
            <div class="product-list-info">
                <div class="product-list-details">
                    <h4>${product.name}</h4>
                    <p><i class="fas fa-barcode"></i> ${product.barcode} | ${product.category}</p>
                </div>
                <div class="product-price-edit">
                    <input type="number" class="product-price-input" 
                        value="${product.price}" 
                        step="0.01"
                        onchange="updateProductPrice(${product.id}, this.value)"
                        onclick="this.select()">
                    <span style="font-size: 14px; color: #6c757d;">ج.م/${product.unit}</span>
                </div>
                <span class="product-status-badge ${product.active ? 'active' : 'inactive'}">
                    ${product.active ? 'نشط' : 'غير نشط'}
                </span>
                <div class="product-list-actions">
                    <button class="action-btn edit" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <div class="status-toggle-container">
                        <label class="toggle-switch">
                            <input type="checkbox" ${product.active ? 'checked' : ''} 
                                   onchange="toggleProductStatus(${product.id})">
                            <span class="toggle-slider"></span>
                        </label>
                        <span class="status-text">${product.active ? 'نشط' : 'غير نشط'}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Filter Products
function getFilteredProducts() {
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const brandFilter = document.getElementById('brandFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || 'active';
    const searchInput = document.getElementById('searchInput')?.value.toLowerCase() || '';
    
    return productsData.filter(product => {
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        const matchesBrand = !brandFilter || product.brand === brandFilter;
        const matchesStatus = statusFilter === 'all' || 
            (statusFilter === 'active' && product.active) || 
            (statusFilter === 'inactive' && !product.active);
        const matchesSearch = !searchInput || 
            product.name.toLowerCase().includes(searchInput) || 
            product.barcode.includes(searchInput);
        
        return matchesCategory && matchesBrand && matchesStatus && matchesSearch;
    });
}

// Pagination
function getPaginatedProducts(products) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
}

function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (pageInfo) pageInfo.textContent = `صفحة ${currentPage} من ${totalPages}`;
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        loadProducts();
    }
}

function nextPage() {
    const totalPages = Math.ceil(getFilteredProducts().length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        loadProducts();
    }
}

// Filter Products
function filterProducts() {
    currentPage = 1;
    loadProducts();
}

// Change View
function changeView(view) {
    currentView = view;
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    loadProducts();
}

// Product Selection
function toggleProductSelection(productId) {
    if (selectedProducts.has(productId)) {
        selectedProducts.delete(productId);
    } else {
        selectedProducts.add(productId);
    }
    updateBulkActionButtons();
    updateSelectAllCheckbox();
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const filteredProducts = getFilteredProducts();
    
    if (selectAll.checked) {
        filteredProducts.forEach(product => selectedProducts.add(product.id));
    } else {
        selectedProducts.clear();
    }
    
    loadProducts();
}

function updateSelectAllCheckbox() {
    const selectAll = document.getElementById('selectAll');
    const filteredProducts = getFilteredProducts();
    const allSelected = filteredProducts.length > 0 && 
        filteredProducts.every(product => selectedProducts.has(product.id));
    
    if (selectAll) {
        selectAll.checked = allSelected;
    }
}

function updateBulkActionButtons() {
    const activateBtn = document.getElementById('bulkActivateBtn');
    const deactivateBtn = document.getElementById('bulkDeactivateBtn');
    
    if (selectedProducts.size > 0) {
        if (activateBtn) activateBtn.style.display = 'inline-flex';
        if (deactivateBtn) deactivateBtn.style.display = 'inline-flex';
    } else {
        if (activateBtn) activateBtn.style.display = 'none';
        if (deactivateBtn) deactivateBtn.style.display = 'none';
    }
}

// Update Product Price
function updateProductPrice(productId, newPrice) {
    const product = productsData.find(p => p.id === productId);
    if (product) {
        product.price = parseFloat(newPrice);
        showMessage('success', 'تم تحديث السعر بنجاح');
        // Here you would save to database
    }
}

// Toggle Product Status
function toggleProductStatus(productId) {
    const product = productsData.find(p => p.id === productId);
    if (product) {
        product.active = !product.active;
        loadProducts();
        showMessage('success', `تم ${product.active ? 'تنشيط' : 'إلغاء تنشيط'} المنتج بنجاح`);
        // Here you would save to database
    }
}

// Bulk Actions
function bulkActivate() {
    selectedProducts.forEach(productId => {
        const product = productsData.find(p => p.id === productId);
        if (product) product.active = true;
    });
    selectedProducts.clear();
    loadProducts();
    showMessage('success', 'تم تنشيط المنتجات المحددة بنجاح');
}

function bulkDeactivate() {
    selectedProducts.forEach(productId => {
        const product = productsData.find(p => p.id === productId);
        if (product) product.active = false;
    });
    selectedProducts.clear();
    loadProducts();
    showMessage('success', 'تم إلغاء تنشيط المنتجات المحددة بنجاح');
}

// Modal Functions
function openAddProductModal() {
    document.getElementById('modalTitle').textContent = 'إضافة منتج جديد';
    document.getElementById('productForm').reset();
    document.getElementById('previewImg').style.display = 'none';
    document.querySelector('.remove-image').style.display = 'none';
    document.getElementById('productModal').classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

function editProduct(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('modalTitle').textContent = 'تعديل المنتج';
    document.getElementById('productName').value = product.name;
    document.getElementById('productBarcode').value = product.barcode;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productUnit').value = product.unit;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productBrand').value = product.brand || '';
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productActive').checked = product.active;
    
    if (product.image) {
        const previewImg = document.getElementById('previewImg');
        previewImg.src = product.image;
        previewImg.style.display = 'block';
        document.querySelector('.remove-image').style.display = 'block';
    }
    
    document.getElementById('productModal').classList.add('active');
    document.getElementById('productForm').dataset.editId = productId;
}

function handleProductSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('productName').value,
        barcode: document.getElementById('productBarcode').value,
        price: parseFloat(document.getElementById('productPrice').value),
        unit: document.getElementById('productUnit').value,
        category: document.getElementById('productCategory').value,
        brand: document.getElementById('productBrand').value,
        description: document.getElementById('productDescription').value,
        active: document.getElementById('productActive').checked,
        image: document.getElementById('previewImg').src || 'https://via.placeholder.com/400x300?text=No+Image'
    };
    
    const editId = document.getElementById('productForm').dataset.editId;
    
    if (editId) {
        // Update existing product
        const product = productsData.find(p => p.id === parseInt(editId));
        if (product) {
            Object.assign(product, formData);
            showMessage('success', 'تم تحديث المنتج بنجاح');
        }
        delete document.getElementById('productForm').dataset.editId;
    } else {
        // Add new product
        const newProduct = {
            id: productsData.length > 0 ? Math.max(...productsData.map(p => p.id)) + 1 : 1,
            ...formData
        };
        productsData.push(newProduct);
        showMessage('success', 'تم إضافة المنتج بنجاح');
    }
    
    closeProductModal();
    loadProducts();
}

// Image Upload Functions
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewImg = document.getElementById('previewImg');
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
            document.querySelector('.remove-image').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function loadImageFromUrl() {
    const url = document.getElementById('imageUrl').value;
    if (url) {
        const previewImg = document.getElementById('previewImg');
        previewImg.src = url;
        previewImg.style.display = 'block';
        document.querySelector('.remove-image').style.display = 'block';
    }
}

function removeImage() {
    document.getElementById('previewImg').style.display = 'none';
    document.querySelector('.remove-image').style.display = 'none';
    document.getElementById('imageUrl').value = '';
    document.getElementById('imageUpload').value = '';
}

// AI Image Search
function openAIImageSearch() {
    document.getElementById('aiImageModal').classList.add('active');
}

function closeAIImageModal() {
    document.getElementById('aiImageModal').classList.remove('active');
}

async function searchAIImages() {
    const query = document.getElementById('aiSearchQuery').value;
    if (!query) {
        showMessage('error', 'الرجاء إدخال وصف للبحث');
        return;
    }
    
    const resultsContainer = document.getElementById('aiImagesResults');
    resultsContainer.innerHTML = '<div style="text-align:center; padding:40px;"><i class="fas fa-spinner fa-spin" style="font-size:48px; color:#667eea;"></i><p style="margin-top:20px;">جاري البحث...</p></div>';
    
    try {
        // TODO: Integrate with actual AI image service
        // Example: OpenAI DALL-E, Stable Diffusion, or similar service
        
        // For now, show a message that this feature needs to be configured
        resultsContainer.innerHTML = `
            <div style="text-align:center; padding:40px; color:#666;">
                <i class="fas fa-info-circle" style="font-size:48px;"></i>
                <p style="margin-top:20px;">يجب تكوين خدمة البحث بالذكاء الاصطناعي</p>
                <small>قم بتكوين API key للخدمة المطلوبة</small>
            </div>
        `;
        
    } catch (error) {
        resultsContainer.innerHTML = '<div style="text-align:center; padding:40px; color:#eb3349;"><i class="fas fa-exclamation-circle" style="font-size:48px;"></i><p style="margin-top:20px;">حدث خطأ في البحث</p></div>';
    }
}

function selectAIImage(imageUrl) {
    const previewImg = document.getElementById('previewImg');
    previewImg.src = imageUrl;
    previewImg.style.display = 'block';
    document.querySelector('.remove-image').style.display = 'block';
    closeAIImageModal();
    showMessage('success', 'تم اختيار الصورة بنجاح');
}

// Bulk Actions Modal
function openBulkActionsModal() {
    document.getElementById('bulkActionsModal').classList.add('active');
}

function closeBulkActionsModal() {
    document.getElementById('bulkActionsModal').classList.remove('active');
}

function switchBulkTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.bulk-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    event.target.classList.add('active');
    document.getElementById(tab + 'Tab').classList.add('active');
}

function updateBarcodeCounter() {
    const input = document.getElementById('barcodesInput');
    const counter = document.getElementById('barcodeCount');
    if (input && counter) {
        const barcodes = input.value.trim().split('\n').filter(b => b.trim());
        counter.textContent = barcodes.length;
    }
}

function updatePriceCounter() {
    const input = document.getElementById('pricesInput');
    const counter = document.getElementById('priceCount');
    if (input && counter) {
        const lines = input.value.trim().split('\n').filter(l => l.trim());
        counter.textContent = lines.length;
    }
}

function bulkActivateBarcodes() {
    const input = document.getElementById('barcodesInput').value;
    const barcodes = input.trim().split('\n').filter(b => b.trim());
    
    let count = 0;
    barcodes.forEach(barcode => {
        const product = productsData.find(p => p.barcode === barcode.trim());
        if (product) {
            product.active = true;
            count++;
        }
    });
    
    closeBulkActionsModal();
    loadProducts();
    showMessage('success', `تم تنشيط ${count} منتج بنجاح`);
}

function bulkDeactivateBarcodes() {
    const input = document.getElementById('barcodesInput').value;
    const barcodes = input.trim().split('\n').filter(b => b.trim());
    
    let count = 0;
    barcodes.forEach(barcode => {
        const product = productsData.find(p => p.barcode === barcode.trim());
        if (product) {
            product.active = false;
            count++;
        }
    });
    
    closeBulkActionsModal();
    loadProducts();
    showMessage('success', `تم إلغاء تنشيط ${count} منتج بنجاح`);
}

function bulkUpdatePrices() {
    const input = document.getElementById('pricesInput').value;
    const lines = input.trim().split('\n').filter(l => l.trim());
    
    let count = 0;
    lines.forEach(line => {
        const [barcode, price] = line.split(',').map(s => s.trim());
        const product = productsData.find(p => p.barcode === barcode);
        if (product && price) {
            product.price = parseFloat(price);
            count++;
        }
    });
    
    closeBulkActionsModal();
    loadProducts();
    showMessage('success', `تم تحديث أسعار ${count} منتج بنجاح`);
}

// Import/Export Functions
function openImportModal() {
    document.getElementById('importModal').classList.add('active');
}

function closeImportModal() {
    document.getElementById('importModal').classList.remove('active');
}

function downloadTemplate() {
    const template = [
        ['الاسم', 'الباركود', 'السعر', 'الصنف', 'العلامة التجارية', 'الوحدة', 'الوصف', 'الحالة', 'رابط الصورة'],
        ['مانجو عويس', '0055', '25.50', 'فواكه', 'ذات نواة', 'كيلو', 'مانجو طازج', 'نشط', 'https://example.com/image.jpg'],
        ['تفاح أحمر', '0056', '15.00', 'فواكه', 'محلي', 'كيلو', 'تفاح طازج', 'نشط', '']
    ];
    
    const csv = template.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'products_template.csv';
    link.click();
}

function handleExcelUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            // Here you would use a library like SheetJS (xlsx) to parse the Excel file
            // For demo, we'll simulate the import
            simulateImport();
        } catch (error) {
            showMessage('error', 'حدث خطأ في قراءة الملف');
        }
    };
    reader.readAsBinaryString(file);
}

function simulateImport() {
    const progressContainer = document.getElementById('importProgress');
    const progressFill = document.getElementById('importProgressFill');
    const statusText = document.getElementById('importStatus');
    
    progressContainer.style.display = 'block';
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressFill.style.width = progress + '%';
        progressFill.textContent = progress + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            statusText.textContent = 'تم الاستيراد بنجاح!';
            setTimeout(() => {
                closeImportModal();
                progressContainer.style.display = 'none';
                progressFill.style.width = '0%';
                showMessage('success', 'تم استيراد المنتجات بنجاح');
                loadProducts();
            }, 1500);
        }
    }, 200);
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#667eea';
    e.currentTarget.style.background = '#f0f4ff';
}

function handleDragLeave(e) {
    e.currentTarget.style.borderColor = '#dee2e6';
    e.currentTarget.style.background = '#f8f9fa';
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#dee2e6';
    e.currentTarget.style.background = '#f8f9fa';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        document.getElementById('excelUpload').files = files;
        handleExcelUpload({ target: { files: files } });
    }
}

function exportProducts() {
    const filteredProducts = getFilteredProducts();
    
    const headers = ['الاسم', 'الباركود', 'السعر', 'الصنف', 'العلامة التجارية', 'الوحدة', 'الوصف', 'الحالة'];
    const rows = filteredProducts.map(p => [
        p.name,
        p.barcode,
        p.price,
        p.category,
        p.brand || '',
        p.unit,
        p.description || '',
        p.active ? 'نشط' : 'غير نشط'
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `products_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    showMessage('success', 'تم تصدير المنتجات بنجاح');
}

// Show Message
function showMessage(type, text) {
    const container = document.querySelector('.products-header');
    if (!container) return;
    
    const existingMessage = container.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${text}</span>
    `;
    
    container.insertBefore(message, container.firstChild);
    
    setTimeout(() => {
        message.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
};

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProductsManagement);
} else {
    initializeProductsManagement();
}