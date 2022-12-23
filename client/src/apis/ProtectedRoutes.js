import { Navigate, Outlet } from "react-router-dom"
import useEmailsDataStore from "../stores/emailsData"


const useAuth = () => {

    const userInfo = useEmailsDataStore((state) => state.userInfo)
    const validToken = useEmailsDataStore((state) => state.validToken)
    
    return userInfo && validToken ? true : false
}

const ProtectedRoutes = () => {

  const isAuth = useAuth()


    return isAuth ? <Outlet/> : <Navigate to='/login' replace />;
}

export default ProtectedRoutes;