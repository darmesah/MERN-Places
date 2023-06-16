import { useSelector } from 'react-redux';
import {
  json,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from 'react-router-dom';

import Button from '../../../components/FormElements/Button';
import Input from '../../../components/FormElements/Input/Input';
import Card from '../../../components/UIElements/Card/Card';
import useInput from '../../../hooks/use-input';

import classes from './components/UpdatePlace.module.css';

const UpdatePlace = () => {
  const data = useActionData();

  const place = useLoaderData();

  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const isNotEmpty = (value) => value.trim() !== '';
  const isGreater = (value) => value.trim().length >= 5;

  const {
    value: enteredTitle,
    isValid: enteredTitleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
  } = useInput(isNotEmpty, place.title);

  const {
    value: enteredDescription,
    isValid: enteredDescriptionIsValid,
    hasError: descriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
    inputBlurHandler: descriptionBlurHandler,
  } = useInput(isGreater, place.description);

  let formIsValid = false;

  if (enteredTitleIsValid && enteredDescriptionIsValid) {
    formIsValid = true;
  }

  const token = useSelector((state) => state.auth.token);
  const updateHandler = (e) => {
    e.preventDefault();

    submit(
      { title: enteredTitle, description: enteredDescription, token },
      { method: 'patch' }
    );
    // setShowConfrimModal(false);
  };

  // NO PLACE FOUND
  if (!place) {
    return (
      <div className="center">
        <Card>Could not find place!</Card>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={updateHandler} className={classes['place-form']}>
        {data && data.message && <p>{data.message}</p>}
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
        <Button type="submit" disabled={!formIsValid || isSubmitting}>
          UPDATE PLACE
        </Button>
      </form>
    </>
  );
};

export default UpdatePlace;

export const loader = async ({ request, params }) => {
  const { placeId } = params;

  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
  );

  if (!response.ok) {
    throw json({ message: 'Could not load place data' });
  } else {
    const resData = await response.json();
    return resData.place;
  }
};

export const action = async ({ request, params }) => {
  const data = await request.formData();
  const placeId = params.placeId;

  const updatePlaceData = {
    title: data.get('title'),
    description: data.get('description'),
  };

  const token = data.get('token');

  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(updatePlaceData),
    }
  );

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw json({ message: 'Could not update place' }, { status: 500 });
  }

  return redirect('/');
};
