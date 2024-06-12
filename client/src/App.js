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

const Error = () => <h1>Page not found</h1>

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/myPortfolio" element={<Portfolio />} />
        <Route path="/add" element={<AddPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/:idUser/:idAchieve" element={<BigCardPage />} />
        <Route path='/subscriptions' element={<SubscriptionsPage />} />
        <Route path="/:idUser" element={<UserPage />} />
        <Route path="/login/restore_password" element={<Recovery />} />
        <Route path="/login/restore_password/:idUser/:token" element={<RecoverPasswordPage />} />
        <Route path="/:idUser/:idAchieve/edit" element={<EditPage />} />
        <Route path="/" element={<MainPage/>} />
        <Route path='*' element={Error()}/>
      </Routes>
    </Router>
  );
}

export function UrlServer() {
  //const url = "185.211.170.35";
  const url = "localhost:4000";
  return (url);
}

export default App;

