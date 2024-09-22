import React, { useRef, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";
import bgImage from "../assets/img/contact-us.jpg";
import emailjs from "@emailjs/browser";
import { Formik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";

const ContactUs = () => {
  const form = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const contactSchema = yup.object().shape({
    name: yup.string().required("This field is required"),
    subject: yup.string().required("This field is required"),
    email: yup
      .string()
      .email("Invalid email")
      .required("This field is required"),
    message: yup
      .string()
      .required("This field is required")
      .min(10, "The message should be at least 10 characters"),
  });

  const handleFormSubmit = (values, { resetForm }) => {
    setIsLoading(true);
    emailjs
      .sendForm("service_8t3apbr", "template_9ggiqsa", form.current, {
      publicKey: "MWJI-jZuS3mU5egMn",
      })
      .then(() => {
        toast.success(
          "Your email has been sent successfully. We will respond to you as soon as possible."
        );
        resetForm();
      })
      .catch((error) => {
        toast.error(error.text);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Box component="section" py={{ xs: 0, lg: 6, backgroundColor: "#f5f5f5" }}>
      <Container>
        <Grid container spacing={2}>
          {/* Left Side: Contact Information */}
          <Grid
            item
            xs={12}
            lg={5}
            position="relative"
            px={0}
            sx={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              height="100%"
              p={6}
            >
              <Box textAlign="center" color="white" mx="auto">
                <Typography variant="h3" mb={1}>
                  Contact Information
                </Typography>
                <Typography variant="body2" opacity={0.8} mb={3}>
                  Fill up the form and our Team will get back to you within 24
                  hours.
                </Typography>
                <Box
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                  mb={3}
                >
                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="button">
                      <i className="fas fa-phone" />
                    </Typography>
                    <Typography variant="button" ml={2} opacity={0.8}>
                      Phone: (+216) 72 100 200
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="button">
                      <i className="fas fa-envelope" />
                    </Typography>
                    <Typography variant="button" ml={2} opacity={0.8}>
                      E-mail: realtor@esprit.tn
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Typography variant="button">
                      <i className="fas fa-map-marker-alt" />
                    </Typography>
                    <Typography variant="button" ml={2} opacity={0.8}>
                      Address: 1, 2 rue André Ampère - 2083 - Pôle Technologique
                      - El Ghazala.
                    </Typography>
                  </Box>
                </Box>
                <Box mt={3}>
                  <Button
                    variant="text"
                    color="inherit"
                    size="large"
                    startIcon={<Facebook />}
                  >
                    Facebook
                  </Button>
                  <Button
                    variant="text"
                    color="inherit"
                    size="large"
                    startIcon={<Twitter />}
                  >
                    Twitter
                  </Button>
                  <Button
                    variant="text"
                    color="inherit"
                    size="large"
                    startIcon={<Instagram />}
                  >
                    Instagram
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Side: Contact Form */}
          <Grid item xs={12} lg={7}>
            <Formik
              initialValues={{ name: "", subject: "", email: "", message: "" }}
              validationSchema={contactSchema}
              onSubmit={handleFormSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                isValid,
                dirty,
              }) => (
                <Box component="form" ref={form} onSubmit={handleSubmit} p={2}>
                  <Box px={3} py={{ xs: 2, sm: 6 }}>
                    <Typography variant="h2" mb={1}>
                      Say Hi!
                    </Typography>
                    <Typography variant="body1" mb={2}>
                      We&apos;d like to talk with you.
                    </Typography>
                  </Box>
                  <Box pt={0.5} pb={3} px={3}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} mb={3}>
                        <TextField
                          name="name"
                          variant="standard"
                          label="My name is"
                          placeholder="Full Name"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.name && Boolean(errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </Grid>
                      <Grid item xs={12} mb={3}>
                        <TextField
                          name="subject"
                          variant="standard"
                          label="I'm looking for"
                          placeholder="What you love"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          value={values.subject}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.subject && Boolean(errors.subject)}
                          helperText={touched.subject && errors.subject}
                        />
                      </Grid>
                      <Grid item xs={12} mb={3}>
                        <TextField
                          name="email"
                          variant="standard"
                          label="Your email"
                          placeholder="Your email address"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Grid>
                      <Grid item xs={12} mb={3}>
                        <TextField
                          name="message"
                          variant="standard"
                          label="Your message"
                          placeholder="I want to say that..."
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          multiline
                          rows={6}
                          value={values.message}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.message && Boolean(errors.message)}
                          helperText={touched.message && errors.message}
                        />
                      </Grid>
                    </Grid>
                    <Grid container justifyContent="flex-end" textAlign="right">
                      <Button
                        disabled={isLoading || !isValid || !dirty}
                        variant="contained"
                        color="info"
                        type="submit"
                      >
                        {isLoading ? "Sending..." : "Send Message"}
                      </Button>
                    </Grid>
                  </Box>
                </Box>
              )}
            </Formik>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactUs;
