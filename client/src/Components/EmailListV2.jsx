import React, {useRef, useCallback} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import formatter from '../apis/formatter'
import useEmailsDataStore from '../stores/emailsData'

const EmailListV2 = ({data}) => {

  const {emails, hasMore, loading, error, pageNumber, setPageNumber, library} = data
  let categories = useEmailsDataStore((state) => state.categories)
  const category = useEmailsDataStore((state) => state.category)
  const type = useEmailsDataStore((state) => state.type)
  const loader = useEmailsDataStore((state) => state.loading)
  const selectCategory = useEmailsDataStore((state) => state.selectCategory)
  const location = useLocation()
  const selectType = useEmailsDataStore((state) => state.selectType)
  const selectCategoryEmails = useEmailsDataStore((state) => state.selectCategoryEmails)
  const observer = useRef()
  const lastEmailElementRef = useCallback(node => {
      if (loading) return
      if(observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting && hasMore) {
            setPageNumber( pageNumber + 1)
          }
      })
      if(node) observer.current.observe(node)
  }, [loading, hasMore])

  let navigate = useNavigate()

  const handleProjectSelect = (id) => {
      navigate(`/emails/${id}`)
    }


    const selectAll = () => {
      selectCategory(null)
      selectType(null)
    }


    return ( 
      <section className="content">
      <div className="content-container">
          <div className="cards-container">
              {/* Render Library */}
              <div ref={library} className="library">
                  <div className="library-title">
                      Category
                  </div>



                  {categories.map(data => (
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
              {/* Render Email cards */}
              {loader && <div className="card">
                  <img src="https://i.imgur.com/smZLfPS.png" alt="image"/>
                </div>}
              {emails.map((data, index) => {
              if(emails.length === index + 1) { 
                return <div ref={lastEmailElementRef} key={data.id} className="card" onClick={() => handleProjectSelect(data.id)}>
                  <img src={data.image} alt={data.name} />
                </div>
                
              } else {
                return (
                <div className="card" key={data.id} onClick={() => handleProjectSelect(data.id)}>
                  <img src={data.image} alt={data.name}/>
                </div>
                )
              }
              })}
              {loading && <div>Loading...</div>}
              {error && <div>Error</div>}
          </div>
      </div>
  </section>
    )


      }  

export default EmailListV2