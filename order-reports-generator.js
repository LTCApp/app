/**
 * مولد التقارير والإحصائيات المتقدمة
 * نظام تجهيز الأوردرات المتقدم
 */

class OrderReportsGenerator {
    constructor() {
        this.reportTemplates = this.initializeReportTemplates();
    }

    /**
     * قوالب التقارير
     */
    initializeReportTemplates() {
        return {
            daily: {
                name: 'التقرير اليومي',
                sections: ['summary', 'orders', 'performance', 'revenue']
            },
            weekly: {
                name: 'التقرير الأسبوعي',
                sections: ['summary', 'trends', 'performance', 'customers']
            },
            monthly: {
                name: 'التقرير الشهري',
                sections: ['summary', 'analytics', 'growth', 'forecast']
            }
        };
    }

    /**
     * إنشاء تقرير يومي شامل
     */
    generateDailyReport(orders, date = new Date()) {
        const dateStr = date.toLocaleDateString('ar-SA');
        const todayOrders = orders.filter(order => 
            new Date(order.timestamp).toDateString() === date.toDateString()
        );

        const report = {
            title: `التقرير اليومي - ${dateStr}`,
            date: dateStr,
            timestamp: new Date().toLocaleString('ar-SA'),
            summary: this.generateSummarySection(todayOrders),
            performance: this.generatePerformanceSection(todayOrders),
            revenue: this.generateRevenueSection(todayOrders),
            orders: this.generateOrdersSection(todayOrders),
            charts: this.generateChartsData(todayOrders)
        };

        return report;
    }

    /**
     * قسم الملخص
     */
    generateSummarySection(orders) {
        const total = orders.length;
        const completed = orders.filter(o => o.status === 'completed').length;
        const pending = orders.filter(o => o.status === 'pending').length;
        const preparing = orders.filter(o => o.status === 'preparing').length;
        const ready = orders.filter(o => o.status === 'ready').length;
        const cancelled = orders.filter(o => o.status === 'cancelled').length;

        const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;
        const totalRevenue = orders
            .filter(o => o.status === 'completed')
            .reduce((sum, order) => sum + order.total, 0);

        return {
            totalOrders: total,
            completedOrders: completed,
            pendingOrders: pending,
            preparingOrders: preparing,
            readyOrders: ready,
            cancelledOrders: cancelled,
            completionRate: completionRate,
            totalRevenue: totalRevenue.toFixed(2),
            averageOrderValue: total > 0 ? (totalRevenue / completed).toFixed(2) : 0
        };
    }

    /**
     * قسم الأداء
     */
    generatePerformanceSection(orders) {
        const completedOrders = orders.filter(o => o.status === 'completed' && o.startTime && o.readyTime);
        
        if (completedOrders.length === 0) {
            return {
                averagePreparationTime: 0,
                fastestOrder: null,
                slowestOrder: null,
                onTimeDelivery: 0
            };
        }

        const preparationTimes = completedOrders.map(order => {
            return order.readyTime - order.startTime;
        });

        const averageTime = preparationTimes.reduce((sum, time) => sum + time, 0) / preparationTimes.length;
        const fastestTime = Math.min(...preparationTimes);
        const slowestTime = Math.max(...preparationTimes);

        const onTime = completedOrders.filter(order => {
            const actualTime = (order.readyTime - order.startTime) / 60000; // minutes
            return actualTime <= order.estimatedTime;
        }).length;

        return {
            averagePreparationTime: Math.round(averageTime / 60000), // minutes
            fastestOrder: Math.round(fastestTime / 60000),
            slowestOrder: Math.round(slowestTime / 60000),
            onTimeDelivery: ((onTime / completedOrders.length) * 100).toFixed(1),
            totalProcessed: completedOrders.length
        };
    }

