import {
  collection,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import Slider from "../components/Slider";
import { db } from "../firebase";

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
          orderBy("timestamp", "desc"),
          where("typeOffre", "==", "rent"),
          where("status", "==", "available")
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



  ////////////////////////// RENT OFFERS/////////////////////////////////////////////////
  const [rentListings, setRentListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        // get reference
        const listingsRef = collection(db, "listings");
        // create the query
        const q = query(
          listingsRef,
          orderBy("timestamp", "desc"),
          where("typeOffre", "==", "rent"),
          where("status", "==", "available")
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
       
        setRentListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);
   ////////////////////////// Sell OFFERS/////////////////////////////////////////////////
  const [saleListings, setSaleListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        // get reference
        const listingsRef = collection(db, "listings");
        // create the query
        const q = query(
          listingsRef,
          orderBy("timestamp", "desc"),
          where("typeOffre", "==", "sale"),
          where("status", "==", "available")
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
        console.log(listings);
        setSaleListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);
  return (
    <main>
  <div style={{
  backgroundSize: "cover",
  height: "50vh", // Half of the viewport height
  overflow: "hidden", // Hide overflow if necessary
  }}>
  <img 
    src={require('../assets/img/background.jpg')} 
    alt="Background" 
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover", // Ensures the image covers the div entirely
    }}
    />
    </div>
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto pt-8 space-y-10 px-4">
          {/* Recent Offers Section */}
          {offerListings && offerListings.length > 0 && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Recent Offers</h2>
                {/* <Link to="/offers">
                  <p className="text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                    Show more offers
                  </p>
                </Link> */}
              </div>
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
    
          {/* Places for Rent Section */}
          {rentListings && rentListings.length > 0 && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Places for Rent</h2>
                {/* Uncomment the Link below to enable "Show more" functionality */}
                {/* <Link to="/category/rent">
                  <p className="text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                    Show more places for rent
                  </p>
                </Link> */}
              </div>
              <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                {rentListings.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                  />
                ))}
              </ul>
            </div>
          )}
    
          {/* Places for Sale Section */}
          {saleListings && saleListings.length > 0 && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Places for Sale</h2>
                {/* Uncomment the Link below to enable "Show more" functionality */}
                {/* <Link to="/category/sale">
                  <p className="text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                    Show more places for sale
                  </p>
                </Link> */}
              </div>
              <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                {saleListings.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      </main>
    );
  }    