import React from 'react';
import { FaCheckCircle } from "react-icons/fa"; // Added Check Circle for the Success popups

// --- 1. Profile Saved Pop Up (Centered Notification) ---
const SaveSuccessPopup = ({ onClose }) => (
    <div className="fixed top-1/2 left-1/2 z-[100] w-96 bg-white rounded-xl shadow-2xl p-4 border border-gray-200 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-lg font-bold text-gray-900">Profile Saved</h3>
                <p className="text-sm text-gray-500">Profile Saved To Favorite Tab.</p>
            </div>
            <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700 ml-4 p-1 leading-none"
            >
                &times;
            </button>
        </div>
    </div>
);

// --- 2. Request Sent Pop Up (Centered Notification) ---
const RequestSentPopup = ({ onClose }) => (
    <div className="fixed top-1/2 left-1/2 z-[100] w-96 bg-white rounded-xl shadow-2xl p-4 border border-gray-200 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-lg font-bold text-gray-900">Request Sent</h3>
                <p className="text-sm text-gray-500">Request Sent To Admin For More Updates.</p>
            </div>
            <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700 ml-4 p-1 leading-none"
            >
                &times;
            </button>
        </div>
    </div>
);

// --- 3. Send Message Modal (Centered Full-screen Overlay) ---
const SendMessageModal = ({ onCancel, onSend }) => {
    const [message, setMessage] = React.useState('');

    const handleSend = () => {
        if (message.trim()) {
            onSend(); // Trigger the success flow
        } else {
            alert("Please enter a message.");
        }
    };

    return (
        // Modal Backdrop (Centered)
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[90]">
            {/* Modal Content */}
            <div className="w-[500px] bg-white rounded-xl shadow-2xl p-6">
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Send A Message</h2>
                    <button 
                        onClick={onCancel} 
                        className="text-gray-500 hover:text-gray-700 p-1 leading-none text-2xl"
                    >
                        &times;
                    </button>
                </div>
                
                {/* Textarea */}
                <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Message here"
                    rows="5"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700"
                ></textarea>

                {/* Buttons */}
                <div className="flex justify-end space-x-3 mt-4">
                    <button 
                        onClick={onCancel} 
                        className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSend} 
                        className="px-6 py-2 bg-[#0085CA] text-white font-medium rounded-lg hover:bg-blue-700"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

// Export all popups to be used in the Profile component
export { SaveSuccessPopup, RequestSentPopup, SendMessageModal };
