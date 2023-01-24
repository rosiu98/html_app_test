import React, {useRef, useEffect} from 'react'
import useEmailsSearch from '../Components/useEmailsSearch'
import useEmailsDataStore from '../stores/emailsData'
import { ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import EmailList from '../Components/EmailList'
import Navigation from '../Components/Navigation'

const Homev2 = () => {

    // const [show, setShow] = useState(false);

    const pageNumber = useEmailsDataStore((state) => state.pageNumber)
    const setPageNumber = useEmailsDataStore((state) => state.setPageNumber)
    const categoryChange = useEmailsDataStore((state) => state.category)
    const typeChange = useEmailsDataStore((state) => state.type)
    const query = useEmailsDataStore((state) => state.query)
    
    const {
        emails,
        hasMore,
        loading,
        error
    } = useEmailsSearch(query, pageNumber)


    const library = useRef(null)

    useEffect(() => {
        
        window.scrollTo(0, 0)
   }, [categoryChange, typeChange])

  return (
    <div className='main'>
        <Navigation library={library}/>
        <EmailList data={{emails, hasMore, loading, error, pageNumber ,setPageNumber, library}} />
    </div>
    
  )
}

export default Homev2