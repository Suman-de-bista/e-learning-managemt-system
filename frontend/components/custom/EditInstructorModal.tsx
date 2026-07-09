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
import { updateInstructor } from "@/lib/apis/instructors"
import { Instructor } from "@/lib/types/common"
import { editInstructorSchema, EditInstructorType } from "@/lib/types/instructors"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

interface EditInstructorModalProps {
    instructor: Instructor,
    isOpen: boolean,
    onClose: () => void,
    onSuccess: () => void,
}

export function EditInstructorModal({ instructor, isOpen, onClose, onSuccess }: EditInstructorModalProps) {
    const form = useForm<EditInstructorType>({
        resolver: zodResolver(editInstructorSchema),
        defaultValues: {
            name: instructor.name,
            expertise: instructor.expertise,
            bio: instructor.bio,
        }
    })

    const onEditInstructorSubmit = async (data: EditInstructorType) => {
        const updates: Partial<EditInstructorType> = {};
        if (data.name && data.name !== instructor.name) updates.name = data.name ?? null;
        if (data.expertise && data.expertise !== instructor.expertise) updates.expertise = data.expertise ?? null;
        if (data.bio) updates.bio = data.bio ?? null;

        if (Object.keys(updates).length === 0) {
            onClose();
            return;
        }
        try{
            await updateInstructor(instructor.id, updates);
            onSuccess();
        }
        catch(error){
            toast.error("Failed Adding Instructor.")
        }
    }
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <Dialog open={isOpen} onOpenChange={(open)=> !open && onClose()}>
                <form id="addNewInstructor" onSubmit={form.handleSubmit(onEditInstructorSubmit)}>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Add Instructor</DialogTitle>
                            <DialogDescription>
                                Add a new Instructor&apos;s information.Click save when you&apos;re
                                done.
                            </DialogDescription>
                        </DialogHeader>
                        <FieldGroup>
                            <Controller
                                name="name"
                                control={form.control}
                                render={({field,fieldState}) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="edit-instructor-name">
                                            Name
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="edit-instructor-name"
                                            className="w-full bg-gray-100 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                            type="text"
                                            placeholder="Instructor Name"
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
                                name="expertise"
                                control={form.control}
                                render={({field,fieldState}) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="edit-instructor-expertise">
                                            Expertise
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="edit-instructor-expertise"
                                            className="w-full bg-gray-100 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                            type="text"
                                            placeholder="Expertise"
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
                                name="bio"
                                control={form.control}
                                render={({field,fieldState}) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="edit-instructor-bio">
                                             Bio
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="edit-instructor-bio"
                                            className="w-full bg-gray-100 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                            type="text"
                                            placeholder="bio"
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
                        <DialogFooter>
                            <DialogClose render={<Button variant="outline">Cancel</Button>} />
                            <Button type="submit" form="addNewInstructor" disabled={form.formState.isSubmitting}>Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
        </div>
    )
}
