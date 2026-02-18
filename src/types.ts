export type GrantType = "client_credentials" | "password";
export type ProjectRole = "admin" | "editor" | "viewer";

export type ExportFormat =
  | "androidxml"
  | "csv"
  | "xliff12"
  | "jsonflat"
  | "jsonnested"
  | "yamlflat"
  | "yamlnested"
  | "properties"
  | "po"
  | "strings";

export interface AuthConfig {
  grantType: GrantType;
  clientId?: string;
  clientSecret?: string;
  username?: string;
  password?: string;
}

export interface ResolvedConfig {
  baseUrl: string;
  auth?: AuthConfig;
  accessToken?: string;
  defaultHeaders?: Record<string, string>;
}

export interface UserConfigInput {
  baseUrl?: string;
  accessToken?: string;
  defaultHeaders?: Record<string, string>;
  auth?: Partial<AuthConfig> & {
    grant_type?: GrantType;
    client_id?: string;
    client_secret?: string;
  };
  grantType?: GrantType;
  grant_type?: GrantType;
  clientId?: string;
  client_id?: string;
  clientSecret?: string;
  client_secret?: string;
  username?: string;
  password?: string;
}

export type UserConfigFactory = (ctx: {
  env: NodeJS.ProcessEnv;
  cwd: string;
}) => UserConfigInput | Promise<UserConfigInput>;

export interface AccessTokenResponse {
  access_token: string;
  expires_in: string;
  token_type: string;
}

export interface ApiRequestOptions {
  query?: Record<string, unknown>;
  body?: unknown;
  headers?: Record<string, string>;
}

export interface DataResponse<T> {
  data: T;
}

export interface ListResponse<T> {
  data: T[];
}

export interface ProjectDTO {
  id: string;
  name: string;
  description: string;
  localesCount: number;
  termsCount: number;
  role: ProjectRole;
}

export interface ProjectTermDTO {
  id: string;
  value: string;
  labels: string[];
}

export interface ProjectLabelDTO {
  id: string;
  value: string;
  color: string;
}

export interface LocaleDTO {
  code: string;
  language: string;
  region: string;
}

export interface ProjectLocaleDTO {
  id: string;
  locale: LocaleDTO;
}

export interface TermTranslationDTO {
  termId: string;
  value: string;
  labels: string[];
}

export interface ProjectStatsDTO {
  progress: number;
  translated: number;
  total: number;
  terms: number;
  locales: number;
}

export interface ProjectStatusDTO {
  projectStats: ProjectStatsDTO;
  localeStats: Record<string, unknown>;
}

export interface ProjectClientWithSecretDTO {
  id: string;
  name: string;
  role: ProjectRole;
  secret: string;
}

export interface CliState {
  currentProjectId?: string;
  currentLocale?: string;
}

export interface PersistedConfig {
  baseUrl: string;
  auth: {
    grantType: "client_credentials";
    clientId: string;
    clientSecret: string;
  };
}
