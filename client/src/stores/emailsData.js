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
            categories: [],
            query: "",
            category: null,
            pageNumber : 1,
            type: null,
            contentBlock: null,
            path: '',
            setPath: (data) => {
                set({path: data})
            },
            clear : () => {
                set({category: null, pageNumber: 1, contentBlock:null, type: null, query: ""})
            },
            setCategories : (data) => {
                set({categories: data})
            },
            setQuery: (data) => {

                const state = get()

                set({query: data})
                
                if(state.query && (state.path === '/emails')) {
                    set({category: null, pageNumber: 1, contentBlock:null, type: 'Email'})
                }
                else if(state.query && (state.path === '/contentblocks')){
                    set({category: null, pageNumber: 1, contentBlock:null, type: 'Content Block'})    
                } else if (state.query) {
                    set({category: null, pageNumber: 1, contentBlock:null, type: null})
                }
            },
            setPageNumber: (data) => {
                set({pageNumber : data})
            },
            selectCategory: (data) => {

                const state = get()

                set({category: data})
                state.path !== '/contentblocks' && set({type: null})
                set({pageNumber: 1})
            },
            selectCategoryEmails: (data) => {
                set({category: data})
                set({pageNumber: 1})
            },
            selectContentBlock: (data) => {
                set({contentBlock: data})
                set({pageNumber: 1})
            },
            selectType: (data) => {
                set({type: data})
                set({category: null})
                set({pageNumber: 1})
            },
            updateValidToken : (data) => {
                set({validToken: data})
            },
            createUserInfo: async (data) => {

                try {
                    const config = {
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                      };
                    
                    const response = await AuthApi.post("/register", data, config)
    
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
            // fetchEmails: async () => {
            //     const response = await ProjectFinder.get("/")
            //     set({emails: response.data.rows})
            // },
            setEmails: (data) => {

                set({emails: data })
            },
            getEmails: async (id) => {

                const response = await AuthApi.get(`/profile/${id}`)
                set({userEmails: response.data.rows})

            },
            addEmail: async (data) => {

                set({success: false})

                try {    
                    // Create Email
                    const feedback = await ProjectFinder.post("/", data)
                    set({loading: true})
                    const loaderToast = toast.loading("Adding Email...")
                    // Get current emailsData
                    const state = get()
                    const id = feedback.data.rows[0].id;
                    
                    // Create Screenshot
                    const createPage = await ProjectFinder.get(`/screenshot/${id}`)
                    
                    // Send email
                    await ProjectFinder.post("/sendEmail", {
                    image: createPage.data.image })
    
                    set({emails: [createPage.data.rows[0], ...state.emails], pageNumber: 1, query: '' })
                    set({loading: false})
                    toast.update(loaderToast, {render: `${data.name} have been created!`,
                        type: 'success',
                        isLoading: false,
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        draggable: true,
                        progress: undefined,
                });
                    
                } catch (error) {
                    toast.error(error.response.data, {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            }
        }
    )
)

export default useEmailsDataStore
