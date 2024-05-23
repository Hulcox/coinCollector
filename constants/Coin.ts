import { Value } from "./Value";

export type CoinType = {
  id: string;
  [key: string]: any;
  values?: Value[];
};
