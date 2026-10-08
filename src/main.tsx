import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import './style.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Surface data mistakes while editing src/data during `npm run dev`.
if (import.meta.env.DEV) {
  import('./lib/validateData.ts').then(({ validateData, formatIssues }) => {
    const issues = validateData();
    if (issues.length) console.warn(`Data check found ${issues.length} issue(s):\n${formatIssues(issues)}`);
  });
}
