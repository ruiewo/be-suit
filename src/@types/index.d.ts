// type ApiErrorResponse = { statusCode: number; errors: ApiErrorDetail[] };
// type ApiErrorDetail = { code: string; message: string };

// type StatusCode = { statusCode: number };
namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    AZURE_AD_CLIENT_ID: string;
    AZURE_AD_CLIENT_SECRET: string;
    AZURE_AD_TENANT_ID: string;
    GITHUB_ID: string;
    GITHUB_SECRET: string;
  }
}
