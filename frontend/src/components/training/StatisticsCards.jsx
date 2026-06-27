function StatisticsCards({ statistics }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {statistics.map((statistic) => (
        <div
          key={statistic.label}
          className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)]"
        >
          <p className="text-sm font-medium text-slate-500">{statistic.label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{statistic.value}</p>
        </div>
      ))}
    </div>
  );
}

export default StatisticsCards;