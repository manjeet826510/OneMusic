import React, { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Store } from "../Store";
import { toast } from "react-toastify";
// import getError from "../utils";

const SignupScreen = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  // console.log(search);
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  // console.log(redirectInUrl);
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(password);
    console.log(confirmPassword);
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const { data } = await axios.post(
        "https://one-music-7snl.onrender.com/api/users/signup", 
        // "http://localhost:5000/api/users/signup", 
        {
        name: name,
        email: email,
        password: password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      // console.log(state);
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
      //   console.log(data);
    } catch (err) {
      toast.error("User already exists.");
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
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3">Sign Up</h1>
      <Form onSubmit={submitHandler} method="post">
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control required onChange={(e) => setName(e.target.value)} />
        </Form.Group>
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
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button variant="outline-light" type="submit">Sign Up</Button>
        </div>
        <div>
          Already have an account?{" "}
          <Link to={`/signin?redirect=${redirect}`}>Sign in</Link>
        </div>
      </Form>
    </Container>
  );
};

export default SignupScreen;
