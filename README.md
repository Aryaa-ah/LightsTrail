# 🌠 LightsTrail

LightsTrail is a web-based application designed to provide real-time aurora predictions and forecasts, enabling users to experience and track the Northern Lights at any location. Tailored for aurora enthusiasts, travelers, and photographers, the app delivers accurate aurora forecasts based on the user’s location. Users can subscribe to alerts for receiving notifications when auroras are predicted in their area, either in real-time or triggered by specific Index thresholds. Additionally, LightsTrail fosters a community-driven platform where users can share photos, experiences, and sightings and gain insights into the best viewing spots through location-tagged posts. With a blend of observation technology and social engagement, the app offers a dynamic and engaging platform for aurora enthusiasts worldwide.

## ✨ Features

### Core Features

<details>
<summary>🎯 Aurora Forecasting System</summary>

- Real-time KP index monitoring
- Custom probability algorithms
- Weather condition integration
- Solar wind speed tracking
- Magnetic field analysis
- Location-based predictions

</details>

<details>
<summary>📸 Community Gallery</summary>

- Photo sharing capabilities
- Location tagging
- Search functionality
- Photo management tools (Upload, Edit, Update, Delete)

</details>

<details>
<summary>🔔 Alert System</summary>

- Customizable KP thresholds
- Email notifications
- Location-based alerts
- Real-time updates
- Custom alert schedules
</details>

<details>
<summary>🗺️ Live Best Locations</summary>

- Real-time probability calculation
- Weather condition integration
- Accessibility ratings
- Interactive mapping
- Location suggestions
- Viewing spot details

</details>

<details>
<summary>📖 Information Center</summary>

- Aurora glossary
- Educational resources
- Real-time data visualization
- Historical data analysis
- Weather information
- Viewing guides

</details>

<details>
<summary>🌍 Multi-language Support</summary>

- English
- Hindi
- Kannada
</details>

### Additional Features

<details>
<summary>🎥 WebCam Integration</summary>

- Live aurora feeds
- Multiple viewing locations 

</details>

<details>
<summary>📱 PWA Features</summary>

- Install prompts
- Cache management
- Service worker integration

</details>

## 🛠️ Tech Stack

<details>
<summary>Frontend Technologies</summary>

- **Core**: React 18.3.1, TypeScript 5.7.2
- **UI Framework**: Material-UI, Tailwind CSS
- **State Management**: Redux Toolkit
- **Maps**: MapBox GL, Leaflet
- **Data Visualization**: Recharts
- **Animations**: Framer Motion
- **Internationalization**: i18next
- **HTTP Client**: Axios

</details>

<details>
<summary>Backend Technologies</summary>

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT, Passport.js
- **File Handling**: Multer
- **Email Service**: Nodemailer

</details>

<details>
<summary>External APIs</summary>

- NOAA API (Aurora data)
- OpenWeather API
- Google OAuth
- Mapbox API
- Node Mailer

</details>

## 🚀 Getting Started

### Prerequisites

```bash
node -v # v18.x or higher
npm -v  # 9.x or higher
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/lightstrail.git
```

2. Install dependencies
```bash
# Frontend
cd app
npm install

# Backend
cd service
npm install
```

3. Set up environment variables
```bash
# Frontend (.env)
VITE_API_URL=
VITE_MAPBOX_TOKEN=
VITE_GOOGLE_CLIENT_ID=

# Backend (.env)
MONGODB_URI=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

4. Start development servers
```bash
# Frontend
npm run dev

# Backend
npm run dev
```

## 🏗️ Architecture

### Domain Model

<details>
<summary>View Domain Model</summary>

```mermaid
classDiagram

    class User {
<<Entity>>
 
        +UserId id
 
        +String email
 
        +String username
 
        +String password
 
        +String firstName
 
        +String lastName
 
        +String provider
 
        +UserPreferences preferences
 
        +DateTime createdAt
 
    }
 
    class AlertPreferences {
<<Entity>>
 
        +UserId userId
 
        +Number kpThreshold
 
        +String email
 
        +Location location
 
        +Boolean isEnabled
 
        +DateTime lastNotificationSent
 
        +DateTime createdAt
 
        +setPreferences()
 
        +checkThreshold()
 
    }
 
    class AuroraObservation {
<<Entity>>
 
        +ObservationId id
 
        +UserId observerId
 
        +LocationId locationId
 
        +ObservationDateTime dateTime
  
        +WeatherConditions conditions
 
        +recordObservation()
 
    }
 
    class Location {
<<Entity>>
 
        +LocationId id
 
        +String cityName
 
        +GeoCoordinates coordinates
 
        +Number probability
 
        +validateLocation()
 
    }
 
    class AuroraForecast {
<<Entity>>
 
        +ForecastId id
 
        +ForecastDateTime timestamp
 
        +Number kpIndex
 
        +Number bz
 
        +Number speed
 
        +Number probability
 
        +String temperature
 
        +String precipitation
 
        +String windSpeed
 
        +String cloudCover
 
        +String isDay
 
        +Number uvIndex
 
        +calculateProbability()
 
    }
 
    class Gallery {
<<Entity>>
 
        +PhotoId id
 
        +UserId userId
 
        +String url
 
        +String location
 
        +String userName
 
        +DateTime createdAt
 
        +String fileName
 
        +uploadPhoto()
 
        +deletePhoto()
 
        +updatePhoto()
 
    }
 
   
 
    class GeoCoordinates {
<<Value Object>>
 
        +Decimal latitude
 
        +Decimal longitude
 
    }
 
    class WeatherConditions {
<<Value Object>>
 
        +Number temperature
 
        +Number cloudCover
 
        +Number windSpeed
 
        +Number precipitation
 
    }
 
 
    %% Relationships
 
    User "1" --o "*" AuroraObservation : creates
 
    User "1" --o "*" Gallery : posts
 
    User "1" --o "1" AlertPreferences : configures
 
    AuroraObservation "1" --* "1" WeatherConditions : includes
 
    AuroraObservation "*" --o "1" Location : recorded at
 
    Location "1" --* "1" GeoCoordinates : has
 
    AuroraForecast "*" --o "1" Location : predicts for
```

</details>

## 👥 Team

-Pooja Doddannavar: doddannavar.p@northeastern.edu

-Aryaa Hanamar: hanamar.a@northeastern.edu

-Samarth Rayar: rayar.s@northeastern.edu

-Siddharth Nashikkar: nashikkar.s@northeastern.edu

</div>
