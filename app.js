const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/connectDB'); // ملف الاتصال بقاعدة البيانات اللي عملناه
require('./models/supplier')
require('./models/product')
require('./models/purchaseOrder')
require('./models/user')
const authRoutes = require('./routes/auth.routes')
const supplierRoutes = require('./routes/supplier.routes');
const purchaseOrderRoutes = require('./routes/purchaseorder.routes');

dotenv.config();

// الاتصال بقاعدة البيانات
connectDB();

const app = express();

// --- Middlewares الأساسية ---
app.use(cors()); // السماح بالـ Cross-Origin Requests
app.use(express.json()); // قراءة الـ JSON data الواردة في الـ Body
app.use(express.urlencoded({ extended: true })); // قراءة بيانات الـ Forms

// --- الـ Routes الرئيسية ---
app.use('/api/user' , authRoutes)
app.use('/api/suppliers', supplierRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
// Route اختباري للتأكد إن السيرفر شغال
app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Purchasing Management System API is running...' });
});

// --- معالجة المسارات غير الموجودة (404) ---
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// --- Middleware عام لمعالجة الأخطاء (Error Handling) ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});