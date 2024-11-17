import React, { useState, useEffect } from 'react';
import Loading from './Loading';

function LoadingWrapper({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Adjust timing as needed

  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return children;
}

export default LoadingWrapper; 