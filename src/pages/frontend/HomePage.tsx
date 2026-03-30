import { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

import type { ApiError } from '@/types/error';
import type { ProductData } from '@/types/product';

import useToast from '@/hooks/useToast';
import useCart from '@/hooks/useCart';

import { apiClientGetAllProducts } from '@/api/client.product';

import VideoBanner from '@/components/VideoBanner';
import CtaBgText from '@/components/CtaBgText';
import EntityCarousel from '@/components/EntityCarousel';
import ProductCarouselCard from '@/components/ProductCarouselCard';

function HomePage() {
  const features = [
    { title: '手作漢堡', subTitle: '現打肉排 X 新鮮食材', imageUrl: 'https://res.cloudinary.com/ddqh0enf7/image/upload/c_fit,f_auto,h_756,q_auto,w_1344/v1774605270/burger-shop/banner/banner-back.png' },
    { title: '開胃炸物', subTitle: '酥脆薯條與炸物', imageUrl: 'https://res.cloudinary.com/ddqh0enf7/image/upload/c_fit,f_auto,h_756,q_auto,w_1344/v1774604969/burger-shop/banner/banner-2.png' },
    { title: '快速外送', subTitle: '熱騰騰直送到你手中', imageUrl: 'https://res.cloudinary.com/ddqh0enf7/image/upload/c_fit,f_auto,h_756,q_auto,w_1344/v1774605263/burger-shop/banner/banner-background-2.jpeg' },
  ];

  const orderSteps = [
    {
      title: '1. 加入購物車',
      subTitle: '挑選喜歡的餐點加入購物車',
      icon: 'bi bi-cart-plus-fill ',
    },
    {
      title: '2. 填寫訂購資訊',
      subTitle: '輸入訂購資訊與外送地址',
      icon: 'bi bi-pencil-square',
    },
    {
      title: '3. 付款完成',
      subTitle: '快速完成付款流程',
      icon: 'bi bi-wallet-fill',
    },
    {
      title: '4. 等待製作/外送',
      subTitle: '等待餐點新鮮製作並送達',
      icon: 'bi bi-fire',
    },
  ];

  const { toastError } = useToast();
  const { addCartItem } = useCart();
  const navigate = useNavigate();

  // 主廚推薦產品
  const [list, setList] = useState<ProductData[]>([]);
  const [isListLoading, setIsListLoading] = useState<boolean>(false);

  const handleClick = () => {
    navigate('/menu');
  };

  // 輪播項目 render
  const renderCarouselItem = useCallback((product: ProductData) => <ProductCarouselCard product={product} onAddToCart={addCartItem} />, [addCartItem]);

  // 初始化資料
  useEffect(() => {
    const fetchAllProducts = async () => {
      setIsListLoading(true);
      try {
        const data = await apiClientGetAllProducts();
        // 取出主廚推薦的產品
        const list = data.products.filter((p) => p.is_recommend === 1);
        setList(list);
      } catch (error) {
        const err = error as ApiError;
        toastError(err.message);
      } finally {
        setIsListLoading(false);
      }
    };

    // 取得所有產品（for list 推薦列表）
    fetchAllProducts();
  }, [toastError]);

  return (
    <div className="overflow-hidden">
      <VideoBanner />

      {/* 品牌特色 */}
      <section className="py-5 py-md-7 text-center">
        <div className="container-lg">
          <h2 className="h1 fw-bold mb-3 mb-md-5">好吃的秘密，就在這裡</h2>
          <div className="row row-cols-1 row-cols-md-3 g-4 mb-3 mb-md-5">
            {features.map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15, duration: 0.2 }}>
                <div className="position-relative rounded overflow-hidden shadow-sm" style={{ height: '250px' }}>
                  {/* 背景圖片 */}
                  <img src={item.imageUrl} alt={item.title} className="w-100 h-100 object-fit-cover" />
                  {/* 半透明文字層 */}
                  <div
                    className="position-absolute top-50 start-50 translate-middle text-white text-center p-3"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      borderRadius: '8px',
                      minWidth: '80%',
                    }}
                  >
                    <h3 className="text-accent mb-1">{item.title}</h3>
                    <p className="fs-6">{item.subTitle}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-3 pb-5 pt-md-4 pb-md-7 bg-accent text-center position-relative overflow-hidden">
        {/*  背景文字跑馬燈（雙層） */}
        <CtaBgText />
        <div className="container-lg position-relative">
          <motion.div initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <img src="https://res.cloudinary.com/ddqh0enf7/image/upload/c_fit,f_auto,h_756,q_auto,w_1344/v1774630578/burger-shop/banner/logo.png" alt="logo image" className="banner-logo" />
          </motion.div>

          <motion.h2 initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }} className="display-3 fw-bold">
            現做漢堡，經典美味
          </motion.h2>

          <motion.p initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.5 }} className="lead mt-2">
            手工肉排 X 酥脆炸物，每口都是滿足
          </motion.p>

          <motion.button className="btn btn-dark btn-lg fs-3 fw-bold px-7 mt-4" initial={{ opacity: 0 }} whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.1 } }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.1 }} onClick={handleClick}>
            探索菜單
          </motion.button>
        </div>
      </section>

      {/* 推薦列表 */}
      <section className="py-5 py-md-7 text-center">
        <div className="container-lg">
          <h2 className="h1 fw-bold mb-3 mb-md-5">不容錯過的人氣餐點</h2>
          <div className="mb-3 mb-md-5">
            <EntityCarousel items={list} itemKey="id" renderItem={renderCarouselItem} isLoading={isListLoading} autoplay={true} loop={true} navigation={true} />
          </div>
        </div>
      </section>

      {/* 訂購流程 */}
      <section
        className="py-5 py-md-7 position-relative text-white text-center"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/ddqh0enf7/image/upload/c_fit,f_auto,h_756,q_auto,w_1344/v1774605263/burger-shop/banner/banner-background.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* overlay */}
        <div
          className="position-absolute top-0 start-0 end-0 bottom-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))',
          }}
        />

        <div className="container-lg position-relative">
          <h2 className="h1 fw-bold mb-3 mb-md-5">輕鬆點餐，只要四步驟</h2>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4 mb-3 mb-md-5">
            {orderSteps.map((step, index) => (
              <motion.div key={step.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15, duration: 0.2 }}>
                <div className="card p-4 border-0 shadow-sm h-100 ">
                  <div className="mb-2">
                    <i className={`${step.icon} display-5 text-accent`}></i>
                  </div>
                  <h5 className="fw-bold mb-1">{step.title}</h5>
                  <p className="text-muted">{step.subTitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
