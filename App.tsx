
import React, { useState, useEffect, useCallback } from 'react';
import { Queue, Token, ViewMode } from './types';
import { MOCK_QUEUES } from './constants';
import QueueCard from './components/QueueCard';
import AdminDashboard from './components/AdminDashboard';
import { getAIInsights } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('Customer');
  const [queues, setQueues] = useState<Queue[]>(MOCK_QUEUES);
  const [myToken, setMyToken] = useState<Token | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync state logic
  const handleJoinQueue = (queueId: string) => {
    const queue = queues.find(q => q.id === queueId);
    if (!queue) return;

    const newTokenNumber = queue.totalTokens + 1;
    const newToken: Token = {
      id: Math.random().toString(36).substr(2, 9),
      queueId,
      queueName: queue.name,
      number: newTokenNumber,
      createdAt: Date.now(),
      status: 'Waiting',
    };

    setMyToken(newToken);
    setQueues(prev => prev.map(q => 
      q.id === queueId ? { ...q, totalTokens: newTokenNumber } : q
    ));
    
    // Request insights
    fetchInsight(queue, newTokenNumber);
  };

  const fetchInsight = async (queue: Queue, tokenNumber: number) => {
    setIsLoadingInsight(true);
    const insight = await getAIInsights(queue, tokenNumber);
    setAiInsight(insight);
    setIsLoadingInsight(false);
  };

  const handleNext = (queueId: string) => {
    setQueues(prev => prev.map(q => {
      if (q.id === queueId) {
        const nextServing = q.currentlyServing + 1;
        
        // Notification Logic for the active user
        if (myToken && myToken.queueId === queueId) {
          const distance = myToken.number - nextServing;
          if (distance === 0) {
            setNotification("It's your turn! Please proceed to the counter.");
          } else if (distance > 0 && distance <= 3) {
            setNotification(`Get ready! You are currently ${distance} people away.`);
          }
        }
        
        return { ...q, currentlyServing: Math.min(nextServing, q.totalTokens) };
      }
      return q;
    }));
  };

  const handleToggleStatus = (queueId: string) => {
    setQueues(prev => prev.map(q => 
      q.id === queueId ? { ...q, status: q.status === 'Open' ? 'Paused' : 'Open' } : q
    ));
  };

  const handleReset = (queueId: string) => {
    setQueues(prev => prev.map(q => 
      q.id === queueId ? { ...q, currentlyServing: 0, totalTokens: 0, status: 'Open' } : q
    ));
    if (myToken && myToken.queueId === queueId) setMyToken(null);
  };

  const cancelToken = () => {
    setMyToken(null);
    setAiInsight(null);
  };

  const activeQueue = myToken ? queues.find(q => q.id === myToken.queueId) : null;
  const peopleAhead = (myToken && activeQueue) ? myToken.number - activeQueue.currentlyServing : 0;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <i className="fa-solid fa-layer-group"></i>
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight">Q-Flow</span>
          </div>
          
          <nav className="hidden md:flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setView('Customer')}
              className={`px-6 py-2 rounded-md font-bold text-sm transition-all ${
                view === 'Customer' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'
              }`}
            >
              For Customers
            </button>
            <button 
              onClick={() => setView('Admin')}
              className={`px-6 py-2 rounded-md font-bold text-sm transition-all ${
                view === 'Admin' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'
              }`}
            >
              For Staff
            </button>
          </nav>

          <div className="md:hidden flex space-x-2">
             <button onClick={() => setView(view === 'Customer' ? 'Admin' : 'Customer')} className="p-2 text-slate-500">
               <i className={`fa-solid ${view === 'Customer' ? 'fa-cog' : 'fa-user'}`}></i>
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pt-8">
        {view === 'Customer' ? (
          <div className="space-y-8">
            {myToken && activeQueue ? (
              <section className="animate-in fade-in slide-in-from-top duration-500">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <p className="text-blue-100 text-sm font-medium uppercase tracking-widest mb-1">Your Virtual Token</p>
                        <h2 className="text-3xl font-black">{activeQueue.name}</h2>
                      </div>
                      <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-2xl font-black">
                        #{myToken.number}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                        <p className="text-blue-100 text-xs font-bold uppercase mb-2">People Ahead</p>
                        <p className="text-4xl font-black">{Math.max(0, peopleAhead)}</p>
                      </div>
                      <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                        <p className="text-blue-100 text-xs font-bold uppercase mb-2">Estimated Wait</p>
                        <p className="text-4xl font-black">{Math.max(0, peopleAhead * activeQueue.avgWaitPerPerson)}m</p>
                      </div>
                      <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                        <p className="text-blue-100 text-xs font-bold uppercase mb-2">Currently Serving</p>
                        <p className="text-4xl font-black">#{activeQueue.currentlyServing}</p>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
                       <div className="flex items-center space-x-3 mb-3">
                         <i className="fa-solid fa-wand-magic-sparkles text-yellow-300"></i>
                         <span className="text-sm font-bold text-blue-100">AI Assistant Insight</span>
                       </div>
                       <p className="text-lg leading-relaxed text-white/90">
                         {isLoadingInsight ? (
                           <span className="inline-flex items-center">
                             <i className="fa-solid fa-spinner animate-spin mr-2"></i> Thinking...
                           </span>
                         ) : aiInsight}
                       </p>
                    </div>

                    <div className="mt-8 flex justify-center">
                      <button 
                        onClick={cancelToken}
                        className="text-white/60 hover:text-white text-sm font-bold uppercase tracking-widest border border-white/20 px-8 py-3 rounded-xl transition-all hover:bg-white/10"
                      >
                        Cancel Token
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <section>
                <div className="mb-8">
                  <h1 className="text-3xl font-black text-slate-800 mb-2">Join a Queue</h1>
                  <p className="text-slate-500">Save time by getting your virtual token remotely.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {queues.map(q => (
                    <QueueCard 
                      key={q.id} 
                      queue={q} 
                      onJoin={handleJoinQueue}
                      isJoined={!!myToken}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <AdminDashboard 
            queues={queues} 
            onNext={handleNext}
            onReset={handleReset}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </main>

      {/* Global Notification */}
      {notification && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md animate-bounce">
          <div className="bg-orange-500 text-white p-6 rounded-2xl shadow-2xl flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl">
                <i className="fa-solid fa-bell"></i>
              </div>
              <div>
                <p className="font-bold text-lg">Queue Update!</p>
                <p className="text-sm text-orange-50">{notification}</p>
              </div>
            </div>
            <button onClick={() => setNotification(null)} className="p-2 hover:bg-white/10 rounded-lg">
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Footer Nav */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-slate-200 px-6 py-4 flex justify-around">
        <button 
          onClick={() => setView('Customer')}
          className={`flex flex-col items-center space-y-1 ${view === 'Customer' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <i className="fa-solid fa-home text-xl"></i>
          <span className="text-[10px] font-bold uppercase">Customer</span>
        </button>
        <button 
          onClick={() => setView('Admin')}
          className={`flex flex-col items-center space-y-1 ${view === 'Admin' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <i className="fa-solid fa-user-tie text-xl"></i>
          <span className="text-[10px] font-bold uppercase">Staff</span>
        </button>
      </footer>
    </div>
  );
};

export default App;
