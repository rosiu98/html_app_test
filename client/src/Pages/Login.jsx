import React from 'react'
import { useState } from 'react'
import useEmailsDataStore from '../stores/emailsData'



const Login = () => {

    const [email , setEmail] = useState('')
    const [password , setPassword] = useState('')
    // const getUserInfo = useEmailsDataStore((state) => state.getUserInfo)
    const addUserInfo = useEmailsDataStore((state) => state.addUserInfo)
    const updateValidToken = useEmailsDataStore((state) => state.updateValidToken)


   const handleSubmit = async (e) => {
    e.preventDefault()

    addUserInfo({email, password})
    updateValidToken(true)
        
   } 

  return (
    <div className='center-box'>
    <form action="">
        <div className='input-field'>
            <label htmlFor="Email">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder='Email' />
        </div>
        <div className='input-field'>
            <label htmlFor="Password">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="text" placeholder='Password' />
        </div>

        <div className='button-loading'>
            <button onClick={handleSubmit} className='button flex' type='submit' ><span>Submit</span></button>
        </div>
    </form>

</div>
  )
}

export default Login