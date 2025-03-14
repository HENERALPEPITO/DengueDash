"use client";

import GuestHeader from "@/components/guest/GuestHeader";
import { signUpSchema } from "@/lib/signup/schema";
import { Button } from "@shadcn/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/components/ui/form";
import { Input } from "@shadcn/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shadcn/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { DRUHierarchy } from "@/interfaces/dru/dru-hierarchy.interface";
import fetchService from "@/services/fetch.service";
import Link from "next/link";
import postService from "@/services/post.service";
import {
  BaseErrorResponse,
  BaseServiceResponse,
} from "@/interfaces/services/services.interface";
import { toast } from "sonner";
import { defaultToastSettings } from "@/lib/utils/common-variables.util";

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [DRUData, setDRUData] = useState<DRUHierarchy | null>(null);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedSu, setSelectedSu] = useState("");

  const fetchDRUHierarchyData = async () => {
    try {
      const response: DRUHierarchy = await fetchService.getDRUHierarchy();
      setDRUData(response);
    } catch (error) {
      console.error("Failed to fetch DRU hierarchy:", error);
    }
  };

  useEffect(() => {
    fetchDRUHierarchyData();
  }, []);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      password_confirm: "",
      first_name: "",
      middle_name: "",
      last_name: "",
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    const formData = {
      ...values,
      dru: parseInt(values.dru, 10),
    };
    try {
      const response: BaseServiceResponse | BaseErrorResponse =
        await postService.signUpUser(formData);
      if (response.success) {
        toast.success("Account created successfully", {
          description: "Please wait for admin approval to access the system",
          duration: defaultToastSettings.duration,
          dismissible: defaultToastSettings.isDismissible,
        });
        // todo: find another ways to fully reset the form
        form.reset();
      } else {
        console.log("Failed to create account:", response);
        if (typeof response.message === "string") {
          // Simple message (like general failure message)
          toast.warning("Failed to create account", {
            description: response.message,
            duration: defaultToastSettings.duration,
            dismissible: defaultToastSettings.isDismissible,
          });
        } else {
          Object.entries(response.message).forEach(([field, errors]) => {
            (errors as string[]).forEach((error: string) => {
              toast.warning("Failed to create account", {
                description: `${field}: ${error}`,
                duration: defaultToastSettings.duration,
                dismissible: defaultToastSettings.isDismissible,
              });
            });
          });
        }
      }
    } catch (error) {
      toast.error("Failed to connect to server", {
        description: "Please check your internet connection",
        duration: defaultToastSettings.duration,
        dismissible: defaultToastSettings.isDismissible,
      });
      console.error("Failed to connect to server:", error);
    }
  };

  return (
    <>
      <GuestHeader />
      <div className="mx-auto max-w-4xl mt-10 p-6 bg-card rounded-lg shadow-sm">
        <div className="space-y-2 text-center mb-6">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="text-muted-foreground">
            Create your account to get started
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Middle Name */}
              <FormField
                control={form.control}
                name="middle_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Middle Name{" "}
                      <span className="text-muted-foreground">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="David"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sex */}
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Sex</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="min-w-[8rem]">
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                        <SelectItem value="N/A">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Region */}
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Region</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedRegion(value);
                        // Reset dependent fields when region changes
                        form.setValue("surveillance_unit", "");
                        form.setValue("dru", "");
                        setSelectedSu("");
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="min-w-[8rem]">
                        {DRUData?.data.map((regionObj) => (
                          <SelectItem
                            key={regionObj.region_name}
                            value={regionObj.region_name}
                          >
                            {regionObj.region_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Surveillance Unit */}
              <FormField
                control={form.control}
                name="surveillance_unit"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Surveillance Unit</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedSu(value);
                        // Reset DRU when surveillance unit changes
                        form.setValue("dru", "");
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select surveillance unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="min-w-[8rem]">
                        {selectedRegion ? (
                          DRUData?.data
                            .find(
                              (regionObj) =>
                                regionObj.region_name === selectedRegion
                            )
                            ?.surveillance_units.map((su) => (
                              <SelectItem key={su.su_name} value={su.su_name}>
                                {su.su_name}
                              </SelectItem>
                            ))
                        ) : (
                          <SelectItem disabled value="placeholder">
                            Select region first
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DRU */}
              <FormField
                control={form.control}
                name="dru"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>DRU</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        // Store the id (as a string) in the form state.
                        field.onChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select DRU" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="min-w-[8rem]">
                        {selectedRegion && selectedSu ? (
                          DRUData?.data
                            .find(
                              (regionObj) =>
                                regionObj.region_name === selectedRegion
                            )
                            ?.surveillance_units.find(
                              (su) => su.su_name === selectedSu
                            )
                            ?.drus.map((dru) => (
                              <SelectItem
                                key={dru.id}
                                value={dru.id.toString()} // Value is the id as a string
                              >
                                {dru.dru_name} {/* Display the name */}
                              </SelectItem>
                            ))
                        ) : (
                          <SelectItem disabled value="placeholder">
                            {selectedRegion
                              ? "Select unit first"
                              : "Select region first"}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} className="w-full" />
                    </FormControl>
                    <FormDescription>
                      Must be at least 8 characters long
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="password_confirm"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full mt-6">
              Create Account
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link href="/login" passHref>
            <Button variant="link" className="p-0 h-auto font-normal">
              Sign in
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
