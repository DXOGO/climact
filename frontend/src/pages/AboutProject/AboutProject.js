import React from 'react';
import styles from './AboutProject.module.css';
import fct from "../../assets/fct-light.png";
import pt from "../../assets/pt-light.png";
import ua from "../../assets/ua-light.png";
import cesam from "../../assets/cesam-light.png";
import dfis from "../../assets/dfis-light.png";
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
          <img src={cesam} alt="Centro de Estudos do Ambiente e do Mar" style={{ height: '88px', width: 'auto' }} />
          <img src={dfis} alt="Departamento de Física" style={{ height: '98px', width: 'auto' }} />
          <img src={ua} alt="Universidade de Aveiro" style={{ height: '40px', width: 'auto' }} />
        </div>
        <div className={styles.logosRight}>
          <img src={fct} alt="Fundação para a Ciência e a Tecnologia" style={{ height: '40px', width: 'auto' }} />
          <img src={pt} alt="República Portuguesa" style={{ height: '40px', width: 'auto' }} />
        </div>
      </div>

    </div>
  );
};

export default AboutProject;
