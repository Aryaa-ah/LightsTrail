import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { Dashboard } from '@mui/icons-material';
import NorthernHemisphere from './components/Northern';

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
  profile: {
    personalInfo: " Personal Information",
    firstName: 'First Name',
    lastName: 'Last Name',
    alertPreferences: 'Aurora Alert Preferences',
    deleteAccount: 'Delete Account',
    deleteAccountTitle: 'Delete Account',
    deleteAccountConfirm: 'Are you sure you want to delete your account? This action cannot be undone.',
    deleting: 'Deleting...',
    cancel: 'Cancel',
    deleteConfirmation : "Are you sure you want to delete your account? This action cannot be undone.",
    delete : "Delete"
  },
  gallery: {
    title: {
      main: "Aurora Gallery",
      personal: "My Gallery"
    },
    subtitle: {
      main: "Discover and share stunning aurora captures",
      personal: "Manage and showcase your aurora captures"
    },
    actions: {
      upload: "Upload",
      search: "Search photos by location...",
      grid: "Grid view",
      list: "List view",
      delete: "Delete",
      edit: "Edit",
      save: "Save Changes",
      cancel: "Cancel"
    },
    empty: {
      title: "No Photos Yet",
      description: "Upload your first aurora photo to get started",
      upload: "Upload Photo"
    },
    photo: {
      edit: "Edit Photo",
      delete: "Delete Photo",
      location: "Location",
      description: "Description",
      confirmDelete: "Are you sure you want to delete this photo?",
      deleteWarning: "This action cannot be undone"
    }
  },
          alerts: {
            "title": "Aurora Alert Preferences",
            "locationLabel": "Alert Location",
            "searchLocation": "Search location",
            "kpThreshold": "KP Index Threshold",
            "enableAlerts": "Enable Aurora Alerts",
            "savePreferences": "Save Preferences",
            "fetchError": "Error fetching preferences",
            "locationSearchError": "Failed to search locations",
            "locationRequired": "Please select a location",
            "saveSuccess": "Alert preferences saved successfully",
            "saveError": "Failed to save preferences. Please try again."
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
          tourBooking :{
            title:"Aurora Chaser's Ultimate Guide",
            description1:"Your comprehensive resource for experiencing the magical Northern Lights",
            bookTrip:"Book trip",
            planetaryKIndexGraph:"Planetary K-Index Graph",
            generalAuroraDesc:"General Aurora Viewing Probability by Month",
            bookYourAdv:"Book Your Aurora Adventure",
            SubmitBooking:"Submit Booking",
            cancle:"Cancel"
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
          },
          
            solarWind: { 
           hour2:  "2 Hour",
          hour24:"24 Hour",
          hour6:"6 Hour",
          day3:"3 Day",
          day7:"7 Day",
              title: "ACE Real-Time Solar Wind Data", 
              description: "The data on this graph comes from NASA’s Advanced Composition Explorer (ACE) Satellite. ACE is positioned at the L1 Lagrange Point about 1.5 million km from Earth in the direction of the sun. The satellite samples and measures the solar wind up to 1 hour before it reaches Earth.", 
              note: "Note: Since July of 2016 ACE is no longer the primary source for solar wind data. The new satellite DSCOVR (data shown below) is generally more reliable. The data from ACE frequently blacks out for a number of hours.", 
              measurements: { 
                BtBz: "Bt/Bz (white/red lines) – Bt indicates the total strength of the Interplanetary Magnetic Field (IMF) carried by the solar wind. A higher number indicates a stronger impact to earth’s magnetic field. Bz indicates the orientation of the IMF. If the Bz is positive (northward), then the earth’s magnetic field will block most of the solar wind, and geomagnetic storming is unlikely. But if Bz is negative (southward), then the sun and the earth’s magnetic field will link up, which allows the solar wind to pour into the earth’s atmosphere, causing the aurora. The further southward the Bz points and the longer the duration, the higher the chance is of a geomagnetic storm occurring.", 
                Phi: "Phi (blue line) – Phi is the angle of the IMF measured in the GSM (geocentric solar magnetospheric) coordinate system. Sudden and rapid changes in the Phi angle in conjunction with increased solar wind speeds and Bz fluctuations is common during a CME impact.", 
                Density: "Density (orange line) – The solar wind carries with it plasma (electrons and protons). This is measured in atoms per cubic centimeter. A high and fluctuating plasma density is usually better at stirring up the aurora.", 
                Speed: "Speed (yellow line) – Measured in kilometers per second, the speed of the solar wind can vary from 250 – 800+ km/s. A faster solar wind is usually associated with elevated geomagnetic activity.", 
                Temp: "Temp (green line) – The temperature of the solar wind is measured in Kelvin units. A rise in temperature is likely during an impact to earth’s magnetic field." 
              },
              close: "Close" 
            }
          ,
          webCam:{
            title:"See The Aurora - WebCams"
          },
    kpIndex: {
      Day3: "3 Day",
      Day7: "7 Day",
      title: "KP-Index",
      description1: "The KP Index chart is of limited use because it only updates every 3 hours. Activity may vary during those 3 hours and a geomagnetic storm may be completely over by the time it refreshes. The first tab shows the KP index over a 3-day period.",
      description2: "This chart shows local K-indices as well as the estimated planetary KP Index. The stations shown are Boulder, Colorado; Fredericksburg, Virginia; and Fairbanks, Alaska (College). Unless you happen to be near one of these observatories, it’s best to look at the Estimated Planetary KP Index, which is the 3rd row down.",
      close: "Close"
  },
          southernHemisphere: {
            title: "Southern Hemisphere",
            play: "Play",
            tooltip:"Click to see image details",
            pause: "Pause",
            dialogTitle: "OVATION Aurora Forecast Model",
            dialogContent1: `The OVATION Aurora Forecast Model shows the intensity and location of the aurora predicted for the time shown at the top of the map. This probability forecast is based on current solar wind conditions measured at L1, but using a fixed 30-minute delay time between L1 and Earth. A 30-minute delay corresponds to approximately 800 km/s solar wind speed as might be encountered during geomagnetic storming conditions. In reality, delay times vary from less than 30 minutes to an hour or so for average solar wind conditions.`,
            dialogContent2: `The sunlit side of Earth is indicated by the lighter blue of the ocean and the lighter color of the continents. The day-night line, or terminator, is shown as a region that goes from light to dark. The lighter edge is where the sun is just at the horizon. The darker edge is where the sun is 12 degrees below the horizon. Note that the aurora will not be visible during daylight hours; however, the aurora can often be observed within an hour before sunrise or after sunset.`,
            dialogContent3: "Data updates every 5 minutes.",
            close: "Close",
          },
          northernHemisphere: {
            title: "Northearn Hemisphere",
            play: "Play",
            tooltip:"Click to see image details",
            pause: "Pause",
            dialogTitle: "OVATION Aurora Forecast Model",
            dialogContent1: `The OVATION Aurora Forecast Model shows the intensity and location of the aurora predicted for the time shown at the top of the map. This probability forecast is based on current solar wind conditions measured at L1, but using a fixed 30-minute delay time between L1 and Earth. A 30-minute delay corresponds to approximately 800 km/s solar wind speed as might be encountered during geomagnetic storming conditions. In reality, delay times vary from less than 30 minutes to an hour or so for average solar wind conditions.`,
            dialogContent2: `The sunlit side of Earth is indicated by the lighter blue of the ocean and the lighter color of the continents. The day-night line, or terminator, is shown as a region that goes from light to dark. The lighter edge is where the sun is just at the horizon. The darker edge is where the sun is 12 degrees below the horizon. Note that the aurora will not be visible during daylight hours; however, the aurora can often be observed within an hour before sunrise or after sunset.`,
            dialogContent3: "Data updates every 5 minutes.",
            close: "Close",
          },
          navbar: {
            liveData: 'LiveData',
            glossary: 'Glossary',
            webCam: 'WebCam',
            gallery: 'Gallery',
            TourismGuide:'Tourism Guide',
            bestLocations: 'Best Locations',
            profile:'Profile',
            logout:'Log out'
          },
          locationDialogPopUp: {
            title: {
              mapMode: "Select Location on Map",
              searchMode: "Search Location",
            },
            searchPlaceholder: "Search for a location",
            loading: "Loading...",
            noOptions: "No locations found",
            currentLocation: "Current Location",
            selectFromMap: "Select from Map",
            selected: "Selected",
            latitude: "Latitude",
            longitude: "Longitude",
            buttons: {
              cancel: "Cancel",
              confirm: "Confirm Location",
              close: "Close",
            },
          },
        }
      },
      hi: {
        translation: {
          tourBooking :{
            title:"ऑरोरा चेज़र की अंतिम गाइड",
            description1:"जादुई उत्तरी लाइट्स का अनुभव करने के लिए आपका व्यापक संसाधन",
            bookTrip: "यात्रा बुक करें",
            planetaryKIndexGraph: "ग्रह K-सूचकांक ग्राफ़",
            generalAuroraDesc: "महीने के अनुसार सामान्य ऑरोरा देखने की संभावना",
            bookYourAdv:"बुक योर ऑरोरा एडवेंचर",
           
            SubmitBooking:"बुकिंग सबमिट करें",
            cancle:"रद्द करें"
          },
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
          tourismGuide :{
            title:"Aurora Chaser's Ultimate Guide"
          },
            alerts: {
              "title": "औरोरा अलर्ट प्राथमिकताएं",
              "locationLabel": "अलर्ट स्थान",
              "searchLocation": "स्थान खोजें",
              "kpThreshold": "केपी इंडेक्स थ्रेशोल्ड",
              "enableAlerts": "औरोरा अलर्ट सक्षम करें",
              "savePreferences": "प्राथमिकताएं सहेजें",
              "fetchError": "प्राथमिकताएं प्राप्त करने में त्रुटि",
              "locationSearchError": "स्थान खोजने में विफल",
              "locationRequired": "कृपया एक स्थान चुनें",
              "saveSuccess": "अलर्ट प्राथमिकताएं सफलतापूर्वक सहेजी गईं",
              "saveError": "प्राथमिकताएं सहेजने में विफल। कृपया पुनः प्रयास करें।"
            
          },
          profile: {
            personalInfo: 'व्यक्तिगत जानकारी',
            firstName: 'पहला नाम',
            lastName: 'अंतिम नाम',
            alertPreferences: 'ऑरोरा अलर्ट प्राथमिकताएं',
            deleteAccount: 'खाता हटाएं',
            deleteAccountTitle: 'खाता हटाएं',
            deleteAccountConfirm: 'क्या आप वाकई अपना खाता हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती.',
            deleting: 'हटाया जा रहा है...',
            cancel: 'रद्द करें',
            delete: 'हटाएं',
            deleteConfirmation : "क्या आप वाकई अपना खाता हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती."
          },
          
          
          gallery: {
            title: {
              main: "ऑरोरा गैलरी",
              personal: "मेरी गैलरी"
            },
            subtitle: {
              main: "आकर्षक ऑरोरा तस्वीरें खोजें और साझा करें",
              personal: "अपनी ऑरोरा तस्वीरों को प्रबंधित करें"
            },
            actions: {
              upload: "अपलोड करें",
              search: "स्थान के अनुसार फ़ोटो खोजें...",
              grid: "ग्रिड व्यू",
              list: "सूची व्यू",
              delete: "हटाएं",
              edit: "संपादित करें",
              save: "परिवर्तन सहेजें",
              cancel: "रद्द करें"
            },
            empty: {
              title: "अभी तक कोई फ़ोटो नहीं",
              description: "शुरू करने के लिए अपना पहला ऑरोरा फ़ोटो अपलोड करें",
              upload: "फ़ोटो अपलोड करें"
            },
            photo: {
              edit: "फ़ोटो संपादित करें",
              delete: "फ़ोटो हटाएं",
              location: "स्थान",
              description: "विवरण",
              confirmDelete: "क्या आप वाकई इस फ़ोटो को हटाना चाहते हैं?",
              deleteWarning: "यह क्रिया पूर्ववत नहीं की जा सकती"
            }
          },          
          webCam:{
            title:"ऑरोरा देखें - वेबकैम्स"
          },
          solarWind: { 
            hour2: "2 घंटे",
            hour24: "24 घंटे",
            hour6: "6 घंटे",
            day3: "3 दिन",
            day7: "7 दिन",
            title: "एसीई रियल-टाइम सोलर विंड डेटा", 
            description: "इस ग्राफ का डेटा नासा के एडवांस्ड कंपोजिशन एक्सप्लोरर (ACE) सैटेलाइट से आता है। ACE सूर्य की दिशा में पृथ्वी से लगभग 1.5 मिलियन किमी दूर L1 लैग्रेंज पॉइंट पर स्थित है। उपग्रह सौर वायु का नमूना लेता है और इसे पृथ्वी तक पहुंचने से 1 घंटे पहले मापता है।", 
            note: "नोट: जुलाई 2016 से ACE अब सौर वायु डेटा के लिए प्राथमिक स्रोत नहीं है। नया उपग्रह DSCOVR (नीचे दिखाया गया डेटा) आमतौर पर अधिक विश्वसनीय है। ACE से डेटा अक्सर कई घंटों के लिए ब्लैक आउट हो जाता है।", 
            measurements: { 
              BtBz: "Bt/Bz (सफेद/लाल रेखाएं) – Bt सौर वायु द्वारा ले जाए गए अंतरग्रहीय चुंबकीय क्षेत्र (IMF) की कुल शक्ति को इंगित करता है। एक उच्च संख्या पृथ्वी के चुंबकीय क्षेत्र पर एक मजबूत प्रभाव को इंगित करती है। Bz IMF के अभिविन्यास को इंगित करता है। यदि Bz सकारात्मक (उत्तर की ओर) है, तो पृथ्वी का चुंबकीय क्षेत्र अधिकांश सौर वायु को अवरुद्ध कर देगा, और भू-चुंबकीय तूफान की संभावना नहीं है। लेकिन अगर Bz नकारात्मक (दक्षिण की ओर) है, तो सूर्य और पृथ्वी का चुंबकीय क्षेत्र जुड़ जाएगा, जिससे सौर वायु पृथ्वी के वायुमंडल में प्रवेश कर जाएगी, जिससे ऑरोरा उत्पन्न होगा। Bz जितना अधिक दक्षिण की ओर इंगित करता है और जितनी लंबी अवधि होती है, भू-चुंबकीय तूफान की संभावना उतनी ही अधिक होती है।", 
              Phi: "Phi (नीली रेखा) – Phi IMF का कोण है जिसे GSM (भू-केंद्रित सौर चुंबकीय) निर्देशांक प्रणाली में मापा जाता है। CME प्रभाव के दौरान Phi कोण में अचानक और तेज़ बदलाव, बढ़ी हुई सौर वायु गति और Bz उतार-चढ़ाव के साथ आम है।", 
              Density: "Density (नारंगी रेखा) – सौर वायु प्लाज्मा (इलेक्ट्रॉनों और प्रोटॉनों) को अपने साथ ले जाती है। इसे प्रति घन सेंटीमीटर में परमाणुओं में मापा जाता है। एक उच्च और उतार-चढ़ाव वाली प्लाज्मा घनत्व आमतौर पर ऑरोरा को उत्तेजित करने में बेहतर होती है।", 
              Speed: "Speed (पीली रेखा) – सौर वायु की गति किलोमीटर प्रति सेकंड में मापी जाती है, जो 250 – 800+ किमी/सेकंड तक भिन्न हो सकती है। एक तेज़ सौर वायु आमतौर पर बढ़ी हुई भू-चुंबकीय गतिविधि से जुड़ी होती है।", 
              Temp: "Temp (हरी रेखा) – सौर वायु का तापमान केल्विन इकाइयों में मापा जाता है। पृथ्वी के चुंबकीय क्षेत्र पर प्रभाव के दौरान तापमान में वृद्धि की संभावना होती है।" 
            },
            close: "बंद करें" 
          },
          kpIndex: {
            Day3: "3 दिन",
            Day7: "7 दिन",
            title: "केपी-इंडेक्स",
            description1: "केपी इंडेक्स चार्ट का उपयोग सीमित है क्योंकि यह केवल हर 3 घंटे में अपडेट होता है। उन 3 घंटों के दौरान गतिविधि भिन्न हो सकती है और एक भू-चुंबकीय तूफान पूरी तरह से समाप्त हो सकता है जब तक कि यह ताज़ा नहीं हो जाता। पहला टैब 3-दिन की अवधि में केपी इंडेक्स दिखाता है।",
            description2: "यह चार्ट स्थानीय के-इंडेक्स के साथ-साथ अनुमानित ग्रह केपी इंडेक्स दिखाता है। दिखाए गए स्टेशन हैं बाउल्डर, कोलोराडो; फ्रेडरिक्सबर्ग, वर्जीनिया; और फेयरबैंक्स, अलास्का (कॉलेज)। जब तक आप इन वेधशालाओं में से किसी एक के पास नहीं हैं, तब तक अनुमानित ग्रह केपी इंडेक्स को देखना सबसे अच्छा है, जो तीसरी पंक्ति में है।",
            close: "बंद करें"
        },
          southernHemisphere: {
            title: "दक्षिणी गोलार्ध",
            play: "चालू करें",
            pause: "रोकें",
            dialogTitle: "ओवेशन ऑरोरा पूर्वानुमान मॉडल",
            dialogContent1: `ओवेशन ऑरोरा पूर्वानुमान मॉडल उस समय के लिए ऑरोरा की तीव्रता और स्थान दिखाता है जो मानचित्र के शीर्ष पर दिखाया गया है। यह संभावना पूर्वानुमान वर्तमान सौर पवन स्थितियों पर आधारित है जो L1 पर मापी गई हैं, लेकिन L1 और पृथ्वी के बीच एक स्थिर 30 मिनट की देरी का उपयोग कर रहा है। 30 मिनट की देरी लगभग 800 किमी/से सौर पवन गति के अनुरूप है जो भू-चुंबकीय तूफानी स्थितियों के दौरान अनुभव की जा सकती है। वास्तविकता में, औसत सौर पवन स्थितियों के लिए देरी का समय 30 मिनट से कम से लेकर एक घंटे तक भिन्न हो सकता है।`,
            dialogContent2: `पृथ्वी के धूप वाले हिस्से को महासागर के हल्के नीले और महाद्वीपों के हल्के रंग द्वारा दिखाया गया है। दिन-रात की रेखा, या टर्मिनेटर, एक क्षेत्र के रूप में दिखाई जाती है जो हल्के से गहरे रंग की ओर जाती है। हल्के किनारे पर सूरज क्षितिज पर ही होता है। गहरे किनारे पर सूरज क्षितिज के नीचे 12 डिग्री पर होता है। ध्यान दें कि दिन के समय के दौरान ऑरोरा दिखाई नहीं देगा; हालाँकि, ऑरोरा को अक्सर सूर्योदय या सूर्यास्त के एक घंटे के भीतर देखा जा सकता है।`,
            dialogContent3: "डेटा हर 5 मिनट में अपडेट होता है।",
            close: "बंद करें",
            tooltip:"छवि विवरण देखने के लिए क्लिक करें"
          },
          northernHemisphere: {
            title: "दक्षिणी गोलार्ध",
            play: "चालू करें",
            pause: "रोकें",
            dialogTitle: "ओवेशन ऑरोरा पूर्वानुमान मॉडल",
            dialogContent1: `ओवेशन ऑरोरा पूर्वानुमान मॉडल उस समय के लिए ऑरोरा की तीव्रता और स्थान दिखाता है जो मानचित्र के शीर्ष पर दिखाया गया है। यह संभावना पूर्वानुमान वर्तमान सौर पवन स्थितियों पर आधारित है जो L1 पर मापी गई हैं, लेकिन L1 और पृथ्वी के बीच एक स्थिर 30 मिनट की देरी का उपयोग कर रहा है। 30 मिनट की देरी लगभग 800 किमी/से सौर पवन गति के अनुरूप है जो भू-चुंबकीय तूफानी स्थितियों के दौरान अनुभव की जा सकती है। वास्तविकता में, औसत सौर पवन स्थितियों के लिए देरी का समय 30 मिनट से कम से लेकर एक घंटे तक भिन्न हो सकता है।`,
            dialogContent2: `पृथ्वी के धूप वाले हिस्से को महासागर के हल्के नीले और महाद्वीपों के हल्के रंग द्वारा दिखाया गया है। दिन-रात की रेखा, या टर्मिनेटर, एक क्षेत्र के रूप में दिखाई जाती है जो हल्के से गहरे रंग की ओर जाती है। हल्के किनारे पर सूरज क्षितिज पर ही होता है। गहरे किनारे पर सूरज क्षितिज के नीचे 12 डिग्री पर होता है। ध्यान दें कि दिन के समय के दौरान ऑरोरा दिखाई नहीं देगा; हालाँकि, ऑरोरा को अक्सर सूर्योदय या सूर्यास्त के एक घंटे के भीतर देखा जा सकता है।`,
            dialogContent3: "डेटा हर 5 मिनट में अपडेट होता है।",
            close: "बंद करें",
            tooltip:"छवि विवरण देखने के लिए क्लिक करें"
          },
          locationDialogPopUp: {
            title: {
              mapMode: "नक्शे पर स्थान चुनें",
              searchMode: "स्थान खोजें",
            },
            searchPlaceholder: "स्थान खोजें",
            loading: "लोड हो रहा है...",
            noOptions: "कोई स्थान नहीं मिला",
            currentLocation: "वर्तमान स्थान",
            selectFromMap: "नक्शे से चुनें",
            selected: "चयनित",
            latitude: "अक्षांश",
            longitude: "देशांतर",
            buttons: {
              cancel: "रद्द करें",
              confirm: "स्थान की पुष्टि करें",
              close: "बंद करें",
            },
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

            title: 'ऑरोरा पूर्वानुमान',
            probability: 'अरोड़ा संभावना'


          },
          units: {
            kmPerSec: 'किमी/से',
            kmPerHour: 'किमी/घंटा',
            celsius: '°से',
            mm: 'मिमी'
          },
          navbar: {
            liveData: 'लाइवडेटा',
            glossary: ' शब्दकोश',
            webCam: 'वेबकैम',
            gallery: 'गैलरी',
            TourismGuide:'पर्यटन गाइड',
            bestLocations: 'सर्वश्रेष्ठ स्थान',
            profile:'प्रोफ़ाइल',
            logout:'लॉग आउट'
          }
        }
      },
      kn: {
        translation: {
          tourBooking :{
            title:"ಅರೋರಾ ಚೇಸರ್ ಅವರ ಅಲ್ಟಿಮೇಟ್ ಗೈಡ್",
            description1:"ಮಾಂತ್ರಿಕ ಉತ್ತರದ ದೀಪಗಳನ್ನು ಅನುಭವಿಸಲು ನಿಮ್ಮ ಸಮಗ್ರ ಸಂಪನ್ಮೂಲ",
            bookTrip: "ಪ್ರವಾಸವನ್ನು ಬುಕ್ ಮಾಡಿ",
            planetaryKIndexGraph: "ಗ್ರಹ K-ಸೂಚಕ ಗ್ರಾಫ್",
            generalAuroraDesc: "ತಿಂಗಳ ಪ್ರಕಾರ ಸಾಮಾನ್ಯ ಔರೋರಾ ವೀಕ್ಷಣೆ ಸಾಧ್ಯತೆ",
            bookYourAdv:"ಬುಕ್ ಯುವರ್ ಅರೋರಾ ಅಡ್ವೆಂಚರ್",
            SubmitBooking:"ಬುಕಿಂಗ್ ಸಲ್ಲಿಸಿ",
            cancle:"ರದ್ದು"

          },
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
          
            alerts: {
              "title": "ಅರೋರ ಅಲರ್ಟ್ ಆದ್ಯತೆಗಳು",
              "locationLabel": "ಅಲರ್ಟ್ ಸ್ಥಳ",
              "searchLocation": "ಸ್ಥಳ ಹುಡುಕಿ",
              "kpThreshold": "ಕೆಪಿ ಇಂಡೆಕ್ಸ್ ಥ್ರೆಶೋಲ್ಡ್",
              "enableAlerts": "ಅರೋರ ಅಲರ್ಟ್‌ಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ",
              "savePreferences": "ಆದ್ಯತೆಗಳನ್ನು ಉಳಿಸಿ",
              "fetchError": "ಆದ್ಯತೆಗಳನ್ನು ಪಡೆಯುವಲ್ಲಿ ದೋಷ",
              "locationSearchError": "ಸ್ಥಳಗಳನ್ನು ಹುಡುಕಲು ವಿಫಲವಾಗಿದೆ",
              "locationRequired": "ದಯವಿಟ್ಟು ಒಂದು ಸ್ಥಳವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
              "saveSuccess": "ಅಲರ್ಟ್ ಆದ್ಯತೆಗಳು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ",
              "saveError": "ಆದ್ಯತೆಗಳನ್ನು ಉಳಿಸಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
            },
          
          gallery: {
            title: {
              main: "ಅರೋರಾ ಗ್ಯಾಲರಿ",
              personal: "ನನ್ನ ಗ್ಯಾಲರಿ"
            },
            subtitle: {
              main: "ಅದ್ಭುತ ಅರೋರಾ ಫೋಟೋಗಳನ್ನು ಹುಡುಕಿ ಮತ್ತು ಹಂಚಿಕೊಳ್ಳಿ",
              personal: "ನಿಮ್ಮ ಅರೋರಾ ಫೋಟೋಗಳನ್ನು ನಿರ್ವಹಿಸಿ ಮತ್ತು ಪ್ರದರ್ಶಿಸಿ"
            },
            actions: {
              upload: "ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
              search: "ಸ್ಥಳದ ಮೂಲಕ ಫೋಟೋಗಳನ್ನು ಹುಡುಕಿ...",
              grid: "ಗ್ರಿಡ್ ವೀಕ್ಷಣೆ",
              list: "ಪಟ್ಟಿ ವೀಕ್ಷಣೆ",
              delete: "ಅಳಿಸಿ",
              edit: "ಸಂಪಾದಿಸಿ",
              save: "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ",
              cancel: "ರದ್ದುಮಾಡಿ"
            },
            empty: {
              title: "ಇನ್ನೂ ಯಾವುದೇ ಫೋಟೋಗಳಿಲ್ಲ",
              description: "ಪ್ರಾರಂಭಿಸಲು ನಿಮ್ಮ ಮೊದಲ ಅರೋರಾ ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
              upload: "ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ"
            },
            photo: {
              edit: "ಫೋಟೋ ಸಂಪಾದಿಸಿ",
              delete: "ಫೋಟೋ ಅಳಿಸಿ",
              location: "ಸ್ಥಳ",
              description: "ವಿವರಣೆ",
              confirmDelete: "ನೀವು ಖಚಿತವಾಗಿ ಈ ಫೋಟೋವನ್ನು ಅಳಿಸಲು ಬಯಸುವಿರಾ?",
              deleteWarning: "ಈ ಕ್ರಿಯೆಯನ್ನು ರದ್ದುಗೊಳಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ"
            }
          },
          profile: {
            personalInfo: 'ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ',
            firstName: 'ಮೊದಲ ಹೆಸರು',
            lastName: 'ಕೊನೆಯ ಹೆಸರು',
            alertPreferences: 'ಅರೋರಾ ಅಲರ್ಟ್ ಪ್ರಾಶಸ್ತ್ಯಗಳು',
            deleteAccount: 'ಖಾತೆಯನ್ನು ಅಳಿಸಿ',
            deleteAccountTitle: 'ಖಾತೆಯನ್ನು ಅಳಿಸಿ',
            deleteAccountConfirm: 'ನಿಮ್ಮ ಖಾತೆಯನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ? ಈ ಕ್ರಿಯೆಯನ್ನು ರದ್ದುಗೊಳಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.',
            deleting: 'ಅಳಿಸಲಾಗುತ್ತಿದೆ...',
            cancel: 'ರದ್ದುಮಾಡಿ',
            delete: 'ಅಳಿಸಿ',
            deleteConfirmation : "ನೀವು ಖಚಿತವಾಗಿ ನಿಮ್ಮ ಖಾತೆಯನ್ನು ಅಳಿಸಲು ಬಯಸುವಿರಾ? ಈ ಕ್ರಿಯೆಯನ್ನು ರದ್ದುಗೊಳಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ."
          },
          webCam:{
            title:"ಔರೊರಾವನ್ನು ನೋಡಿ - ವೆಬ್‌ಕ್ಯಾಮ್‌ಗಳು"
          },
          solarWind: { 
            hour2: "2 ಗಂಟೆ",
            hour24: "24 ಗಂಟೆ",
            hour6: "6 ಗಂಟೆ",
            day3: "3 ದಿನ",
            day7: "7 ದಿನ",
            title: "ACE ರಿಯಲ್-ಟೈಮ್ ಸೊಲಾರ್ ವಿಂಡ್ ಡೇಟಾ", 
            description: "ಈ ಗ್ರಾಫ್‌ನ ಡೇಟಾ ನಾಸಾದ ಅಡ್ವಾನ್ಸ್ಡ್ ಕಾಂಪೊಸಿಷನ್ ಎಕ್ಸ್‌ಪ್ಲೋರರ್ (ACE) ಉಪಗ್ರಹದಿಂದ ಬಂದಿದೆ. ACE ಸೂರ್ಯನ ದಿಕ್ಕಿನಲ್ಲಿ ಭೂಮಿಯಿಂದ ಸುಮಾರು 1.5 ಮಿಲಿಯನ್ ಕಿಮೀ ದೂರದಲ್ಲಿರುವ L1 ಲಾಗ್ರಾಂಜ್ ಪಾಯಿಂಟ್‌ನಲ್ಲಿ ಸ್ಥಿತಿಯಾಗಿದೆ. ಉಪಗ್ರಹವು ಸೊಲಾರ್ ವಿಂಡ್ ಅನ್ನು ಮಾದರಿ ತೆಗೆದುಕೊಳ್ಳುತ್ತದೆ ಮತ್ತು ಭೂಮಿಗೆ ತಲುಪುವ ಮೊದಲು 1 ಗಂಟೆವರೆಗೆ ಅಳೆಯುತ್ತದೆ.", 
            note: "ಸೂಚನೆ: 2016 ರ ಜುಲೈನಿಂದ ACE ಇನ್ನು ಮುಂದೆ ಸೊಲಾರ್ ವಿಂಡ್ ಡೇಟಾದ ಪ್ರಾಥಮಿಕ ಮೂಲವಲ್ಲ. ಹೊಸ ಉಪಗ್ರಹ DSCOVR (ಕೆಳಗೆ ತೋರಿಸಿದ ಡೇಟಾ) ಸಾಮಾನ್ಯವಾಗಿ ಹೆಚ್ಚು ನಂಬಿಕಸ್ಥವಾಗಿದೆ. ACE ನಿಂದ ಡೇಟಾ ಹಲವಾರು ಗಂಟೆಗಳ ಕಾಲ ಕಪ್ಪಾಗುತ್ತದೆ.", 
            measurements: { 
              BtBz: "Bt/Bz (ಬಿಳಿ/ಕೆಂಪು ರೇಖೆಗಳು) – Bt ಸೊಲಾರ್ ವಿಂಡ್ ಮೂಲಕ ಸಾಗುವ ಅಂತರ್‌ಗ್ರಹೀಯ ಚುಂಬಕ ಕ್ಷೇತ್ರದ (IMF) ಒಟ್ಟು ಶಕ್ತಿಯನ್ನು ಸೂಚಿಸುತ್ತದೆ. ಹೆಚ್ಚಿನ ಸಂಖ್ಯೆಯು ಭೂಮಿಯ ಚುಂಬಕ ಕ್ಷೇತ್ರದ ಮೇಲೆ ಬಲವಾದ ಪರಿಣಾಮವನ್ನು ಸೂಚಿಸುತ್ತದೆ. Bz IMF ನ ದಿಕ್ಕನ್ನು ಸೂಚಿಸುತ್ತದೆ. Bz ಧನಾತ್ಮಕ (ಉತ್ತರದಿಕ್ಕಿನಲ್ಲಿ) ಇದ್ದರೆ, ಭೂಮಿಯ ಚುಂಬಕ ಕ್ಷೇತ್ರವು ಹೆಚ್ಚಿನ ಸೊಲಾರ್ ವಿಂಡ್ ಅನ್ನು ತಡೆಯುತ್ತದೆ ಮತ್ತು ಭೂಚುಂಬಕ ತೂಫಾನಿನ ಸಾಧ್ಯತೆ ಕಡಿಮೆ. ಆದರೆ Bz ಋಣಾತ್ಮಕ (ದಕ್ಷಿಣದಿಕ್ಕಿನಲ್ಲಿ) ಇದ್ದರೆ, ಸೂರ್ಯ ಮತ್ತು ಭೂಮಿಯ ಚುಂಬಕ ಕ್ಷೇತ್ರವು ಸಂಪರ್ಕ ಹೊಂದುತ್ತದೆ, ಇದು ಸೊಲಾರ್ ವಿಂಡ್ ಅನ್ನು ಭೂಮಿಯ ವಾತಾವರಣಕ್ಕೆ ಹರಿಯಲು ಅನುಮತಿಸುತ್ತದೆ, ಇದು ಔರೊರಾವನ್ನು ಉಂಟುಮಾಡುತ್ತದೆ. Bz ಎಷ್ಟು ಹೆಚ್ಚು ದಕ್ಷಿಣದಿಕ್ಕಿನಲ್ಲಿ ತೋರಿಸುತ್ತದೆ ಮತ್ತು ಅವಧಿಯು ಎಷ್ಟು ದೀರ್ಘವಾಗಿರುತ್ತದೆ, ಭೂಚುಂಬಕ ತೂಫಾನಿನ ಸಂಭವನೀಯತೆ ಹೆಚ್ಚು.", 
              Phi: "Phi (ನೀಲಿ ರೇಖೆ) – Phi IMF ನ ಕೋನವನ್ನು GSM (ಭೂಕೇಂದ್ರಿತ ಸೊಲಾರ್ ಚುಂಬಕೀಯ) ನಿರ್ಣಯ ವ್ಯವಸ್ಥೆಯಲ್ಲಿ ಅಳೆಯಲಾಗುತ್ತದೆ. CME ಪರಿಣಾಮದ ಸಮಯದಲ್ಲಿ Phi ಕೋನದಲ್ಲಿ ತಕ್ಷಣ ಮತ್ತು ತೀವ್ರ ಬದಲಾವಣೆಗಳು, ಹೆಚ್ಚಿದ ಸೊಲಾರ್ ವಿಂಡ್ ವೇಗಗಳು ಮತ್ತು Bz ಬದಲಾವಣೆಗಳು ಸಾಮಾನ್ಯ.", 
              Density: "Density (ಕೆಂಪು ರೇಖೆ) – ಸೊಲಾರ್ ವಿಂಡ್ ಪ್ಲಾಸ್ಮಾವನ್ನು (ಇಲೆಕ್ಟ್ರಾನ್‌ಗಳು ಮತ್ತು ಪ್ರೋಟಾನ್‌ಗಳು) ತನ್ನೊಂದಿಗೆ ಹೊಯ್ಯುತ್ತದೆ. ಇದನ್ನು ಪ್ರತಿಯುಬ್ಬು ಸೆಂಟಿಮೀಟರ್‌ನಲ್ಲಿ ಅಣುಗಳಲ್ಲಿ ಅಳೆಯಲಾಗುತ್ತದೆ. ಹೆಚ್ಚಿನ ಮತ್ತು ಬದಲಾವಣೆಗೊಳ್ಳುವ ಪ್ಲಾಸ್ಮಾ ಸಾಂದ್ರತೆಯು ಸಾಮಾನ್ಯವಾಗಿ ಔರೊರಾವನ್ನು ಉಂಟುಮಾಡಲು ಉತ್ತಮವಾಗಿದೆ.", 
              Speed: "Speed (ಹಳದಿ ರೇಖೆ) – ಸೊಲಾರ್ ವಿಂಡ್‌ನ ವೇಗವನ್ನು ಕಿಲೋಮೀಟರ್‌ಗಳಲ್ಲಿ ಪ್ರತಿ ಸೆಕೆಂಡಿಗೆ ಅಳೆಯಲಾಗುತ್ತದೆ, ಇದು 250 – 800+ ಕಿಮೀ/ಸೆಕೆಂಡುಗಳವರೆಗೆ ಬದಲಾಗಬಹುದು. ವೇಗವಾದ ಸೊಲಾರ್ ವಿಂಡ್ ಸಾಮಾನ್ಯವಾಗಿ ಹೆಚ್ಚಿದ ಭೂಚುಂಬಕ ಚಟುವಟಿಕೆಯಿಂದ ಸಂಬಂಧಿಸಿದೆ.", 
              Temp: "Temp (ಹಸಿರು ರೇಖೆ) – ಸೊಲಾರ್ ವಿಂಡ್‌ನ ತಾಪಮಾನವನ್ನು ಕೆಲ್ವಿನ್ ಘಟಕಗಳಲ್ಲಿ ಅಳೆಯಲಾಗುತ್ತದೆ. ಭೂಮಿಯ ಚುಂಬಕ ಕ್ಷೇತ್ರದ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರಿದಾಗ ತಾಪಮಾನದಲ್ಲಿ ಏರಿಕೆಯಾಗುವ ಸಾಧ್ಯತೆ ಇದೆ." 
            },
            close: "ಮುಚ್ಚಿ" 
          },
          kpIndex: {
            Day3: "3 ದಿನ",
            Day7: "7 ದಿನ",
            title: "ಕೆಪಿ-ಸೂಚಿ",
            description1: "ಕೆಪಿ ಸೂಚಕ ಚಾರ್ಟ್ ಸೀಮಿತ ಬಳಕೆಯಾಗಿದೆ ಏಕೆಂದರೆ ಇದು ಪ್ರತಿ 3 ಗಂಟೆಗಳಲ್ಲಿ ಮಾತ್ರ ನವೀಕರಿಸುತ್ತದೆ. ಆ 3 ಗಂಟೆಗಳ ಅವಧಿಯಲ್ಲಿ ಚಟುವಟಿಕೆ ಬದಲಾಗಬಹುದು ಮತ್ತು ಭೂಚುಂಬಕ ತೂಫಾನವು ಸಂಪೂರ್ಣವಾಗಿ ಮುಗಿದಿರಬಹುದು. ಮೊದಲ ಟ್ಯಾಬ್ 3 ದಿನಗಳ ಅವಧಿಯಲ್ಲಿ ಕೆಪಿ ಸೂಚಕವನ್ನು ತೋರಿಸುತ್ತದೆ.",
            description2: "ಈ ಚಾರ್ಟ್ ಸ್ಥಳೀಯ ಕೆ-ಸೂಚಕಗಳ ಜೊತೆಗೆ ಅಂದಾಜು ಮಾಡಿದ ಗ್ರಹೀಯ ಕೆಪಿ ಸೂಚಕವನ್ನು ತೋರಿಸುತ್ತದೆ. ತೋರಿಸಲಾದ ಸ್ಟೇಷನ್‌ಗಳು ಬೋಲ್ಡರ್, ಕೊಲೊರಾಡೋ; ಫ್ರೆಡ್ರಿಕ್ಸ್‌ಬರ್ಗ್, ವರ್ಜೀನಿಯಾ; ಮತ್ತು ಫೇರ್‌ಬ್ಯಾಂಕ್ಸ್, ಅಲಾಸ್ಕಾ (ಕಾಲೇಜ್). ನೀವು ಈ ವೀಕ್ಷಣಾಲಯಗಳಲ್ಲಿ ಒಂದರ ಹತ್ತಿರ ಇದ್ದರೆ, ಅಂದಾಜು ಮಾಡಿದ ಗ್ರಹೀಯ ಕೆಪಿ ಸೂಚಕವನ್ನು ನೋಡುವುದು ಉತ್ತಮ, ಇದು ಮೂರನೇ ಸಾಲಿನಲ್ಲಿ ಇದೆ.",
            close: "ಮುಚ್ಚಿ"
        },
          southernHemisphere: {
            title: "ದಕ್ಷಿಣ ಅರ್ಧಗುಂಡಾದ್ರೋಣ",
            play: "ನಡಿಗೆಮಾಡು",
            pause: "ನಿಲ್ಲಿಸು",
            tooltip:"ಚಿತ್ರದ ವಿವರಗಳನ್ನು ನೋಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
            dialogTitle: "ಓವೇಶನ್ ಆರೋರಾ ಮುನ್ಸೂಚನಾ ಮಾದರಿ",
            dialogContent1: `ಓವೇಶನ್ ಆರೋರಾ ಮುನ್ಸೂಚನಾ ಮಾದರಿಯು ನಕ್ಷೆಯ ಮೇಲ್ಭಾಗದಲ್ಲಿ ತೋರಿಸಲಾಗುವ ಸಮಯಕ್ಕೆ ಆರೋರಾದ ತೀವ್ರತೆ ಮತ್ತು ಸ್ಥಳವನ್ನು ತೋರಿಸುತ್ತದೆ. ಈ ಸಾಧ್ಯತೆ ಮುನ್ಸೂಚನೆ ಪ್ರಸ್ತುತ ಸೌರ ಗಾಳಿ ಸ್ಥಿತಿಗಳಿಗೆ ಆಧಾರಿತವಾಗಿದೆ, L1 ನಲ್ಲಿ ಅಳೆಯಲ್ಪಟ್ಟಿದೆ, ಆದರೆ L1 ಮತ್ತು ಭೂಮಿಯ ನಡುವಿನ ಸ್ಥಿರ 30 ನಿಮಿಷಗಳ ವಿಳಂಬ ಸಮಯವನ್ನು ಬಳಸುತ್ತಿದೆ. 30 ನಿಮಿಷಗಳ ವಿಳಂಬವು ಸುಮಾರು 800 ಕಿಮೀ/ಸೆಕೆ೦ಡ್ ಸೌರ ಗಾಳಿ ವೇಗಕ್ಕೆ ಹೊಂದಿಕೊಳ್ಳುತ್ತದೆ, ಇದು ಭೂಮ್ಯಾಕಾಂತಿಕ ಚಂಡಮಾರುತದ ಸ್ಥಿತಿಗಳಲ್ಲಿ ಎದುರಾಗಬಹುದು. ವಾಸ್ತವದಲ್ಲಿ, ವಿಳಂಬದ ಸಮಯವು ಕಡಿಮೆ 30 ನಿಮಿಷಗಳಿಂದ ಸರಾಸರಿ ಸೌರ ಗಾಳಿ ಸ್ಥಿತಿಗಳಿಗೆ ಒಂದು ಗಂಟೆ ಅಥವಾ ಹೆಚ್ಚು ಬೇರೆಬೇರೆ ಆಗಬಹುದು.`,
            dialogContent2: `ಭೂಮಿಯ ಸೂರ್ಯಕಾಂತ ಬದಿಯನ್ನು ಸಾಗರದ ಹಗುರವಾದ ನೀಲಿಯ ಮತ್ತು ಖಂಡಗಳ ಹಗುರವಾದ ಬಣ್ಣದ ಮೂಲಕ ಸೂಚಿಸಲಾಗುತ್ತದೆ. ದಿನ-ರಾತ್ರಿಯ ರೇಖೆ, ಅಥವಾ ಟರ್ಮಿನೇಟರ್, ಬೆಳಕು ಇಂದ ಕತ್ತಲೆಯ ಕಡೆಗೆ ಹೋಗುವ ಪ್ರದೇಶವನ್ನು ತೋರಿಸುತ್ತದೆ. ಹಗುರವಾದ ಅಂಚಿನಲ್ಲಿ ಸೂರ್ಯವು ಸಮೀಪದಲ್ಲಿದೆ. ಗಾಢವಾದ ಅಂಚಿನಲ್ಲಿ ಸೂರ್ಯವು ಸಮೀಪದಿಂದ 12 ಡಿಗ್ರಿ ಕೆಳಗಿರುತ್ತದೆ. ಸೂರ್ಯೋದಯ ಅಥವಾ ಸೂರ್ಯಾಸ್ತದ ಒಂದು ಗಂಟೆಯ ಒಳಗೆ ಆರೋರಾವನ್ನು ನೋಡಬಹುದು, ಆದಾಗ್ಯೂ.`,
            dialogContent3: "ಡೇಟಾ ಪ್ರತಿ 5 ನಿಮಿಷಕ್ಕೊಮ್ಮೆ ನವೀಕರಿಸಲಾಗುತ್ತದೆ.",
            close: "ಮುಚ್ಚು",
          },
          northernHemisphere: {
            title: "ದಕ್ಷಿಣ ಅರ್ಧಗುಂಡಾದ್ರೋಣ",
            play: "ನಡಿಗೆಮಾಡು",
            pause: "ನಿಲ್ಲಿಸು",
            tooltip:"ಚಿತ್ರದ ವಿವರಗಳನ್ನು ನೋಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
            dialogTitle: "ಓವೇಶನ್ ಆರೋರಾ ಮುನ್ಸೂಚನಾ ಮಾದರಿ",
            dialogContent1: `ಓವೇಶನ್ ಆರೋರಾ ಮುನ್ಸೂಚನಾ ಮಾದರಿಯು ನಕ್ಷೆಯ ಮೇಲ್ಭಾಗದಲ್ಲಿ ತೋರಿಸಲಾಗುವ ಸಮಯಕ್ಕೆ ಆರೋರಾದ ತೀವ್ರತೆ ಮತ್ತು ಸ್ಥಳವನ್ನು ತೋರಿಸುತ್ತದೆ. ಈ ಸಾಧ್ಯತೆ ಮುನ್ಸೂಚನೆ ಪ್ರಸ್ತುತ ಸೌರ ಗಾಳಿ ಸ್ಥಿತಿಗಳಿಗೆ ಆಧಾರಿತವಾಗಿದೆ, L1 ನಲ್ಲಿ ಅಳೆಯಲ್ಪಟ್ಟಿದೆ, ಆದರೆ L1 ಮತ್ತು ಭೂಮಿಯ ನಡುವಿನ ಸ್ಥಿರ 30 ನಿಮಿಷಗಳ ವಿಳಂಬ ಸಮಯವನ್ನು ಬಳಸುತ್ತಿದೆ. 30 ನಿಮಿಷಗಳ ವಿಳಂಬವು ಸುಮಾರು 800 ಕಿಮೀ/ಸೆಕೆ೦ಡ್ ಸೌರ ಗಾಳಿ ವೇಗಕ್ಕೆ ಹೊಂದಿಕೊಳ್ಳುತ್ತದೆ, ಇದು ಭೂಮ್ಯಾಕಾಂತಿಕ ಚಂಡಮಾರುತದ ಸ್ಥಿತಿಗಳಲ್ಲಿ ಎದುರಾಗಬಹುದು. ವಾಸ್ತವದಲ್ಲಿ, ವಿಳಂಬದ ಸಮಯವು ಕಡಿಮೆ 30 ನಿಮಿಷಗಳಿಂದ ಸರಾಸರಿ ಸೌರ ಗಾಳಿ ಸ್ಥಿತಿಗಳಿಗೆ ಒಂದು ಗಂಟೆ ಅಥವಾ ಹೆಚ್ಚು ಬೇರೆಬೇರೆ ಆಗಬಹುದು.`,
            dialogContent2: `ಭೂಮಿಯ ಸೂರ್ಯಕಾಂತ ಬದಿಯನ್ನು ಸಾಗರದ ಹಗುರವಾದ ನೀಲಿಯ ಮತ್ತು ಖಂಡಗಳ ಹಗುರವಾದ ಬಣ್ಣದ ಮೂಲಕ ಸೂಚಿಸಲಾಗುತ್ತದೆ. ದಿನ-ರಾತ್ರಿಯ ರೇಖೆ, ಅಥವಾ ಟರ್ಮಿನೇಟರ್, ಬೆಳಕು ಇಂದ ಕತ್ತಲೆಯ ಕಡೆಗೆ ಹೋಗುವ ಪ್ರದೇಶವನ್ನು ತೋರಿಸುತ್ತದೆ. ಹಗುರವಾದ ಅಂಚಿನಲ್ಲಿ ಸೂರ್ಯವು ಸಮೀಪದಲ್ಲಿದೆ. ಗಾಢವಾದ ಅಂಚಿನಲ್ಲಿ ಸೂರ್ಯವು ಸಮೀಪದಿಂದ 12 ಡಿಗ್ರಿ ಕೆಳಗಿರುತ್ತದೆ. ಸೂರ್ಯೋದಯ ಅಥವಾ ಸೂರ್ಯಾಸ್ತದ ಒಂದು ಗಂಟೆಯ ಒಳಗೆ ಆರೋರಾವನ್ನು ನೋಡಬಹುದು, ಆದಾಗ್ಯೂ.`,
            dialogContent3: "ಡೇಟಾ ಪ್ರತಿ 5 ನಿಮಿಷಕ್ಕೊಮ್ಮೆ ನವೀಕರಿಸಲಾಗುತ್ತದೆ.",
            close: "ಮುಚ್ಚು",
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
          locationDialogPopUp: {
            title: {
              mapMode: "ನಕ್ಷೆಯಲ್ಲಿ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
              searchMode: "ಸ್ಥಳ ಹುಡುಕಿ",
            },
            searchPlaceholder: "ಸ್ಥಳವನ್ನು ಹುಡುಕಿ",
            loading: "ಲೋಡಿಂಗ್...",
            noOptions: "ಯಾವುದೇ ಸ್ಥಳಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
            currentLocation: "ಪ್ರಸ್ತುತ ಸ್ಥಳ",
            selectFromMap: "ನಕ್ಷೆಯಿಂದ ಆಯ್ಕೆಮಾಡಿ",
            selected: "ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ",
            latitude: "ಅಕ್ಷಾಂಶ",
            longitude: "ರೇಖಾಂಶ",
            buttons: {
              cancel: "ರದ್ದುಮಾಡಿ",
              confirm: "ಸ್ಥಳವನ್ನು ದೃಢೀಕರಿಸಿ",
              close: "ಮುಚ್ಚಿ",
            },
          },
          dashboard: {
            kpIndex: 'ಕೆಪಿ ಸೂಚ್ಯಂಕ',
            magneticField: 'ಕಾಂತೀಯ ಕ್ಷೇತ್ರ (Bz)',
            solarWind: 'ಸೌರ ಗಾಳಿಯ ವೇಗ',
            temperature: 'ತಾಪಮಾನ',
            precipitation: 'ಮಳೆ',
            windSpeed: 'ಗಾಳಿಯ ವೇಗ',
            uvIndex: 'ಯುವಿ ಸೂಚ್ಯಂಕ',
            title: 'ಅರೋರಾ ಮುನ್ಸೂಚನೆ', 
            probability : 'ಅರೋರಾ ಸಂಭಾವನೆ',
          },
          units: {
            kmPerSec: 'ಕಿ.ಮೀ/ಸೆ',
            kmPerHour: 'ಕಿ.ಮೀ/ಗಂ',
            celsius: '°ಸೆ',
            mm: 'ಮಿ.ಮೀ'
          }
          ,
          navbar: {
            liveData: 'ಲೈವ್ಡೇಟಾ',
            glossary: 'ಪದಕೋಶ',
            webCam: 'ವೆಬ್‌ಕ್ಯಾಮ್',
            gallery: 'ಗ್ಯಾಲರಿ',
            TourismGuide:'ಪ್ರವಾಸೋದ್ಯಮ ಮಾರ್ಗದರ್ಶಿ',
            bestLocations: 'ಉತ್ತಮ ಸ್ಥಳಗಳು',
            profile:'ಪ್ರೊಫೈಲ್',
            logout:'ಲಾಗ್ ಔಟ್'
          }
        }
     }
    }
  });

export default i18n;