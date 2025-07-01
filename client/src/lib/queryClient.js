import { QueryClient } from "@tanstack/react-query";
async function throwIfResNotOk(res) {
    if (!res.ok) {
        const text = (await res.text()) || res.statusText;
        throw new Error(`${res.status}: ${text}`);
    }
}
export async function apiRequest(method, url, data) {
    const res = await fetch(url, {
        method,
        headers: data ? { "Content-Type": "application/json" } : {},
        body: data ? JSON.stringify(data) : undefined,
        credentials: "include",
    });
    await throwIfResNotOk(res);
    return res;
}
export const getQueryFn = ({ on401: unauthorizedBehavior }) => async ({ queryKey }) => {
    const res = await fetch(queryKey[0], {
        credentials: "include",
    });
    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
    }
    await throwIfResNotOk(res);
    return await res.json();
};
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: getQueryFn({ on401: "throw" }),
            refetchInterval: false,
            refetchOnWindowFocus: false, // Prevent refetch on window focus
            refetchOnMount: false, // Prevent refetch on component mount if data exists
            refetchOnReconnect: 'always', // Only refetch on network reconnect
            staleTime: 5 * 60 * 1000, // 5 minutes default stale time
            gcTime: 15 * 60 * 1000, // 15 minutes garbage collection time
            retry: (failureCount, error) => {
                // Don't retry on 404 errors (city not found)
                if (error instanceof Error && error.message.includes('404')) {
                    return false;
                }
                // Retry up to 2 times for other errors
                return failureCount < 2;
            },
        },
        mutations: {
            retry: false,
        },
    },
});
