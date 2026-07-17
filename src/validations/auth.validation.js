const { z } = require("zod");

const signupSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2, "First name must be at least 2 characters")
        .max(50),

    lastName: z
        .string()
        .trim()
        .optional(),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain one uppercase letter")
        .regex(/[a-z]/, "Must contain one lowercase letter")
        .regex(/[0-9]/, "Must contain one number")
        .regex(/[!@#$%^&*]/, "Must contain one special character"),

    gender: z
        .enum(["male", "female", "other"])
        .optional(),
});

const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email address"),

    password: z.string(),
});

module.exports = { signupSchema, loginSchema };