import React from 'react';
import styles from './AboutProject.module.css';

import fct_dark from "../../assets/fct-dark.png";
import pt_dark from "../../assets/pt-dark.png";

const AboutProject = () => {
  return (
    <div className={styles.container}>
      {/* Left column with project details */}
      <div className={styles.leftColumn}>
        <p><strong>Coordinator:</strong> David João da Silva Carvalho</p>
        <p><strong>Programme:</strong> Projetos de Investigação de Caráter Exploratório - 2022</p>
        <p><strong>Dates:</strong> 01/01/2023 - 30/06/2024</p>
        <p><strong>Total Funding:</strong> 49993 €</p>
        <p><strong>Funding Entity:</strong> FCT</p>
        <p><strong>Proponent Institution:</strong> Universidade de Aveiro</p>
        <p><strong>Participating Institutions:</strong>
          <br /> Swedish Meteorological and Hydrological Institute, Sweden
          <br /> Universidad de Vigo, Spain
        </p>
      </div>

      {/* Right column with project description */}
      <div className={styles.rightColumn}>
        <h1 className={styles.title}>About the Project</h1>
        <p className={styles.text}>
          Climate change (CC) impacts and adaptation for virtually all human activities are perhaps the greatest challenges mankind has ever faced. Regardless of the present and/or future measures taken to decrease greenhouse gases emissions, global CC is currently well underway and its catastrophic effects have been impacting many countries in recent years. CC impacts are highly disruptive for the population and environment, triggering significant social and political consequences together with major economic losses. The recently released IPCC 6th Assessment Report (IPCC 2021) confirmed that southwestern Europe, where Portugal is located, is one of the areas most vulnerable to CC and its impacts due to its location and climatic characteristics, and is expected to witness in the future increased intensity and frequency of occurrence of extreme weather episodes, forest fires, air quality and population health degradation, droughts, agricultural impacts, etc.
          <br /><br />
          To mitigate CC impacts on the environment, population, economy, and society, in general, it is fundamental to investigate in detail the future climatic scenarios to effectively design and adopt adaptation and resilience strategies. Such strategies should be studied at national and regional levels due to the heterogeneity of the CC spatial variability, specific vulnerabilities, and strengths of each country to cope and adapt to such changes.
          <br /><br />
          ClimACT proposes to carry out the first comprehensive investigation on the future climatic scenarios for Portugal using the most up-to-date future climate projections from the CMIP6 project, the latest state-of-the-art future climate scenarios that served as a base for the IPCC AR6. This will be dynamically downscaled for Portugal to allow a realistic and detailed investigation of CC patterns and impacts.
          <br /><br />
          The main deliverable of ClimACT will be a Future Climate Atlas for Portugal, a website where all ClimACT climate data and products will be publicly accessible, to be explored and used by the scientific community, end-users, decision-makers, and stakeholders to evaluate CC impacts in the sectors most vulnerable to climate change impacts in Portugal: extreme weather, forest fires, air quality, human health, water resources, renewable energies, and agriculture.
          <br /><br />
          The project will rely on the new CMIP6 future climate scenarios and carry out four main tasks:
          <br />
          <p>T1 – Acquisition and pre-processing of CMIP6 climatic data for three CMIP6 future climate scenarios: SSP5-8.5, a business-as-usual scenario; SSP1-2.6, a sustainable scenario that meets the Paris Agreement targets; and SSP2-4.5, a middle-of-the-road scenario.</p>
          <p>T2 – Carry out a high-resolution (5 km) dynamical downscaling of CMIP6 global climate projections for Portugal.</p>
          <p>T3 – Perform a detailed characterization of Portugal's future climate scenarios.</p>
          <p>T4 – Production of a Future Climate Atlas for Portugal that makes available ClimACT results, tailored and targeted to be used by the scientific community, decision-makers and stakeholders connected to the sectors most vulnerable to climate change impacts in Portugal such as extreme weather, forest fires, water resources, air quality, human health, renewable energies and agriculture. Integrated analysis and dissemination of all the obtained results.</p>
        </p>
        <p className={styles.text}>
          This project will rely on the new CMIP6 future climate scenarios, not yet investigated in detail for Portugal. Thus, this proposal shows high scientific merit and an innovative nature since it will make a substantial contribution to the state-of-the-art in CC science in terms of published research and scientific knowledge. In addition, both the work directly developed within ClimACT and the subsequent research done by the scientific community using data from the Future Climate Atlas can have a strong societal relevance and be an important tool for the national stakeholders and decision-makers, through a well-informed and scientifically-backed process, to design and implement effective mitigation strategies to cope with the changing climate, considering three different future climate projections that describe very different pathways: a worst-case scenario based on fossil fuels; a sustainable scenario that meets the Paris Agreement targets; and a middle-of-the-road scenario with some greenhouse gases (GHG) emissions mitigation.
          ClimACT research team and consultants have an extensive research background, expertise and know-how in all scientific areas covered in ClimACT: CC science, atmospheric and climate modelling, CC impacts on renewable energies, air quality, environment, water resources, agriculture, population and human health, which ensures the success of the project and foster the application and use of this project results in the investigation of specific CC impacts and adaptation strategies.
        </p>
        <div className={styles.logos}>
          <img src={fct_dark} alt='Fundação para a Ciência e a Tecnologia' style={{ width: '300px', height: 'auto' }} />
          <img src={pt_dark} alt='República Portuguesa' style={{ width: '300px', height: 'auto' }} />
        </div>
      </div>
    </div>
  );
};

export default AboutProject;
