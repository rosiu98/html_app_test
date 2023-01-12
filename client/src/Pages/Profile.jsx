import React, { useEffect } from 'react'
import Navigation from '../Components/Navigation';
import useEmailsDataStore from '../stores/emailsData';

const Profile = () => {

    const userInfo = useEmailsDataStore((state) => state.userInfo)
    const getEmails = useEmailsDataStore((state) => state.getEmails);
    const userEmails = useEmailsDataStore((state) => state.userEmails); 


    useEffect(() => {
        getEmails(userInfo.rows.id)
    }, [])


    console.log(userEmails)

    const formatter = new Intl.DateTimeFormat( 'pl', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      } );
    


  return (
    <>
    <Navigation />
    <div style={{display: 'flex' , gap: '3rem' , flexWrap: 'wrap' , justifyContent: 'center'}}>
    {userEmails.length > 0 ?  userEmails?.map(userEmails => (
        <div style={{cursor: 'pointer', maxWidth: '300px'}} key={userEmails.id} >
        <p>{userEmails.id}</p>
        <p>{userEmails.name}</p>
        <p>{userEmails.category}</p>
        <p>{formatter.format(Date.parse(userEmails.created_at))}</p>
        <p>{userEmails.type}</p>
        <img src={userEmails.image} alt={userEmails.name} style={{width: '100%', objectFit: 'contain' } } />
        </div>
    )) : <div>Nothing here!</div>}
</div>
</>
  )
}

export default Profile