import { SupportedLanguage } from '../types/mess';

export interface TranslationDict {
  portalTitle: string;
  subTitle: string;
  tagline: string;
  navMenu: string;
  navPass: string;
  navFoodCourt: string;
  navRestaurants: string;
  navParcel: string;
  navDayScholar: string;
  navWaste: string;
  navFeedback: string;
  navVendor: string;
  navAdmin: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
  wallet: string;
  walletBalance: string;
  topupWallet: string;
  liveQueue: string;
  orderNow: string;
  orderToken: string;
  placed: string;
  preparing: string;
  ready: string;
  completed: string;
  outForDelivery: string;
  searchPlaceholder: string;
  vegOnly: string;
  jainSpecial: string;
  highProtein: string;
  installApp: string;
  voiceSearchPrompt: string;
  listening: string;
  helpline: string;
}

export const translations: Record<SupportedLanguage, TranslationDict> = {
  en: {
    portalTitle: 'LPU Dining & Food Portal',
    subTitle: 'Lovely Professional University, Phagwara',
    tagline: 'Hostel Mess & Campus Food Court Delivery',
    navMenu: 'Mess Menu',
    navPass: 'Digital Pass',
    navFoodCourt: 'UniMall Food Court',
    navRestaurants: 'Law Gate / Maheru',
    navParcel: 'Hostel Parcel',
    navDayScholar: 'Day Scholar',
    navWaste: 'Food Waste',
    navFeedback: 'Feedback',
    navVendor: 'Vendor Portal',
    navAdmin: 'Warden Admin',
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    snacks: 'Evening Snacks',
    dinner: 'Dinner',
    wallet: 'Campus Wallet',
    walletBalance: 'Wallet Balance',
    topupWallet: 'Top-up Wallet',
    liveQueue: 'Live Stall Queue',
    orderNow: 'Order Now',
    orderToken: 'Order Token',
    placed: 'Placed',
    preparing: 'Preparing',
    ready: 'Ready for Pickup',
    completed: 'Completed',
    outForDelivery: 'Out for Delivery',
    searchPlaceholder: 'Search dishes, stalls, or cuisines...',
    vegOnly: 'Pure Veg',
    jainSpecial: 'Jain Special',
    highProtein: 'High Protein',
    installApp: 'Install App',
    voiceSearchPrompt: 'Say a dish name (e.g. Masala Dosa, Paneer, Maggie)...',
    listening: 'Listening...',
    helpline: '24x7 Verto Helpline: +91 9335568951'
  },
  hi: {
    portalTitle: 'एलपीयू डाइनिंग एवं फूड पोर्टल',
    subTitle: 'लवली प्रोफेशनल यूनिवर्सिटी, फगवाड़ा',
    tagline: 'हॉस्टल मेस एवं कैंपस फूड कोर्ट डिलीवरी',
    navMenu: 'मेस मेनू',
    navPass: 'डिजिटल पास',
    navFoodCourt: 'यूनीमॉल फूड कोर्ट',
    navRestaurants: 'लॉ गेट / माहेरूं',
    navParcel: 'हॉस्टल पार्सल',
    navDayScholar: 'डे स्कॉलर',
    navWaste: 'खाद्य बर्बादी',
    navFeedback: 'प्रतिक्रिया',
    navVendor: 'वेंडर पोर्टल',
    navAdmin: 'वार्डन एडमिन',
    breakfast: 'नाश्ता',
    lunch: 'दोपहर का भोजन',
    snacks: 'शाम का नाश्ता',
    dinner: 'रात का खाना',
    wallet: 'कैंपस वॉलेट',
    walletBalance: 'वॉलेट बैलेंस',
    topupWallet: 'रिचार्ज करें',
    liveQueue: 'लाइव स्टॉल कतार',
    orderNow: 'ऑर्डर करें',
    orderToken: 'ऑर्डर टोकन',
    placed: 'ऑर्डर दर्ज',
    preparing: 'तैयार हो रहा है',
    ready: 'पिकअप के लिए तैयार',
    completed: 'पूर्ण',
    outForDelivery: 'डिलीवरी के लिए रवाना',
    searchPlaceholder: 'व्यंजन, स्टॉल या भोजन खोजें...',
    vegOnly: 'शुद्ध शाकाहारी',
    jainSpecial: 'जैन स्पेशल',
    highProtein: 'उच्च प्रोटीन',
    installApp: 'ऐप इंस्टॉल करें',
    voiceSearchPrompt: 'व्यंजन का नाम बोलें (उदा. मसाला डोसा, पनीर, मैगी)...',
    listening: 'सुन रहे हैं...',
    helpline: '24x7 वर्टो हेल्पलाइन: +91 9335568951'
  },
  pa: {
    portalTitle: 'ਐਲ.ਪੀ.ਯੂ. ਡਾਇਨਿੰਗ ਅਤੇ ਫੂਡ ਪੋਰਟਲ',
    subTitle: 'ਲਵਲੀ ਪ੍ਰੋਫੈਸ਼ਨਲ ਯੂਨੀਵਰਸਿਟੀ, ਫਗਵਾੜਾ',
    tagline: 'ਹੋਸਟਲ ਮੈਸ ਅਤੇ ਕੈਂਪਸ ਫੂਡ ਕੋਰਟ ਡਿਲਿਵਰੀ',
    navMenu: 'ਮੈਸ ਮੀਨੂ',
    navPass: 'ਡਿਜੀਟਲ ਪਾਸ',
    navFoodCourt: 'ਯੂਨੀਮਾਲ ਫੂਡ ਕੋਰਟ',
    navRestaurants: 'ਲਾਅ ਗੇਟ / ਮਾਹੇਰੂ',
    navParcel: 'ਹੋਸਟਲ ਪਾਰਸਲ',
    navDayScholar: 'ਡੇਅ ਸਕਾਲਰ',
    navWaste: 'ਖਾਣਾ ਬਰਬਾਦੀ',
    navFeedback: 'ਫੀਡਬੈਕ',
    navVendor: 'ਵੈਂਡਰ ਪੋਰਟਲ',
    navAdmin: 'ਵਾਰਡਨ ਐਡਮਿਨ',
    breakfast: 'ਨਾਸ਼ਤਾ',
    lunch: 'ਦੁਪਹਿਰ ਦਾ ਖਾਣਾ',
    snacks: 'ਸ਼ਾਮ ਦਾ ਨਾਸ਼ਤਾ',
    dinner: 'ਰਾਤ ਦਾ ਖਾਣਾ',
    wallet: 'ਕੈਂਪਸ ਵਾਲਿਟ',
    walletBalance: 'ਵਾਲਿਟ ਬੈਲੇਂਸ',
    topupWallet: 'ਰੀਚਾਰਜ ਕਰੋ',
    liveQueue: 'ਲਾਈਵ ਸਟਾਲ ਕਤਾਰ',
    orderNow: 'ਆਰਡਰ ਕਰੋ',
    orderToken: 'ਆਰਡਰ ਟੋਕਨ',
    placed: 'ਦਰਜ ਕੀਤਾ',
    preparing: 'ਤਿਆਰ ਹੋ ਰਿਹਾ ਹੈ',
    ready: 'ਚੁੱਕਣ ਲਈ ਤਿਆਰ',
    completed: 'ਸੰਪੰਨ',
    outForDelivery: 'ਡਿਲੀਵਰੀ ਲਈ ਰਵਾਨਾ',
    searchPlaceholder: 'ਪਕਵਾਨ, ਸਟਾਲ ਜਾਂ ਖਾਣਾ ਲੱਭੋ...',
    vegOnly: 'ਸ਼ੁੱਧ ਸ਼ਾਕਾਹਾਰੀ',
    jainSpecial: 'ਜੈਨ ਸਪੈਸ਼ਲ',
    highProtein: 'ਹਾਈ ਪ੍ਰੋਟੀਨ',
    installApp: 'ਐਪ ਇੰਸਟਾਲ ਕਰੋ',
    voiceSearchPrompt: 'ਪਕਵਾਨ ਦਾ ਨਾਮ ਬੋਲੋ (ਜਿਵੇਂ ਮਸਾਲਾ ਡੋਸਾ, ਪਨੀਰ)...',
    listening: 'ਸੁਣ ਰਹੇ ਹਾਂ...',
    helpline: '24x7 ਵਰਟੋ ਹੈਲਪਲਾਈਨ: +91 9335568951'
  }
};
