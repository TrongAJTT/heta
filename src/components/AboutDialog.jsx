import React from "react";
import pkg from "../../package.json";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Divider,
  Link,
  IconButton,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GitHubIcon from "@mui/icons-material/GitHub";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CoffeeIcon from "@mui/icons-material/LocalCafe";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CodeIcon from "@mui/icons-material/Code";

/**
 * About Dialog Component
 * Shows extension information and donation links
 */
const AboutDialog = ({ open, onClose }) => {
  const extensionInfo = {
    name: pkg.name || "Heta - Tab Helper",
    version: pkg.version || "0.0.0",
    description:
      pkg.description ||
      "Browser extension for batch URL generation and management with profiles",
    author:
      (typeof pkg.author === "string" ? pkg.author : pkg.author?.name) ||
      "Unknown",
    license: pkg.license || "UNLICENSED",
  };

  const links = {
    github: "https://github.com/TrongAJTT/heta",
    githubSponsors: "https://github.com/sponsors/TrongAJTT",
    buyMeACoffee: "https://buymeacoffee.com/trongajtt",
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        },
      }}
    >
      {/* Header with gradient */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          color: "white",
          p: 3,
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
          }}
          size="small"
        >
          <CloseIcon />
        </IconButton>

        <Stack direction="row" spacing={2} alignItems="center">
          <img src="/icon48.png" alt="Heta" style={{ width: 48, height: 48 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {extensionInfo.name}
            </Typography>
            <Chip
              label={`v${extensionInfo.version}`}
              size="small"
              sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
            />
          </Box>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          {/* Description */}
          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 0.5 }}
            >
              <InfoOutlinedIcon color="primary" />
              <Typography variant="subtitle1" fontWeight={600}>
                About
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {extensionInfo.description}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              Author: {extensionInfo.author} • License: {extensionInfo.license}
            </Typography>
          </Box>

          <Divider />

          {/* Links */}
          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 0.5 }}
            >
              <CodeIcon color="primary" />
              <Typography variant="subtitle1" fontWeight={600}>
                Links
              </Typography>
            </Stack>
            <Link
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                textDecoration: "none",
                color: "primary.main",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              <GitHubIcon />
              <Typography variant="body2">View on GitHub</Typography>
            </Link>
          </Box>

          <Divider />

          {/* Donate */}
          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 0.5 }}
            >
              <FavoriteIcon sx={{ color: "#e91e63" }} />
              <Typography variant="subtitle1" fontWeight={600}>
                Support Development
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              If you find this extension helpful, consider supporting its
              development!
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<GitHubIcon />}
                href={links.githubSponsors}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  flex: 1,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5568d3 0%, #653a8a 100%)",
                  },
                }}
              >
                Sponsor
              </Button>
              <Button
                variant="contained"
                startIcon={<CoffeeIcon />}
                href={links.buyMeACoffee}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  flex: 1,
                  bgcolor: "#FFDD00",
                  color: "#000",
                  "&:hover": {
                    bgcolor: "#FFCC00",
                  },
                }}
              >
                Buy Coffee
              </Button>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AboutDialog;
