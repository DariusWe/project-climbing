import classes from "./UpdateCragImageBtn.module.scss";
import { ChangeEvent, FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCragImage } from "../../api/queries";
import FormInput from "../FormInput/FormInput";
import { Form } from "react-router-dom";

const UpdateCragImageBtn = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File>();

  const queryClient = useQueryClient();
  const updateCragImageMutation = useMutation(updateCragImage, {
    onSuccess: () => {
      alert("Crag image was successfully updated. Refresh the page to see changes.");
      return queryClient.invalidateQueries({ queryKey: ["crags"] });
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    } else if (file && !file.type.startsWith("image/")) {
      alert("Invalid File type");
      return;
    } else if (file && file.size > 7000000) {
      alert("Max. file size is 7 MB");
      return;
    }

    setFile(file);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !name) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);

    updateCragImageMutation.mutate(formData);
  }

  return (
    <div className={classes.container}>
      <Form onSubmit={handleSubmit}>
        <FormInput type="text" label="Name of crag" onChange={(e) => setName(e.target.value)} value={name} />
        <FormInput label="New image" type="file" className={classes.updateCragImg} onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
};

export default UpdateCragImageBtn;
