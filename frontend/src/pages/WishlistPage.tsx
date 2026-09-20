import { Layout } from '../components/Layout';

export const WishlistPage = () => {
  return (
    <Layout>
      <section className="rounded-[32px] border border-white/10 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-semibold text-white">Wishlist</h1>
        <p className="mt-2 text-slate-400">Save your favorite products for later and get price alerts.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {['Milk', 'Rice', 'Bread'].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
              <h3 className="text-lg font-semibold text-white">{item}</h3>
              <p className="mt-2 text-sm text-slate-400">Watch this product and get notified whenever it drops in price.</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};
