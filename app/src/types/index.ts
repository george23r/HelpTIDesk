export interface User {
  id: string;
  email: string;
  token?: string;
  role?: 'USER' | 'ADMIN';
  isSupport?: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  description: string | null;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  userId: string;
  assignedToId: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
  };
  assignedTo?: {
    id: string;
    email: string;
  } | null;
}

export interface CreateTicketInput {
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export interface LoginInput {
  email: string;
  password: string;
}
