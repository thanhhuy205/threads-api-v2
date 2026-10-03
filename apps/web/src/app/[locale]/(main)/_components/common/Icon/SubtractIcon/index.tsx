type SubtractIconProps = {
  size?: number | string;
  color?: string;
  className?: string;
  active?: boolean;
};

const SubtractIcon = ({
  size = 24,
  color = "currentColor",
  className,
  active = false,
}: SubtractIconProps) => {
  return (
    <svg
      aria-label="Tạo"
      role="img"
      viewBox="0 0 12 12"
      width={size}
      height={size}
      className={className}
      fill={active ? color : "none"}
      stroke={active ? color : "#ccc"}
    >
      <title>Tạo</title>
      <path d="M6 2v8m4-4H2" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

export default SubtractIcon;
