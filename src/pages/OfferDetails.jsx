import React, { useEffect, useState } from "react";
import Sidebbar from "../components/Sidebbar";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import { FaCheck, FaTimes, FaHome, FaMapMarkerAlt, FaBed, FaDollarSign, FaTags, FaRegCalendarCheck } from "react-icons/fa";
import { MdOutlineDescription } from "react-icons/md";
import { PiArmchairFill } from "react-icons/pi";
import { FaSquareParking } from "react-icons/fa6";
import Spinner from "../components/Spinner";

export default function OfferDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);

  useEffect(() => {
    setLoading(true);
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      } else {
        navigate("/");
        toast.error("Listing does not exist");
      }
    }
    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex">
      <Sidebbar />
      <div className="flex-1 p-6 bg-gray-100">
        {listing && (
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
              <FaHome className="mr-2 text-blue-600" />
              {listing.name}
            </h1>
            <div className="flex flex-wrap mb-6">
              {listing.imgUrls.map((url, index) => (
                <img key={index} src={url} alt={listing.name} className="w-full md:w-1/3 lg:w-1/4 p-2 rounded-lg" />
              ))}
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-red-500" />
                {listing.street}, {listing.city}, {listing.state}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-gray-600">
                <FaBed className="mr-2 text-purple-500" />
                <span className="font-semibold">Rooms: </span>
                <span>{listing.roomsNbr}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaDollarSign className="mr-2 text-green-500" />
                <span className="font-semibold">Price: </span>
                <span>{listing.price} DT</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaTags className="mr-2 text-yellow-500" />
                <span className="font-semibold">Status: </span>
                <span>{listing.status}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaRegCalendarCheck className="mr-2 text-blue-500" />
                <span className="font-semibold">Disponibility: </span>
                <span>{listing.disponibility}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaTags className="mr-2 text-yellow-500" />
                <span className="font-semibold">Local Type: </span>
                <span>{listing.localType}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaSquareParking className="mr-2 text-black-500" />
                <span className="font-semibold">Parking: </span>
                {listing.parking ? <FaCheck className="inline-block text-green-500" /> : <FaTimes className="inline-block text-red-500" />}
              </div>
              <div className="flex items-center text-gray-600">
                <PiArmchairFill className="mr-2 text-black-500" />
                <span className="font-semibold">Furnished: </span>
                {listing.furnished ? <FaCheck className="inline-block text-green-500" /> : <FaTimes className="inline-block text-red-500" />}
              </div>
            </div>
            <div className="text-gray-700 mb-4">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <MdOutlineDescription className="mr-2 text-gray-600" />
                Description
              </h2>
              <p>{listing.description}</p>
            </div>
            <button
               
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Back to Listings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
