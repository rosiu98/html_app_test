import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import useEmailsDataStore from '../stores/emailsData'


const Register = () => {

    const [name , setName] = useState('')
    const [image , setImage] = useState('')
    const [imagePreview , setImagePreview] = useState('https://media.istockphoto.com/id/1147544807/pl/wektor/obraz-miniatury-grafika-wektorowa.jpg?s=612x612&w=0&k=20&c=gvM5GjVEmBX7iO7Mw8KDpvwozCG3jMvLuzLWT-wFyjM=')
    const [email , setEmail] = useState('')
    const [password , setPassword] = useState('')
    const [secretKey, setSecretKey] = useState('')
    const createUserInfo = useEmailsDataStore((state) => state.createUserInfo)
    const updateValidToken = useEmailsDataStore((state) => state.updateValidToken)

    const imageHandler = (e) => {
        e.preventDefault()
        const reader = new FileReader();
        reader.onload = () => {
            if(reader.readyState === 2){
                setImagePreview(reader.result)
            }
        }
        reader.readAsDataURL(e.target.files[0])
        setImage(e.target.files[0])

    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData();
        formData.append("name", name)
        formData.append("image", image)
        formData.append("email", email)
        formData.append("password", password)
        formData.append('secretKey', secretKey)

        // console.log(formData.values())

        for (const value of formData.values()) {
            console.log(value);
        }

        createUserInfo(formData)
        updateValidToken(true)
            
    } 

    return (
        <>    <section className='grid-main'>
            <div className='container register'>
                <div className="picture pictures">
                    <img className='ilustration' src="https://i.imgur.com/qS9heKH.png" alt="register page ilustration" />
                    <p>
                        <strong>Rules</strong>:
                        <br/>
                        <br/>
                    </p>
                    <ul>
                        <li>Do not add buggy code</li>
                        <li>Add emails in proper categories and sections</li>
                        <li>Have fun!</li>
                    </ul>
                </div>
                <div className="signup">
                    <div className="input-container">
                        <div className="picture">
                            <img src={imagePreview} alt="Placeholder" />
                            <div className='file-button'>Choose Image</div>
                            <input onChange={imageHandler} type="file" accept='image/*' placeholder='Image' className="input-box" />
                        </div>
                        <div className="title">
                            Email App
                        </div>
                        <div className='form'>
                            <form action="" className='form-container'>
                                <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder='Name' className="input-box" />
                                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Email Address' required className="input-box" />
                                <input value={password} autoComplete="true" onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password' required className="input-box" />
                                <input value={secretKey} onChange={(e) => setSecretKey(e.target.value)} type="password" placeholder='Secret Key' className="input-box" />
                            </form>
                        </div>
                        <div onClick={handleSubmit} className="input-button">
                                Register
                        </div>
                        <div className='back-link'>
                            or Login <Link to="/login">here</Link>.
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


export default Register