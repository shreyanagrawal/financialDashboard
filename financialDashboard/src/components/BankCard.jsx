import React from 'react'

const BankCard = ({bank}) => {
    const availableBalance = bank.accounts.reduce((sum, b) => sum + b.balances.available, 0);
    return (
        <div className="bg-white rounded-2xl shadow-md pb-5">
            <div className="p-6 pb-0 flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between md:items-center hover:border-blue-500 transition-all duration-200">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-[#314463] flex items-center justify-center text-md">🏦</div>
                    <div>
                        <h3 className="font-semibold">{bank.officialName}</h3>
                        <p className="text-green-400 text-xl font-bold">${Number(availableBalance).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}</p>
                    </div>
                </div>
                <div className="flex items-center justify-between w-full md:w-auto gap-5">
                    <div className="text-right">
                        <span className="px-3 py-1 rounded-lg text-sm font-medium">{bank.accounts.length}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BankCard
