import { doc, getDoc,query,where,getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from "react-icons/fa";
import Contact from "../components/Contact";
  export default function Listing() {
    const auth = getAuth();
    const params = useParams();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    const [contactLandlord, setContactLandlord] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
      disponibility: null,
      name: "",
      phoneNumber: "",
      email: "",
    });
    const { name, disponibility, phoneNumber, email } = formData;

    useEffect(() => {
      async function fetchListing() {
        setLoading(true);
        try {
          const docRef = doc(db, "listings", params.listingId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setListing(docSnap.data());
          } else {
          
            toast.error("Listing not found");
            navigate("/");
          }
        } catch (error) {
          console.error("Error fetching document: ", error);
          toast.error("Failed to fetch listing");
        } finally {
          setLoading(false);
        }
      }
      fetchListing();
    }, [params.listingId, navigate]);
  
    if (loading) {
      return <Spinner />;
    }
  
    
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  // Handle form input changes
  const onChangeModel = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const isValidDateTime = (dateTime) => {
    const now = new Date();
    const appointmentDate = new Date(dateTime);
    const hours = appointmentDate.getHours();
    const day = appointmentDate.getDay();

    // Check if the date is in the future
    if (appointmentDate <= now) return false;

    // Check if the time is between 08:00 and 17:30
    if (hours < 8 || (hours === 17 && appointmentDate.getMinutes() > 30) || hours >= 18) return false;

    // Check if the day is not Sunday (0 - Sunday)
    if (day === 0) return false;

    return true;
  };
  async function onSubmitModel(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // Create a reference to the appointments collection
      const appointmentsRef = collection(db, "appointments");

      // Create a query to check if the user has booked more than two appointments
      const q1 = query(
        appointmentsRef,
        where("name", "==", formData.name),
        where("email", "==", formData.email),
        where("phoneNumber", "==", formData.phoneNumber)
      );

      // Execute the query and get the number of appointments
      const querySnap1 = await getDocs(q1);
      const numberOfAppointments = querySnap1.size;

      // Check if the user has booked more than two appointments
      if (numberOfAppointments >= 2) {
        toast.error("You have already booked more than two appointments.");
        setLoading(false);
        return;
      }

      // Check if there is another appointment at the same time on the same listing
      const q2 = query(
        appointmentsRef,
        where("listingRef", "==", params.listingId),
        where("disponibility", "==", formData.disponibility)
      );

      // Execute the query and check if any document exists
      const querySnap2 = await getDocs(q2);
      if (!querySnap2.empty) {
        toast.error("An appointment at this time already exists.");
        setLoading(false);
        return;
      }

      // Check if there is at least a 1-hour gap between appointments on the same listing
      const q3 = query(
        appointmentsRef,
        where("listingRef", "==", params.listingId),
        where("disponibility", ">=", new Date(new Date(formData.disponibility).getTime() - 3600000)),
        where("disponibility", "<=", new Date(new Date(formData.disponibility).getTime() + 3600000))
      );

      // Execute the query and check if any document exists
      const querySnap3 = await getDocs(q3);
      if (!querySnap3.empty) {
        toast.error("Appointments on the same listing must be at least 1 hour apart.");
        setLoading(false);
        return;
      }

      // Check if disponibility is within the allowed time range and not on Sunday
      const disponibilityDate = new Date(formData.disponibility);
      const hour = disponibilityDate.getHours();
      const day = disponibilityDate.getDay();

      if (hour < 8 || hour > 17 || (hour === 17 && disponibilityDate.getMinutes() > 30) || day === 0) {
        toast.error("Appointment time must be between 08:00 and 17:30 and not on Sunday.");
        setLoading(false);
        return;
      }

      // Proceed with creating the appointment
      const formDataCopy = {
        ...formData,
        timestamp: serverTimestamp(),
        listingRef: params.listingId,
        status: "onHold",
        remarks: ""
      };

      const docRef = await addDoc(collection(db, "appointments"), formDataCopy);
      setLoading(false);
      toggleModal();
      toast.success("Your appointment is saved");
      navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    } catch (error) {
      console.error("Error adding appointment:", error);
      setLoading(false);
      toast.error("Failed to save appointment. Please try again later.");
    }
  }

  return (
<main>
  <div className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5">
    
    {/* Image Section */}
    <div className="w-full md:w-1/2 mb-6 md:mb-0">
      {listing.imgUrls.length > 0 && (
        <img
          src={listing.imgUrls[0]}
          alt={listing.name}
          className="w-full h-full object-cover rounded-lg"
          style={{ maxHeight: '400px' }} // Adjust maxHeight as needed
        />
      )}
    </div>
    
    {/* Details Section */}
    <div className="w-full md:w-1/2">
      <p className="text-2xl font-bold mb-3 text-blue-900">
        {listing.name} - {listing.price} DT
      </p>
      <p className="flex items-center mt-6 mb-3 font-semibold">
        <FaMapMarkerAlt className="text-green-700 mr-1" />
        {listing.city}
      </p>
      <div className="flex justify-start items-center space-x-4 w-[75%]">
        <p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">
          {listing.offerType === "rent" ? "Rent" : "Sale"}
        </p>
        {listing.offer && (
          <p className="w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white text-center font-semibold shadow-md">
            {listing.offer} {/* Display offer if available */}
          </p>
        )}
      </div>
      <p className="mt-3 mb-3">
        <span className="font-semibold">Description - </span>
        {listing.description}
      </p>
      <ul className="flex items-center space-x-2 sm:space-x-10 text-sm font-semibold mb-6">
        <li className="flex items-center whitespace-nowrap">
          <FaBed className="text-lg mr-1" />
          {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
        </li>
        <li className="flex items-center whitespace-nowrap">
          <FaBath className="text-lg mr-1" />
          {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
        </li>
        <li className="flex items-center whitespace-nowrap">
          <FaParking className="text-lg mr-1" />
          {listing.parking ? "Parking spot" : "No parking"}
        </li>
        <li className="flex items-center whitespace-nowrap">
          <FaChair className="text-lg mr-1" />
          {listing.furnished ? "Furnished" : "Not furnished"}
        </li>
      </ul>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setShareLinkCopied(true);
            setTimeout(() => {
              setShareLinkCopied(false);
            }, 2000);
          }}
          className="px-3 py-1 bg-gray-200 text-gray-800 font-medium text-sm uppercase rounded shadow-md hover:bg-gray-300 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg transition duration-150 ease-in-out"
        >
          <FaShare className="inline-block mr-2" />
          Share
        </button>
        <button
          onClick={toggleModal}
          className="px-3 py-1 bg-gray-200 text-gray-800 font-medium text-sm uppercase rounded shadow-md hover:bg-gray-300 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg transition duration-150 ease-in-out"
        >
          Prendre rendez-vous de visite
        </button>
        {shareLinkCopied && (
          <p className="text-green-500 font-semibold">Link Copied!</p>
        )}
      </div>

      {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
        <div className="mt-6">
          <button
            onClick={() => setContactLandlord(true)}
            className="px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg w-full text-center transition duration-150 ease-in-out"
          >
            Contact Landlord
          </button>
        </div>
      )}
      {contactLandlord && (
        <Contact userRef={listing.userRef} listing={listing} />
      )}
    </div>
  </div>
</main>
    );
  }