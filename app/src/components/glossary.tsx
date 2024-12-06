import React, { useEffect, useState } from "react";
import axios from "axios";

const Glossary = () => {
  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    const fetchGlossary = async () => {
      try {
        const response = await axios.get("/api/glossary");
        setFaqData(response.data);
      } catch (error) {
        console.error("Error fetching glossary data:", error);
      }
    };

    fetchGlossary();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Glossary</h1>
      <div>
        {faqData.map((faq: any, index: number) => (
          <div key={index} style={{ marginBottom: "15px" }}>
            <h3>{faq.term}</h3>
            <p>{faq.definition}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Glossary;
