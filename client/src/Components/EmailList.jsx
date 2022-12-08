import React from 'react'
import { useNavigate } from 'react-router-dom'

const EmailList = ({data}) => {

  let navigate = useNavigate()
  const formatter = new Intl.DateTimeFormat( 'pl', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  } );

  const handleProjectSelect = (id) => {
    navigate(`/emails/${id}`)
  }
  
  return (
    <div style={{display: 'flex' , gap: '3rem' , flexWrap: 'wrap' , justifyContent: 'center'}}>
        {data?.map(data => (
            <div style={{cursor: 'pointer', maxWidth: '300px'}} key={data.id} onClick={() => handleProjectSelect(data.id)}>
            <p>{data.id}</p>
            <p>{data.name}</p>
            <p>{data.category}</p>
            <p>{formatter.format(Date.parse(data.created_at))}</p>
            <p>{data.type}</p>
            <img src={data.image} alt={data.name} style={{width: '100%', objectFit: 'contain' } } />
            </div>
        ))}
    </div>
  )
}

export default EmailList