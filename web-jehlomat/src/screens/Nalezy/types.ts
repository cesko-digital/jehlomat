export interface Range {
  from: number;
  to: number;
}

export interface ActiveFilter {
  createdAt?: Range;
  createdBy?: {
    id: number;
    type: string;
  };
  demolishedAt?: Range;
  status?: string;
}