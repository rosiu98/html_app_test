import { toast } from 'react-toastify';
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
            userEmails: [],
            validToken: false,
            loading: false,
            query: "",
            error: '',
            category: null,
            pageNumber : 1,
            contentBlock: null,
            setQuery: (data) => {

                const state = get()

                set({query: data})
                
                if(state.query) {
                    set({category: null, pageNumber: 1, contentBlock:null})

                }
            },
            setPageNumber: (data) => {
                set({pageNumber : data})
            },
            selectCategory: (data) => {
                set({category: data})
                set({pageNumber: 1})
            },
            selectContentBlock: (data) => {
                set({contentBlock: data})
                set({pageNumber: 1})
            },
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
                try {
                    const response = await AuthApi.post("/login", data)

                    localStorage.setItem("userInfo", JSON.stringify(response.data));
                    set({userInfo: response.data})
                } catch (error) {
                    set({error: error.response.data})
                    toast.error(error.response.data, {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            },
            fetchEmails: async () => {
                const response = await ProjectFinder.get("/")
                set({emails: response.data.rows})
            },
            getEmails: async (id) => {

                const response = await AuthApi.get(`/profile/${id}`)
                set({userEmails: response.data.rows})

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
