import { InputHTMLAttributes, FC } from "react";
import classes from "./FormInput.module.scss";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errorMessage?: string;
}

const FormInput: FC<FormInputProps> = ({ label, errorMessage, ...inputProps }) => {
  return (
    <div className={classes.formInput}>
      <label htmlFor={inputProps.id}>{label}</label>
      <input {...inputProps} className={errorMessage ? classes.invalid : ""} />
      <span className={classes.errorMessage}>{errorMessage}</span>
    </div>
  );
};

export default FormInput;
