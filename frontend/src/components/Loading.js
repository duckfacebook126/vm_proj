import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loading = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="background.default"
    >
      <CircularProgress size={60} thickness={4} />
    </Box>
  );
};

export default Loading;

/**
 * @summary This is the Loading component which renders a circular progress bar.
 * @description The Loading component is used to display a circular progress bar while the data is being fetched.
 * The Loading component is a functional component.
 * @workflow
 * 1. The Loading component renders a circular progress bar.
 * 2. The Loading component is used in the Dashboard component to display a loading progress bar while the data is being fetched.
 * 3. The Loading component is used in the UserTable component to display a loading progress bar while the data is being fetched.
 * 4. The Loading component is used in the DiskTable component to display a loading progress bar while the data is being fetched.
 * 5. The Loading component is used in the VMTable component to display a loading progress bar while the data is being fetched.
 * @returns {JSX.Element} The Loading component returns a JSX element that renders a circular progress bar.
 */
