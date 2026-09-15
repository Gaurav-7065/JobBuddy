import jwt from 'jsonwebtoken'
import tokenBlacklistModel from '../models/blacklist.model.js';
async function authUser(req,res,next){
    
    const token=req.cookies.token
    
    if(!token){
        
        return res.status(401).json({
            message:"token not provided"
        })
        
    }
    const istokenBlacklisted=await tokenBlacklistModel.findOne({token});
    if(istokenBlacklisted){
        return res.status(401).json({
            message:"token is invalid"
        })
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        
        req.user=decoded
        
        next();
    }
    catch(err){
        console.log(err);
        return res.status(401).json({
            message:"Invalid Token"
        })
    }
}

export const authMiddleware={
    authUser
};