import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from './features/auth/AuthForm';
import { MyClasses } from './features/classes/MyClasses';
import { GroupWorkspace } from './features/workspace/GroupWorkspace';
import { ClassOverview } from './features/teacher/ClassOverview';
import { RequireAuth } from './components/layout/RequireAuth';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<AuthForm />} />
      <Route path="/signup" element={<AuthForm />} />
      
      <Route path="/classes" element={<RequireAuth><MyClasses /></RequireAuth>} />
      <Route path="/classes/:id/overview" element={<RequireAuth><ClassOverview /></RequireAuth>} />
      <Route path="/classes/:id/group/:groupId" element={<RequireAuth><GroupWorkspace /></RequireAuth>} />
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
