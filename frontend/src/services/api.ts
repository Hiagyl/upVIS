import ky, { HTTPError } from 'ky';

const api = ky.create({
  prefixUrl: "http://localhost:5001/api/v1",
  credentials: "include",
});

export const transactionService = {
  getAll: () => api.get('transactions').json<any>(),
  create: (data: any) => api.post('transactions', { json: data }).json(),
  update: (id: string, data: any) => api.put(`transactions/${id}`, { json: data }).json(),
  delete: (id: string) => api.delete(`transactions/${id}`).json(),
};

export const donorService = {
  getAll: () => api.get('donors').json<any>(),
  create: (data: any) => api.post('donors', { json: data }).json(),
  update: (id: string, data: any) => api.put(`donors/${id}`, { json: data }).json(),
  delete: (id: string) => api.delete(`donors/${id}`).json(),
};

export const scholarService = {
  getAll: () => api.get('scholars').json<any>(),
  create: (data: any) => api.post('scholars', { json: data }).json(),
  update: (id: string, data: any) => api.put(`scholars/${id}`, { json: data }).json(),
  delete: (id: string) => api.delete(`scholars/${id}`).json(),
};
export const memberService = {
  getAll: () => api.get('members').json<any>(),
  getOne: (id: string) => api.get(`members/${id}`).json<any>(),
  create: (data: any) => api.post('members', { json: data }).json(),
  update: (id: string, data: any) => api.put(`members/${id}`, { json: data }).json(),
  delete: (id: string) => api.delete(`members/${id}`).json(),
};
export const authService = {
  login: (credentials: any) =>
    api.post("login", { json: credentials }).json<any>(),

  register: (userData: any) =>
    api.post("register", { json: userData }).json<any>(),

  checkStatus: () => api.get("login/me").json<any>(),
  logout: () => api.post("login/logout").json<any>(),
};

export const applicationService = {
  create: (data: any) => api.post("applications", { json: data }).json<any>(),
  getAll: (filters?: { status?: string; type?: string; email?: string }) =>
    api.get("applications", { searchParams: filters }).json<any>(),
  getById: (id: string) => api.get(`applications/${id}`).json<any>(),
  review: (
    id: string,
    data: { status: string; reviewNotes?: string; rejectionReason?: string },
  ) => api.patch(`applications/${id}/review`, { json: data }).json<any>(),
};
export const statsService = {
  getLandingStats: () => api.get("stats/landing").json<any>(),
};

export const pollService = {
  getAll: () => api.get("polls").json<any>(),
  getResults: (id: string) => api.get(`polls/${id}/results`).json<any>(),
  create: (data: any) => api.post("polls", { json: data }).json<any>(),
  update: (id: string, data: any) => api.put(`polls/${id}`, { json: data }).json<any>(),
  close: (id: string) => api.patch(`polls/${id}/close`).json<any>(),
  delete: (id: string) => api.delete(`polls/${id}`).json<any>(),
};

export const voteService = {
  cast: (pollId: string, selectedOption: string) =>
    api.post("votes", { json: { pollId, selectedOption } }).json<any>(),
  myVote: (pollId: string) => api.get(`votes/poll/${pollId}/my-vote`).json<any>(),
  changeVote: (pollId: string, selectedOption: string) =>       
    api.put(`votes/poll/${pollId}/change`, { json: { selectedOption } }).json<any>(),
};


export const getApiErrorMessage = async (error: unknown) => {
  if (error instanceof HTTPError) {
    try {
      const response = await error.response.json<any>();
      return response.error || response.errors?.message || error.message;
    } catch {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

export const reportService = {
  downloadMonthlyReport: async () => {
    const response = await api.get("reports/monthly-donors");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Donor_Report_${new Date().getMonth() + 1}.pdf`;
    a.click();
  },

  downloadFinancialSummary: async (): Promise<void> => {
    try {
      // Ky handles the 'blob' type via the .blob() method
      const blob = await api.get("reports/financial-summary").blob();

      // Create a local URL for the binary data
      const url = window.URL.createObjectURL(blob);

      // Create a temporary hidden link to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Financial_Summary_${new Date().toLocaleDateString()}.pdf`);

      // Append, trigger, and cleanup
      document.body.appendChild(link);
      link.click();

      // Clean up DOM and memory
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download the financial report:", error);
      throw error;
    }
  }
};

