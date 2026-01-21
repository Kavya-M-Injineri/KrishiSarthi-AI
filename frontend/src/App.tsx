import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CropScanner from './components/CropScanner';
import SoilAnalysis from './components/SoilAnalysis';
import IrrigationAdvisor from './components/IrrigationAdvisor';
import WeatherForecast from './components/WeatherForecast';
import WildlifeDetection from './components/WildlifeDetection';
import MarketPrediction from './components/MarketPrediction';
import DailyAdvisory from './components/DailyAdvisory';
import Profile from './components/Profile';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>

        {/* LOGIN */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/home" /> : 
              <LoginPage onLogin={() => setIsAuthenticated(true)} />
          }
        />

        {/* ✅ REGISTER — YOU WERE MISSING THIS */}
        <Route 
          path="/register"
          element={
            isAuthenticated ?
              <Navigate to="/home" /> :
              <RegisterPage />
          }
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <Layout>
                <Routes>
                  <Route path="/home" element={<Dashboard />} />
                  <Route path="/scan" element={<CropScanner />} />
                  <Route path="/soil" element={<SoilAnalysis />} />
                  <Route path="/water" element={<IrrigationAdvisor />} />
                  <Route path="/weather" element={<WeatherForecast />} />
                  <Route path="/wildlife" element={<WildlifeDetection />} />
                  <Route path="/market" element={<MarketPrediction />} />
                  <Route path="/advisory" element={<DailyAdvisory />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/" element={<Navigate to="/home" />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

      </Routes>
    </Router>
  );
}
