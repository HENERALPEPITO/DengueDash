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

const steps = [
  {
    id: "Step 1",
    name: "Personal Information",
    fields: [
      {
        varName: "firstName",
        fieldLabel: "First Name",
      },
      {
        varName: "middleName",
        fieldLabel: "Middle Name",
      },
      {
        varName: "lastName",
        fieldLabel: "Last Name",
      },
      {
        varName: "dateOfBirth",
        fieldLabel: "Date of Birth",
      },
      {
        varName: "sex",
        fieldLabel: "Sex",
      },
      {
        varName: "caStreet",
        fieldLabel: "Current Address - Street",
      },
      {
        varName: "caBarangay",
        fieldLabel: "Current Address - Barangay",
      },
      {
        varName: "caCity",
        fieldLabel: "Current Address - Municipality",
      },
      {
        varName: "caProvince",
        fieldLabel: "Current Address - Province",
      },
      {
        varName: "pHouseNo",
        fieldLabel: "Permanent Address - House No.",
      },
      {
        varName: "pStreet",
        fieldLabel: "Permanent Address - Street",
      },
      {
        varName: "pBarangay",
        fieldLabel: "Permanent Address - Barangay",
      },
      {
        varName: "pCity",
        fieldLabel: "Permanent Address - Municipality",
      },
      {
        varName: "pProvince",
        fieldLabel: "Permanent Address - Province",
      },
      {
        varName: "civilStatus",
        fieldLabel: "Civil Status",
      },
      {
        varName: "dateFirstVax",
        fieldLabel: "Date of First Vaccination",
      },
      {
        varName: "dateLastVax",
        fieldLabel: "Date of Last Vaccination",
      },
    ],
  },
  {
    id: "Step 2",
    name: "Clinical Status",
    fields: [
      { varName: "country", fieldLabel: "Country" },
      { varName: "state", fieldLabel: "State" },
      { varName: "city", fieldLabel: "City" },
      { varName: "street", fieldLabel: "Street" },
      { varName: "zip", fieldLabel: "ZIP Code" },
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
    const fields = steps[currentStep].fields.map((field) => field.varName);
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
      <div className="border border-grey rounded-lg p-5 mt-4">
        <form onSubmit={handleSubmit(processForm)}>
          {currentStep === 0 && (
            <div>
              <h2 className="text-xl font-semibold leading-7 text-gray-900">
                Personal Information
              </h2>
              <Separator className="mt-3" />

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                {steps[0].fields.map((field) => (
                  <div key={field.varName} className="sm:col-span-3">
                    <label
                      htmlFor={field.varName}
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      {field.fieldLabel}
                    </label>
                    <div className="mt-2">
                      {["dateOfBirth", "dateFirstVax", "dateLastVax"].includes(
                        field.varName
                      ) ? (
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
                                  // selected={value}
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
          )}

          {currentStep === 2 && (
            <>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Complete
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Thank you for your submission.
              </p>
            </>
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
