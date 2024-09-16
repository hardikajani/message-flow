import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username not valid")
    .regex(/^[a-zA-Z0-9_]{3,}$/, "username must not contain special character")


    export const signUpSchema = z.object({
        username : usernameValidation,
        email: z.string().email({message: 'Invalid email address'}),
        password: z.string().min(6, {message: 'password must be at least 6 characters'})
    });