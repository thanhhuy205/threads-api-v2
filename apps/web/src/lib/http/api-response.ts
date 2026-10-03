type SuccessOptions = {
  status?: number;
  message?: string;
  headers?: HeadersInit;
};

type ErrorOptions = {
  status?: number;
  errors?: unknown;
  data?: unknown;
  headers?: HeadersInit;
};

export class ApiResponse {
  static success<T>(data: T, options?: SuccessOptions) {
    const { status = 200, message = "OK", headers } = options ?? {};

    return Response.json(
      {
        success: true,
        message,
        data,
      },
      { status, headers }
    );
  }

  static error(message: string, options?: ErrorOptions) {
    const { status = 500, errors, data, headers } = options ?? {};

    return Response.json(
      {
        success: false,
        message,
        ...(errors !== undefined ? { errors } : {}),
        ...(data !== undefined ? { data } : {}),
      },
      { status, headers }
    );
  }

  static validation(errors: unknown, message = "Validation failed") {
    return ApiResponse.error(message, {
      status: 422,
      errors,
    });
  }

  static async fromUpstream(upstream: Response) {
    const contentType = upstream.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      try {
        const payload = await upstream.json();
        return Response.json(payload, { status: upstream.status });
      } catch {
        return ApiResponse.error("Invalid JSON response from upstream", {
          status: 502,
        });
      }
    }

    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: contentType ? { "content-type": contentType } : undefined,
    });
  }
}

