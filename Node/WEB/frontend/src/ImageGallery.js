import React, { useState, useEffect } from 'react';
import './index.css';
import axios from 'axios';

const mockImages = [
    {
      url: 'https://via.placeholder.com/150',
      description: 'Image 1 Description'
    },
    {
      url: 'https://via.placeholder.com/150',
      description: 'Image 2 Description'
    },
    {
      url: 'https://via.placeholder.com/150',
      description: 'Image 3 Description'
    },
    {
      url: 'https://via.placeholder.com/150',
      description: 'Image 4 Description'
    },
    {
      url: 'https://via.placeholder.com/150',
      description: 'Image 5 Description'
    },
  ];

const ImageGallery = () => {
  console.log("heyheyhey");
  // const [images, setImages] = useState(mockImages);
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchImages = async () => {
    try {
      const response = await axios.get('/images'); 
      setImages(response.data); 
    } catch (error) {
      console.error('Error fetching images', error);
    }
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        await axios.post('/upload', formData); 
        fetchImages(); 
      } catch (error) {
        console.error('Error uploading file', error);
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
        <input type="file" onChange={handleFileSelect} />
        <button onClick={handleFileUpload}>Upload</button>
      </div>
      <h1> </h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {images.map((image, index) => (
          <div key={index}>
            <img src={image.url} alt={image.description} style={{ width: '150px', height: '150px' }} />
            <p>{image.description}</p>
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

