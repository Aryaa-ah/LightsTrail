import './App.css'
import React from 'react';


import ResponsiveAppBar from './components/Navbar.tsx'


interface Location {
  city_country: string;
  latitude: number;
  longitude: number;
}

function App() {
  const [location, setLocation] = React.useState<Location>({
    city_country: 'Selsect Location', 
    latitude: 0,
    longitude: 0,
  });
  
  return (
   
        <div>
          <ResponsiveAppBar  location={location} setLocation={setLocation} />
          
        </div>
        
    
    
  );
}

export default App;
