import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './context/auth-context';
import { AuthPage } from './pages/auth-page';
import { DashboardPage } from './pages/dashboard-page';
import { ProtectedRoute } from './routes/protected-route';

export function App() { return <AuthProvider><BrowserRouter><Routes><Route path="/" element={<DashboardPage />} /><Route path="/login" element={<AuthPage mode="login" />} /><Route path="/register" element={<AuthPage mode="register" />} /><Route element={<ProtectedRoute />}><Route path="/account" element={<DashboardPage />} /></Route><Route path="*" element={<DashboardPage />} /></Routes></BrowserRouter></AuthProvider>; }