    /**
     * قسم الإيرادات
     */
    generateRevenueSection(orders) {
        const completedOrders = orders.filter(o => o.status === 'completed');
        const revenue = completedOrders.reduce((sum, order) => sum + order.total, 0);

        const deliveryOrders = completedOrders.filter(o => o.orderType === 'delivery');
        const pickupOrders = completedOrders.filter(o => o.orderType === 'pickup');

        const cashOrders = completedOrders.filter(o => o.paymentMethod === 'cash');
        const cardOrders = completedOrders.filter(o => o.paymentMethod === 'card');

        const hourlyRevenue = this.generateHourlyRevenue(completedOrders);

        return {
            totalRevenue: revenue.toFixed(2),
            deliveryRevenue: deliveryOrders.reduce((sum, o) => sum + o.total, 0).toFixed(2),
            pickupRevenue: pickupOrders.reduce((sum, o) => sum + o.total, 0).toFixed(2),
            cashRevenue: cashOrders.reduce((sum, o) => sum + o.total, 0).toFixed(2),
            cardRevenue: cardOrders.reduce((sum, o) => sum + o.total, 0).toFixed(2),
            deliveryCount: deliveryOrders.length,
            pickupCount: pickupOrders.length,
            cashCount: cashOrders.length,
            cardCount: cardOrders.length,
            hourlyBreakdown: hourlyRevenue
        };
    }

    /**
     * تفصيل الإيرادات بالساعة
     */
    generateHourlyRevenue(orders) {
        const hourlyData = {};
        
        for (let hour = 8; hour <= 22; hour++) {
            hourlyData[hour] = {
                hour: `${hour}:00`,
                revenue: 0,
                orders: 0
            };
        }

        orders.forEach(order => {
            const hour = new Date(order.completedTime || order.timestamp).getHours();
            if (hourlyData[hour]) {
                hourlyData[hour].revenue += order.total;
                hourlyData[hour].orders += 1;
            }
        });

        return Object.values(hourlyData);
    }

    /**
     * قسم الطلبات
     */
    generateOrdersSection(orders) {
        const topItems = this.getTopSellingItems(orders);
        const categoryBreakdown = this.getCategoryBreakdown(orders);
        const customerAnalysis = this.getCustomerAnalysis(orders);

        return {
            topSellingItems: topItems,
            categoryBreakdown: categoryBreakdown,
            customerAnalysis: customerAnalysis,
            ordersByHour: this.getOrdersByHour(orders),
            priorityBreakdown: this.getPriorityBreakdown(orders)
        };
    }

