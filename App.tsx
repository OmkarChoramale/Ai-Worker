import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import AiToolShell from './components/tools/AiToolShell';

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen w-full bg-brand-background text-brand-text flex flex-col">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tool/:id" element={<AiToolShell />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
