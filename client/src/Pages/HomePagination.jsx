import React , {useEffect, useState} from 'react'
import useEmailsSearch from '../Components/useEmailsSearch'
import EmailList from '../Components/EmailList'
import useEmailsDataStore from '../stores/emailsData'
import { ToastContainer, toast } from 'react-toastify'
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import loadingFile from '../apis/loading.json'
import Lottie from 'lottie-react';

const HomePagination = () => {

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
    const selectContentBlock = useEmailsDataStore((state) => state.selectContentBlock)
    const query = useEmailsDataStore((state) => state.query)
    const setQuery = useEmailsDataStore((state) => state.setQuery)


    useEffect(() => {
        
         window.scrollTo(0, 0)
    }, [categoryChange])
    

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
                    <p onClick={() => selectCategory(null)}>All</p> 
                    {listOfCategories.map(item => (
                        <p key={item} onClick={() => selectCategory(item)}>{item}</p> 
                    ))}
                    <h2>Content Blocks</h2>
                    {listOfContentBlocks.map(item => (
                        <p key={item} onClick={() => selectContentBlock(item)}>{item}</p> 
                    ))}
                    </div>
                    <div className='add-project'>
                    <button className='button' onClick={Logout}>Logout</button>
                    </div>
                    <div className="add-project">
                        <Link to='/profile'>
                        <img width={'80'} src={userInfo.rows.user_image} alt={userInfo.rows.user_name} />
                        </Link>
                    </div>
                    <div className="add-project">
                        <input value={query} type="text" onChange={handleSearch}  />
                    </div>
                    </div>
                </div>
                <div className='main-body'>
                    <div onClick={() => setShow(!show)} className={show ? 'overlay blur' : 'overlay'}></div>
                    <div>
                    </div>
                    <div>
                        <EmailList data={{emails, hasMore, loading, error, pageNumber ,setPageNumber}} />
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
                                <option value="" defaultValue={'Choose category here'} disabled hidden>Choose category here</option>
                                {listOfCategories.map(item => (
                                  <option key={item} value={item}>{item}</option>  
                                ))}
                            </select>
                        </div>
                        <div className='input-field'>
                            <label htmlFor="type">Type</label>
                            <select name="type" id="type"
                                onChange={e => setType(e.target.value)}>
                                <option value="" defaultValue={'Choose type here'} disabled hidden>Choose type here</option>
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
                            {loader && <Lottie animationData={loadingFile} style={{ width: '70px', display: 'inline-block' }} loop={true} />}
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

export default HomePagination