import React from "react";

const Glossary = () => {
  const faqData = [
    {
      question: "What is Kp Index?",
      answer:
        "The Kp Index is a global geomagnetic storm index that measures disturbances in the Earth's magnetic field caused by solar wind.",
    },
    {
      question: "What is Solar Wind Speed?",
      answer:
        "Solar Wind Speed measures the velocity of charged particles ejected from the Sun.",
    },
    {
      question: "What is Bz?",
      answer:
        "Bz is a component of the interplanetary magnetic field. A southward Bz enhances the auroral activity.",
    },
    {
      question: "How is UV Index measured?",
      answer:
        "The UV Index indicates the level of UV radiation and its impact on human health. A higher value means more risk.",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Glossary</h1>
      <div>
        {faqData.map((faq, index) => (
          <div key={index} style={{ marginBottom: "15px" }}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Glossary;
