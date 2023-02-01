import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProjectFinder from '../apis/ProjectFinder'
import IframeResizer from 'iframe-resizer-react'
import template from '../apis/template'
import { CodeBlock, dracula } from "react-code-blocks";
import Navigation from '../Components/Navigation'
import { listOfView } from '../apis/lists'
import Select from 'react-select';
import Lottie from "lottie-react"
import loaderAnimation from '../apis/skeleton-loader.json'
import { toast } from 'react-toastify';

const EmailPage = () => {


    const { id } = useParams()

    const [data, setData] = useState({})
    const [width, setWidth] = useState(700)
    const [value, setValue] = useState(true)
    const [loading, setLoading] = useState(true)
    const [select , setSelect] = useState({
        value: null,
        text: 'Desktop',
        icon: <img src="https://i.imgur.com/c4jDmGP.png" width='16' alt="Desktop"
         />
    })

    const onResized = data =>  data && setLoading(false)


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ProjectFinder.get(`/${id}`)
                setData(response.data.rows)
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        
        window.scrollTo(0, 0)
   }, [value, select])

    const showValue = () => {
        setValue(!value)
    }
 
    const changeWidth = () => {
        width === 700 ? setWidth(400) : setWidth(700);
    }

    const changeView = (e) => {

        if(e.value === select.value) {
            return
        }

        setLoading(true)
        setSelect(e)

        if(e.value === 'Desktop'){
            setWidth(700)
        } else {
            setWidth(400)
        }
    }

    const copyHtml = () => {
        navigator.clipboard.writeText(data.html_code)
        toast.success('Code have been copied to clipboard.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });

    }

    let html

    if(Object.keys(data).length > 0) {
        if (data?.type === "Content Block") {
            html = template.replace("%%Content_Block%%", data.html_code )
            html = html.replace("<head>", '<head> <script src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.6.0/iframeResizer.contentWindow.min.js"></script>')
        } else {
            html = data.html_code.replace("<head>", '<head> <script src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.6.0/iframeResizer.contentWindow.min.js"></script>')
        } 
    }

    const colourStyles = {
        control: (styles) => ({ ...styles, backgroundColor: '#F2F3F2', padding: '5px', border: '1px solid black' }),
        placeholder: (styles) => ({ ...styles, color: 'black', fontSize: '1.4rem', fontWeight: '500' }),
        container: (styles) => ({ ...styles, gridRowStart: '1', gridColumnStart: '1', placeSelf: 'baseline', marginBottom: '25px' }),
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

      console.log(loading)

    return (
        <>
        <Navigation/>
        <div className="pagehref">
            <div className="pagehref-text">
                {data.type === 'Content Block' ? data.category + ' / Code Snippets' : 'Emails'} / <span>{data.name}</span>
            </div>
        </div>
        <div className="emailPage-container">
            <div className="emailPage-main">
                <div className="emailPage-main-box">
                    {value ? <>
                        {loading && <div className='emailPage-loading'><Lottie rendererSettings={'preserveAspectRatio'} animationData={loaderAnimation} loop={true}  /></div>}
                       <IframeResizer
                            key={width}
                            sizeHeight={true}
                            sizeWidth={true}
                            checkOrigin={false}
                            heightCalculationMethod={width === 700 ? 'lowestElement' : 'lowestElement'}
                            style={{ width, visibility: loading ? 'hidden' : 'unset'}}
                            onResized={onResized}
                            frameBorder='0'
                            autoResize={true}
                            srcDoc={html} />
                        <div className="emailPage-main-view">
                            <Select
                                placeholder="Select Category"
                                value={select}
                                options={listOfView}
                                inputProps={{ autoComplete: 'off', autoCorrect: 'off', spellCheck: 'off' }}
                                onChange={changeView}
                                styles={colourStyles}
                                getOptionLabel={e => (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {e.icon}
                                    <span style={{ marginLeft: 5 , fontSize: '1.4rem' , color: 'black', fontWeight: '500'}}>{e.text}</span>
                                </div>
                              )}
                            />  
                        </div>    
                    </> : <CodeBlock
                            text={data.html_code}
                            language={"html"}
                            showLineNumbers={false}
                            codeBlock={true}
                            //   startingLineNumber={1}
                            theme={dracula}
                            customStyle={{
                                width: '700px',
                                height: '75vh',
                                overflow: 'scroll',
                                fontSize: '12px',
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                                overflowWrap: 'anywhere'
                            }}
                            /> 
                    }
                </div>
            </div>
            <div className="emailPage-sidemenu">
                <div className="emailPage-buttons">
                    <button onClick={copyHtml} className='button'>Copy</button>
                    <button className='button buttonView' onClick={showValue}>{value ? 'View Code' : 'View Design' }</button>           
                </div>          
            </div>
        </div>

        
        </>
    )
}

export default EmailPage