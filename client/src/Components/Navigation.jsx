import React, {useRef, useEffect} from 'react'
import { NavLink , Link } from 'react-router-dom';
import useEmailsDataStore from '../stores/emailsData';

const Navigation = ({library, data}) => {

    const {show ,setShow} = data

    const categories = useEmailsDataStore((state) => state.categories)
    const selectCategory = useEmailsDataStore((state) => state.selectCategory)
    const selectType = useEmailsDataStore((state) => state.selectType)
    const category = useEmailsDataStore((state) => state.category)
    const type = useEmailsDataStore((state) => state.type)
    const query = useEmailsDataStore((state) => state.query)
    const setQuery = useEmailsDataStore((state) => state.setQuery)
    const categoriesRef = useRef(null)

        const checkRef = () => {
        if(library.current) {
        const observer = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                // console.log(entry);
                if(!entry.isIntersecting) {
                    categoriesRef.current.className = 'categories'
                    // console.log('I cannot see it')
                } else {
                    // console.log('I can see it')
                    categoriesRef.current.className = 'categories hide'
                }
            })
        })

        observer.observe(library.current)
    }}

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

  return (
    <nav className='navigation-main'>
    <div className='navigation-container'>
        <div className="profile">
        <Link to='/profile'>
            <img className='profile-image' src="https://i.imgur.com/qS9heKH.png" alt="" />
        </Link>
        </div>
        <div className="search-bar">
            <div className="search-icon">
                <img className='search-image' src="https://i.imgur.com/3zt2moA.png" alt="" />
            </div>
            <div className="search-area">
                <input value={query} placeholder='Search by keyword or name' onChange={handleSearch} className="search-input" />
            </div>
        </div>
        <div className="navigation-desktop">
            <div className="links">
                <NavLink to='/test'>All</NavLink>
                <NavLink to='/login'>Emails</NavLink>
                <NavLink to='/login'>Code&nbsp;Snippets</NavLink>
            </div>
            <div className="nav-button">
                <div onClick={showAddProject} className="add-project-button">
                    Add&nbsp;Project
                </div>
            </div>
        </div>
    </div>
    {library && <div className="categories-container">
        <div ref={categoriesRef} className="categories hide">
            <div className="library-title">
                Category :
            </div>
            {categories.map(data => (
                      <div key={data.category} className="library-category">
                      {data.category === 'All' ? (
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