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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@shadcn/components/ui/alert-dialog";
import { Calendar } from "@/shadcn/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { Separator } from "@/shadcn/components/ui/separator";
import { createFormSchema } from "@/lib/case-report-form/schema";
import { steps } from "@/lib/case-report-form/objects";
import postService from "@/services/post.service";
import {
  regions,
  getProvincesByRegion,
  getCityMunByProvince,
  getBarangayByMun,
} from "phil-reg-prov-mun-brgy";

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;
type MultiStepFormProps = {
  userId: number;
};

export default function MultiStepForm({ userId }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const formSchema = useMemo(() => {
    return createFormSchema();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    control,
    setValue,
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

  // Address
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCityMunicipality, setSelectedCityMunicipality] = useState("");
  const [, setSelectedBarangay] = useState("");

  const filteredProvince = () => {
    if (!selectedRegion) {
      return [];
    }
    return getProvincesByRegion(selectedRegion);
  };
  const filteredCityMunicipalities = () => {
    if (!selectedProvince) {
      return [];
    }
    return getCityMunByProvince(selectedProvince);
  };
  const filteredBarangays = () => {
    if (!selectedCityMunicipality) {
      return [];
    }
    return getBarangayByMun(selectedCityMunicipality);
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [, regCode] = e.target.value.split("|");
    setSelectedRegion(regCode);
    setSelectedProvince("");
    setSelectedCityMunicipality("");
    setSelectedBarangay("");
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [, provCode] = e.target.value.split("|");
    setSelectedProvince(provCode);
    setSelectedCityMunicipality("");
    setSelectedBarangay("");
  };

  const handleCityMunicipalityChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const [, munCode] = e.target.value.split("|");
    setSelectedCityMunicipality(munCode);
    setSelectedBarangay("");
  };

  // Date
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
    const formatAddress = (address: string) => {
      return address.split("|")[0];
    };
    const transformedData = {
      patient: {
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        suffix: data.suffix ? data.suffix : null,
        date_of_birth: formatDate(data.date_of_birth),
        sex: data.sex,
        addr_house_no: data.addr_house_no,
        addr_street: data.addr_street,
        addr_barangay: data.addr_barangay,
        addr_city: formatAddress(data.addr_city),
        addr_province: formatAddress(data.addr_province),
        addr_region: formatAddress(data.addr_region),
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
      interviewer: userId,
    };

    await postService.submitForm(transformedData);

    reset();
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
      setShowAlertDialog(true);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleConfirmSubmit = () => {
    handleSubmit(processForm)();
    setShowAlertDialog(false);
  };

  const renderField = (field: any, disabled = false) => {
    const isDate = field.inputType === "date";
    const isSelect = field.inputType === "select";
    const isSelectAddr = field.inputType === "select_addr";

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

    if (isSelectAddr) {
      if (field.varName === "addr_region") {
        return (
          <select
            {...register(field.varName as keyof FormValues)}
            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
            onChange={handleRegionChange}
          >
            <option value="">Select Region</option>
            {regions.map((region) => (
              <option
                key={region.name}
                value={`${region.name}|${region.reg_code}`}
              >
                {region.name}
              </option>
            ))}
          </select>
        );
      }
      if (field.varName === "addr_province") {
        return (
          <select
            {...register(field.varName as keyof FormValues)}
            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
            onChange={handleProvinceChange}
          >
            <option value="">Select Province</option>
            {filteredProvince().map((province) => (
              <option
                key={province.name}
                value={`${province.name}|${province.prov_code}`}
              >
                {province.name}
              </option>
            ))}
          </select>
        );
      }
      if (field.varName === "addr_city") {
        return (
          <select
            {...register(field.varName as keyof FormValues)}
            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
            onChange={handleCityMunicipalityChange}
          >
            <option value="">Select City/Municipality</option>
            {filteredCityMunicipalities().map((cityMun) => (
              <option
                key={cityMun.name}
                value={`${cityMun.name}|${cityMun.mun_code}`}
              >
                {cityMun.name}
              </option>
            ))}
          </select>
        );
      }
      if (field.varName === "addr_barangay") {
        return (
          <select
            {...register(field.varName as keyof FormValues)}
            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
          >
            <option value="">Select Barangay</option>
            {filteredBarangays().map((brgy) => (
              <option key={brgy.name} value={brgy.name}>
                {brgy.name}
              </option>
            ))}
          </select>
        );
      }
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
      {/* Added Alert Dialog */}
      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are all the information correct?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please review your information before submitting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
