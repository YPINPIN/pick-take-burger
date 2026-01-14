function DashboardHeader({ title }: { title: string }) {
  return (
    <div className="position-sticky top-0 start-0 w-100 bg-dark border-bottom border-primary text-white px-4 py-4 shadow">
      <h3 className="fs-4 fw-bold mb-0">{title}</h3>
    </div>
  );
}

export default DashboardHeader;
