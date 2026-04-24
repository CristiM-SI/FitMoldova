export interface ContactMessageCreateDto {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessageInfoDto {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  status: string;
}
