import { Card, Chip, Radio, RadioGroup, cn } from "@heroui/react";
import type { ICriteriaWithScales } from "@/app/pages/list-question/page";

interface QuestionnaireItemProps {
  index: number;
  criteria: ICriteriaWithScales;
  value?: string;
  onChange: (criteriaScaleId: string) => void;
}

export function QuestionnaireItem({
  index,
  criteria,
  value,
  onChange,
}: QuestionnaireItemProps) {
  const isAnswered = !!value;

  return (
    <Card
      className={cn(
        "border transition-all",
        isAnswered
          ? "border-success-200 shadow-sm"
          : "border-default-200 shadow-sm hover:shadow-md",
      )}
    >
      <Card.Content className="p-4 sm:p-6">
        <div className="flex gap-4">
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
              isAnswered
                ? "bg-success-100 text-success-700"
                : "bg-primary-100 text-primary-600",
            )}
          >
            {index}
          </span>

          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Chip size="sm" variant="soft" color="accent">
                  {criteria.code}
                </Chip>
                <span className="text-xs text-default-400">
                  Bobot: {criteria.weight}
                </span>
              </div>
              <h4 className="text-base font-semibold text-default-900 sm:text-lg">
                {criteria.name}
              </h4>
              <p className="text-sm text-default-500">
                Pilih opsi yang paling sesuai dengan kondisi calon penerima.
              </p>
            </div>

            <RadioGroup
              orientation="horizontal"
              value={value ?? null}
              onChange={(val) => onChange(val as string)}
              aria-label={`Jawaban untuk ${criteria.name}`}
              className="gap-3"
            >
              <div className="grid w-full gap-3 sm:grid-cols-2">
                {criteria.scales
                  .slice()
                  .sort((a, b) => a.scaleValue - b.scaleValue)
                  .map((scale) => (
                    <Radio
                      key={scale.id}
                      value={scale.id}
                      className={cn(
                        "group relative flex cursor-pointer rounded-xl border border-default-200 bg-white px-4 py-3.5",
                        "transition-all duration-150",
                        "hover:border-primary/50 hover:bg-primary/5",
                        "data-[selected=true]:border-primary data-[selected=true]:bg-primary/10",
                        "data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-primary/30",
                      )}
                    >
                      <Radio.Control className="absolute right-3 top-3 h-4 w-4 shrink-0">
                        <Radio.Indicator />
                      </Radio.Control>

                      <Radio.Content className="flex flex-1 items-start gap-3 pr-6">
                        <span
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                            "bg-default-100 text-default-700",
                            "group-data-[selected=true]:bg-primary group-data-[selected=true]:text-white",
                          )}
                        >
                          {scale.scaleValue}
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold text-default-800 group-data-[selected=true]:text-primary">
                            {scale.category}
                          </span>
                          {scale.description && (
                            <span className="text-xs text-default-500">
                              {scale.description}
                            </span>
                          )}
                        </div>
                      </Radio.Content>
                    </Radio>
                  ))}
              </div>
            </RadioGroup>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
