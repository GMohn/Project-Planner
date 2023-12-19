import React, { useEffect, useState } from "react";

function App() {
 const [file, setFile] = useState(null);
 const [backendData, setBackEndData] = useState([{}]);
 const [uploading, setUploading] = useState(false);

 const handleFileChange = (e) => {
   setFile(e.target.files[0]);
 };

 const handleUpload = async () => {
   setUploading(true);
   const formData = new FormData();
   formData.append("file", file);

   const response = await fetch("/api/upload", {
     method: "POST",
     body: formData,
   });
   const data = await response.json();
   console.log(data);
   setUploading(false);
 };

 useEffect(() => {
   fetch("/api")
     .then((response) => response.json())
     .then((data) => {
       setBackEndData(data);
     });
 }, []);

 return (
   <div>
     {uploading ? (
       <p>Uploading...</p>
     ) : (
       <>
         <input type="file" onChange={handleFileChange} />
         <button onClick={handleUpload}>Upload</button>
         {typeof backendData.users === "undefined" ? (
           <p>Loading...</p>
         ) : (
           backendData.users.map((user, i) => <p key={i}>{user}</p>)
         )}
       </>
     )}
   </div>
 );
}

export default App;
