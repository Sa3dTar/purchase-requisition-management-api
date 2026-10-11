const jwt = require('jsonwebtoken');
const User = require('../models/user'); // تأكد من مسار نموذج المستخدم

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'fail',
        message: 'غير موثق، يرجى تسجيل الدخول وإرفاق التوكن في الـ Headers أولاً.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    // البحث عن المستخدم لتضمين الـ role وباقي البيانات في req.user
    const currentUser = await User.findById(decodedToken.id || decodedToken._id);
    if (!currentUser || !currentUser.isActive) {
      return res.status(401).json({
        status: 'fail',
        message: 'المستخدم المرتبط بهذا التوكن لم يعد موجوداً أو تم إلغاء تفعيل حسابه.'
      });
    }

    req.user = currentUser; // سيحتوي الآن على req.user.role بنجاح
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'التوكن غير صالح أو انتهت صلاحيته.'
    });
  }
};

module.exports = verifyToken;