import { z } from "zod";

export const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Full name must be at least 2 characters." })
      .max(50, { message: "Full name must be less than 50 characters." }),

    email: z.string().email({ message: "Please enter a valid email address." }),

    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits." }),

    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." })
      .max(30, { message: "Password must be less than 30 characters." }),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // show error under confirmPassword field
  });
