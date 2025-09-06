const PageHeader = ({ title, actionButton }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      {actionButton && actionButton}
    </div>
  )
}

export default PageHeader
