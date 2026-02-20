import axios from 'axios';

export type IPApiLocation = {
  lat: number;
  lon: number;
};

export const getLocationByIP = async (
  ip: string
): Promise<IPApiLocation> => {
  const response = await axios.get<IPApiLocation>(
    `http://ip-api.com/json/${ip}`
  );
  
  if ('error' in response.data) {
    throw new Error('Erro ao buscar localização pelo IP');
  }

  return response.data;
};