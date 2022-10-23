import { NextApiResponse } from 'next';

export type ApiErrorResponse = { statusCode: number; errors: ApiErrorDetail[] };
export type ApiErrorDetail = { code: string; message: string };

export type StatusCode = { statusCode: number };

export function notFound(res: NextApiResponse, error: ApiErrorDetail) {
  res.status(404).send({
    statusCode: 404,
    errors: [{ code: 'string', message: 'string' }],
  });
}
