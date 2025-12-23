import express from "express"
import { loginCrt, logoutCtr, refreshCtr, signupEmailCtr, verifyOtpCrt } from "../../controllers/auth.controller.js"
import { authLimiter } from "../../middlewares/rateLimit.js"
import { validationMiddleware } from "../../middlewares/validation.js"
import { emailSchema, otpVerificationSchema } from "../../utils/schemas.js"

const router = express.Router()

router.post("/signup", authLimiter, validationMiddleware(emailSchema), signupEmailCtr)
router.post('/verify-otp', authLimiter, validationMiddleware(otpVerificationSchema), verifyOtpCrt)
router.post("/login", authLimiter, validationMiddleware(emailSchema), loginCrt)
router.post("/refresh", refreshCtr)
router.post('/logout', logoutCtr)

export default router