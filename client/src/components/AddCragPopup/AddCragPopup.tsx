import classes from "./AddCragPopup.module.scss";
import { useState, useRef, useEffect, FormEvent, ChangeEvent, FocusEvent } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import markerImage from "../../assets/marker.png";
import FormInput from "../FormInput/FormInput";
import { getDownloadUrl, uploadToFirebaseStorage } from "../../utils/firebase.utils";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { fetchCrags, postCrag } from "../../api/queries";
import type { Crag } from "../../api/types";
import FormTextarea from "../FormTextarea/FormTextarea";
import useStore from "../../store";

// While beeing pretty straight forward, this component is large. It contains a form with user input validation and custom error
// handling as well as the functionality for a Mapbox map. The map is used to make it easier for the user to select the coordinates for
// the climbing location he wants to add. If the user moves the map, the values for the lat and lng input fields get updated accordingly
// (and vice versa). Because the map is so tightly integrated into the form, splitting this component up would make it more complex and
// harder to test.

const mapboxToken = import.meta.env.VITE_APP_MAPBOX_TOKEN;
const nameRegex = /^[A-Za-z ]{3,20}$/;
const latitudeRegex = /^-?(?:90(?:\.0+)?|[1-8]?\d(?:\.\d+)?|\d+\.)$/;
const longitudeRegex = /^-?(?:180(?:\.0+)?|\d{1,2}(?:\.\d+)?|1[0-7]\d(?:\.\d+)?|\d+\.)$/;

