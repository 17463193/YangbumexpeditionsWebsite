import React, { useState } from "react";
import "./Faq.css";

const faqs = [
    {
      question: "What is the best time to visit Bhutan?",
      answer:
        "The best times to visit Bhutan are spring (March to May) and autumn (September to November), when the weather is pleasant and festivals are held.",
    },
    {
      question: "What cultural etiquette should I be aware of when visiting Bhutan?",
      answer:
        "Dress modestly, remove shoes before entering temples, avoid pointing your feet at religious objects, and always ask before taking photos of locals.",
    },
    {
      question: "Which is the cheapest season to travel in Bhutan?",
      answer:
        "July, August which is monsoon season and January february which is peak winter season is cheapest season to travel in Bhutan. Hotels are cheaper and transport are easily available at reasonable cost. There will be less tourist travelling at this time of the year.",
    },
    {
      question: "Are special permits required within Bhutan?",
      answer:
        "Yes, some restricted areas require additional permits, which your tour operator will help you obtain.",
    },
    {
      question: "What safety precautions should I take when traveling?",
      answer:
        "Stay aware of your surroundings, keep your belongings secure, avoid risky areas at night, and follow local guidelines.",
    },
  ];
  
const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <div className="faq-image">
        <img
          src="../assets/img/memorial.jpg"
          alt="FAQ Illustration"
        />
      </div>
      <div className="faq-content">
        <h2>Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <div
            className={`faq-items ${openIndex === index ? "open" : ""}`}
            key={index}
          >
            <button className="faq-questions" onClick={() => toggleFAQ(index)}>
              {faq.question}
              <span className="faq-icon">{openIndex === index ? "-" : "+"}</span>
            </button>
            {openIndex === index && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
