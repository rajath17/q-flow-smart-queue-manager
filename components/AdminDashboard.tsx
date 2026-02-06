
import React from 'react';
import { Queue } from '../types';

interface AdminDashboardProps {
  queues: Queue[];
  onNext: (queueId: string) => void;
  onReset: (queueId: string) => void;
  onToggleStatus: (queueId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ queues, onNext, onReset, onToggleStatus }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Staff Control Panel</h1>
        <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-blue-700">Live View</span>
        </div>
      </div>

      <div className="grid gap-6">
        {queues.map(queue => (
          <div key={queue.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{queue.name}</h3>
                <p className="text-slate-500 text-sm">Managing: {queue.category}</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="px-4 py-2 bg-slate-100 rounded-lg">
                  <span className="text-xs text-slate-400 block uppercase tracking-wider font-bold">Serving</span>
                  <span className="text-lg font-black text-blue-600">#{queue.currentlyServing}</span>
                </div>
                <div className="px-4 py-2 bg-slate-100 rounded-lg">
                  <span className="text-xs text-slate-400 block uppercase tracking-wider font-bold">In Line</span>
                  <span className="text-lg font-black text-slate-800">{queue.totalTokens - queue.currentlyServing}</span>
                </div>
                <div className="px-4 py-2 bg-slate-100 rounded-lg">
                  <span className="text-xs text-slate-400 block uppercase tracking-wider font-bold">Next Token</span>
                  <span className="text-lg font-black text-slate-500">#{queue.totalTokens + 1}</span>
                </div>
              </div>
            </div>

            <hr className="my-6 border-slate-100" />

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => onNext(queue.id)}
                disabled={queue.currentlyServing >= queue.totalTokens}
                className="flex-1 min-w-[150px] bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all active:scale-95"
              >
                <i className="fa-solid fa-forward-step"></i>
                <span>Call Next</span>
              </button>
              
              <button 
                onClick={() => onToggleStatus(queue.id)}
                className={`flex-1 min-w-[150px] py-3 rounded-xl font-bold border-2 transition-all active:scale-95 ${
                  queue.status === 'Open' 
                    ? 'border-orange-200 text-orange-600 hover:bg-orange-50' 
                    : 'border-green-200 text-green-600 hover:bg-green-50'
                }`}
              >
                {queue.status === 'Open' ? 'Pause Queue' : 'Open Queue'}
              </button>

              <button 
                onClick={() => onReset(queue.id)}
                className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95"
              >
                Reset
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
