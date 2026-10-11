const express = require('express');
const router = express.Router();
const {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
} = require('../controllers/supplier.controller');

// الـ Middlewares (تأكد من مسارها الصحيح في مشروعك)
const verifyToken = require('../middlewares/verifyToken');
const {allowedTo} = require('../middlewares/allowedTo');

// المسارات (Endpoints) الخاصة بالموردين مع حماية الصلاحيات:

router.route('/')
    // إضافة مورد جديد متاح فقط لمسؤول المشتريات أو الآدمن
    .post(verifyToken, allowedTo('Purchasing_Officer', 'Admin'), createSupplier)
    
    // جلب كل الموردين متاح لكل الأدوار الإدارية والمالية والمشتريات
    .get(verifyToken, allowedTo('Requester', 'Purchasing_Officer', 'Inventory_Manager', 'Finance_Manager', 'Admin'), getAllSuppliers);

router.route('/:id')
    // جلب مورد برقم الـ ID متاح لكل الأدوار المعتمدة
    .get(verifyToken, allowedTo('Requester', 'Purchasing_Officer', 'Inventory_Manager', 'Finance_Manager', 'Admin'), getSupplierById)
    
    // تعديل بيانات المورد متاح لمسؤول المشتريات أو الآدمن فقط
    .put(verifyToken, allowedTo('Purchasing_Officer', 'Admin'), updateSupplier)
    
    // إيقاف تفعيل المورد متاح لمسؤول المشتريات أو الآدمن فقط
    .delete(verifyToken, allowedTo('Purchasing_Officer', 'Admin'), deleteSupplier);

module.exports = router;