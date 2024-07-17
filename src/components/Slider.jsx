import React,{ useState,useEffect } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";

 
import Spinner from "../components/Spinner";
import { db } from "../firebase";
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/swiper-bundle.css';
// import 'swiper/modules/autoplay/autoplay.css';
// import 'swiper/modules/navigation/navigation';


// Import Swiper styles

// import 'swiper/css';
 
//import "swiper/swiper-bundle.min.css";
import { useNavigate } from "react-router-dom";


export default function Slider() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
 
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchListings() {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchListings();
  }, []);
  if (loading) {
    return <Spinner />;
  }
  if (listings.length === 0) {
    return <></>;
  }
  return (
    <h1>Hello</h1>
    // listings && (
    //   <></>
    // //   <Swiper
    // //   spaceBetween={50}
    // //   slidesPerView={3}
    // //   onSlideChange={() => console.log('slide change')}
    // //   onSwiper={(swiper) => console.log(swiper)}
    // // >
    // //   <SwiperSlide>Slide 1</SwiperSlide>
    // //   <SwiperSlide>Slide 2</SwiperSlide>
    // //   <SwiperSlide>Slide 3</SwiperSlide>
    // //   <SwiperSlide>Slide 4</SwiperSlide>
    // //   ...
    // // </Swiper>
    // )
  );
}