import React from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";

const TabChecklist = ({ tabs, selectedIds, onToggleOne, maxHeight }) => {
  return (
    // Hide horizontal scrollbar with overflowX: "hidden"
    <Box sx={{ ...(maxHeight && { maxHeight }), p: 1, overflowX: "hidden" }}>
      <Stack>
        {tabs.map((t) => (
          <Box sx={{ maxWidth: 600, width: "100%" }}>
            <FormControlLabel
              key={t.id}
              control={
                <Checkbox
                  checked={selectedIds.has(t.id)}
                  onChange={(e) => onToggleOne(t.id, e.target.checked)}
                />
              }
              label={
                <Stack sx={{ width: "100%" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "100%",
                    }}
                  >
                    {t.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "100%",
                    }}
                  >
                    {t.url}
                  </Typography>
                </Stack>
              }
              sx={{ width: "100%", maxWidth: 600 }}
            />
          </Box>
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
