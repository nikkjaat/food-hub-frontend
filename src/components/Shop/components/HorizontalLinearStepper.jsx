import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";

const steps = ["Preparing", "Out for delivery", "Delivered"];
const stepColors = ["white", "blue", "green"]; // Define colors for each step

export default function HorizontalLinearAlternativeLabelStepper() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        padding: "0px",
        background: "",
      }}
    >
      <Stepper
        activeStep={1}
        alternativeLabel
        sx={{
          padding: "4px",
          minHeight: "50px", // Default height
          "@media (max-width: 872px)": {
            minHeight: "30px",
            padding: "0px",
            mb: "-0.5em", // Reduce bottom margin of stepper
          },
        }}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              sx={{
                margin: 0, // Remove extra spacing
                padding: 0,
                "@media (max-width: 872px)": {
                  marginBottom: "-0.5em", // Reduce space on small screens
                  ml: "-2em",
                },
              }}
            >
              <Typography
                sx={{
                  color: stepColors[index],
                  fontSize: "14px",
                  marginTop: "-0.3em", // Reduce space between step and label
                  "@media (max-width: 872px)": {
                    fontSize: "8px",
                    marginTop: "-0.4em", // Reduce space even more on small screens
                  },
                }}
              >
                {label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
