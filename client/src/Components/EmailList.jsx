import React, { useRef, useCallback, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import formatter from "../apis/formatter";
import { listOfCategories } from "../apis/lists";
import useEmailsDataStore from "../stores/emailsData";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";

const EmailListV2 = ({ data }) => {
  const {
    emails,
    hasMore,
    loading,
    error,
    pageNumber,
    setPageNumber,
    library,
  } = data;
  const categories = useEmailsDataStore((state) => state.categories);
  const [select, setSelect] = useState({
    value: null,
    text: "All",
    icon: <img src="https://i.imgur.com/YpJNuPE.png" width="16" alt="All" />,
  });
  const category = useEmailsDataStore((state) => state.category);
  const contentBlock = useEmailsDataStore((state) => state.contentBlock);
  const type = useEmailsDataStore((state) => state.type);
  const loader = useEmailsDataStore((state) => state.loading);
  const selectCategory = useEmailsDataStore((state) => state.selectCategory);
  const location = useLocation();
  const selectType = useEmailsDataStore((state) => state.selectType);
  const selectCategoryEmails = useEmailsDataStore(
    (state) => state.selectCategoryEmails
  );
  const selectContentBlock = useEmailsDataStore(
    (state) => state.selectContentBlock
  );
  const query = useEmailsDataStore((state) => state.query);
  const observer = useRef();
  const lastEmailElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber(pageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  let navigate = useNavigate();

  const handleProjectSelect = (id) => {
    navigate(`/email/${id}`);
  };

  const selectAll = () => {
    selectCategory(null);
    selectType(null);
  };

  const handleCategoryChange = (e) => {
    selectCategory(e.value);
    selectContentBlock(null);
    setSelect(e);
  };

  const colourStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "#F2F3F2",
      padding: "5px",
    }),
    placeholder: (styles) => ({
      ...styles,
      color: "black",
      fontSize: "1.4rem",
      fontWeight: "500",
    }),
    container: (styles) => ({
      ...styles,
      gridRowStart: "1",
      gridColumnStart: "1",
      placeSelf: "baseline",
      marginBottom: "25px",
    }),
    option: (styles) => ({ ...styles, padding: "15px" }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "black",
      "&:hover": {
        color: "black",
      },
    }),
    indicatorSeparator: (base) => ({
      ...base,
      display: "none",
    }),
  };

  const newObject = [
    {
      value: null,
      text: "All",
      icon: <img src="https://i.imgur.com/YpJNuPE.png" width="16" alt="All" />,
    },
  ];

  const now = Math.random();
  const newListOfCategories = [...newObject, ...listOfCategories];

  const copyHtml = (e, data) => {
    e.stopPropagation();
    navigator.clipboard.writeText(data);
    toast.success("Code have been copied to clipboard.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  useEffect(() => {
    if (location.pathname === "/contentblocks" || query) setSelect(newObject);
  }, [location, query]);

  return (
    <section className="content">
      <div className="content-container">
        <div className="cards-container">
          {/* Render Library */}
          <div ref={library} className="library">
            {location.pathname === "/contentblocks" && (
              <Select
                placeholder="Select Category"
                value={select}
                options={newListOfCategories}
                inputProps={{
                  autoComplete: "off",
                  autoCorrect: "off",
                  spellCheck: "off",
                }}
                onChange={handleCategoryChange}
                styles={colourStyles}
                getOptionLabel={(e) => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {e.icon}
                    <span
                      style={{
                        marginLeft: 5,
                        fontSize: "1.4rem",
                        color: "black",
                        fontWeight: "500",
                      }}
                    >
                      {e.text}
                    </span>
                  </div>
                )}
              />
            )}
            <div>
              <div className="library-title">
                {location.pathname === "/contentblocks"
                  ? "Library :"
                  : "Category"}
              </div>

              {categories?.map((data) => (
                <div key={data.category} className="library-category">
                  {data.category === "All" &&
                  location.pathname === "/contentblocks" ? (
                    <div
                      onClick={() => selectContentBlock(null)}
                      className={
                        contentBlock === null && type === "Content Block"
                          ? "category-name active"
                          : "category-name"
                      }
                    >
                      All
                    </div>
                  ) : location.pathname === "/contentblocks" ? (
                    <div
                      onClick={() => selectContentBlock(data.category)}
                      className={
                        data.category === contentBlock
                          ? "category-name active"
                          : "category-name"
                      }
                    >
                      {data.category}
                    </div>
                  ) : data.category === "All" &&
                    location.pathname === "/emails" ? (
                    <div
                      onClick={() => selectCategoryEmails(null)}
                      className={
                        category === null && type === "Email"
                          ? "category-name active"
                          : "category-name"
                      }
                    >
                      All
                    </div>
                  ) : location.pathname === "/emails" ? (
                    <div
                      onClick={() => selectCategoryEmails(data.category)}
                      className={
                        data.category === category
                          ? "category-name active"
                          : "category-name"
                      }
                    >
                      {data.category}
                    </div>
                  ) : data.category === "All" ? (
                    <div
                      onClick={selectAll}
                      className={
                        category === null && type === null
                          ? "category-name active"
                          : "category-name"
                      }
                    >
                      {data.category}
                    </div>
                  ) : data.category === "Email" ||
                    data.category === "Content Block" ? (
                    <div
                      onClick={() => selectType(data.category)}
                      className={
                        data.category === type
                          ? "category-name active"
                          : "category-name"
                      }
                    >
                      {data.category}
                    </div>
                  ) : (
                    <div
                      onClick={() => selectCategory(data.category)}
                      className={
                        data.category === category
                          ? "category-name active"
                          : "category-name"
                      }
                    >
                      {data.category}
                    </div>
                  )}
                  <div className="category-count">{data.count}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Render Email cards */}
          {emails?.map((data, index) => {
            // const image = data.image ? `${data.image}?${now}` : null
            const image = data.image;
            console.log(data.name.length);
            if (emails.length === index + 1) {
              return (
                <div
                  ref={lastEmailElementRef}
                  key={data.id}
                  className="card"
                  onClick={() => handleProjectSelect(data.id)}
                >
                  <div className="card-container">
                    <div className="card-box">
                      <div className="card-box-details">
                        <span>
                          {data.name.length > 21
                            ? data.name.slice(0, 17) + "..."
                            : data.name}
                        </span>
                        {location.pathname === "/contentblocks" ? (
                          <span>
                            {data.category} /{" "}
                            <strong>{data.contentblock}</strong>
                          </span>
                        ) : !(
                            location.pathname === "/contentblocks" ||
                            location.pathname === "/emails"
                          ) ? (
                          <span>
                            {data.category} /{" "}
                            <strong>
                              {data.type === "Content Block"
                                ? `Code Snippets`
                                : "Emails"}
                            </strong>
                          </span>
                        ) : (
                          <span>{data.category}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => copyHtml(e, data.html_code)}
                        className="button"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="card-image">
                      <img
                        src={image || "https://i.imgur.com/smZLfPS.png"}
                        alt={data.name}
                      />
                    </div>
                    <div className="card-details-icon">
                      <img
                        src="https://i.imgur.com/9joR86R.png"
                        width={36}
                        alt="View details icon"
                        title="View more"
                      />
                      <p>View more</p>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  className="card"
                  key={data.id}
                  onClick={() => handleProjectSelect(data.id)}
                >
                  <div className="card-container">
                    <div className="card-box">
                      <div className="card-box-details">
                        <span>
                          {data.name.length > 21
                            ? data.name.slice(0, 17) + "..."
                            : data.name}
                        </span>
                        {location.pathname === "/contentblocks" ? (
                          <span>
                            {data.category} /{" "}
                            <strong>{data.contentblock}</strong>
                          </span>
                        ) : !(
                            location.pathname === "/contentblocks" ||
                            location.pathname === "/emails"
                          ) ? (
                          <span>
                            {data.category} /{" "}
                            <strong>
                              {data.type === "Content Block"
                                ? `Code Snippets`
                                : "Emails"}
                            </strong>
                          </span>
                        ) : (
                          <span>{data.category}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => copyHtml(e, data.html_code)}
                        className="button"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="card-image">
                      <img
                        src={image || `https://i.imgur.com/smZLfPS.png`}
                        alt={data.name}
                      />
                    </div>
                    <div className="card-details-icon">
                      <img
                        src="https://i.imgur.com/9joR86R.png"
                        width={40}
                        alt="View details icon"
                        title="View more"
                      />
                      <p>View more</p>
                    </div>
                  </div>
                </div>
              );
            }
          })}
          {loading && <div>Loading...</div>}
          {error && <div>Error</div>}
        </div>
      </div>
      <ToastContainer
        theme="colored"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </section>
  );
};

export default EmailListV2;
