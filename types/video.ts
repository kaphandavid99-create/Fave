export interface Video {
  id: string;
  video_url: string;
  video_public_id: string | null;
  description: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}