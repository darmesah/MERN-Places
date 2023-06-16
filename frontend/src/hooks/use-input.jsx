import { useReducer } from 'react';

let initialInputState = {
  value: '',
  isTouched: false,
};

const inputStateReducer = (state, action) => {
  if (action.type === 'INPUT') {
    return {
      value: action.value,
      isTouched: state.isTouched,
    };
  }

  if (action.type === 'BLUR') {
    return {
      isTouched: true,
      value: state.value,
    };
  }

  return initialInputState;
};

const useInput = (validateValue, initValue) => {
  initialInputState.value = initValue;

  const [inputState, dispatch] = useReducer(
    inputStateReducer,
    initialInputState
  );

  const valueIsValid = validateValue(inputState.value);
  const hasError = !valueIsValid && inputState.isTouched;

  const valueChangeHandler = (e) => {
    dispatch({
      type: 'INPUT',
      value: e.target.files ? e.target.files[0] : e.target.value,
    });
  };
  const inputBlurHandler = () => {
    dispatch({ type: 'BLUR' });
  };

  return {
    value: inputState.value,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
  };
};

export default useInput;
