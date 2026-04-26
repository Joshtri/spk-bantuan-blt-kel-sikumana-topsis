import { NumberInput } from "@/components/inputs/NumberInput";
import { RadioInput } from "@/components/inputs/RadioInput";
import { TextInput } from "@/components/inputs/TextInput";
import { optionsCriteriaType } from "../options";

export default function DetailCriteria() {
  return (
    <div>
      <TextInput fieldName={"name"} fieldLabel="Nama Kriteria" isRequired />
      <TextInput
        fieldName={"code"}
        fieldLabel="Kode Kriteria"
        description="example : C1,C2,C5"
        isRequired
      />
      <NumberInput
        fieldName={"weight"}
        fieldLabel="Bobot Kriteria"
        isRequired
      />

      <RadioInput
        fieldName="criteriaType"
        fieldLabel="Tipe Kriteria"
        isRequired
        variant="card"
        options={optionsCriteriaType}
        orientation="horizontal"
      />
    </div>
  );
}
