import z from "zod";

export const addInstructorSchema = z.object({
  name: z
    .string("Name must have at least 2 characters."),
  expertise: z
    .string()
    .min(2, "Expertise must be at least 2 characters."),
  bio: z
    .string()
    .min(2, "Bio must be at least 2 characters."),
})

export const editInstructorSchema = z.object({
  name: z
    .string("Name must have at least 2 characters.")
    .optional()
    .or(z.literal("")),
  expertise: z
    .string()
    .min(2, "Expertise must be at least 2 characters.")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .min(2, "Bio must be at least 2 characters.")
    .optional()
    .or(z.literal("")),
})

export type AddInstructorType = z.infer<typeof addInstructorSchema>
export type EditInstructorType = z.infer<typeof editInstructorSchema>