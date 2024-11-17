import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

function Loading() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f6fa',
      zIndex: 9999
    }}>
      <CircularProgress style={{
        color: 'green',
        height: '60px',
        width: '60px'
      }} />
    </div>
  );
}

export default Loading; 