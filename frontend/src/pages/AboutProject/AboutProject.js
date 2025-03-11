import React from 'react';
import { useSelector } from 'react-redux';

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

  const isMobile = useSelector((state) => state.isMobile);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <div><strong>{t('coordinatorTitle')}:</strong>
            <p style={{ lineHeight: '1.2em', marginTop: '0px', marginBottom: '8px' }}> David João da Silva Carvalho</p>
            <p style={{ lineHeight: '1.2em', marginTop: '0px', marginBottom: '8px' }}> {t('cesam')}</p>
            <p style={{ lineHeight: '1.2em', marginTop: '0px', marginBottom: '8px' }}> {t('dfis')}, {t('ua')}</p>
          </div>
          <p><strong>{t('datesTitle')}:</strong> 01/01/2023 - 30/06/2024</p>
          <p><strong>{t('fundingEntityTitle')}:</strong> FCT</p>
          <div><strong>{t('proponentInstitutionTitle')}:</strong>
            <p style={{ lineHeight: '1.2em', marginTop: '0px', marginBottom: '8px' }}> {t('ua')}</p>
          </div>
          <div><strong>{t('participatingInstitutionsTitle')}:</strong>
            <p style={{ lineHeight: '1.2em', marginTop: '0px', marginBottom: '8px' }}> Swedish Meteorological and Hydrological Institute, Sweden</p>
            <p style={{ lineHeight: '1.2em', marginTop: '0px', marginBottom: '8px' }}> Universidad de Vigo, Spain</p>
          </div>
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
          <img src={cesam} alt="Centro de Estudos do Ambiente e do Mar" style={!isMobile ? { height: '84px', width: 'auto' } : {height: 'auto', width: '110px'}} />
          <img src={dfis} alt="Departamento de Física" style={!isMobile ? { height: '88px', width: 'auto' } : {height: 'auto', width: '80px'}} />
          <img src={ua} alt="Universidade de Aveiro" style={!isMobile ? { height: '40px', width: 'auto' } : {height: 'auto', width: '110px'}} />
        </div>
        <div className={styles.logosRight}>
          <img src={fct} alt="Fundação para a Ciência e a Tecnologia" style={!isMobile ? { height: '40px', width: 'auto' } : {height: 'auto', width: '110px'}} />
          <img src={pt} alt="República Portuguesa" style={!isMobile ? { height: '40px', width: 'auto' } : {height: 'auto', width: '110px'}} />
        </div>
      </div>
    </div>
  );
};

export default AboutProject;
