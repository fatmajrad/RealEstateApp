import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 2,
        px: 20,
        bgcolor: "#fff",
        boxShadow: "#333",
        color: "#fff",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <img
          src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
          alt="logo"
          className="h-9 cursor-pointer"
        />
      </Box>
      <Typography variant="body2" color="#333" sx={{ textAlign: "right" }}>
        &copy; {new Date().getFullYear()} Realtor. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
