import ToastContainer from '@/components/ToastContainer';
import GlobalOverlay from '@/components/GlobalOverlay';
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
      {/* 全域遮罩 */}
      <GlobalOverlay />
    </>
  );
}

export default App;
