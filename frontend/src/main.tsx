// frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// Removed QueryClientProvider from here as it's now inside App.tsx
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// const queryClient = new QueryClient(); // Moved inside App

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     {/* <QueryClientProvider client={queryClient}> // Moved inside App */}
        <App />
     {/* </QueryClientProvider> */}
  </React.StrictMode>,
);