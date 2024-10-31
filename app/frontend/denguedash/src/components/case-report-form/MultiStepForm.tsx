"use client";

import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { Calendar } from "@/shadcn/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { Separator } from "@/shadcn/components/ui/separator";
import { formSchema } from "@lib/schema";

// Define the options
const OPTIONS = {
  sex: [
    { value: "F", label: "Female" },
    { value: "M", label: "Male" },
  ],
  boolean: [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ],
  civilStatus: [
    { value: "S", label: "Single" },
    { value: "M", label: "Married" },
    { value: "SEP", label: "Separated" },
    { value: "W", label: "Widowed" },
  ],
  clinicalClass: [
    { value: "N", label: "No warning signs" },
    { value: "W", label: "With warning signs" },
    { value: "S", label: "Severe Dengue" },
  ],
  labResult: [
    { value: "P", label: "Positive" },
    { value: "N", label: "Negative" },
    { value: "E", label: "Equivocal" },
    { value: "PR", label: "Pending Result" },
  ],
  caseClass: [
    { value: "C", label: "Confirmed" },
    { value: "P", label: "Probable" },
    { value: "S", label: "Suspect" },
  ],
  outcome: [
    { value: "A", label: "Alive" },
    { value: "D", label: "Dead" },
  ],
};

type FormValues = z.infer<typeof formSchema>;

