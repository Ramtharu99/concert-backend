import logger from "../config/logger.js";
import { login, logout, refresh, signupEmail, verifyOTP } from "../services/auth.service.js";

const signupEmailCtr = async (req, res) => {
    try {
        const result = await signupEmail(req.body);
        logger.info("Signup success", { email: req.body.email })
        res.json(result)
    } catch (error) {
        logger.error("Sign up error", { error: error.message })
        res.status(500).json({ error: error.message })
    }
}

const verifyOtpCrt = async (req, res) => {
    try {
        const token = await verifyOTP(req.body)
        res.json(token)
    } catch (error) {
        logger.error("Verify otp error", { error: error.message })
        res.status(500).json({ error: error.message })
    }
}

const loginCrt = async (req, res) => {
    try {
        const tokens = await login(req.body);
        logger.info("Login success", { email: req.body.email })
    } catch (error) {
        logger.error("Login error", { error: error.message })
        res.status(500).json({ error: error.message })
    }
}

const refreshCtr = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken || typeof refreshToken != "string") {
            return res.status(400).json({ error: "Invalid refresh token" })
        }
        const tokens = await refresh(refreshToken)

        res.json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refereshToken
        })
    } catch (error) {
        logger.error("Refresh error", { error, body: req.body })
        res.status(500).json({ error: error.message })
    }
}

const logoutCtr = async (req, res) => {
    try {
        await logout(req.user.userId)
        logger.info("Logout success", { userId: req.user.userId })
        res.json("Logout success")
    } catch (error) {
        logger.error("Logout error", { error: error.message })
        res.status(500).json({ error: error.message })
    }
}

export { loginCrt, logoutCtr, refreshCtr, signupEmailCtr, verifyOtpCrt };

