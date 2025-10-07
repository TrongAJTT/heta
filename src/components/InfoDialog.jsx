import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";

const InfoDialog = ({
  open,
  onClose,
  title,
  description,
  features = [],
  howToUse = [],
  additionalFeatures = [],
  note = null,
  noteSeverity = "info",
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {description && (
          <Typography variant="body2" paragraph>
            {description}
          </Typography>
        )}

        {features.length > 0 && (
          <>
            <Typography variant="body2" paragraph>
              <strong>This is useful for:</strong>
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </Box>
          </>
        )}

        {howToUse.length > 0 && (
          <>
            <Typography variant="body2" paragraph>
              <strong>How to use:</strong>
            </Typography>
            <Box component="ol" sx={{ pl: 2, mb: 2 }}>
              {howToUse.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </Box>
          </>
        )}

        {additionalFeatures.length > 0 && (
          <>
            <Typography variant="body2" paragraph>
              <strong>Features:</strong>
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              {additionalFeatures.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </Box>
          </>
        )}

        {note && (
          <Alert severity={noteSeverity} sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Note:</strong> {note}
            </Typography>
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoDialog;
