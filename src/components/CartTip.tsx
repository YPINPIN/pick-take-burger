type CartTipProps = {
  cartNum: number;
};

function CartTip({ cartNum }: CartTipProps) {
  if (cartNum <= 0) return null;

  return (
    <span className="position-absolute rounded-pill lh-base text-white text-center bg-danger" style={{ padding: '0 6px', minWidth: '22px', fontSize: '12px', top: '-12px', right: '-12px' }}>
      {cartNum}
    </span>
  );
}

export default CartTip;
