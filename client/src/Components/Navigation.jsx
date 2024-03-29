import React, {useRef, useEffect} from 'react'
import { NavLink , Link, useLocation, useNavigate } from 'react-router-dom';
import useEmailsDataStore from '../stores/emailsData';

const Navigation = ({library}) => {

    const location = useLocation()
    const categories = useEmailsDataStore((state) => state.categories)
    const selectCategory = useEmailsDataStore((state) => state.selectCategory)
    const selectType = useEmailsDataStore((state) => state.selectType)
    const category = useEmailsDataStore((state) => state.category)
    const type = useEmailsDataStore((state) => state.type)
    const query = useEmailsDataStore((state) => state.query)
    const setQuery = useEmailsDataStore((state) => state.setQuery)
    const selectCategoryEmails = useEmailsDataStore((state) => state.selectCategoryEmails)
    const categoriesRef = useRef(null)
    const clear = useEmailsDataStore((state) => state.clear)
    const userInfo = useEmailsDataStore((state) => state.userInfo)
    const show = useEmailsDataStore((state) => state.show)
    const setShow = useEmailsDataStore((state) => state.setShow)

        const checkRef = () => {
        if(library.current) {
        const observer = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                // console.log(entry);
                if(!entry.isIntersecting) {
                    categoriesRef.current && (categoriesRef.current.className = 'categories')
                    // console.log('I cannot see it')
                } else {
                    // console.log('I can see it')
                    categoriesRef.current && ( categoriesRef.current.className = 'categories hide')
                }
            })
        })

        observer.observe(library.current)
    }}

    const navigate = useNavigate()

    const handleSearch = (e) => {
        setQuery(e.target.value.trim())
    }

    const showAddProject = (e) => {
        e.preventDefault()
        setShow(!show)
    }

    const selectAll = () => {
        selectCategory(null)
        selectType(null)
      }

    useEffect(() => {
        if(library) checkRef()
    },[])

    const goBack = () => {
		navigate(-1);
	}

  return (
    <nav className='navigation-main'>
    <div className='navigation-container'>
        

        <div className="profile">
        {(location.pathname === '/profile' || location.pathname.split('/').includes('email')) ? (
            <a className='goBack' onClick={goBack}>
            <img className='profile-image-arrow' src="https://i.imgur.com/GsvJocL.png" alt="Arrow back" />
        </a>
        ) : <Link to='/profile'>
        <img className='profile-image' src={userInfo?.rows.user_image || ''} alt={userInfo?.rows.user_name || ''} />
    </Link>}    
        </div>
        <div className={(location.pathname === '/profile' || location.pathname.split('/').includes('email')) ? 'search-bar vision-hidden' : 'search-bar '}>
            <div className="search-icon">
                <img className='search-image' src="https://i.imgur.com/3zt2moA.png" alt="" />
            </div>
            <div className="search-area">
                <input value={query} placeholder='Search by keyword or name' onChange={handleSearch} className="search-input" />
            </div>
        </div>
        <div className="navigation-desktop">
            <div className="links">
                <NavLink onClick={() => clear()} to='/'>All</NavLink>
                <NavLink onClick={() => clear()} to='/emails'>Emails</NavLink>
                <NavLink onClick={() => clear()} to='/contentblocks'>Code&nbsp;Snippets</NavLink>
            </div>
            <div className="nav-button">
                <div onClick={showAddProject} className="add-project-button mbl-hide">
                    Add&nbsp;Project
                </div>
            </div>
        </div>
    </div>
    {library && <div className="categories-container">
        <div ref={categoriesRef} className="categories hide">
            <div className="library-title">
                Category&nbsp;:
            </div>
            {categories?.map(data => (
                      <div key={data.category} className="library-category">
                      {
                      (data.category === 'All') && (location.pathname === '/emails') ? 
                      <div onClick={() => selectCategoryEmails(null)} className={((category === null) && (type === 'Email')) ? 'category-name active' : 'category-name'}>
                              All
                          </div>
                      :
                      (location.pathname === '/emails') ? 
                      <div onClick={() => selectCategoryEmails(data.category)} className={data.category === category ? 'category-name active' : 'category-name'}>
                      {data.category}
                    </div> 
                      :
                      data.category === 'All' ? (
                          <div onClick={selectAll} className={((category === null) && (type === null)) ? 'category-name active' : 'category-name'}>
                              {data.category}
                          </div>
                      ) : (data.category === 'Email') || (data.category === 'Content Block') ? 
                      <div onClick={() => selectType(data.category)} className={data.category === type ? 'category-name active' : 'category-name'}>
                              {data.category}
                          </div>
                      : <div onClick={() => selectCategory(data.category)} className={data.category === category ? 'category-name active' : 'category-name'}>
                              {data.category}
                          </div> }                        
                      <div className="category-count">
                          {data.count}
                      </div>
                  </div>
                  ))}                    


                  
        </div>
    </div>
    }
</nav>
  )
}

export default Navigation