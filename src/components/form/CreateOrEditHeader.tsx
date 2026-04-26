import { Button } from "@heroui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Heading } from "../heading";

interface CreateOrEditHeaderProps {
  title: string;
  withBackButton?: boolean;
  onBack: () => void;
}

export function CreateOrEditHeader({
  title,
  withBackButton = true,
  onBack,
}: CreateOrEditHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      {withBackButton && (
        <Button
          isIconOnly
          variant="outline"
          size="sm"
          onPress={onBack}
          className="h-8 w-8 shrink-0 rounded-lg border-default-200 text-default-500"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
      )}
      <Heading as="h1" weight="bold" size="xl">
        {title}
      </Heading>
    </div>
  );
}
