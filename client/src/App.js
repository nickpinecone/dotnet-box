import './App.css';
import { useEffect, useState } from "react";
import Entrance from './pages/Enterance/Enterance'
import Registration from './pages/Registration/Registration';
import MyPortfolio from './pages/MyPortfolio/MyPortfolio'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Entrance/>}/>
        <Route path="/registration" element={<Registration/>}/>
        <Route path="" element={<MyPortfolio/>}/>
      </Routes>
    </Router>
  );
}

export default App;
