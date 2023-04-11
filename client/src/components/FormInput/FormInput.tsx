import React from "react";
import classes from "./FormInput.module.scss";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, ...inputProps }) => {
  return (
    <div className={classes.formInput}>
      <label htmlFor={inputProps.id}>{label}</label>
      <input {...inputProps} />
      <span></span>
    </div>
  );
};

export default FormInput;
