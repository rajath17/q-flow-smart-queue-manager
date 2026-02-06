
import React from 'react';
import { Queue } from '../types';
import { CATEGORY_ICONS } from '../constants';

interface QueueCardProps {
  queue: Queue;
  onJoin: (queueId: string) => void;
  isJoined: boolean;
}

const QueueCard: React.FC<QueueCardProps> = ({ queue, onJoin, isJoined }) => {
  const peopleAhead = queue.totalTokens - queue.currentlyServing;
  const estimatedWait = peopleAhead * queue.avgWaitPerPerson;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 rounded-xl">
          {CATEGORY_ICONS[queue.category]}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          queue.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {queue.status}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-slate-800 mb-1">{queue.name}</h3>
      <p className="text-slate-500 text-sm mb-4 line-clamp-2">{queue.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 p-3 rounded-xl">
          <p className="text-xs text-slate-400 font-medium mb-1">Serving Now</p>
          <p className="text-xl font-bold text-blue-600">#{queue.currentlyServing}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl">
          <p className="text-xs text-slate-400 font-medium mb-1">Est. Wait</p>
          <p className="text-xl font-bold text-slate-800">{estimatedWait}m</p>
        </div>
      </div>

      <button
        onClick={() => onJoin(queue.id)}
        disabled={isJoined || queue.status !== 'Open'}
        className={`w-full py-3 rounded-xl font-bold transition-all duration-200 ${
          isJoined 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
        }`}
      >
        {isJoined ? 'Already in Queue' : 'Join Queue'}
      </button>
    </div>
  );
};

export default QueueCard;
