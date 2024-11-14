import React from 'react';
import styles from './AboutProject.module.css';
import fct_dark from "../../assets/fct-dark.png";
import pt_dark from "../../assets/pt-dark.png";
import { useTranslation } from 'react-i18next';

const AboutProject = () => {
  const { t } = useTranslation();

  const aboutProjectParagraphs = t('aboutProjectText').split('\n');

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <p><strong>{t('coordinatorTitle')}:</strong>
          <p style={{lineHeight: '1.2em', marginTop: '0px', marginBottom: '8px'}}> David João da Silva Carvalho</p>
          <p style={{lineHeight: '1.2em', marginTop: '0px', marginBottom: '8px'}}> {t('cesam')}</p>
          <p style={{lineHeight: '1.2em', marginTop: '0px', marginBottom: '8px'}}> {t('dfis')}, {t('ua')}</p>
        </p>
        <p><strong>{t('datesTitle')}:</strong> 01/01/2023 - 30/06/2024</p>
        <p><strong>{t('fundingEntityTitle')}:</strong> FCT</p>
        <p><strong>{t('proponentInstitutionTitle')}:</strong>
          <p style={{lineHeight: '1.2em', marginTop: '0px', marginBottom: '8px'}}> {t('ua')}</p>
        </p>
        <p><strong>{t('participatingInstitutionsTitle')}:</strong>
          <p style={{lineHeight: '1.2em', marginTop: '0px', marginBottom: '8px'}}> Swedish Meteorological and Hydrological Institute, Sweden</p>
          <p style={{lineHeight: '1.2em', marginTop: '0px', marginBottom: '8px'}}> Universidad de Vigo, Spain</p>
        </p>
      </div>

      {/* Right column with project description */}
      <div className={styles.rightColumn}>
        <h1 className={styles.title}>{t('aboutProjectTitle')}</h1>
        {aboutProjectParagraphs.map((paragraph, index) => (
          <p key={index} className={styles.text}>{paragraph}</p>
        ))}
        <div className={styles.logos}>
          <img src={fct_dark} alt='Fundação para a Ciência e a Tecnologia' style={{ width: '300px', height: 'auto' }} />
          <img src={pt_dark} alt='República Portuguesa' style={{ width: '300px', height: 'auto' }} />
        </div>
      </div>
    </div>
  );
};

export default AboutProject;
