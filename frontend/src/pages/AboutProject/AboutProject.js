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

  const members = [
    { name: "Alfredo Moreira Caseiro Rocha", position: t("prof"), image: require('../../assets/Alfredo-Moreira-Caseiro-Rocha.jpeg') },
    { name: "David João da Silva Carvalho", position: t("researcher1"), image: require('../../assets/David-Joao-da-Silva-Carvalho.jpeg') },
    { name: "Maria Alexandra Castelo Sobral Monteiro", position: t("researcher2"), image: require('../../assets/Maria-Alexandra-Castelo-Sobral-Monteiro.jpg') },
    { name: "Susana Cardoso Pereira Firmino Vaz", position: t("researcher3"), image: require('../../assets/Susana-Cardoso-Pereira-Firmino-Vaz.jpeg') },
    { name: "Ana Cristina Carvalho", position: t("researcher3"), image: require('../../assets/Ana-Cristina-Carvalho.jpeg') },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <div><strong>{t('coordinatorTitle')}:</strong>
            <p style={{ lineHeight: '1.2em', marginTop: '0px', marginBottom: '8px' }}> David João da Silva Carvalho</p>
            <p style={{ lineHeight: '1.2em', marginTop: '0px', marginBottom: '8px' }}> {t('cesam')}</p>
            <p style={{ lineHeight: '1.2em', marginTop: '0px', marginBottom: '8px' }}> {t('dfis')}, {t('ua')}</p>
          </div>
          <p><strong>{t('datesTitle')}:</strong> 12/03/2023 - 11/03/2025</p>
          <><strong>{t('fundingEntityTitle')}:</strong> {t('fct')}</>
          <div><strong>{t('proponentInstitutionTitle')}:</strong>
            <p style={{ lineHeight: '1.2em', marginTop: '0px', marginBottom: '8px' }}> {t('ua')}</p>
          </div>
          <div><strong>{t('participatingInstitutionsTitle')}:</strong>
            <p style={{ lineHeight: '1.2em', marginTop: '0px', marginBottom: '8px' }}> Swedish Meteorological and Hydrological Institute, Sweden</p>
            <p style={{ lineHeight: '1.2em', marginTop: '0px', marginBottom: '8px' }}> Universidad de Vigo, Spain</p>
          </div>
        </div>

        {/* About project description */}
        <div className={styles.rightColumn}>
          <h1 className={styles.title}>{t('aboutProjectTitle')}</h1>
          {aboutProjectParagraphs.map((paragraph, index) => (
            <p key={index} className={styles.text}>{paragraph}</p>
          ))}

          <div className={styles.membersSection}>
            <h1 className={styles.title}>{t('cesamMembers')}</h1>
            <div className={styles.membersGrid}>
              {members.map((member, index) => (
                <div key={index} className={styles.memberCard}>
                  <img src={member.image} alt={member.name} className={styles.memberPhoto} />
                  <p className={styles.memberName}>{member.name}</p>
                  <p className={styles.memberPosition}>{member.position}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Logos bottom */}
      <div className={styles.logos}>
        <div className={styles.logosLeft}>
          <img src={cesam} alt="Centro de Estudos do Ambiente e do Mar" style={!isMobile ? { height: '84px', width: 'auto' } : { height: 'auto', width: '110px' }} />
          <img src={dfis} alt="Departamento de Física" style={!isMobile ? { height: '88px', width: 'auto' } : { height: 'auto', width: '80px' }} />
          <img src={ua} alt="Universidade de Aveiro" style={!isMobile ? { height: '40px', width: 'auto' } : { height: 'auto', width: '110px' }} />
        </div>
        <div className={styles.logosRight}>
          <img src={fct} alt="Fundação para a Ciência e a Tecnologia" style={!isMobile ? { height: '40px', width: 'auto' } : { height: 'auto', width: '110px' }} />
          <img src={pt} alt="República Portuguesa" style={!isMobile ? { height: '40px', width: 'auto' } : { height: 'auto', width: '110px' }} />
        </div>
      </div>
    </div>
  );
};

export default AboutProject;
