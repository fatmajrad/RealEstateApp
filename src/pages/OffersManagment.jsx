import React from "react";
import Sidebbar from "../components/Sidebbar";
export default function OffersManagment() {
     return (
          <div className="flex">
            <Sidebbar />
            <div className="h-screen flex-1 p-7 bg-gray-100">
              <div className="relative overflow-x-auto shadow-lg sm:rounded-lg bg-white p-6">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-2xl font-bold text-gray-700">Appointment List</h1>
                  <div className="flex space-x-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13h-2v4H5v2h4v4h2v-4h4v-2h-4V5z" />
                      </svg>
                      Create Offer
                    </button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 2a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm10 11a1 1 0 110 2 1 1 0 010-2zm-8 1a1 1 0 100 2 1 1 0 000-2zm0-8a1 1 0 110 2 1 1 0 010-2zm8-1a1 1 0 100 2 1 1 0 000-2z" />
                      </svg>
                      View History
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-4 py-3">Property Name</th>
                        <th scope="col" className="px-4 py-3">State</th>
                        <th scope="col" className="px-4 py-3">City</th>
                        <th scope="col" className="px-4 py-3">Rooms</th>
                        <th scope="col" className="px-4 py-3">Furnished</th>
                        <th scope="col" className="px-4 py-3">Parking</th>
                        <th scope="col" className="px-4 py-3">Surface Area</th>
                        <th scope="col" className="px-4 py-3">Local Type</th>
                        <th scope="col" className="px-4 py-3">Disponibility</th>
                        <th scope="col" className="px-4 py-3">Offer Type</th>
                        <th scope="col" className="px-4 py-3">Price</th>
                        <th scope="col" className="px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="odd:bg-white even:bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
                        <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          Beautiful Villa
                        </th>
                        <td className="px-4 py-4">California</td>
                        <td className="px-4 py-4">Los Angeles</td>
                        <td className="px-4 py-4">5</td>
                        <td className="px-4 py-4">Yes</td>
                        <td className="px-4 py-4">Yes</td>
                        <td className="px-4 py-4">3000</td>
                        <td className="px-4 py-4">Villa</td>
                        <td className="px-4 py-4">2024-08-01</td>
                        <td className="px-4 py-4">Rent</td>
                        <td className="px-4 py-4">$5000</td>
                        <td className="px-4 py-4">
                          <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                        </td>
                      </tr>
                      {/* Répétez les blocs <tr> similaires pour les autres annonces */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
}
