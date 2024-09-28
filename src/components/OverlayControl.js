// src/OverlayControl.js
import React, { useState } from 'react';

const OverlayControl = ({
  newOverlay,
  setNewOverlay,
  handleAddOverlay,
  handleUpdateOverlay,
  selectedOverlay,
  setSelectedOverlay,
}) => {
  const [overlayType, setOverlayType] = useState('text'); // Track the type of overlay

  const handleFileChange = (event) => {
    if (event.target.files.length) {
      setNewOverlay({ ...newOverlay, file: event.target.files[0] });
    }
  };

  const handlePositionChange = (event) => {
    setNewOverlay({ ...newOverlay, [event.target.name]: event.target.value });
  };

  const handleSubmit = () => {
    if (selectedOverlay) {
      handleUpdateOverlay(selectedOverlay._id, newOverlay);
      setSelectedOverlay(null); // Clear selection after updating
    } else {
      handleAddOverlay();
    }
    setNewOverlay({ text: '', x: 0, y: 0, file: null }); // Reset new overlay state
  };

  return (
    <div className="overlay-input">
      <select
        value={overlayType}
        onChange={(e) => setOverlayType(e.target.value)}
      >
        <option value="text">Text Overlay</option>
        <option value="logo">Logo Overlay</option>
      </select>
      {overlayType === 'text' ? (
        <>
          <input
            type="text"
            placeholder="Overlay Text"
            value={newOverlay.text}
            onChange={(e) => setNewOverlay({ ...newOverlay, text: e.target.value })}
          />
        </>
      ) : (
        <>
          <input type="file" onChange={handleFileChange} />
        </>
      )}
      <input
        type="number"
        name="x"
        placeholder="X Position"
        value={newOverlay.x}
        onChange={handlePositionChange}
      />
      <input
        type="number"
        name="y"
        placeholder="Y Position"
        value={newOverlay.y}
        onChange={handlePositionChange}
      />
      <button onClick={handleSubmit}>{selectedOverlay ? 'Update Overlay' : 'Add Overlay'}</button>
    </div>
  );
};

export default OverlayControl;
