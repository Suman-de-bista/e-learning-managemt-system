import * as z from "zod";

export const loginFormSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(100, "Password must be at most 100 characters."),
});

export const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters.")
      .max(50, "Name must be at most 50 characters."),
    email: z.email("Please enter a valid email address."),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters.")
      .max(100, "Password must be at most 100 characters."),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters.")
      .max(100, "Confirm Password must be at most 100 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const editUserFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be at most 50 characters.")
    .optional()
    .or(z.literal("")),
  email: z.email("Please enter a valid email address.").optional().or(z.literal("")),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(100, "Password must be at most 100 characters.")
    .optional()
    .or(z.literal("")),
});

export type LoginFormType = z.infer<typeof loginFormSchema>;
export type RegisterFormType = z.infer<typeof registerFormSchema>;
export type EditUserFormType = z.infer<typeof editUserFormSchema>;