    /**
     * أكثر المنتجات مبيعاً
     */
    getTopSellingItems(orders) {
        const itemCounts = {};
        
        orders.forEach(order => {
            if (order.items) {
                order.items.forEach(item => {
                    if (itemCounts[item.name]) {
                        itemCounts[item.name].quantity += item.quantity;
                        itemCounts[item.name].revenue += item.price * item.quantity;
                        itemCounts[item.name].orders += 1;
                    } else {
                        itemCounts[item.name] = {
                            name: item.name,
                            quantity: item.quantity,
                            revenue: item.price * item.quantity,
                            orders: 1,
                            averagePrice: item.price
                        };
                    }
                });
            }
        });

        return Object.values(itemCounts)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10);
    }

    /**
     * تحليل الفئات
     */
    getCategoryBreakdown(orders) {
        // محاكاة تصنيف المنتجات
        const categories = {
            'dairy': { name: 'منتجات الألبان', count: 0, revenue: 0 },
            'meat': { name: 'اللحوم والدواجن', count: 0, revenue: 0 },
            'vegetables': { name: 'الخضروات والفواكه', count: 0, revenue: 0 },
            'grains': { name: 'الحبوب والأرز', count: 0, revenue: 0 },
            'pantry': { name: 'البقالة', count: 0, revenue: 0 },
            'other': { name: 'أخرى', count: 0, revenue: 0 }
        };

        orders.forEach(order => {
            if (order.items) {
                order.items.forEach(item => {
                    // تصنيف بسيط بناء على اسم المنتج
                    let category = 'other';
                    if (item.name.includes('حليب') || item.name.includes('جبن') || item.name.includes('زبادي')) {
                        category = 'dairy';
                    } else if (item.name.includes('لحم') || item.name.includes('دجاج') || item.name.includes('سمك')) {
                        category = 'meat';
                    } else if (item.name.includes('طماطم') || item.name.includes('بصل') || item.name.includes('موز')) {
                        category = 'vegetables';
                    } else if (item.name.includes('أرز') || item.name.includes('مكرونة') || item.name.includes('خبز')) {
                        category = 'grains';
                    } else if (item.name.includes('زيت') || item.name.includes('سكر') || item.name.includes('شاي')) {
                        category = 'pantry';
                    }

                    categories[category].count += item.quantity;
                    categories[category].revenue += item.price * item.quantity;
                });
            }
        });

        return Object.values(categories).filter(cat => cat.count > 0);
    }

    /**
     * تحليل العملاء
     */
    getCustomerAnalysis(orders) {
        const customers = {};

        orders.forEach(order => {
            if (customers[order.customerPhone]) {
                customers[order.customerPhone].orders += 1;
                customers[order.customerPhone].totalSpent += order.total;
            } else {
                customers[order.customerPhone] = {
                    name: order.customerName,
                    phone: order.customerPhone,
                    orders: 1,
                    totalSpent: order.total,
                    lastOrder: order.timestamp
                };
            }
        });

        const topCustomers = Object.values(customers)
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 5);

        return {
            totalCustomers: Object.keys(customers).length,
            topCustomers: topCustomers,
            averageOrdersPerCustomer: (orders.length / Object.keys(customers).length).toFixed(1),
            returningCustomers: Object.values(customers).filter(c => c.orders > 1).length
        };
    }

    /**
     * الطلبات بالساعة
     */
    getOrdersByHour(orders) {
        const hourlyData = {};
        
        for (let hour = 8; hour <= 22; hour++) {
            hourlyData[hour] = 0;
        }

        orders.forEach(order => {
            const hour = new Date(order.timestamp).getHours();
            if (hourlyData[hour] !== undefined) {
                hourlyData[hour] += 1;
            }
        });

        return Object.entries(hourlyData).map(([hour, count]) => ({
            hour: `${hour}:00`,
            orders: count
        }));
    }

    /**
     * تحليل الأولويات
     */
    getPriorityBreakdown(orders) {
        const priorities = {
            normal: { name: 'عادي', count: 0, percentage: 0 },
            high: { name: 'عالي', count: 0, percentage: 0 },
            urgent: { name: 'عاجل', count: 0, percentage: 0 }
        };

        orders.forEach(order => {
            if (priorities[order.priority]) {
                priorities[order.priority].count += 1;
            }
        });

        const total = orders.length;
        Object.keys(priorities).forEach(key => {
            priorities[key].percentage = total > 0 ? 
                ((priorities[key].count / total) * 100).toFixed(1) : 0;
        });

        return Object.values(priorities);
    }

    /**
     * بيانات الرسوم البيانية
     */
    generateChartsData(orders) {
        return {
            ordersByStatus: this.getOrdersByStatus(orders),
            ordersByType: this.getOrdersByType(orders),
            revenueByHour: this.generateHourlyRevenue(orders.filter(o => o.status === 'completed')),
            topItems: this.getTopSellingItems(orders).slice(0, 5)
        };
    }

    /**
     * الطلبات حسب الحالة
     */
    getOrdersByStatus(orders) {
        const statuses = {};
        orders.forEach(order => {
            if (statuses[order.status]) {
                statuses[order.status] += 1;
            } else {
                statuses[order.status] = 1;
            }
        });

        return Object.entries(statuses).map(([status, count]) => ({
            status: this.getStatusArabicName(status),
            count: count
        }));
    }

    /**
     * الطلبات حسب النوع
     */
    getOrdersByType(orders) {
        const types = { delivery: 0, pickup: 0 };
        orders.forEach(order => {
            types[order.orderType] += 1;
        });

        return [
            { type: 'توصيل', count: types.delivery },
            { type: 'استلام', count: types.pickup }
        ];
    }

    /**
     * ترجمة أسماء الحالات للعربية
     */
    getStatusArabicName(status) {
        const statusNames = {
            'pending': 'معلق',
            'preparing': 'قيد التجهيز',
            'ready': 'جاهز',
            'completed': 'مكتمل',
            'cancelled': 'ملغي'
        };
        return statusNames[status] || status;
    }

    /**
     * إنشاء تقرير HTML للطباعة
     */
    generatePrintableReport(reportData) {
        return `
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
                <meta charset="UTF-8">
                <title>${reportData.title}</title>
                <style>
                    body { font-family: Arial, sans-serif; direction: rtl; margin: 20px; line-height: 1.6; }
                    .header { text-align: center; border-bottom: 3px solid #2c3e50; padding-bottom: 20px; margin-bottom: 30px; }
                    .section { margin-bottom: 30px; page-break-inside: avoid; }
                    .section h2 { background: #34495e; color: white; padding: 10px; margin: 0 0 15px 0; }
                    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
                    .stat-box { border: 1px solid #bdc3c7; padding: 15px; text-align: center; border-radius: 5px; }
                    .stat-number { font-size: 2em; font-weight: bold; color: #2c3e50; }
                    .stat-label { color: #7f8c8d; font-size: 0.9em; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    th, td { border: 1px solid #bdc3c7; padding: 10px; text-align: center; }
                    th { background: #ecf0f1; font-weight: bold; }
                    .highlight { background: #f39c12; color: white; font-weight: bold; }
                    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #bdc3c7; color: #7f8c8d; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${reportData.title}</h1>
                    <p>تاريخ التقرير: ${reportData.date}</p>
                    <p>وقت الإنشاء: ${reportData.timestamp}</p>
                </div>

                <div class="section">
                    <h2>📊 الملخص التنفيذي</h2>
                    <div class="stats-grid">
                        <div class="stat-box">
                            <div class="stat-number">${reportData.summary.totalOrders}</div>
                            <div class="stat-label">إجمالي الطلبات</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-number">${reportData.summary.completedOrders}</div>
                            <div class="stat-label">طلبات مكتملة</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-number">${reportData.summary.completionRate}%</div>
                            <div class="stat-label">معدل الإنجاز</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-number">${reportData.summary.totalRevenue} ج.م</div>
                            <div class="stat-label">إجمالي الإيرادات</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>⚡ مؤشرات الأداء</h2>
                    <table>
                        <tr>
                            <th>المؤشر</th>
                            <th>القيمة</th>
                            <th>الوحدة</th>
                        </tr>
                        <tr>
                            <td>متوسط وقت التجهيز</td>
                            <td>${reportData.performance.averagePreparationTime}</td>
                            <td>دقيقة</td>
                        </tr>
                        <tr>
                            <td>أسرع طلب</td>
                            <td>${reportData.performance.fastestOrder}</td>
                            <td>دقيقة</td>
                        </tr>
                        <tr>
                            <td>أبطأ طلب</td>
                            <td>${reportData.performance.slowestOrder}</td>
                            <td>دقيقة</td>
                        </tr>
                        <tr class="highlight">
                            <td>معدل التسليم في الوقت</td>
                            <td>${reportData.performance.onTimeDelivery}%</td>
                            <td>نسبة مئوية</td>
                        </tr>
                    </table>
                </div>

                <div class="section">
                    <h2>💰 تحليل الإيرادات</h2>
                    <div class="stats-grid">
                        <div class="stat-box">
                            <div class="stat-number">${reportData.revenue.deliveryRevenue} ج.م</div>
                            <div class="stat-label">إيرادات التوصيل (${reportData.revenue.deliveryCount})</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-number">${reportData.revenue.pickupRevenue} ج.م</div>
                            <div class="stat-label">إيرادات الاستلام (${reportData.revenue.pickupCount})</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-number">${reportData.revenue.cashRevenue} ج.م</div>
                            <div class="stat-label">دفع نقدي (${reportData.revenue.cashCount})</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-number">${reportData.revenue.cardRevenue} ج.م</div>
                            <div class="stat-label">دفع بالبطاقة (${reportData.revenue.cardCount})</div>
                        </div>
                    </div>
                </div>

                ${reportData.orders.topSellingItems.length > 0 ? `
                <div class="section">
                    <h2>🏆 أكثر المنتجات مبيعاً</h2>
                    <table>
                        <tr>
                            <th>المنتج</th>
                            <th>الكمية المباعة</th>
                            <th>عدد الطلبات</th>
                            <th>الإيرادات</th>
                        </tr>
                        ${reportData.orders.topSellingItems.slice(0, 10).map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>${item.orders}</td>
                            <td>${item.revenue.toFixed(2)} ج.م</td>
                        </tr>
                        `).join('')}
                    </table>
                </div>
                ` : ''}

                <div class="footer">
                    <p>تم إنشاء هذا التقرير بواسطة نظام تجهيز الأوردرات المتقدم</p>
                    <p>© ${new Date().getFullYear()} - السوبر ماركت المتقدم</p>
                </div>
            </body>
            </html>
        `;
    }
}

// تصدير للاستخدام العالمي
if (typeof window !== 'undefined') {
    window.OrderReportsGenerator = OrderReportsGenerator;
}

// للاستخدام في Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OrderReportsGenerator;
}