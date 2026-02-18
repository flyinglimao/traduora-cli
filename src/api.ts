import { TraduoraClient } from "./client.js";
import type {
  DataResponse,
  ExportFormat,
  ListResponse,
  LocaleDTO,
  ProjectClientWithSecretDTO,
  ProjectDTO,
  ProjectLabelDTO,
  ProjectLocaleDTO,
  ProjectRole,
  ProjectStatusDTO,
  ProjectTermDTO,
  TermTranslationDTO,
} from "./types.js";

function unwrapList<T>(payload: { data: T[] | T }): T[] {
  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  return [payload.data];
}

function labelColorFromValue(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }

  const normalized = Math.abs(hash) % 0xffffff;
  return `#${normalized.toString(16).padStart(6, "0")}`;
}

export class TraduoraApi {
  private readonly client: TraduoraClient;

  public constructor(client: TraduoraClient) {
    this.client = client;
  }

  public async listProjects(): Promise<ProjectDTO[]> {
    const response = await this.client.request<ListResponse<ProjectDTO>>("GET", "/api/v1/projects");
    return response.data;
  }

  public async getProject(projectId: string): Promise<ProjectDTO> {
    const response = await this.client.request<DataResponse<ProjectDTO>>(
      "GET",
      `/api/v1/projects/${projectId}`
    );
    return response.data;
  }

  public async createProject(input: { name: string; description?: string }): Promise<ProjectDTO> {
    const response = await this.client.request<DataResponse<ProjectDTO>>("POST", "/api/v1/projects", {
      body: input,
    });
    return response.data;
  }

  public async updateProject(
    projectId: string,
    input: { name?: string; description?: string }
  ): Promise<ProjectDTO> {
    const response = await this.client.request<DataResponse<ProjectDTO>>(
      "PATCH",
      `/api/v1/projects/${projectId}`,
      {
        body: input,
      }
    );
    return response.data;
  }

  public async deleteProject(projectId: string): Promise<void> {
    await this.client.request("DELETE", `/api/v1/projects/${projectId}`);
  }

  public async getProjectStatus(projectId: string): Promise<ProjectStatusDTO> {
    const response = await this.client.request<DataResponse<ProjectStatusDTO>>(
      "GET",
      `/api/v1/projects/${projectId}/stats`
    );
    return response.data;
  }

  public async listTerms(projectId: string): Promise<ProjectTermDTO[]> {
    const response = await this.client.request<ListResponse<ProjectTermDTO>>(
      "GET",
      `/api/v1/projects/${projectId}/terms`
    );
    return response.data;
  }

  public async addTerm(projectId: string, value: string): Promise<ProjectTermDTO> {
    const response = await this.client.request<DataResponse<ProjectTermDTO>>(
      "POST",
      `/api/v1/projects/${projectId}/terms`,
      {
        body: { value },
      }
    );
    return response.data;
  }

  public async updateTerm(projectId: string, termId: string, value: string): Promise<ProjectTermDTO> {
    const response = await this.client.request<DataResponse<ProjectTermDTO>>(
      "PATCH",
      `/api/v1/projects/${projectId}/terms/${termId}`,
      {
        body: { value },
      }
    );
    return response.data;
  }

  public async deleteTerm(projectId: string, termId: string): Promise<void> {
    await this.client.request("DELETE", `/api/v1/projects/${projectId}/terms/${termId}`);
  }

  public async listProjectLocales(projectId: string): Promise<ProjectLocaleDTO[]> {
    const response = await this.client.request<ListResponse<ProjectLocaleDTO>>(
      "GET",
      `/api/v1/projects/${projectId}/translations`
    );
    return response.data;
  }

  public async addProjectLocale(projectId: string, localeCode: string): Promise<ProjectLocaleDTO> {
    const response = await this.client.request<DataResponse<ProjectLocaleDTO>>(
      "POST",
      `/api/v1/projects/${projectId}/translations`,
      {
        body: { code: localeCode },
      }
    );
    return response.data;
  }

  public async listTranslations(projectId: string, localeCode: string): Promise<TermTranslationDTO[]> {
    const response = await this.client.request<ListResponse<TermTranslationDTO>>(
      "GET",
      `/api/v1/projects/${projectId}/translations/${localeCode}`
    );
    return response.data;
  }

  public async updateTranslation(
    projectId: string,
    localeCode: string,
    termId: string,
    value: string
  ): Promise<TermTranslationDTO> {
    const response = await this.client.request<DataResponse<TermTranslationDTO>>(
      "PATCH",
      `/api/v1/projects/${projectId}/translations/${localeCode}`,
      {
        body: { termId, value },
      }
    );
    return response.data;
  }

