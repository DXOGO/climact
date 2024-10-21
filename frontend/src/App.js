import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './pages/MainLayout/MainLayout';
import AboutProject from './pages/AboutProject/AboutProject';
import Header from './components/Header/Header';
import { useDispatch } from 'react-redux';
import { setIsMobile } from './redux/actions'; // Import the action
import './App.css';

function App() {
    const dispatch = useDispatch();

    // Handle window resize
    const handleResize = () => {
        const isMobile = window.innerWidth <= 768;
        dispatch(setIsMobile(isMobile));
    };

    useEffect(() => {
        // Set initial state
        handleResize();

        // Add resize event listener
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [dispatch]); // Ensure dispatch is included in the dependency array

    return (
        <div className="App">
            <Router>
                <Header />
                <Routes>
                    <Route path="/project" element={<AboutProject />} />
                    <Route path="/" element={<MainLayout />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
