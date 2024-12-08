
import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useTheme, Typography } from '@mui/material';

interface GlossaryItem {
  question: string;
  answer: string;
}

const GlossaryContainer = styled.div`
  padding: 8rem;
  max-width: 1200px;
  margin: 0 auto;
  color: white;
  background: transparent;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  position: relative;
  color: white;
`;

const GlossaryGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GlossaryItemContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Question = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: white;
`;

const Answer = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  font-size: 0.95rem;
`;

const LanguageSelector = styled.div`
  margin-bottom: 1rem;
  
  button {
    margin-right: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const Glossary: React.FC = () => {
  const { t, i18n } = useTranslation();


  // Use type assertion to tell TypeScript that this is an array of GlossaryItem
  const glossaryItems = t('glossary.items', { returnObjects: true }) as GlossaryItem[];
  const theme = useTheme();
  return (
    <GlossaryContainer>
      
      <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                margineTop: '180px',
                marginBottom: '50px',
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(45deg, #84fab0 0%, #8fd3f4 100%)"
                    : "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
              }}
            >
                {t('glossary.title')}
            </Typography>
      
      <GlossaryGrid>
        {Array.isArray(glossaryItems) && glossaryItems.map((item: GlossaryItem, index: number) => (
          <GlossaryItemContainer key={index}>
            <Question>{item.question}</Question>
            <Answer>{item.answer}</Answer>
          </GlossaryItemContainer>
        ))}
      </GlossaryGrid>
    </GlossaryContainer>
  );
};

export default Glossary;