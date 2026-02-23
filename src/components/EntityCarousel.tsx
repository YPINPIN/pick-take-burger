import { Swiper } from 'swiper/react';
import { SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

import { Link } from 'react-router';

import type { ReactNode } from 'react';

/**
 * ValidKeyOf<T>
 * ------------------------------
 * 從 T 中篩選出值為 string | number 的 key
 * - string | number → 保留值
 * - 其他型別 → 變成 never
 *
 * 最後透過 [keyof T] 取所有 value → 形成 union（值 never 會被排除）
 *
 * 例子：
 * - type ProductData = { id: number; title: string; meta: object }
 * - ValidKeyOf<ProductData> -> "id" | "title"
 *
 * 用途：強制 itemKey 只能用合法 React key
 */
type ValidKeyOf<T> = {
  [K in keyof T]: T[K] extends string | number ? K : never;
}[keyof T];

type EntityCarouselProps<T> = {
  /** ----- Carousel 設定 ----- */
  /** 要輪播的資料 */
  items: T[];
  /** 必填，且必須是 string | number 型別欄位 */
  itemKey: ValidKeyOf<T>;
  /** 渲染每個 item 的函式 */
  renderItem: (item: T, index: number) => ReactNode;

  /** 載入中顯示 placeholder 狀態，預設 false */
  isLoading?: boolean;
  /** 標題，可選 */
  title?: string;
  /** 查看更多連結，可選 */
  showMoreLink?: string;

  /** ----- Swiper 預設設定 ----- */
  /** 一次顯示幾個 slide，預設 4 */
  slidesPerView?: number;
  /** slide 之間的間距，預設 24 */
  spaceBetween?: number;
  /** 是否自動播放 ，預設 false */
  autoplay?: boolean;
  /** 是否 loop，預設 false */
  loop?: boolean;
  /** RWD 斷點設定，可覆蓋預設 */
  breakpoints?: {
    [width: number]: {
      slidesPerView: number;
    };
  };
  /** 是否顯示 navigation，預設 false */
  navigation?: boolean;
  /** 是否顯示 pagination，預設 false */
  pagination?: boolean;
};

function EntityCarousel<T>({ items, itemKey, renderItem, isLoading = false, title, showMoreLink, slidesPerView = 4, spaceBetween = 24, autoplay = false, loop = false, navigation = false, pagination = false, breakpoints }: EntityCarouselProps<T>) {
  return (
    <section>
      {(title || showMoreLink) && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          {title && <h3 className="fs-4 fw-bold text-dark">{title}</h3>}

          {showMoreLink && (
            <Link to={showMoreLink} className="fs-6 fw-semibold text-primary">
              查看更多
              <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="d-flex gap-3">
          {[...Array(slidesPerView)].map((_, i) => (
            <div key={i} className="placeholder-glow w-100">
              <div className="placeholder rounded-4 w-100" style={{ height: '280px' }} />
            </div>
          ))}
        </div>
      ) : (
        <Swiper
          className="entity-carousel"
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={slidesPerView}
          spaceBetween={spaceBetween}
          autoplay={
            autoplay
              ? {
                  delay: 3000, // 毫秒
                  disableOnInteraction: false, // 設定 false 鼠標滑動後會繼續自動播放
                  pauseOnMouseEnter: true, // 鼠標移入暫停
                }
              : false
          }
          // 根據 breakpoints 條件啟用 loop
          loop={false}
          breakpoints={
            breakpoints ?? {
              0: { slidesPerView: 1 },
              576: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              992: { slidesPerView },
            }
          }
          onBreakpoint={(swiper) => {
            // 取得當前生效 slidesPerView
            const currentSlidesPerView = Number(swiper.params.slidesPerView);
            // 設定 loop
            swiper.params.loop = loop && items.length > currentSlidesPerView;
            swiper.update(); // 更新 Swiper
          }}
          navigation={navigation}
          pagination={pagination ? { clickable: true } : false}
        >
          {items.map((item, index) => (
            <SwiperSlide key={item[itemKey] as React.Key}>{renderItem(item, index)}</SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}

export default EntityCarousel;
