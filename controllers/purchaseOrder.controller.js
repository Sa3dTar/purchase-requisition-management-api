const PurchaseOrder = require('../models/purchaseOrder');
const Product = require('../models/product'); // عشان لو هنحدث المخزون أو نتحقق من المنتجات

// دالة مساعدة لتوليد رقم أمر شراء فريد تلقائياً (مثلاً: PO-20261010-001)
const generatePONumber = async () => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = await PurchaseOrder.countDocuments();
    const sequence = (count + 1).toString().padStart(3, '0');
    return `PO-${dateStr}-${sequence}`;
};

// 1. إنشاء أمر شراء جديد
const createPurchaseOrder = async (req, res) => {
    try {
        const { supplier, items, expectedDeliveryDate } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ status: 400, message: 'Purchase order must contain at least one item' });
        }

        // توليد رقم أمر الشراء تلقائياً
        const poNumber = await generatePONumber();

        // حساب التكلفة الكلية لكل صنف والتكلفة الإجمالية مبدئياً
        let totalAmount = 0;
        const processedItems = items.map(item => {
            const totalItemCost = item.quantityOrdered * item.unitPrice;
            totalAmount += totalItemCost;
            return {
                product: item.product,
                quantityOrdered: item.quantityOrdered,
                unitPrice: item.unitPrice,
                totalItemCost: totalItemCost
            };
        });

        const newPurchaseOrder = await PurchaseOrder.create({
            poNumber,
            supplier,
            items: processedItems,
            totalAmount,
            expectedDeliveryDate,
            createdBy: req.user ? req.user._id : null // لو الـ Auth Middleware ممرر المستخدم
        });

        return res.status(201).json({
            status: 201,
            message: 'Purchase order created successfully',
            data: newPurchaseOrder
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

// 2. جلب كل أوامر الشراء
const getAllPurchaseOrders = async (req, res) => {
    try {
        const purchaseOrders = await PurchaseOrder.find({})
            .populate('supplier', 'name email phone')
            .populate('items.product', 'name sku unit')
            .populate('createdBy', 'name email');

        return res.status(200).json({
            status: 200,
            count: purchaseOrders.length,
            data: purchaseOrders
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

// 3. جلب أمر شراء معين بالـ ID
const getPurchaseOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const purchaseOrder = await PurchaseOrder.findById(id)
            .populate('supplier', 'name email phone taxNumber')
            .populate('items.product', 'name sku unit costPrice')
            .populate('createdBy', 'name email');

        if (!purchaseOrder) {
            return res.status(404).json({ status: 404, message: 'Purchase order not found' });
        }

        return res.status(200).json({
            status: 200,
            data: purchaseOrder
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

// 4. تحديث حالة أمر الشراء (مثلاً من Draft إلى Approved أو Completed)
const updatePurchaseOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Draft', 'Pending Approval', 'Approved', 'Partially Received', 'Completed', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ status: 400, message: 'Invalid status value' });
        }

        const purchaseOrder = await PurchaseOrder.findById(id);
        if (!purchaseOrder) {
            return res.status(404).json({ status: 404, message: 'Purchase order not found' });
        }

        // ملاحظة معمارية: لو الحالة اتحولت لـ Completed، ممكن نعمل هنا التحديث الفعلي للمخزون (Stock Increment)
        purchaseOrder.status = status;
        await purchaseOrder.save();

        return res.status(200).json({
            status: 200,
            message: 'Purchase order status updated successfully',
            data: purchaseOrder
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

module.exports = {
    createPurchaseOrder,
    getAllPurchaseOrders,
    getPurchaseOrderById,
    updatePurchaseOrderStatus
};