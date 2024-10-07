import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './pages/MainLayout/MainLayout';
import AboutProject from './pages/AboutProject/AboutProject';
import Header from './components/Header/Header';
import './App.css';

function App() {
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
