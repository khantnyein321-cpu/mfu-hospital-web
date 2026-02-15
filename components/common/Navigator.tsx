import React, { useState } from 'react';
import Login from '../../app/Auth/Login';
import Dashboard from '../../app/Auth/Dashboard';

type Screen = 'Login' | 'Dashboard';

export default function Navigator() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Login');

  const navigateToLogin = () => {
    setCurrentScreen('Login');
  };

  const navigateToDashboard = () => {
    setCurrentScreen('Dashboard');
  };

  // Render current screen
  if (currentScreen === 'Login') {
    return <Login onNavigateToDashboard={navigateToDashboard} />;
  }

  if (currentScreen === 'Dashboard') {
    return <Dashboard onNavigateToLogin={navigateToLogin} />;
  }

  return null;
}
