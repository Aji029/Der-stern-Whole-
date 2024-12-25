import { supabase } from '../supabase';
import type { Report } from '../../types/report';

export async function fetchReports(): Promise<Report[]> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Report[];
  } catch (error) {
    console.error('Failed to fetch reports:', error);
    throw error;
  }
}

export async function createReport(report: Omit<Report, 'id' | 'created_at'>): Promise<void> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Authentication required');

    const { error } = await supabase
      .from('reports')
      .insert([{
        ...report,
        user_id: user.id
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to create report:', error);
    throw error;
  }
}