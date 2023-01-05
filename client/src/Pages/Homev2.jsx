import React, {useRef, useEffect, useState} from 'react'
import useEmailsSearch from '../Components/useEmailsSearch'
import useEmailsDataStore from '../stores/emailsData'
import { ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import EmailListV2 from '../Components/EmailListV2'
import Navigation from '../Components/Navigation'
import AddProjectPopup from '../Components/AddProjectPopup'

const Homev2 = () => {

    const [show, setShow] = useState(false);

    const pageNumber = useEmailsDataStore((state) => state.pageNumber)
    const setPageNumber = useEmailsDataStore((state) => state.setPageNumber)
    const deleteUserInfo = useEmailsDataStore((state) => state.deleteUserInfo)
    const categoryChange = useEmailsDataStore((state) => state.category)
    const typeChange = useEmailsDataStore((state) => state.type)
    const query = useEmailsDataStore((state) => state.query)
    

    const Logout = () => {
        deleteUserInfo()
    }

    const {
        emails,
        hasMore,
        loading,
        error
    } = useEmailsSearch(query, pageNumber)


    const library = useRef(null)

    useEffect(() => {
        
        window.scrollTo(0, 0)
   }, [categoryChange, typeChange])

  return (
    <div className='main'>
        <Navigation data={{show, setShow}} library={library}/>
        <EmailListV2 data={{emails, hasMore, loading, error, pageNumber ,setPageNumber, library}} />
        <div onClick={() => setShow(!show)} className={show ? 'overlay blur' : 'overlay'}></div>
        <AddProjectPopup data={{show, setShow}} />    
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
    </div>
    
  )
}

export default Homev2