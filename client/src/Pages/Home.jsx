import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import Lottie from 'lottie-react';
import loadingFile from '../apis/loading.json'
import EmailList from '../Components/EmailList';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import useEmailsDataStore from '../stores/emailsData';

const Home = () => {

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("")
    const [contentblock , setContentBlock] = useState("")
    const [htmlCode, setHtmlCode] = useState("");

    const [show, setShow] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState('All')
    const [selectedContentBlock, setSelectedContentBlock] = useState('')
    const listOfCategories = ['Cibc', 'MountainDew', 'TastyRewards', 'Gatorade']
    const listOfContentBlocks = ['PreHeader', 'Logo', 'TwoColumnHeader', 'Body', 'OneCta', 'Rating', 'Legal']

    const userInfo = useEmailsDataStore((state) => state.userInfo)
    const data = useEmailsDataStore((state) => state.emails)
    const deleteUserInfo = useEmailsDataStore((state) => state.deleteUserInfo)
    const fetchEmails= useEmailsDataStore((state) => state.fetchEmails);
    const addEmail = useEmailsDataStore((state) => state.addEmail)
    const loading = useEmailsDataStore((state) => state.loading)


    useEffect(() => {
        fetchEmails();   
    }, [fetchEmails])

    
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
            if(loading === false) {
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

    const selectCategory = (category) => {
        setSelectedContentBlock('')
        setSelectedCategory(category)

    }

    const filterData = () => {

        if(selectedCategory === 'All' && selectedContentBlock === "") {
            return data
        } else if (selectedContentBlock !== '') {
            return data.filter(item => item.contentblock === selectedContentBlock)
        }
       return data.filter(item => item.category === selectedCategory)
       
    }


    return (
        <>
            <div className="grid-box">
                <div className='navigation'>
                    <div className='navigation-bar'>
                        <div className='add-project'>
                    <button className='button' onClick={showAddProject}>Add Project</button>
                    </div>
                    <div className='category'>
                        <h2>Categories</h2>
                    <p onClick={() => selectCategory('All')}>All</p> 
                    {listOfCategories.map(item => (
                        <p key={item} onClick={() => selectCategory(item)}>{item}</p> 
                    ))}
                    <h2>Content Blocks</h2>
                    {listOfContentBlocks.map(item => (
                        <p key={item} onClick={() => setSelectedContentBlock(item)}>{item}</p> 
                    ))}
                    </div>
                    <div className='add-project'>
                    <button className='button' onClick={Logout}>Logout</button>
                    </div>
                    <div className="add-project">
                        <img width={'80'} src={userInfo.rows.user_image} alt={userInfo.rows.user_name} />
                    </div>
                    </div>
                </div>
                <div className='main-body'>
                    <div onClick={() => setShow(!show)} className={show ? 'overlay blur' : 'overlay'}></div>
                    <div>
                    </div>
                    <div>
                        <EmailList data={filterData('All')} />
                    </div>
                </div>
            </div>
            {show && (
                <div className='center-box'>
                    <form action="">
                        <div className='input-field'>
                            <label htmlFor="Name">Name</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder='Name' />
                        </div>
                        <div className='input-field'>
                            <label htmlFor="category">Category</label>
                            <select name="category" id="category"
                                onChange={e => setCategory(e.target.value)}>
                                <option value="" selected disabled hidden>Choose category here</option>
                                {listOfCategories.map(item => (
                                  <option key={item} value={item}>{item}</option>  
                                ))}
                            </select>
                        </div>
                        <div className='input-field'>
                            <label htmlFor="type">Type</label>
                            <select name="type" id="type"
                                onChange={e => setType(e.target.value)}>
                                <option value="" selected disabled hidden>Choose type here</option>
                                  <option value="Email">Email</option>
                                  <option value="Content Block">Content Block</option> 
                            </select>
                        </div>
                        {type === 'Content Block' && (
                            <div className='input-field'>
                            <label htmlFor="Content Block">Library</label>
                            <select name="Content Block" id="Content Block"
                                onChange={e => setContentBlock(e.target.value)}>
                                <option value="" selected disabled hidden>Choose category of Content Block</option>
                                {listOfContentBlocks.map(item => (
                                  <option key={item} value={item}>{item}</option>  
                                ))}
                            </select>
                        </div>
                        )}
                        <div className='input-field'>
                            <label htmlFor="html_code">Code</label>
                            <textarea value={htmlCode} onChange={(e) => setHtmlCode(e.target.value)} type="text" placeholder='Code' />
                        </div>
                        <div className='button-loading'>
                            <button onClick={handleSubmit} className='button flex' type='submit' ><span>Submit</span></button>
                            {loading && <Lottie animationData={loadingFile} style={{ width: '70px', display: 'inline-block' }} loop={true} />}
                        </div>
                    </form>

                </div>
            )}
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

export default Home