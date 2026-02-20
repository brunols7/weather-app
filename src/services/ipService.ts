import axios from 'axios';

export const getPublicIP = async (): Promise<string> => {
  const response = await axios.get<{ query: string }>(
    'http://ip-api.com/json/'
  );
  return response.data.query;
};