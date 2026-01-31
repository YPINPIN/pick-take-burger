type AdminProductModalImagesProps = {
  imagesUrl: string[];
  maxImageNum: number;
  onImageDelete: (index: number) => void;
};

function AdminProductModalImages({ imagesUrl, maxImageNum, onImageDelete }: AdminProductModalImagesProps) {
  return (
    <div className="row g-2 mb-3">
      {imagesUrl.map((imageUrl, index) => {
        if (index === 0) {
          return (
            <div className="col-12" key={`${index}-${imageUrl}`}>
              <div className="ratio ratio-1x1 bg-light rounded-3 border border-2 border-dashed border-gray-500 d-flex justify-content-center align-items-center overflow-hidden">
                <img src={imageUrl} className="object-fit-cover" alt="產品主圖" />
                <button type="button" onClick={() => onImageDelete(index)} className="btn-delete-image btn btn-danger">
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>
          );
        } else {
          return (
            <div className="col-6 col-lg" key={`${index}-${imageUrl}`}>
              <div className="ratio ratio-1x1 bg-light rounded-3 border border-2 border-dashed border-gray-500 d-flex justify-content-center align-items-center overflow-hidden">
                <img src={imageUrl} className="object-fit-cover" alt={`產品附圖 ${index}`} />
                <button type="button" onClick={() => onImageDelete(index)} className="btn-delete-image btn btn-danger">
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>
          );
        }
      })}
      {Array(Math.max(0, maxImageNum - imagesUrl.length))
        .fill('')
        .map((_, index) => {
          const count = index + imagesUrl.length;
          if (count === 0) {
            return (
              <div className="col-12" key={count}>
                <div className="ratio ratio-1x1 bg-light rounded-3 border border-2 border-dashed border-gray-500 d-flex justify-content-center align-items-center overflow-hidden">
                  <div className="d-flex flex-column justify-content-center align-items-center text-gray-500">
                    <i className="bi bi-image fs-4 lh-sm"></i>
                    <span>主圖</span>
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div className="col-6 col-lg" key={count}>
                <div className="ratio ratio-1x1 bg-light rounded-3 border border-2 border-dashed border-gray-500 d-flex justify-content-center align-items-center overflow-hidden">
                  <div className="d-flex flex-column justify-content-center align-items-center text-gray-500">
                    <span>附圖 {count}</span>
                  </div>
                </div>
              </div>
            );
          }
        })}
    </div>
  );
}

export default AdminProductModalImages;
