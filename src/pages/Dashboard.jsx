import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingUp, ArrowUpRight, LayoutDashboard, ChevronRight, Zap, ShieldCheck } from 'lucide-react';
import { Badge, Loader, PageHeader } from '../components/ui';
import { articlesAPI, usersAPI } from '../services/api';
import { useConfig } from '../context/ConfigContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { config } = useConfig();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [statsRes, articlesRes] = await Promise.all([
        articlesAPI.getStats(),
        articlesAPI.getAll({ limit: 6, sortBy: 'createdAt', order: 'desc' })
      ]);
      setStats(statsRes.data.data);
      setRecentArticles(articlesRes.data.data);
      if (user?.role === 'developer' || user?.role === 'admin') {
        const usersRes = await usersAPI.getAll();
        setUserCount(usersRes.data.data.filter(u => u.isActive).length);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  if (loading) return <Loader size="lg" className="h-full" />;

  return (
    <div className="h-full flex flex-col gap-5">
      <PageHeader 
        title="Dashboard" 
        subtitle="Real-time system overview"
        icon={LayoutDashboard}
        rightElement={<Badge variant="success">v2.4.0 Online</Badge>}
      />

      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-full flex flex-col gap-5 overflow-scroll"
        >
          {/* 1. Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard icon={Package} label="Total Articles" value={stats?.totalArticles || 0} color="text-blue-600" />
            <StatCard icon={TrendingUp} label="Avg. Margin" value={`${(stats?.summary?.avgProfitMargin || 0).toFixed(1)}%`} color="text-amber-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-full">
            {/* 2. Recent Articles Section */}
            <div className="lg:col-span-8 border border-slate-300 rounded-3xl p-1.5 bg-white h-full">
              <div className="ps-6 p-4 bg-slate-200/85 relative overflow-hidden rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg leading-tight">Recent Articles</h3>
                  <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500">Latest Entries</p>
                </div>
                <Link to="/articles" className="p-3 bg-white rounded-xl border border-slate-300 hover:bg-slate-900 hover:text-white transition-all duration-300">
                  <ArrowUpRight size={18} />
                </Link>
              </div>
              
              <div className="p-3">
                {recentArticles.map((article) => (
                  <Link key={article._id} to={`/articles/view/${article._id}`}
                    className="flex items-center gap-4 p-3.5 hover:pr-6 hover:bg-slate-100 rounded-2xl transition-all duration-300 group/row border border-transparent hover:border-slate-200"
                  >
                    <div className="w-12 h-12 rounded-xl font-semibold flex items-center justify-center border border-slate-300 transition-all duration-300 group-hover/row:scale-105 group-hover/row:bg-slate-900 group-hover/row:text-slate-50">
                      {article.article_no.slice(-2)}
                    </div>
                    <div className='flex-1 flex justify-between items-center'>
                      <div>
                        <p className="text-md font-semibold uppercase tracking-wide text-slate-800 leading-none mb-0.5">{article.article_no}</p>
                        <p className="text-sm font-medium text-slate-700 tracking-tight">{article.category}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-md font-black text-slate-900">Rs.{article.sales_rate?.toLocaleString()}</span>
                        <ChevronRight size={16} className="text-slate-400 group-hover/row:text-slate-900 transition-all duration-300" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 3. Entity Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="border border-slate-300 rounded-3xl p-1.5 bg-white">
                <div className="bg-emerald-100 rounded-2xl p-4 flex items-center gap-4 border border-emerald-200">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-300 shadow-sm">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-900 uppercase tracking-widest leading-none mb-1">System Secure</p>
                    <p className="text-[10px] font-medium text-emerald-700/80 uppercase">End-to-End Encryption</p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-300 rounded-3xl p-1.5 bg-white">
                <div className="bg-blue-100 rounded-2xl p-4 flex items-center gap-4 border border-blue-200">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 border border-blue-300 shadow-sm">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest leading-none mb-1">Developed by SparkPair</p>
                    <a href='https://www.sparkpair.dev/' target='_blank' className="text-[10px] font-medium text-blue-700/80 uppercase">www.SparkPair.dev</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// --- Clean Helper Components ---

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="border border-slate-300 rounded-3xl p-1.5 bg-white group">
    <div className="p-5 rounded-2xl flex items-center gap-4 hover:bg-slate-200/85 transition-all duration-300">
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-300 shadow-sm transition-transform group-hover:scale-105">
        <Icon size={22} className={color} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 leading-none mb-1.5">{label}</p>
        <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{value}</p>
      </div>
    </div>
  </div>
);

const SidebarRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-2xl transition-all group/row border border-transparent">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/5 group-hover/row:border-white/20">
      <Icon size={18} className="text-slate-400" strokeWidth={2.5} />
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 leading-none mb-1">{label}</p>
      <p className="text-sm font-medium text-slate-200 truncate tracking-tight">{value || 'Not Set'}</p>
    </div>
  </div>
);

export default Dashboard;