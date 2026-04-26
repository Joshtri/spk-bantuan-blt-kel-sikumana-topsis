import { BaseRecord, CreateResponse, UpdateResponse } from '@refinedev/core';
import { PropsWithChildren } from 'react';
import { cn, Form } from '@heroui/react';
import { FormMethods } from '@/interfaces/common';
import { FieldValues, FormProvider } from 'react-hook-form';

export interface FormWrapperProps<
  TFieldValues extends FieldValues = FieldValues,
> extends PropsWithChildren {
  className?: string;
  methods: FormMethods<TFieldValues>;
  submitHandler?: (
    data: TFieldValues
  ) => Promise<void | UpdateResponse<BaseRecord> | CreateResponse<BaseRecord>>;
}
export const FormWrapper = <T extends FieldValues>({
  methods,
  submitHandler,
  children,
  className,
}: FormWrapperProps<T>) => {
  // Check if it's a Refine form (has refineCore property) or regular react-hook-form
  const _isRefineForm = 'refineCore' in methods;

  return (
    <FormProvider {...methods}>
      <Form
        className={cn(
          'relative w-full',
          // Mobile-first responsive container with more granular breakpoints

          // Ensure proper overflow handling on mobile
          'max-w-full overflow-x-hidden',
          // Small screen specific adjustments
          'min-w-0 flex-1',
          // Force box-sizing for all elements
          '*:box-border',
          className
        )}
        onSubmit={methods.handleSubmit(async (data) => {
          if (submitHandler) {
            await submitHandler(data);
          }
        })}
      >
        {children}
      </Form>
    </FormProvider>
  );
};
