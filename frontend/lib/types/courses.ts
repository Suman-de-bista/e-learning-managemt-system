import z from "zod";

export const addCourseSchema = z.object({
  instructor_id: z
    .number("Instructor is required."),
  title: z
    .string()
    .min(2, "Title must be at least 2 characters."),
  level: z
    .string()
    .min(2, "Level must be at least 2 characters."),
  duration_hours: z
    .number("Duration must be a number.")
    .positive("Duration must be greater than 0."),
})

export const editCourseSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters.")
    .optional()
    .or(z.literal("")),
  level: z
    .string()
    .min(2, "Level must be at least 2 characters.")
    .optional()
    .or(z.literal("")),
  duration_hours: z
    .number("Duration must be a number.")
    .positive("Duration must be greater than 0.")
    .optional(),
})

export type AddCourseType = z.infer<typeof addCourseSchema>
export type EditCourseType = z.infer<typeof editCourseSchema>
