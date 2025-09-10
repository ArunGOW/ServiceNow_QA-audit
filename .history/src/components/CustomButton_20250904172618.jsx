// src/components/CustomButton.jsx
import React from "react";
import { Button } from "react-bootstrap";

const CustomButton = ({ 
  children, 
  variant = "primary", 
  onClick, 
  className = "", 
  disabled = false 
}) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={`fw-semibold ${className}`}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
