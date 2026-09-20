type StatCardProps = {
  title: string;
  value: string;
  accent?: string;
};

export const StatCard = ({ title, value, accent = 'from-blue-600/20 to-cyan-600/10' }: StatCardProps) => {
  return (
    <div className={`rounded-2xl border border-white/10 bg-gradient-to-br ${accent} p-5`}>
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
};
