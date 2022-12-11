import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import Lottie from 'lottie-react';
import loadingFile from '../apis/loading.json'
import ProjectFinder from '../apis/ProjectFinder';
import EmailList from '../Components/EmailList';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("")
    const [contentblock , setContentBlock] = useState("")
    const [htmlCode, setHtmlCode] = useState("");
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [selectedContentBlock, setSelectedContentBlock] = useState('')
    const listOfCategories = ['Cibc', 'MountainDew', 'TastyRewards', 'Gatorade']
    const listOfContentBlocks = ['PreHeader', 'Logo', 'TwoColumnHeader', 'Body', 'OneCta', 'Rating', 'Legal']

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ProjectFinder.get("/")
                setData(response.data.rows)
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
        
    }, [setData])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const feedback = await ProjectFinder.post("/", {
                name,
                html_code: htmlCode,
                category,
                type: type,
                contentblock
                
            })
            const id = feedback.data.rows[0].id;

            const createPage = await ProjectFinder.get(`/screenshot/${id}`)
            console.log(createPage.data)

            const tokenData = await ProjectFinder.post("/sendEmail", {
            image: createPage.data.image
        })
                console.log(tokenData)

            setData([ createPage.data.rows[0] , ...data])
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
            setLoading(false)
            setShow(!show)
        } catch (err) {
            console.log(err)
        }
    }

    const showAddProject = async (e) => {
        e.preventDefault()
        // const tokenData = await ProjectFinder.post("/sendEmail", {
        //     image: data[0].image
        // })
        //         console.log(tokenData)
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
                        <h2>Categories Test</h2>
                    <p onClick={() => selectCategory('All')}>All</p> 
                    {listOfCategories.map(item => (
                        <p key={item} onClick={() => selectCategory(item)}>{item}</p> 
                    ))}
                    <h2>Content Blocks</h2>
                    {listOfContentBlocks.map(item => (
                        <p key={item} onClick={() => setSelectedContentBlock(item)}>{item}</p> 
                    ))}
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