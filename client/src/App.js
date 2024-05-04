import './App.css';
import LoginPage from './pages/LoginPage'
import RegistrationPage from './pages/RegistrationPage';
import Portfolio from './pages/Portfolio'
import AddPage from './pages/AddPage'
import BigCardPage from './pages/BigCardPage';
import Search from './pages/SearchPage'
import Settings from './pages/SettingsPage';
import UserPage from './pages/UserPage'

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import SubscriptionsPage from './pages/SubscriptionsPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/" element={<Portfolio />} />
        <Route path="/add" element={<AddPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/:idUser/:idAchieve" element={<BigCardPage />} />
        <Route path='subscriptions' element={<SubscriptionsPage />} />
        <Route path="/:idUser" element={<UserPage />} />
      </Routes>
    </Router>
  );
}

export default App;
