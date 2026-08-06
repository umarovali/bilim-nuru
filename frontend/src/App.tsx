import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import ProtectedRoute from './admin/ProtectedRoute';
import AdminCourses from './admin/AdminCourses';
import AdminBlogs from './admin/AdminBlogs';
import AdminTeachers from './admin/AdminTeachers';
import AdminReviews from './admin/AdminReviews';
import AdminContacts from './admin/AdminContacts';
import AdminBranches from './admin/AdminBranches';
import AdminAbout from './admin/AdminAbout';
import AdminSettings from './admin/AdminSettings';
import { LanguageProvider } from './context/LanguageContext';
import { BranchProvider } from './context/BranchContext';

export default function App() {
  return (
    <LanguageProvider>
      <BranchProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/admin/login" element={<AdminLogin />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="" element={<AdminCourses />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="teachers" element={<AdminTeachers />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="branches" element={<AdminBranches />} />
              <Route path="about" element={<AdminAbout />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </BranchProvider>
    </LanguageProvider>
  );
}
