import { Text } from "@/components/text";

export function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <Text as="span" size="xs" muted className="uppercase tracking-wide">
        {label}
      </Text>
      <Text as="span" size="sm" weight="medium">
        {value}
      </Text>
    </div>
  );
}
