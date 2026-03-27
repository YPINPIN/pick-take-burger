function CtaBgText() {
  const base = 'Pick & Take Burger • ';
  const content = base.repeat(10);

  return (
    <div className="cta-bg-text">
      <div className="rotate-wrap">
        {/* 上層：往左 */}
        <div className="layer layer-1">
          <div className="marquee-track">
            <span>{content}</span>
            <span aria-hidden="true">{content}</span>
          </div>
        </div>
        {/* 下層：往右（反向） */}
        <div className="layer layer-2">
          <div className="marquee-track">
            <span>{content}</span>
            <span aria-hidden="true">{content}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CtaBgText;