const AddCragPopup = () => {
  const [setAddCragPopupOpen] = useStore((state) => [state.setAddCragPopupOpen]);
  // Controlled form input values
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("38.181548");
  const [longitude, setLongitude] = useState("21.472858");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  // Error messages shown under input fields
  const [nameErrorMsg, setNameErrorMsg] = useState("");
  const [latitudeErrorMsg, setLatitudeErrorMsg] = useState("");
  const [longitudeErrorMsg, setLongitudeErrorMsg] = useState("");
  const [descriptionErrorMsg, setDescriptionErrorMsg] = useState("");
  const [imageErrorMsg, setImageErrorMsg] = useState("");

  // Progress of file upload
  const [progress, setProgress] = useState(0);

  // Crags from the database. Needed to check if the name of the new crag is already in use.
  const [crags, setCrags] = useState<Crag[]>();

  // As the crags are already fetched in App.tsx, this will just refetch the data from the cache.
  // If crags should not all be fetched at once in the future in App.tsx (because too many entries), another solution would
  // be to just fetch the names of the crags, which would save cache memory. Alternatively, i could send the name to an api
  // endpoint which wil do the checking. Last but not least, i could also send the whole crag to the server, which will do
  // the checking and return an error if already taken. This way it would need some time on the fronted to show the user the
  // error message though.
  useQuery({
    queryKey: ["crags"],
    queryFn: fetchCrags,
    onSuccess: (data: Crag[]) => {
      setCrags(data);
    },
  });

  // Create a React Query mutation to post the new entry. Gets executed when form is submitted.
  const queryClient = useQueryClient();
  const postCragMutation = useMutation(postCrag, {
    onSuccess: () => {
      alert("Crag was successfully created!");
      return queryClient.invalidateQueries({ queryKey: ["crags"] });
    },
  });

  // Get reference to the HTML-Element that will contain the Mapbox map
  const mapContainer = useRef<HTMLDivElement | null>(null);

  // A ref to store the map object
  const map = useRef<Map | null>();

  // The following useEffect will create the Mapbox map and attach it to the mapContainer html element. It will also create a marker
  // and place it on the center of the map. Everytime the user moves the map to place the marker on the desired location, the useState
  // values for lattitude and longitude will be updated.
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/darius222/clg2xknp3005g01myy2e6p5rn",
      center: [21.472858, 38.181548],
      zoom: 4,
      minZoom: 2,
      pitchWithRotate: false,
      dragRotate: false,
    });

    const markerImg = document.createElement("img");
    markerImg.src = markerImage;
    markerImg.width = 25;

    const marker = new mapboxgl.Marker(markerImg, { anchor: "bottom" })
      .setLngLat(map.current.getCenter())
      .addTo(map.current);

    map.current.on("move", () => {
      marker.setLngLat(map.current!.getCenter());
      setLatitude(map.current!.getCenter().lat.toFixed(6));
      setLongitude(map.current!.getCenter().lng.toFixed(6));
      setLatitudeErrorMsg("");
      setLongitudeErrorMsg("");
    });
  }, [mapContainer.current]);

  /* INPUT EVENT HANDLERS BELOW *********************************************************************************************/
  // User interactions with inputs will trigger input validation and error messages handling.

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (!e.target.value) {
      setNameErrorMsg("This field is required");
    } else if (!nameRegex.test(e.target.value)) {
      setNameErrorMsg("Name should be 3 - 20 characters and not contain any special characters or numbers.");
    } else if (crags?.some((obj) => obj.name === e.target.value)) {
      setNameErrorMsg("Name is already used by another crag. Please choose a unique name.");
    } else {
      setNameErrorMsg("");
    }
  };

  const handleLatitudeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLatitude(e.target.value);
    setLatitudeErrorMsg("");
  };

  const handleLatitudeFocusOut = (e: FocusEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!inputValue) {
      setLatitudeErrorMsg("This field is required");
    } else if (!latitudeRegex.test(inputValue)) {
      setLatitudeErrorMsg("Accepted value range: [-90, 90]");
    } else if (longitudeErrorMsg) {
      return;
    } else {
      map.current!.flyTo({ center: [parseFloat(longitude), parseFloat(latitude)] });
    }
  };

  const handleLongitudeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLongitude(e.target.value);
    setLongitudeErrorMsg("");
  };

  const handleLongitudeFocusOut = (e: FocusEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!inputValue) {
      setLongitudeErrorMsg("This field is required");
    } else if (!longitudeRegex.test(inputValue)) {
      setLongitudeErrorMsg("Accepted value range: [-180, 180]");
    } else if (latitudeErrorMsg) {
      return;
    } else {
      map.current!.flyTo({ center: [parseFloat(longitude), parseFloat(latitude)] });
    }
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setDescription(inputValue);
    if (inputValue && (inputValue.length <= 25 || inputValue.length >= 1000)) {
      setDescriptionErrorMsg("Description should be between 25 and 1000 characters");
    } else {
      setDescriptionErrorMsg("");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageErrorMsg("");

    if (!file) {
      return;
    } else if (file && !file.type.startsWith("image/")) {
      setImageErrorMsg("Invalid File type");
      return;
    } else if (file && file.size > 7000000) {
      setImageErrorMsg("Max. file size is 7 MB");
      return;
    }

    const uploadTask = uploadToFirebaseStorage(file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progress);
      },
      (error) => {
        // ToDo: Display error to user (try it out)
        console.log(error);
        setImageErrorMsg(`An error occured: ${error}`);
        return;
      },
      async () => {
        const downloadURL = await getDownloadUrl(uploadTask.snapshot.ref);
        setImgUrl(downloadURL);
      }
    );
  };

  /* ************************************************************************************************************************/

  // When form is submitted, the validated data gets send to the server
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name) {
      setNameErrorMsg("This field is required");
      return;
    } else if (!latitude) {
      setLatitudeErrorMsg("This field is required");
      return;
    } else if (!longitude) {
      setLongitudeErrorMsg("This field is required");
      return;
    }

    if (nameErrorMsg || latitudeErrorMsg || longitudeErrorMsg || descriptionErrorMsg || imageErrorMsg) {
      return;
    }

    const newCrag: Omit<Crag, "id"> = {
      name: name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      description: description,
      img_url: imgUrl,
    };
    postCragMutation.mutate(newCrag);
  };

  // During this whole process show loading animation to user.
  // Form validation on frontend or backend or both?
  // Send response back to client
  // Invalidate query on client to refetch new data
  // Display success message.
  // Change input of type file. Add a delet option.
  // Display map placeholder
  // New, more simplistic style for map
  // New marker

  return (
    <div className={classes.container}>
      <div className={classes.popup}>
        <span className={classes.closeBtn} onClick={() => setAddCragPopupOpen(false)}>
          X
        </span>
        <h2>Add new crag</h2>
        <p>You can't find the crag you're looking for or discovered a new one? Create a new entry here!</p>
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Name"
            placeholder="Name of crag"
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            errorMessage={nameErrorMsg}
          />
          <div ref={mapContainer} className={classes.mapContainer} />
          <div className={classes.coordinates}>
            <FormInput
              label="Latitude"
              type="text"
              id="latitude"
              value={latitude}
              onChange={handleLatitudeChange}
              onBlur={handleLatitudeFocusOut}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  // map.current!.flyTo({ center: [parseFloat(longitude), parseFloat(latitude)] });
                }
              }}
              errorMessage={latitudeErrorMsg}
            />
            <FormInput
              label="Longitude"
              type="text"
              id="longitude"
              value={longitude}
              onChange={handleLongitudeChange}
              onBlur={handleLongitudeFocusOut}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  // map.current!.flyTo({ center: [parseFloat(longitude), parseFloat(latitude)] });
                }
              }}
              errorMessage={longitudeErrorMsg}
            />
          </div>
          <FormTextarea
            label="Description (optional)"
            id="description"
            placeholder="What kind of rock? What kind of climbing? How to get to there? ..."
            onChange={handleDescriptionChange}
            value={description}
            errorMessage={descriptionErrorMsg}
          />
          <FormInput
            label="Upload an image (optional)"
            type="file"
            id="image"
            onChange={handleFileChange}
            errorMessage={imageErrorMsg}
          />
          <span className={classes.progressBar}>{progress ? `${progress} %` : ""}</span>
          <button disabled={postCragMutation.isLoading} type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCragPopup;
