import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackProps {
  onClick: () => void;
}

function Back({ onClick }: BackProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="flex bg-white items-center space-x-2 transition-transform transform hover:-translate-x-1 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 px-4 py-2 rounded-lg shadow-sm"
    >
      <ArrowLeft className="w-5 h-5 text-blue-600 transition-colors duration-300 group-hover:text-blue-800" />
      <span className="text-blue-600 transition-colors duration-300 group-hover:text-blue-800">
        Back
      </span>
    </Button>
  );
}

export default Back;
