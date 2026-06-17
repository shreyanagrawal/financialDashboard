import React from 'react'
import { useLocation } from 'react-router-dom'

const LoadingScreen = ({ text = "Loading Data..." }) => {
  return (
        <div className="absolute inset-0 bg-gray-100 z-40 flex items-center justify-center">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-blue-600 font-semibold text-lg">
                    {text}
                </p>
            </div>
        </div>
  );
};

export default LoadingScreen;
