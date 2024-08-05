import { findModuleFunction } from "@inrixia/lib/findModuleFunction";
import storage from "./storage";

const lastFmSecret = findModuleFunction<string>("lastFmSecret", "string");
const lastFmApiKey = findModuleFunction<string>("lastFmApiKey", "string");

if (lastFmSecret === undefined) throw new Error("Last.fm secret not found");
if (lastFmApiKey === undefined) throw new Error("Last.fm API key not found");

import { NowPlaying } from "./types/lastfm/NowPlaying";
import { Scrobble } from "./types/lastfm/Scrobble";
import { hash } from "@inrixia/lib/nativeBridge";
import { requestJson } from "@inrixia/lib/nativeBridge/request";

export type NowPlayingOpts = {
	track: string;
	artist: string;
	album?: string;
	trackNumber?: string;
	context?: string;
	mbid?: string;
	duration?: string;
	albumArtist?: string;
};

export interface ScrobbleOpts extends NowPlayingOpts {
	timestamp: string;
	streamId?: string;
	chosenByUser?: string;
}

export type LastFmSession = {
	name: string;
	key: string;
	subscriber: number;
};

type ResponseType<T> =
	| (T & { message?: undefined })
	| {
			message: string;
	  };

export class LastFM {
	private static async generateApiSignature(params: Record<string, string>) {
		const sig =
			Object.keys(params)
				.filter((key) => key !== "format" && key !== undefined)
				.sort()
				.map((key) => `${key}${params[key]}`)
				.join("") + lastFmSecret;
		return hash(sig);
	}

	private static async sendRequest<T>(method: string, params?: Record<string, string>, reqMethod = "GET") {
		params ??= {};
		params.method = method;
		params.api_key = lastFmApiKey!;
		params.format = "json";
		params.api_sig = await this.generateApiSignature(params);

		const data = await requestJson<ResponseType<T>>(`https://ws.audioscrobbler.com/2.0/`, {
			headers: {
				"Content-type": "application/x-www-form-urlencoded",
				"Accept-Charset": "utf-8",
			},
			method: "POST",
			body: new URLSearchParams(params).toString(),
		});

		if (data.message) throw new Error(data.message);
		else return <T>data;
	}

	private static getSession = async (): Promise<LastFmSession> => {
		if (storage.lastFmSession !== undefined) return storage.lastFmSession;
		const { token } = await this.sendRequest<{ token: string }>("auth.getToken");
		window.open(`https://www.last.fm/api/auth/?api_key=${lastFmApiKey}&token=${token}`, "_blank");
		const result = window.confirm("Continue with last.fm authentication? Ensure you have given TIDAL permission on the opened page.");
		if (!result) throw new Error("Authentication cancelled");
		const { session } = await this.sendRequest<{ session: LastFmSession }>("auth.getSession", { token });
		return (storage.lastFmSession = session);
	};

	public static async updateNowPlaying(opts: NowPlayingOpts) {
		const session = await this.getSession();
		return this.sendRequest<NowPlaying>(
			"track.updateNowPlaying",
			{
				...opts,
				sk: session.key,
			},
			"POST"
		);
	}

	public static async scrobble(opts?: ScrobbleOpts) {
		const session = await this.getSession();
		return this.sendRequest<Scrobble>(
			"track.scrobble",
			{
				...opts,
				sk: session.key,
			},
			"POST"
		);
	}
}
