/**
 * مدير البيانات لنظام تجهيز الأوردرات
 * يحتوي على بيانات نموذجية وقوالب للاختبار
 */

class OrderDataManager {
    constructor() {
        this.productCatalog = this.initializeProductCatalog();
        this.customerDatabase = this.initializeCustomerDatabase();
        this.orderTemplates = this.initializeOrderTemplates();
    }

    /**
     * كتالوج المنتجات
     */
    initializeProductCatalog() {
        return {
            dairy: {
                name: 'منتجات الألبان',
                items: [
                    { id: 'D001', name: 'حليب كامل الدسم', price: 12.00, unit: 'ليتر', brand: 'جهينة' },
                    { id: 'D002', name: 'حليب قليل الدسم', price: 11.50, unit: 'ليتر', brand: 'جهينة' },
                    { id: 'D003', name: 'زبادي طبيعي', price: 8.50, unit: 'علبة 500جم', brand: 'دانون' },
                    { id: 'D004', name: 'جبن أبيض', price: 25.00, unit: 'قطعة 250جم', brand: 'المراعي' },
                    { id: 'D005', name: 'جبن شيدر', price: 35.00, unit: 'قطعة 200جم', brand: 'المراعي' },
                    { id: 'D006', name: 'زبدة طبيعية', price: 18.50, unit: 'علبة 250جم', brand: 'لورباك' },
                    { id: 'D007', name: 'كريمة طبخ', price: 14.00, unit: 'علبة 200مل', brand: 'إيل' }
                ]
            },
            grains: {
                name: 'الحبوب والأرز',
                items: [
                    { id: 'G001', name: 'أرز بسمتي', price: 45.00, unit: 'كيس 5 كيلو', brand: 'أبو كاس' },
                    { id: 'G002', name: 'أرز مصري', price: 25.00, unit: 'كيس 3 كيلو', brand: 'هرم' },
                    { id: 'G003', name: 'مكرونة اسباجيتي', price: 8.50, unit: 'علبة 500جم', brand: 'لا مولينا' },
                    { id: 'G004', name: 'مكرونة بيني', price: 9.00, unit: 'علبة 500جم', brand: 'لا مولينا' },
                    { id: 'G005', name: 'شعرية', price: 7.50, unit: 'علبة 400جم', brand: 'أم علي' },
                    { id: 'G006', name: 'برغل خشن', price: 12.00, unit: 'كيس 1 كيلو', brand: 'الصفوة' },
                    { id: 'G007', name: 'عدس أحمر', price: 15.00, unit: 'كيس 1 كيلو', brand: 'البركة' }
                ]
            },
            meat: {
                name: 'اللحوم والدواجن',
                items: [
                    { id: 'M001', name: 'لحم بقري', price: 180.00, unit: 'كيلو', brand: 'طازج' },
                    { id: 'M002', name: 'لحم ضاني', price: 200.00, unit: 'كيلو', brand: 'طازج' },
                    { id: 'M003', name: 'دجاج كامل', price: 35.00, unit: 'كيلو', brand: 'الوطنية' },
                    { id: 'M004', name: 'قطع دجاج', price: 38.00, unit: 'كيلو', brand: 'الوطنية' },
                    { id: 'M005', name: 'لحم مفروم', price: 160.00, unit: 'كيلو', brand: 'طازج' },
                    { id: 'M006', name: 'سمك بلطي', price: 45.00, unit: 'كيلو', brand: 'طازج' },
                    { id: 'M007', name: 'سمك سلمون', price: 120.00, unit: 'كيلو', brand: 'مجمد' }
                ]
            },
            vegetables: {
                name: 'الخضروات والفواكه',
                items: [
                    { id: 'V001', name: 'طماطم', price: 8.50, unit: 'كيلو', brand: 'طازج' },
                    { id: 'V002', name: 'بصل', price: 4.00, unit: 'كيلو', brand: 'طازج' },
                    { id: 'V003', name: 'جزر', price: 6.00, unit: 'كيلو', brand: 'طازج' },
                    { id: 'V004', name: 'بطاطس', price: 7.50, unit: 'كيلو', brand: 'طازج' },
                    { id: 'V005', name: 'خيار', price: 5.50, unit: 'كيلو', brand: 'طازج' },
                    { id: 'V006', name: 'موز', price: 12.00, unit: 'كيلو', brand: 'طازج' },
                    { id: 'V007', name: 'تفاح أحمر', price: 18.00, unit: 'كيلو', brand: 'مستورد' },
                    { id: 'V008', name: 'برتقال', price: 10.00, unit: 'كيلو', brand: 'طازج' }
                ]
            },
            pantry: {
                name: 'البقالة',
                items: [
                    { id: 'P001', name: 'زيت عباد الشمس', price: 35.50, unit: 'زجاجة 1 ليتر', brand: 'كريستال' },
                    { id: 'P002', name: 'زيت زيتون', price: 65.00, unit: 'زجاجة 500مل', brand: 'الجوف' },
                    { id: 'P003', name: 'سكر أبيض', price: 15.25, unit: 'كيس 1 كيلو', brand: 'الدلتا' },
                    { id: 'P004', name: 'ملح طعام', price: 3.50, unit: 'علبة 1 كيلو', brand: 'الملاحة' },
                    { id: 'P005', name: 'شاي أسود', price: 18.00, unit: 'علبة 100 كيس', brand: 'ليبتون' },
                    { id: 'P006', name: 'قهوة تركية', price: 25.00, unit: 'علبة 200جم', brand: 'السيف' },
                    { id: 'P007', name: 'عسل نحل طبيعي', price: 45.00, unit: 'برطمان 500جم', brand: 'الشفاء' },
                    { id: 'P008', name: 'مربى فراولة', price: 12.00, unit: 'برطمان 450جم', brand: 'هيرو' }
                ]
            },
            bakery: {
                name: 'المخبوزات',
                items: [
                    { id: 'B001', name: 'خبز بلدي', price: 2.50, unit: 'رغيف', brand: 'الفرن' },
                    { id: 'B002', name: 'خبز أبيض', price: 3.00, unit: 'رغيف', brand: 'الفرن' },
                    { id: 'B003', name: 'خبز برجر', price: 12.00, unit: 'كيس 6 قطع', brand: 'توست' },
                    { id: 'B004', name: 'كرواسون', price: 8.50, unit: 'قطعة', brand: 'الفرن' },
                    { id: 'B005', name: 'كيك شوكولاتة', price: 25.00, unit: 'قطعة', brand: 'الحلواني' }
                ]
            },
            cleaning: {
                name: 'منظفات ومطهرات',
                items: [
                    { id: 'C001', name: 'صابون غسيل', price: 8.50, unit: 'قطعة 125جم', brand: 'لوكس' },
                    { id: 'C002', name: 'شامبو', price: 15.00, unit: 'زجاجة 400مل', brand: 'هيد آند شولدرز' },
                    { id: 'C003', name: 'معجون أسنان', price: 12.50, unit: 'أنبوبة 75مل', brand: 'كولجيت' },
                    { id: 'C004', name: 'منظف أطباق', price: 9.00, unit: 'زجاجة 500مل', brand: 'فيري' },
                    { id: 'C005', name: 'منظف أرضيات', price: 14.00, unit: 'زجاجة 1 ليتر', brand: 'فلاش' }
                ]
            }
        };
    }

