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
import { addUser } from "@/lib/apis/users"
import { registerFormSchema, RegisterFormType } from "@/lib/types/auths"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

interface AddUserModalProps {
    isOpen: boolean,
    onClose: () => void
    onSuccess: () => void
}

export function AddUserModal({ isOpen, onClose, onSuccess }: AddUserModalProps) {
const form = useForm<RegisterFormType>({
            resolver: zodResolver(registerFormSchema),
            defaultValues: {
                name:'',
                email: '',
                password: '',
                confirmPassword: '',
            }
        })

    const onAddUserSubmit = async (data: RegisterFormType) => {
        try{
            await addUser(data);
            onSuccess();
        }
        catch(error){
            toast.error("Failed Adding User.")
        }
    }
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <Dialog open={isOpen} onOpenChange={(open)=> !open && onClose()}>
                <form id="addNewUser" onSubmit={form.handleSubmit(onAddUserSubmit)}>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Add User</DialogTitle>
                            <DialogDescription>
                                Add a new User&apos;s information.Click save when you&apos;re
                                done.
                            </DialogDescription>
                        </DialogHeader>
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
                        <DialogFooter>
                            <DialogClose render={<Button variant="outline">Cancel</Button>} />
                            <Button type="submit" form="addNewUser" disabled={form.formState.isSubmitting}>Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
        </div>
    )
}
