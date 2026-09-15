import express from 'express'
import {authController} from '../controllers/auth.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
/**
 * @POST 
 * @description-post route create User
 * 
 */
const router=express.Router();

router.post('/register',authController.registerUserController);
/**
 * @route Post/api/auth/login
 * @description login a user with email and password
 * @access Public
 */
router.post('/login',authController.loginUserController);

/**
 * @route Get/api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access Public
 */
router.get("/logout",authController.logutUserController)

/**
 * @route Get api/auth/get-me
 * @description get the current logged in user detail
 * @access private
 */

router.get('/get-me',authMiddleware.authUser,authController.getMeController);

export default router;