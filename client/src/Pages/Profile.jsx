import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navigation from "../Components/Navigation";
import useEmailsDataStore from "../stores/emailsData";

const Profile = () => {
  const userInfo = useEmailsDataStore((state) => state.userInfo);
  const getEmails = useEmailsDataStore((state) => state.getEmails);
  const userEmails = useEmailsDataStore((state) => state.userEmails);
  const deleteUserInfo = useEmailsDataStore((state) => state.deleteUserInfo);
  const emails = useEmailsDataStore((state) => state.emails);

  useEffect(() => {
    getEmails(userInfo.rows.id);
  }, [emails]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatter = new Intl.DateTimeFormat("uk", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  let navigate = useNavigate();

  const handleProjectSelect = (id) => {
    navigate(`/email/${id}`);
  };

  const Logout = () => {
    deleteUserInfo();
  };

  return (
    <>
      <Navigation />

      <div className="profile-container">
        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-image">
              <img
                src={userInfo.rows.user_image}
                alt={userInfo.rows.user_name}
              />
            </div>
            <div className="profile-info">
              <div className="profile-name">{userInfo.rows.user_name}</div>
              <div className="profile-count">
                <div>
                  Emails created{" "}
                  <strong>: {userEmails.countEmails || 0}</strong>
                </div>
                <div>
                  Code Snippets added{" "}
                  <strong>: {userEmails.countCodeSnippets || 0}</strong>
                </div>
              </div>
            </div>
            <div className="profile-logout">
              <div onClick={Logout} className="add-project-button">
                Logout
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="library-container">
        <div className="library-title">Your Library</div>

        <div className="library-content">
          {userEmails.rows?.length > 0 ? (
            userEmails.rows?.map((userEmails) => (
              <div key={userEmails.id} className="library-project">
                <div className="library-project-text">
                  <p>
                    <strong>Name:</strong>{" "}
                    {userEmails.name.length > 21
                      ? userEmails.name.slice(0, 17) + "..."
                      : userEmails.name}
                  </p>

                  <p>
                    <strong>Category:</strong> {userEmails.category}
                  </p>
                  <p>
                    <strong>Created at:</strong>{" "}
                    {formatter.format(Date.parse(userEmails.created_at))}
                  </p>
                  <p>
                    <strong>Type:</strong> {userEmails.type}
                  </p>
                </div>
                <div onClick={() => handleProjectSelect(userEmails.id)}>
                  <div className="library-project-image">
                    <img
                      src={
                        userEmails.image || "https://i.imgur.com/smZLfPS.png"
                      }
                      alt={userEmails.name}
                    />
                  </div>
                  <div className="library-project-icon">
                    <img
                      src="https://i.imgur.com/9joR86R.png"
                      width={40}
                      alt="View details icon"
                      title="View more"
                    />
                    <p>View more</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>Nothing here yet!</div>
          )}
        </div>
      </div>
      <ToastContainer
        theme="colored"
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
  );
};

export default Profile;
