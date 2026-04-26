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
