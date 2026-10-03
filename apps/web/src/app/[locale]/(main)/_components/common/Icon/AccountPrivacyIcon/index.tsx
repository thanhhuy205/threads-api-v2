type AccountPrivacyIconProps = {
  size?: number | string;
  color?: string;
  className?: string;
};

const AccountPrivacyIcon = ({
  size = 24,
  color = "currentColor",
  className,
}: AccountPrivacyIconProps) => {
  return (
    <svg
      aria-label="Account Privacy"
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke={color}
    >
      <title>Account Privacy</title>

      <circle
        cx="12.004"
        cy="12.004"
        r="10.5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeMiterlimit="10"
      />

      <path
        d="M18.793 20.014a6.08 6.08 0 0 0-1.778-2.447 3.991 3.991 0 0 0-2.386-.791H9.38a3.994 3.994 0 0 0-2.386.791 6.09 6.09 0 0 0-1.779 2.447"
        strokeWidth="2"
        strokeLinecap="round"
        strokeMiterlimit="10"
      />

      <circle
        cx="12.006"
        cy="9.718"
        r="4.109"
        strokeWidth="2"
        strokeLinecap="round"
        strokeMiterlimit="10"
      />
    </svg>
  );
};

export default AccountPrivacyIcon;
