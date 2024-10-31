import { z } from "zod";

export const formSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last Name is required"),
  sex: z.enum(["F", "M"]).refine((val) => val !== undefined, {
    message: "Sex is required",
  }),
  civil_status: z
    .enum(["S", "M", "SEP", "W"])
    .refine((val) => val !== undefined, {
      message: "Civil Status is required",
    }),
  dateOfBirth: z.date({ required_error: "Date of Birth is required" }),
  caStreet: z.string().optional(),
  caBarangay: z.string().optional(),
  caCity: z.string().optional(),
  caProvince: z.string().optional(),
  pHouseNo: z.string().optional(),
  pStreet: z.string().optional(),
  pBarangay: z.string().optional(),
  pCity: z.string().optional(),
  pProvince: z.string().optional(),
  dateFirstVax: z.date().optional(),
  dateLastVax: z.date().optional(),
  date_con: z.date().optional(),
  is_admt: z.string().optional(),
  date_onset: z.date().optional(),
  clncl_class: z.enum(["N", "W", "S"]).optional(),
  ns1_result: z.enum(["P", "N", "E", "PR"]).optional(),
  date_ns1: z.date().optional(),
  igg_elisa: z.enum(["P", "N", "E", "PR"]).optional(),
  date_igg_elisa: z.date().optional(),
  igm_elisa: z.enum(["P", "N", "E", "PR"]).optional(),
  date_igm_elisa: z.date().optional(),
  pcr: z.enum(["P", "N", "E", "PR"]).optional(),
  date_pcr: z.date().optional(),
  case_class: z.enum(["C", "P", "S"]).optional(),
  outcome: z.enum(["A", "D"]).optional(),
  date_death: z.date().optional(),
});
