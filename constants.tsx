
import React from 'react';
import { Queue } from './types';

export const MOCK_QUEUES: Queue[] = [
  {
    id: 'q1',
    name: 'General Physician - Dr. Smith',
    category: 'Clinic',
    description: 'General checkups and prescriptions.',
    currentlyServing: 12,
    totalTokens: 25,
    avgWaitPerPerson: 10,
    status: 'Open',
  },
  {
    id: 'q2',
    name: 'Main Branch - Cashier Services',
    category: 'Bank',
    description: 'Cash deposits, withdrawals, and account queries.',
    currentlyServing: 45,
    totalTokens: 62,
    avgWaitPerPerson: 5,
    status: 'Open',
  },
  {
    id: 'q3',
    name: 'Student Admissions Office',
    category: 'Office',
    description: 'New enrollments and documentation.',
    currentlyServing: 5,
    totalTokens: 18,
    avgWaitPerPerson: 15,
    status: 'Open',
  },
  {
    id: 'q4',
    name: 'Technical Support Desk',
    category: 'Retail',
    description: 'Hardware repairs and software troubleshooting.',
    currentlyServing: 8,
    totalTokens: 10,
    avgWaitPerPerson: 20,
    status: 'Paused',
  }
];

export const CATEGORY_ICONS = {
  Clinic: <i className="fa-solid fa-stethoscope text-red-500"></i>,
  Bank: <i className="fa-solid fa-building-columns text-blue-500"></i>,
  Office: <i className="fa-solid fa-briefcase text-slate-500"></i>,
  Retail: <i className="fa-solid fa-shop text-orange-500"></i>,
};
