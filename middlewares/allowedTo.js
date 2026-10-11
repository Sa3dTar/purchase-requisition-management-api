exports.allowedTo = (...roles) => {
  return (req, res, next) => {
    console.log("Current User Role:", req.user.role); // <--- أضف هذا السطر
    console.log("Allowed Roles:", roles);              // <--- وهذا السطر

    if (!req.user || !req.user.role) {
      return res.status(401).json({
        status: 'fail',
        message: 'غير مسجل الدخول، أو بيانات المستخدم غير مكتملة.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'ليس لديك الصلاحية للقيام بهذا الإجراء (مسموح لأدوار محددة فقط).'
      });
    }

    next();
  };
};