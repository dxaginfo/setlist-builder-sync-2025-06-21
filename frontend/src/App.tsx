import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';

import { store } from './store';
import AuthGuard from './components/AuthGuard';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import SetlistList from './pages/SetlistList';
import SetlistDetail from './pages/SetlistDetail';
import SongLibrary from './pages/SongLibrary';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import PerformanceMode from './pages/PerformanceMode';

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
  },
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route element={<AuthGuard><MainLayout /></AuthGuard>}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/setlists" element={<SetlistList />} />
              <Route path="/setlists/:id" element={<SetlistDetail />} />
              <Route path="/songs" element={<SongLibrary />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/perform/:setlistId" element={<PerformanceMode />} />
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;