import { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import { ErrorResponse } from "../interface/errorInterface";

// export function useApi<T = unknown>(
//   apiFunction: (...args: any[]) => Promise<AxiosResponse<T>>
// ) {
//   const [data, setData] = useState<T | null>(null);
//   const [error, setError] = useState<ErrorResponse | null>(null);
//   const [loading, setLoading] = useState(false);

//   const execute = async (...args: any[]): Promise<T | null> => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await apiFunction(...args);
//       setData(response.data);
//       return response.data;
//     } catch (err) {
//       const axiosError = err as AxiosError<ErrorResponse>;
//       setError(axiosError.response?.data || null);
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { data, error, loading, execute };
// }

export function useApi<T = unknown, A extends unknown[] = unknown[]>(
  apiFunction: (...args: A) => Promise<AxiosResponse<T>>,
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = async (...args: A): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunction(...args);
      setData(response.data);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(axiosError.response?.data || null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, execute };
}
