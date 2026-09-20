import { Layout } from '../components/Layout';

export const SettingsPage = () => {
  return (
    <Layout>
      <section className="rounded-[32px] border border-white/10 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-semibold text-white">Settings</h1>
        <p className="mt-2 text-slate-400">Personalize your SmartBuy AI experience with dark mode, language and alerts.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
            <h3 className="text-lg font-semibold text-white">Language</h3>
            <p className="mt-2 text-sm text-slate-400">English and Tamil support are ready for rollout.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
            <p className="mt-2 text-sm text-slate-400">Manage price alerts and offer notifications.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};
