import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Button from "../../../components/FormElements/Button";
import ImageUpload from "../../../components/FormElements/ImageUpload/ImageUpload";
import Input from "../../../components/FormElements/Input/Input";
import useInput from "../../../hooks/use-input";
import classes from "./components/NewPlace.module.css";

const NewPlace = () => {
  const [isLoadiing, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const token = useSelector((state) => state.auth.token);
  console.log(token);

  const navigate = useNavigate();

  const isNotEmpty = (value) => value.trim() !== "";
  const isGreater = (value) => value.trim().length >= 5;
  const isFile = (value) => value !== "";

  const {
    value: enteredTitle,
    isValid: enteredTitleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
  } = useInput(isNotEmpty, "");

  const {
    value: enteredDescription,
    isValid: enteredDescriptionIsValid,
    hasError: descriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
    inputBlurHandler: descriptionBlurHandler,
  } = useInput(isGreater, "");

  const {
    value: enteredAddress,
    isValid: enteredAddressIsValid,
    hasError: addressHasError,
    valueChangeHandler: addressChangeHandler,
    inputBlurHandler: addressBlurHandler,
  } = useInput(isGreater, "");

  const {
    value: image,
    isValid: imageIsValid,
    valueChangeHandler: imageChangedHandler,
  } = useInput(isFile, "");

  let formIsValid = false;

  if (
    enteredTitleIsValid &&
    enteredDescriptionIsValid &&
    enteredAddressIsValid &&
    imageIsValid
  ) {
    formIsValid = true;
  }

  const addPlaceHandler = (e) => {
    e.preventDefault();

    const addPlaceAction = async () => {
      try {
        setIsLoading(true);

        const formData = new FormData();
        formData.append("title", enteredTitle);
        formData.append("description", enteredDescription);
        formData.append("address", enteredAddress);
        formData.append("image", image);

        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + "/places",
          {
            method: "post",
            headers: {
              Authorization: "Bearer " + token,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          setIsLoading(false);
          const error = await response.json();
          throw new Error(error.message);
        }

        return navigate("/");
      } catch (error) {
        setError(error.message);
      }
    };

    addPlaceAction();
  };

  return (
    <form onSubmit={addPlaceHandler} className={classes["place-form"]}>
      {error && <p>{error}</p>}

      <Input
        element="input"
        label="Title"
        name="title"
        type="text"
        value={enteredTitle}
        placeholder="Enter Title"
        onChange={titleChangeHandler}
        onBlur={titleBlurHandler}
        hasError={titleHasError ? <p>Title must not be empty</p> : null}
      />
      <Input
        element="textarea"
        label="Description"
        name="description"
        value={enteredDescription}
        placeholder="Enter Description"
        onChange={descriptionChangeHandler}
        onBlur={descriptionBlurHandler}
        hasError={
          descriptionHasError ? (
            <p>Please enter a valid description (at least 5 characters)</p>
          ) : null
        }
      />
      <Input
        element="input"
        label="Address"
        name="address"
        type="text"
        value={enteredAddress}
        placeholder="Enter Address"
        onChange={addressChangeHandler}
        onBlur={addressBlurHandler}
        hasError={addressHasError ? <p>Please enter a valid address </p> : null}
      />
      <ImageUpload center id="image" valueChangeHandler={imageChangedHandler} />
      <Button type="submit" disabled={!formIsValid || isLoadiing}>
        ADD PLACE
      </Button>
    </form>
  );
};

export default NewPlace;