    /**
     * قاعدة بيانات العملاء
     */
    initializeCustomerDatabase() {
        return [
            {
                id: 'C001',
                name: 'أحمد محمد عبدالله',
                phone: '01012345678',
                addresses: [
                    { type: 'home', address: 'شارع التحرير، المنصورة، الدقهلية', isDefault: true },
                    { type: 'work', address: 'شارع الجمهورية، وسط البلد، المنصورة', isDefault: false }
                ],
                orderHistory: 25,
                loyaltyPoints: 1250,
                paymentMethod: 'cash',
                notes: 'عميل مميز - يفضل التوصيل صباحاً'
            },
            {
                id: 'C002',
                name: 'فاطمة علي حسن',
                phone: '01098765432',
                addresses: [
                    { type: 'home', address: 'حي الجامعة، شارع 23 يوليو، المنصورة', isDefault: true }
                ],
                orderHistory: 12,
                loyaltyPoints: 600,
                paymentMethod: 'card',
                notes: 'تفضل المنتجات الطازجة'
            },
            {
                id: 'C003',
                name: 'محمد عبدالله إبراهيم',
                phone: '01155555555',
                addresses: [
                    { type: 'home', address: 'كورنيش النيل، برج السلام، المنصورة', isDefault: true }
                ],
                orderHistory: 8,
                loyaltyPoints: 400,
                paymentMethod: 'cash',
                notes: 'طلبات عاجلة دائماً - يدفع إكرامية'
            },
            {
                id: 'C004',
                name: 'سارة حسن محمود',
                phone: '01177777777',
                addresses: [
                    { type: 'home', address: 'شارع المديرية، بجوار البنك الأهلي، المنصورة', isDefault: true }
                ],
                orderHistory: 18,
                loyaltyPoints: 900,
                paymentMethod: 'card',
                notes: 'عميلة منتظمة - طلبات أسبوعية'
            },
            {
                id: 'C005',
                name: 'خالد أحمد فتحي',
                phone: '01233333333',
                addresses: [
                    { type: 'home', address: 'حي الأندلس، شارع السلام، المنصورة', isDefault: true }
                ],
                orderHistory: 5,
                loyaltyPoints: 250,
                paymentMethod: 'cash',
                notes: 'عميل جديد'
            },
            {
                id: 'C006',
                name: 'نور فتحي عبدالرحمن',
                phone: '01144444444',
                addresses: [
                    { type: 'home', address: 'شارع الثورة، أمام مسجد النور، المنصورة', isDefault: true }
                ],
                orderHistory: 22,
                loyaltyPoints: 1100,
                paymentMethod: 'card',
                notes: 'تطلب منتجات عضوية'
            }
        ];
    }

