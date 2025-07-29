const USER = require('../models/user');
const { hashPassword, comparePassword } = require('../services/hash');
const { generateToken, verifyToken } = require('../services/auth');

async function handleSignup(req, res){
    const { Name, Email, Password} = req.body;
    try{
        const hashedPassword = await hashPassword(Password);
        const user = await USER.create({ Name, Email, Password: hashedPassword });
        return res.redirect('/login');

    } catch(err){
        return res.render('signup', { error: 'An error occurred. Please try again.' });
    }
}

async function handleLogin(req,res){
    const { Email, Password } = req.body; 
    const user = await USER.findOne({ Email });
    if(!user){
        return res.render('login', { error: 'Invalid Email' });
    }
    const isMatch = await comparePassword(Password, user.Password);
    if(!isMatch){
        return res.render('login', { error: 'Invalid Password' });
    }
    const token = generateToken(user);
    res.cookie("uid", token);
    return res.redirect('/');
}

module.exports = { handleSignup, handleLogin };