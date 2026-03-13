import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import FormBuilder from './pages/FormBuilder';
import PublicForm from './pages/PublicForm';
import Responses from './pages/Responses';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/builder" element={<FormBuilder />} />
          <Route path="/builder/:id" element={<FormBuilder />} />
          <Route path="/form/:id" element={<PublicForm />} />
          <Route path="/responses/:id" element={<Responses />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
