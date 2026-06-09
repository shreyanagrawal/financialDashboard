const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

      <h2 className="mt-6 text-xl font-semibold text-gray-700">
        Loading Dashboard...
      </h2>

      <p className="text-gray-500 mt-2">
        Please wait while we fetch your data
      </p>
    </div>
  );
};

export default LoadingScreen;