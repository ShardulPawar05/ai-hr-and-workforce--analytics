import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Users, TrendingUp, AlertTriangle, Brain, UserPlus, Plus, X, Trash2, Star, Search, Edit3 } from 'lucide-react';

// --- DEPLOYMENT FIX: SMART URL SWITCH ---
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://aihr-backend-shardul.onrender.com' // Render Backend URL
  : 'http://localhost:5000';                   // Local Laptop URL

const API_URL = `${API_BASE}/api/employees`;

const AIHRTool = () => {
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '', dept: 'Engineering', satisfaction: 7, attendance: 95, workLoad: 40, peerRating: 4, lastPromotion: 6
  });

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      setEmployees(res.data);
    } catch (err) { console.error("Database connection failed", err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      satisfaction: Number(formData.satisfaction),
      attendance: Number(formData.attendance),
      workLoad: Number(formData.workLoad),
      peerRating: Number(formData.peerRating),
      lastPromotion: Number(formData.lastPromotion),
    };
    try {
      if (editId) await axios.put(`${API_URL}/${editId}`, payload);
      else await axios.post(API_URL, payload);
      fetchData();
      handleCloseModal();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (emp) => {
    setEditId(emp._id);
    setFormData(emp);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setFormData({ name: '', dept: 'Engineering', satisfaction: 7, attendance: 95, workLoad: 40, peerRating: 4, lastPromotion: 6 });
  };

  const deleteEmployee = async (id) => {
    if (window.confirm("Kyu aap ise delete karna chahte hain?")) {
      await axios.delete(`${API_URL}/${id}`);
      fetchData();
    }
  };

  const generateInsights = () => {
    setLoading(true);
    setTimeout(() => {
      const totalEmp = employees.length || 1;
      const avgProd = employees.reduce((sum, e) => sum + (Number(e.productivity) || 0), 0) / totalEmp;
      const riskCount = employees.filter(e => (Number(e.attritionRisk) || 0) > 60).length;
      setInsights({
        avgProd: avgProd.toFixed(1),
        riskCount: riskCount,
        advice: riskCount > 0 ? `Alert: ${riskCount} risky cases. Review workload.` : "Stable."
      });
      setLoading(false);
    }, 1000);
  };

  const deptData = Object.values(employees.reduce((acc, emp) => {
    const dName = emp.dept || 'Other';
    const dProd = Number(emp.productivity) || 0;
    if (!acc[dName]) acc[dName] = { name: dName, productivity: 0, count: 0 };
    acc[dName].productivity += dProd;
    acc[dName].count += 1;
    return acc;
  }, {})).map(d => ({ name: d.name, productivity: Math.round(d.productivity / d.count) }));

  const filteredList = employees.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesKPI = true;
    if (filterStatus === 'high-risk') matchesKPI = (Number(e.attritionRisk) || 0) > 60;
    else if (filterStatus === 'stars') matchesKPI = (Number(e.productivity) || 0) >= 80;
    return matchesSearch && matchesKPI;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-3 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-10 gap-4">
          <div className="flex items-center gap-3">
            <Brain className="text-blue-600" size={32} />
            <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight">AIHR CORE</h1>
          </div>
          <div className="flex w-full md:w-auto gap-2 md:gap-3">
            <button onClick={generateInsights} className="flex-1 bg-white border-2 border-slate-100 px-4 py-2.5 rounded-xl font-bold text-slate-600 text-xs md:text-sm flex items-center justify-center gap-2">
              {loading ? '...' : <><TrendingUp size={16} /> AI Analysis</>}
            </button>
            <button onClick={() => setIsModalOpen(true)} className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-black shadow-lg text-xs md:text-sm flex items-center justify-center gap-2">
              <Plus size={16} /> ADD NEW
            </button>
          </div>
        </header>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <KpiCard label="Workforce" value={employees.length} icon={<Users />} active={filterStatus === 'all'} onClick={() => { setFilterStatus('all'); setActiveTab('employees'); }} />
          <KpiCard label="High Risk" value={employees.filter(e => (Number(e.attritionRisk) || 0) > 60).length} icon={<AlertTriangle />} color="text-red-500" active={filterStatus === 'high-risk'} onClick={() => { setFilterStatus('high-risk'); setActiveTab('employees'); }} />
          <KpiCard label="Elite" value={employees.filter(e => (Number(e.productivity) || 0) >= 80).length} icon={<Star />} color="text-amber-500" active={filterStatus === 'stars'} onClick={() => { setFilterStatus('stars'); setActiveTab('employees'); }} />
        </div>

        {/* SEARCH */}
        <div className="relative w-full md:max-w-md mb-6 md:mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input
            type="text"
            placeholder="Search name..."
            className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl outline-none focus:border-blue-400 text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* MAIN VIEW */}
        <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-slate-100">
          <div className="flex bg-slate-50/50 border-b">
            {['overview', 'employees'].map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); if (tab === 'overview') setFilterStatus('all'); }}
                className={`flex-1 md:flex-none md:px-12 py-4 md:py-6 font-black uppercase text-[10px] md:text-[11px] tracking-widest transition-all ${activeTab === tab ? 'text-blue-600 border-b-4 border-blue-600 bg-white' : 'text-slate-400'}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="p-4 md:p-8">
            {activeTab === 'overview' ? (
              <div className="h-[300px] md:h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis fontSize={10} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip cursor={{ fill: '#F8FAFC' }} />
                    <Bar dataKey="productivity" radius={[8, 8, 0, 0]} barSize={window.innerWidth < 768 ? 30 : 60}>
                      {deptData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.productivity < 45 ? '#EF4444' : '#3B82F6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {filteredList.map(emp => (
                  <EmployeeCard key={emp._id} emp={emp} onEdit={() => handleEdit(emp)} onDelete={() => deleteEmployee(emp._id)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 md:p-10 my-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg md:text-xl font-black uppercase">{editId ? 'Edit Record' : 'Register Talent'}</h2>
              <button onClick={handleCloseModal} className="text-slate-400 p-2"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Full Name</label>
                <input required className="w-full p-3 md:p-4 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none mt-1" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="md:col-span-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Dept</label>
                <select className="w-full p-3 md:p-4 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none mt-1" value={formData.dept} onChange={e => setFormData({ ...formData, dept: e.target.value })}>
                  <option>Engineering</option><option>Sales</option><option>HR</option><option>Marketing</option>
                </select>
              </div>
              <InputBox label="Satisfaction (1-10)" val={formData.satisfaction} min="1" max="10" onChange={(v) => setFormData({ ...formData, satisfaction: v })} />
              <InputBox label="Workload (Hrs/Wk)" val={formData.workLoad} onChange={(v) => setFormData({ ...formData, workLoad: v })} />
              <InputBox label="Peer Rating (1-5)" val={formData.peerRating} min="1" max="5" onChange={(v) => setFormData({ ...formData, peerRating: v })} />
              <InputBox label="Attendance %" val={formData.attendance} min="0" max="100" onChange={(v) => setFormData({ ...formData, attendance: v })} />
              <InputBox label="Last Promo (Mo)" val={formData.lastPromotion} onChange={(v) => setFormData({ ...formData, lastPromotion: v })} />
              
              <button type="submit" className="md:col-span-2 bg-blue-600 text-white p-4 rounded-xl font-black text-sm shadow-lg mt-4 uppercase">SAVE DATA</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- HELPERS ---
const KpiCard = ({ label, value, icon, color, active, onClick }) => (
  <div onClick={onClick} className={`p-4 md:p-8 rounded-3xl cursor-pointer transition-all border-4 ${active ? 'bg-white border-blue-600 shadow-xl' : 'bg-white border-transparent shadow-sm'}`}>
    <div className="flex justify-between items-center">
      <div><p className="text-slate-400 text-[9px] font-black uppercase">{label}</p><p className={`text-2xl md:text-4xl font-black ${color}`}>{value}</p></div>
      <div className={`${active ? 'text-blue-600' : 'text-slate-100'} scale-125`}>{icon}</div>
    </div>
  </div>
);

const EmployeeCard = ({ emp, onEdit, onDelete }) => (
  <div className="p-5 md:p-7 rounded-[32px] border-2 bg-white hover:shadow-lg transition-all">
    <div className="flex justify-between items-start mb-4">
      <div><h4 className="font-black text-sm md:text-lg">{emp.name}</h4><p className="text-[9px] font-black text-blue-500 uppercase">{emp.dept}</p></div>
      <div className="flex gap-1">
        <button onClick={onEdit} className="text-slate-300 hover:text-blue-600 p-1"><Edit3 size={16} /></button>
        <button onClick={onDelete} className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={16} /></button>
      </div>
    </div>
    <ProgressBar label="Efficiency" val={Number(emp.productivity) || 0} color="bg-blue-500" />
    <div className="mt-4 p-3 bg-slate-50 rounded-xl"><p className="text-[8px] font-black text-slate-400 mb-1 flex items-center gap-1"><Brain size={10} /> AI PLAN</p><p className="text-[10px] italic text-slate-600">"{emp.aiRecommendation}"</p></div>
  </div>
);

const ProgressBar = ({ label, val, color }) => (
  <div className="mt-2"><div className="flex justify-between text-[9px] font-black text-slate-400 mb-1"><span>{label}</span><span>{val}%</span></div><div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className={`${color} h-full`} style={{ width: `${val}%` }}></div></div></div>
);

const InputBox = ({ label, val, min, max, onChange }) => (
  <div><label className="text-[10px] font-black text-slate-400 ml-1">{label}</label><input type="number" min={min} max={max} className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl mt-1 text-sm" value={val} onChange={(e) => onChange(e.target.value)} /></div>
);

export default AIHRTool;