import React, { useRef, useState } from 'react';

const CameraCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageURL, setImageURL] = useState(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }, // Front camera
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      alert("Camera permission denied or not supported.");
    }
  };

  const takePicture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL('image/png');
      setImageURL(dataURL);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Camera Capture</h2>

      <div style={styles.buttonGroup}>
        <button onClick={startCamera} style={{ ...styles.button, ...styles.blue }}>
          Open Camera
        </button>
        <button onClick={takePicture} style={{ ...styles.button, ...styles.green }}>
          Capture Photo
        </button>
      </div>

      <video ref={videoRef} autoPlay style={styles.video} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {imageURL && (
        <div style={styles.result}>
          <h4>Captured Image:</h4>
          <img src={imageURL} alt="Captured" style={styles.image} />
          <a href={imageURL} download="captured-image.png" style={styles.link}>
            Download Image
          </a>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    border: '1px solid #ccc',
    padding: '20px',
    maxWidth: '400px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
  },
  button: {
    padding: '8px 12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#fff',
    borderRadius: '4px',
  },
  blue: {
    backgroundColor: '#007bff',
  },
  green: {
    backgroundColor: '#28a745',
  },
  video: {
    width: '300px',
    height: '225px',
    border: '1px solid #000',
    marginTop: '10px',
  },
  result: {
    marginTop: '20px',
  },
  image: {
    width: '300px',
    border: '1px solid #333',
    display: 'block',
    marginBottom: '10px',
  },
  link: {
    color: '#007bff',
    textDecoration: 'underline',
    fontSize: '14px',
  },
};

export default CameraCapture;
