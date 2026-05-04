import {
  createContext,
  useContext,
  type ReactNode,
  type HTMLAttributes,
} from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type EmptyStateSize = "sm" | "md" | "lg";

type SizeConfig = {
  wrapper: string;
  header: string;
  media: string;
  title: string;
  description: string;
  content: string;
};

type EmptyStateContextType = {
  sizes: SizeConfig;
};

type BaseProps<T = HTMLDivElement> = HTMLAttributes<T> & {
  className?: string;
  children?: ReactNode;
};

// ─── Context ────────────────────────────────────────────────────────────────

const EmptyStateContext = createContext<EmptyStateContextType | null>(null);

const useEmptyState = () => {
  const context = useContext(EmptyStateContext);

  if (!context) {
    throw new Error(
      "EmptyState components must be used within <EmptyState />"
    );
  }

  return context;
};

// ─── Size config ────────────────────────────────────────────────────────────

const sizeMap: Record<EmptyStateSize, SizeConfig> = {
  sm: {
    wrapper: "py-6 px-4 gap-3",
    header: "gap-2",
    media: "w-10 h-10 text-xl",
    title: "text-sm font-medium",
    description: "text-xs",
    content: "gap-2 mt-1",
  },
  md: {
    wrapper: "py-10 px-6 gap-4",
    header: "gap-3",
    media: "w-14 h-14 text-2xl",
    title: "text-base font-medium",
    description: "text-sm",
    content: "gap-2 mt-2",
  },
  lg: {
    wrapper: "py-16 px-8 gap-5",
    header: "gap-4",
    media: "w-20 h-20 text-4xl",
    title: "text-xl font-medium",
    description: "text-base",
    content: "gap-3 mt-3",
  },
};

// ─── Root ────────────────────────────────────────────────────────────────────

interface EmptyStateProps extends BaseProps {
  size?: EmptyStateSize;
}

interface EmptyStateComponent
  extends React.FC<EmptyStateProps> {
  Header: React.FC<BaseProps>;
  Media: React.FC<MediaProps>;
  Title: React.FC<BaseProps<HTMLHeadingElement>>;
  Description: React.FC<BaseProps<HTMLParagraphElement>>;
  Content: React.FC<BaseProps>;
}

const EmptyState: EmptyStateComponent = ({
  size = "md",
  className = "",
  children,
  ...props
}) => {
  const sizes = sizeMap[size] ?? sizeMap.md;

  return (
    <EmptyStateContext.Provider value={{ sizes }}>
      <div
        className={[
          "flex flex-col items-center justify-center text-center",
          sizes.wrapper,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </div>
    </EmptyStateContext.Provider>
  );
};

// ─── Header ──────────────────────────────────────────────────────────────────

const Header: React.FC<BaseProps> = ({
  className = "",
  children,
  ...props
}) => {
  const { sizes } = useEmptyState();

  return (
    <div
      className={["flex flex-col items-center", sizes.header, className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
};

// ─── Media ───────────────────────────────────────────────────────────────────

interface MediaProps extends BaseProps {
  variant?: "default" | "icon";
}

const Media: React.FC<MediaProps> = ({
  variant = "default",
  className = "",
  children,
  ...props
}) => {
  const { sizes } = useEmptyState();
  const isIcon = variant === "icon";

  return (
    <div
      data-variant={variant}
      className={[
        "flex items-center justify-center",
        sizes.media,
        isIcon ? "rounded-full bg-default-100 text-default-500" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
};

// ─── Title ───────────────────────────────────────────────────────────────────

const Title: React.FC<BaseProps<HTMLHeadingElement>> = ({
  className = "",
  children,
  ...props
}) => {
  const { sizes } = useEmptyState();

  return (
    <h3
      className={["text-foreground", sizes.title, className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </h3>
  );
};

// ─── Description ─────────────────────────────────────────────────────────────

const Description: React.FC<BaseProps<HTMLParagraphElement>> = ({
  className = "",
  children,
  ...props
}) => {
  const { sizes } = useEmptyState();

  return (
    <p
      className={["text-default-500 max-w-xs", sizes.description, className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </p>
  );
};

// ─── Content ─────────────────────────────────────────────────────────────────

const Content: React.FC<BaseProps> = ({
  className = "",
  children,
  ...props
}) => {
  const { sizes } = useEmptyState();

  return (
    <div
      className={[
        "flex flex-wrap items-center justify-center",
        sizes.content,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
};

// ─── Attach sub-components ───────────────────────────────────────────────────

EmptyState.Header = Header;
EmptyState.Media = Media;
EmptyState.Title = Title;
EmptyState.Description = Description;
EmptyState.Content = Content;

export default EmptyState;