import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ColorfulButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const ColorfulButton: React.FC<ColorfulButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  className,
  disabled,
}) => (
  <Button
    variant="outline"
    className={`w-full bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white border-none ${
      disabled ? "opacity-70 cursor-not-allowed" : ""
    } ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    <Icon className="mr-2 h-4 w-4" />
    {label}
  </Button>
);

export default ColorfulButton;
