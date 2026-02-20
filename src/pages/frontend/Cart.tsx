import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import type { ApiError } from '@/types/error';
import type { CartInfo } from '@/types/cart';

import { apiClientGetCartInfo } from '@/api/client.cart';

function Cart() {
  const [cart, setCart] = useState<CartInfo | null>();

  useEffect(() => {
    const fetchCartInfo = async () => {
      try {
        const data = await apiClientGetCartInfo();
        setCart(data.data);
      } catch (error) {
        const err = error as ApiError;
        toast.error(err.message);
      }
    };

    fetchCartInfo();
  }, []);

  return (
    <div className="container-lg">
      <h1>Cart page</h1>
      {cart === null && <div>Loading...</div>}
      {cart && (
        <div>
          <h2>{cart.total}</h2>
          <h3>{cart.final_total}</h3>
          <div>{JSON.stringify(cart.carts)}</div>
        </div>
      )}
    </div>
  );
}

export default Cart;
