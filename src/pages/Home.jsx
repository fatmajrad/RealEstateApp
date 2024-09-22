import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { db } from "../firebase";
import {
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ArrowForward from "@mui/icons-material/ArrowForward";
import ScheduleIcon from "@mui/icons-material/Schedule";
import InteractiveCard from "../components/InteractiveCard";
import DefaultReviewCard from "../components/DefaultReviewCard";
import geicoImg from "../assets/img/geico-insurance.jpg";
import advisorImg from "../assets/img/home-advisor.png";
import jllImg from "../assets/img/JLL.png";
import wellsFargoImg from "../assets/img/Wells-Fargo.png";
import rocketMortgageImg from "../assets/img/rocket-mortgage.png";
import details from "../assets/img/more-details.jpg";

export default function Home() {
  //////////////////////////RECENT OFFERS/////////////////////////////////////////////////
  const [offerListings, setOfferListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        // get reference
        const listingsRef = collection(db, "listings");
        // create the query
        const q = query(
          listingsRef,
          where("status", "==", "available"),
          orderBy("timestamp", "desc")
        );
        // execute the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOfferListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  
  return (
    <main>
      <Box
        sx={{
          position: "relative",
          backgroundSize: "cover",
          height: "50vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-start",
          "&:hover .textOverlay": {
            opacity: 1,
          },
        }}
      >
        <img
          src={require("../assets/img/background.jpg")}
          alt="Background"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <Typography
          variant="h6"
          sx={{
            position: "absolute",
            bottom: 16,
            left: 16,
            color: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: "20px",
            borderRadius: "8px",
            transition: "opacity 0.3s ease-in-out",
            opacity: 0,
          }}
          className="textOverlay"
        >
          The Future of Real Estate, Today
          <br />
          Simplify Your Search, Amplify Your Choices
        </Typography>
        <IconButton
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "#fff",
            fontSize: 60,
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.1)",
            },
          }}
        >
          <img
            src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
            alt="logo"
            className="h-9 cursor-pointer"
          />
        </IconButton>
      </Box>
      <div className=" min-h-screen">
        <div className="max-w-6xl mx-auto pt-8 space-y-10 px-4">
         
      </div>
        <Box component="section" py={12}>
          <Container>
            <Box
              sx={{
                textAlign: "center",
                margin: "auto",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <Typography
                color="#d92228"
                variant="h3"
                fontWeight="bold"
                gutterBottom
              >
                What is Realtor?
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Realtor allows users to browse properties for rent or sale, make
                appointments, and chat with an AI bot for tailored assistance.
                Property owners or agents can list and manage their properties,
                offering a streamlined experience for both clients and real
                estate professionals. The app helps users easily find the best
                property options and facilitates smooth communication and
                transactions.
              </Typography>
            </Box>
            <Box
              sx={{
                textAlign: "center",
                margin: "auto",
                marginBottom: "20px",
              }}
            >
              <Typography
                color="#d92228"
                variant="h3"
                fontWeight="bold"
                gutterBottom
              >
                Our services
              </Typography>
            </Box>
            <Grid container spacing={5} sx={{ marginBottom: 8 }}>
              <Grid item xs={12} md={4}>
                <InteractiveCard
                  icon={
                    <ApartmentIcon sx={{ color: "#d92228", fontSize: 60 }} />
                  }
                  title="Find Properties"
                  description="Browse through available properties for rent or sale, and find the one that suits your needs."
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <InteractiveCard
                  icon={
                    <ScheduleIcon sx={{ color: "#d92228", fontSize: 60 }} />
                  }
                  title="Make Appointments"
                  description="Schedule appointments with agents easily through the app and get guided tours of the properties."
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <InteractiveCard
                  icon={<ChatIcon sx={{ color: "#d92228", fontSize: 60 }} />}
                  title="Chat with AI"
                  description="Have questions? Chat with our AI assistant to get detailed information about listings."
                />
              </Grid>
            </Grid>
            <Grid
              container
              item
              xs={12}
              lg={6}
              justifyContent="center"
              sx={{ mx: "auto", textAlign: "center" }}
            >
            <Typography
                color="#d92228"
                variant="h3"
                fontWeight="bold"
                gutterBottom
              >
                Our offers
              </Typography>
             {/* Recent Offers Section */}
         
          </Grid>
          {offerListings && offerListings.length > 0 && (
            <div >
              <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                {offerListings.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                  />
                ))}
              </ul>
            </div>
          )}
          <br></br>
          <br></br>
          <br></br>
            <Grid
              container
              item
              xs={12}
              lg={6}
              justifyContent="center"
              sx={{ mx: "auto", textAlign: "center" }}
            >
              <Typography variant="h4">
                Trusted by Real Estate Professionals
              </Typography>
              <Typography variant="h4" color="info" textGradient mb={2}>
                Over 1,000+ satisfied clients
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={2}>
                Real estate agents and clients alike appreciate the exceptional
                performance, smoothness, and quality of our services.
              </Typography>
            </Grid>
            <Grid container spacing={3} sx={{ mt: 4 }}>
              <Grid item xs={12} md={6} lg={4}>
                <DefaultReviewCard
                  person="John Doe"
                  description="This platform has revolutionized how I manage property listings. It's intuitive and incredibly effective."
                  time="2 days ago"
                  stars={5}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <DefaultReviewCard
                  person="Jane Smith"
                  description="I found this app to be a game-changer for real estate. The interface is sleek and user-friendly. keep it up"
                  time="1 week ago"
                  stars={5}
                  color="info"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <DefaultReviewCard
                  person="Alex Johnson"
                  description="The quality of service is outstanding. It has made managing property listings and client interactions much smoother."
                  time="3 weeks ago"
                  stars={5}
                />
              </Grid>
            </Grid>
            <Box
              display="flex"
              alignItems="center"
              borderRadius="xl"
              my={2}
              mt={8}
              py={6}
              sx={{
                position: "relative",
                overflow: "hidden",
                backgroundImage: `url(${details})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 1,
                },
              }}
            >
              <Container>
                <Grid
                  container
                  item
                  xs={12}
                  lg={6}
                  sx={{ ml: { xs: 0, lg: 6 }, position: "relative", zIndex: 2 }}
                >
                  <Typography variant="h3" color="white" mb={1}>
                    About us
                  </Typography>
                  <Typography
                    variant="body1"
                    color="white"
                    opacity={0.8}
                    mb={2}
                  >
                    With over 20 years of experience in the real estate
                    industry, we pride ourselves on delivering exceptional
                    service and innovative solutions. Our team of dedicated
                    professionals combines extensive market knowledge with
                    cutting-edge technology to ensure a seamless experience for
                    our clients. Whether you're buying, selling, or investing,
                    our commitment to excellence and personalized approach sets
                    us apart. Discover how our expertise can help you achieve
                    your real estate goals with confidence.
                  </Typography>
                  <Typography
                    target="_blank"
                    rel="noreferrer"
                    variant="body2"
                    color="white"
                    fontWeight="regular"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Link to="/aboutUs">
                      Read more <ArrowForward sx={{ fontSize: 30 }} />
                    </Link>
                  </Typography>
                </Grid>
              </Container>
            </Box>
            <Divider sx={{ my: 6 }} />
            <Grid
              container
              spacing={3}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={6} md={4} lg={2}>
                <Box
                  component="img"
                  src={geicoImg}
                  alt="geico"
                  width="100%"
                  opacity={0.6}
                />
              </Grid>
              <Grid item xs={6} md={4} lg={2}>
                <Box
                  component="img"
                  src={advisorImg}
                  alt="advisor"
                  width="100%"
                  height={100}
                  opacity={0.6}
                />
              </Grid>
              <Grid item xs={6} md={4} lg={2}>
                <Box
                  component="img"
                  src={jllImg}
                  alt="JLL"
                  width="100%"
                  opacity={0.6}
                />
              </Grid>
              <Grid item xs={6} md={4} lg={2}>
                <Box
                  component="img"
                  src={wellsFargoImg}
                  alt="Wells"
                  width="100%"
                  opacity={0.6}
                />
              </Grid>
              <Grid item xs={6} md={4} lg={2}>
                <Box
                  component="img"
                  src={rocketMortgageImg}
                  alt="rocket"
                  width="100%"
                  opacity={0.6}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </div>
    </main>
  );
}
