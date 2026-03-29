import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

function VideoBanner() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/menu');
  };

  return (
    <section className="position-relative text-white text-center">
      {/* video banner */}
      <video autoPlay muted loop playsInline className="video-banner w-100 object-fit-cover">
        <source src="https://res.cloudinary.com/ddqh0enf7/video/upload/v1774549021/Hero_Video_Banner_i9f03a.mp4" type="video/mp4" />
      </video>

      {/* overlay */}
      <div
        className="position-absolute top-0 start-0 end-0 bottom-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))',
        }}
      />

      {/* content */}
      <div className="position-absolute w-100 top-50 start-50 translate-middle">
        <motion.h1 initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="display-3 fw-bold">
          手作美味，即刻送達
        </motion.h1>

        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="lead mt-1">
          新鮮漢堡與經典美式小食
        </motion.p>

        <motion.button className="btn btn-accent btn-lg fs-3 fw-bold px-7 my-3" initial={{ opacity: 0 }} whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.1 } }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.1 }} onClick={handleClick}>
          立即訂購
        </motion.button>
      </div>

      {/* scroll hint */}
      <motion.div
        className="position-absolute start-50 translate-middle-x d-none d-sm-block"
        style={{ bottom: '12px', pointerEvents: 'none' }} // 不可點擊
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <div className="d-flex flex-column align-items-center">
          <span className="small" style={{ letterSpacing: '2px' }}>
            SCROLL
          </span>

          <motion.div className="d-flex flex-column align-items-center" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <i className="bi bi-chevron-double-down"></i>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default VideoBanner;
