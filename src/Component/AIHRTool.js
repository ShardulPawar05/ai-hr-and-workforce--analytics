import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Users, TrendingUp, AlertTriangle, Calendar, Clock, Target, Brain, ChevronRight } from 'lucide-react';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

const AIHRTool = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [employees, setEmployees] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  // Generate sample employee data
  useEffect(() => {
    const sampleEmployees = [
      { id: 1, name: 'Sarah Chen', dept: 'Engineering', attendance: 40, productivity: 88, satisfaction: 7.5, tenure: 36, attritionRisk: 15 },
      { id: 2, name: 'Marcus Johnson', dept: 'Sales', attendance: 98, productivity: 92, satisfaction: 6.2, tenure: 18, attritionRisk: 45 },
      { id: 3, name: 'Priya Sharma', dept: 'Marketing', attendance: 92, productivity: 85, satisfaction: 8.1, tenure: 24, attritionRisk: 12 },
      { id: 4, name: 'David Kim', dept: 'Engineering', attendance: 78, productivity: 70, satisfaction: 5.5, tenure: 12, attritionRisk: 72 },
      { id: 5, name: 'Emily Rodriguez', dept: 'HR', attendance: 96, productivity: 90, satisfaction: 8.5, tenure: 48, attritionRisk: 8 },
      { id: 6, name: 'James Wilson', dept: 'Sales', attendance: 99, productivity: 88, satisfaction: 6.8, tenure: 15, attritionRisk: 38 },
      { id: 7, name: 'Lisa Zhang', dept: 'Engineering', attendance: 53, productivity: 94, satisfaction: 8.0, tenure: 30, attritionRisk: 10 },
      { id: 8, name: 'Ahmed Hassan', dept: 'Marketing', attendance: 90, productivity: 82, satisfaction: 7.2, tenure: 20, attritionRisk: 22 },
    ];
    setEmployees(sampleEmployees);
  }, []);

  // Generate AI insights
  const generateInsights = () => {
    setLoading(true);
    setTimeout(() => {
      const avgProductivity = employees.reduce((sum, e) => sum + e.productivity, 0) / employees.length;
      const avgAttendance = employees.reduce((sum, e) => sum + e.attendance, 0) / employees.length;
      const highRiskCount = employees.filter(e => e.attritionRisk > 50).length;
      
      setInsights({
        avgProductivity: avgProductivity.toFixed(1),
        avgAttendance: avgAttendance.toFixed(1),
        highRiskCount,
        recommendation: 'Consider implementing flexible work hours for Engineering team to boost attendance',
        shiftOptimization: 'Peak productivity hours: 10 AM - 2 PM. Suggest core hours scheduling.',
      });
      setLoading(false);
    }, 1500);
  };

  // Productivity by department
  const deptData = employees.reduce((acc, emp) => {
    const existing = acc.find(d => d.dept === emp.dept);
    if (existing) {
      existing.productivity = (existing.productivity + emp.productivity) / 2;
      existing.attendance = (existing.attendance + emp.attendance) / 2;
    } else {
      acc.push({ dept: emp.dept, productivity: emp.productivity, attendance: emp.attendance });
    }
    return acc;
  }, []);

  // Attrition risk distribution
  const riskData = [
    { name: 'Low Risk', value: employees.filter(e => e.attritionRisk < 30).length },
    { name: 'Medium Risk', value: employees.filter(e => e.attritionRisk >= 30 && e.attritionRisk < 60).length },
    { name: 'High Risk', value: employees.filter(e => e.attritionRisk >= 60).length },
  ];

  // Weekly productivity trend
  const weeklyData = [
    { day: 'Mon', productivity: 85, attendance: 92 },
    { day: 'Tue', productivity: 88, attendance: 94 },
    { day: 'Wed', productivity: 90, attendance: 93 },
    { day: 'Thu', productivity: 87, attendance: 90 },
    { day: 'Fri', productivity: 82, attendance: 88 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Brain className="text-blue-600" size={36} />
                AI HR & Workforce Analytics
              </h1>
              <p className="text-gray-600 mt-1">Intelligent workforce management powered by behavioral analytics</p>
            </div>
            <button
              onClick={generateInsights}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Generate AI Insights'}
              <Brain size={20} />
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{employees.length}</p>
              </div>
              <Users className="text-blue-600" size={40} />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Productivity</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {insights ? `${insights.avgProductivity}%` : '--'}
                </p>
              </div>
              <TrendingUp className="text-green-600" size={40} />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Attendance</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {insights ? `${insights.avgAttendance}%` : '--'}
                </p>
              </div>
              <Calendar className="text-blue-600" size={40} />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">High Attrition Risk</p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {insights ? insights.highRiskCount : '--'}
                </p>
              </div>
              <AlertTriangle className="text-red-600" size={40} />
            </div>
          </div>
        </div>

        {/* AI Insights Panel */}
        {insights && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 mb-6 text-white">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Brain size={24} />
              AI-Powered Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <p className="text-sm opacity-90 mb-1">Recommendation</p>
                <p className="font-medium">{insights.recommendation}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <p className="text-sm opacity-90 mb-1">Shift Optimization</p>
                <p className="font-medium">{insights.shiftOptimization}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              {['overview', 'attrition', 'productivity', 'employees'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Weekly Productivity Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="productivity" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Department Performance</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={deptData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="dept" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="productivity" fill="#3b82f6" />
                        <Bar dataKey="attendance" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Attrition Tab */}
            {activeTab === 'attrition' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Attrition Risk Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={riskData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {riskData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">High-Risk Employees</h3>
                    <div className="space-y-3">
                      {employees
                        .filter(e => e.attritionRisk > 50)
                        .sort((a, b) => b.attritionRisk - a.attritionRisk)
                        .map(emp => (
                          <div key={emp.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-gray-900">{emp.name}</p>
                                <p className="text-sm text-gray-600">{emp.dept}</p>
                              </div>
                              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                {emp.attritionRisk}% Risk
                              </span>
                            </div>
                            <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                              <div>
                                <p className="text-gray-600">Attendance</p>
                                <p className="font-medium">{emp.attendance}%</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Productivity</p>
                                <p className="font-medium">{emp.productivity}%</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Satisfaction</p>
                                <p className="font-medium">{emp.satisfaction}/10</p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Productivity Tab */}
            {activeTab === 'productivity' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Productivity Analysis by Employee</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Employee</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Department</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Productivity</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Attendance</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {employees
                        .sort((a, b) => b.productivity - a.productivity)
                        .map(emp => (
                          <tr key={emp.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{emp.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{emp.dept}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${emp.productivity}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium">{emp.productivity}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-600 h-2 rounded-full"
                                    style={{ width: `${emp.attendance}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium">{emp.attendance}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                emp.productivity >= 85 ? 'bg-green-100 text-green-700' :
                                emp.productivity >= 70 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {emp.productivity >= 85 ? 'Excellent' : emp.productivity >= 70 ? 'Good' : 'Needs Attention'}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Employees Tab */}
            {activeTab === 'employees' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Employee Directory</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {employees.map(emp => (
                    <div key={emp.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{emp.name}</h4>
                          <p className="text-sm text-gray-600">{emp.dept}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          emp.attritionRisk < 30 ? 'bg-green-100 text-green-700' :
                          emp.attritionRisk < 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {emp.attritionRisk}% Risk
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Productivity:</span>
                          <span className="font-medium">{emp.productivity}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Attendance:</span>
                          <span className="font-medium">{emp.attendance}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Satisfaction:</span>
                          <span className="font-medium">{emp.satisfaction}/10</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tenure:</span>
                          <span className="font-medium">{emp.tenure} months</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHRTool;