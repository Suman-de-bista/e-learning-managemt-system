import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateUser } from "@/lib/apis/users";
import { editUserFormSchema, EditUserFormType } from "@/lib/types/auths";
import { User } from "@/lib/types/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditUserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditUserModal({ user, isOpen, onClose, onSuccess }: EditUserModalProps) {
  const form = useForm<EditUserFormType>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      password: "",
    },
  });

  const onEditUserSubmit = async (data: EditUserFormType) => {
    const updates: Partial<EditUserFormType> = {};
    if (data.name && data.name !== user.name) updates.name = data.name ?? null;
    if (data.email && data.email !== user.email) updates.email = data.email ?? null;
    if (data.password) updates.password = data.password ?? null;

    if (Object.keys(updates).length === 0) {
      onClose();
      return;
    }
    try {
      await updateUser(user.id, updates);
      onSuccess();
    } catch (error) {
      toast.error("Failed Updating User.");
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <form id="editUser" onSubmit={form.handleSubmit(onEditUserSubmit)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update this user&apos;s information. Leave fields blank to keep them unchanged.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-user-form-name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="edit-user-form-name"
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
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-user-form-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="edit-user-form-email"
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
                    <FieldLabel htmlFor="edit-user-form-password">
                      New Password (optional)
                    </FieldLabel>
                    <Input
                      {...field}
                      id="edit-user-form-password"
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
              <Button type="submit" form="editUser" disabled={form.formState.isSubmitting}>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}
