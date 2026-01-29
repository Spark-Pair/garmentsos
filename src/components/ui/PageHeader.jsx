import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';

const PageHeader = ({ 
  title, 
  subtitle, 
  showBack = false, 
  backPath = -1, 
  badge, 
  actions, 
  primaryAction,
  rightElement // Step progress ya kisi bhi extra element ke liye
}) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative py-5 border-b border-slate-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        {/* Left: Back + Title + Subtitle */}
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {showBack && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, backgroundColor: '#f8fafc' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(backPath)} 
                className="p-2.5 bg-white border border-slate-300 rounded-xl text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft size={20} />
              </motion.button>
            )}
          </AnimatePresence>

          <div>
            <div className="flex items-center gap-3">
              <h1 
                id="header-title"
                className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight"
              >
                {title}
              </h1>
              {badge && (
                <Badge 
                  variant={'info'}
                >
                  {badge}
                </Badge>
              )}
            </div>
            {subtitle && (
              <p className="text-slate-500 font-medium text-[11px] uppercase tracking-widest opacity-100 pt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Section: Progress Dots / Actions / Primary Button */}
        <div className="flex items-center flex-wrap gap-3">
          
          {/* Custom element (like progress bar) */}
          {rightElement}

          {/* Action Group (Edit, Delete, etc.) */}
          {actions && (
            <div className="flex items-center gap-1.5 bg-slate-100/50 p-1 rounded-2xl border border-slate-300">
              {actions}
            </div>
          )}

          {/* Main Action (Add New) */}
          {primaryAction && (
            <Button
              onClick={primaryAction.onClick || (() => navigate(primaryAction.link))}
              icon={primaryAction.icon || Plus}
              variant="primary"
              size="lg"
            >
              {primaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PageHeader;