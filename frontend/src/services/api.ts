import ky from 'ky';

const api = ky.create({
    prefixUrl: 'http://localhost:5000/api',
});

export const fetchTransactions = async () => {
    // Ky's .json() returns the parsed body directly
    return await api.get('transactions').json<any>();
};

export const fetchDonors = async () => {
    return await api.get('donors').json<any>();
};