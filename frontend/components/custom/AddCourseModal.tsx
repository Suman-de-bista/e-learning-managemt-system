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
import { addCourse } from "@/lib/apis/courses"
import { addCourseSchema, AddCourseType } from "@/lib/types/courses"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

interface AddCourseModalProps {
    instructorId: number,
    isOpen: boolean,
    onClose: () => void
    onSuccess: () => void
}

export function AddCourseModal({ instructorId, isOpen, onClose, onSuccess }: AddCourseModalProps) {
    const form = useForm<AddCourseType>({
        resolver: zodResolver(addCourseSchema),
        defaultValues: {
            instructor_id: instructorId,
            title: '',
            level: '',
            duration_hours: 0,
        }
    })

    const onAddCourseSubmit = async (data: AddCourseType) => {
        await addCourse(data);
        onSuccess();
    }
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <form id="addNewCourse" onSubmit={form.handleSubmit(onAddCourseSubmit)}>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Add Course</DialogTitle>
                            <DialogDescription>
                                Add a new Course&apos;s information. Click save when you&apos;re
                                done.
                            </DialogDescription>
                        </DialogHeader>
                        <FieldGroup>
                            <Controller
                                name="title"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="add-course-title">
                                            Title
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="add-course-title"
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
                                        <FieldLabel htmlFor="add-course-level">
                                            Level
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="add-course-level"
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
                                        <FieldLabel htmlFor="add-course-duration-hours">
                                            Duration (hours)
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="add-course-duration-hours"
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
                            <Button type="submit" form="addNewCourse" disabled={form.formState.isSubmitting}>Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
        </div>
    )
}
