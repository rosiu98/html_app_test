import React from 'react'
import { useState } from 'react'
import useEmailsDataStore from '../stores/emailsData'


const Register = () => {

    const [name , setName] = useState('')
    const [image , setImage] = useState('')
    const [imagePreview , setImagePreview] = useState('https://media.istockphoto.com/id/1147544807/pl/wektor/obraz-miniatury-grafika-wektorowa.jpg?s=612x612&w=0&k=20&c=gvM5GjVEmBX7iO7Mw8KDpvwozCG3jMvLuzLWT-wFyjM=')
    const [email , setEmail] = useState('')
    const [password , setPassword] = useState('')
    // const getUserInfo = useEmailsDataStore((state) => state.getUserInfo)
    const createUserInfo = useEmailsDataStore((state) => state.createUserInfo)
    // const userInfo = useEmailsDataStore((state) => state.userInfo)
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

    // console.log(formData.values())

    for (const value of formData.values()) {
        console.log(value);
      }

    createUserInfo(formData)
    updateValidToken(true)
        
   } 

  return (
    <div className='center-box'>
    <form action="" enctype="multipart/form-data">
     <div className="image-holder">
        <img src={imagePreview} alt="Placeholder" />
    </div>   
    <div className='input-field'>
            <label htmlFor="Name">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder='Name' />
        </div>
        <div className='input-field'>
            <label htmlFor="Image">Image</label>
            <input onChange={imageHandler} type="file" accept='image/*' placeholder='Image' />
        </div>
        {/* <div className='input-field'>
            <label htmlFor="Image">Image</label>
            <input value={image} onChange={(e) => setImage(e.target.value)} type="text" placeholder='Image' />
        </div> */}
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

export default Register