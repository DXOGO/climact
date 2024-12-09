import React from 'react';
import { useSelector } from 'react-redux';
import styles from './WelcomeModal.module.css';
import { useTranslation } from 'react-i18next';

import fct from "../../assets/fct-light.png";
import pt from "../../assets/pt-light.png";
import ua from "../../assets/ua-light.png";
import cesam from "../../assets/cesam-light.png";
import dfis from "../../assets/dfis-light.png";

const WelcomeModal = ({ onClose }) => {
    const isMobile = useSelector((state) => state.isMobile);

    const { t } = useTranslation();

    return (
        <div className={styles.welcomeModalOverlay}>
            <div className={styles.welcomeModalContent}>
                <div className={styles.welcomeModalTextContainer}>
                    <div className={styles.welcomeModalTitle}>
                        <p>{t('welcomeModalTitle')}</p>
                    </div>
                    <div className={styles.welcomeModalText}>
                        <>{t('welcomeModalText')}</>
                    </div>
                    <button className={styles.modalButton} onClick={onClose}>{t('continue')}</button>
                </div>
                <div className={styles.logos}>
                    <div className={styles.logosLeft}>
                        <img src={cesam} alt="Centro de Estudos do Ambiente e do Mar" style={!isMobile ? { height: '74px', width: 'auto' } : { height: 'auto', width: '110px' }} />
                        <img src={dfis} alt="Departamento de Física" style={!isMobile ? { height: '78px', width: 'auto' } : { height: 'auto', width: '80px' }} />
                        <img src={ua} alt="Universidade de Aveiro" style={!isMobile ? { height: '36px', width: 'auto' } : { height: 'auto', width: '110px' }} />
                    </div>
                    <div className={styles.logosRight}>
                        <img src={fct} alt="Fundação para a Ciência e a Tecnologia" style={!isMobile ? { height: '36px', width: 'auto' } : { height: 'auto', width: '110px' }} />
                        <img src={pt} alt="República Portuguesa" style={!isMobile ? { height: '36px', width: 'auto' } : { height: 'auto', width: '110px' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomeModal;