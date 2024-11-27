import React from 'react';
import styles from './AboutProject.module.css';
import fct_dark from "../../assets/fct-dark.png";
import pt_dark from "../../assets/pt-dark.png";
import ua_dark from "../../assets/ua-dark.png";
import cesam_dark from "../../assets/cesam-dark.png";
import dfis_dark from "../../assets/dfis-dark.png";
import { useTranslation } from 'react-i18next';

const AboutProject = () => {
  const { t } = useTranslation();

  const aboutProjectParagraphs = t('aboutProjectText').split('\n');

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <p><strong>{t('coordinatorTitle')}:</strong>
            <p style={{ lineHeight: '1.2em', marginTop: '0px', marginBottom: '8px' }}> David João da Silva Carvalho</p>
            <p style={{ lineHeight: '1.2em', marginTop: '0px', marginBottom: '8px' }}> {t('cesam')}</p>
            <p style={{ lineHeight: '1.2em', marginTop: '0px', marginBottom: '8px' }}> {t('dfis')}, {t('ua')}</p>
          </p>
          <p><strong>{t('datesTitle')}:</strong> 01/01/2023 - 30/06/2024</p>
          <p><strong>{t('fundingEntityTitle')}:</strong> FCT</p>
          <p><strong>{t('proponentInstitutionTitle')}:</strong>
            <p style={{ lineHeight: '1.2em', marginTop: '0px', marginBottom: '8px' }}> {t('ua')}</p>
          </p>
          <p><strong>{t('participatingInstitutionsTitle')}:</strong>
            <p style={{ lineHeight: '1.2em', marginTop: '0px', marginBottom: '8px' }}> Swedish Meteorological and Hydrological Institute, Sweden</p>
            <p style={{ lineHeight: '1.2em', marginTop: '0px', marginBottom: '8px' }}> Universidad de Vigo, Spain</p>
          </p>
        </div>

        {/* Right column with project description */}
        <div className={styles.rightColumn}>
          <h1 className={styles.title}>{t('aboutProjectTitle')}</h1>
          {aboutProjectParagraphs.map((paragraph, index) => (
            <p key={index} className={styles.text}>{paragraph}</p>
          ))}
        </div>
      </div>
      <div className={styles.logos}>
        <div className={styles.logosLeft}>
          <img src={cesam_dark} alt="Centro de Estudos do Ambiente e do Mar" style={{ height: '98px', width: 'auto' }} />
          <img src={dfis_dark} alt="Departamento de Física" style={{ height: '108px', width: 'auto' }} />
          <img src={ua_dark} alt="Universidade de Aveiro" style={{ height: '50px', width: 'auto' }} />
        </div>
        <div className={styles.logosRight}>
          <img src={fct_dark} alt="Fundação para a Ciência e a Tecnologia" style={{ height: '50px', width: 'auto' }} />
          <img src={pt_dark} alt="República Portuguesa" style={{ height: '50px', width: 'auto' }} />
        </div>
      </div>

    </div>
  );
};

export default AboutProject;
