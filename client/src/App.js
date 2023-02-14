import './App.css';
import {Route, Routes, useNavigate} from 'react-router-dom'
import EmailPagev2 from './Pages/EmailPagev2';
import Login from './Pages/Login';
import ProtectedRoutes from './apis/ProtectedRoutes';
import Register from './Pages/Register';
import { useEffect } from 'react';
import AuthApi from './apis/AuthApi';
import useEmailsDataStore from './stores/emailsData';
import Profile from './Pages/Profile';
import Home from './Pages/Home';
import AddProjectPopup from './Components/AddProjectPopup';
import { ToastContainer } from 'react-toastify';

function App() {



  const validToken = useEmailsDataStore((state) => state.validToken)
  const userInfo = useEmailsDataStore((state) => state.userInfo)
  const updateValidToken = useEmailsDataStore((state) => state.updateValidToken)
  const show = useEmailsDataStore((state) => state.show)
  const setShow = useEmailsDataStore((state) => state.setShow)

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
                  <Route path="/email/:id" element={<EmailPagev2/>} />
                  <Route path="/profile" element={<Profile/>} />
                  </Route>
                  
                <Route path="/login" element={<Login/>} />
                <Route path='/test/:id' element={<EmailPagev2/>} />
                <Route path='/emails' element={<Home/>} />
                <Route path="/contentblocks" element={<Home/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="*" element={<Login />} />
            </Routes>
            <ToastContainer
                    theme='colored'
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            <div onClick={() => setShow(!show)} className={show ? 'overlay blur' : 'overlay'}></div>
            <AddProjectPopup data={{show, setShow}} />    
    </div>
  );
}

export default App;
