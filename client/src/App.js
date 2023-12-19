import React, { useEffect, useState } from "react";
import Table from "./components/Table";

function App() {
  const [file, setFile] = useState(null);
  const [backendData, setBackEndData] = useState([{}]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const [fileUploaded, setFileUploaded] = useState(false);
  const handleUpload = async () => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    setUploading(false);
    setFileUploaded(true);
    // Fetch the updated data from the /api endpoint
    fetch("/api")
      .then((response) => response.json())
      .then((data) => {
        setBackEndData(data);
      });
  };


  return (
    <div>
      {uploading ? (
        <p>Uploading...</p>
      ) : (
        <>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload</button>
          {backendData.length === 0 ? (
            <p>No data...</p>
          ) : (
            <Table data={backendData} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
