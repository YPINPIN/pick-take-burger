import { ToastContainer, Bounce } from 'react-toastify';
import AdminDashboard from '@/pages/admin/AdminDashboard';

function App() {
  return (
    <>
      {/* Admin Dashboard */}
      <AdminDashboard />
      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover theme="colored" transition={Bounce} />
    </>
  );
}

export default App;
