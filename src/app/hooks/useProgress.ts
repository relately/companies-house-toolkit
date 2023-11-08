import { useEffect, useState } from 'react';

type GetTotal = () => Promise<number | null>;

export const useProgress = (getTotal: GetTotal) => {
  const [total, setTotal] = useState<number | null | undefined>(undefined);
  const [progress, setProgress] = useState(0);

  const calculateTotal = async () => {
    setTotal(await getTotal());
  };

  useEffect(() => {
    void calculateTotal();
  }, []);

  return { total, progress, setProgress };
};
