export interface Street {
  _id: string;
  created_at: string;
  name: string;
  coordinates: [number, number][];
  tags: string[];
  desc: Array<{
    score: number;
    desc: string;
  }>;
  pics: Array<{
    coordinate: [number, number];
    url: string;
    desc: string;
  }>;
}
