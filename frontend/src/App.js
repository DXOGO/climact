import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './pages/MainLayout/MainLayout';
import AboutProject from './pages/AboutProject/AboutProject';
import Header from './components/Header/Header';
import { useDispatch } from 'react-redux';
import { setIsMobile } from './redux/actions'; // Import the action
import './App.css';

import WelcomeModal from './components/Modal/WelcomeModal';

function App() {
    const dispatch = useDispatch();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    useEffect(() => {
        const hasSeenModal = localStorage.getItem("welcomeModalShown");
    
        if (!hasSeenModal) {
          setIsModalOpen(true);
          localStorage.setItem("welcomeModalShown", "true");
        }
      }, []);
    
      const handleClose = () => {
        setIsModalOpen(false);
      };

    const handleResize = useCallback(() => {
        const isMobile = window.innerWidth <= 768;
        dispatch(setIsMobile(isMobile));
    }, [dispatch]);

    useEffect(() => {
        // Set initial state
        handleResize();

        // Add resize event listener
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]); // Ensure dispatch is included in the dependency array

    return (
        <div className="App">
            <Router>
                <Header />
                <Routes>
                    <Route path="/project" element={<AboutProject />} />
                    <Route path="/" element={<MainLayout />} />
                </Routes>
                {isModalOpen && <WelcomeModal onClose={handleClose} />}
            </Router>
        </div>
    );
}

export default App;
