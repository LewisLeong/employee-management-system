const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN ?? "";

type ApiMethod = "GET" | "PUT" | "PATCH" | "POST" | "DELETE";

type ApiRequestOptions = Omit<RequestInit, "method" | "body"> & {
  body?: BodyInit | Record<string, unknown>;
};

function buildHeaders(headers?: HeadersInit): Headers {
  const nextHeaders = new Headers(headers);

  if (API_TOKEN) {
    nextHeaders.set("Authorization", `Bearer ${API_TOKEN}`);
  }

  if (!nextHeaders.has("Content-Type")) {
    nextHeaders.set("Content-Type", "application/json");
  }

  return nextHeaders;
}

async function requestJson<T>(method: ApiMethod, path: string, options: ApiRequestOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    method,
    headers: buildHeaders(options.headers),
    body:
      options.body && typeof options.body === "object" && !(options.body instanceof FormData)
        ? JSON.stringify(options.body)
        : options.body,
  });


  if (!response.ok) {
    const errorText = await response.json();

    try {
      const errorBody = errorText as { message?: unknown; error?: unknown };
      const message =
        typeof errorBody.message === "string"
          ? errorBody.message
          : typeof errorBody.error === "string"
            ? errorBody.error
            : null;

      throw new Error(message || `Request failed with status ${response.status}.`);
    } catch {
      
      throw new Error(errorText.message || `Request failed with status ${response.status}.`);
    }
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, options?: ApiRequestOptions) => requestJson<T>("GET", path, options),
  put: <T>(path: string, options?: ApiRequestOptions) => requestJson<T>("PUT", path, options),
  patch: <T>(path: string, options?: ApiRequestOptions) => requestJson<T>("PATCH", path, options),
};
