import React, {useState, useEffect} from 'react'
import { listOfCategories, listOfContentBlocks } from '../apis/lists';
import useEmailsDataStore from '../stores/emailsData';
import { toast } from 'react-toastify'
import loadingFile from '../apis/loading.json'
import Lottie from 'lottie-react';

const AddProjectPopup = ({data}) => {

    const {show ,setShow} = data

    const [name, setName] = useState("");
    const [category, setCategory] = useState("Cibc");
    const [type, setType] = useState("Email")
    const [contentblock , setContentBlock] = useState("")
    const [htmlCode, setHtmlCode] = useState("");
    
    const addEmail = useEmailsDataStore((state) => state.addEmail)
    const userInfo = useEmailsDataStore((state) => state.userInfo)
    const loader = useEmailsDataStore((state) => state.loading)
    const selectCategory = useEmailsDataStore((state) => state.selectCategory)
    const selectType = useEmailsDataStore((state) => state.selectType)

    console.log(type)
    console.log(category)

    
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            addEmail({
                name,
                html_code: htmlCode,
                category,
                type,
                contentblock,
                user_id: 3 || userInfo?.rows.id
                
            })
            selectCategory(null)
            selectType(null)


            setShow(!show)
        } catch (err) {
            console.log(err)
        }

    }

    useEffect(() => {
      if(show === false) {
        setName("")
        setHtmlCode("")
        setCategory("Cibc")
        setType("Email")
        setContentBlock("")
      }
    }, [show])
    

    return (
        <>
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
        </>
    )
    
  
}

export default AddProjectPopup