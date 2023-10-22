import axios from "axios";

// NODE_ENV = 'development'
// NODE_ENV = 'production'

const baseURL = process.env.NODE_ENV === 'production' ? 
"https://html-app-backend.vercel.app/api/v1/projects" :  
"http://localhost:3001/api/v1/projects"


export default axios.create({
    baseURL
})