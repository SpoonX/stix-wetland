export type IdParamType = { state: { params: { id: number; } } };
export type BodyParamType = {
  request?: { body: any; };
  state?: {
    params?: { id: number; };
    [key: string]: any;
  };
};
