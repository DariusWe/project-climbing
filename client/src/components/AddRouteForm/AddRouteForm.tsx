import classes from "./AddRouteForm.module.scss";
import Popup from "../Popup/Popup";
import useStore from "../../store";
import FormInput from "../FormInput/FormInput";
import { ChangeEvent, FormEvent, useState } from "react";

const AddRouteForm = () => {
  const [setIsAddRouteFormOpen] = useStore((state) => [state.setIsAddRouteFormOpen]);

  const [crag, setCrag] = useState("");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");

  const handleCragChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCrag(e.target.value);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleGradeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGrade(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Popup closeFn={() => setIsAddRouteFormOpen(false)}>
      <div>Add Route here</div>
      <form onSubmit={handleSubmit}>
        <FormInput label="Crag" onChange={handleCragChange} value={crag} />
        <FormInput label="Name" onChange={handleNameChange} value={name} />
        <FormInput label="Grade" onChange={handleGradeChange} value={grade} />
        <button type="submit">Create Route</button>
      </form>
    </Popup>
  );
};

export default AddRouteForm;
