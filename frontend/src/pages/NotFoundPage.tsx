import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';

export const NotFoundPage = () => {
  return (
    <Layout>
      <section className="rounded-[32px] border border-white/10 bg-slate-900/70 p-10 text-center">
        <h1 className="text-4xl font-semibold text-white">404</h1>
        <p className="mt-3 text-slate-400">The page you are looking for does not exist.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-blue-600 px-4 py-3 font-medium text-white">
          Return home
        </Link>
      </section>
    </Layout>
  );
};
