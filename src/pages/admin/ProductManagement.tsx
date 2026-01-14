function ProductManagement() {
  const products = [
    {
      category: '室內觀葉',
      content: '5 寸盆，高度約 30–40cm，不含裝飾外盆。',
      description: '葉型圓潤柔和，能營造舒適放鬆的室內氛圍，適合新手栽培。',
      id: '-OgkUG31Zps0YJ2V6xm3',
      imageUrl: 'https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?auto=format&fit=crop&w=800&q=80',
      imagesUrl: ['https://images.unsplash.com/photo-1602573852058-ef7c665fcd92?auto=format&fit=crop&w=800&q=80'],
      is_enabled: 1,
      num: 1,
      origin_price: 420,
      price: 350,
      title: '蔓綠絨 (Philodendron)',
      unit: '盆',
    },
    {
      category: '室內觀葉2',
      content: '5 寸盆，高度約 30–40cm，不含裝飾外盆。',
      description: '葉型圓潤柔和，能營造舒適放鬆的室內氛圍，適合新手栽培。',
      id: '-OgkUG31Zps0YJ2V6xm3',
      imageUrl: 'https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?auto=format&fit=crop&w=800&q=80',
      imagesUrl: ['https://images.unsplash.com/photo-1602573852058-ef7c665fcd92?auto=format&fit=crop&w=800&q=80'],
      is_enabled: 1,
      num: 1,
      origin_price: 420,
      price: 350,
      title: '蔓綠絨 (Philodendron)',
      unit: '盆',
    },
  ];

  return (
    <section className="p-4 bg-white border border-dark rounded-4">
      <table className="table table-hover table-striped align-middle">
        <thead className="table-primary">
          <tr>
            <th scope="col">商品名稱</th>
            <th scope="col">分類</th>
            <th scope="col">原價</th>
            <th scope="col">售價</th>
            <th scope="col" className="text-center">
              啟用
            </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {products.map((product) => (
            <tr>
              <td>{product.title}</td>
              <td>{product.category}</td>
              <td>{product.origin_price}</td>
              <td>{product.price}</td>
              <td className="text-center">
                <div className="form-check form-switch d-flex justify-content-center align-items-center">
                  <input className="form-check-input" style={{ pointerEvents: 'none' }} type="checkbox" id="checkNativeSwitch" checked={Boolean(product.is_enabled)} readOnly={true} />
                </div>
              </td>
              <td className="text-nowrap">
                <button type="button" className="btn btn-sm btn-outline-primary rounded-3 me-2">
                  編輯
                </button>
                <button type="button" className="btn btn-sm btn-outline-danger rounded-3">
                  刪除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default ProductManagement;
