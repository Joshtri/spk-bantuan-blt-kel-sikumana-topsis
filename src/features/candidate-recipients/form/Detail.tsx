import { DatePickerInput } from "@/components/inputs/DatePickerInput";
import { RadioInput } from "@/components/inputs/RadioInput";
import { TextInput } from "@/components/inputs/TextInput";
import { genderOptions } from "../options";
import { TextAreaInput } from "@/components/inputs/TextAreaInput";
import { PhoneNumberInput } from "@/components/inputs/PhoneNumberInput";

export default function DetailCandidateRecipient() {
  return (
    <div>
      <TextInput
        fieldName={"nik"}
        fieldLabel="Nomor Induk Kependudukan"
        // validation only allow number and must be 16 digits.
        additionalRules={{
          pattern: {
            value: /^[0-9]{16}$/,
            message: "NIK harus berupa angka dan 16 digit",
          },
        }}
        isRequired
      />
      <TextInput
        fieldName={"recipientName"}
        fieldLabel="Nama Calon Penerima"
        isRequired
      />

      <DatePickerInput
        fieldName={"dateOfBirth"}
        isRequired
        fieldLabel="Tanggal Lahir"
      />

      <RadioInput
        variant="card"
        options={genderOptions}
        fieldName={"gender"}
        isRequired
      />

      <TextAreaInput fieldLabel="Alamat" fieldName={"address"} />

      <PhoneNumberInput
        isRequired
        fieldName={"phoneNumber"}
        fieldLabel="Nomor HP / Whats App"
      />
    </div>
  );
}
