import React, { useState, useEffect } from "react";
import { Alert, Box, LinearProgress } from "@mui/material";

const ToastWithProgress = ({
  open,
  onClose,
  message,
  severity = "success",
  duration = 5000,
  position = "bottom",
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!open) {
      setProgress(100);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      const progressPercent = (remaining / duration) * 100;

      setProgress(progressPercent);

      if (remaining <= 0) {
        clearInterval(interval);
        onClose();
      }
    }, 50); // Update every 50ms for smooth animation

    return () => clearInterval(interval);
  }, [open, duration, onClose]);

  if (!open) return null;

  const positionStyles = {
    bottom: {
      position: "fixed",
      bottom: 16,
      left: 16,
      right: 16,
    },
    top: {
      position: "fixed",
      top: 16,
      left: 16,
      right: 16,
    },
  };

  return (
    <Box
      sx={{
        ...positionStyles[position],
        zIndex: 1000,
        maxWidth: "calc(100% - 32px)",
      }}
    >
      <Alert
        severity={severity}
        onClose={onClose}
        sx={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        {message}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            overflow: "hidden",
          }}
        >
          <LinearProgress
            variant="determinate"
            value={100 - progress}
            sx={{
              height: "100%",
              backgroundColor: "transparent",
              "& .MuiLinearProgress-bar": {
                backgroundColor:
                  severity === "success"
                    ? "success.main"
                    : severity === "error"
                    ? "error.main"
                    : severity === "warning"
                    ? "warning.main"
                    : severity === "info"
                    ? "info.main"
                    : "primary.main",
                transition: "none", // Disable default transition for smooth countdown
              },
            }}
          />
        </Box>
      </Alert>
    </Box>
  );
};

export default ToastWithProgress;
