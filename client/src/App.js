import './App.css';
import { useEffect, useState } from "react";
import Entrance from './pages/Enterance/Enterance'
import Registration from './pages/Registration/Registration';
import MyPortfolio from './pages/MyPortfolio/MyPortfolio'
import AddAchiv from './pages/AddAchiv/AddAchiv'
import BigCard from './pages/BigCard/BigCard';
import Find from './pages/Find/Find'
import Setting from './pages/Setting/Setting';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';


function App() {
  let port;
  let id;
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Entrance/>}/>
        <Route path="/registration" element={<Registration/>}/>
        <Route path="/" element={<MyPortfolio/>}/>
        <Route path="/add" element={<AddAchiv/>}/>
        <Route path="/find" element={<Find/>}/>
        <Route path="/setting" element={<Setting/>}/>
        <Route path="/:idPortfolio/:idAchieve" element={<BigCard />}/>
      </Routes>
    </Router>
  );
}

export default App;
