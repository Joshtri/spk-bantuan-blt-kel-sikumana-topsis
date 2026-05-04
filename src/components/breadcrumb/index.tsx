import { useBreadcrumb } from "@refinedev/core";
import { Breadcrumbs } from "@heroui/react";

export const Breadcrumb = () => {
  const { breadcrumbs } = useBreadcrumb();

  if (breadcrumbs.length <= 1) return null;

  return (
    // Wrapper pill — background + border agar tidak polosan
    <div className="inline-flex items-center rounded-xl bg-default-100 border border-default-200 px-2 py-0 mb-3">
      <Breadcrumbs
        // Separator warna lebih soft
        className="[&_.breadcrumbs__separator]:text-default-400"
      >
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <Breadcrumbs.Item
              key={`breadcrumb-${breadcrumb.label}`}
              // Item terakhir tidak diberi href → otomatis jadi current (data-current="true")
              href={isLast ? undefined : breadcrumb.href}
              className={
                isLast
                  ? // Current page: pill highlight dengan warna primary
                    "[&.breadcrumbs__link]:bg-primary/10 [&.breadcrumbs__link]:text-primary [&.breadcrumbs__link]:font-semibold [&.breadcrumbs__link]:px-2.5 [&.breadcrumbs__link]:py-0.5 [&.breadcrumbs__link]:rounded-lg"
                  : // Parent pages: muted, hover underline
                    "[&.breadcrumbs__link]:text-default-500 [&.breadcrumbs__link]:hover:text-default-800 [&.breadcrumbs__link]:transition-colors"
              }
            >
              {breadcrumb.label}
            </Breadcrumbs.Item>
          );
        })}
      </Breadcrumbs>
    </div>
  );
};
