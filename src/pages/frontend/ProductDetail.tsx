import { useParams } from 'react-router';

function ProductDetail() {
  const { productId } = useParams();
  console.log('productId', productId);

  return (
    <div className="container-lg">
      <h1>ProductDetail page</h1>
      <p>productId: {productId}</p>
    </div>
  );
}

export default ProductDetail;