const steps = [
  {
    id: "Step 1",
    name: "Personal Information",
    subunits: [
      {
        name: "Personal Detail",
        fields: [
          {
            inputType: "input",
            varName: "firstName",
            fieldLabel: "First Name",
          },
          {
            inputType: "input",
            varName: "middleName",
            fieldLabel: "Middle Name",
          },
          { inputType: "input", varName: "lastName", fieldLabel: "Last Name" },
          {
            inputType: "select",
            varName: "sex",
            fieldLabel: "Sex",
            selectOptions: OPTIONS.sex,
          },
          {
            inputType: "select",
            varName: "civil_status",
            fieldLabel: "Civil Status",
            selectOptions: OPTIONS.civilStatus,
          },
          {
            inputType: "date",
            varName: "dateOfBirth",
            fieldLabel: "Date of Birth",
          },
        ],
      },
      {
        name: "Current Address",
        fields: [
          { inputType: "input", varName: "caStreet", fieldLabel: "Street" },
          { inputType: "input", varName: "caBarangay", fieldLabel: "Barangay" },
          { inputType: "input", varName: "caCity", fieldLabel: "City" },
          { inputType: "input", varName: "caProvince", fieldLabel: "Province" },
        ],
      },
      {
        name: "Permanent Address",
        fields: [
          { inputType: "input", varName: "pHouseNo", fieldLabel: "House No." },
          { inputType: "input", varName: "pStreet", fieldLabel: "Street" },
          { inputType: "input", varName: "pBarangay", fieldLabel: "Barangay" },
          { inputType: "input", varName: "pCity", fieldLabel: "City" },
          { inputType: "input", varName: "pProvince", fieldLabel: "Province" },
        ],
      },
      {
        name: "Vaccination",
        fields: [
          {
            inputType: "date",
            varName: "dateFirstVax",
            fieldLabel: "Date of First Vaccination",
          },
          {
            inputType: "date",
            varName: "dateLastVax",
            fieldLabel: "Date of Last Vaccination",
          },
        ],
      },
    ],
  },
  {
    id: "Step 2",
    name: "Clinical Status",
    subunits: [
      {
        name: "Consultation",
        fields: [
          {
            inputType: "date",
            varName: "date_con",
            fieldLabel: "Date Admitted/Consulted/Seen",
          },
          {
            inputType: "select",
            varName: "is_admt",
            fieldLabel: "Is Admitted?",
            selectOptions: OPTIONS.boolean,
          },
          {
            inputType: "date",
            varName: "date_onset",
            fieldLabel: "Date Onset of Illness",
          },
          {
            inputType: "select",
            varName: "clncl_class",
            fieldLabel: "Clinical Classification",
            selectOptions: OPTIONS.clinicalClass,
          },
        ],
      },
      {
        name: "Laboratory Results",
        fields: [
          {
            inputType: "select",
            varName: "ns1_result",
            fieldLabel: "NS1",
            selectOptions: OPTIONS.labResult,
          },
          {
            inputType: "date",
            varName: "date_ns1",
            fieldLabel: "Date done (NS1)",
          },
          {
            inputType: "select",
            varName: "igg_elisa",
            fieldLabel: "IgG ELISA",
            selectOptions: OPTIONS.labResult,
          },
          {
            inputType: "date",
            varName: "date_igg_elisa",
            fieldLabel: "Date done (IgG ELISA)",
          },
          {
            inputType: "select",
            varName: "igm_elisa",
            fieldLabel: "IgM ELISA",
            selectOptions: OPTIONS.labResult,
          },
          {
            inputType: "date",
            varName: "date_igm_elisa",
            fieldLabel: "Date done (IgM ELISA)",
          },
          {
            inputType: "select",
            varName: "pcr",
            fieldLabel: "PCR",
            selectOptions: OPTIONS.labResult,
          },
          {
            inputType: "date",
            varName: "date_pcr",
            fieldLabel: "Date done (PCR)",
          },
        ],
      },
      {
        name: "Outcome",
        fields: [
          {
            inputType: "select",
            varName: "case_class",
            fieldLabel: "Case Classification",
            selectOptions: OPTIONS.caseClass,
          },
          {
            inputType: "select",
            varName: "outcome",
            fieldLabel: "Outcome",
            selectOptions: OPTIONS.outcome,
          },
          {
            inputType: "date",
            varName: "date_death",
            fieldLabel: "Date of Death",
          },
        ],
      },
    ],
  },
];

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const processForm: SubmitHandler<FormValues> = (data) => {
    console.log("Form Submitted:", data);
    reset();
    setCurrentStep(0);
  };

  const next = async () => {
    // if (currentStep < steps.length - 1) {
    //   setCurrentStep((prev) => prev + 1);
    // } else {
    //   handleSubmit(processForm)();
    // }
    const fields = steps[currentStep].subunits.flatMap((subunit) =>
      subunit.fields.map((field) => field.varName)
    );

    const valid = await trigger(fields as (keyof FormValues)[], {
      shouldFocus: true,
    });

    if (valid && currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit(processForm)();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderField = (field: any) => {
    const isDate = field.inputType === "date";
    const isSelect = field.inputType === "select";

    if (isDate) {
      return (
        <Controller
          control={control}
          name={field.varName}
          render={({ field: { onChange, value } }) => (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex items-center justify-between w-full rounded-md border-0 py-1.5 px-2 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                >
                  <span>{value ? format(value, "PPP") : "Pick a date"}</span>
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-0 bg-white shadow-lg border rounded-md">
                <Calendar onSelect={(date) => onChange(date)} mode="single" />
              </PopoverContent>
            </Popover>
          )}
        />
      );
    }

    if (isSelect) {
      return (
        <select
          {...register(field.varName as keyof FormValues)}
          className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
        >
          {field.selectOptions.map(
            (option: { value: string; label: string }) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            )
          )}
        </select>
      );
    }

    return (
      <input
        type="text"
        id={field.varName}
        {...register(field.varName)}
        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
      />
    );
  };

  return (
    <section className="flex flex-col justify-between">
      {/* Steps Navigation */}
      <div className="border border-grey rounded-lg p-5">
        <nav aria-label="Progress">
          <ol
            role="list"
            className="space-y-4 md:flex md:space-x-8 md:space-y-0"
          >
            {steps.map((step, index) => (
              <li key={step.id} className="md:flex-1">
                <div
                  className={`group flex w-full flex-col border-l-4 py-2 pl-4 ${
                    currentStep >= index
                      ? "border-sky-600 text-sky-600"
                      : "border-gray-200 text-gray-500"
                  } transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4`}
                  aria-current={currentStep === index ? "step" : undefined}
                >
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Form */}
      <div className="border border-grey rounded-lg px-5 pb-5 mt-4">
        <form onSubmit={handleSubmit(processForm)}>
          {steps[currentStep].subunits.map((subunit) => (
            <div key={subunit.name}>
              <h2 className="mt-7 text-xl font-semibold leading-7 text-gray-900">
                {subunit.name}
              </h2>
              <Separator className="mt-3" />
              <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                {subunit.fields.map((field) => (
                  <div key={field.varName} className="sm:col-span-3">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {field.fieldLabel}
                    </label>
                    {renderField(field)}
                    {errors[field.varName as keyof FormValues] && (
                      <p className="text-red-500 text-sm">
                        {errors[field.varName as keyof FormValues]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </form>
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={prev}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={next}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {currentStep === steps.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </section>
  );
}
