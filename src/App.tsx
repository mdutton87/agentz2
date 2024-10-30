import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Agents from './pages/Agents';
import Flows from './pages/Flows';
import Knowledge from './pages/Knowledge';
import Models from './pages/Models';
import { Brain, GitBranch, Database, Box } from 'lucide-react';

function App() {
  const navItems = [
    { path: '/', icon: Brain, label: 'Agents' },
    { path: '/flows', icon: GitBranch, label: 'Flows' },
    { path: '/knowledge', icon: Database, label: 'Knowledge' },
    { path: '/models', icon: Box, label: 'Models' },
  ];

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50">
        <Sidebar items={navItems} />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Agents />} />
            <Route path="/flows" element={<Flows />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/models" element={<Models />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;