import React, { useReducer, useEffect } from "react";
import "./CustomInput.styles.css";
const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true,
      };
    default:
      return state;
  }
};

const CustomTextInput = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : "",
    isValid: props.initialValidity ? props.initialValidity : false,
    touched: false,
  });

  const textChangeHandler = (event) => {
    const text = event.target.value;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const matNumberRegex = /^([a-zA-Z]{3}\/[a-z]{3}\/[0-9]{6}$)|^(pt\/[a-zA-Z]{3}\/[a-z]{3}\/[0-9]{6}$)/i;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.matNumber && !matNumberRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.confirmValue && (text !== props.confirmValue)) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }
    dispatch({
      type: INPUT_CHANGE,
      value: text,
      isValid: isValid,
    });
  };

  const inputBlurHandler = () => {
    dispatch({ type: INPUT_BLUR });
  };

  const { id, onInputChange } = props;
  useEffect(() => {
    onInputChange(id, inputState.value, inputState.isValid);
  }, [id, onInputChange, inputState]);

  return (
    <div 
    //className={classes.inputContainer}
    >
      <input ref={props.textRef} {...props} onChange={textChangeHandler} onBlur={inputBlurHandler} />
      {inputState.touched && !inputState.isValid ? (
        <div 
        //className={classes.errorContainer}
        >
          <p className="errorText">{props.errorMessage}</p>
        </div>
      ) : (
        <div 
        //className={classes.errorContainer}
        >
        <pre className="errorText"><p className="errorText">{` `}</p></pre>
        </div>
      )}
    </div>
  );
};

export default CustomTextInput;
