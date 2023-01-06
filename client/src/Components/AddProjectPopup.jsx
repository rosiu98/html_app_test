import React, {useState, useEffect} from 'react'
import { listOfCategories, listOfContentBlocks, listOfTypes } from '../apis/lists';
import useEmailsDataStore from '../stores/emailsData';
import loadingFile from '../apis/loading.json'
import Lottie from 'lottie-react';
import Select from 'react-select';
import { toast } from 'react-toastify';

const AddProjectPopup = ({data}) => {

    const {show ,setShow} = data

    const [name, setName] = useState("");
    const [category, setCategory] = useState(null);
    const [type, setType] = useState(null)
    const [contentblock , setContentBlock] = useState("")
    const [htmlCode, setHtmlCode] = useState("");
    
    const addEmail = useEmailsDataStore((state) => state.addEmail)
    const userInfo = useEmailsDataStore((state) => state.userInfo)
    const loader = useEmailsDataStore((state) => state.loading)
    const selectCategory = useEmailsDataStore((state) => state.selectCategory)
    const selectCategoryEmails = useEmailsDataStore((state) => state.selectCategoryEmails)
    const selectType = useEmailsDataStore((state) => state.selectType)
    const path = useEmailsDataStore((state) => state.path)
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            addEmail({
                name,
                html_code: htmlCode,
                category: category?.value,
                type: type?.value,
                contentblock,
                user_id: 3 || userInfo?.rows.id
                
            })
        } catch (err) {
            console.log(err)
        }

    }

    useEffect(() => {
      if(show === false) {
        setName("")
        setHtmlCode("")
        setCategory(null)
        // setType(null)
        setContentBlock("")
      }
      if(loader) {
        if(path === '/emails') {
            selectCategoryEmails(null)
        } else {
            selectCategory(null)
        }
        // path === '/emails' ? selectCategoryEmails(null) : selectCategory(null)
        // selectCategory(null)
        // (path === '/emails') && selectType(null)
        // selectType(null)
        setShow(false)
      }
    }, [show, loader, path])
    
      const handleCategoryChange = e => {
        setCategory(e);
      }

      const handleTypeChange = e => {
        setType(e);
      }

      const handleContentBlockChange = e => {
        setContentBlock(e)
      }



      const colourStyles = {
        control: (styles) => ({ ...styles, backgroundColor: '#E0E1EA', padding: '8px' }),
        placeholder: (styles) => ({ ...styles, color: 'black', fontSize: '1.4rem', fontWeight: '500' }),
        option: (styles) => ({ ...styles, padding: '15px'}),
        dropdownIndicator: base => ({
            ...base,
            color: "black",
            '&:hover': {
                color: 'black'
            },
          }),
          indicatorSeparator: base => ({
            ...base,
            display: 'none',
          }),
        
      };    

    return (
        <>
        {show && (
            <div className='center-box'>
                <div className="close-btn">
                    <img onClick={() => setShow(!show)} src="https://i.imgur.com/7k6eDkB.png" width={'24'} alt="Close button" />
                </div>
                    <form action="" autoComplete='nope'>
                        <div className='input-field'>
                            <label htmlFor="Name">Name</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder='Name' />
                        </div>
                        <div className='input-field'>
                            <label htmlFor="category">Category</label>
                            <Select
                                placeholder="Select Category"
                                value={category}
                                options={listOfCategories}
                                inputProps={{ autoComplete: 'off', autoCorrect: 'off', spellCheck: 'off' }}
                                onChange={handleCategoryChange}
                                styles={colourStyles}
                                getOptionLabel={e => (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {e.icon}
                                    <span style={{ marginLeft: 5 , fontSize: '1.4rem' , color: 'black', fontWeight: '500'}}>{e.text}</span>
                                </div>
                                )}
                            />
                        </div>
                        <div className='input-field'>
                            <label htmlFor="type">Type</label>
                            <Select
                                placeholder="Select Type"
                                value={type}
                                options={listOfTypes}
                                onChange={handleTypeChange}
                                styles={colourStyles}
                                getOptionLabel={e => (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {e.icon}
                                    <span style={{ marginLeft: 5 , fontSize: '1.4rem' , color: 'black', fontWeight: '500'}}>{e.text}</span>
                                </div>
                                )}
                            />
                        </div>
                        {type?.value === 'Content Block' && (
                        <div className='input-field'>
                            <label htmlFor="Content Block">Library</label>
                                <Select
                                placeholder="Select Type"
                                value={contentblock}
                                options={listOfContentBlocks}
                                onChange={handleContentBlockChange}
                                styles={colourStyles}
                                getOptionLabel={e => (
                                    <span style={{ marginLeft: 5 , fontSize: '1.4rem' , color: 'black', fontWeight: '500'}}>{e.text}</span>
                                )}
                                />
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