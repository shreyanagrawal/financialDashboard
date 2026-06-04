const AccountCard = ({ account }) => {
  return (
    <div className="bg-[#223250] border border-[#2d3d5b] rounded-xl px-4 py-4 flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between md:items-center hover:border-blue-500 transition-all duration-200">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#314463] flex items-center justify-center text-xl">🏦</div>
        <div>
          <h3 className="text-white font-semibold text-lg">{account.name}</h3>
          <p className="text-slate-400">{account.subtype} · Synced via Plaid</p>
          <p className="text-slate-500 text-sm">**** {account.mask}</p>
        </div>
      </div>
      <div className="flex items-center justify-between w-full md:w-auto gap-5">
        <div className="text-right">
          <p className="text-green-400 text-2xl font-bold">${account.balances?.current}</p>
          <p className="text-slate-400 text-sm">Available balance</p>
        </div>
        <span className="bg-green-900 text-green-300 px-3 py-1 rounded-lg text-sm font-medium">Linked</span>
      </div>
    </div>
  );
};
export default AccountCard;