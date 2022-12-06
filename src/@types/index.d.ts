/* eslint-disable @typescript-eslint/no-unused-vars */
namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    readonly AZURE_AD_CLIENT_ID: string;
    readonly AZURE_AD_CLIENT_SECRET: string;
    readonly AZURE_AD_TENANT_ID: string;
    readonly GITHUB_ID: string;
    readonly GITHUB_SECRET: string;

    readonly COGNITO_CLIENT_ID: string;
    readonly COGNITO_CLIENT_SECRET: string;
    readonly COGNITO_ISSUER: string;

    readonly NEXT_PUBLIC_DEBUG_MODE: 'true' | 'false';
  }
}
