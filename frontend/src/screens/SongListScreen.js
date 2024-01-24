import React, { useContext, useEffect, useReducer, useState } from "react";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import axios from "axios";
import getError from "../utils";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/esm/Button";
import { Store } from "../Store";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
// import { toast } from "react-toastify";
import CreateSongPopup from "./CreateSongPopup";
import EditSongPopup from "./EditSongPopup";
import DeleteSongPopup from "./DeleteSongPopup";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        songs: action.payload.songs,
        // page: action.payload.page,
        pages: action.payload.pages,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreate: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false };
    default:
      return state;
  }
};

const SongListScreen = () => {
  const loc = useLocation();
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [create, setcreate] = useState(false);
  const [edit, setedit] = useState(false);
  const [del, setdel] = useState(false);
  const [pid, setpid] = useState("");

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setcreate(false);
    setedit(false);
    navigate(`/admin/songlist?page=1`);
  };
  // console.log(loc);
  // loc = {pathname: '/admin/productlist', search: '?page=1', hash: '', state: null, key: 'i24c7pcz'}
  const { search } = loc;
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;

  const [{ loading, error, songs, pages }, dispatch] = useReducer(reducer, {
    loading: false,
    songs: [],
    error: "",
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchSongs = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(`/api/songs/admin?page=${page}`, {
          headers: {
            authorization: `Bearer ${userInfo.jwtToken}`,
          },
        });
        // console.log(data);
        // data = {products: products, page: page, pages: pages}
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", error: getError(err) });
      }
    };

    fetchSongs();
  }, [userInfo, page]);

  const getFilterUrl = (
    filter //filter = { page: 1 }
  ) =>
    //   or filter = {price: "something"} or etc ...
    // url = http://localhost:3000/productlist?page=1
    {
      const filterPage = filter.page;

      return {
        pathname: "/admin/songlist",
        search: `?page=${encodeURIComponent(filterPage)}`,
      };
    };

  // const createHandler = async ()=>{
  // if(window.confirm("Are you sure to create product?")){
  //     try {
  //         navigate(`/admin/product/create`);
  //         dispatch({type: 'CREATE_REQUEST'});
  //         const {data} = await axios.post(
  //             "/api/products",
  //             {},
  //             {
  //                 headers: {
  //                     authorization: `Bearer ${userInfo.jwtToken}`
  //                 }
  //             }
  //         )
  //         toast.success("Product created successfully");
  //         dispatch({type: 'CREATE_SUCCESS'})
  //         // navigate(`/admin/product/${data.product._id}`)
  //         // console.log("product created");
  //     } catch (err) {
  //         toast.error(getError(err));
  //         dispatch({type: 'CREATE_FAIL'})
  //     }
  // }
  // };

  return (
    <div>
      <Helmet>
        <title>Song List</title>
      </Helmet>

      <Row>
        <Col>
          <h1>Songs</h1>
        </Col>
        <Col className="col text-end">
          <div>
            {/* Button to open the popup */}
            <Button
              type="button"
              onClick={() => {
                openPopup();
                setcreate(true);
              }}
            >
              Create Song
            </Button>

            {/* Popup */}
            {showPopup && create && (
              <CreateSongPopup closePopup={closePopup} />
            )}
            {showPopup && edit && (
              <EditSongPopup closePopup={closePopup} pid={pid} />
            )}
            {showPopup && del && (
              <DeleteSongPopup closePopup={closePopup} pid={pid} />
            )}
          </div>
        </Col>
      </Row>

      {/* {loadingCreate && <LoadingBox></LoadingBox>} */}
      {loading ? (
        <div>
          <LoadingBox />
        </div>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>ARTIST</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {songs && songs.map((song) => (
                  <tr key={song._id}>
                    <td>{song._id}</td>
                    <td>{song.name}</td>
                    <td>{song.artist}</td>
                    <td>
                      <Button
                        onClick={() => {
                          openPopup();
                          setedit(true);
                          setpid(song._id);
                        }}
                      >
                        Edit
                      </Button>
                      {"    "}
                      <Button
                        onClick={() => {
                          openPopup();
                          setdel(true);
                          setpid(song._id);
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            {[...Array(pages).keys()].map((x) => (
              // The expression [...Array(pages).keys()] creates an array of numbers from 0 to pages - 1.
              // if pages = 3 then [0, 1, 2]
              <LinkContainer
                key={x + 1}
                className="mx-1"
                to={getFilterUrl({ page: x + 1 })}
              >
                <Button
                  className={Number(page) === x + 1 ? "text-bold" : ""}
                  variant="light"
                >
                  {x + 1}
                </Button>
              </LinkContainer>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SongListScreen;
