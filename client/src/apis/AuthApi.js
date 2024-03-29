import axios from "axios";

// NODE_ENV = 'development'
// NODE_ENV = 'production'

const baseURL = process.env.NODE_ENV === 'production' ? 
"https://html-app-backend.onrender.com/api/v1/" :  
"http://localhost:3001/api/v1"


export default axios.create({
    baseURL
})