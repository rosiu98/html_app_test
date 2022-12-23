import create from 'zustand'
import AuthApi from '../apis/AuthApi';
import ProjectFinder from '../apis/ProjectFinder'

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : false;


const useEmailsDataStore = create(
        (set, get) => ({
            emails: [],
            userInfo: userInfoFromStorage,
            validToken: false,
            loading: false,
            updateValidToken : (data) => {
                set({validToken: data})
            },
            createUserInfo: async (data) => {

                const config = {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  };
                
                const response = await AuthApi.post("/register", data, config)

                localStorage.setItem("userInfo", JSON.stringify(response.data));
                set({userInfo: response.data})

            },
            deleteUserInfo: () => {
                localStorage.setItem('userInfo', null)
                set({userInfo: null})
            },
            addUserInfo: async (data) => {
                
                const response = await AuthApi.post("/login", data)

                localStorage.setItem("userInfo", JSON.stringify(response.data));
                set({userInfo: response.data})

            },
            fetchEmails: async () => {
                const response = await ProjectFinder.get("/")
                set({emails: response.data.rows})
            },
            addEmail: async (data) => {
                set({loading: true})
                // Get current emailsData
                const state = get()

                // Create Email
                const feedback = await ProjectFinder.post("/", data)
                const id = feedback.data.rows[0].id;
                
                // Create Screenshot
                const createPage = await ProjectFinder.get(`/screenshot/${id}`)
                
                // Send email
                await ProjectFinder.post("/sendEmail", {
                image: createPage.data.image })

                set({emails: [createPage.data.rows[0], ...state.emails] })
                set({loading: false})
            }
        }
    )
)

export default useEmailsDataStore
