import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { TaskProvider, useTasks } from './context/TaskContext';
import { LanguageProvider } from './context/LanguageContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ProjectPage from './components/ProjectPage';
import ProjectsPage from './components/ProjectsPage';
import TasksPage from './components/TasksPage';
import CalendarPage from './components/CalendarPage';
import SettingsPage from './components/SettingsPage';
import LoginPage from './components/LoginPage';

function AppContent() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { updateCurrentUser } = useTasks();
  const navigate = useNavigate();

  // Cek status login saat app dimulai - HANYA SEKALI
  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    const user = localStorage.getItem('currentUser');
    
    if (auth === 'true' && user) {
      const parsedUser = JSON.parse(user);
      setIsAuthenticated(true);
      setCurrentUser(parsedUser);
      updateCurrentUser(parsedUser);
    }
  }, []); // <-- TIDAK PERLU DEPENDENCY

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    updateCurrentUser(user);
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setCurrentUser(null);
    updateCurrentUser(null);
    navigate('/login');
  };

  const handleBoardChange = (boardId) => {
    navigate(`/project/${boardId}`);
  };

  const handlePageChange = (page) => {
    switch(page) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'projects':
        navigate('/project/personal');
        break;
      case 'tasks':
        navigate('/tasks');
        break;
      case 'calendar':
        navigate('/calendar');
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        navigate('/dashboard');
    }
  };

  // Jika belum login, render LoginPage saja
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Jika sudah login, render layout dengan Sidebar & Navbar
  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          setCollapsed={setSidebarCollapsed}
          onBoardChange={handleBoardChange}
          onPageChange={handlePageChange}
          onLogout={handleLogout}
          currentUser={currentUser}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar 
            darkMode={darkMode} 
            setDarkMode={setDarkMode}
            activeBoard={window.location.pathname.split('/')[2] || 'personal'}
            activePage={window.location.pathname.split('/')[1] || 'dashboard'}
            currentUser={currentUser}
          />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/project/personal" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/project/:boardId" element={<ProjectPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/settings" element={
                <SettingsPage 
                  darkMode={darkMode} 
                  setDarkMode={setDarkMode}
                  onLogout={handleLogout}
                />
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <TaskProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </TaskProvider>
    </Router>
  );
}

export default App;