import { Role } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import { authOptions } from '../pages/api/auth/[...nextauth]';
import { HttpMethod } from './const/httpMethod';

export type ApiErrorResponse = { statusCode: number; errors: ApiErrorDetail[] };
export type ApiErrorDetail = { code: string; message: string };

export type StatusCode = { statusCode: number };

export function unauthorized(res: NextApiResponse) {
  res.status(401).send({ statusCode: 401, errors: [{ code: '', message: 'unauthorized' }] });
}

export function forbidden(res: NextApiResponse) {
  res.status(403).send({ statusCode: 403, errors: [{ code: '', message: 'forbidden.' }] });
}

export function notFound(res: NextApiResponse, error: ApiErrorDetail) {
  res.status(404).send({ statusCode: 404, errors: [{ code: '', message: 'not found.' }] });
}

export function methodNotAllowed(res: NextApiResponse) {
  res.status(405).send({ statusCode: 405, errors: [{ code: '', message: 'method not allowed.' }] });
}

export async function requireAuthentication(req: NextApiRequest, res: NextApiResponse, callback: (session: Session) => void) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    unauthorized(res);
    return;
  }

  callback(session);
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

  if (roles.length > 0 && !roles.includes(session.user.role)) {
    forbidden(res);
    return { isValid: false };
  }

  return { isValid: true, session };
}
