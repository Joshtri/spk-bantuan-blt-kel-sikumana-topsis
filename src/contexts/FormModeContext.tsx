import { createContext, useContext } from "react";

interface FormModeContextValue {
  isShow: boolean;
}

const FormModeContext = createContext<FormModeContextValue>({ isShow: false });

export const FormModeProvider = FormModeContext.Provider;

export function useFormMode(): FormModeContextValue {
  return useContext(FormModeContext);
}
