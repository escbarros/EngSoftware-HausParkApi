import { z } from "zod";

const phoneRegex = new RegExp(/^\d{11}$/);
const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
);

export const userSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(10, "Name should have at least 10 chars"),
  cpf: z.string({ message: "CPF is required" }).length(11, "Invalid CPF"),
  phone: z
    .string({ message: "Phone number is required" })
    .regex(phoneRegex, "Invalid phone number"),
  email: z.string({ message: "Email is required" }).email("Invalid email"),
  password: z
    .string({ message: "Password is required" })
    .regex(passwordRegex, "Invalid password"),
});

export const userUpdateSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(10, "Name should have at least 10 chars"),
  phone: z
    .string({ message: "Phone number is required" })
    .regex(phoneRegex, "Invalid phone number"),
  email: z.string({ message: "Email is required" }).email("Invalid email"),
  password: z
    .string({ message: "Password is required" })
    .regex(passwordRegex, "Invalid password"),
});

export type UserInput = z.infer<typeof userSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
