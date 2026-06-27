export interface MonthData {
  month: string;
  count: number;
}

export interface AnalyticsData {
  last12Months: MonthData[];
}

export interface GetUsersAnalyticsResponse {
  success: boolean;
  users: AnalyticsData;
}

export interface GetOrdersAnalyticsResponse {
  success: boolean;
  orders: AnalyticsData;
}

export interface GetCoursesAnalyticsResponse {
  success: boolean;
  courses: AnalyticsData;
}