  public async deleteLocale(projectId: string, localeCode: string): Promise<void> {
    await this.client.request("DELETE", `/api/v1/projects/${projectId}/translations/${localeCode}`);
  }

  public async listLabels(projectId: string): Promise<ProjectLabelDTO[]> {
    const response = await this.client.request<{ data: ProjectLabelDTO[] | ProjectLabelDTO }>(
      "GET",
      `/api/v1/projects/${projectId}/labels`
    );
    return unwrapList(response);
  }

  public async createLabel(projectId: string, value: string, color?: string): Promise<ProjectLabelDTO> {
    const response = await this.client.request<DataResponse<ProjectLabelDTO>>(
      "POST",
      `/api/v1/projects/${projectId}/labels`,
      {
        body: {
          value,
          color: color ?? labelColorFromValue(value),
        },
      }
    );
    return response.data;
  }

  public async ensureLabels(projectId: string, values: string[]): Promise<ProjectLabelDTO[]> {
    if (values.length === 0) {
      return [];
    }

    const existing = await this.listLabels(projectId);
    const map = new Map(existing.map((label) => [label.value, label] as const));

    for (const value of values) {
      if (map.has(value)) {
        continue;
      }

      const created = await this.createLabel(projectId, value);
      map.set(created.value, created);
    }

    const out: ProjectLabelDTO[] = [];
    for (const value of values) {
      const label = map.get(value);
      if (label) {
        out.push(label);
      }
    }

    return out;
  }

  public async setTermLabels(
    projectId: string,
    termId: string,
    currentLabelValues: string[],
    targetLabelValues: string[]
  ): Promise<void> {
    const targetLabels = await this.ensureLabels(projectId, targetLabelValues);
    const allLabels = await this.listLabels(projectId);
    const labelByValue = new Map(allLabels.map((label) => [label.value, label] as const));

    const targetSet = new Set(targetLabelValues);
    const currentSet = new Set(currentLabelValues);

    for (const label of targetLabels) {
      if (currentSet.has(label.value)) {
        continue;
      }
      await this.client.request(
        "POST",
        `/api/v1/projects/${projectId}/labels/${label.id}/terms/${termId}`
      );
    }

    for (const currentValue of currentSet) {
      if (targetSet.has(currentValue)) {
        continue;
      }
      const label = labelByValue.get(currentValue);
      if (!label) {
        continue;
      }
      await this.client.request(
        "DELETE",
        `/api/v1/projects/${projectId}/labels/${label.id}/terms/${termId}`
      );
    }
  }

  public async setTranslationLabels(
    projectId: string,
    localeCode: string,
    termId: string,
    currentLabelValues: string[],
    targetLabelValues: string[]
  ): Promise<void> {
    const targetLabels = await this.ensureLabels(projectId, targetLabelValues);
    const allLabels = await this.listLabels(projectId);
    const labelByValue = new Map(allLabels.map((label) => [label.value, label] as const));

    const targetSet = new Set(targetLabelValues);
    const currentSet = new Set(currentLabelValues);

    for (const label of targetLabels) {
      if (currentSet.has(label.value)) {
        continue;
      }
      await this.client.request(
        "POST",
        `/api/v1/projects/${projectId}/labels/${label.id}/terms/${termId}/translations/${localeCode}`
      );
    }

    for (const currentValue of currentSet) {
      if (targetSet.has(currentValue)) {
        continue;
      }
      const label = labelByValue.get(currentValue);
      if (!label) {
        continue;
      }
      await this.client.request(
        "DELETE",
        `/api/v1/projects/${projectId}/labels/${label.id}/terms/${termId}/translations/${localeCode}`
      );
    }
  }

  public async listLocales(): Promise<LocaleDTO[]> {
    const response = await this.client.request<ListResponse<LocaleDTO>>("GET", "/api/v1/locales");
    return response.data;
  }

  public async createProjectClient(
    projectId: string,
    input: { name: string; role: ProjectRole }
  ): Promise<ProjectClientWithSecretDTO> {
    const response = await this.client.request<DataResponse<ProjectClientWithSecretDTO>>(
      "POST",
      `/api/v1/projects/${projectId}/clients`,
      {
        body: input,
      }
    );
    return response.data;
  }

  public async exportProject(
    projectId: string,
    localeCode: string,
    format: ExportFormat
  ): Promise<Buffer> {
    return this.client.requestBuffer("GET", `/api/v1/projects/${projectId}/exports`, {
      query: {
        locale: localeCode,
        format,
      },
      headers: {
        accept: "application/octet-stream",
      },
    });
  }
}
