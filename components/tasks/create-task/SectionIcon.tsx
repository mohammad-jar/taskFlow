import React from "react";

type SectionIconProps = {
  children: React.ReactNode;
  bgClassName: string;
  iconClassName: string;
};

const SectionIcon = ({
  children,
  bgClassName,
  iconClassName,
}: SectionIconProps) => {
  return (
    <div
      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${bgClassName} ${iconClassName}`}
    >
      {children}
    </div>
  );
};

export default SectionIcon;