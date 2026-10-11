const Supplier = require('../models/supplier'); // عدل المسار حسب مكان الـ Model عندك

// 1. إنشاء مورد جديد
const createSupplier = async (req, res) => {
    try {
        const { name, contactPerson, email, phone, address, taxNumber } = req.body;

        // التأكد من عدم تكرار البريد الإلكتروني للمورد
        const existingSupplier = await Supplier.findOne({ email });
        if (existingSupplier) {
            return res.status(400).json({ status: 400, message: 'Supplier with this email already exists' });
        }

        const newSupplier = await Supplier.create({
            name,
            contactPerson,
            email,
            phone,
            address,
            taxNumber
        });

        return res.status(201).json({
            status: 201,
            message: 'Supplier created successfully',
            data: newSupplier
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

// 2. جلب كل الموردين
const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find({});
        return res.status(200).json({
            status: 200,
            count: suppliers.length,
            data: suppliers
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

// 3. جلب مورد معين بالـ ID
const getSupplierById = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await Supplier.findById(id);

        if (!supplier) {
            return res.status(404).json({ status: 404, message: 'Supplier not found' });
        }

        return res.status(200).json({
            status: 200,
            data: supplier
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

// 4. تعديل بيانات مورد
const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        
        const updatedSupplier = await Supplier.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true } // لضمان تطبيق شروط الـ Schema أثناء التعديل
        );

        if (!updatedSupplier) {
            return res.status(404).json({ status: 404, message: 'Supplier not found' });
        }

        return res.status(200).json({
            status: 200,
            message: 'Supplier updated successfully',
            data: updatedSupplier
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

// 5. حذف أو إيقاف تفعيل المورد (Soft Delete / Hard Delete)
const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;

        // يفضل عمل Soft Delete عشان فواتير المشتريات القديمة المرتبطة بيه متضربش
        const supplier = await Supplier.findById(id);
        if (!supplier) {
            return res.status(404).json({ status: 404, message: 'Supplier not found' });
        }

        supplier.isActive = false;
        await supplier.save();

        return res.status(200).json({
            status: 200,
            message: 'Supplier deactivated successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

module.exports = {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
};