import React from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";

const TabChecklist = ({ tabs, selectedIds, onToggleOne, maxHeight = 150 }) => {
  return (
    <Box sx={{ maxHeight, overflow: "auto", p: 1 }}>
      <Stack>
        {tabs.map((t) => (
          <FormControlLabel
            key={t.id}
            control={
              <Checkbox
                checked={selectedIds.has(t.id)}
                onChange={(e) => onToggleOne(t.id, e.target.checked)}
              />
            }
            label={
              <Stack>
                <Typography variant="body2">{t.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {t.url}
                </Typography>
              </Stack>
            }
          />
        ))}
        {tabs.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center">
            No tabs found.
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default TabChecklist;
