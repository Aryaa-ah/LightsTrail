const glossaryData = [
    {
      term: "Kp Index",
      definition:
        "A global index for measuring geomagnetic activity, useful in aurora predictions.",
    },
    {
      term: "Solar Wind Speed",
      definition: "The velocity of particles emitted from the Sun.",
    },
    {
      term: "Bz",
      definition:
        "A component of the interplanetary magnetic field. A southward Bz enhances auroral activity.",
    },
    {
      term: "UV Index",
      definition:
        "A measure of ultraviolet radiation from the Sun and its impact on human health.",
    },
  ];
  
  export function   getGlossary(req, res) {
    res.status(200).json(glossaryData);
  }
  