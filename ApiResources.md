# Aurora Tracker API Resources

## 1. Authentication
- `POST /signup` - Register new user with email and password
- `POST /login` - Authenticate user and get token

## 2. Location Services
- `GET /location/{cityName}` - Get longitude and latitude for a city

## 3. Gallery Management
- `GET /gallery/photos` - List photos with pagination
- `POST /gallery/photos` - Upload new photo
- `GET /gallery/photos/{photoId}` - Get single photo details
- `PUT /gallery/photos/{photoId}` - Update photo information
- `DELETE /gallery/photos/{photoId}` - Remove photo

## 4. Aurora Forecast
- `GET /auroraforecast` - Get aurora forecast by coordinates

## Data Models

### User
```json
{
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string"
}
```

### Location
```json
{
  "cityName": "string",
  "longitude": "number",
  "latitude": "number"
}
```

### Photo
```json
{
  "id": "string",
  "url": "string",
  "userName": "string",
  "location": "string",
  "createdAt": "datetime"
}
```

### AuroraForecast
```json
{
  "kpIndex": "string",
  "bz": "string",
  "speed": "string",
  "longitude": "number",
  "latitude": "number"
}
```
