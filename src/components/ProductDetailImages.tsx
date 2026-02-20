// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade, Thumbs } from 'swiper/modules';
// Import Swiper Types
import type { Swiper as SwiperType } from 'swiper/types';
// Import Swiper styles
import 'swiper/swiper-bundle.css';

import { useState } from 'react';

type ProductDetailImagesProps = {
  imagesUrl: string[];
};

function ProductDetailImages({ imagesUrl }: ProductDetailImagesProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <div>
      <Swiper className="main-swiper" slidesPerView={1} modules={[Navigation, EffectFade, Thumbs]} navigation={true} effect="fade" fadeEffect={{ crossFade: true }} thumbs={{ swiper: thumbsSwiper }}>
        {imagesUrl.map((imageUrl) => (
          <SwiperSlide key={`main-${imageUrl}`}>
            <img src={imageUrl} alt={`產品圖-${imageUrl}`} />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper className="sub-swiper" slidesPerView={5} spaceBetween={8} allowTouchMove={false} modules={[Thumbs]} watchSlidesProgress={true} onSwiper={(swiper) => setThumbsSwiper(swiper)}>
        {imagesUrl.map((imageUrl) => (
          <SwiperSlide key={`sub-${imageUrl}`}>
            <img src={imageUrl} alt={`產品縮圖-${imageUrl}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ProductDetailImages;
