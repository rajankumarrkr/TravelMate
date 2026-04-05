import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "navbar": {
        "dashboard": "Dashboard",
        "trips": "My Trips",
        "magic_ai": "Magic AI",
        "logout": "Logout",
        "login": "Login",
        "signup": "Sign Up"
      },
      "dashboard": {
        "title": "TravelMate Dashboard",
        "subtitle": "Welcome back! Here's what's happening with your trips.",
        "manage_trips": "Manage Trips",
        "total_trips": "Total Trips",
        "total_expenses": "Total Expenses",
        "upcoming_trips": "Upcoming Trips",
        "days_traveled": "Days Traveled",
        "avg_days": "Avg {{count}} days/trip",
        "advanced_analytics": "Advanced Analytics 📊",
        "expense_by_category": "Expense by Category",
        "monthly_spending": "Monthly Spending",
        "no_expense_data": "No expense data available",
        "no_timeline_data": "No timeline data available",
        "recent_adventures": "Recent Adventures",
        "view_all": "View All",
        "no_trips_yet": "No trips yet",
        "create_trip_now": "Create a trip now →"
      }
    }
  },
  hi: {
    translation: {
      "navbar": {
        "dashboard": "डैशबोर्ड",
        "trips": "मेरी यात्राएं",
        "magic_ai": "जादुई एआई",
        "logout": "लॉग आउट",
        "login": "लॉग इन",
        "signup": "साइन अप"
      },
      "dashboard": {
        "title": "ट्रैवलमेट डैशबोर्ड",
        "subtitle": "वापसी पर स्वागत है! यहाँ आपकी यात्राओं का विवरण है।",
        "manage_trips": "यात्राएं प्रबंधित करें",
        "total_trips": "कुल यात्राएं",
        "total_expenses": "कुल खर्च",
        "upcoming_trips": "आगामी यात्राएं",
        "days_traveled": "यात्रा के दिन",
        "avg_days": "औसत {{count}} दिन/यात्रा",
        "advanced_analytics": "उन्नत एनालिटिक्स 📊",
        "expense_by_category": "श्रेणी के अनुसार खर्च",
        "monthly_spending": "मासिक खर्च",
        "no_expense_data": "कोई खर्च डेटा उपलब्ध नहीं है",
        "no_timeline_data": "कोई समयरेखा डेटा उपलब्ध नहीं है",
        "recent_adventures": "हाल के रोमांच",
        "view_all": "सभी देखें",
        "no_trips_yet": "अभी तक कोई यात्रा नहीं",
        "create_trip_now": "अभी यात्रा बनाएं →"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Set default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
