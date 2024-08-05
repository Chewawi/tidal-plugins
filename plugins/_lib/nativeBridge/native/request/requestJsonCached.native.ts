import { requestJson, ExtendedRequestOptions } from ".";

import { libTrace } from "../../helpers/trace.native";

const requestCache: Record<string, Promise<unknown>> = {};
export const requestJsonCached = async <T>(url: string, options?: ExtendedRequestOptions): Promise<T> => {
	const _cachedRes = requestCache[url];
	if (_cachedRes !== undefined) {
		libTrace.debug("[CACHE HIT]", url);
		return <T>_cachedRes;
	}
	return (requestCache[url] = requestJson<T>(url, options));
};
