import React, { useState } from "react";
import classes from "./FormInput.module.scss";

// Why is this component so complex?
// When using this input component, it should be possible to pass onChange or onBlur event-handlers to it. However, since these event
// handlers are already defined in the component itself (for displaying error messages), this would lead to overriding them. Solution:
// Don't allow onChange and onBlur but instead allow some custom props called "addOnChange" and "addOnBlur". These custom event handlers
// get passed to the event handlers defined in here.

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "onBlur"> {
  label: string;
  errorMessage?: string;
  // Delete addOnChange and allow onChange?
  addOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addOnBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({ label, errorMessage, addOnChange, addOnBlur, ...inputProps }) => {
  const [hasBeenFocused, setHasBeenFocused] = useState(false);

  const errorMsg = !inputProps.value ? "This field is required" : errorMessage;

  // const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   addOnChange && addOnChange(e);
  // };

  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setHasBeenFocused(true);
    addOnBlur && addOnBlur(e);
  };

  return (
    <div className={classes.formInput}>
      <label htmlFor={inputProps.id}>{label}</label>
      <input {...inputProps} onBlur={handleOnBlur} onChange={addOnChange} />
      {hasBeenFocused && <span className={classes.errorMessage}>{errorMsg}</span>}
    </div>
  );
};

export default FormInput;
