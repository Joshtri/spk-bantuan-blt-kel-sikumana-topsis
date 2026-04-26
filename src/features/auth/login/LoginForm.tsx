import { useState } from "react";
import { useLogin } from "@refinedev/core";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  CloseButton,
  FieldError,
  Form,
  Input,
  InputGroup,
  Label,
  Link,
  Spinner,
  TextField,
} from "@heroui/react";
import { Heading } from "@/components/heading";
import { Text } from "@/components/text";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

// ---------------------------------------------------------------------------
// LoginForm
// ---------------------------------------------------------------------------

export const LoginForm = () => {
  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
    remember: false,
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: login, isPending } = useLogin<
    Pick<LoginFormValues, "email" | "password">
  >();

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    login(
      { email: values.email, password: values.password },
      {
        onError: (error) => {
          const msg = (error as { message?: string })?.message
            ?? "Email atau password salah.";
          setErrorMessage(msg);
        },
      },
    );
  };

  return (
    <Card className="border border-border shadow-sm bg-surface">
      <Card.Header className="pb-0 pt-6 px-6 flex flex-col gap-1">
        <Heading as="h2" size="2xl" align="center" className="text-(--foreground)">
          Selamat datang
        </Heading>
        <Text size="sm" className="text-muted" align="center">
          Masuk untuk melanjutkan ke dashboard
        </Text>
      </Card.Header>

      <Card.Content className="flex flex-col gap-5 pt-4">
        {/* Error alert */}
        {errorMessage && (
          <Alert color="danger" className="text-sm">
            <span>{errorMessage}</span>
            <CloseButton slot="close" onPress={() => setErrorMessage(null)} />
          </Alert>
        )}

        <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Email */}
          <TextField
            isRequired
            className="w-full"
            name="email"
            type="email"
            value={values.email}
            onChange={(v) => {
              setValues((prev) => ({ ...prev, email: v }));
              if (errorMessage) setErrorMessage(null);
            }}
          >
            <Label className="text-sm font-medium text-(--foreground)">
              Email
            </Label>
            <Input placeholder="nama@contoh.com" />
            <FieldError className="text-xs" />
          </TextField>

          {/* Password */}
          <TextField
            isRequired
            className="w-full"
            name="password"
            type={isPasswordVisible ? "text" : "password"}
            value={values.password}
            onChange={(v) => {
              setValues((prev) => ({ ...prev, password: v }));
              if (errorMessage) setErrorMessage(null);
            }}
          >
            <Label className="text-sm font-medium text-(--foreground)">
              Password
            </Label>
            <InputGroup>
              <InputGroup.Input placeholder="Masukkan password" />
              <InputGroup.Suffix>
                <button
                  aria-label={
                    isPasswordVisible ? "Hide password" : "Show password"
                  }
                  className="px-1 text-muted hover:text-(--foreground) transition-colors focus:outline-none"
                  type="button"
                  onClick={() => setIsPasswordVisible((v) => !v)}
                >
                  {isPasswordVisible ? (
                    <EyeIcon className="w-4 h-4" />
                  ) : (
                    <EyeSlashIcon className="w-4 h-4" />
                  )}
                </button>
              </InputGroup.Suffix>
            </InputGroup>
            <FieldError className="text-xs" />
          </TextField>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between">
            <Checkbox
              isSelected={values.remember}
              onChange={(checked) =>
                setValues((prev) => ({ ...prev, remember: checked }))
              }
            >
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Content>
                <Label className="text-sm text-(--foreground)">
                  Ingat saya
                </Label>
              </Checkbox.Content>
            </Checkbox>

            <Link
              href="/forgot-password"
              className="text-sm font-medium"
              style={{ color: "oklch(54% 0.23 274)" }}
            >
              Lupa password?
            </Link>
          </div>

          {/* Submit */}
          <Button
            className="w-full mt-1 font-semibold text-white"
            style={{ background: "oklch(54% 0.23 274)" }}
            isDisabled={isPending}
            type="submit"
            isPending={isPending}
          >
            {isPending ? (
              <>
                <Spinner size="sm" />
                Memproses…
              </>
            ) : (
              "Masuk"
            )}
          </Button>
        </Form>
      </Card.Content>
    </Card>
  );
};
