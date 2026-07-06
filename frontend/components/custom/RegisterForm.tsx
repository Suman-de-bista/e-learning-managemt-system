'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerFormSchema, RegisterFormType } from "@/lib/types/auths";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { registerUser } from "@/lib/apis/auths";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const router = useRouter();

    const form = useForm<RegisterFormType>({
            resolver: zodResolver(registerFormSchema),
            defaultValues: {
                name:'',
                email: '',
                password: '',
                confirmPassword: '',
            }
        })

    const onRegisterSubmit = async (data: RegisterFormType) => {
        await registerUser(data);
        router.push('/');
    }
    return (
        <div className="w-full max-w-sm">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
                    <CardDescription className="text-md">
                        Enter your details to create your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="registerForm" onSubmit={form.handleSubmit(onRegisterSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="name"
                                control={form.control}
                                render={({field,fieldState}) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="register-form-name">
                                            Name
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="register-form-name"
                                            className="w-full bg-gray-100 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                            type="text"
                                            placeholder="User Name"
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
                                name="email"
                                control={form.control}
                                render={({field,fieldState}) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="register-form-email">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="register-form-email"
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
                                render={({field,fieldState}) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="register-form-password">
                                            Password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="register-form-password"
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
                            <Controller
                                name="confirmPassword"
                                control={form.control}
                                render={({field,fieldState}) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="register-form-confirmPassword">
                                            Confirm Password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="register-form-confirmPassword"
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
                    <Button type="submit" form="registerForm" disabled={form.formState.isSubmitting} className="w-full border-none text-white bg-blue-500 hover:bg-blue-600 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                        {form.formState.isSubmitting ? "Signing up..." : "Register"}
                    </Button>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                        Already have an account?
                        <a href="/" className="text-sm text-blue-500 hover:underline">
                            Sign in
                        </a>
                    </span>
                </CardFooter>
            </Card>
        </div>
    );
}   
