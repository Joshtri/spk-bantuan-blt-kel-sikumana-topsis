import { Card, Link, Separator } from "@heroui/react";
import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: ReactNode;
  bgColor: string;
  textColor: string;
  delay?: number;
  href?: string;
}

export default function StatCard({
  title,
  value,
  change,
  icon,
  bgColor,
  textColor,
  href,
  delay = 0,
}: StatCardProps) {
  return (
    <Card className="stat-card-enter" variant="secondary"   style={{ animationDelay: `${delay}s` }}>
      <Card.Content className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${bgColor} ${textColor}`}>{icon}</div>
          {change && (
            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-400/10 px-2 py-1 rounded-lg">
              {change}
            </span>
          )}
        </div>
        <Text size="lg" color="muted" weight="medium" className="mb-1">
          {title}
        </Text>
        <Heading
          as="h3"
          size="3xl"
          weight="bold"
          className="text-gray-900 dark:text-white"
        >
          {value}
        </Heading>

        {href && (
          <>
            <Separator variant="default" className="my-4" />
            {/* <div className="my-4 border-t border-gray-100 dark:border-gray-800" /> */}
            <div className="ms-auto">
              <Link
                href={href}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
              >
                View details
                <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </>
        )}
      </Card.Content>
    </Card>
  );
}
