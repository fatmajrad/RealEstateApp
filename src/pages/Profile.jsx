import React from 'react'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { FcHome } from "react-icons/fc";
import { useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import ListingItem from"../components/ListingItem";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changeDetail, setChangeDetail] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  function onLogout() {
    auth.signOut();
    navigate("/");
  }
  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }
  async function onSubmit() {
    try {
      if (auth.currentUser.displayName !== name) {
        //update display name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // update name in the firestore

        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success("Profile details updated");
    } catch (error) {
      toast.error("Could not update the profile details");
    }
  }
  useEffect(() => {
    async function fetchUserListings() {
      // Référence à la collection "listings" dans Firestore
      const listingRef = collection(db, "listings");
  
      // Construction de la requête Firestore pour récupérer les listings de l'utilisateur courant
      const q = query(
        listingRef,
        // Filtrage des documents où le champ "userRef" est égal à l'UID de l'utilisateur courant
        where("userRef", "==", auth.currentUser.uid),
        // Tri des résultats par ordre décroissant sur le champ "timestamp"
        orderBy("timestamp", "desc")
      );
  
      // Exécution de la requête Firestore
      const querySnap = await getDocs(q);
  
      // Initialisation d'un tableau pour stocker les listings récupérés
      let listings = [];
  
      // Itération à travers chaque document dans le snapshot de la requête
      querySnap.forEach((doc) => {
        // Ajout de chaque document avec son ID et ses données dans le tableau "listings"
        listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
  
      // Mise à jour de l'état local avec les listings récupérés depuis Firestore
      setListings(listings);
  
      // Indication que le chargement est terminé en mettant à jour l'état "loading" à false
      setLoading(false);
    }
  
    // Appel de la fonction fetchUserListings au montage du composant ou lorsque auth.currentUser.uid change
    fetchUserListings();
  }, [auth.currentUser.uid]); // Dépendance de useEffect pour exécuter la fonction lorsque l'UID de l'utilisateur change
  
  async function onDelete(listingID) {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "listings", listingID));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingID
      );
      setListings(updatedListings);
      toast.success("Successfully deleted the listing");
    }
  }
  function onEdit(listingID) {
    navigate(`/edit-listing/${listingID}`);
  }
  return (
    <>
    <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
      <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
      <div className="w-full md:w-[50%] mt-6 px-3">
        <form>
          {/* Name Input */}

          <input
            type="text"
            id="name"
            value={name}
            disabled={!changeDetail}
            onChange={onChange}
            className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
              changeDetail && "bg-red-200 focus:bg-red-200"
            }`}
          />

          {/* Email Input */}

          <input
            type="email"
            id="email"
            value={email}
            disabled
            className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
          />

          <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
            <p className="flex items-center ">
              Do you want to change your name?
              <span
                onClick={() => {
                  changeDetail && onSubmit();
                  setChangeDetail((prevState) => !prevState);
                }}
                className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer"
              >
                {changeDetail ? "Apply change" : "Edit"}
              </span>
            </p>
            <p
              onClick={onLogout}
              className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer"
            >
              Sign out
            </p>
          </div>
        </form>
        <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded w-full
        px-7 py-3 uppercase text-md font-medium">
        <Link to="/createListing" className='flex justify-center justify-items'>
        <FcHome className="mr-2 text-3xl bg-red-200 rounded-full p-1 border-2"/>
        Sell or rent a house
        </Link>
      </button>
      </div>
    </section>
    <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-6">
              My Listings
            </h2>
            <ul className="sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}