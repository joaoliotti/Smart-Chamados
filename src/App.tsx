import './App.css'

import AppRoutes from './routes/routes';
import { AuthProvider } from './context/auth';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from './config/ThemeContext';

export default function App() {

  return (
    <BrowserRouter>
    <ThemeProvider>
        <AuthProvider>
          <ToastContainer />
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
