import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export interface SalesReportItem {
  id_venta: number;
  fecha_venta: string;
  customer_name: string;
  products: string;
  total: number;
  status: string;
  id_usuario: number;
}

export interface SalesReportResponse {
  sales: SalesReportItem[];
  total_sales: number;
  completed_sales: number;
  total_records: number;
  period: string;
}

export interface SalesSummary {
  total_sales: number;
  completed_sales: number;
  pending_sales: number;
  total_records: number;
  average_order_value: number;
}

export interface ReportFilters {
  start_date?: string;
  end_date?: string;
  status_filter?: string;
  search_term?: string;
}

export const reportsService = {
  async getSalesReport(filters: ReportFilters): Promise<SalesReportResponse> {
    const params = new URLSearchParams();
    
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    if (filters.status_filter) params.append('status_filter', filters.status_filter);
    if (filters.search_term) params.append('search_term', filters.search_term);
    
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`${API_BASE_URL}/reports/sales?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  async getSalesSummary(filters: { start_date?: string; end_date?: string }): Promise<SalesSummary> {
    const params = new URLSearchParams();
    
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`${API_BASE_URL}/reports/sales/summary?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};
