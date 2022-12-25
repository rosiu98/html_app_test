import {useEffect, useState} from 'react'
import axios from 'axios'
import useEmailsDataStore from '../stores/emailsData'

const useEmailsSearch = (query, pageNumber) => {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [emails, setEmails] = useState([])
    const [hasMore, setHasMore] = useState(false)
    const category = useEmailsDataStore((state) => state.category)
    const contentBlock = useEmailsDataStore((state) => state.contentBlock)

    useEffect(() => {
        setLoading(true)
        setError(false)
        let cancel
        axios({
            method: 'GET',
            url: process.env.NODE_ENV === 'production' ? 
            "/api/v1/projects" :  
            "http://localhost:3001/api/v1/projects",
            params: { query, page: pageNumber, limit: 20, category, contentBlock },   
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setEmails(prevEmails => {
                return pageNumber === 1 ? res.data.rows : [...new Set ([...prevEmails, ...res.data.rows])]
            })
            setHasMore(res.data.hasMore)
            setLoading(false)
        }).catch(err => {
            if (axios.isCancel(err)) return
            setError(true)
            console.log(err)
        })
        return () => cancel()
    },[query, pageNumber, category, contentBlock])


  return {loading, error, emails, hasMore}
}

export default useEmailsSearch