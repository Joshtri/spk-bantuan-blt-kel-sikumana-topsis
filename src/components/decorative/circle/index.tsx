import { DecorativeCircleProps, DecorativeCirclesProps } from "./interfaces";

export const DecorativeCircle = ({
  className,
  style,
}: DecorativeCircleProps) => (
  <div
    aria-hidden="true"
    className={`absolute rounded-full pointer-events-none ${className}`}
    style={style}
  />
);

export const DecorativeCircles = ({ colors }: DecorativeCirclesProps) => (
  <>
    <DecorativeCircle
      className="-top-24 -right-24 w-96 h-96 opacity-20"
      style={{ background: colors.circleTop }}
    />
    <DecorativeCircle
      className="-bottom-32 -left-16 w-80 h-80 opacity-15"
      style={{ background: colors.circleBottom }}
    />
    <DecorativeCircle
      className="top-1/2 right-8 w-48 h-48 opacity-10"
      style={{ background: colors.circleRight }}
    />
  </>
);
