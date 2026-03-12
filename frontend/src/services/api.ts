import ky from 'ky';

const api = ky.create({
    prefixUrl: 'http://localhost:5000/api',
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