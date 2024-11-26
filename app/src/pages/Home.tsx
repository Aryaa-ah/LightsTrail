import AuroraDashboard from '../components/AuroraDashboard.tsx'

interface HomeProps{
    latitude: number,
    longitude: number
}

const Home = ({ latitude, longitude }: HomeProps) => {
    return (
        <div style={{paddingTop:'74px'}}>
          
            <AuroraDashboard latitude={latitude} longitude={longitude} />
            
          
        </div>
    );


};

export default Home;