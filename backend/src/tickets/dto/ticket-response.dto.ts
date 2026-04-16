export class TicketResponseDto {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  userId: string;
  assignedToId: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    email: string;
  };
  assignedTo?: {
    id: string;
    email: string;
  } | null;
}
