import AuroraDashboard from '../components/AuroraDashboard.tsx'
import SolarWindInterface from '../components/SolarWindInterface.jsx'
interface HomeProps{
    latitude: number,
    longitude: number
}

const Home = ({ latitude, longitude }: HomeProps) => {
    return (
        <div style={{paddingTop:'74px'}}>
          
            <AuroraDashboard latitude={latitude} longitude={longitude} />
            <SolarWindInterface/>
            
          
        </div>
    );


};

export default Home;