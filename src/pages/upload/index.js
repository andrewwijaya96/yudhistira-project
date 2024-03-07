"use client";

import { useState } from "react";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { AiFillFilePdf } from "react-icons/ai";
import { storage } from "../firebase/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

export default function Uploader() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No selected file");
  const [fileVersion, setFileVersion] = useState("1.1.0");

  const handleFileChange = (files) => {
    if (files && files[0]) {
      const selectedFile = files[0];
      if (selectedFile.size > 3 * 1024 * 1024) {
        // File size exceeds 3MB limit
        alert("File size exceeds 3MB limit.");
        return;
      }
      if (selectedFile.type !== "application/pdf") {
        // Invalid file type
        alert("Only PDF files are allowed.");
        return;
      }
      setFileName(selectedFile.name);
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileChange(files);
  };

  const handleFileVersionChange = (e) => {
    setFileVersion(e.target.value);
  };

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const upload = async () => {
    console.log(file);
    if (file !== null) {
      const fileref = ref(
        storage,
        `sop/${fileName}_${fileVersion}_${v4()}.pdf`
      );
      const metadata = {
        customMetadata: {
          sopName: fileName,
          version: fileVersion,
        },
      };
      uploadBytes(fileref, file, metadata).then((data) => {
        getDownloadURL(data.ref).then((ur) => {
          console.log("url", ur);
        });
      });
    }
    alert("SOP Uploaded");
  };

  return (
    <main>
      <div className="form-bok">
        <form
          action=""
          onClick={() => document.querySelector(".input-field").click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="application/pdf"
            className="input-field"
            hidden
            onChange={({ target: { files } }) => handleFileChange(files)}
          />

          {file ? (
            <AiFillFilePdf color="#1475cf" size={60} />
          ) : (
            <>
              <MdCloudUpload color="#1475cf" size={60} />
              <p>Browse File to upload</p>
            </>
          )}
        </form>
      </div>
      <section className="uploaded-row">
        <AiFillFilePdf color="#1475cf" />
        <span className="upload-content">
          {fileName} -
          <MdDelete
            onClick={() => {
              setFileName("No selected file");
              setFile(null);
            }}
          />
        </span>
      </section>
      <div className="file-uploader-form">
        <input
          type="text"
          onChange={handleFileNameChange}
          placeholder="Enter file name"
          required
        />
      </div>
      <div className="file-uploader-form">
        <input
          type="text"
          onChange={handleFileVersionChange}
          placeholder="version name"
          required
        />
      </div>
      <button onClick={upload}>Upload</button>
    </main>
  );
}
