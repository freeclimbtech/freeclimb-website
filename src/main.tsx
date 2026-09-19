import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { WorkGrid } from '@/components/work-grid';

const root = document.getElementById('work-root');

if (root) {
  createRoot(root).render(
    <StrictMode>
      <WorkGrid />
    </StrictMode>
  );
}
