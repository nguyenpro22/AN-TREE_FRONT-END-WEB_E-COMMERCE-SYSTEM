import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ColorfulButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  iconClassName?: string;
}

const ColorfulButton: React.FC<ColorfulButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  className,
  disabled,
  iconClassName,
}) => (
  <Button
    variant="outline"
    className={`w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white border-none ${
      disabled ? "opacity-70 cursor-not-allowed" : ""
    } ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    <Icon className={`mr-2 h-4 w-4 ${iconClassName}`} />
    {label}
  </Button>
);

export default ColorfulButton;
