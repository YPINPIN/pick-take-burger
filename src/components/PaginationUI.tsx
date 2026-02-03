import type { Dispatch, SetStateAction } from 'react';

type PaginationUIProps = {
  total_pages: number;
  has_pre: boolean;
  has_next: boolean;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
};

function PaginationUI({ total_pages, has_pre, has_next, currentPage, setCurrentPage }: PaginationUIProps) {
  return (
    <nav className="d-flex justify-content-center p-4">
      <ul className="pagination mb-0">
        <li className="page-item">
          <button onClick={() => setCurrentPage((prevPage) => prevPage - 1)} disabled={!has_pre} type="button" className={`page-link ${!has_pre ? 'disabled' : ''}`} aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>
        {Array.from({ length: total_pages }, (_, i) => i + 1).map((page) => (
          <li key={page} className="page-item">
            <button onClick={() => setCurrentPage(page)} disabled={currentPage === page} type="button" className={`page-link ${currentPage === page ? 'active' : ''}`}>
              {page}
            </button>
          </li>
        ))}
        <li className="page-item">
          <button onClick={() => setCurrentPage((prevPage) => prevPage + 1)} disabled={!has_next} className={`page-link ${!has_next ? 'disabled' : ''}`} type="button" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default PaginationUI;
