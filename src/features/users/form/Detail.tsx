import { AutoCompleteInput } from "@/components/inputs/AutoCompleteInput";
import { TextInput } from "@/components/inputs/TextInput";
import { useParsed } from "@refinedev/core";
import React from "react";
import { roleOptions } from "../options";

export default function DetailUser() {
  const { id } = useParsed();
  const isEdit = !!id;

  return (
    <>
      {/* {isEdit && <TextInput fieldName="id" isDisabled />} */}
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
      <TextInput fieldName={"phoneNumber"} fieldLabel="Phone Number" />
      <AutoCompleteInput options={roleOptions} fieldName={"role"} isRequired />
    </>
  );
}
