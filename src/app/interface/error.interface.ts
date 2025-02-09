export type TErrorSources = {
  path: string | number;
  message: string;
}[];

export type TErrorResponse = {
  message: string;
  statusCode: number;
  errorSource: TErrorSources;
};