    /**
     * قوالب الطلبات
     */
    initializeOrderTemplates() {
        return {
            breakfast: {
                name: 'طلب إفطار أساسي',
                items: [
                    { productId: 'D001', quantity: 2 }, // حليب
                    { productId: 'B001', quantity: 5 }, // خبز بلدي
                    { productId: 'D004', quantity: 1 }, // جبن أبيض
                    { productId: 'P007', quantity: 1 }, // عسل
                    { productId: 'P005', quantity: 1 }  // شاي
                ]
            },
            dinner: {
                name: 'طلب عشاء عائلي',
                items: [
                    { productId: 'M001', quantity: 1 }, // لحم بقري
                    { productId: 'G001', quantity: 1 }, // أرز بسمتي
                    { productId: 'V001', quantity: 2 }, // طماطم
                    { productId: 'V002', quantity: 1 }, // بصل
                    { productId: 'V003', quantity: 1 }, // جزر
                    { productId: 'P001', quantity: 1 }  // زيت طبخ
                ]
            },
            weekly: {
                name: 'طلب أسبوعي شامل',
                items: [
                    { productId: 'D001', quantity: 4 }, // حليب
                    { productId: 'D003', quantity: 3 }, // زبادي
                    { productId: 'G001', quantity: 2 }, // أرز
                    { productId: 'M003', quantity: 2 }, // دجاج
                    { productId: 'V001', quantity: 3 }, // طماطم
                    { productId: 'V002', quantity: 2 }, // بصل
                    { productId: 'V004', quantity: 3 }, // بطاطس
                    { productId: 'V006', quantity: 2 }, // موز
                    { productId: 'P001', quantity: 1 }, // زيت
                    { productId: 'P003', quantity: 2 }, // سكر
                    { productId: 'B001', quantity: 10 } // خبز
                ]
            },
            quick: {
                name: 'طلب سريع',
                items: [
                    { productId: 'B001', quantity: 3 }, // خبز
                    { productId: 'D001', quantity: 1 }, // حليب
                    { productId: 'P005', quantity: 1 }  // شاي
                ]
            }
        };
    }

