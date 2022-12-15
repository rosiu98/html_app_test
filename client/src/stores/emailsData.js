import create from 'zustand'
import {persist} from 'zustand/middleware'
import ProjectFinder from '../apis/ProjectFinder'

const useEmailsDataStore = create(
    persist(
        (set, get) => ({
            emails: [],
            loading: false,
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
        })
    )
)

export default useEmailsDataStore
