import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router} from "react-router-dom";
import RouterConfig from "./routes/RouterConfig"; 

function App() {
  return (
    <Router>
      <RouterConfig />
    </Router>
  );
}

export default App;
