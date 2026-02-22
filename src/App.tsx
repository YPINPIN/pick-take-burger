import { ToastContainer, Bounce } from 'react-toastify';
// router
import { createHashRouter, RouterProvider } from 'react-router';
import routes from './routes';
const router = createHashRouter(routes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover theme="colored" transition={Bounce} />
    </>
  );
}

export default App;
