import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Redis from "ioredis";
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt.js';
import { sendOTP, sendWelcomeEmail } from './email.service.js';

const redis = new Redis(process.env.REDIS_URL)

const prisma = new PrismaClient()

const hashPassword = async (password) => bcrypt.hash(password, 10)

const generateNumeriicOTP = () => {
    const n = crypto.randomInt(0, 1000000)
    return n.toString().padStart(6, "0")
}

const signupEmail = async (data) => {
    const { email, password, name } = data;
    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) throw new Error("User exist")

    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
        data: { email, password: hashedPassword }
    })

    if (name) {
        await prisma.profile.create({
            data: { userId: user.id, name }
        })
    }

    const otp = generateNumeriicOTP();

    await redis.set(`otp:${email}`, otp, "EX", 300)

    await sendOTP(email, otp, { name: name || "N/A", email })

    return { message: "Otp sent" }
}


const verifyOTP = async (date) => {
    const { email, otp } = data;

    const storedOtp = await redis.get(`otp:${email}`)

    if (storedOtp !== otp) throw new Error("Invalid OTP")

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new Error("User not found")

    const accessToken = generateAccessToken(user.id)
    const refereshToken = generateRefreshToken(user.id)
    const hashedRefresh = await bcrypt.hash(refereshToken, 10)

    await prisma.user.update({
        where: { id: user.id },
        data: { refereshToken: hashedRefresh }
    })

    await redis.del(`otp${email}`)
    await sendWelcomeEmail(email, { name: user.profile?.name || "User" })

    return { accessToken, refereshToken }
}


const login = async (data) => {
    const { email, password } = data;

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !await bcrypt.compare(password, user.password)) throw new Error("Invalid Credentials")

    const accessToken = generateAccessToken(user.id)
    const refereshToken = generateRefreshToken(user.id)
    const hashedRefresh = await bcrypt.hash(refereshToken, 10)

    await prisma.user.update({
        where: { id: user.id },
        data: { refereshToken, hashedRefresh }
    })

    return { accessToken, refereshToken }
}


const refresh = async () => {
    let decode;

    try {
        decode = verifyToken(refereshToken, process.env.REFERESH_SECRET)
    } catch (error) {
        throw new Error("Invalid token")
    }

    const user = await prisma.user.findUnique({ where: { id: decode.userId } })
    if (!user || !(await bcrypt.compare(refereshToken, user.refereshToken))) {
        throw new Error("Invalid refresh token")
    }

    const newAccessToken = generateAccessToken(user.id)
    const newRefreshToken = generateRefreshToken(user.id)
    const hashedNewRefresh = await bcrypt.hash(refereshToken, 10)

    await prisma.user.update({
        where: { id: user.id },
        data: { refereshToken: hashedNewRefresh }

    })

    return { accessToken: newAccessToken, refereshToken: newRefreshToken }
}

const logout = async () => {
    await prisma.user.update({
        where: { id: user.id },
        data: { refereshToken: null }
    })
}


export { login, logout, refresh, signupEmail, verifyOTP };

