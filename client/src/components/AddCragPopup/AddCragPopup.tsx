import classes from "./AddCragPopup.module.scss";
import { useState, useRef, useEffect, FormEvent } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import markerImage from "../../assets/marker.png";
import FormInput from "../FormInput/FormInput";
import { getDownloadUrl, uploadToFirebaseStorage } from "../../utils/firebase.utils";

const mapboxToken = import.meta.env.VITE_APP_MAPBOX_TOKEN;

const AddCragPopup = () => {
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("38.181548");
  const [longitude, setLongitude] = useState("21.472858");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File>();

  const [nameErrorMsg, setNameErrorMsg] = useState("");
  const [latitudeErrorMsg, setLatitudeErrorMsg] = useState("");
  const [longitudeErrorMsg, setLongitudeErrorMsg] = useState("");
  const [descriptionErrorMsg, setDescriptionErrorMsg] = useState("");
  const [imageErrorMsg, setImageErrorMsg] = useState("");

  // Get reference to the HTML-Element that will contain the map
  const mapContainer = useRef<HTMLDivElement | null>(null);

  // Define a ref that will store the map
  const map = useRef<Map | null>();

  // Paint the map as soon as the HTML element reference is available
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
    });
  }, [mapContainer.current]);

  const validateUserInput = () => {
    let userInput: "valid" | "invalid" = "valid";
    const nameRegex = /^[A-Za-z ]{3,20}$/;
    const latitudeRegex = /^-?(?:90(?:\.0+)?|[1-8]?\d(?:\.\d+)?|\d+\.)$/;
    const longitudeRegex = /^-?(?:180(?:\.0+)?|\d{1,2}(?:\.\d+)?|1[0-7]\d(?:\.\d+)?|\d+\.)$/;

    if (!name) {
      setNameErrorMsg("This field is required");
      userInput = "invalid";
    } else if (!nameRegex.test(name)) {
      setNameErrorMsg("Name should be 3 - 20 characters and not contain any special characters");
      userInput = "invalid";
    }

    if (!latitude) {
      setLatitudeErrorMsg("This field is required");
      userInput = "invalid";
    } else if (!latitudeRegex.test(latitude)) {
      setLatitudeErrorMsg("Accepted value range: [-90, 90]");
      userInput = "invalid";
    }

    if (!longitude) {
      setLongitudeErrorMsg("This field is required");
      userInput = "invalid";
    } else if (!longitudeRegex.test(longitude)) {
      setLongitudeErrorMsg("Accepted value range: [-180, 180]");
      userInput = "invalid";
    }

    if (description && (description.length <= 25 || description.length >= 1000)) {
      setDescriptionErrorMsg("Description should be between 25 and 1000 characters");
      userInput = "invalid";
    }

    if (image && !image.type.startsWith("image/")) {
      setImageErrorMsg("Invalid File type");
      userInput = "invalid";
    } else if (image && image.size > 7000000) {
      setImageErrorMsg("Max. file size is 7 MB");
      userInput = "invalid";
    }

    return userInput;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userInput = validateUserInput();

    console.log(userInput);

    if (userInput === "invalid") return;

    // userInput is valid
    // If user attached an image, upload to Firebase Storage
    if (image) {
      const uploadTask = uploadToFirebaseStorage(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Display progress to user
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          // Display error to user (try it out)
          console.log(error);
          setImageErrorMsg(`An error occured: ${error}`);
          return;
        },
        async () => {
          const downloadURL = await getDownloadUrl(uploadTask.snapshot.ref);
          // downloadURL is available, start query to server
        }
      );
    } else {
      // Start query to server
    }

    // Include closeBtn on Popup
    // Limit upload file size, check for file type and give corresponding errors
    // Check user input and show error messages below inputs
    // If no errors, make Post request to server/post-new-crag
    // (do this after image downloadUrl has been retrieved)
    // Otherwise you would have to do two queries.
    // No optimistic update here, as form should be displayed until really successfull.
    // body: name, lat, lng, desc, img
    // During this whole process show loading animation to user.
    // Form validation on frontend or backend or both?
    // On server: Push data to database
    // Send response back to client
    // Invalidate query on client to refetch new data
    // Display success message.
  };

  return (
    <div className={classes.container}>
      <div className={classes.popup}>
        <h2>Add new crag</h2>
        <p>You can't find the crag you're looking for or discovered a new one? Create a new entry here!</p>
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Name"
            placeholder="Name of crag"
            type="text"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameErrorMsg("");
            }}
            errorMessage={nameErrorMsg}
          />
          <div ref={mapContainer} className={classes.mapContainer} />
          <div className={classes.coordinates}>
            <FormInput
              label="Latitude"
              type="text"
              id="latitude"
              value={latitude}
              onChange={(e) => {
                setLatitude(e.target.value);
                setLatitudeErrorMsg("");
              }}
              onBlur={() => map.current!.flyTo({ center: [parseFloat(longitude), parseFloat(latitude)] })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  map.current!.flyTo({ center: [parseFloat(longitude), parseFloat(latitude)] });
                }
              }}
              errorMessage={latitudeErrorMsg}
            />
            <FormInput
              label="Longitude"
              type="text"
              id="longitude"
              value={longitude}
              onChange={(e) => {
                setLongitude(e.target.value);
                setLongitudeErrorMsg("");
              }}
              onBlur={() => map.current!.flyTo({ center: [parseFloat(longitude), parseFloat(latitude)] })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  map.current!.flyTo({ center: [parseFloat(longitude), parseFloat(latitude)] });
                }
              }}
              errorMessage={longitudeErrorMsg}
            />
          </div>
          <label htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            placeholder="What kind of rock? What kind of climbing? How to get to there? ..."
            onChange={(e) => {
              setDescription(e.target.value);
              setDescriptionErrorMsg("");
            }}
            value={description}
          />
          <FormInput
            label="Upload an image (optional)"
            type="file"
            id="image"
            onChange={(e) => {
              setImage(e.target.files?.[0]);
              setImageErrorMsg("");
            }}
            errorMessage={imageErrorMsg}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddCragPopup;