    /**
     * إنشاء طلب عشوائي واقعي
     */
    generateRandomOrder() {
        const customers = this.customerDatabase;
        const customer = customers[Math.floor(Math.random() * customers.length)];
        
        // اختيار نوع الطلب
        const orderTypes = ['delivery', 'pickup'];
        const orderType = orderTypes[Math.floor(Math.random() * orderTypes.length)];
        
        // تحديد الأولوية
        const priorities = ['normal', 'normal', 'normal', 'high', 'urgent']; // normal أكثر احتمالاً
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        
        // اختيار قالب طلب أو إنشاء طلب مخصص
        const useTemplate = Math.random() > 0.3; // 70% احتمال استخدام قالب
        let items = [];
        
        if (useTemplate) {
            const templateNames = Object.keys(this.orderTemplates);
            const templateName = templateNames[Math.floor(Math.random() * templateNames.length)];
            const template = this.orderTemplates[templateName];
            
            items = template.items.map(item => {
                const product = this.getProductById(item.productId);
                return {
                    id: item.productId,
                    name: product.name,
                    quantity: item.quantity,
                    price: product.price,
                    notes: product.unit
                };
            });
        } else {
            // إنشاء طلب مخصص عشوائي
            const categories = Object.keys(this.productCatalog);
            const selectedCategories = categories.filter(() => Math.random() > 0.5);
            
            selectedCategories.forEach(category => {
                const categoryItems = this.productCatalog[category].items;
                const randomProduct = categoryItems[Math.floor(Math.random() * categoryItems.length)];
                const quantity = Math.floor(Math.random() * 3) + 1;
                
                items.push({
                    id: randomProduct.id,
                    name: randomProduct.name,
                    quantity: quantity,
                    price: randomProduct.price,
                    notes: randomProduct.unit
                });
            });
        }
        
        // حساب الإجمالي
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // إنشاء رقم الطلب
        const orderNumber = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
        
        // تحديد الوقت المتوقع للتجهيز
        const estimatedTime = Math.floor(Math.random() * 25) + 10; // 10-35 دقيقة
        
        // تعليمات خاصة عشوائية
        const specialInstructions = this.generateSpecialInstructions(priority, customer);
        
        return {
            id: orderNumber,
            customerName: customer.name,
            customerPhone: customer.phone,
            customerAddress: customer.addresses.find(addr => addr.isDefault)?.address || customer.addresses[0].address,
            orderType: orderType,
            priority: priority,
            status: 'pending',
            timestamp: Date.now(),
            estimatedTime: estimatedTime,
            items: items,
            total: total,
            paymentMethod: customer.paymentMethod,
            specialInstructions: specialInstructions,
            customerNotes: customer.notes,
            loyaltyPoints: customer.loyaltyPoints,
            orderHistory: customer.orderHistory
        };
    }

    /**
     * البحث عن منتج بالرقم التعريفي
     */
    getProductById(productId) {
        for (const category of Object.values(this.productCatalog)) {
            for (const item of category.items) {
                if (item.id === productId) {
                    return item;
                }
            }
        }
        return null;
    }

