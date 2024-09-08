import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { useState } from "react";

const InteractiveCard = ({ icon, title, description }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      sx={{
        backgroundColor:"#f5f5f5",
        transform: hovered ? "scale(1.05)" : "scale(1)",
        transition: "transform 0.3s ease-in-out",
        cursor: "pointer",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: hovered ? 6 : 3,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardContent
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {icon}
      </CardContent>
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center" }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InteractiveCard;
