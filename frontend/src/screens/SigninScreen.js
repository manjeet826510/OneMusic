import React, { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Store } from "../Store";
import { toast } from "react-toastify";
import getError from "../utils";

const SigninScreen = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  // console.log(search);
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  // console.log(redirectInUrl);
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "https://one-music-7snl.onrender.com/api/users/signin", 
        // "http://localhost:5000/api/users/signin", 
        {
        email: email,
        password: password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
    //   ref = data;
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (err) {
        toast.error(getError(err));
      }
  };

  useEffect(() => {
    if (userInfo) {
        navigate(redirect);
      }
  }, [userInfo, navigate, redirect]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Sign In</Button>
        </div>
        <div>
          New Customer?{" "}
          <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </div>
      </Form>
    </Container>
  );
};

export default SigninScreen;