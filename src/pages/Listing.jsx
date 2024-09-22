import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import { FaMapMarkerAlt, FaBed, FaBath, FaParking, FaChair } from "react-icons/fa";


export default function Listing() {
  const auth = getAuth();
  const params = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    disponibility: "",
    name: "",
    phoneNumber: "",
    email: "",
  });

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
    setFormData({ disponibility: "", name: "", phoneNumber: "", email: "" }); // Reset form data on modal toggle
  };

  const onChangeModel = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const isValidDateTime = (dateTime) => {
    const now = new Date();
    const appointmentDate = new Date(dateTime);
    const hours = appointmentDate.getHours();
    const day = appointmentDate.getDay();
    return appointmentDate > now && hours >= 8 && hours < 17 && day !== 0; // Validate date and time
  };

  async function onSubmitModel(e) {
    e.preventDefault();
    setLoading(true);
    if (!isValidDateTime(formData.disponibility)) {
      toast.error("Invalid appointment time. Must be between 08:00 and 17:00 on weekdays.");
      setLoading(false);
      return;
    }
    
    try {
      const appointmentsRef = collection(db, "appointments");

      // Check for existing appointments by this user
      const q1 = query(appointmentsRef, where("name", "==", formData.name), where("email", "==", formData.email), where("phoneNumber", "==", formData.phoneNumber));
      const querySnap1 = await getDocs(q1);
      if (querySnap1.size >= 2) {
        toast.error("You have already booked more than two appointments.");
        setLoading(false);
        return;
      }

      // Check for existing appointments at the requested time
      const q2 = query(appointmentsRef, where("listingRef", "==", params.listingId), where("disponibility", "==", formData.disponibility));
      const querySnap2 = await getDocs(q2);
      if (!querySnap2.empty) {
        toast.error("An appointment at this time already exists.");
        setLoading(false);
        return;
      }

      // Check if appointments are at least one hour apart
      const q3 = query(appointmentsRef, where("listingRef", "==", params.listingId), where("disponibility", ">=", new Date(new Date(formData.disponibility).getTime() - 3600000)), where("disponibility", "<=", new Date(new Date(formData.disponibility).getTime() + 3600000)));
      const querySnap3 = await getDocs(q3);
      if (!querySnap3.empty) {
        toast.error("Appointments must be at least 1 hour apart.");
        setLoading(false);
        return;
      }

      const formDataCopy = {
        ...formData,
        timestamp: serverTimestamp(),
        listingRef: params.listingId,
        status: "onHold",
        owner: listing.userRef,
      };

      await addDoc(collection(db, "appointments"), formDataCopy);
      toast.success("Your appointment is saved");
      toggleModal();
      navigate(`/category/${listing.type}/${params.listingId}`);
    } catch (error) {
      console.error("Error adding appointment:", error);
      toast.error("Failed to save appointment. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5">
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          {listing.imgUrls.length > 0 && (
            <img src={listing.imgUrls[0]} alt={listing.name} className="w-full h-full object-cover rounded-lg" style={{ maxHeight: '400px' }} />
          )}
        </div>

        <div className="w-full md:w-1/2">
          <p className="text-2xl font-bold mb-3 text-blue-900">{listing.name} - {listing.price} DT</p>
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
                {listing.offer}
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
              {listing.roomsNbr} Beds
            </li>
            {/* <li className="flex items-center whitespace-nowrap">
              <FaBath className="text-lg mr-1" />
              {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </li> */}
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
              onClick={toggleModal}
              className="px-3 py-1 bg-gray-200 text-gray-800 font-medium text-sm uppercase rounded shadow-md hover:bg-gray-300 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg transition duration-150 ease-in-out"
            >
              Prendre rendez-vous de visite
            </button>

            {/* {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
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
            )} */}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-md shadow-lg max-w-lg w-full"> {/* Increased padding and set a max-width */}
          <h2 className="text-lg font-semibold">Book Appointment</h2>
          <form onSubmit={onSubmitModel}>
            <div className="mb-4">
              <label htmlFor="disponibility" className="block text-sm font-medium">Date & Time:</label>
              <input
                type="datetime-local"
                id="disponibility"
                value={formData.disponibility}
                onChange={onChangeModel}
                required
                className="border rounded-md w-full p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium">Name:</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={onChangeModel}
                required
                className="border rounded-md w-full p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm font-medium">Phone Number:</label>
              <input
                type="tel"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={onChangeModel}
                required
                className="border rounded-md w-full p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium">Email:</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={onChangeModel}
                required
                className="border rounded-md w-full p-2"
              />
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={toggleModal} className="mr-2 px-4 py-2 bg-red-500 text-white rounded-md">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Submit</button>
            </div>
          </form>
        </div>
      </div>      
      )}
    </main>
  );
}
