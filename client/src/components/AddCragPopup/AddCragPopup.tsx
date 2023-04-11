import classes from "./AddCragPopup.module.scss";
import React, { useState, useRef, useEffect, FormEvent } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import markerImage from "../../assets/marker.png";
import FormInput from "../FormInput/FormInput";
import { getDownloadUrl, uploadToFirebaseStorage } from "../../utils/firebase.utils";

const mapboxToken = import.meta.env.VITE_APP_MAPBOX_TOKEN;

const AddCragPopup = () => {
  const [name, setName] = useState<string>("");
  const [latitude, setLatitude] = useState(38.181548);
  const [longitude, setLongitude] = useState(21.472858);
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File>();

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
      minZoom: 3,
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
      setLatitude(parseFloat(map.current!.getCenter().lat.toFixed(6)));
      setLongitude(parseFloat(map.current!.getCenter().lng.toFixed(6)));
    });
  }, [mapContainer.current]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    } else {
      return;
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) return;
    const uploadTask = uploadToFirebaseStorage(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Display progress to user
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        // Display error to user
        console.log(error);
      },
      async () => {
        const downloadURL = await getDownloadUrl(uploadTask.snapshot.ref);
        // Save downloadURL in db
      }
    );
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
            onChange={(e) => setName(e.target.value)}
          />
          <div ref={mapContainer} className={classes.mapContainer} />
          <div className={classes.coordinates}>
            <FormInput
              label="Latitude"
              type="number"
              id="latitude"
              value={latitude}
              onChange={(e) => setLatitude(parseFloat(e.target.value))}
              onBlur={(e) => map.current!.flyTo({ center: [longitude, parseFloat(e.target.value)] })}
            />
            <FormInput
              label="Longitude"
              type="number"
              id="longitude"
              value={longitude}
              onChange={(e) => setLongitude(parseFloat(e.target.value))}
              onBlur={(e) => map.current!.flyTo({ center: [parseFloat(e.target.value), latitude] })}
            />
          </div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="What kind of rock? What kind of climbing? How to get to it? ..."
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <FormInput label="Upload an image" type="file" id="image" onChange={handleFileInputChange} />
          <button type="submit">Submit</button>
        </form>
        <span></span>
      </div>
    </div>
  );
};

export default AddCragPopup;
