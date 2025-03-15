import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const steps = ["Preparing", "Out for delivery", "Delivered"];
const stepColors = ["red", "blue", "green"]; // Define colors for each step

export default function VerticalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(3);

  return (
    <Box sx={{ maxWidth: 500 }}>
      <Stepper activeStep={activeStep} orientation="">
        {steps.map((step, index) => (
          <Step key={step}>
            <StepLabel>
              <Typography sx={{ color: stepColors[index] }}>{step}</Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
