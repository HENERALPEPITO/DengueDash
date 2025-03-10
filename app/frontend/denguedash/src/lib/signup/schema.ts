import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    firstName: z.string().min(1, {
      message: "First Name is required.",
    }),
    middleName: z.string().optional(),
    lastName: z.string().min(1, {
      message: "Last Name is required.",
    }),
    sex: z.string({
      required_error: "Please select your sex.",
    }),
    region: z.string({
      required_error: "Please select your region.",
    }),
    surveillanceUnit: z.string({
      required_error: "Please select your surveillance unit.",
    }),
    dru: z.string({
      required_error: "Please select your DRU.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
