import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CheckInOutWebcam = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [checkInImage, setCheckInImage] = useState(null);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutImage, setCheckOutImage] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [activeSide, setActiveSide] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Start camera
  const startCamera = async (side) => {
    if ((side === 'in' && checkInImage) || (side === 'out' && checkOutImage)) {
      alert(`You've already taken the ${side === 'in' ? 'check-in' : 'check-out'} photo!`);
      return;
    }

    setActiveSide(side);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1920 },
          height: { ideal: 1920 },
          facingMode: 'user' 
        },
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      alert("Camera permission denied or not supported.");
      setActiveSide(null);
    }
  };

  // Capture photo
  const takePicture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const size = Math.min(video.videoWidth, video.videoHeight);
      canvas.width = size;
      canvas.height = size;
      
      const context = canvas.getContext('2d');
      context.beginPath();
      context.arc(size/2, size/2, size/2, 0, Math.PI * 2);
      context.closePath();
      context.clip();
      
      const offsetX = (video.videoWidth - size) / 2;
      const offsetY = (video.videoHeight - size) / 2;
      context.drawImage(video, -offsetX, -offsetY, video.videoWidth, video.videoHeight);
      
      const dataURL = canvas.toDataURL('image/png');
      
      if (activeSide === 'in') {
        setCheckInImage(dataURL);
        setCheckInTime(new Date());
      } else {
        setCheckOutImage(dataURL);
        setCheckOutTime(new Date());
      }
      
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      setActiveSide(null);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-0" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      {/* Header */}
      <div className="bg-dark text-white p-3 text-center shadow-sm">
        <h4 className="mb-0">
          <i className="bi bi-clock-history me-2"></i>
          {currentDateTime.toLocaleDateString()} - {currentDateTime.toLocaleTimeString()}
        </h4>
      </div>

      {/* Large Circular Camera View */}
      {activeSide && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-dark bg-opacity-75 z-3">
          <div className="position-relative" style={{ width: '90vmin', height: '90vmin', maxWidth: '600px', maxHeight: '600px' }}>
            <div className="rounded-circle overflow-hidden position-absolute w-100 h-100 border-5 border-white shadow-lg">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline
                className="h-100 w-100 object-fit-cover" 
                style={{ transform: 'scaleX(-1)' }}
              />
            </div>
            
            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4" style={{ width: '100%' }}>
              <div className="d-flex justify-content-center gap-3">
                <button 
                  onClick={takePicture} 
                  className="btn btn-success btn-lg rounded-pill px-4 py-2 shadow-sm"
                  style={{ minWidth: '140px' }}
                >
                  <i className="bi bi-camera-fill me-2"></i> Capture
                </button>
                <button 
                  onClick={() => {
                    if (videoRef.current?.srcObject) {
                      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
                    }
                    setActiveSide(null);
                  }} 
                  className="btn btn-danger btn-lg rounded-pill px-4 py-2 shadow-sm"
                  style={{ minWidth: '140px' }}
                >
                  <i className="bi bi-x-lg me-2"></i> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Two circles section */}
      <div className="row flex-grow-1 m-0 g-0">
        {/* Check-In Circle */}
        <div className="col-md-6 d-flex flex-column align-items-center justify-content-center p-4 position-relative">
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-white opacity-25"></div>
          <div className="position-relative z-1 text-center">
            <h2 className="text-primary mb-4 fw-bold">
              <i className="bi bi-box-arrow-in-down-right me-2"></i>
              CHECK IN
            </h2>
            
            <div 
              className="rounded-circle border-5 border-primary d-flex align-items-center justify-content-center overflow-hidden shadow-lg"
              style={{ 
                width: '350px', 
                height: '350px',
                cursor: !checkInImage ? 'pointer' : 'default',
                background: checkInImage ? 'none' : 'rgba(13, 110, 253, 0.1)'
              }}
              onClick={() => !checkInImage && startCamera('in')}
            >
              {checkInImage ? (
                <img 
                  src={checkInImage} 
                  alt="Check-In" 
                  className="img-fluid h-100 w-100 object-fit-cover"
                />
              ) : (
                <div className="text-center">
                  <i className="bi bi-camera text-primary" style={{ fontSize: '3rem' }}></i>
                  <p className="text-primary mt-3 fs-5 fw-bold">Tap to Open Camera</p>
                </div>
              )}
            </div>
            
            {checkInTime && (
              <div className="mt-4 p-3 bg-white rounded-3 shadow-sm">
                <p className="mb-1 text-muted">Checked In At:</p>
                <p className="fw-bold text-dark">{checkInTime.toLocaleTimeString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Check-Out Circle */}
        <div className="col-md-6 d-flex flex-column align-items-center justify-content-center p-4 position-relative">
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-white opacity-25"></div>
          <div className="position-relative z-1 text-center">
            <h2 className="text-danger mb-4 fw-bold">
              <i className="bi bi-box-arrow-right me-2"></i>
              CHECK OUT
            </h2>
            
            <div 
              className="rounded-circle border-5 border-danger d-flex align-items-center justify-content-center overflow-hidden shadow-lg"
              style={{ 
                width: '350px', 
                height: '350px',
                cursor: !checkOutImage ? 'pointer' : 'default',
                background: checkOutImage ? 'none' : 'rgba(220, 53, 69, 0.1)'
              }}
              onClick={() => !checkOutImage && startCamera('out')}
            >
              {checkOutImage ? (
                <img 
                  src={checkOutImage} 
                  alt="Check-Out" 
                  className="img-fluid h-100 w-100 object-fit-cover"
                />
              ) : (
                <div className="text-center">
                  <i className="bi bi-camera text-danger" style={{ fontSize: '3rem' }}></i>
                  <p className="text-danger mt-3 fs-5 fw-bold">Tap to Open Camera</p>
                </div>
              )}
            </div>
            
            {checkOutTime && (
              <div className="mt-4 p-3 bg-white rounded-3 shadow-sm">
                <p className="mb-1 text-muted">Checked Out At:</p>
                <p className="fw-bold text-dark">{checkOutTime.toLocaleTimeString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInOutWebcam;