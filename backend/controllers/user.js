import USER from '../models/user';
import { hashPassword, comparePassword } from '../services/hash';
import { generateToken } from '../services/auth';

async function handleSignup(req, res){
    const { name, email, password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({
            success: false,
            error: 'All fields are required'
        })
    }
    try{
        const hashedPassword = await hashPassword(password);
        const user = await USER.create({ name, email, password: hashedPassword });
        return res.status(201).json({
            success: true,
            message: 'Signedup succesfully. Procced to login'
        });

    } catch(err){
        return res.status(500).json({
            success: false,
            error: 'Internal Server error' // we donot directly send the raw error to client
        });
    }
}

async function handleLogin(req,res){
    const { email, password } = req.body; 
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: 'All fields are required'
        })
    }
    try {
        const user = await USER.findOne({ email });
        if(!user){
            return res.status(400).json({
                success: false,
                error: 'Invalid Email'
            });
        }
        const isMatch = await comparePassword(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                success: false,
                error: 'Invalid Password'
            });
        }
        const token = generateToken(user);
        res.cookie("uid", token);
        return res.status(200).json({
            sucess: true,
            message: 'Login succesfully'
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        })
    }
}

export { handleSignup, handleLogin };