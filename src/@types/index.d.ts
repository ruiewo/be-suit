type ApiErrorResponse = { statusCode: number; errors: ApiErrorDetail[] };
type ApiErrorDetail = { code: string; message: string };

type StatusCode = { statusCode: number };
