// // src/components/CustomButton.jsx
// import React from "react";
// import { Button } from "react-bootstrap";

// const CustomButton = ({ 
//   children, 
//   variant = "primary", 
//   onClick, 
//   className = "", 
//   disabled = false 
// }) => {
//   return (
//     <Button
//       variant={variant}
//       onClick={onClick}
//       disabled={disabled}
//       className={`fw-semibold ${className}`}
//     >
//       {children}
//     </Button>
//   );
// };

// export default CustomButton;


import React from "react";
import { Button } from "react-bootstrap";

const CustomButton = ({ children, variant = "primary", className = "", ...rest }) => {
  return (
    <Button
      variant={variant}
      className={`rounded-3 px-3 py-2 shadow-sm ${className}`}
      {...rest}   
    >
      {children}
    </Button>
  );
};

export default CustomButton;
