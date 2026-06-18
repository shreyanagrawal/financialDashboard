import React from 'react'
const CategoryWiseData = ({data, total}) => {
    return (
       <div className="dashboard p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {Object.entries(data).map(([category,budget])=>(
                <div key={crypto.randomUUID()} className="bg-white rounded-2xl shadow-md pb-5">
                    <div className="p-6 pb-0 flex flex-col md:flex-col gap-4 md:gap-4 md:justify-between md:items-center hover:border-blue-500 transition-all duration-200">
                        <div className="flex items-center gap-4" style={{width: "100%"}}>
                            <h3 className="font-semibold" style={{width: "100%"}}>{category}</h3>
                            <p className="text-red-400 text-xl font-bold text-end">${Math.abs(Number(budget)).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full overflow-hidden" style={{"height":"4px"}}>
                            <div className="progressBar bg-green-500 rounded-full transition-all duration-500"style={{width: `${Math.min((budget / total) * 100, 100)}%`, "height": "4px"}}></div>
                        </div>
                    </div>
                </div>
            ))}
        </div> 
    )
}

export default CategoryWiseData
