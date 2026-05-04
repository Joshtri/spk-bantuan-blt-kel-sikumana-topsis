import { AutoCompleteInput } from "@/components/inputs/AutoCompleteInput";
import { TextInput } from "@/components/inputs/TextInput";
import { useParsed } from "@refinedev/core";
import React from "react";
import { roleOptions } from "../options";
import { useCandidatesOptions } from "../useCandidatesOptions";
import { PhoneNumberInput } from "@/components/inputs/PhoneNumberInput";

export default function DetailUser() {
  const { id } = useParsed();
  const isEdit = !!id;

  const { isLoading, options: candidatesOptions } = useCandidatesOptions();

  return (
    <>
      <AutoCompleteInput
        fieldName="candidateRecipientId"
        fieldLabel="Calon Penerima Bantuan"
        options={candidatesOptions}
        isDisabled={isLoading}
      />
      <TextInput fieldName={"username"} isRequired />
      <TextInput fieldName={"email"} isRequired isEmail />
      <TextInput
        fieldName={"password"}
        isPassword
        isRequired={!isEdit}
        description={
          isEdit ? "Leave empty if you don't want to change the password" : ""
        }
      />
      {/* <PhoneNumberInput
        isRequired
        fieldName={"phoneNumber"}
        fieldLabel="Nomor HP / Whats App"
      />{" "} */}
      <AutoCompleteInput options={roleOptions} fieldName={"role"} isRequired />
    </>
  );
}
