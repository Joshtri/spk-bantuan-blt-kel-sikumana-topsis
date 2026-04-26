import { DatePickerInput } from "@/components/inputs/DatePickerInput";
import SwitchInput from "@/components/inputs/SwitchInput";
import { TextAreaInput } from "@/components/inputs/TextAreaInput";
import { TextInput } from "@/components/inputs/TextInput";

export default function DetailPeriod() {
  return (
    <div>
      <TextInput fieldName={"name"} fieldLabel="Nama Periode" isRequired />

      <TextAreaInput fieldName={"description"} fieldLabel="Deskripsi" />
      <DatePickerInput
        fieldName={"startDate"}
        fieldLabel="Tanggal Mulai"
        isRequired
      />
      <DatePickerInput
        fieldName={"endDate"}
        fieldLabel="Tanggal Selesai"
        isRequired
      />

      <SwitchInput fieldName={"isActive"} fieldLabel="Status" />
    </div>
  );
}
