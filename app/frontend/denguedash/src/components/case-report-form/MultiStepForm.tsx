"use client";

import { useState, useEffect, useMemo } from "react";
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
import { createFormSchema } from "@/lib/case-report-form/schema";
import { steps } from "@/lib/case-report-form/objects";
import postService from "@/services/post.service";

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [useCurrentAddress, setUseCurrentAddress] = useState(false);

  const formSchema = useMemo(() => {
    return createFormSchema(useCurrentAddress);
  }, [useCurrentAddress]);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const ns1Result = watch("ns1_result");
  const iggElisaResult = watch("igg_elisa");
  const igmElisaResult = watch("igm_elisa");
  const pcrResult = watch("pcr");
  const outcome = watch("outcome");

  const [isDateNs1Disabled, setDateNs1Disabled] = useState(true);
  const [isDateIggElisaDisabled, setDateIggElisaDisabled] = useState(false);
  const [isDateIgmElisaDisabled, setDateIgmElisaDisabled] = useState(false);
  const [isDatePcrDisabled, setDatePcrDisabled] = useState(false);
  const [isDateDeathDisabled, setDateDeathDisabled] = useState(false);

  useEffect(() => {
    setDateNs1Disabled(ns1Result === "PR" || !ns1Result);
    setDateIggElisaDisabled(iggElisaResult === "PR" || !iggElisaResult);
    setDateIgmElisaDisabled(igmElisaResult === "PR" || !igmElisaResult);
    setDatePcrDisabled(pcrResult === "PR" || !pcrResult);
    setDateDeathDisabled(outcome === "A" || !outcome);

    // Reset the date value to null if it should be disabled
    if (ns1Result === "PR") setValue("date_ns1", undefined);
    if (iggElisaResult === "PR") setValue("date_igg_elisa", undefined);
    if (igmElisaResult === "PR") setValue("date_igm_elisa", undefined);
    if (pcrResult === "PR") setValue("date_pcr", undefined);
    if (outcome === "A") setValue("date_death", undefined);
  }, [ns1Result, iggElisaResult, igmElisaResult, pcrResult, outcome, setValue]);

  const processForm: SubmitHandler<FormValues> = async (data) => {
    const formatDate = (dateString: string | number | Date) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    const transformedData = {
      patient: {
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        suffix: data.suffix ? data.suffix : null,
        date_of_birth: formatDate(data.date_of_birth),
        sex: data.sex,
        ca_house_no: data.ca_house_no,
        ca_street: data.ca_street,
        ca_barangay: data.ca_barangay,
        ca_city: data.ca_city,
        ca_province: data.ca_province,
        p_house_no: data.p_house_no,
        p_street: data.p_street,
        p_barangay: data.p_barangay,
        p_city: data.p_city,
        p_province: data.p_province,
        civil_status: data.civil_status,
        date_first_vax: data.date_first_vax
          ? formatDate(data.date_first_vax)
          : null,
        date_last_vax: data.date_last_vax
          ? formatDate(data.date_last_vax)
          : null,
      },
      date_onset: formatDate(data.date_onset),
      date_con: formatDate(data.date_con),
      is_admt: data.is_admt === "true" ? true : false,
      clncl_class: data.clncl_class,
      ns1_result: data.ns1_result,
      date_ns1: data.date_ns1 ? formatDate(data.date_ns1) : null,
      igg_elisa: data.igg_elisa,
      date_igg_elisa: data.date_igg_elisa
        ? formatDate(data.date_igg_elisa)
        : null,
      igm_elisa: data.igm_elisa,
      date_igm_elisa: data.date_igm_elisa
        ? formatDate(data.date_igm_elisa)
        : null,
      pcr: data.pcr,
      case_class: data.case_class,
      outcome: data.outcome,
      date_death: data.date_death ? formatDate(data.date_death) : null,
      interviewer: 1, // todo: get the current user id
    };

    await postService.submitForm(transformedData);

    reset();
    setUseCurrentAddress(false);
    setCurrentStep(0);
  };

  const next = async () => {
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

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseCurrentAddress(event.target.checked);

    if (event.target.checked) {
      // Copy current address values to permanent address fields
      setValue("p_house_no", getValues("ca_house_no"));
      setValue("p_street", getValues("ca_street"));
      setValue("p_barangay", getValues("ca_barangay"));
      setValue("p_city", getValues("ca_city"));
      setValue("p_province", getValues("ca_province"));
    }
  };

  const renderField = (field: any, disabled = false) => {
    const isDate = field.inputType === "date";
    const isSelect = field.inputType === "select";

    const isDisabled =
      field.varName === "date_ns1"
        ? isDateNs1Disabled
        : field.varName === "date_igg_elisa"
          ? isDateIggElisaDisabled
          : field.varName === "date_igm_elisa"
            ? isDateIgmElisaDisabled
            : field.varName === "date_pcr"
              ? isDatePcrDisabled
              : field.varName === "date_death"
                ? isDateDeathDisabled
                : false;

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
                  disabled={isDisabled}
                >
                  <span className={isDisabled ? "text-gray-500" : ""}>
                    {value ? format(value, "PPP") : "Pick a date"}
                  </span>
                  <CalendarIcon
                    className={`h-4 w-4 ${isDisabled ? "text-gray-500" : "text-gray-900"}`}
                  />
                </button>
              </PopoverTrigger>
              {!isDisabled && (
                <PopoverContent className="p-0 bg-white shadow-lg border rounded-md">
                  <Calendar onSelect={(date) => onChange(date)} mode="single" />
                </PopoverContent>
              )}
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
          disabled={disabled}
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
        type={field.inputType == "number" ? "number" : "text"}
        id={field.varName}
        {...register(field.varName)}
        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
        disabled={disabled}
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
                {subunit.name === "Permanent Address" && (
                  <div className="sm:col-span-6">
                    <label className="inline-flex items-center text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        onChange={handleCheckboxChange}
                        checked={useCurrentAddress}
                        className="mr-2"
                      />
                      Same as Current Address
                    </label>
                  </div>
                )}
                {subunit.fields.map((field) => (
                  <div key={field.varName} className="sm:col-span-3">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {field.fieldLabel}
                    </label>
                    {renderField(
                      field,
                      subunit.name === "Permanent Address" && useCurrentAddress
                    )}
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
