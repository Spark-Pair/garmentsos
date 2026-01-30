import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Trash2, Hash, Settings2, ShieldCheck, Activity, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Input, Loader, Modal, PageHeader, ConfirmationModal } from '../components/ui';
import { optionsAPI } from '../services/api';
import { useConfig } from '../context/ConfigContext';
import { motion, AnimatePresence } from 'framer-motion';

// Meaningful configuration with meta-data
const CONFIG_MAP = {
  seasons: { label: 'Seasons' },
  sizes: { label: 'Sizes' },
  categories: { label: 'Categories' },
  fabric: { label: 'Fabrics' },
  work: { label: 'Work' },
  accessory: { label: 'Accessory' },
  labor: { label: 'Labor' },
};

const Options = () => {
  const { refreshOptions } = useConfig();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState({ seasons: [], sizes: [], categories: [], rateCategories: {} });
  const [modal, setModal] = useState({ open: false, type: '', category: null, index: null });
  // Delete confirmation ke liye state
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, payload: null });
  const [formValue, setFormValue] = useState('');

  useEffect(() => { loadOptions(); }, []);

  const loadOptions = async () => {
    try {
      const { data } = await optionsAPI.getAll();
      setOptions(data.data);
    } catch (e) { toast.error('Failed to sync system parameters'); }
    finally { setLoading(false); }
  };

  const handleAction = async (actionType, payload) => {
    if ((actionType === 'add' || actionType === 'update') && !formValue.trim()) return;
    try {
      const type = payload.category ? 'rateCategories' : payload.type;
      await optionsAPI.updateConfig(type, actionType, {
        value: actionType === 'delete' ? '' : formValue, 
        index: payload.index, 
        category: payload.category
      });
      
      toast.success(`Parameter ${actionType}ed`);
      loadOptions(); 
      refreshOptions();
      setModal({ open: false }); 
      setDeleteConfirm({ open: false, payload: null }); // Close delete modal
      setFormValue('');
    } catch (e) { toast.error('Operation failed'); }
  };
  
  if (loading) return <Loader size="lg" className="h-full" />;

  return (
    <div className="h-full flex flex-col gap-5">
      <PageHeader 
        title="Global Configuration" 
        subtitle="Define systemic rules, size scales, and cost variables for your production line."
        icon={Settings2}
      />

      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-full flex flex-col gap-5 overflow-scroll"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
            {['seasons', 'sizes', 'categories'].map(key => (
              <ConfigCard 
                key={key} 
                type={key} 
                data={options[key]} 
                searchTerm={searchTerm}
                onAdd={() => { setModal({ open: true, type: key, index: null }); setFormValue(''); }}
                onEdit={(i, v) => { setModal({ open: true, type: key, index: i }); setFormValue(v); }}
                // Trash click par modal khulega
                onDelete={(i) => setDeleteConfirm({ open: true, payload: { type: key, index: i } })}
              />
            ))}

            {Object.keys(options.rateCategories || {}).map(cat => (
              <ConfigCard 
                key={cat} 
                type={cat} 
                data={options.rateCategories[cat]} 
                searchTerm={searchTerm}
                onAdd={() => { setModal({ open: true, category: cat, index: null }); setFormValue(''); }}
                onEdit={(i, v) => { setModal({ open: true, category: cat, index: i }); setFormValue(v); }}
                // Trash click par modal khulega
                onDelete={(i) => setDeleteConfirm({ open: true, payload: { category: cat, index: i } })}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <Modal isOpen={modal.open} onClose={() => setModal({ open: false })} title="System Entry">
         <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 bg-slate-900 text-white rounded-xl">
                <Activity size={20} className="text-emerald-400" />
                <p className="text-xs font-normal">Updating this will sync across all active article forms.</p>
            </div>
            <Input 
              placeholder="Value label..." 
              value={formValue} 
              onChange={e => setFormValue(e.target.value)}
              autoFocus
            />
            <Button variant='primary' size='lg' className='w-full' onClick={() => handleAction(modal.index !== null ? 'update' : 'add', modal)}>
               {modal.index !== null ? 'Update Parameter' : 'Finalize Entry'}
            </Button>
         </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal 
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, payload: null })}
        onConfirm={() => handleAction('delete', deleteConfirm.payload)}
        title="Delete Parameter"
        message="Are you sure you want to remove this item? This action might affect articles using this value."
        type="danger"
      />
    </div>
  );
};

// --- Mini Components ---

const StatPill = ({ label, count, color }) => (
  <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-full shadow-sm">
    <div className={`w-2 h-2 rounded-full ${color}`} />
    <span className="text-[10px] font-black uppercase text-slate-500">{label}: {count}</span>
  </div>
);

const ConfigCard = ({ type, data = [], onAdd, onEdit, onDelete, searchTerm }) => {
  const config = CONFIG_MAP[type] || { label: type, icon: Hash, color: 'text-slate-600', bg: 'bg-slate-100', accent: 'border-slate-100' };
  const Icon = config.icon;

  const filteredData = useMemo(() => 
    data.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase())),
  [data, searchTerm]);

  return (
    <div className={`bg-white border border-slate-300 rounded-3xl flex flex-col h-[450px] overflow-hidden p-1.5`}>
      <div className="ps-5 p-4 bg-slate-200/85 flex items-center justify-between rounded-2xl">
        <div>
          <h3 className="font-black text-slate-900 text-lg leading-none">{config.label}</h3>
          <span className="text-[11px] font-medium uppercase tracking-widest text-slate-500">Inventory Sync Active</span>
        </div>
        <button onClick={onAdd} className="w-12 h-12 rounded-xl bg-slate-50 hover:bg-slate-900 hover:text-white flex items-center justify-center transition-all group/btn">
          <Plus size={24} className="group-hover/btn:rotate-90 transition-transform" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
        {filteredData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 italic text-xs">No matching entries</div>
        ) : (
          <div className="space-y-0 py-4">
            {filteredData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between px-5 py-3 hover:bg-slate-100 rounded-2xl transition-all group/item border border-transparent hover:border-slate-300">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover/item:bg-slate-700 transition-colors" />
                  <span className="text-[14px] font-bold text-slate-500 group-hover/item:text-slate-900">{item}</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 translate-x-5 group-hover/item:translate-x-1 transition-all">
                  <button onClick={() => onEdit(idx, item)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-xl transition-all duration-300"><Edit2 size={14} /></button>
                  <button onClick={() => onDelete(idx)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-white rounded-xl transition-all duration-300"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="px-6 py-5 bg-slate-200/90 rounded-2xl flex items-center justify-between">
         <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 uppercase tracking-widest">
            <ShieldCheck size={16} className="text-emerald-500" /> System Protected
         </div>
         <ChevronRight size={16} className="text-slate-400" />
      </div>
    </div>
  );
};

export default Options;