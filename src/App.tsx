import React from 'react';
import AppShell from './components/AppShell';
import StoreDemo from './components/StoreDemo';

const App: React.FC = () => {
  return (
    <AppShell>
      <StoreDemo />
    </AppShell>
  );
};

export default App;
