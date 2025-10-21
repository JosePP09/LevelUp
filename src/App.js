import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import RouterConfg from './routes/RouterConfig';

function App() {
  return (
    <UserProvider>
      <Router>
        <RouterConfg />
      </Router>
    </UserProvider>
  );
}

export default App;
