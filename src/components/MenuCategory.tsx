import { PRODUCT_CATEGORY_META } from '@/utils/product';

type MenuCategoryProps = {
  categories: string[];
  selectedCategory: string;
  handleCategoryClick: (category: string) => void;
};

function MenuCategory({ categories, selectedCategory, handleCategoryClick }: MenuCategoryProps) {
  return (
    <aside className="menu-category mb-3 mb-sm-0">
      <h3 className="text-gray-600 fs-5 fw-bold mb-3">
        <i className="bi bi-tags-fill me-2"></i>
        分類
      </h3>
      <div className="menu-category-list list-group">
        <button type="button" className={`list-group-item list-group-item-action ${selectedCategory === '' ? 'active' : ''}`} onClick={() => handleCategoryClick('')}>
          <i className={`${PRODUCT_CATEGORY_META.find((meta) => meta.category === '')?.iconClass}`}></i>
          所有餐點
        </button>
        {categories.map((category) => (
          <button type="button" key={category} className={`list-group-item list-group-item-action ${selectedCategory === category ? 'active' : ''}`} onClick={() => handleCategoryClick(category)}>
            <i className={`${PRODUCT_CATEGORY_META.find((meta) => meta.category === category)?.iconClass}`}></i>
            {category}
          </button>
        ))}
      </div>
    </aside>
  );
}

export default MenuCategory;
