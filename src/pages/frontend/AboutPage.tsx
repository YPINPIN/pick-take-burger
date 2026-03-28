import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

import CtaBgText from '@/components/CtaBgText';

const sections = [
  {
    title: '品牌的誕生',
    text: `在忙碌的生活節奏中，我們相信，美味不只是填飽肚子，更是一種片刻的享受。Pick & Take Burger 因此誕生，將經典美式漢堡與外送便利結合，讓每一位顧客無論身處家中、辦公室，或與朋友聚會時，都能輕鬆享受到高品質的手作美味。`,
    image: 'https://res.cloudinary.com/ddqh0enf7/image/upload/c_fit,f_auto,h_756,q_auto,w_1344/v1774604970/burger-shop/banner/banner-1.png',
  },
  {
    title: '美味值得被認真對待',
    text: `從每日新鮮準備的食材，到每一塊現打肉排與層層堆疊的配料，我們堅持每一份餐點都保有最純粹的風味。我們不只是製作漢堡，更是在打造一份讓人期待的用餐體驗。`,
    image: 'https://res.cloudinary.com/ddqh0enf7/image/upload/c_fit,f_auto,h_756,q_auto,w_1344/v1774604962/burger-shop/banner/banner-3.jpeg',
  },
  {
    title: '外送，也能保有溫度',
    text: `我們深信，美味不應因為外送而妥協。從包裝設計到配送流程，都只為了讓你收到餐點的那一刻，依然能感受到剛出爐的香氣與溫度。`,
    image: 'https://res.cloudinary.com/ddqh0enf7/image/upload/c_fit,f_auto,h_756,q_auto,w_1344/v1774604962/burger-shop/banner/banner-4.jpeg',
  },
  {
    title: 'Pick & Take 不只是名字',
    text: `「Pick」代表精選與堅持，「Take」象徵即刻享用與分享。這不只是品牌名稱，更是我們想傳遞的生活態度：在忙碌日常中，選擇一份值得期待的美味，把片刻的幸福帶進生活裡。`,
    image: 'https://res.cloudinary.com/ddqh0enf7/image/upload/c_fit,f_auto,h_756,q_auto,w_1344/v1774604969/burger-shop/banner/banner-2.png',
  },
];

function AboutPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/menu');
  };

  return (
    <div>
      {/* Hero */}
      <section
        className="py-5 py-md-7 position-relative text-white text-center d-flex align-items-center"
        style={{
          minHeight: '50vh',
          backgroundImage: `url('https://res.cloudinary.com/ddqh0enf7/image/upload/c_fit,f_auto,h_756,q_auto,w_1344/v1774605263/burger-shop/banner/banner-background-3.jpeg')`,
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
          <motion.h1 initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="display-3 fw-bold">
            每一口，都來自對美味的堅持
          </motion.h1>

          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="lead mt-4">
            Pick & Take Burger 專注於手作美式漢堡與經典小食
          </motion.p>
        </div>
      </section>

      {/* Sections */}
      {sections.map((section, index) => {
        const isReverse = index % 2 !== 0;
        return (
          <section key={index} className="py-4 py-md-6 text-center text-md-start">
            <div className="container-lg">
              <div className={`row align-items-center g-4 ${isReverse ? 'flex-md-row-reverse' : ''}`}>
                <motion.div className="col-md-6" initial={{ opacity: 0, x: isReverse ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                  <img src={section.image} alt={section.title} className="img-fluid w-100 object-fit-cover rounded shadow-sm" style={{ height: '300px' }} />
                </motion.div>

                <motion.div className="col-md-6" initial={{ opacity: 0, x: isReverse ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                  <h2 className="h1 fw-bold mb-3 mb-md-4">{section.title}</h2>
                  <p className="fs-5 lh-lg text-muted">{section.text}</p>
                </motion.div>
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="py-5 py-md-7 bg-accent text-center position-relative overflow-hidden">
        {/*  背景文字跑馬燈（雙層） */}
        <CtaBgText />
        <div className="container-lg position-relative">
          <motion.h2 initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="display-3 fw-bold">
            讓今天，從一份好漢堡開始
          </motion.h2>

          <motion.button className="btn btn-dark btn-lg fs-3 fw-bold px-7 mt-4" initial={{ opacity: 0 }} whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.1 } }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.1 }} onClick={handleClick}>
            立即點餐
          </motion.button>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
