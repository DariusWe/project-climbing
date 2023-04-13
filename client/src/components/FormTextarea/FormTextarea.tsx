import classes from "./FormTextarea.module.scss";
import { TextareaHTMLAttributes, FC } from "react";

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  errorMessage?: string;
}

const FormTextarea: FC<FormTextareaProps> = ({ label, errorMessage, ...inputProps }) => {
  return (
    <div className={classes.formTextarea}>
      <label htmlFor={inputProps.id}>{label}</label>
      <textarea {...inputProps} className={errorMessage ? classes.invalid : ""} />
      <span className={classes.errorMessage}>{errorMessage}</span>
    </div>
  );
};

export default FormTextarea;