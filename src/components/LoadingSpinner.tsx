import { ColorRing } from 'react-loader-spinner';

function LoadingSpinner() {
  return <ColorRing visible={true} height="5rem" width="5rem" ariaLabel="color-ring-loading" wrapperStyle={{}} wrapperClass="color-ring-wrapper" colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']} />;
}

export default LoadingSpinner;
