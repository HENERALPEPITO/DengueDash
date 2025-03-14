import { z } from "zod";

export const registerDRUSchema = z.object({
  dru_name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  contact_number: z.string().min(7, {
    message: "Contact number must be at least 7 characters.",
  }),
  dru_type: z.string({
    required_error: "Please select a DRU type.",
  }),
});
