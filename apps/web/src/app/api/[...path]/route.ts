import { forwardProxyRequest } from "@/app/api/_gateway";

type RouteContext = {
  params: Promise<{ path?: string[] }>;
};

const getGatewayPath = async (context: RouteContext) => {
  const { path = [] } = await context.params;
  return `/${path.map((segment) => encodeURIComponent(segment)).join("/")}`;
};

const handleProxyRequest = async (request: Request, context: RouteContext) =>
  forwardProxyRequest(request, await getGatewayPath(context));

export const GET = handleProxyRequest;
export const POST = handleProxyRequest;
export const PUT = handleProxyRequest;
export const PATCH = handleProxyRequest;
export const DELETE = handleProxyRequest;
export const OPTIONS = handleProxyRequest;
