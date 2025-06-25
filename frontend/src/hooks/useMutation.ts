import { useState } from "react";

type MutationFn<TData, TVariables> = (variables: TVariables) => Promise<TData>;

export function useMutation<TData, TVariables>(
  mutationFn: MutationFn<TData, TVariables>
) {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const mutate = async (variables: TVariables) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutationFn(variables);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
  };

  return { mutate, data, loading, error, reset };
}
