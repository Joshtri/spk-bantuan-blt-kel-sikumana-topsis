// InputWrapper.tsx
import React, { ReactElement } from 'react';
import {
  Controller,
  ControllerRenderProps,
  FieldErrors,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form';

export type ControllerChildrenProps = ControllerRenderProps<
  FieldValues,
  string
> & {
  errors: FieldErrors<FieldValues>;
  isLoading: boolean;
};

export interface FormControllerProps {
  fieldLabel?: string;
  fieldName: string;
  additionalRules?: Omit<
    RegisterOptions<FieldValues, string>,
    'disabled' | 'valueAsNumber' | 'valueAsDate'
  >;
  defaultValue?: string | number | boolean | [] | null;
  requiredMessage?: string;
  isRequired: boolean;
  render: (props: ControllerChildrenProps) => ReactElement;
}

const FormController: React.FC<FormControllerProps> = ({
  fieldName,
  defaultValue,
  render,
  isRequired,
  fieldLabel,
  additionalRules,
  requiredMessage,
}) => {
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext();

  return (
    <Controller
      name={fieldName}
      control={control}
      defaultValue={defaultValue}
      rules={{
        required: isRequired
          ? (requiredMessage ?? `${fieldLabel} is required`)
          : false,
        ...(additionalRules ?? {}),
      }}
      render={({ field }) =>
        render({
          ...field,
          errors,
          isLoading: isSubmitting,
        })
      }
    />
  );
};

export default FormController;
