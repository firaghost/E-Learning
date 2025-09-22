import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Education from './pages/Education';
import Jobs from './pages/Jobs';
import Tutoring from './pages/Tutoring';
import Dashboard from './pages/Dashboard';
import CreateResource from './pages/CreateResource';
import CreateJob from './pages/CreateJob';
import CreateTutor from './pages/CreateTutor';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/education" element={<Education />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/tutoring" element={<Tutoring />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/education/create" element={
                  <ProtectedRoute>
                    <CreateResource />
                  </ProtectedRoute>
                } />
                <Route path="/jobs/create" element={
                  <ProtectedRoute>
                    <CreateJob />
                  </ProtectedRoute>
                } />
                <Route path="/tutoring/create" element={
                  <ProtectedRoute>
                    <CreateTutor />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;