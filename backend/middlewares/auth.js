import { verifyToken } from '../services/auth';

async function checkAuth(req, res, next) {
    const userUid = req.cookies?.uid;
    req.user = null;
    if(!userUid){
       return next();
    }
    const user = verifyToken(userUid);
    if(!user) return next();
    req.user = user;
    next();
}

export { checkAuth };