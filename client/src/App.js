import './App.css';
import LoginPage from './pages/LoginPage'
import RegistrationPage from './pages/RegistrationPage';
import Portfolio from './pages/Portfolio'
import AddPage from './pages/AddPage'
import BigCardPage from './pages/BigCardPage';
import Search from './pages/SearchPage'
import Settings from './pages/SettingsPage';
import UserPage from './pages/UserPage'
import SubscriptionsPage from './pages/SubscriptionsPage';
import Recovery from './pages/Recovery';
import RecoverPasswordPage from './pages/RecoverPassword';
import EditPage from './pages/EditPage';
import MainPage from './pages/MainPage';

import {
  HashRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

function App() {
  return (
    <Router basename="">
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
        <Route path="/login/restore_password" element={<Recovery />} />
        <Route path="/login/restore_password/:idUser/:token" element={<RecoverPasswordPage />} />
        <Route path="/:idUser/:idAchieve/edit" element={<EditPage />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
