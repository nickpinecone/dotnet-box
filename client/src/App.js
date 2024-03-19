import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react";

function App() {
  let [text, setText] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/test").then((res) => {
      res.text().then((val) => {
        setText(val);
      });
    }, []);

  });

  return (
    <div>{text}</div>
  );
}

export default App;
