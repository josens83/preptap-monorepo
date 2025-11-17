export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="text-gray-600 font-medium">로딩 중...</p>
      </div>
    </div>
  );
}
