export interface DistrictCollection {
  district: string;
  totalAmount: number;
}

export interface CategoryCollection {
  category: string;
  totalAmount: number;
}

export interface StatusOverview {
  status: string;
  count: number;
}

export interface DashboardStats {
  totalRevenue: number;
  districtCollections: DistrictCollection[];
  categoryCollections: CategoryCollection[];
  overview: StatusOverview[];
}
