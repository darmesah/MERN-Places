import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Button from "../../../components/FormElements/Button";
import ImageUpload from "../../../components/FormElements/ImageUpload/ImageUpload";
import Input from "../../../components/FormElements/Input/Input";
import Card from "../../../components/UIElements/Card/Card";
import useInput from "../../../hooks/use-input";
import { authActions } from "../../../store/auth";

import classes from "./components/Auth.module.css";

const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoadiing, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const isEmail = (value) => value.includes("@");
  const isGreater = (value) => value.trim().length >= 5;
  const isFile = (value) => value !== "";

  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    valueChangeHandler: nameChangeHandler,
  } = useInput(isGreater, "");

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    valueChangeHandler: emailChangeHandler,
  } = useInput(isEmail, "");

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    valueChangeHandler: passwordChangeHandler,
  } = useInput(isGreater, "");

  const {
    value: image,
    isValid: imageIsValid,
    valueChangeHandler: imageChangedHandler,
  } = useInput(isFile, "");

  let formIsValid = false;

  if (isLoginMode) {
    if (enteredEmailIsValid && enteredPasswordIsValid) {
      formIsValid = true;
    }
  } else {
    if (
      enteredNameIsValid &&
      enteredEmailIsValid &&
      enteredPasswordIsValid &&
      imageIsValid
    ) {
      formIsValid = true;
    }
  }

  const switchModeHandler = () => {
    setIsLoginMode((prevValue) => !prevValue);
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();

    if (!isLoginMode) {
      const authAction = async () => {
        try {
          setIsLoading(true);

          const formData = new FormData();
          formData.append("email", enteredEmail);
          formData.append("name", enteredName);
          formData.append("password", enteredPassword);
          formData.append("image", image);

          const response = await fetch(
            process.env.REACT_APP_BACKEND_URL + "/users/signup",
            {
              method: "post",
              body: formData,
            }
          );

          if (!response.ok) {
            setIsLoading(false);
            const error = await response.json();
            throw new Error(error.message);
          }

          const data = await response.json();
          const { token, userId } = data;
          const expiration = new Date();
          // expiration.setSeconds(expiration.getSeconds() + 30);
          expiration.setHours(expiration.getDay() + 60);

          const userData = {
            token,
            userId,
            expiration,
          };

          localStorage.setItem("userData", JSON.stringify(userData));

          return navigate("/");
        } catch (error) {
          setError(error.message);
        }
      };

      authAction();
    } else {
      const authAction = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(
            process.env.REACT_APP_BACKEND_URL + "/users/login",
            {
              method: "post",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: enteredEmail,
                password: enteredPassword,
              }),
            }
          );

          if (!response.ok) {
            setIsLoading(false);
            const error = await response.json();
            throw new Error(error.message);
          }

          navigate("/");

          const data = await response.json();
          const { token, userId } = data;
          const expiration = new Date();
          // expiration.setSeconds(expiration.getSeconds() + 30);
          expiration.setHours(expiration.getDay() + 60);

          const userData = {
            token,
            userId,
            expiration,
          };

          localStorage.setItem("userData", JSON.stringify(userData));

          dispatch(authActions.login({ token, userId }));
        } catch (error) {
          setError(error.message);
        }
      };

      authAction();
    }
  };

  return (
    <Card className={classes.authentication}>
      <h2>Login Required</h2>
      <hr />
      {error && <p>{error}</p>}
      <form onSubmit={formSubmitHandler} className={classes["place-form"]}>
        {!isLoginMode && (
          <Input
            element="input"
            label="Name"
            name="name"
            type="text"
            value={enteredName}
            onChange={nameChangeHandler}
            placeholder="Enter Your Name"
          />
        )}
        {!isLoginMode && (
          <ImageUpload
            center
            id="image"
            valueChangeHandler={imageChangedHandler}
          />
        )}
        <Input
          element="input"
          label="Email"
          name="email"
          type="text"
          value={enteredEmail}
          onChange={emailChangeHandler}
          placeholder="Enter E-mail Address"
        />
        <Input
          element="input"
          label="Password"
          name="password"
          type="password"
          value={enteredPassword}
          onChange={passwordChangeHandler}
          placeholder="Enter Password"
        />
        <Button disabled={!formIsValid || isLoadiing}>
          {isLoginMode ? "LOGIN" : "SIGNUP"}
        </Button>
      </form>
      <Button inverse onClick={switchModeHandler}>
        SWITCH TO {!isLoginMode ? "LOGIN" : "SIGNUP"}
      </Button>
    </Card>
  );
};

export default Auth;
