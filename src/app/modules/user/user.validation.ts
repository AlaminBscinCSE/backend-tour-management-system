import { z } from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
    // --- Name Field ---
    name: z
        .string({
            error: (issue) => {
                if (issue.input === undefined) {
                    return "The user name is a required field and must be provided.";
                }
                return undefined;
            },
        })
        .min(2, "Name must be at least 2 characters long.")
        .max(50, "Name cannot exceed 50 characters."),

    // --- Email Field ---
    email: z
        .string({
            error: (issue) => {
                if (issue.input === undefined) {
                    return "The email address is required and must be provided.";
                }
                return undefined;
            },
        })
        .email("Invalid email address format.")
        .min(5, "Email must be at least 5 characters long.")
        .max(100, "Email cannot exceed 100 characters."),

    // --- Password Field (Existing) ---
    password: z
        .string({
            error: (issue) => {

                if (issue.input === undefined) {
                    return "The password is required and must be provided.";
                }
                // Otherwise, let the next checks handle the error message
                return undefined;
            },
        })
        .min(8, "Password must be at least 8 characters long.")
        .regex(/(?=.*[A-Z])/, "Password must contain at least 1 uppercase letter.")
        .regex(/(?=.*[!@#$%^&*])/, "Password must contain at least 1 special character.")
        .regex(/(?=.*\d)/, "Password must contain at least 1 number."),

    // --- Phone Field ---
    phone: z
        .string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        })
        .optional(),

    // --- Address Field ---
    address: z
        .string()
        .max(200, "Address cannot exceed 200 characters.")
        .optional(),
});


export const updateUserZodSchema = z.object({
    // --- Name Field ---
    name: z
        .string({
            error: (issue) => {
                // Only return an error if the input is present but NOT a string (Type Error)
                if (issue.input !== undefined && typeof issue.input !== 'string') {
                    return "Name must be a string.";
                }
                return undefined;
            },
        })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .optional(),

    // --- Password Field ---
    password: z
        .string({
            error: (issue) => {
                if (issue.input !== undefined && typeof issue.input !== 'string') {
                    return "Password must be a string.";
                }
                return undefined;
            },
        })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, { message: "Password must contain at least 1 uppercase letter." })
        .regex(/^(?=.*[!@#$%^&*])/, { message: "Password must contain at least 1 special character." })
        .regex(/^(?=.*\d)/, { message: "Password must contain at least 1 number." })
        .optional(),

    // --- Phone Field ---
    phone: z
        .string({
            error: (issue) => {
                if (issue.input !== undefined && typeof issue.input !== 'string') {
                    return "Phone Number must be a string.";
                }
                return undefined;
            },
        })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        })
        .optional(),

    // --- Role Field ---
    role: z
        .enum(Object.values(Role) as [string], {
            error: (issue) => {
                if (issue.input !== undefined && typeof issue.input !== 'string') {
                    return "Role must be a valid enum value (e.g., ADMIN, USER).";
                }
                return undefined;
            },
        })
        .optional(),

    // --- isActive Field ---
    isActive: z
        .enum(Object.values(IsActive) as [string], {
            error: (issue) => {
                if (issue.input !== undefined && typeof issue.input !== 'string') {
                    return "isActive must be a valid enum value (ACTIVE or INACTIVE).";
                }
                return undefined;
            },
        })
        .optional(),

    // --- isDeleted Field ---
    isDeleted: z
        .boolean({
            error: (issue) => {
                if (issue.input !== undefined && typeof issue.input !== 'boolean') {
                    return "isDeleted must be true or false.";
                }
                return undefined;
            },
        })
        .optional(),

    // --- isVerified Field ---
    isVerified: z
        .boolean({
            error: (issue) => {
                if (issue.input !== undefined && typeof issue.input !== 'boolean') {
                    return "isVerified must be true or false.";
                }
                return undefined;
            },
        })
        .optional(),

    // --- Address Field ---
    address: z
        .string({
            error: (issue) => {
                if (issue.input !== undefined && typeof issue.input !== 'string') {
                    return "Address must be a string.";
                }
                return undefined;
            },
        })
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional()
});