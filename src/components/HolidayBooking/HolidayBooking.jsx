import React from 'react';
import './HolidayBooking.css';
import { FaBus, FaBed, FaHiking, FaCalendarPlus } from 'react-icons/fa';

export default function HolidayBooking() {
  return (
    <div className="booking-container">
      <div className="image-section">
        <div className="yellow-shape"></div>
        <div className="pink-shape"></div>
       
        <img
          src= "../assets/img/images.jpg" // Replace with your own image path if needed
          alt="Bhutan"
          className="main-image"
        />
        <div className="dotted-line"></div>
        <div className="red-dot"></div>
      </div>

      <div className="text-section">
        <h2>Book a journey through Bhutan, designed around your unique travel preferences</h2>

        <div className="feature">
          <FaBus className="icon" />
          <div>
            <strong>Arrival and departure included</strong>
            <p>Travel from any starting point and return from any destination in Bhutan.</p>
          </div>
        </div>

        <div className="feature">
          <FaBed className="icon" />
          <div>
            <strong>Choose your accommodation</strong>
            <p>Select from traditional lodges to modern hotels.</p>
          </div>
        </div>

        <div className="feature">
          <FaHiking className="icon" />
          <div>
            <strong>Additional activities</strong>
            <p>Add guided hikes, cultural experiences, or wellness retreats to your itinerary.</p>
          </div>
        </div>

        <div className="feature">
          <FaCalendarPlus className="icon" />
          <div>
            <strong>Customise the duration of your trip</strong>
            <p>Extend your stay and explore Bhutan at your own pace.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
