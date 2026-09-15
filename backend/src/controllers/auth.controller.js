import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import tokenBlacklistModel from "../models/blacklist.model.js";
/**
 * @name- registerUserController
 * @description-register a newUser ,and require user credential like username,email and password,
 * @access- public
 */

async function registerUserController(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide username,email and password"
        })
    }

    const isUserAlreadyExist = await User.findOne({ $or: [{ username }, { email }] });

    if (isUserAlreadyExist) {
        return res.status(200).json({ message: "User Already exist" });
    }
    const hash = await bcrypt.hash(password, 10);
    try {
        const user = await User.create({
            username: username,
            email: email,
            password:hash
        })
        const token = jwt.sign({
            id: user._id, username: user.username
        },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )
        res.cookie("token", token)

        res.status(200).json({
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.username,
                email: user.email
            }
        })
    }
    catch (e) {
        res.status(400).json({
            message: "user cant create"
        })
        console.log("User cant create", e);
    }
}

/**
 * @name- loginUserController
 * @description-login user using credential-email and passwrord
 * @access public
 */

async function loginUserController(req, res) {
    const { email, password } = req.body;
    
    if (!email || !password) {
        res.status(400).json({
            message: "email and password are required"
        })
    }
    const user = await User.findOne({ email })
    if (!user) {
        res.status(400).json({
            message: "User does not exist"
        })
    }

    const isValidPass = await bcrypt.compare(password, user.password);
    if (!isValidPass) {
        res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username
    },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token);
    res.status(200).json({
        message: "Logined Successfully",
        user: {
            id: user._id,
            name: user.username,
            email: user.email
        }
    })
}
/**
 * @name logutUserController
 * @description- clear token from user cookies
 * @access public
 */
async function logutUserController(req,res) {

    const token=req.cookies.token;
    if(token){
        await tokenBlacklistModel.create({token});
    }

    res.clearCookie("token");
    res.status(200).json({
        message:"User logged out successfully"
    })
    
}
/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req,res){
     const user=await User.findById(req.user.id);

     res.status(200).json({
        message:"User details fetched",
        user:{
            id:user._id,
            name:user.username,
            email:user.email
        }
     })
}
export const authController={
    loginUserController,
    registerUserController,
    logutUserController,
    getMeController
}