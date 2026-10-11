const user = require('../models/user')
const bcrypt = require('bcrypt')
const generatejwt = require('../middlewares/generatejwt')


const register = async(req ,res)=>{
  try{
    const {name , email ,password , phone , role ,isActive } = req.body

    const existEmail = await user.findOne({email})

    if(existEmail){
        return res.json({status : 400 , message : 'this email is already exist' })
    }

    const hashedPassword = await bcrypt.hash(password , 10)

    const newUser = await user.create({name ,email , password : hashedPassword ,phone , role ,isActive})

    const token = generatejwt({email : newUser.email , _id : newUser._id})

    console.log(token)

    return res.json({status : 200 , message : 'registered suuccessfully'})
  }catch(err){
    return res.json({status : 500 , message : err})
  }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. التأكد من إدخال البريد الإلكتروني وكلمة المرور
        if (!email || !password) {
            return res.status(400).json({ status: 400, message: 'Please provide email and password' });
        }

        // 2. البحث عن المستخدم بالبريد الإلكتروني
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ status: 400, message: 'Invalid email or password' });
        }

        // 3. التحقق مما إذا كان الحساب مفعل (اختياري حسب الـ Schema بتاعتك)
        if (existingUser.isActive === false) {
            return res.status(403).json({ status: 403, message: 'Account is deactivated' });
        }

        // 4. مقارنة كلمة المرور المدخلة بالمشفرة في الداتابيز
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ status: 400, message: 'Invalid email or password' });
        }

        // 5. توليد الـ Token باستخدام بيانات المستخدم (اليميل، الـ ID، والدور لو حابب تزوده)
        const token = generatejwt({ 
            email: existingUser.email, 
            _id: existingUser._id,
            role: existingUser.role 
        });

        // 6. الرد بنجاح وتسليم الـ Token
        return res.status(200).json({
            status: 200,
            message: 'Logged in successfully',
            token,
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

module.exports = {
    register, // لو حابب تحطهم في نفس ملف الـ Controller
    login
};