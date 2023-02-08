import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { Session } from 'next-auth/core/types';

import { Role } from '@prisma/client';

import { authOptions } from '../pages/api/auth/[...nextauth]';
import { HttpMethod } from './const/httpMethod';
import { role } from './const/role';

export type ApiErrorResponse = { statusCode: number; errors: ApiErrorDetail[] };
export type ApiErrorDetail = { code: string; message: string };

export type StatusCode = { statusCode: number };

export function badRequest(res: NextApiResponse) {
  res.status(400).send({ error: { statusCode: 400, errors: [{ code: '', message: 'invalid parameter.' }] } });
}

export function unauthorized(res: NextApiResponse) {
  res.status(401).send({ error: { statusCode: 401, errors: [{ code: '', message: '認証されていません。' }] } });
}

export function forbidden(res: NextApiResponse) {
  res.status(403).send({ error: { statusCode: 403, errors: [{ code: '', message: '権限がありません。.' }] } });
}

export function notFound(res: NextApiResponse) {
  res.status(404).send({ error: { statusCode: 404, errors: [{ code: '', message: 'not found.' }] } });
}

export function methodNotAllowed(res: NextApiResponse) {
  res.status(405).send({ error: { statusCode: 405, errors: [{ code: '', message: 'method not allowed.' }] } });
}

type ValidateOption = {
  httpMethods?: HttpMethod[];
  authorize?: boolean;
  roles?: Role[];
};

type result = {
  isValid: boolean;
  session?: Session;
};

export async function validate(
  req: NextApiRequest,
  res: NextApiResponse,
  { httpMethods = [], authorize = false, roles = [] }: ValidateOption = {}
): Promise<result> {
  if (httpMethods.length > 0 && !httpMethods.includes(req.method as HttpMethod)) {
    methodNotAllowed(res);
    return { isValid: false };
  }

  if (!authorize && roles.length === 0) {
    return { isValid: true };
  }

  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    unauthorized(res);
    return { isValid: false };
  }

  if (session.user.role != role.superAdmin && roles.length > 0 && !roles.includes(session.user.role)) {
    forbidden(res);
    return { isValid: false };
  }

  return { isValid: true, session };
}
