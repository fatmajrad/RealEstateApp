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
      {/* <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        autoplay={{ delay: 3000 }}
        modules={[EffectFade, Autoplay, Navigation, Pagination]}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[300px] md:h-[400px]"
              style={{
                background: `url(${url}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper> */}

      <div className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5">
        <div className="w-full">
          <p className="text-2xl font-bold mb-3 text-blue-900">
            {listing.name} - ${" "}
          </p>
          <p className="flex items-center mt-6 mb-3 font-semibold">
            <FaMapMarkerAlt className="text-green-700 mr-1" />
            {listing.address}
          </p>
          <div className="flex justify-start items-center space-x-4 w-[75%]">
            <p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">
              {listing.type === "rent" ? "Rent" : "Sale"}
            </p>
            {listing.offer && (
              <p className="w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white text-center font-semibold shadow-md">
                ${+listing.regularPrice - +listing.discountedPrice} discount
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
                className="px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg w-full text-center transition duration-150 ease-in-out "
              >
                Contact Landlord
              </button>
            </div>
          )}
          {contactLandlord && (
            <Contact userRef={listing.userRef} listing={listing} />
          )}
        </div>
        <div
          className="w-full h-[200px] md:h-[400px] z-10 overflow-x-hidden mt-6 md:mt-0 md:ml-2"
          style={{
            background: `url(${listing.imgUrls[0]}) center no-repeat`,
            backgroundSize: "cover",
          }}
        ></div>
      </div>

      {isModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-3xl">
      <h2 className="text-2xl font-bold mb-4">Schedule a Visit</h2>
      <form onSubmit={onSubmitModel}>
        <p className="text-lg mt-6 font-semibold">Name</p>
        <input
          type="text"
          id="name"
          value={name}
          onChange={onChangeModel}
          placeholder="Name"
          maxLength="32"
          minLength="10"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
        <p className="text-lg font-semibold">Email:</p>
        <input
          type="text"
          id="email"
          value={email}
          onChange={onChangeModel}
          placeholder="Email"
          maxLength="32"
          minLength="10"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
        <p className="text-lg font-semibold">Phone Number:</p>
        <input
          type="text"
          id="phoneNumber"
          value={phoneNumber}
          onChange={onChangeModel}
          placeholder="Phone Number"
          maxLength="8"
          minLength="8"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
        <p className="text-lg font-semibold">Disponibility:</p>
        <input
          type="datetime-local"
          id="disponibility"
          min={new Date().toISOString().slice(0, 16)}
          value={disponibility}
          onChange={onChangeModel}
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
        />
        <div className="flex space-x-4 mt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white font-medium text-md uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg transition duration-150 ease-in-out"
          >
            Send
          </button>
          <button
            type="button"
            onClick={toggleModal}
            className="px-6 py-3 bg-red-600 text-white font-medium text-md uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg transition duration-150 ease-in-out"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  </div>
    )}
    </main>
  );
}
