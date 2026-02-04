import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Modal } from 'bootstrap';

import type { ChangeEvent } from 'react';
import type { ProductData, ProductTag, CreateProductData } from '@/types/product';
import type { AdminProductModalType, AdminProductModalHandle, AdminProductModalProps } from '@/types/modal';
import type { ApiError } from '@/types/error';

import { isValidUrl } from '@/utils/url';
import { trimProduct, validateProduct, PRODUCT_TAG_META } from '@/utils/product';
import { validateFile } from '@/utils/upload';

import { apiAdminCreateProduct, apiAdminUpdateProduct } from '@/api/admin.product';
import { apiAdminUploadImage } from '@/api/admin.upload';

import AdminProductModalImages from '@/components/modals/AdminProductModalImages';

// 圖片上限
const IMAGE_MAX_NUM = 5;
// 初始資料
const createInitProductData = (): ProductData => ({
  id: '',
  title: '',
  category: '',
  origin_price: 0,
  price: 0,
  unit: '',
  description: '',
  content: '',
  is_enabled: 0,
  imageUrl: '',
  imagesUrl: [],
  num: 0,
  tag: 'normal',
  is_recommend: 0,
});

const AdminProductModal = forwardRef<AdminProductModalHandle, AdminProductModalProps>(function AdminProductModal({ onSuccess }, ref) {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  // Modal
  const modalRef = useRef<HTMLDivElement | null>(null);
  const bsModal = useRef<Modal | null>(null); // 存 Bootstrap Modal instance
  // Modal 類型 (新增 or 編輯)
  const [modalType, setModalType] = useState<AdminProductModalType>('create');

  // 產品資料
  const [tempProduct, setTempProduct] = useState<ProductData>(createInitProductData);
  // 圖片網址輸入框
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  // 圖片上傳檔案
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // 初始化 Modal
  useEffect(() => {
    if (modalRef.current) {
      bsModal.current = new Modal(modalRef.current);
    }

    return () => {
      bsModal.current?.dispose();
    };
  }, []);

  // 重置上傳檔案輸入框
  const handleResetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setImageFile(undefined);
  };

  const open = useCallback((product: ProductData | null = null) => {
    setImageUrlInput('');
    handleResetFileInput();
    // 設定 Modal 類型
    if (!product) {
      product = createInitProductData();
      setModalType('create');
    } else {
      setModalType('edit');
    }

    // 設定暫存圖片資料
    const imagesUrl = [product.imageUrl, ...(product.imagesUrl ?? [])].filter(Boolean);
    setTempProduct({
      ...product,
      imagesUrl,
      tag: product.tag ?? 'normal', // 預設為 normal
      is_recommend: product.is_recommend ?? 0, // 預設為 0
    });

    bsModal.current?.show();
  }, []);

  const close = useCallback(() => {
    // 解決 Modal Focus 錯誤
    (document.activeElement as HTMLElement)?.blur();
    bsModal.current?.hide();
  }, []);

  // 將 open、close 方法傳出
  useImperativeHandle(
    ref,
    () => ({
      open,
      close,
    }),
    [open, close],
  );

  // 處理 input 變更
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const { name, value, type } = target;
    setTempProduct((prevProduct) => ({
      ...prevProduct,
      [name]: type === 'checkbox' ? ((target as HTMLInputElement).checked ? 1 : 0) : type === 'number' ? (value === '' ? 0 : Number(value)) : value,
    }));
  };

  // 處理下拉選單(tag)變更
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value as ProductTag;
    setTempProduct((prevProduct) => ({
      ...prevProduct,
      tag: value,
    }));
  };

  // 處理圖片 input 變更
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImageUrlInput(e.currentTarget.value);
  };

  // 處理圖片新增
  const handleImageAdd = () => {
    const url = imageUrlInput.trim();
    if (!url) return;

    if (tempProduct.imagesUrl.length >= IMAGE_MAX_NUM) {
      toast.error(`最多只能上傳 ${IMAGE_MAX_NUM} 張圖片`);
      return;
    }

    if (!isValidUrl(url)) {
      toast.error('請輸入有效的圖片 URL 格式 (需包含 http:// 或 https://)');
      return;
    }

    if (tempProduct.imagesUrl.includes(url)) {
      toast.error('圖片已存在');
      return;
    }

    setTempProduct((prevProduct) => ({
      ...prevProduct,
      imagesUrl: [...prevProduct.imagesUrl, url],
    }));

    setImageUrlInput('');
  };

  // 處理圖片刪除
  const handleImageDelete = (index: number) => {
    setTempProduct((prevProduct) => ({
      ...prevProduct,
      imagesUrl: prevProduct.imagesUrl.filter((_, i) => i !== index),
    }));
  };

  // 處理圖片上傳檔案變更
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];

    // 檔案未選擇
    if (!file) {
      handleResetFileInput();
      return;
    }

    // 驗證檔案
    const error = validateFile(file);
    if (error) {
      handleResetFileInput();
      toast.error(error);
      return;
    }

    setImageFile(file);
  };

  // 處理圖片上傳
  const handleImageUpload = async () => {
    if (!imageFile) return;
    setIsUploading(true);
    try {
      // 圖片資料
      const formData = new FormData();
      formData.append('file-to-upload', imageFile);

      const data = await apiAdminUploadImage(formData);
      setTempProduct((prevProduct) => ({
        ...prevProduct,
        imagesUrl: [...prevProduct.imagesUrl, data.imageUrl],
      }));
      toast.success('圖片已上傳');
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.message);
    } finally {
      handleResetFileInput();
      setIsUploading(false);
    }
  };

  // 執行產品新增或更新
  const executeProductMutation = async (apiFn: () => Promise<{ success: boolean; message: string }>) => {
    setIsUpdating(true);
    try {
      const data = await apiFn();
      toast.success(data.message);
      // 關閉 Modal
      close();
      // 通知父層刪除成功
      onSuccess();
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // 新增產品
  const handleCreateProduct = (productData: CreateProductData) => executeProductMutation(() => apiAdminCreateProduct(productData));

  // 編輯產品
  const handleUpdateProduct = (id: string, productData: CreateProductData) => executeProductMutation(() => apiAdminUpdateProduct({ id, data: productData }));

  // 提交產品資料
  const handleSubmitProduct = () => {
    // 針對輸入資料做 trim
    const trimmedProduct = trimProduct(tempProduct);
    // 驗證資料
    const error = validateProduct(trimmedProduct);
    if (error) {
      toast.error(error);
      return;
    }

    // 取出 ID 、圖片資料與其他產品資料
    const { id, imagesUrl, ...data } = trimmedProduct;
    // 分離主圖與附圖
    const [mainImageUrl, ...subImages] = imagesUrl;
    // 組合最終產品資料
    const productData = {
      ...data,
      imageUrl: mainImageUrl ?? '',
      imagesUrl: subImages,
    };

    if (modalType === 'create') {
      handleCreateProduct(productData);
    } else {
      handleUpdateProduct(id, productData);
    }
  };

  return (
    <div ref={modalRef} className="modal fade" id="productModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel">
      <div className="modal-custom-xl modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h3 className="modal-title fs-5 fw-bold" id="staticBackdropLabel">
              <i className="bi bi-pencil-square me-2"></i>
              {modalType === 'create' ? '新增' : '編輯'}產品
            </h3>
            <button type="button" className="btn-close btn-close-white" onClick={close} disabled={isUpdating || isUploading}></button>
          </div>
          <div className="modal-body">
            <form className="text-primary">
              <fieldset disabled={isUpdating || isUploading}>
                <div className="row">
                  <div className="col-md-5 mb-3 mb-md-0">
                    <p className="fw-medium mb-2">產品圖片 (最多{IMAGE_MAX_NUM}張)</p>
                    {/* 圖片預覽 UI */}
                    <AdminProductModalImages imagesUrl={tempProduct.imagesUrl} maxImageNum={IMAGE_MAX_NUM} onImageDelete={handleImageDelete} />
                    <div className="mb-1">
                      <label htmlFor="imagesUrl" className="fw-medium fs-7 text-secondary mb-1">
                        圖片連結
                      </label>
                      <input type="text" id="imagesUrl" value={imageUrlInput} onChange={handleImageChange} className="form-control mb-2" placeholder="請輸入圖片網址..." disabled={tempProduct.imagesUrl.length >= IMAGE_MAX_NUM} />
                      <button type="button" onClick={handleImageAdd} className="btn btn-primary py-2 w-100" disabled={tempProduct.imagesUrl.length >= IMAGE_MAX_NUM}>
                        <i className="bi bi-plus-lg me-2"></i>
                        新增圖片
                      </button>
                    </div>
                    <div className="d-flex align-items-center gap-2 py-2">
                      <div className="flex-fill bg-gray-500" style={{ height: '1px' }}></div>
                      <span className="fs-7 fw-medium text-gray-500">或</span>
                      <div className="flex-fill bg-gray-500" style={{ height: '1px' }}></div>
                    </div>
                    <div>
                      <label htmlFor="fileUpload" className="fw-medium fs-7 text-secondary mb-1">
                        從電腦上傳
                      </label>
                      <input ref={fileInputRef} type="file" id="fileUpload" onChange={handleFileChange} className="form-control  mb-2" accept="image/jpeg,image/png" disabled={tempProduct.imagesUrl.length >= IMAGE_MAX_NUM} />
                      <button type="button" onClick={handleImageUpload} className="btn btn-primary py-2 w-100" disabled={!imageFile || tempProduct.imagesUrl.length >= IMAGE_MAX_NUM}>
                        {isUploading ? <span className="spinner-border spinner-border-sm me-2" role="status"></span> : <i className="bi bi-upload me-2"></i>}
                        {isUploading ? '上傳中...' : '上傳圖片'}
                      </button>
                      <div className="form-text text-gray-500">請注意，僅限使用 jpg、jpeg 與 png 格式，檔案大小限制為 3MB 以下。</div>
                    </div>
                  </div>
                  <div className="col-md-7">
                    <div className="row g-2">
                      <div className="col-12">
                        <label htmlFor="title" className="fw-medium mb-2">
                          產品名稱
                        </label>
                        <input type="text" id="title" name="title" value={tempProduct.title} onChange={handleInputChange} className="form-control mb-2" placeholder="請輸入產品名稱..." />
                      </div>
                      <div className="col-12 col-sm-6">
                        <label htmlFor="category" className="fw-medium mb-2">
                          分類
                        </label>
                        <input type="text" id="category" name="category" value={tempProduct.category} onChange={handleInputChange} className="form-control mb-2" placeholder="請輸入分類..." />
                      </div>
                      <div className="col-12 col-sm-6">
                        <label htmlFor="unit" className="fw-medium mb-2">
                          單位
                        </label>
                        <input type="text" id="unit" name="unit" value={tempProduct.unit} onChange={handleInputChange} className="form-control mb-2" placeholder="請輸入單位..." />
                      </div>
                      <div className="col-12 col-sm-6">
                        <label htmlFor="origin_price" className="fw-medium mb-2">
                          原價
                        </label>
                        <input type="number" min={0} id="origin_price" name="origin_price" value={tempProduct.origin_price} onChange={handleInputChange} className="form-control mb-2" placeholder="請輸入原價..." />
                      </div>
                      <div className="col-12 col-sm-6">
                        <label htmlFor="price" className="fw-medium mb-2">
                          售價
                        </label>
                        <input type="number" min={0} id="price" name="price" value={tempProduct.price} onChange={handleInputChange} className="form-control mb-2" placeholder="請輸入售價..." />
                      </div>
                      <div className="col-12">
                        <label htmlFor="tag" className="fw-medium mb-2">
                          產品標籤
                        </label>
                        <select id="tag" name="tag" value={tempProduct.tag} onChange={handleSelectChange} className="form-select mb-2">
                          {Object.entries(PRODUCT_TAG_META).map(([key, meta]) => (
                            <option key={key} value={key}>
                              {meta.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12">
                        <label htmlFor="description" className="fw-medium mb-2">
                          產品簡述
                        </label>
                        <textarea rows={3} id="description" name="description" value={tempProduct.description} onChange={handleInputChange} className="form-control mb-2" placeholder="請輸入產品簡述..." />
                      </div>
                      <div className="col-12">
                        <label htmlFor="content" className="fw-medium mb-2">
                          產品內容說明
                        </label>
                        <textarea rows={4} id="content" name="content" value={tempProduct.content} onChange={handleInputChange} className="form-control mb-2" placeholder="請輸入產品內容說明..." />
                      </div>
                      <div className="col-12">
                        <div className="form-check form-switch">
                          <input id="is_recommend" name="is_recommend" checked={Boolean(tempProduct.is_recommend)} onChange={handleInputChange} className="form-check-input" type="checkbox" role="switch" />
                          <label htmlFor="is_recommend" className="form-check-label fw-medium">
                            是否為推薦產品 (顯示在推薦區塊)
                          </label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-check form-switch">
                          <input id="is_enabled" name="is_enabled" checked={Boolean(tempProduct.is_enabled)} onChange={handleInputChange} className="form-check-input" type="checkbox" role="switch" />
                          <label htmlFor="is_enabled" className="form-check-label fw-medium">
                            上架狀態 (是否啟用)
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-gray-500 fw-medium px-5 py-2" onClick={close} disabled={isUpdating || isUploading}>
              取消
            </button>
            <button type="button" onClick={handleSubmitProduct} className="btn btn-accent text-gray-900 fw-bold px-5 py-2" disabled={isUpdating || isUploading}>
              {isUpdating ? (modalType === 'create' ? '新增中...' : '儲存中...') : `確認${modalType === 'create' ? '新增' : '儲存'}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AdminProductModal;
