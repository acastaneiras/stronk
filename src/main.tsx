import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from '@/components/ui/sonner';
import '@/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router-dom";
import router from './router/router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class"
      defaultTheme="system"
      enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  </StrictMode>,
)