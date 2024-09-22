import React, { useEffect, useState } from "react";
import Sidebbar from "../components/Sidebbar";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import { FaEye, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { collection, query, orderBy, getDocs, deleteDoc, doc, where, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function AppointementManagment() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const appointmentsPerPage = 5; // Maximum appointments per page
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserAppointments() {
      try {
        const appointmentRef = collection(db, "appointments");
        const q = query(
          appointmentRef,
          where("owner", "==", auth.currentUser.uid),
          orderBy("timestamp", "desc")
        );
        const querySnap = await getDocs(q);
        const fetchedAppointments = [];
        querySnap.forEach((doc) => {
          fetchedAppointments.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setAppointments(fetchedAppointments);
        setFilteredAppointments(fetchedAppointments); // Initialize filtered appointments
      } catch (error) {
        console.error("Error fetching appointments: ", error);
        toast.error("Failed to fetch appointments");
      }
    }
    fetchUserAppointments();
  }, [auth]);

// Handle status change and update Firestore
const handleStatusChange = async (id, newStatus) => {
  try {
    const appointmentDoc = doc(db, "appointments", id);
    
    // Update Firestore document
    await updateDoc(appointmentDoc, { status: newStatus });

    // Immediately update the local state
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, data: { ...appointment.data, status: newStatus } }
          : appointment
      )
    );

    // Notify the user of the successful update
    toast.success("Status updated successfully!");
  } catch (error) {
    console.error("Error updating status: ", error);
    toast.error("Failed to update status");
  }
};
  // Delete an appointment
  async function onDelete(appointmentID) {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "appointments", appointmentID));
      const updatedAppointments = appointments.filter(
        (appointment) => appointment.id !== appointmentID
      );
      setAppointments(updatedAppointments);
      filterAppointments(filter); // Re-filter after deletion
      toast.success("Successfully deleted the appointment");
    }
  }

  // Filter appointments based on status
  const filterAppointments = (status) => {
    setFilter(status);
    setCurrentPage(1); // Reset to the first page when filtering
    if (status === "All") {
      setFilteredAppointments(appointments);
    } else {
      const filtered = appointments.filter(
        (appointment) => appointment.data.status === status
      );
      setFilteredAppointments(filtered);
    }
  };

  function onDetails(listingID) {
    navigate(`/offerDetails/${listingID}`);
  }

  // Pagination logic
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

  // Pagination controls
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

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
      <Sidebbar />
      <div className="h-screen flex-1 p-7 bg-gray-100">
        <div className="relative overflow-x-auto shadow-lg sm:rounded-lg bg-white p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-700">Appointment List</h1>

            {/* Filter Dropdown */}
            <select
              value={filter}
              onChange={(e) => filterAppointments(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Disponibility</th>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Phone Number</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Offer details</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentAppointments.map((appointment) => (
                <tr key={appointment.id} className="odd:bg-white even:bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
                  <td className="px-6 py-4">{appointment.data.disponibility}</td>
                  <td className="px-6 py-4">{appointment.data.name}</td>
                  <td className="px-6 py-4">{appointment.data.phoneNumber}</td>
                  <td className="px-6 py-4">{appointment.data.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={appointment.data.status}
                      onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td>
                    <FaEye
                      className="h-[14px] cursor-pointer text-blue-500"
                      onClick={() => onDetails(appointment.data.listingID)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <FaTrash
                      className="h-[14px] cursor-pointer text-red-500"
                      onClick={() => onDelete(appointment.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
