import {useEffect, useState} from 'react'
import axios from 'axios'
import useEmailsDataStore from '../stores/emailsData'
import { useLocation } from 'react-router-dom';

const useEmailsSearch = (query, pageNumber) => {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    // const [emails, setEmails] = useState([])

    const emails = useEmailsDataStore((state) => state.emails)
    const setEmails = useEmailsDataStore((state) => state.setEmails)
    const [hasMore, setHasMore] = useState(false)
    const category = useEmailsDataStore((state) => state.category)
    const contentBlock = useEmailsDataStore((state) => state.contentBlock)
    const type = useEmailsDataStore((state) => state.type)
    const setCategories = useEmailsDataStore((state) => state.setCategories)
    const loader = useEmailsDataStore((state) => state.loading)
    const selectType = useEmailsDataStore((state) => state.selectType)
    const setPath = useEmailsDataStore((state) => state.setPath)

    const location = useLocation()




    
    useEffect(() => {
        setLoading(true)
        setError(false)
        let cancel
        axios({
            method: 'GET',
            url: process.env.NODE_ENV === 'production' ? 
            "/api/v1/projects" :  
            "http://localhost:3001/api/v1/projects",
            params: { query, page: pageNumber, limit: 20, category, contentBlock, type },   
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            // console.log(res.data)

            // console.log(location.pathname)
            
            setCategories(location.pathname === '/emails' ? res.data.countType : location.pathname === '/contentblocks' ? res.data.countContentBlocks : res.data.count)
            setEmails(pageNumber === 1 ? res.data.rows : [...new Set ([...emails, ...res.data.rows])]
            )
            setHasMore(res.data.hasMore)
            setLoading(false)
        }).catch(err => {
            if (axios.isCancel(err)) return
            setError(true)
            console.log(err)
        })
        return () => cancel()
    },[query, pageNumber, category, contentBlock, type, loader, location])


    useEffect(() => {
      
    if(location.pathname === '/emails') {
        setPath(location.pathname)
        selectType('Email')
        console.log('loading second useEffect')
    } else if(location.pathname === '/contentblocks') {
        setPath(location.pathname)
        selectType('Content Block')
        console.log('loading contentblocks useEffect')
    }
     else {
        setPath('')
    }
    }, [location])
    


  return {loading, error, emails, hasMore}
}

export default useEmailsSearch