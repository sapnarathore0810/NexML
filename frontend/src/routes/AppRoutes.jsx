import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Upload from '../pages/Upload';
import Preview from '../pages/Preview';
import TargetSelection from '../pages/TargetSelection';
import Training from '../pages/Training';
import Results from '../pages/Results';
import Predict from '../pages/Predict';
import About from '../pages/About';

function AppRoutes() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/preview/:filename" element={<Preview />} />
        <Route path="/target-selection" element={<TargetSelection />} />
        <Route path="/target-selection/:filename" element={<TargetSelection />} />
        <Route path="/training" element={<Training />} />
        <Route path="/training/:filename" element={<Training />} />
        <Route path="/train" element={<Navigate to="/training" replace />} />
        <Route path="/results" element={<Results />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default AppRoutes;