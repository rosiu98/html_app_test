import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Navigation from '../Components/Navigation';
import useEmailsDataStore from '../stores/emailsData';

const Profile = () => {

    const userInfo = useEmailsDataStore((state) => state.userInfo)
    const getEmails = useEmailsDataStore((state) => state.getEmails);
    const userEmails = useEmailsDataStore((state) => state.userEmails);
    const deleteUserInfo = useEmailsDataStore((state) => state.deleteUserInfo)


    useEffect(() => {
        getEmails(userInfo.rows.id)
    }, [])

    useEffect(() => {
        
      window.scrollTo(0, 0)
 }, [])


    // console.log(userEmails)

    // console.log(userInfo)

    const formatter = new Intl.DateTimeFormat( 'pl', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      } );


      let navigate = useNavigate()

      const handleProjectSelect = (id) => {
          navigate(`/emails/${id}`)
        }

        const Logout = () => {
          deleteUserInfo()
      }
    


  return (
    <>
    <Navigation />

      <div className="profile-container">
        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-image">
              <img src="https://emailpaul-app.s3.eu-central-1.amazonaws.com/profilImages/ProfilePicture40.png" alt="Logo" />
            </div>
            <div className="profile-info">
              <div className='profile-name'>{userInfo.rows.user_name}</div>
              <div className='profile-count'>
                <div>
                  Email created <strong>: {userEmails.countEmails || 0}</strong>
                </div>
                <div>
                  Code Snippets added <strong>: {userEmails.countCodeSnippets || 0}</strong>
                </div>
              </div>
            </div>
            <div className='profile-logout'>
                <div onClick={Logout} className="add-project-button">
                    Logout
                </div>
            </div>
          </div>
        </div>
      </div>
      <div className="library-container">
        <div className="library-title">
          Your Library
        </div>

        <div className="library-content">
        {userEmails.rows?.length > 0 ?  userEmails.rows?.map(userEmails => (
          <div key={userEmails.id} className="library-project">
            <p>{userEmails.name}</p>
            <p>{userEmails.category}</p>
            <p>{formatter.format(Date.parse(userEmails.created_at))}</p>
            <p>{userEmails.type}</p>
            <div className="library-project-image">
              <img onClick={() => handleProjectSelect(userEmails.id)} src={userEmails.image || "https://i.imgur.com/smZLfPS.png" } alt={userEmails.name} />
            </div>
          </div>
          )) : <div>Nothing here!</div>}
        </div>
      </div>
</>
  )
}

export default Profile