import React, { useState } from "react";
import Sidebbar from "../components/Sidebbar";

const AppointmentList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const appointments = [
    {
      id: 1,
      disponibility: '2024-08-01',
      name: 'John Doe',
      phoneNumber: '123-456-7890',
      email: 'john.doe@example.com',
      status: 'Pending'
    },
    // Add more appointments here
  ];

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleStatusChange = (id, newStatus) => {
    // Logic to change the status of the appointment
    console.log(`Changing status of appointment ${id} to ${newStatus}`);
  };

  return (
    <div className="flex">
      <Sidebbar />
      <div className="h-screen flex-1 p-7 bg-gray-100">
        <div className="relative overflow-x-auto shadow-lg sm:rounded-lg bg-white p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-700">Appointment List</h1>
            <div className="flex space-x-4">
              <button 
                onClick={() => openModal(null)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13h-2v4H5v2h4v4h2v-4h4v-2h-4V5z" />
                </svg>
                Add Remarks
              </button>
              <button 
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 2a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm10 11a1 1 0 110 2 1 1 0 010-2zm-8 1a1 1 0 100 2 1 1 0 000-2zm0-8a1 1 0 110 2 1 1 0 010-2zm8-1a1 1 0 100 2 1 1 0 000-2z" />
                </svg>
                View History
              </button>
            </div>
          </div>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Disponibility</th>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Phone Number</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="odd:bg-white even:bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
                  <td className="px-6 py-4">{appointment.disponibility}</td>
                  <td className="px-6 py-4">{appointment.name}</td>
                  <td className="px-6 py-4">{appointment.phoneNumber}</td>
                  <td className="px-6 py-4">{appointment.email}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={appointment.status} 
                      onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => openModal(appointment)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
              <h2 className="text-xl font-bold mb-4">Appointment Remarks</h2>
              {selectedAppointment && (
                <div>
                  <p><strong>Name:</strong> {selectedAppointment.name}</p>
                  <p><strong>Phone Number:</strong> {selectedAppointment.phoneNumber}</p>
                  <p><strong>Email:</strong> {selectedAppointment.email}</p>
                  <textarea 
                    rows="4"
                    className="w-full p-2 mt-4 border rounded-md"
                    placeholder="Add remarks here...">
                  </textarea>
                </div>
              )}
              <div className="mt-4 flex justify-end space-x-4">
                <button 
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                  Close
                </button>
                <button 
                  onClick={closeModal}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentList;
