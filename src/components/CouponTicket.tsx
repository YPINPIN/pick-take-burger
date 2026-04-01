import { useMemo } from 'react';
import { motion } from 'motion/react';

import type { CouponData } from '@/types/coupon';

import useCopy from '@/hooks/useCopy';

import { getCouponTheme, getCouponStyle, getCouponStatus } from '@/utils/coupon';
import { formatCouponDueDate } from '@/utils/date';

type CouponTicketProps = {
  coupon: CouponData;
};

function CouponTicket({ coupon }: CouponTicketProps) {
  const { copied, handleCopy } = useCopy();

  const status = useMemo(() => getCouponStatus(coupon.due_date), [coupon.due_date]);
  const isExpired = status === 'expired';
  const theme = isExpired ? 'coupon-gray' : getCouponTheme(coupon.percent);
  const couponStyle = getCouponStyle(theme);
  const discountDisplay = (coupon.percent / 10).toString();

  return (
    <motion.div
      className="d-flex align-items-stretch rounded-3 bg-white h-100 overflow-hidden"
      style={{
        border: '1px solid #e8e0d0',
        opacity: isExpired ? 0.65 : 1,
        cursor: isExpired ? 'not-allowed' : 'auto',
      }}
      whileHover={
        !isExpired
          ? {
              y: -3,
              scale: 1.01,
              boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
            }
          : undefined
      }
      transition={{ duration: 0.15 }}
    >
      {/* 左側折扣 */}
      <div
        className="p-2 d-flex flex-column align-items-center justify-content-center flex-shrink-0 gap-1"
        style={{
          background: couponStyle.bg,
          minWidth: 75,
        }}
      >
        <span
          className="fs-3 lh-1 fw-bold"
          style={{
            color: couponStyle.text,
          }}
        >
          {discountDisplay}
        </span>

        <span
          className="fs-7 opacity-75"
          style={{
            color: couponStyle.text,
          }}
        >
          折
        </span>
      </div>

      {/* 中間資訊 */}
      <div
        className="px-3 py-2 flex-grow-1 d-flex flex-column justify-content-center gap-1"
        style={{
          minWidth: 0,
        }}
      >
        <div className="fs-7 fw-bold text-truncate">{coupon.title}</div>
        <div className="d-flex align-items-center flex-wrap gap-1">
          <span
            className="font-monospace"
            style={{
              fontSize: 11,
              background: couponStyle.badgeBg,
              color: couponStyle.badgeText,
              border: `1px solid ${couponStyle.badgeBorder}`,
              borderRadius: 4,
              padding: '2px 8px',
            }}
          >
            {coupon.code}
          </span>

          {status === 'expiring_soon' && (
            <span
              style={{
                fontSize: 10,
                background: 'var(--bs-warning-bg-subtle)',
                color: 'var(--bs-warning-text-emphasis)',
                borderRadius: 4,
                padding: '2px 6px',
                fontWeight: 500,
              }}
            >
              即將到期
            </span>
          )}

          {status === 'expired' && (
            <span
              style={{
                fontSize: 10,
                background: 'var(--bs-danger-bg-subtle)',
                color: 'var(--bs-danger-text-emphasis)',
                borderRadius: 4,
                padding: '2px 6px',
                fontWeight: 500,
              }}
            >
              已過期
            </span>
          )}
        </div>

        <div
          className="text-gray-600"
          style={{
            fontSize: 11,
          }}
        >
          期限 {formatCouponDueDate(coupon.due_date)}
        </div>
      </div>

      {/* 分隔線 */}
      <div
        style={{
          width: 0,
          borderLeft: '1.5px dashed #e0d8cc',
          flexShrink: 0,
        }}
      />

      {/* 右側按鈕 */}
      <div className="d-flex align-items-center flex-shrink-0" style={{ padding: '0 10px' }}>
        <button
          className={`btn btn-${theme} px-1 py-2 text-white text-center fw-semibold border-0 rounded-2 text-nowrap`}
          onClick={() => handleCopy(coupon.code)}
          disabled={isExpired || copied}
          style={{
            fontSize: 12,
            minWidth: 45,
          }}
        >
          {copied ? '已複製' : '複製'}
        </button>
      </div>
    </motion.div>
  );
}

export default CouponTicket;
