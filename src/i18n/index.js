// i18n/index.js - i18next configuration for multilingual support
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Basic resources; extend as needed
const resources = {
  en: {
    translation: {
      common: {
        save: 'Save',
        reset: 'Reset',
        settings: 'Settings',
      },
      settings: {
        title: 'Settings',
        general: 'General',
        appearance: 'Appearance',
        security: 'Security',
        notifications: 'Notifications',
        system: 'System',
        advanced: 'Advanced',
        userPreferences: 'User Preferences',
        language: 'Language',
        dateFormat: 'Date Format',
        currency: 'Currency',
        itemsPerPage: 'Items Per Page',
        companyInformation: 'Company Information',
        invoicePreferences: 'Invoice Preferences',
        tagline: 'Tagline',
        brNumber: 'BR Number',
        servicesText: 'Services Text',
        cityLabel: 'City Label',
        signatureLabel: 'Signature Label'
      },
      dashboard: {
        mySales: 'My Sales',
        searchSales: 'Search sales...',
        salesAmount: 'Sales Amount',
        salesAccount: 'Sales Account',
        sales: 'Sales',
        allSales: 'All Sales',
        completed: 'Completed',
        pending: 'Pending',
      },
      invoice: {
        saveInvoice: 'Save Invoice',
        orderNo: 'Order No',
        date: 'Date',
        billNo: 'Bill No',
        name: 'Name',
        tel: 'Tel',
        address: 'Address',
        item: 'Item',
        description: 'Description',
        amount: 'Amount',
        advance: 'Advance',
        balance: 'Balance',
        signature: 'Signature'
      }
    }
  },
  si: {
    translation: {
      common: {
        save: 'සුරකින්න',
        reset: 'නැවත සකසන්න',
        settings: 'සිටුවම',
      },
      settings: {
        title: 'සිටුවම',
        general: 'සාමාන්‍ය',
        appearance: 'පෙනුම',
        security: 'ආරක්ෂාව',
        notifications: 'දැනුම්දීම්',
        system: 'පද්ධතිය',
        advanced: 'උසස්',
        userPreferences: 'පරිශීලක ප්‍රියතම',
        language: 'භාෂාව',
        dateFormat: 'දිනයේ ආකෘතිය',
        currency: 'ව්‍යවහාර මුදල',
        itemsPerPage: 'පිටුවකට අයිතම',
        companyInformation: 'සමාගම් තොරතුරු',
        invoicePreferences: 'ගෙවීම් පත සැකසිම්',
        tagline: 'නාමාවලිය',
        brNumber: 'BR අංකය',
        servicesText: 'සේවා පෙළ',
        cityLabel: 'නගරය',
        signatureLabel: 'අත්සන'
      },
      dashboard: {
        mySales: 'මගේ විකුණුම්',
        searchSales: 'විකුණුම් සොයන්න...',
        salesAmount: 'විකුණුම් මුදල',
        salesAccount: 'විකුණුම් ගිණුම',
        sales: 'විකුණුම්',
        allSales: 'සියලු',
        completed: 'සම්පූර්ණ',
        pending: 'පැමිණි',
      },
      invoice: {
        saveInvoice: 'ඉන්වොයිස් සුරකින්න',
        orderNo: 'ඇණවුම් අංකය',
        date: 'දිනය',
        billNo: 'බිල් අංකය',
        name: 'නම',
        tel: 'දුරකථන',
        address: 'ලිපිනය',
        item: 'අයිතමය',
        description: 'විස්තර',
        amount: 'මුදල',
        advance: 'ආමන්ත්‍රණ',
        balance: 'ශ්‍රීත',
        signature: 'අත්සන'
      }
    }
  },
  ta: {
    translation: {
      common: {
        save: 'சேமிக்கவும்',
        reset: 'மீட்டமை',
        settings: 'அமைப்புகள்',
      },
      settings: {
        title: 'அமைப்புகள்',
        general: 'பொது',
        appearance: 'தோற்றம்',
        security: 'பாதுகாப்பு',
        notifications: 'அறிவிப்புகள்',
        system: 'கணினி',
        advanced: 'மேம்பட்ட',
        userPreferences: 'பயனர் விருப்பங்கள்',
        language: 'மொழி',
        dateFormat: 'தேதி வடிவம்',
        currency: 'நாணயம்',
        itemsPerPage: 'ஒரு பக்கத்தில் உருப்படிகள்',
        companyInformation: 'நிறுவன தகவல்',
        invoicePreferences: 'விலைப்பட்டியல் விருப்பங்கள்',
        tagline: 'தலைவரி',
        brNumber: 'BR எண்',
        servicesText: 'சேவைகள் உரை',
        cityLabel: 'நகரம்',
        signatureLabel: 'கையொப்பம்'
      },
      dashboard: {
        mySales: 'என் விற்பனை',
        searchSales: 'விற்பனை தேடுங்கள்...',
        salesAmount: 'விற்பனை தொகை',
        salesAccount: 'விற்பனை கணக்கு',
        sales: 'விற்பனை',
        allSales: 'அனைத்து',
        completed: 'நிறைவு',
        pending: 'நிலுவை',
      },
      invoice: {
        saveInvoice: 'விலைப்பட்டியலை சேமிக்கவும்',
        orderNo: 'ஆர்டர் எண்',
        date: 'தேதி',
        billNo: 'பில் எண்',
        name: 'பெயர்',
        tel: 'தொலைபேசி',
        address: 'முகவரி',
        item: 'பொருள்',
        description: 'விளக்கம்',
        amount: 'தொகை',
        advance: 'முன்பணம்',
        balance: 'இருப்பு',
        signature: 'கையொப்பம்'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    returnEmptyString: false
  });

export default i18n;