import ky, { HTTPError } from 'ky';

const api = ky.create({
  prefixUrl: "http://localhost:5000/api/v1",
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
