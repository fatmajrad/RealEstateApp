import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { FcHome } from "react-icons/fc";
import { FaEye, FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase"; // Import your Firestore configuration
import Sidebbar from "../components/Sidebbar";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

export default function OffersManagment() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 5;

  useEffect(() => {
    async function fetchUserListings() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("userRef", "==", auth.currentUser.uid),
          orderBy("timestamp", "desc")
        );

        const querySnap = await getDocs(q);
        const fetchedListings = querySnap.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setListings(fetchedListings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching listings: ", error);
        toast.error("Failed to fetch listings");
      }
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

  async function onDelete(listingID) {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await deleteDoc(doc(db, "listings", listingID));
        const updatedListings = listings.filter(
          (listing) => listing.id !== listingID
        );
        setListings(updatedListings);
        toast.success("Successfully deleted the listing");
      } catch (error) {
        console.error("Error deleting listing: ", error);
        toast.error("Failed to delete listing");
      }
    }
  }

  // Update all related appointments when the offer status changes to "not available"
  async function handleStatusChange(listingID, newStatus) {
    try {
      const listingDoc = doc(db, "listings", listingID);
      await updateDoc(listingDoc, { status: newStatus });

      if (newStatus === "not available") {
        // Fetch all related appointments and set their status to "completed"
        const appointmentRef = collection(db, "appointments");
        const q = query(appointmentRef, where("listingID", "==", listingID));
        const querySnap = await getDocs(q);
        
        const batchPromises = querySnap.docs.map(async (appointmentDoc) => {
          const appointmentDocRef = doc(db, "appointments", appointmentDoc.id);
          await updateDoc(appointmentDocRef, { status: "completed" });
        });
        await Promise.all(batchPromises);

        toast.success("All related appointments have been set to 'completed'");
      }
    } catch (error) {
      console.error("Error updating status: ", error);
      toast.error("Failed to update offer status");
    }
  }

  function onEdit(listingID) {
    navigate(`/editListing/${listingID}`);
  }

  function onDetails(listingID) {
    navigate(`/offerDetails/${listingID}`);
  }

  // Pagination logic
  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = listings.slice(indexOfFirstListing, indexOfLastListing);

  const totalPages = Math.ceil(listings.length / listingsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex">
      <Sidebbar className="sidebar-fixed" />
      <div className="h-screen flex-1 p-7 bg-gray-100">
        <div className="relative overflow-x-auto shadow-lg sm:rounded-lg bg-white p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-700">Offers List</h1>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
                <Link to="/createListing" className="flex justify-center items-center">
                  <FcHome className="mr-2 text-3xl bg-red-200 rounded-full p-1 border-2" />
                  Create Offer
                </Link>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <Spinner />
            ) : (
              <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Property Name
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Address
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Local Type
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Rooms
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Offer Type
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Price
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentListings.map((listing) => (
                    <tr
                      key={listing.id}
                      className="odd:bg-white even:bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
                    >
                      <th
                        scope="row"
                        className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {listing.data.name}
                      </th>
                      <td className="px-4 py-4">
                        <select
                          value={listing.data.status}
                          onChange={(e) => handleStatusChange(listing.id, e.target.value)}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                        >
                          <option value="available">Available</option>
                          <option value="not available">Not Available</option>
                        </select>
                      </td>
                      <td className="px-4 py-4">{listing.data.city}, {listing.data.state}</td>
                      <td className="px-4 py-4">{listing.data.localType}</td>
                      <td className="px-4 py-4">{listing.data.roomsNbr}</td>
                      <td className="px-4 py-4">{listing.data.offerType}</td>
                      <td className="px-4 py-4">{listing.data.price}DT</td>
                      <td className="px-4 py-4 flex space-x-2">
                        <FaTrash
                          className="h-[14px] cursor-pointer text-red-500"
                          onClick={() => onDelete(listing.id)}
                        />
                        <MdEdit
                          className="h-4 cursor-pointer text-orange-500"
                          onClick={() => onEdit(listing.id)}
                        />
                        <FaEye
                          className="h-[14px] cursor-pointer text-blue-500"
                          onClick={() => onDetails(listing.id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={previousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 bg-gray-300 rounded-md ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"}`}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 bg-gray-300 rounded-md ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
