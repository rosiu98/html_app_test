import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import useEmailsDataStore from '../stores/emailsData'
import { ToastContainer } from 'react-toastify'


const Login = () => {

    const [email , setEmail] = useState('')
    const [password , setPassword] = useState('')
    const addUserInfo = useEmailsDataStore((state) => state.addUserInfo)
    const updateValidToken = useEmailsDataStore((state) => state.updateValidToken)

    const handleSubmit = async (e) => {
        e.preventDefault()
    
        await addUserInfo({email, password})
        updateValidToken(true)
            
       } 


  return (
    <>    <section className='grid-main'>
        <div className='container'>
            <div className="picture">
                <img className='ilustration' src="https://i.imgur.com/BeJCtG2.jpg" alt="login page ilustration" />
            </div>
            <div className="signup">
                <div className="input-container">
                    <div className="picture">
                        <img src="https://i.imgur.com/SwZ8tI5.png" alt="input ilustration" />
                    </div>
                    <div className="title">
                        Email App
                    </div>
                    <div className='form'>
                        <form action="" className='form-container'>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Email Address' required className="input-box" />
                            <input value={password} autoComplete="true" onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password' required className="input-box" />
                        </form>
                    </div>
                    <div onClick={handleSubmit} className="input-button">
                            Login
                    </div>
                    <div className='back-link'>
                        or Register <Link to="/register">here</Link>.
                    </div>
                </div>
            </div>
        </div>
        
    </section>
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
            </>

  )
}

export default Login