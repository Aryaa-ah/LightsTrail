import React from "react";

interface WebCam {
  name: string;
  country: string;
  location: string;
  youtubeLink: string;
}
declare var window: any;

const WebCamPage: React.FC = () => {
  const tableList: WebCam[] = [
    {
      name: "Lyngen North Aurora Cam",
      country: "Norway",
      location: "Rotsund",
      youtubeLink:
        "https://www.youtube.com/live/SY6DOBZ2hPk?si=0Pfi1txt2DtKKdcW",
    },
    {
      name: "Aurora Borealis (LIVE!)",
      country: "Finland",
      location: "Utsjoki",
      youtubeLink:
        "https://www.youtube.com/live/dvNb31_0D68?si=-ziY3Mz1baUKT6Ia",
    },
    {
      name: "Fairbanks Aurora Camera",
      country: "United States",
      location: "Fairbanks,AK",
      youtubeLink:
        "https://www.youtube.com/live/O52zDyxg5QI?si=dntH2-y29Bwq8yP_",
    },
    {
      name: "Northern Studies Center",
      country: "Canada",
      location: "Churchill, MB",
      youtubeLink:
        "https://www.youtube.com/live/a0i1Kg6fROg?si=mOS0SugFla1htMnA",
    },
    {
      name: "Queenstown Roundshot",
      country: "New Zealand",
      location: "Queenstown",
      youtubeLink:
        "https://www.youtube.com/live/a0i1Kg6fROg?si=mOS0SugFla1htMnA",
    },
    {
      name: "Kjell Henriksen Observatory",
      country: "Norway",
      location: "Longyearbyen, Svalbard",
      youtubeLink:
        "https://www.youtube.com/live/a0i1Kg6fROg?si=mOS0SugFla1htMnA",
    },
    {
      name: "Northern Studies Center",
      country: "Canada",
      location: "Churchill, MB",
      youtubeLink:
        "https://www.youtube.com/live/a0i1Kg6fROg?si=mOS0SugFla1htMnA",
    },
  ];

  const handleClick = (link: string): void => {
    window.open(link, "_blank");
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 74px)",
        marginTop: "74px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <div
        style={{
          flex: "1",
          padding: "20px",
        }}
      >
        <div
          style={{
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "white",
            }}
          >
            See The Aurora - Webcams
          </h1>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "20px",
            marginBottom: "20px", // Added margin bottom for footer spacing
          }}
        >
          {tableList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleClick(item.youtubeLink)}
              style={{
                backgroundColor: "#1e1e2f",
                padding: "20px",
                borderRadius: "10px",
                cursor: "pointer",
                color: "white",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                textAlign: "center",
              }}
              // onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
              //   e.currentTarget.sx.transform = 'scale(1.05)';
              //   e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
              // }}
              // onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
              //   e.currentTarget.style.transform = 'scale(1)';
              //   e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
              // }}
            >
              <h2 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                {item.name}
              </h2>
              <p style={{ fontSize: "1rem", marginBottom: "10px" }}>
                {item.country}
              </p>
              <p style={{ fontSize: "0.9rem", color: "#b0b0b0" }}>
                {item.location}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default WebCamPage;
