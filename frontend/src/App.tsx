import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from './features/auth/AuthForm';
import { MyClasses } from './features/classes/MyClasses';
import { GroupWorkspace } from './features/workspace/GroupWorkspace';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<AuthForm />} />
      <Route path="/signup" element={<AuthForm />} />
      <Route path="/classes" element={<MyClasses />} />
      <Route path="/classes/:id/group/:groupId" element={<GroupWorkspace />} />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
