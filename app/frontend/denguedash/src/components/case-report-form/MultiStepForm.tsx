"use client";

import { useState } from "react";
import { z } from "zod";
import { FormDataSchema } from "@lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Separator } from "@/shadcn/components/ui/separator";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { Calendar } from "@/shadcn/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

type Inputs = z.infer<typeof FormDataSchema>;

const sexOptions = [
  {
    value: "F",
    label: "Female",
  },
  {
    value: "M",
    label: "Male",
  },
];

const booleanOptions = [
  {
    value: true,
    label: "Yes",
  },
  {
    value: false,
    label: "No",
  },
];

const civilStatusOptions = [
  {
    value: "S",
    label: "Single",
  },
  {
    value: "M",
    label: "Married",
  },
  {
    value: "SEP",
    label: "Separated",
  },
  {
    value: "W",
    label: "Widowed",
  },
];

const clinicalClassOptions = [
  {
    value: "N",
    label: "No warning signs",
  },
  {
    value: "W",
    label: "With warning signs",
  },
  {
    value: "S",
    label: "Severe Dengue",
  },
];

const labResultOptions = [
  {
    value: "P",
    label: "Positive",
  },
  {
    value: "N",
    label: "Negative",
  },
  {
    value: "E",
    label: "Equivocal",
  },
  {
    value: "PR",
    label: "Pending Result",
  },
];

const caseClassOptions = [
  {
    value: "C",
    label: "Confirmed",
  },
  {
    value: "P",
    label: "Probable",
  },
  {
    value: "S",
    label: "Suspect",
  },
];

const outcomeOptions = [
  {
    value: "A",
    label: "Alive",
  },
  {
    value: "D",
    label: "Dead",
  },
];

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
            selectOptions: sexOptions,
          },
          {
            inputType: "select",
            varName: "civil_status",
            fieldLabel: "Civil Status",
            selectOptions: civilStatusOptions,
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
            selectOptions: booleanOptions,
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
            selectOptions: clinicalClassOptions,
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
            selectOptions: labResultOptions,
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
            selectOptions: labResultOptions,
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
            selectOptions: labResultOptions,
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
            selectOptions: labResultOptions,
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
            selectOptions: caseClassOptions,
          },
          {
            inputType: "select",
            varName: "outcome",
            fieldLabel: "Outcome",
            selectOptions: outcomeOptions,
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
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
  });

  const processForm: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    reset();
  };

  type FieldName = keyof Inputs;

  const next = async () => {
    // const fields = steps[currentStep].fields.map((field) => field.varName);
    const fields =
      steps[currentStep].subunits?.flatMap((subunit) =>
        subunit.fields.map((field) => field.varName)
      ) || [];
    const output = await trigger(fields as FieldName[], { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await handleSubmit(processForm)();
      }
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
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
              <li key={step.name} className="md:flex-1">
                <div
                  className={`group flex w-full flex-col border-l-4 py-2 pl-4 transition-colors ${
                    currentStep >= index
                      ? "border-sky-600 text-sky-600"
                      : "border-gray-200 text-gray-500"
                  } md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4`}
                  aria-current={currentStep === index ? "step" : undefined}
                >
                  <span className="text-sm font-medium">{step.id}</span>
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
          {currentStep === 0 && (
            <div>
              {steps[0].subunits.map((subunit) => (
                <div key={subunit.name}>
                  <h2 className="mt-7 ext-xl font-semibold leading-7 text-gray-900">
                    {subunit.name}
                  </h2>
                  <Separator className="mt-3" />

                  <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                    {subunit.fields.map((field) => (
                      <div key={field.varName} className="sm:col-span-3">
                        <label
                          htmlFor={field.varName}
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          {field.fieldLabel}
                        </label>
                        <div className="mt-2">
                          {field.inputType === "select" ? (
                            <select
                              id={field.varName}
                              {...register(field.varName as FieldName)}
                              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                            >
                              {/* <option value="">Select your sex</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option> */}
                              {field.selectOptions?.map((option) => (
                                <option
                                  key={String(option.value)}
                                  value={String(option.value)}
                                >
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : [
                              "dateOfBirth",
                              "dateFirstVax",
                              "dateLastVax",
                            ].includes(field.varName) ? (
                            <Controller
                              control={control}
                              name={field.varName as FieldName}
                              render={({ field: { onChange, value } }) => (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button
                                      type="button"
                                      className="flex items-center justify-between w-full rounded-md border-0 py-1.5 px-2 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                                    >
                                      <span>
                                        {value
                                          ? format(value, "PPP")
                                          : "Pick a date"}
                                      </span>
                                      <CalendarIcon className="h-4 w-4 opacity-50" />
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent className="p-0 bg-white shadow-lg border rounded-md">
                                    <Calendar
                                      onSelect={(date) => onChange(date)}
                                      mode="single"
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              )}
                            />
                          ) : (
                            <input
                              type="text"
                              id={field.varName}
                              {...register(field.varName as FieldName)}
                              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            />
                          )}
                          {errors[field.varName as FieldName] && (
                            <p className="mt-2 text-sm text-red-400">
                              {errors[field.varName as FieldName]?.message}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>

        <div className="pt-5">
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prev}
              disabled={currentStep === 0}
              className="rounded px-3 py-2 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={next}
              disabled={currentStep === steps.length - 1}
              className="rounded px-3 py-2 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
