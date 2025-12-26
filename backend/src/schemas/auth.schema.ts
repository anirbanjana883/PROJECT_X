import { object, string, TypeOf } from "zod";

// 1. Registration Schema
export const registerSchema = object({
  body: object({
    name: string().trim().min(1, "Name is required"),
    email: string().trim().email("Invalid email address"),
    password: string()
      .min(6, "Password must be at least 6 characters")
      .max(100),
  }).strict(),
});

// 2. Login Schema
export const loginSchema = object({
  body: object({
    email: string().trim().email("Invalid email"),
    password: string().min(1, "Password is required"),
  }).strict(),
});

// 3. Doctor Request Schema
export const doctorRequestSchema = object({
  body: object({
    licenseNumber: string().trim().min(1, "License number is required"),
    specialization: string().trim().min(1, "Specialization is required"),
  }).strict(),
});

// --- TypeScript Types ---
export type RegisterInput = TypeOf<typeof registerSchema>["body"];
export type LoginInput = TypeOf<typeof loginSchema>["body"];
export type DoctorRequestInput = TypeOf<typeof doctorRequestSchema>["body"];
