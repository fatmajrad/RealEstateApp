import React from "react";
import { Box, Typography, Rating } from "@mui/material";

const DefaultCounterCard = ({
  count,
  description,
  stars,
  time,
  person,
  ...rest
}) => {
  return (
    <Box
      p={4}
      textAlign="center"
      sx={{
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        boxShadow: 2,
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: 4,
        },
      }}
      {...rest}
    >
      {person && (
        <Typography variant="h5" mt={2} mb={1} fontWeight="bold">
          {person}
        </Typography>
      )}
      {description && (
        <Typography variant="body2" color="text.secondary" mb={2}>
          {description}
        </Typography>
      )}
      {stars && (
        <Box sx={{ mb: 2 }}>
          <Rating value={stars} readOnly precision={0.5} />
        </Box>
      )}
      {time && (
        <Typography variant="body2" color="text.secondary" mb={2}>
          {time}
        </Typography>
      )}
    </Box>
  );
};

export default DefaultCounterCard;
