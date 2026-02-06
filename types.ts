
export interface Queue {
  id: string;
  name: string;
  category: 'Clinic' | 'Bank' | 'Office' | 'Retail';
  description: string;
  currentlyServing: number;
  totalTokens: number;
  avgWaitPerPerson: number; // in minutes
  status: 'Open' | 'Closed' | 'Paused';
}

export interface Token {
  id: string;
  queueId: string;
  queueName: string;
  number: number;
  createdAt: number;
  status: 'Waiting' | 'Serving' | 'Completed' | 'Cancelled';
}

export type ViewMode = 'Customer' | 'Admin';
