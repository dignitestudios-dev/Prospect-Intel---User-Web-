import React from "react";

const Loader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-1">
                    Loading
                    <span className="animate-bounce [animation-delay:-0.3s]">.</span>
                    <span className="animate-bounce [animation-delay:-0.15s]">.</span>
                    <span className="animate-bounce">.</span>
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                    Please wait while we prepare your content
                </p>
            </div>
        </div>
    );
};

export default Loader;
