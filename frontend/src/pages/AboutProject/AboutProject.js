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
        <p><strong>{t('coordinatorTitle')}:</strong> David João da Silva Carvalho</p>
        <p><strong>{t('programmeTitle')}:</strong> Projetos de Investigação de Caráter Exploratório - 2022</p>
        <p><strong>{t('datesTitle')}:</strong> 01/01/2023 - 30/06/2024</p>
        <p><strong>{t('totalFundingTitle')}:</strong> 49993 €</p>
        <p><strong>{t('fundingEntityTitle')}:</strong> FCT</p>
        <p><strong>{t('proponentInstitutionTitle')}:</strong> Universidade de Aveiro</p>
        <p><strong>{t('participatingInstitutionsTitle')}:</strong>
          <br /> Swedish Meteorological and Hydrological Institute, Sweden
          <br /> Universidad de Vigo, Spain
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
