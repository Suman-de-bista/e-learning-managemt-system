"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoginFormType } from "@/lib/types/auths";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema } from "@/lib/types/auths";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { loginUser } from "@/lib/apis/auths";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/context/SessionContext";
import { toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();
  const { refresh } = useSession();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLoginSubmit = async (data: LoginFormType) => {
    try {
      await loginUser(data);
      await refresh();
      toast.success("Login Successful.");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Incorrect Credentials.");
    }
  };

  return (
    <div className="w-full max-w-sm">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription className="text-md">
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="loginForm" onSubmit={form.handleSubmit(onLoginSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-form-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="login-form-email"
                      className="w-full bg-gray-100 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      type="email"
                      placeholder="example@example.com"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="text-red-400" />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-form-password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="login-form-password"
                      className="w-full bg-gray-100 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      type="password"
                      placeholder="••••••••"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="text-red-400" />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Field orientation="horizontal">
            <Button
              type="submit"
              form="loginForm"
              disabled={form.formState.isSubmitting}
              className="w-full border-none text-white bg-blue-500 hover:bg-blue-600 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              {form.formState.isSubmitting ? "Signing in..." : "Login"}
            </Button>
          </Field>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            Don't have an account?
            <a href="/register" className="text-sm text-blue-500 hover:underline">
              Sign up
            </a>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
