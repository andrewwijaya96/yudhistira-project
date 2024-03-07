"use client";

import { useState } from "react";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { AiFillFilePdf } from "react-icons/ai";
import { storage } from "../../firebase/firebase-config";
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
    <main className=" flex flex-col items-center bg-stone-700 h-screen">
      <div className="w-6/12 align-center justify-center my-8 border bg-stone-400 border-black px-[120px] py-[75px] rounded shadow-md shadow-black">
        <h1 className="text-center text-2xl my-2 font-bold">Upload File</h1>
        <div className="form-bok justify-center bg-white w-full">
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
        <section className="uploaded-row align-baseline">
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
        <div className="file-uploader-form flex flex-col">
          <label htmlFor="sopName">SOP Name</label>
          <input
            type="text"
            onChange={handleFileNameChange}
            name="sopName"
            id="sopName"
            placeholder="Enter file name"
            className="p-1 rounded mr-0 w-full"
            required
          />
        </div>
        <div className="file-uploader-form flex flex-col">
          <label htmlFor="sopVer">SOP Version</label>
          <input
            type="text"
            onChange={handleFileVersionChange}
            placeholder="Version name"
            name="sopVer"
            id="sopVer"
            className="p-1 rounded mr-0 w-full"
            required
          />
        </div>
        <div className="flex justify-center">
          <button
            className="mt-8 py-3 px-5 bg-sky-600 text-white rounded duration-300 hover:bg-sky-500 hover:shadow-lg"
            onClick={upload}
          >
            Upload
          </button>
        </div>
      </div>
    </main>
  );
}
