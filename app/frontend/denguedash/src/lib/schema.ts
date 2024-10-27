import { z } from "zod";

export const FormDataSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().min(1, "Middle name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  sex: z.string().min(1, "Sex is required"),
  caStreet: z.string().min(1, "Current address street is required"),
  caBarangay: z.string().min(1, "Current address barangay is required"),
  caCity: z.string().min(1, "Current address city is required"),
  caProvince: z.string().min(1, "Current address province is required"),
  pHouseNo: z.string().min(1, "Permanent address house number is required"),
  pStreet: z.string().min(1, "Permanent address street is required"),
  pBarangay: z.string().min(1, "Permanent address barangay is required"),
  pCity: z.string().min(1, "Permanent address city is required"),
  pProvince: z.string().min(1, "Permanent address province is required"),
  civilStatus: z.string().min(1, "Civil status is required"),
  dateFirstVax: z.string().min(1, "Date of first vaccination is required"),
  dateLastVax: z.string().min(1, "Date of last vaccination is required"),

  // email: z.string().min(1, "Email is required").email("Invalid email address"),
  country: z.string().min(1, "Country is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip is required"),
});
