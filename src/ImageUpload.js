import React, { useState } from "react";
import "./ImageUpload.css";
import { Button } from "@mui/material";
import firebase from "firebase/compat/app";
import { storage, db } from "./firebase";
import axios from "./axios";

const ImageUpload = ({ user, username }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (user) {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // progress function ...
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (err) => {
          // Error function...
          console.log(err);
          alert(err.message);
        },
        () => {
          // complete function...
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              setUrl();

              axios.post("/upload", {
                caption: caption,
                user: username,
                image: url,
              });

              db.collection("posts").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption: caption,
                imageUrl: url,
                username: username ? username : user.multiFactor.user.email,
                avatarUrl: "",
              });

              setProgress(0);
              setCaption("");
              setImage(null);
            });
        }
      );
    } else {
      alert("Log in first");
    }
  };

  return (
    <div className="imageUpload">
      <div className="imageUpload_container">
        <progress className="imageUpload_progress" value={progress} max="100" />
        <input
          type="text"
          placeholder="Enter a caption..."
          onChange={(e) => setCaption(e.target.value)}
          value={caption}
        />
        <input type="file" onChange={handleChange} />
        <Button onClick={handleUpload}>Upload</Button>
      </div>
    </div>
  );
};

export default ImageUpload;
