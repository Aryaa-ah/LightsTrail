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
          glossary: {
    title: "Glossary",
    items: [
      {
        "question": "What is Kp Index?",
        "answer": "The Kp Index is a global geomagnetic storm index that measures disturbances in the Earth's magnetic field caused by solar wind."
    },
    {
        "question": "What is Solar Wind Speed?",
        "answer": "Solar Wind Speed measures the velocity of charged particles ejected from the Sun."
    },
    {
        "question": "What is Bz?",
        "answer": "Bz is a component of the interplanetary magnetic field. A southward Bz enhances the auroral activity."
    },
    {
        "question": "How is UV Index measured?",
        "answer": "The UV Index indicates the level of UV radiation and its impact on human health. A higher value means more risk."
    },
    {
        "question": "What is Auroral Oval?",
        "answer": "The Auroral Oval is the region around the magnetic poles where auroras are most frequently observed. It is typically an oval-shaped area."
    },
    {
        "question": "What is a Geomagnetic Storm?",
        "answer": "A Geomagnetic Storm is a temporary disturbance of the Earth's magnetosphere caused by solar wind and solar flares. These storms can enhance auroral activity."
    },
    {
        "question": "What is the Interplanetary Magnetic Field (IMF)?",
        "answer": "The Interplanetary Magnetic Field (IMF) is the magnetic field carried with the solar wind from the Sun. The Bz component of the IMF is crucial for auroral activity."
    },
    {
        "question": "What is a Coronal Mass Ejection (CME)?",
        "answer": "A Coronal Mass Ejection (CME) is a significant release of plasma and magnetic field from the solar corona. CMEs can cause strong geomagnetic storms and auroras."
    },
    {
        "question": "What is Auroral Activity?",
        "answer": "Auroral Activity refers to the occurrence and intensity of auroras, influenced by solar wind, geomagnetic storms, and the Kp Index."
    },
    {
        "question": "What are Solar Flares?",
        "answer": "Solar Flares are sudden eruptions of energy on the solar surface, which can increase solar wind speed and cause geomagnetic storms."
    },
    {
        "question": "What is the Hemispherical Power Index (HPI)?",
        "answer": "The Hemispherical Power Index (HPI) is a measure predicting the potential for seeing auroras and the time of night they are likely to appear."
    },
    {
        "question": "What is an Auroral Forecast?",
        "answer": "An Auroral Forecast provides predictions about the likelihood and intensity of auroras based on solar and geomagnetic data."
    },
    {
        "question": "What is the Magnetosphere?",
        "answer": "The Magnetosphere is the region around the Earth dominated by the Earth's magnetic field, which interacts with solar wind and influences auroral activity."
    },
    {
        "question": "What is Aurora Borealis?",
        "answer": "Aurora Borealis, also known as the Northern Lights, are natural light displays predominantly seen in high-latitude regions around the Arctic."
    },
    {
        "question": "What is Aurora Australis?",
        "answer": "Aurora Australis, also known as the Southern Lights, are natural light displays predominantly seen in high-latitude regions around the Antarctic."
    }
    ]
  },
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
            title: 'Aurora Forecast',
            probability: 'Aurora Probability'
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
          glossary: {
            title: "शब्दावली",
            items: [
              {
                "question": "Kp सूचकांक क्या है?",
                "answer": "Kp सूचकांक एक वैश्विक भू-चुंबकीय तूफान सूचकांक है जो सौर पवन के कारण पृथ्वी के चुंबकीय क्षेत्र में होने वाले विक्षोभ को मापता है।"
            },
            {
                "question": "सौर पवन गति क्या है?",
                "answer": "सौर पवन गति सूर्य से निकले आवेशित कणों की गति को मापती है।"
            },
            {
                "question": "Bz क्या है?",
                "answer": "Bz अंतरग्रहीय चुंबकीय क्षेत्र का एक घटक है। दक्षिण की ओर Bz ऑरोरल गतिविधि को बढ़ाता है।"
            },
            {
                "question": "UV सूचकांक कैसे मापा जाता है?",
                "answer": "UV सूचकांक UV विकिरण के स्तर और इसके मानव स्वास्थ्य पर प्रभाव को इंगित करता है। उच्च मूल्य का मतलब अधिक जोखिम है।"
            },
            {
                "question": "ऑरोरल ओवल क्या है?",
                "answer": "ऑरोरल ओवल चुंबकीय ध्रुवों के चारों ओर का क्षेत्र है जहां ऑरोरा सबसे अधिक बार देखा जाता है। यह आमतौर पर एक अंडाकार आकार का क्षेत्र होता है।"
            },
            {
                "question": "भू-चुंबकीय तूफान क्या है?",
                "answer": "भू-चुंबकीय तूफान सौर पवन और सौर ज्वालाओं के कारण पृथ्वी के चुंबकीय क्षेत्र का एक अस्थायी विक्षोभ है। ये तूफान ऑरोरल गतिविधि को बढ़ा सकते हैं।"
            },
            {
                "question": "अंतरग्रहीय चुंबकीय क्षेत्र (IMF) क्या है?",
                "answer": "अंतरग्रहीय चुंबकीय क्षेत्र (IMF) वह चुंबकीय क्षेत्र है जो सौर पवन के साथ सूर्य से आता है। IMF का Bz घटक ऑरोरल गतिविधि के लिए महत्वपूर्ण है।"
            },
            {
                "question": "कोरोनल मास इजेक्शन (CME) क्या है?",
                "answer": "कोरोनल मास इजेक्शन (CME) सौर कोरोना से प्लाज्मा और चुंबकीय क्षेत्र का एक महत्वपूर्ण रिलीज है। CME मजबूत भू-चुंबकीय तूफान और ऑरोरा का कारण बन सकता है।"
            },
            {
                "question": "ऑरोरल गतिविधि क्या है?",
                "answer": "ऑरोरल गतिविधि ऑरोरा की घटना और तीव्रता को संदर्भित करती है, जो सौर पवन, भू-चुंबकीय तूफान और Kp सूचकांक से प्रभावित होती है।"
            },
            {
                "question": "सौर ज्वालाएं क्या हैं?",
                "answer": "सौर ज्वालाएं सूर्य की सतह पर ऊर्जा के अचानक विस्फोट हैं, जो सौर पवन की गति को बढ़ा सकती हैं और भू-चुंबकीय तूफान का कारण बन सकती हैं।"
            },
            {
                "question": "हेमिस्फेरिकल पावर इंडेक्स (HPI) क्या है?",
                "answer": "हेमिस्फेरिकल पावर इंडेक्स (HPI) एक माप है जो ऑरोरा को देखने की संभावना और रात के समय की भविष्यवाणी करता है।"
            },
            {
                "question": "ऑरोरल पूर्वानुमान क्या है?",
                "answer": "ऑरोरल पूर्वानुमान सौर और भू-चुंबकीय डेटा के आधार पर ऑरोरा की संभावना और तीव्रता के बारे में भविष्यवाणियां प्रदान करता है।"
            },
            {
                "question": "चुंबकमंडल क्या है?",
                "answer": "चुंबकमंडल पृथ्वी के चारों ओर का क्षेत्र है जो पृथ्वी के चुंबकीय क्षेत्र द्वारा प्रभुत्व में है, जो सौर पवन के साथ बातचीत करता है और ऑरोरल गतिविधि को प्रभावित करता है।"
            },
            {
                "question": "ऑरोरा बोरेलिस क्या है?",
                "answer": "ऑरोरा बोरेलिस, जिसे उत्तरी रोशनी भी कहा जाता है, प्राकृतिक प्रकाश प्रदर्शन हैं जो मुख्य रूप से आर्कटिक के आसपास के उच्च अक्षांश क्षेत्रों में देखे जाते हैं।"
            },
            {
                "question": "ऑरोरा ऑस्ट्रेलिस क्या है?",
                "answer": "ऑरोरा ऑस्ट्रेलिस, जिसे दक्षिणी रोशनी भी कहा जाता है, प्राकृतिक प्रकाश प्रदर्शन हैं जो मुख्य रूप से अंटार्कटिक के आसपास के उच्च अक्षांश क्षेत्रों में देखे जाते हैं।"
            }
            ]
          },
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
          glossary: {
            title: "ಶಬ್ದಕೋಶ",
            items: [{
              "question": "Kp ಸೂಚಕ ಏನು?",
              "answer": "Kp ಸೂಚಕವು ಸೌರ ಗಾಳಿಯಿಂದ ಉಂಟಾಗುವ ಭೂಮಿಯ ಚುಂಬಕ ಕ್ಷೇತ್ರದಲ್ಲಿ ಉಂಟಾಗುವ ಅಶಾಂತಿಯನ್ನು ಅಳೆಯುವ ಜಾಗತಿಕ ಭೂ-ಚುಂಬಕ ತೂಫಾನ ಸೂಚಕವಾಗಿದೆ."
          },
          {
              "question": "ಸೌರ ಗಾಳಿ ವೇಗ ಏನು?",
              "answer": "ಸೌರ ಗಾಳಿ ವೇಗವು ಸೂರ್ಯನಿಂದ ಹೊರಹೋಗುವ ವಿದ್ಯುತ್ ಕಣಗಳ ವೇಗವನ್ನು ಅಳೆಯುತ್ತದೆ."
          },
          {
              "question": "Bz ಏನು?",
              "answer": "Bz ಅಂತರಗ್ರಹ ಚುಂಬಕ ಕ್ಷೇತ್ರದ ಒಂದು ಘಟಕವಾಗಿದೆ. ದಕ್ಷಿಣದ Bz ಆರೋರಲ್ ಚಟುವಟಿಕೆಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ."
          },
          {
              "question": "UV ಸೂಚಕವನ್ನು ಹೇಗೆ ಅಳೆಯಲಾಗುತ್ತದೆ?",
              "answer": "UV ಸೂಚಕವು UV ಕಿರಣೋತ್ಪಾದನೆಯ ಮಟ್ಟವನ್ನು ಮತ್ತು ಅದರ ಮಾನವ ಆರೋಗ್ಯದ ಮೇಲೆ ಪರಿಣಾಮವನ್ನು ಸೂಚಿಸುತ್ತದೆ. ಹೆಚ್ಚಿನ ಮೌಲ್ಯವು ಹೆಚ್ಚು ಅಪಾಯವನ್ನು ಸೂಚಿಸುತ್ತದೆ."
          },
          {
              "question": "ಆರೋರಲ್ ಓವಲ್ ಏನು?",
              "answer": "ಆರೋರಲ್ ಓವಲ್ ಚುಂಬಕ ಧ್ರುವಗಳ ಸುತ್ತಲಿನ ಪ್ರದೇಶವಾಗಿದೆ, ಅಲ್ಲಿ ಆರೋರಾಗಳು ಹೆಚ್ಚು ಕಾಣಿಸುತ್ತವೆ. ಇದು ಸಾಮಾನ್ಯವಾಗಿ ಓವಲ್ ಆಕಾರದ ಪ್ರದೇಶವಾಗಿದೆ."
          },
          {
              "question": "ಭೂ-ಚುಂಬಕ ತೂಫಾನ ಏನು?",
              "answer": "ಭೂ-ಚುಂಬಕ ತೂಫಾನವು ಸೌರ ಗಾಳಿ ಮತ್ತು ಸೌರ ಜ್ವಾಲೆಗಳ ಕಾರಣದಿಂದ ಭೂಮಿಯ ಚುಂಬಕ ಕ್ಷೇತ್ರದ ತಾತ್ಕಾಲಿಕ ಅಶಾಂತಿಯಾಗಿದೆ. ಈ ತೂಫಾನಗಳು ಆರೋರಲ್ ಚಟುವಟಿಕೆಯನ್ನು ಹೆಚ್ಚಿಸಬಹುದು."
          },
          {
              "question": "ಅಂತರಗ್ರಹ ಚುಂಬಕ ಕ್ಷೇತ್ರ (IMF) ಏನು?",
              "answer": "ಅಂತರಗ್ರಹ ಚುಂಬಕ ಕ್ಷೇತ್ರ (IMF) ಸೌರ ಗಾಳಿಯೊಂದಿಗೆ ಸೂರ್ಯನಿಂದ ಬರುವ ಚುಂಬಕ ಕ್ಷೇತ್ರವಾಗಿದೆ. IMF ನ Bz ಘಟಕವು ಆರೋರಲ್ ಚಟುವಟಿಕೆಗೆ ಮುಖ್ಯವಾಗಿದೆ."
          },
          {
              "question": "ಕೋರೋನಲ್ ಮಾಸ್ ಇಜೆಕ್ಷನ್ (CME) ಏನು?",
              "answer": "ಕೋರೋನಲ್ ಮಾಸ್ ಇಜೆಕ್ಷನ್ (CME) ಸೌರ ಕೊರೋನಾದಿಂದ ಪ್ಲಾಸ್ಮಾ ಮತ್ತು ಚುಂಬಕ ಕ್ಷೇತ್ರದ ಪ್ರಮುಖ ಬಿಡುಗಡೆ. CME ಬಲವಾದ ಭೂ-ಚುಂಬಕ ತೂಫಾನ ಮತ್ತು ಆರೋರಾಗಳನ್ನು ಉಂಟುಮಾಡಬಹುದು."
          },
          {
              "question": "ಆರೋರಲ್ ಚಟುವಟಿಕೆ ಏನು?",
              "answer": "ಆರೋರಲ್ ಚಟುವಟಿಕೆ ಸೌರ ಗಾಳಿ, ಭೂ-ಚುಂಬಕ ತೂಫಾನ ಮತ್ತು Kp ಸೂಚಕದಿಂದ ಪ್ರಭಾವಿತವಾಗುವ ಆರೋರಾಗಳ ಸಂಭವನೆ ಮತ್ತು ತೀವ್ರತೆಯನ್ನು ಸೂಚಿಸುತ್ತದೆ."
          },
          {
              "question": "ಸೌರ ಜ್ವಾಲೆಗಳು ಏನು?",
              "answer": "ಸೌರ ಜ್ವಾಲೆಗಳು ಸೂರ್ಯನ ಮೇಲ್ಮೈಯಲ್ಲಿ ಉಂಟಾಗುವ ಶಕ್ತಿಯ ತಕ್ಷಣದ ಸ್ಫೋಟಗಳು, ಸೌರ ಗಾಳಿ ವೇಗವನ್ನು ಹೆಚ್ಚಿಸಬಹುದು ಮತ್ತು ಭೂ-ಚುಂಬಕ ತೂಫಾನವನ್ನು ಉಂಟುಮಾಡಬಹುದು."
          },
          {
              "question": "ಹೆಮಿಸ್ಫೆರಿಕಲ್ ಪವರ್ ಇಂಡೆಕ್ಸ್ (HPI) ಏನು?",
              "answer": "ಹೆಮಿಸ್ಫೆರಿಕಲ್ ಪವರ್ ಇಂಡೆಕ್ಸ್ (HPI) ಆರೋರಾಗಳನ್ನು ನೋಡುವ ಸಾಧ್ಯತೆಯನ್ನು ಮತ್ತು ರಾತ್ರಿ ಸಮಯವನ್ನು ಮುನ್ಸೂಚಿಸುತ್ತದೆ."
          },
          {
              "question": "ಆರೋರಲ್ ಮುನ್ಸೂಚನೆ ಏನು?",
              "answer": "ಆರೋರಲ್ ಮುನ್ಸೂಚನೆ ಸೌರ ಮತ್ತು ಭೂ-ಚುಂಬಕ ಡೇಟಾದ ಆಧಾರದ ಮೇಲೆ ಆರೋರಾಗಳ ಸಂಭವನೆ ಮತ್ತು ತೀವ್ರತೆಯ ಬಗ್ಗೆ ಮುನ್ಸೂಚನೆಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ."
          }]
          },
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