import { LoginForm } from "@/components/login/LoginForm";
import { ChartNetwork } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-teal-900">
          {/* <Image
            src="/placeholder.svg?height=1080&width=1920"
            width={1920}
            height={1080}
            alt="Dengue data visualization background"
            className="h-full w-full object-cover opacity-15"
          /> */}
        </div>
        <Link
          href={"/"}
          className="relative z-20 flex items-center text-3xl font-bold gap-2"
        >
          <ChartNetwork />
          DengueDash
        </Link>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[500px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials below to access your account
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
