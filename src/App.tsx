import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EnvironmentBanner from './components/EnvironmentBanner';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Education from './pages/Education';
import Tutoring from './pages/Tutoring';
import Dashboard from './pages/Dashboard';
import CreateResource from './pages/CreateResource';
import CreateTutor from './pages/CreateTutor';
import CreateCourse from './pages/CreateCourse';
import CourseDetail from './pages/CourseDetail';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import CreateNews from './pages/CreateNews';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <EnvironmentBanner />
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/education" element={<Education />} />
                <Route path="/tutoring" element={<Tutoring />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/create-course" element={
                  <ProtectedRoute>
                    <CreateCourse />
                  </ProtectedRoute>
                } />
                <Route path="/create-news" element={
                  <ProtectedRoute>
                    <CreateNews />
                  </ProtectedRoute>
                } />
                <Route path="/education/create" element={
                  <ProtectedRoute>
                    <CreateResource />
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
