import AuroraDashboard from '../components/AuroraDashboard.tsx'
import SolarWindInterface from '../components/SolarWindInterface.jsx'
import NorthernHemisphere from '../components/Northern.tsx'
import SouthernHemisphere from '../components/Southern.tsx'
import KpIndexInterface from '../components/KpIndexInterface.tsx'
interface HomeProps{
    latitude: number,
    longitude: number
}

const Home = ({ latitude, longitude }: HomeProps) => {
    return (
        <div style={{paddingTop:'74px'}}>
          
            <AuroraDashboard latitude={latitude} longitude={longitude} />
            <SolarWindInterface/>
            <KpIndexInterface/>
            <NorthernHemisphere/>
            <SouthernHemisphere/>
          
        </div>
    );


};

export default Home;