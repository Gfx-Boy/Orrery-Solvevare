import axios from 'axios';

export interface NEOData {
  id: string;
  name: string;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_max: number;
    };
  };
  close_approach_data: Array<{
      "miss_distance":{
        "astronomical": "0.0421329804",
        "lunar": "16.3947296143",
        "kilometers": "6295569.429564",
        "miles": "3912439.379383"
      }
    relative_velocity: {
      kilometers_per_second: string;
    };
  }>;
}

const NASA_API_KEY = 'b3gRX9WtMAgcX8XTQmwPFOOYlj6eWcle2U2kUIEW';
const NEO_API_URL = `https://api.nasa.gov/neo/rest/v1/feed?api_key=${NASA_API_KEY}`;

export async function fetchNEOData(startDate: string = '2024-10-01', endDate: string = '2024-10-05'): Promise<NEOData[]> {
  try {
    const response = await axios.get(NEO_API_URL, {
      params: { start_date: startDate, end_date: endDate },
    });

    // Log the response to check if data is being fetched correctly
    console.log('Fetched NEO Data:', response.data);

    // NASA API groups NEOs by date, so we flatten it to get an array of NEOs
    const neos = Object.values(response.data.near_earth_objects).flat();
    return neos as NEOData[];
  } catch (error) {
    console.error('Error fetching NEO data:', error);
    return [];
  }
}
