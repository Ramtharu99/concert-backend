import z from 'zod'

const emailSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(3).optional()
})

const otpVerificationSchema = z.object({
    email: z.string().email(),
    otp: z.string().length(6)
})

const profileUpdateSchema = z.object({
    name: z.string().optional(),
    phoneNumber: z.string().optional(),
    gender: z.string().optional(),
    state: z.string().optional(),
    birthDay: z.string().optional(),
})

const bookingSchema = z.object({
    categoryId: z.string(),
    seats: z.number().min(1).max(10)
})

export { bookingSchema, emailSchema, otpVerificationSchema, profileUpdateSchema }
