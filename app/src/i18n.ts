import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { Dashboard } from '@mui/icons-material';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          menu: {
            gallery: 'Gallery',
            glossary: 'Glossary',
            weatherForecast: 'Weather Forecast',
            profile: 'Profile',
            settings: 'Settings',
            logout: 'Logout',
            location: 'Location',
            selectLocation: 'Select Location',
            search: 'Search',
            appName: 'Lights Trail',
            openSettings: 'Open settings',
            changeLanguage: 'Change Language',
            user: 'User'
          },
          dashboard: {
            kpIndex: 'KP Index',
            magneticField: 'Magnetic Field (Bz)',
            solarWind: 'Solar Wind Speed',
            temperature: 'Temperature',
            precipitation: 'Precipitation',
            windSpeed: 'Wind Speed',
            uvIndex: 'UV Index',
            title: 'Aurora Forecast'
          },
          units: {
            kmPerSec: 'km/s',
            kmPerHour: 'km/h',
            celsius: '°C',
            mm: 'mm'
          }
        }
      },
      hi: {
        translation: {
          menu: {
            gallery: 'गैलरी',
            glossary: 'शब्दकोश',
            weatherForecast: 'मौसम पूर्वानुमान',
            profile: 'प्रोफ़ाइल',
            settings: 'सेटिंग्स',
            logout: 'लॉग आउट',
            location: 'स्थान',
            selectLocation: 'स्थान चुनें',
            search: 'खोजें',
            appName: 'लाइट्स ट्रेल',
            openSettings: 'सेटिंग्स खोलें',
            changeLanguage: 'भाषा बदलें',
            user: 'उपयोगकर्ता'
          },
          dashboard: {
            kpIndex: 'केपी इंडेक्स',
            magneticField: 'चुंबकीय क्षेत्र (Bz)',
            solarWind: 'सौर वायु गति',
            temperature: 'तापमान',
            precipitation: 'वर्षा',
            windSpeed: 'हवा की गति',
            uvIndex: 'यूवी सूचकांक',
            title: 'ऑरोरा पूर्वानुमान'
          },
          units: {
            kmPerSec: 'किमी/से',
            kmPerHour: 'किमी/घंटा',
            celsius: '°से',
            mm: 'मिमी'
          }
        }
      },
      kn: {
        translation: {
          menu: {
            gallery: 'ಗ್ಯಾಲರಿ',
            glossary: 'ಪದಕೋಶ',
            weatherForecast: 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ',
            profile: 'ಪ್ರೊಫೈಲ್',
            settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
            logout: 'ಲಾಗ್ ಔಟ್',
            location: 'ಸ್ಥಳ',
            selectLocation: 'ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
            search: 'ಹುಡುಕಿ',
            appName: 'ಲೈಟ್ಸ್ ಟ್ರೇಲ್',
            openSettings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ತೆರೆಯಿರಿ',
            changeLanguage: 'ಭಾಷೆ ಬದಲಾಯಿಸಿ',
            user: 'ಬಳಕೆದಾರ'
          },
          dashboard: {
            kpIndex: 'ಕೆಪಿ ಸೂಚ್ಯಂಕ',
            magneticField: 'ಕಾಂತೀಯ ಕ್ಷೇತ್ರ (Bz)',
            solarWind: 'ಸೌರ ಗಾಳಿಯ ವೇಗ',
            temperature: 'ತಾಪಮಾನ',
            precipitation: 'ಮಳೆ',
            windSpeed: 'ಗಾಳಿಯ ವೇಗ',
            uvIndex: 'ಯುವಿ ಸೂಚ್ಯಂಕ',
            title: 'ಅರೋರಾ ಮುನ್ಸೂಚನೆ'
          },
          units: {
            kmPerSec: 'ಕಿ.ಮೀ/ಸೆ',
            kmPerHour: 'ಕಿ.ಮೀ/ಗಂ',
            celsius: '°ಸೆ',
            mm: 'ಮಿ.ಮೀ'
          }
        }
     }
    }
  });

export default i18n;