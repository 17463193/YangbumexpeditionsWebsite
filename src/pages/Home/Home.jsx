import React, { useState, useEffect } from 'react';
import Sub_header from '../../components/Sub_header/Sub_header';
import Service from '../../components/Service/Service';
import PopularPackages from '../../components/Popular_pack/Popular_pack';
import HowItWorks from '../../components/HowItWorks/HowItWorks';
// import HomeContact from '../../components/HomeContact/HomeContact';
import HolidayBooking from '../../components/HolidayBooking/HolidayBooking';
import Faq from '../../components/Faq/Faq';
import HomeDestination from '../../components/HomeDestination/HomeDestination';
import Offer from '../../components/Offer/Offer';
import Loading from '../LoadingPage/LoadingPage'; // Import your Loading component
import Festivalcalendar from  '../../components/Festivalcalendar/Festivalcalendar';
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Simulate loading time (replace with actual data fetching if needed)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading message="Loading Home..." />;
  }
  return (
    <div>
      <Sub_header/>
      <HolidayBooking/>
      <Festivalcalendar/>
      <HomeDestination/>
      <PopularPackages/>
      <Service/>    
      <HowItWorks/>
      <Faq/>
      {/* <Offer/> */}
      
      {/* <HomeContact/> */}
    </div>
  );
}