    /**
     * إنشاء تعليمات خاصة عشوائية
     */
    generateSpecialInstructions(priority, customer) {
        const instructions = [];
        
        if (priority === 'urgent') {
            instructions.push('طلب عاجل - العميل في انتظار');
        }
        
        if (priority === 'high') {
            instructions.push('أولوية عالية');
        }
        
        // تعليمات عشوائية إضافية
        const randomInstructions = [
            'يرجى التأكد من تاريخ الصلاحية',
            'تغليف إضافي للمنتجات الحساسة',
            'فصل منتجات التنظيف عن الطعام',
            'اختيار أفضل قطع اللحم',
            'خضروات وفواكه طازجة فقط',
            'تجنب المنتجات القريبة من انتهاء الصلاحية',
            'تغليف منفصل للحوم والدواجن',
            'اختيار المنتجات الأقل تعرضاً للكسر'
        ];
        
        if (Math.random() > 0.6) { // 40% احتمال إضافة تعليمات
            const randomInstruction = randomInstructions[Math.floor(Math.random() * randomInstructions.length)];
            instructions.push(randomInstruction);
        }
        
        return instructions.join(' - ');
    }

    /**
     * إنشاء طلبات متعددة للاختبار
     */
    generateMultipleOrders(count = 5) {
        const orders = [];
        const statuses = ['pending', 'preparing', 'ready'];
        
        for (let i = 0; i < count; i++) {
            const order = this.generateRandomOrder();
            
            // توزيع عشوائي للحالات
            if (i > 0) { // إبقاء أول طلب كـ pending
                order.status = statuses[Math.floor(Math.random() * statuses.length)];
                
                if (order.status === 'preparing') {
                    order.startTime = Date.now() - (Math.random() * 900000); // بدأ منذ 0-15 دقيقة
                } else if (order.status === 'ready') {
                    order.startTime = Date.now() - (Math.random() * 1800000); // بدأ منذ 0-30 دقيقة
                    order.readyTime = Date.now() - (Math.random() * 300000); // جاهز منذ 0-5 دقائق
                }
            }
            
            // تعديل الوقت للطلبات السابقة
            order.timestamp = Date.now() - (i * Math.random() * 1800000); // طلبات خلال آخر 30 دقيقة
            
            orders.push(order);
        }
        
        return orders.sort((a, b) => a.timestamp - b.timestamp); // ترتيب حسب الوقت
    }

    /**
     * إحصائيات المنتجات الأكثر طلباً
     */
    getPopularProducts() {
        return [
            { id: 'D001', name: 'حليب كامل الدسم', orderCount: 45 },
            { id: 'B001', name: 'خبز بلدي', orderCount: 38 },
            { id: 'G001', name: 'أرز بسمتي', orderCount: 32 },
            { id: 'V001', name: 'طماطم', orderCount: 28 },
            { id: 'M003', name: 'دجاج كامل', orderCount: 25 },
            { id: 'P001', name: 'زيت عباد الشمس', orderCount: 22 },
            { id: 'V002', name: 'بصل', orderCount: 20 },
            { id: 'P003', name: 'سكر أبيض', orderCount: 18 },
            { id: 'D004', name: 'جبن أبيض', orderCount: 15 },
            { id: 'P005', name: 'شاي أسود', orderCount: 12 }
        ];
    }

    /**
     * أوقات الذروة
     */
    getPeakHours() {
        return {
            morning: { start: '08:00', end: '11:00', description: 'ذروة الصباح' },
            lunch: { start: '12:00', end: '14:00', description: 'ذروة الغداء' },
            evening: { start: '17:00', end: '20:00', description: 'ذروة المساء' }
        };
    }

    /**
     * معلومات التوصيل
     */
    getDeliveryZones() {
        return [
            { zone: 'وسط المدينة', deliveryTime: 15, fee: 10 },
            { zone: 'حي الجامعة', deliveryTime: 20, fee: 15 },
            { zone: 'الأندلس', deliveryTime: 25, fee: 20 },
            { zone: 'كورنيش النيل', deliveryTime: 30, fee: 25 },
            { zone: 'المنطقة الصناعية', deliveryTime: 35, fee: 30 }
        ];
    }
}

// تصدير للاستخدام العالمي
if (typeof window !== 'undefined') {
    window.OrderDataManager = OrderDataManager;
}

// للاستخدام في Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OrderDataManager;
}