// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Draggable from 'react-draggable';
import ReactPlayer from 'react-player'; // Import React Player
import OverlayControl from './components/OverlayControl';
import './App.css';

const App = () => {
  const [streamUrl, setStreamUrl] = useState(''); // Use HTTP stream URL
  const [overlays, setOverlays] = useState([]);
  const [newOverlay, setNewOverlay] = useState({ text: '', x: 0, y: 0, file: null });
  const [selectedOverlay, setSelectedOverlay] = useState(null); // For editing
  const [playing, setPlaying] = useState(false); // State to track playback
  const [volume, setVolume] = useState(0.5); // State for volume control

  useEffect(() => {
    // Fetch existing overlays from the backend
    axios.get('http://localhost:5000/overlay')
      .then(response => {
        setOverlays(response.data);
      })
      .catch(error => console.error('Error fetching overlays:', error));
  }, []);

  const handleAddOverlay = () => {
    const formData = new FormData();
    formData.append('text', newOverlay.text);
    formData.append('x', newOverlay.x);
    formData.append('y', newOverlay.y);
    if (newOverlay.file) {
      formData.append('file', newOverlay.file);
    }

    axios.post('http://localhost:5000/overlay', formData)
      .then(response => {
        setOverlays([...overlays, response.data.overlay]);
        setNewOverlay({ text: '', x: 0, y: 0, file: null });
      })
      .catch(error => console.error('Error adding overlay:', error));
  };

  const handleUpdateOverlay = (id, updatedOverlay) => {
    axios.put(`http://localhost:5000/overlay/${id}`, updatedOverlay)
      .then(response => {
        setOverlays(overlays.map(overlay => (overlay._id === id ? response.data.overlay : overlay)));
      })
      .catch(error => console.error('Error updating overlay:', error));
  };

  const handleOverlayDelete = (id) => {
    axios.delete(`http://localhost:5000/overlay/${id}`)
      .then(() => {
        setOverlays(overlays.filter(overlay => overlay._id !== id));
      })
      .catch(error => console.error('Error deleting overlay:', error));
  };

  const handleSelectOverlay = (overlay) => {
    setNewOverlay({ text: overlay.text, x: overlay.x, y: overlay.y, file: null });
    setSelectedOverlay(overlay);
  };

  return (
    <div className="App">
      <h1>Livestream App</h1>
      <div className="url-input">
        <input
          type="text"
          placeholder="Enter HTTP Stream URL"
          value={streamUrl}
          onChange={(e) => setStreamUrl(e.target.value)}
        />
      </div>
      <div className="livestream-container">
        {streamUrl && (
          <>
            <div className="player-wrapper">
              <ReactPlayer
                url={streamUrl}
                controls={false} // Disable default controls to use custom buttons
                playing={playing}
                volume={volume}
                width="800px" // Adjust width as needed
                height="450px" // Adjust height as needed
              />
            </div>
            <div className="controls">
              <button onClick={() => setPlaying(true)}>Play</button>
              <button onClick={() => setPlaying(false)}>Pause</button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
              />
            </div>
          </>
        )}
        {overlays.map((overlay) => (
          <Draggable
            key={overlay._id}
            defaultPosition={{ x: overlay.x, y: overlay.y }}
            onStop={() => {
              handleUpdateOverlay(overlay._id, { ...overlay, x: overlay.x, y: overlay.y });
            }}
          >
            <div className="overlay" onClick={() => handleSelectOverlay(overlay)}>
              {overlay.file ? (
                <img src={URL.createObjectURL(overlay.file)} alt={overlay.text} width="100" />
              ) : (
                overlay.text
              )}
              <button onClick={() => handleOverlayDelete(overlay._id)}>X</button>
            </div>
          </Draggable>
        ))}
      </div>
      <OverlayControl
        newOverlay={newOverlay}
        setNewOverlay={setNewOverlay}
        handleAddOverlay={handleAddOverlay}
        handleUpdateOverlay={handleUpdateOverlay}
        selectedOverlay={selectedOverlay}
        setSelectedOverlay={setSelectedOverlay}
      />
    </div>
  );
};

export default App;
