import ky from 'ky';

const api = ky.create({
    prefixUrl: 'http://localhost:5000/api/v1',
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