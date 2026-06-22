import React, { useContext, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { createUpdateModeLinkToken, syncAccountsAfterUpdate } from '../utils/api';
import { X } from 'lucide-react';
import { AuthContext } from '../utils/AuthContext';

const BankSelectionModal = ({ isOpen, onClose, banks, userId, onSuccess }) => {
    const [selectedBank, setSelectedBank] = useState(null);
    const [updateLinkToken, setUpdateLinkToken] = useState("");
    const {loading,setLoading} = useContext(AuthContext);
    
    const { open: openUpdateLink, ready: updateLinkReady } = usePlaidLink({
        token: updateLinkToken,
        onSuccess: async (public_token, metadata) => {
            console.log("Update Mode Success:", metadata);
            try {
                await syncAccountsAfterUpdate(userId.userId, selectedBank.plaidItemId);           
                onSuccess();
                onClose();
            } catch (error) {
                console.error("Error syncing accounts:", error);
                alert("Failed to sync accounts. Please try again.");
                
            }
        },
        onExit: () => {
            setUpdateLinkToken("");
            
        }
    });
    useEffect(() => {
        if(updateLinkToken && updateLinkReady)
            openUpdateLink();
    }, [updateLinkToken, updateLinkReady]);
    const handleSelectBank = async (bank) => {
        setSelectedBank(bank);
       
        try {
            const response = await createUpdateModeLinkToken(userId.userId,bank.plaidItemId);
            setUpdateLinkToken(response.link_token);

            setTimeout(() => {
                if (updateLinkReady) {
                    openUpdateLink();
                }
            }, 100);
        } catch (error) {
            console.error("Error creating update mode link token:", error);
            alert("Failed to initiate account addition. Please try again.");
            
            setSelectedBank(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Select Bank to Add Accounts</h2>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="text-gray-500 hover:text-gray-700 disabled:text-gray-300"
                    >
                        <X size={24} />
                    </button>
                </div>

                {banks && banks.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {banks.map((bank) => (
                            <button
                                key={bank._id}
                                onClick={() => handleSelectBank(bank)}
                                disabled={loading}
                                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🏦</span>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{bank.officialName}</h3>
                                            <p className="text-sm text-gray-500">{bank.accounts.length} account(s) connected</p>
                                        </div>
                                    </div>
                                    <span className="text-gray-400">→</span>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No connected banks found</p>
                    </div>
                )}

                <button
                    onClick={onClose}
                    disabled={loading}
                    className="w-full mt-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default BankSelectionModal;