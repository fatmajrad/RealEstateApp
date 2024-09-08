import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Divider,
  CardHeader,
  CardContent,
  Card,
} from "@mui/material";
import { Home, CheckCircle, Lightbulb, Star } from "@mui/icons-material";
const values = [
  {
    title: "Integrity",
    description:
      "We operate with transparency and honesty, ensuring our clients can trust us with their most significant investments.",
    icon: <Home sx={{ color: "#d92228", fontSize: 60 }} />,
  },
  {
    title: "Innovation",
    description:
      "We embrace new technologies and ideas, striving to continuously improve our platform and services.",
    icon: <Lightbulb sx={{ color: "#d92228", fontSize: 60 }} />,
  },
  {
    title: "Customer Focus",
    description:
      "Our clients are at the heart of everything we do. We listen to their needs and deliver solutions that exceed their expectations.",
    icon: <CheckCircle sx={{ color: "#d92228", fontSize: 60 }} />,
  },
  {
    title: "Excellence",
    description:
      "We are committed to providing the highest quality of service and expertise, setting the standard for excellence in the real estate industry.",
    icon: <Star sx={{ color: "#d92228", fontSize: 60 }} />,
  },
];
const AboutUs = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: "#f5f5f5" }}>
      <Container>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            About Us
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Welcome to Realtor - Your trusted partner in real estate.
          </Typography>
        </Box>

        {/* Mission and Values Section */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <Typography variant="h4" gutterBottom>
                Our Mission
              </Typography>
              <Typography variant="body1" color="text.secondary">
                At Realtor, we’re redefining the real estate experience with
                innovation and user-centric design. For over 20 years, our team
                has been dedicated to transforming how people buy, sell, and
                manage properties. We combine cutting-edge technology with
                unparalleled expertise to offer a platform that’s intuitive,
                reliable, and tailored to your real estate needs.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <Typography variant="h4" gutterBottom>
                What Sets Us Apart
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Expertise and Experience:</strong> With two decades of
                experience in the real estate industry, our team understands the
                complexities and nuances of the market. We’ve harnessed this
                knowledge to create a platform that addresses real-world needs
                and challenges.
                <br />
                <br />
                <strong>Innovative Technology:</strong> Our platform integrates
                advanced search algorithms, real-time market data, and secure
                transaction processes to deliver a seamless experience. We’re
                committed to continuously evolving our technology to stay ahead
                of industry trends and enhance user satisfaction.
                <br />
                <br />
                <strong>User-Centric Design:</strong> We believe in putting the
                user first. Our app is designed with simplicity and
                functionality in mind, offering intuitive navigation and
                personalized features to ensure a smooth and enjoyable
                experience.
                <br />
                <br />
                <strong>Trusted Support:</strong> Our team of dedicated
                professionals is here to assist you every step of the way.
                Whether you have questions about a property, need help with the
                app, or seek expert advice, we provide reliable support to guide
                you through your real estate journey.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider sx={{ my: 6 }} />

        <Grid container spacing={4}>
          {values.map((value, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <CardHeader
                  title={value.title}
                  subheader={<Box sx={{ fontSize: 40 }}>{value.icon}</Box>}
                  sx={{ paddingBottom: 0 }}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    {value.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutUs;
