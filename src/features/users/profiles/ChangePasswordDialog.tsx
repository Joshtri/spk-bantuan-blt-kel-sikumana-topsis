import { useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, Button, useOverlayState } from "@heroui/react";
import {
  Description,
  FieldError,
  InputGroup,
  Label,
  TextField,
} from "@heroui/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { axiosInstance } from "@/providers/axios";
import { useNotification } from "@refinedev/core";

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function ChangePasswordDialog({
  isOpen,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const { open: notifyOpen } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const state = useOverlayState({ isOpen, onOpenChange });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    try {
      await axiosInstance.patch("/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      });

      notifyOpen?.({ message: "Password berhasil diubah", type: "success" });
      reset();
      state.close();
    } catch (error: unknown) {
      const err = error as Record<string, unknown>;
      const message =
        (err.message as string) ||
        (err.statusCode === 401
          ? "Password lama tidak sesuai"
          : "Gagal mengubah password");
      notifyOpen?.({ message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const currentError = errors.currentPassword;
  const newError = errors.newPassword;
  const confirmError = errors.confirmNewPassword;

  return (
    <Modal state={state}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Ubah Password</Modal.Heading>
            </Modal.Header>

            <Modal.Body>
              <form id="change-password-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <TextField isRequired isInvalid={!!currentError} className="w-full">
                    <Label>Password Lama</Label>
                    <InputGroup>
                      <InputGroup.Input
                        type={showCurrent ? "text" : "password"}
                        placeholder="Masukkan password lama"
                        {...register("currentPassword", {
                          required: "Password lama wajib diisi",
                        })}
                      />
                      <InputGroup.Suffix>
                        <button
                          type="button"
                          aria-label={showCurrent ? "Hide" : "Show"}
                          className="px-1 text-muted hover:text-(--foreground) transition-colors focus:outline-none"
                          onClick={() => setShowCurrent((v) => !v)}
                        >
                          {showCurrent ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
                        </button>
                      </InputGroup.Suffix>
                    </InputGroup>
                    <FieldError>{currentError?.message}</FieldError>
                  </TextField>

                  <TextField isRequired isInvalid={!!newError} className="w-full">
                    <Label>Password Baru</Label>
                    <InputGroup>
                      <InputGroup.Input
                        type={showNew ? "text" : "password"}
                        placeholder="Masukkan password baru"
                        {...register("newPassword", {
                          required: "Password baru wajib diisi",
                          minLength: { value: 6, message: "Password minimal 6 karakter" },
                        })}
                      />
                      <InputGroup.Suffix>
                        <button
                          type="button"
                          aria-label={showNew ? "Hide" : "Show"}
                          className="px-1 text-muted hover:text-(--foreground) transition-colors focus:outline-none"
                          onClick={() => setShowNew((v) => !v)}
                        >
                          {showNew ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
                        </button>
                      </InputGroup.Suffix>
                    </InputGroup>
                    <FieldError>{newError?.message}</FieldError>
                  </TextField>

                  <TextField isRequired isInvalid={!!confirmError} className="w-full">
                    <Label>Konfirmasi Password Baru</Label>
                    <InputGroup>
                      <InputGroup.Input
                        type={showConfirm ? "text" : "password"}
                        placeholder="Konfirmasi password baru"
                        {...register("confirmNewPassword", {
                          required: "Konfirmasi password wajib diisi",
                          validate: (value) =>
                            value === newPassword || "Password tidak cocok",
                        })}
                      />
                      <InputGroup.Suffix>
                        <button
                          type="button"
                          aria-label={showConfirm ? "Hide" : "Show"}
                          className="px-1 text-muted hover:text-(--foreground) transition-colors focus:outline-none"
                          onClick={() => setShowConfirm((v) => !v)}
                        >
                          {showConfirm ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
                        </button>
                      </InputGroup.Suffix>
                    </InputGroup>
                    <FieldError>{confirmError?.message}</FieldError>
                  </TextField>

                  <Description className="text-xs text-gray-500">
                    Password minimal 6 karakter, dan harus sama dengan konfirmasi password
                  </Description>
                </div>
              </form>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="ghost"
                onPress={() => {
                  reset();
                  state.close();
                }}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                form="change-password-form"
                type="submit"
                isDisabled={isLoading}
              >
                {isLoading ? "Loading..." : "Ubah Password"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
