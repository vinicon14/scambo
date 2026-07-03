export interface User {
  id: string;
  username: string;
  phone: string;
  password_hash: string;
  pix_key: string;
  created_at: string;
}

export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'refunded';

export interface Post {
  id: string;
  user_id: string;
  image_url: string;
  amount: number;
  payment_status: PaymentStatus;
  payment_id?: string;
  ranking_month: string;
  created_at: string;
  deleted_at?: string;
}

export interface RankingEntry {
  pos: number;
  post_id: string;
  image_url: string;
  username: string;
  amount: number;
  created_at: string;
}

export interface AdminUser {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
}

export interface MonthlyRanking {
  id: string;
  month: string;
  starts_at: string;
  ends_at: string;
  status: 'active' | 'archived';
  winner_user_id?: string;
  prize_amount?: number;
  prize_paid: boolean;
  created_at: string;
}

export interface HallOfFameEntry {
  id: string;
  winner_user_id: string;
  username: string;
  winner_image_url: string;
  month: string;
  posted_amount: number;
  prize_amount: number;
  created_at: string;
}

export interface PaymentConfig {
  id: string;
  access_token?: string;
  public_key?: string;
  pix_key?: string;
  sandbox: boolean;
  integration_status: 'connected' | 'disconnected' | 'error';
  updated_at: string;
}

export interface PrizeCalculation {
  winner_post_id: string;
  winner_user_id: string;
  winner_amount: number;
  total_others: number;
  estimated_prize: number;
}

export interface PostWithUser extends Post {
  users: Pick<User, 'username' | 'phone' | 'pix_key'>;
}
