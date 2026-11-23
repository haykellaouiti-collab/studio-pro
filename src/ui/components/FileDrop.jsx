import React from 'react';
export default function FileDrop({ multiple = false, onFiles }) {
  return <input type="file" accept="video/*" multiple={multiple} onChange={(e) => onFiles(Array.from(e.target.files || []))} />;
}
