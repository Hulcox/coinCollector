import { Value } from "./Value";

export type Coin = {
  id: string;
  [key: string]: any;
  values?: Value[];
};
