import React, {useRef, useEffect, useState} from 'react'
import useEmailsSearch from '../Components/useEmailsSearch'
import useEmailsDataStore from '../stores/emailsData'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import loadingFile from '../apis/loading.json'
import Lottie from 'lottie-react';
import EmailListV2 from '../Components/EmailListV2'
import Navigation from '../Components/Navigation'
import AddProjectPopup from '../Components/AddProjectPopup'

const Homev2 = () => {

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("")
    const [contentblock , setContentBlock] = useState("")
    const [htmlCode, setHtmlCode] = useState("");

    const [show, setShow] = useState(false);

    const pageNumber = useEmailsDataStore((state) => state.pageNumber)
    const setPageNumber = useEmailsDataStore((state) => state.setPageNumber)
    const userInfo = useEmailsDataStore((state) => state.userInfo)
    const deleteUserInfo = useEmailsDataStore((state) => state.deleteUserInfo)
    const addEmail = useEmailsDataStore((state) => state.addEmail)
    const loader = useEmailsDataStore((state) => state.loading)
    const selectCategory = useEmailsDataStore((state) => state.selectCategory)
    const categoryChange = useEmailsDataStore((state) => state.category)
    const typeChange = useEmailsDataStore((state) => state.type)
    const selectContentBlock = useEmailsDataStore((state) => state.selectContentBlock)
    const query = useEmailsDataStore((state) => state.query)
    const setQuery = useEmailsDataStore((state) => state.setQuery)
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await addEmail({
                name,
                html_code: htmlCode,
                category,
                type: type,
                contentblock,
                user_id: userInfo.rows.id
                
            })
            if(loader === false) {
            toast.success(`${name} have been created!`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
            });
            setName("")
            setHtmlCode("")
            setCategory("")
            setType("")
            setContentBlock("")
            setShow(!show)
        }
        } catch (err) {
            console.log(err)
        }
    }

    const Logout = () => {
        deleteUserInfo()
    }


    const showAddProject = async (e) => {
        e.preventDefault()
        setShow(!show)
        setType("")
    }

    const handleSearch = (e) => {
        setQuery(e.target.value)

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