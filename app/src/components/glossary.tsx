// src/pages/GlossaryPage.tsx
import React, { useState, useEffect } from "react";
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";

// Define the structure of glossary data.
interface GlossaryTerm {
  term: string;
  definition: string;
}

const GlossaryPage = () => {
  const [glossaryData, setGlossaryData] = useState<GlossaryTerm[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch glossary data from the backend (assuming an endpoint exists)
    fetch('/api/glossary')  // Adjust to your API route
      .then(response => response.json())
      .then(data => setGlossaryData(data))
      .catch(err => console.error("Error fetching glossary data: ", err));
  }, []);

  return (
    <Container sx={{ marginTop: 8 }}>
      <Typography variant="h4" gutterBottom>
        Glossary
      </Typography>
      {glossaryData.map((term, index) => (
        <Accordion key={index} sx={{ marginBottom: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id={`panel-${index}`}>
            <Typography variant="h6">{term.term}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">{term.definition}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};

export default GlossaryPage;
