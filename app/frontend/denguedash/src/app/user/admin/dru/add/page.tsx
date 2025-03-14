"use client";

import {
  BaseErrorResponse,
  BaseServiceResponse,
} from "@/interfaces/services/services.interface";
import { registerDRUSchema } from "@/lib/register-dru-form/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@shadcn/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shadcn/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shadcn/components/ui/form";
import { Input } from "@shadcn/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shadcn/components/ui/select";
import { Textarea } from "@shadcn/components/ui/textarea";
import { DRUTypeResponse } from "@/interfaces/dru/dru.interface";
import fetchService from "@/services/fetch.service";
import { toast } from "sonner";
import { defaultToastSettings } from "@/lib/utils/common-variables.util";
import postService from "@/services/post.service";

type RegisterDRUSchema = z.infer<typeof registerDRUSchema>;

export default function AddDRU() {
  const [druTypes, setDruTypes] = useState<DRUTypeResponse>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDRUTypes = async () => {
    try {
      const response: DRUTypeResponse = await fetchService.getDRUTypes();
      setDruTypes(response);
    } catch (error) {
      console.error("Failed to fetch DRU types:", error);
    }
  };

  useEffect(() => {
    fetchDRUTypes();
  }, []);

  const form = useForm<RegisterDRUSchema>({
    resolver: zodResolver(registerDRUSchema),
    defaultValues: {
      dru_name: "",
      address: "",
      email: "",
      contact_number: "",
      dru_type: "",
    },
  });

  const onSubmit = async (values: RegisterDRUSchema) => {
    const formData = {
      ...values,
      dru_type: parseInt(values.dru_type, 10),
    };
    // todo: remove; for debugging purposes
    console.log(formData);
    try {
      const response: BaseServiceResponse | BaseErrorResponse =
        await postService.registerDRU(formData);
      if (response.success) {
        toast.success("DRU Registered", {
          description:
            "The Disease Reporting Unit has been successfully registered",
          duration: defaultToastSettings.duration,
          dismissible: defaultToastSettings.isDismissible,
        });
        // todo: makes select value empty after reset
        // todo: must find way to reset select value
        form.reset();
      } else {
        if (typeof response.message === "string") {
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
      toast.error("Failed to connect to the server", {
        description: "Please check your internet connection",
        duration: defaultToastSettings.duration,
        dismissible: defaultToastSettings.isDismissible,
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          Register Disease Reporting Unit
        </CardTitle>
        <CardDescription>
          Add a new Disease Reporting Unit to the surveillance system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="dru_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter DRU name" {...field} />
                  </FormControl>
                  <FormDescription>
                    The official name of the Disease Reporting Unit.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter complete address"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@health.gov"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+63 912 345 6789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dru_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DRU Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select DRU type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {druTypes?.data.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.dru_classification}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The category that best describes this reporting unit.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register DRU"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
