import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import ListingItem from "../components/ListingItem";
import { db } from "../firebase";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography
} from '@mui/material';

export default function Offers() {
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);

  // Pagination state
  const [rentPage, setRentPage] = useState(1);
  const [salePage, setSalePage] = useState(1);
  const listingsPerPage = 8; // Number of listings per page

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingsRef = collection(db, "listings");

        // Queries for rent and sale listings
        const rentQuery = query(
          listingsRef,
          where("offerType", "==", "rent"),
          where("status", "==", "available"),
          orderBy("timestamp", "desc")
        );
        const saleQuery = query(
          listingsRef,
          where("offerType", "==", "sale"),
          where("status", "==", "available"),
          orderBy("timestamp", "desc")
        );

        // Execute the queries concurrently
        const [rentSnap, saleSnap] = await Promise.all([getDocs(rentQuery), getDocs(saleQuery)]);

        // Map rent listings
        const rentListings = rentSnap.docs.map(doc => ({
          id: doc.id,
          data: doc.data(),
        }));

        // Map sale listings
        const saleListings = saleSnap.docs.map(doc => ({
          id: doc.id,
          data: doc.data(),
        }));

        setRentListings(rentListings);
        setSaleListings(saleListings);

      } catch (error) {
        console.log("Error fetching listings:", error);
      }
    }

    fetchListings();
  }, []);

  // Pagination Logic
  const handlePageChange = (type, direction) => {
    if (type === 'rent') {
      setRentPage(prevPage => direction === 'next' ? prevPage + 1 : prevPage - 1);
    } else if (type === 'sale') {
      setSalePage(prevPage => direction === 'next' ? prevPage + 1 : prevPage - 1);
    }
  };

  // Sliced listings for pagination
  const currentRentListings = rentListings.slice((rentPage - 1) * listingsPerPage, rentPage * listingsPerPage);
  const currentSaleListings = saleListings.slice((salePage - 1) * listingsPerPage, salePage * listingsPerPage);

  return (
    <Box component="main" bgcolor="#f4f4f4" py={8}>
      <Container>
        {/* Main Title */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" fontWeight="bold" color="#d92228">
            Explore Our Listings
          </Typography>
        </Box>

        {/* Places for Rent Section */}
        {rentListings.length > 0 && (
          <Box mb={10}>
            <Box textAlign="center" mb={4}>
              <Typography variant="h4" fontWeight="bold" color="text.primary">
                Places for Rent
              </Typography>
            </Box>
            <Grid container spacing={4}>
              {currentRentListings.map((listing) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={listing.id}>
                  <ListingItem
                    listing={listing.data}
                    id={listing.id}
                  />
                </Grid>
              ))}
            </Grid>
            {/* Pagination for Rent Listings */}
            <Box display="flex" justifyContent="center" mt={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handlePageChange('rent', 'prev')}
                disabled={rentPage === 1}
                sx={{ mx: 1 }}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handlePageChange('rent', 'next')}
                disabled={rentPage === Math.ceil(rentListings.length / listingsPerPage)}
                sx={{ mx: 1 }}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}

        {/* Places for Sale Section */}
        {saleListings.length > 0 && (
          <Box>
            <Box textAlign="center" mb={4}>
              <Typography variant="h4" fontWeight="bold" color="text.primary">
                Places for Sale
              </Typography>
            </Box>
            <Grid container spacing={4}>
              {currentSaleListings.map((listing) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={listing.id}>
                  <ListingItem
                    listing={listing.data}
                    id={listing.id}
                  />
                </Grid>
              ))}
            </Grid>
            {/* Pagination for Sale Listings */}
            <Box display="flex" justifyContent="center" mt={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handlePageChange('sale', 'prev')}
                disabled={salePage === 1}
                sx={{ mx: 1 }}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handlePageChange('sale', 'next')}
                disabled={salePage === Math.ceil(saleListings.length / listingsPerPage)}
                sx={{ mx: 1 }}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
