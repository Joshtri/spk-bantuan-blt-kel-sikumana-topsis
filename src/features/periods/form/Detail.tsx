import DateRangePickerInput from "@/components/inputs/DateRangePickerInput";
import { TimeInput } from "@/components/inputs/TimeInput";
import SwitchInput from "@/components/inputs/SwitchInput";
import { TextAreaInput } from "@/components/inputs/TextAreaInput";
import { TextInput } from "@/components/inputs/TextInput";

export default function DetailPeriod() {
  return (
    <div className="flex flex-col gap-4">
      <TextInput fieldName="name" fieldLabel="Nama Periode" isRequired />
      <TextAreaInput fieldName="description" fieldLabel="Deskripsi" />

      {/* DateRange — hanya date, tanpa time */}
      <DateRangePickerInput
        fieldName="dateRange"
        fieldLabel="Periode Tanggal"
        isRequired
      />

      {/* Time terpisah */}
      <div className="grid grid-cols-2 gap-4">
        <TimeInput fieldName="startTime" label="Waktu Mulai" isRequired />
        <TimeInput fieldName="endTime" label="Waktu Selesai" isRequired />
      </div>

      <SwitchInput fieldName="isActive" fieldLabel="Status" />
    </div>
  );
}
