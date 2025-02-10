import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button 
      variant="contained" 
      color="primary" 
      onClick={toggleLanguage} 
      startIcon={<TranslateIcon />}
    >
      {i18n.language === 'en' ? 'Español' : 'English'}
    </Button>
  );
};

export default LanguageToggle;
