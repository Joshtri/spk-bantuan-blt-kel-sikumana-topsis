import { NumberInput } from "@/components/inputs/NumberInput";
import { RadioInput } from "@/components/inputs/RadioInput";
import { TextInput } from "@/components/inputs/TextInput";
import { optionsCriteriaType } from "../options";
import { useParsed } from "@refinedev/core";

interface ICodePosition {
  code: string;
}

export default function DetailCriteria() {
  const { id } = useParsed();
  const isEdit = !!id;
  // const isEdit =  id;
  return (
    <div>
      <TextInput fieldName={"name"} fieldLabel="Nama Kriteria" isRequired />
      <TextInput
        fieldName={"code"}
        fieldLabel="Kode Kriteria"
        description="example : C1,C2,C5"
        isRequired
        isDisabled={!isEdit}
        // validation only allow C letter.
        additionalRules={{
          pattern: {
            value: /^[C][0-9]+$/,
            message: "Kode kriteria harus diawali dengan huruf C",
          },
        }}
      />
      <NumberInput
        fieldName={"weight"}
        fieldLabel="Bobot Kriteria"
        isRequired
        additionalRules={{
          min: {
            value: 1,
            message: "Bobot kriteria harus lebih besar atau sama dengan 1",
          },
        }}
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
