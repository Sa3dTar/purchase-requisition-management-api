const express = require('express');
const router = express.Router();
const {
    createPurchaseOrder,
    getAllPurchaseOrders,
    getPurchaseOrderById,
    updatePurchaseOrderStatus
} = require('../controllers/purchaseOrder.controller');

// الـ Middlewares (تأكد من مسارها الصحيح في مشروعك)
const verifyToken = require('../middlewares/verifyToken');
const {allowedTo} = require('../middlewares/allowedTo');

// المسارات (Endpoints) الخاصة بأوامر الشراء مع حماية الصلاحيات:

router.route('/')
    // إنشاء أمر الشراء متاح فقط لطالب المشتريات أو مسؤول المشتريات أو الآدمن
    .post(verifyToken, allowedTo('Requester', 'Purchasing_Officer', 'Admin'), createPurchaseOrder)
    
    // جلب كل أوامر الشراء متاح لكل الأدوار الإدارية والمالية والمخازن
    .get(verifyToken, allowedTo('Requester', 'Purchasing_Officer', 'Inventory_Manager', 'Finance_Manager', 'Admin'), getAllPurchaseOrders);

router.route('/:id')
    // جلب أمر شراء معين متاح لكل الأدوار المرتبطة بالعملية
    .get(verifyToken, allowedTo('Requester', 'Purchasing_Officer', 'Inventory_Manager', 'Finance_Manager', 'Admin'), getPurchaseOrderById);

router.route('/:id/status')
    // تحديث الحالة (مثل الاعتماد أو الصرف أو الاستلام) متاح لمدير الشؤون المالية، مدير المخزن، أو الآدمن حسب سياسة النظام
    .patch(verifyToken, allowedTo('Finance_Manager', 'Inventory_Manager', 'Purchasing_Officer', 'Admin'), updatePurchaseOrderStatus);

module.exports = router;