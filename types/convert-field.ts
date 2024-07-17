type OverwriteProp<T, U, V> = {
    [K in keyof T]: T[K] extends U ? V : T[K];
  };

// Example: type ObjectDateTime<T> = OverwriteProp<T, Date, string>;