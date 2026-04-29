import { Chip } from "@heroui/react";

interface BooleanChipProps {
  value: boolean;
  trueLabel?: string;
  falseLabel?: string;
}

export const BooleanChip = ({
  value,
  trueLabel = "Yes",
  falseLabel = "No",
}: BooleanChipProps) => {
  return (
    <Chip color={value ? "success" : "danger"}>
      {value ? trueLabel : falseLabel}
    </Chip>
  );
};
