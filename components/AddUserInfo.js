import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Link from "next/link";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Heading, Subheading } from "../components/HelperComponents/Headings";
import {
  CustomInput,
  Password,
  PasswordInput,
} from "../components/HelperComponents/Inputs";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { useDispatch } from "react-redux";
import { addToUser } from "../redux/userSlice";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { CircularProgress } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;

let cancel;

function AddUserInfo({
  setUserData,
  setNextDisabled,
  errorMessage,
  setErrorMessage,
}) {
  const dispatch = useDispatch();
  const [visibility, setVisibility] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const [username, setUsername] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);

  const handleChange = (e) => {
    if (errorMessage !== "") {
      setErrorMessage("");
    }
    const { name, value, files } = e.target;

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const checkUsername = async () => {
    setUsernameLoading(true);

    try {
      cancel && cancel();

      const CancelToken = axios.CancelToken;


      console.log("inside of checkUsername");
      const res = await axios.get(`${baseUrl}/api/signup/${username}`, {
        cancelToken: new CancelToken((canceler) => {
          cancel = canceler;
        }),
      });

      if (errorMessage !== "") setErrorMessage("");

      if (res.data === "Available") {
        setUsernameAvailable(true);
        setUser((prev) => ({ ...prev, username }));
      }
      console.log(res.data);
      if (res.data === "Username already taken") {
        setErrorMessage("Username Not Available");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setErrorMessage("Username Not Available");
        }
      }

      setUsernameAvailable(false);
    }

    setUsernameLoading(false);
  };


  useEffect(() => {
    setUser({
      name: sessionStorage.getItem("name") || "",
      email: sessionStorage.getItem("email") || "",
      password: sessionStorage.getItem("password") || "",
    });

    setUsername(sessionStorage.getItem("username") || "");
  }, []);

  useEffect(() => {
    console.log(`username : ${username}`);
    username === "" ? setUsernameAvailable(false) : checkUsername();

  }, [username]);


  useEffect(() => {
    const isUser = Object.values({ name, email, password, username }).every(
      (item) => Boolean(item)
    );


    if (isUser && usernameAvailable) {
      sessionStorage.setItem("name", name);
      sessionStorage.setItem("email", email);
      sessionStorage.setItem("password", password);
      sessionStorage.setItem("username", username);
      dispatch(addToUser({ name, email, password, username }));
      setNextDisabled(false);
    } else {
      setNextDisabled(true);
    }
  });



  return (
    <>
      <Container>
        <h1
          style={{
            fontSize: "2.8rem",
            fontFamily: "Poppins",
            fontWeight: "600",
            marginBottom: "-0.1rem",
          }}
        >
          Sign Up for your
        </h1>
        <Heading fontSize={"2.6rem"} fontWeight={"600"}>
          Party House <Subheading fontSize={"1.7rem"}>of your life.</Subheading>
        </Heading>
        <CustomInput
          placeholder="Enter Name"
          name="name"
          value={name}
          onChange={handleChange}
        />
        <CustomInput
          placeholder="Enter Email"
          name="email"
          value={email}
          onChange={handleChange}
        />
        <Password bgColor={"white"} minWidth={"21rem"} marginTop={"1.6rem"}>
          <PasswordInput
            placeholder="Enter Password"
            name="password"
            value={password}
            onChange={handleChange}
            type={visibility ? "text" : "password"}
          />
          <div
            onClick={() => setVisibility((prev) => !prev)}
            style={{ cursor: "pointer" }}
          >
            {visibility ? <Visibility /> : <VisibilityOff />}
          </div>
        </Password>

        <Username bgColor={"white"} minWidth={"21rem"}>
          <UsernameInput
            placeholder="Enter Username"
            name="username"
            value={username}
            onChange={(e) => {
              if (errorMessage !== "") {
                setErrorMessage("");
              }

              setUsername(e.target.value);
              if (username.length < 1) {
                setUsernameAvailable(false);
                return;
              }

              if (regexUserName.test(e.target.value)) {
                setUsernameAvailable(true);
              } else {
                setUsernameAvailable(false);
              }
            }}
          />
          <div>
            {usernameLoading ? (
              <CircularProgress size={20} />
            ) : usernameAvailable ? (
              <CheckCircleIcon style={{ color: "#94c65a " }} />
            ) : (
              <CancelIcon style={{ color: "#fe6f8a" }} />
            )}
          </div>
        </Username>
        {errorMessage !== "" && (
          <ErrorContainer>
            <div>
              <ErrorOutlineIcon
                style={{
                  fontSize: "1.31rem",
                  color: "#fe6f8a",
                }}
              />
            </div>

            <ErrorText>{errorMessage}</ErrorText>
          </ErrorContainer>
        )}
      </Container>
    </>
  );
}

const Container = styled.div`
  padding-top: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(252, 239, 255);
`;

const Username = styled.div`
  background-color: ${(props) =>
    props.bgColor ? props.bgColor : "transparent"};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-radius: 10px;
  padding: 18px;
  margin: 2.2rem 2.2rem 0 2.2rem;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : "2.2rem")};
  min-width: ${(props) => (props.minWidth ? props.minWidth : "14rem")};
  max-width: 40rem;
  border: 1.5px solid #f0e6ff;
  :focus-within {
    border: 1.5px solid #a097ea;
  }
`;

const UsernameInput = styled.input`
  font-size: 1.18rem;
  font-weight: 400;
  width: 100%;
  outline: none;
  border: none;
  color: black;
  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #8f85de;
    opacity: 0.46; /* Firefox */
  }
`;

const ErrorText = styled.p`
  color: #fe6f8a;
  font-size: 1.01rem;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  width: 100%;
  margin-left: 0.4rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  margin-top: 2.1rem;
  align-items: center;
`;

export default AddUserInfo;
