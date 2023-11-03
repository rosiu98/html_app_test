import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProjectFinder from "../apis/ProjectFinder";
import IframeResizer from "iframe-resizer-react";
import template from "../apis/template";
// import { CodeBlock, dracula } from "react-code-blocks";
import Navigation from "../Components/Navigation";
import { listOfView } from "../apis/lists";
import Select from "react-select";
import Lottie from "lottie-react";
import loaderAnimation from "../apis/skeleton-loader.json";
import { toast, ToastContainer } from "react-toastify";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { html as codeMirrorHtml } from "@codemirror/lang-html";
import useEmailsDataStore from "../stores/emailsData";

const EmailPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const userInfo = useEmailsDataStore((state) => state.userInfo);
  const [data, setData] = useState({});
  const [width, setWidth] = useState(700);
  const [value, setValue] = useState(true);
  const [loading, setLoading] = useState(true);
  const [select, setSelect] = useState({
    value: "Desktop",
    text: "Desktop",
    icon: (
      <img src="https://i.imgur.com/c4jDmGP.png" width="16" alt="Desktop" />
    ),
  });
  const [code, setCode] = useState("a = 0");
  const [user, setUser] = useState({});
  const [updater, setUpdater] = useState(false);

  const onResized = (data) => data && setLoading(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ProjectFinder.get(`/${id}`);
        setData(response.data.rows);
        setCode(response.data.rows.html_code);
        setUser(response.data.user);
        setUpdater(response.data.updated_user);
        // console.log(response.data.rows)
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [value, select]);

  const showValue = () => {
    setValue(!value);
  };

  const changeView = (e) => {
    if (e.value === select.value) {
      return;
    }

    setLoading(true);
    setSelect(e);

    if (e.value === "Desktop") {
      setWidth(700);
    } else {
      setWidth(400);
    }
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(data.html_code);
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

  const deleteProject = async () => {
    const index = String(data.image).split("/").at(-1);
    await ProjectFinder.delete(`/${index}`);
    toast.success(`${data.name} have been deleted from database.`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    navigate("/");
  };

  const updateProject = async () => {
    const index = String(data.image).split("/").at(-1);
    const loaderToast = toast.loading("Updating Code...");
    await ProjectFinder.put(`/${index}`, {
      html_code: code,
      type: data.type,
      user_id: userInfo.rows.id,
    });
    await ProjectFinder.get(`/screenshot/${id}`);
    toast.update(loaderToast, {
      render: `Code have been updated!`,
      type: "success",
      isLoading: false,
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
    });
    const data2 = { ...data };
    data2.update_code = new Date();
    data2.html_code = code;
    setData(data2);
    setUpdater(userInfo.rows);
    // setData([...data , data.update_code: Date.now()])
  };

  let html;

  if (Object.keys(data).length > 0) {
    if (data?.type === "Content Block") {
      html = template.replace("%%Content_Block%%", data.html_code);
      html = html.replace(
        "<head>",
        '<head> <script src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.6.0/iframeResizer.contentWindow.min.js"></script>'
      );
    } else {
      html = data.html_code.replace(
        "<head>",
        '<head> <script src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.6.0/iframeResizer.contentWindow.min.js"></script>'
      );
    }
  }

  const colourStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "#F2F3F2",
      padding: "5px",
      border: "1px solid black",
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

  const formatter = new Intl.DateTimeFormat("uk", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  return (
    <div className="emPage">
      <Navigation />
      <div className="pagehref">
        <div className="pagehref-text">
          {data.type === "Content Block"
            ? data.category + " / Code Snippets"
            : "Emails"}{" "}
          / <span>{data.name}</span>
        </div>
        <div className="count-page">
          <img
            src="https://i.imgur.com/OkJyeVG.png"
            width={24}
            height={24}
            alt="View icon"
          />
          &nbsp;
          {Number(data.count) === 0 ? Number(data.count) + 1 : data.count} Views
        </div>
      </div>
      <div className="emailPage-container">
        <div className="emailPage-main">
          <div className="emailPage-main-box">
            {value ? (
              <>
                {loading && (
                  <div className="emailPage-loading">
                    <Lottie
                      rendererSettings={"preserveAspectRatio"}
                      animationData={loaderAnimation}
                      loop={true}
                    />
                  </div>
                )}
                <IframeResizer
                  key={width}
                  sizeHeight={true}
                  sizeWidth={true}
                  checkOrigin={false}
                  heightCalculationMethod={
                    width === 700 ? "lowestElement" : "lowestElement"
                  }
                  style={{ width, visibility: loading ? "hidden" : "unset" }}
                  onResized={onResized}
                  frameBorder="0"
                  autoResize={true}
                  srcDoc={html}
                />
                <div className="emailPage-main-view">
                  <Select
                    placeholder="Select Category"
                    value={select}
                    options={listOfView}
                    inputProps={{
                      autoComplete: "off",
                      autoCorrect: "off",
                      spellCheck: "off",
                    }}
                    onChange={changeView}
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
                </div>
              </>
            ) : (
              // <CodeBlock
              //         text={data.html_code}
              //         language={"html"}
              //         showLineNumbers={false}
              //         codeBlock={true}
              //         theme={dracula}
              //         customStyle={{
              //             width: '700px',
              //             height: '75vh',
              //             overflow: 'scroll',
              //             fontSize: '12px',
              //             whiteSpace: 'pre-wrap',
              //             wordWrap: 'break-word',
              //             overflowWrap: 'anywhere'
              //         }}

              <CodeMirror
                value={code}
                theme={dracula}
                extensions={[codeMirrorHtml()]}
                onChange={(editor, change) => {
                  setCode(editor);
                }}
              />
            )}
          </div>
        </div>
        <div>
          <div className="emailPage-sidemenu">
            <div className="emailPage-buttons">
              <button onClick={copyHtml} className="button">
                Copy
              </button>
              <button className="button buttonView" onClick={showValue}>
                {value ? "View Code" : "View Design"}
              </button>
              <button onClick={deleteProject} className="button red">
                Delete
              </button>
              {!value && (
                <button onClick={updateProject} className="button green">
                  Update Code
                </button>
              )}
            </div>
          </div>
          {user && (
            <div className="user_info">
              <div className="user_created">
                <span>Created by:</span>
                <img src={user.user_image} alt={user.user_name} />
                <strong>
                  {user.user_name}
                  <br />
                  <span style={{ fontWeight: "normal" }}>
                    {data.created_at &&
                      formatter.format(Date.parse(data.created_at))}
                  </span>
                </strong>
              </div>
              {updater && (
                <div className="user_created">
                  <span>Updated by:</span>
                  <img src={updater.user_image} alt={updater.user_name} />
                  <strong>
                    {updater.user_name}
                    <br />
                    <span style={{ fontWeight: "normal" }}>
                      {formatter.format(
                        Date.parse(
                          data.update_code === "0"
                            ? new Date()
                            : data.update_code
                        )
                      )}
                    </span>
                  </strong>
                </div>
              )}
            </div>
          )}
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
    </div>
  );
};

export default EmailPage;
