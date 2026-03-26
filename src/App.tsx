import ToastContainer from '@/components/ToastContainer';
// router
import { createHashRouter, RouterProvider } from 'react-router';
import routes from './routes';
const router = createHashRouter(routes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      {/* Toast container */}
      <ToastContainer />
    </>
  );
}

export default App;
