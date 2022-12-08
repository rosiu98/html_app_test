import './App.css';
import Home from './Pages/Home';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import EmailPage from './Components/EmailPage';

function App() {
  return (
    <div className="App">
      <Router>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/emails/:id" element={<EmailPage/>} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;
