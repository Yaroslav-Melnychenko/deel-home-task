import React, { useState, useCallback } from 'react';
import Input from '../Input';
import SearchResult from './components/SearchResult';
import { useDebounce } from '../../hooks';
import { DataInterface } from './utils';
import styles from './App.module.scss';

const App: React.FC = () => {
  const [value, setValue] = useState<string>('');
  const [data, setData] = useState<DataInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSearch = useCallback(async () => {
    setIsLoading(true);
    // We are using the real API call to resource
    try {
      const response = await fetch(`https://dummyjson.com/products/search?q=${value}`);
      const { products } = await response.json();
      setData(products);
    } catch (e) {
      console.log('failed to fetch', e);
    } finally {
      setIsLoading(false);
    }

  }, [value])

  // We are using debounce to prevent send request to the server each time user clicks on the key
  // We can change the value for example from one second to three second to optimize the calls
  useDebounce(() => {
    if (value.length > 0) {
      onSearch();
    } else {
      setData([]);
    }
  }, [value], 1000);

  return (
    <div className={styles.container}>
      <Input
        value={value}
        isLoading={isLoading}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      />
      {data.length > 0 && (
        <SearchResult value={value} data={data} />
      )}
    </div>
  );
}

export default App;
