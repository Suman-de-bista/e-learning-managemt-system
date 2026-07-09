import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { updateCourse } from "@/lib/apis/courses"
import { Course } from "@/lib/types/common"
import { editCourseSchema, EditCourseType } from "@/lib/types/courses"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

interface EditCourseModalProps {
    course: Course,
    isOpen: boolean,
    onClose: () => void,
    onSuccess: () => void,
}

export function EditCourseModal({ course, isOpen, onClose, onSuccess }: EditCourseModalProps) {
    console.log(course)
    const form = useForm<EditCourseType>({
        resolver: zodResolver(editCourseSchema),
        defaultValues: {
            title: course.title,
            level: course.level,
            duration_hours: course.duration_hours,
        }
    })

    useEffect(() => {
        form.reset({
            title: course.title,
            level: course.level,
            duration_hours: course.duration_hours,
        })
    }, [course])

    const onEditCourseSubmit = async (data: EditCourseType) => {
        const updates: Partial<EditCourseType> = {};
        if (data.title && data.title !== course.title) updates.title = data.title;
        if (data.level && data.level !== course.level) updates.level = data.level;
        if (data.duration_hours && data.duration_hours !== course.duration_hours) updates.duration_hours = data.duration_hours;

        if (Object.keys(updates).length === 0) {
            onClose();
            return;
        }
        try{
            await updateCourse(course.id, updates);
            onSuccess();
        }
        catch(error){
            toast.error("Failed Updating Course.")
        }
    }
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <form id="editCourse" onSubmit={form.handleSubmit(onEditCourseSubmit)}>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Edit Course</DialogTitle>
                            <DialogDescription>
                                Edit the Course&apos;s information. Click save when you&apos;re
                                done.
                            </DialogDescription>
                        </DialogHeader>
                        <FieldGroup>
                            <Controller
                                name="title"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="edit-course-title">
                                            Title
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="edit-course-title"
                                            className="w-full bg-gray-100 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                            type="text"
                                            placeholder="Course Title"
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
                                name="level"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="edit-course-level">
                                            Level
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="edit-course-level"
                                            className="w-full bg-gray-100 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                            type="text"
                                            placeholder="Level"
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
                                name="duration_hours"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="edit-course-duration-hours">
                                            Duration (hours)
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="edit-course-duration-hours"
                                            className="w-full bg-gray-100 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                            type="number"
                                            placeholder="Duration in hours"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} className="text-red-400" />
                                        )}
                                    </Field>
                                )}
                            />

                        </FieldGroup>
                        <DialogFooter>
                            <DialogClose render={<Button variant="outline">Cancel</Button>} />
                            <Button type="submit" form="editCourse" disabled={form.formState.isSubmitting}>Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
        </div>
    )
}
