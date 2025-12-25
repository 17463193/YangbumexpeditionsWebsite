import React, { useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import emailjs from "@emailjs/browser";
import "./FestivalCalendar.css";

const festivals = [
{ name: "Lhamoi Dromchhen", town: "Trongsa", start: "Feb 22, 2026", end: "Feb 24, 2026" },
  { name: "Punakha Drubchen", town: "Punakha", start: "Feb 22, 2026", end: "Feb 24, 2026" },
  { name: "Punakha Tshechu", town: "Punakha", start: "Feb 26, 2026", end: "Feb 28, 2026" },
  { name: "Tharpaling Thongdrol", town: "Bumthang", start: "Mar 03, 2026", end: "Mar 03, 2026" },
  { name: "Tangsibi Mani", town: "Bumthang", start: "Mar 04, 2026", end: "Mar 06, 2026" },
  { name: "Chhorten Kora Festival", town: "Trashiyangtse", start: "Mar 03, 2026", end: "Mar 19, 2026" },
  { name: "Gomphukora Festival", town: "Trashigang", start: "Mar 26, 2026", end: "Mar 28, 2026" },
  { name: "Talo Tshechu", town: "Punakha", start: "Mar 26, 2026", end: "Mar 28, 2026" },
  { name: "Gasa Tshechu", town: "Gasa", start: "Mar 26, 2026", end: "Mar 28, 2026" },
  { name: "Zhemgang Tshechu", town: "Zhemgang", start: "Mar 26, 2026", end: "Mar 28, 2026" },
  { name: "Paro Tshechu", town: "Paro", start: "Mar 29, 2026", end: "Apr 02, 2026" },
  { name: "Rhododendron Festival", town: "Thimphu (Lamperi Park)", start: "Apr 13, 2026", end: "Apr 14, 2026" },
  { name: "Domkhar Tshechu", town: "Bumthang", start: "Apr 26, 2026", end: "Apr 28, 2026" },
  { name: "Ura Yakchoe", town: "Bumthang", start: "Apr 28, 2026", end: "May 02, 2026" },
  { name: "Nimalung Tshechu", town: "Bumthang", start: "Jun 22, 2026", end: "Jun 24, 2026" },
  { name: "Kurjey Tshechu", town: "Bumthang", start: "Jun 24, 2026", end: "Jun 24, 2026" },
  { name: "Tour of the Dragon (Bike Race)", town: "Bumthang–Thimphu", start: "Sep 05, 2026", end: "Sep 05, 2026" },
  { name: "Thimphu Drubchen", town: "Thimphu", start: "Sep 17, 2026", end: "Sep 17, 2026" },
  { name: "Haa Tshechu", town: "Haa", start: "Sep 19, 2026", end: "Sep 21, 2026" },
  { name: "Wangdue Tshechu", town: "Wangduephodrang", start: "Sep 19, 2026", end: "Sep 21, 2026" },
  { name: "Tamshing Phala Chhoepa", town: "Bumthang", start: "Sep 21, 2026", end: "Sep 23, 2026" },
  { name: "Thimphu Tshechu", town: "Thimphu", start: "Sep 21, 2026", end: "Sep 23, 2026" },
  { name: "Gangtey Tshechu", town: "Wangduephodrang", start: "Sep 24, 2026", end: "Sep 26, 2026" },
  { name: "Thangbi Mewang", town: "Bumthang", start: "Sep 26, 2026", end: "Sep 27, 2026" },
  { name: "Jhomolhari Mountain Festival", town: "Thimphu (Dangochong)", start: "Oct 14, 2026", end: "Oct 15, 2026" },
  { name: "Pemagatshel Tshechu", town: "Pemagatshel", start: "Oct 18, 2026", end: "Oct 21, 2026" },
  { name: "Jakar Tshechu", town: "Bumthang", start: "Oct 18, 2026", end: "Oct 21, 2026" },
  { name: "Chhukha Tshechu", town: "Chhukha", start: "Oct 19, 2026", end: "Oct 21, 2026" },
  { name: "Dechenphu Tshechu", town: "Thimphu", start: "Oct 21, 2026", end: "Oct 21, 2026" },
  { name: "Jambay Lhakhang Drup", town: "Bumthang", start: "Oct 26, 2026", end: "Oct 29, 2026" },
  { name: "Traakar Duchhoed", town: "Bumthang", start: "Oct 27, 2026", end: "Oct 29, 2026" },
  { name: "Black-Necked Crane Festival", town: "Phobjikha, Wangdue", start: "Nov 11, 2026", end: "Nov 11, 2026" },
  { name: "Goenpai Drupchen", town: "Trongsa", start: "Nov 14, 2026", end: "Nov 16, 2026" },
  { name: "Mongar Tshechu", town: "Mongar", start: "Nov 17, 2026", end: "Nov 19, 2026" },
  { name: "Trashigang Tshechu", town: "Trashigang", start: "Nov 18, 2026", end: "Nov 20, 2026" },
  { name: "Phuntsholing Tshechu", town: "Chhukha (Phuntsholing)", start: "Nov 17, 2026", end: "Nov 19, 2026" },
  { name: "Jambay Lhakhang Singye Cham", town: "Bumthang", start: "Nov 24, 2026", end: "Nov 24, 2026" },
  { name: "Nalakhar Tshechu", town: "Bumthang", start: "Nov 24, 2026", end: "Nov 26, 2026" },
  { name: "Druk Wangyel Tshechu", town: "Dochula, Thimphu", start: "Dec 13, 2026", end: "Dec 13, 2026" },
  { name: "Trongsa Tshechu", town: "Trongsa", start: "Dec 17, 2026", end: "Dec 21, 2026" },
  { name: "Lhuentse Tshechu", town: "Lhuentse", start: "Dec 17, 2026", end: "Dec 21, 2026" },
  { name: "Samdrupjongkhar Tshechu", town: "Samdrupjongkhar", start: "Dec 22, 2026", end: "Dec 24, 2026" },
  { name: "Nabji Lhakhang Drup", town: "Trongsa (Nabji)", start: "Dec 24, 2026", end: "Dec 26, 2026" }
];

export default function Festivalcalendar() {
  const form = useRef();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleClick = (festival) => {
    alert(`You clicked on ${festival.name}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendEmail = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus({ success: false, message: "Please fill in all fields" });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    emailjs
       .sendForm('service_g5vy013', 'template_vpwnoob', form.current, {
        publicKey: 'X4tpbC_P9duLCM_9u',
      })
      .then(
        () => {
          setSubmitStatus({ success: true, message: "Message sent successfully!" });
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          setSubmitStatus({ success: false, message: "Failed to send message. Try again." });
          console.error(error);
        }
      )
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="festival-contact-wrapper">
      {/* Left: Festival Table */}
      <div className="festival-table-section">
        <h2 className="section-title">Upcoming Festivals</h2>
        <table className="festival-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Town</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {festivals.map((festival, index) => (
              <tr key={index}>
                <td>
                  <span className="festival-link">{festival.name}</span>
                </td>
                <td>{festival.town}</td>
                <td>{festival.start}</td>
                <td>{festival.end}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right: Contact Form */}
      <div className="festival-contact-form">
        <h2>Send a Message</h2>
        <form ref={form} onSubmit={sendEmail}>
          {submitStatus && (
            <div className={`status-message ${submitStatus.success ? "success" : "error"}`}>
              {submitStatus.message}
            </div>
          )}

          <label>Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />

          <label>Email *</label>
          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />

          <label>Message *</label>
          <textarea
            name="message"
            placeholder="Your message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          ></textarea>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <FaSpinner className="spinner" /> Sending...
              </>
            ) : (
              <>
                <MdSend /> Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
