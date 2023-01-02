import React, {useRef, useEffect, useState} from 'react'
import useEmailsSearch from '../Components/useEmailsSearch'
import EmailList from '../Components/EmailList'
import useEmailsDataStore from '../stores/emailsData'
import { ToastContainer, toast } from 'react-toastify'
import { Link, NavLink } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import loadingFile from '../apis/loading.json'
import Lottie from 'lottie-react';
import EmailListV2 from '../Components/EmailListV2'
import Navigation from '../Components/Navigation'

const Homev2 = () => {

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("")
    const [contentblock , setContentBlock] = useState("")
    const [htmlCode, setHtmlCode] = useState("");

    const [show, setShow] = useState(false);
    const listOfCategories = ['Cibc', 'MountainDew', 'TastyRewards', 'Gatorade']
    const listOfContentBlocks = ['PreHeader', 'Logo', 'TwoColumnHeader', 'Body', 'OneCta', 'Rating', 'Legal']

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
    const categories = useEmailsDataStore((state) => state.categories)
    
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
    const categoriesRef = useRef(null)

    const options = {}

    const checkRef = () => {
        if(library.current) {
        const observer = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                // console.log(entry);
                if(!entry.isIntersecting) {
                    categoriesRef.current.className = 'categories'
                    // console.log('I cannot see it')
                } else {
                    // console.log('I can see it')
                    categoriesRef.current.className = 'categories hide'
                }
            })
        }, options)

        observer.observe(library.current)
    }
    }


    useEffect(() => {
        
        window.scrollTo(0, 0)
   }, [categoryChange, typeChange])

  return (
    <div className='main'>
        <Navigation library={library}/>
        <EmailListV2 data={{emails, hasMore, loading, error, pageNumber ,setPageNumber, library}} />
    </div>
  )
}

export default Homev2