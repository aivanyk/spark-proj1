import React, { useState, useEffect } from 'react';
import './index.css';
import axios from 'axios';

const MAX_FILES = 10;
let uploadCnt = 0;

// interface LoadingImage {
//   thumbnailURL: 'https://via.placeholder.com/200';
//   Filename: string;
//   Text_caption: 'Still processing';
// }

const ImageGallery = () => {
  // const [images, setImages] = useState(mockImages);
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fetchImages = async () => {
    try {
      const response = await axios.get('/images'); 
      let toShow = response.data;
      console.log(`${uploadCnt} toShow: ${toShow}`);
      const loadCnt = Math.max(0, uploadCnt);
      for (let i = 1; i <= loadCnt; i++) {
        toShow.push({
          thumbnailURL: `https://via.placeholder.com/200`,
          Filename: `Unknown`,
          Text_caption: `Still processing`
        });
      }
      console.log(toShow);
      setImages(toShow); 
    } catch (error) {
      console.error('Error fetching images', error);
    }
  };

  const handleFileSelect = (event) => {
    if (event.target.files.length > MAX_FILES) {
      alert(`You can only upload up to ${MAX_FILES} files.`);
      // Clear the selected files
      event.target.value = '';
    } else {
      setSelectedFiles(Array.from(event.target.files));
    }
  };
  
  const handleFileUpload = async () => {
    uploadCnt = 0;
    if (selectedFiles && selectedFiles.length > 0) {
      const formData = new FormData();
      selectedFiles.forEach((file, index) => {
        // console.log(file);
        formData.append('filename', file);
        uploadCnt += 1;
      });
      
      console.log("111");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
  
      try {
        await axios.post('/upload', formData, {
          // headers: {
          //   'Content-Type': 'multipart/form-data',
          // },
        });
        fetchImages();
      } catch (error) {
        console.error('Error uploading files', error);
      }
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div>
      <h1>Aivanyk's Photo App</h1>
      <div>
        <input type="file" name="filename" multiple onChange={handleFileSelect} />
        <button onClick={handleFileUpload}>Upload</button>
        <div>
          <h3>Selected Files:</h3>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name}</li> // Display each file name
            ))}
          </ul>
        </div>
      </div>
      <h1> </h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {images.map((image, index) => (
          <div key={index} style={{
              margin: '20px',
              border: '2px solid black', 
              borderRadius: '8px',        
              padding: '10px',            
              display: 'flex',           
              flexDirection: 'column',  
              alignItems: 'center',      
              justifyContent: 'center'   
          }}>
              <img src={image.thumbnailURL} alt={image.Filename} style={{ 
                  maxWidth: '200px', 
                  maxHeight: '200px',
                  width: 'auto',          
                  height: 'auto'          
              }} />
              <p>{image.Filename}</p>
              <p>{image.Text_caption}</p>
          </div>
      ))}
      </div>
    </div>
  );
};

export default ImageGallery;


// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

