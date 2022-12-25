import React, {useRef, useCallback} from 'react'
import { useNavigate } from 'react-router-dom'
import formatter from '../apis/formatter'

const EmailList = ({data}) => {

  const {emails, hasMore, loading, error, pageNumber, setPageNumber} = data
  const observer = useRef()
  const lastEmailElementRef = useCallback(node => {
      if (loading) return
      if(observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting && hasMore) {
            setPageNumber( pageNumber + 1)
          }
      })
      if(node) observer.current.observe(node)
  }, [loading, hasMore])

  let navigate = useNavigate()

  const handleProjectSelect = (id) => {
      navigate(`/emails/${id}`)
    }


  
  return (
    <div style={{display: 'flex' , gap: '3rem' , flexWrap: 'wrap' , justifyContent: 'center'}}>
    {emails.map((data, index) => {
        if(emails.length === index + 1 ) {
            return (
                    <div ref={lastEmailElementRef} style={{cursor: 'pointer', maxWidth: '300px'}} key={data.id} onClick={() => handleProjectSelect(data.id)}>
                    <p>{data.id}</p>
                    <p>{data.name}</p>
                    <p>{data.category}</p>
                    <p>{formatter.format(Date.parse(data.created_at))}</p>
                    <p>{data.type}</p>
                    <img src={data.image} alt={data.name} style={{width: '100%', objectFit: 'contain' } } />
                    </div>
            )
            
        } else {
            return <div style={{cursor: 'pointer', maxWidth: '300px'}} key={data.id} onClick={() => handleProjectSelect(data.id)}>
            <p>{data.id}</p>
            <p>{data.name}</p>
            <p>{data.category}</p>
            <p>{formatter.format(Date.parse(data.created_at))}</p>
            <p>{data.type}</p>
            <img src={data.image} alt={data.name} style={{width: '100%', objectFit: 'contain' } } />
            </div>
        }
})}
    <div>{loading && 'Loading...' }</div>
    <div>{error && 'Error' }</div>
    </div>
  )
}

export default EmailList