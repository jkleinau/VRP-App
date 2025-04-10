// frontend/src/components/StatusBar.tsx
import React from 'react';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import { keyframes } from '@emotion/react';

interface StatusBarProps {
  message: string;
}

// Simple fade-in animation for new messages
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const StatusBar: React.FC<StatusBarProps> = ({ message }) => {
  // Use a key based on the message to re-trigger animation on change
  return (
    <Sheet
      variant="outlined"
      sx={{
        p: 1,
        borderRadius: 'sm',
        minHeight: '40px', // Ensure consistent height
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography key={message} sx={{ animation: `${fadeIn} 0.5s ease-out` }}>
        {message}
      </Typography>
    </Sheet>
  );
};

export default StatusBar;