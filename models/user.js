const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { string } = require('zod');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, trim: true },
  role: { 
    type: String,
    enum: [
  'Requester',         // طالب المشتريات (موظف عادي بيطلب صنف ناقص)
  'Purchasing_Officer', // مسؤول المشتريات (بيجيب عروض أسعار ويملأ أمر الشراء)
  'Inventory_Manager',  // أمين/مدير المخزن (بيستلم البضاعة الفعليّة ويحدث المخزون)
  'Finance_Manager',    // مدير الشؤون المالية (بيوافق على الصرف ويدفع للمورد)
  'Admin'               // مدير النظام (صلاحيات كاملة)
  ],// الأدوار المتاحة لديك 
    required: true 
  }, // ربط بجدول الأدوار والصلاحيات اللي فوق
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, { timestamps: true });

// تشفير كلمة المرور تلقائياً قبل الحفظ في الـ Database

module.exports = mongoose.model('User', userSchema);