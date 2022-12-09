import React, { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import ProjectFinder from '../apis/ProjectFinder'
import IframeResizer from 'iframe-resizer-react'
import template from '../apis/template'
import { CodeBlock, dracula } from "react-code-blocks";

const EmailPage = () => {


    const { id } = useParams()

    const [data, setData] = useState({})
    const [width, setWidth] = useState(700)



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ProjectFinder.get(`/${id}`)
                console.log(response.data.rows)
                setData(response.data.rows)
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
        // eslint-disable-next-line
    }, [])

    const changeWidth = () => {
        width === 700 ? setWidth(400) : setWidth(700);
    }

    const copyHtml = () => {
        navigator.clipboard.writeText(data.html_code)
    }

    let html

        if(data.html_code) {
        if (data?.type === "Content Block") {
            html = template.replace("%%Content_Block%%", data.html_code )
            html = html.replace("<head>", '<head> <script src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.6.0/iframeResizer.contentWindow.min.js"></script>')
        } else {
            html = data.html_code.replace("<head>", '<head> <script src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.6.0/iframeResizer.contentWindow.min.js"></script>')
        } 
    }

    return (
        <div style={{display: 'flex'}}>
        <div className='frame'>
            <IframeResizer
            key={width}
                sizeHeight={true}
                sizeWidth={true}
                checkOrigin={false}
                heightCalculationMethod={width === 700 ? 'lowestElement' : 'lowestElement'}
                style={{ width: width}}

                frameBorder='0'
                autoResize={true}
                srcDoc={html} />
        </div>
        <div>
        <button onClick={changeWidth} className='button'>{width === 700 ? 'Mobile' : 'Desktop'}</button>
        <button onClick={copyHtml} className='button'>Copy</button>
        </div>
        {/* <div className='code' style={{height: '400px'}}>
        {data[0] &&
        <CodeBlock
      text={data[0].html_code}
      language={"html"}
      showLineNumbers={false}
    //   startingLineNumber={1}
      theme={dracula}
      customStyle={{
        height: '400px',
        overflow: 'scroll',
      }}
    />
}

        </div> */}
        </div>
    )
}

export default EmailPage