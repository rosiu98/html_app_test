import './App.css';
import Home from './Pages/Home';
import {Route, Routes, useNavigate} from 'react-router-dom'
import EmailPage from './Components/EmailPage';
import Login from './Pages/Login';
import ProtectedRoutes from './apis/ProtectedRoutes';
import Register from './Pages/Register';
import { useEffect } from 'react';
import AuthApi from './apis/AuthApi';
import useEmailsDataStore from './stores/emailsData';

function App() {



  const validToken = useEmailsDataStore((state) => state.validToken)
  const userInfo = useEmailsDataStore((state) => state.userInfo)
  const updateValidToken = useEmailsDataStore((state) => state.updateValidToken)

  let navigate = useNavigate()
  
  const authorization = async () => {
    try {
      if(userInfo !== null || false || undefined) {
        const response = await AuthApi.get("/is-verify" , {
          headers: {token: JSON.parse(localStorage.getItem('userInfo')).token}
        })
        updateValidToken(response.data)
        // return response.data
        } else {
          updateValidToken(false)
          
        }
    } catch (err) {
      updateValidToken(false)
    }
    // return false

  }

  useEffect(() => {

    if (userInfo  && validToken ) {
      navigate('/')
  }

    authorization()
}, [userInfo, validToken])


  return (
    <div className="App">
            <Routes>
                  <Route element={<ProtectedRoutes/>}> 
                  <Route exact path="/" element={<Home />} />
                  <Route path="/emails/:id" element={<EmailPage/>} />
                  </Route>
         
              
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="*" element={<Login />} />
            </Routes>
    </div>
  );
}

export default App;
