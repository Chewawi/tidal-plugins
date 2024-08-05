import { intercept, store } from "@neptune";

import { setFLACInfo } from "./setFLACInfo";

import "./style";
import { setQualityTags } from "./setQualityTags";

export { Settings } from "./Settings";
import { settings } from "./Settings";

import { isElement } from "./lib/isElement";
import { setInfoColumnHeaders, setInfoColumns } from "./setInfoColumns";
import { TrackItemCache } from "@inrixia/lib/Caches/TrackItemCache";
import { PlaybackContext } from "@inrixia/lib/AudioQualityTypes";
import safeUnload from "@inrixia/lib/safeUnload";

/**
 * Flac Info
 */
// @ts-expect-error Intercept callback does not have types filled
const unloadIntercept = intercept("playbackControls/MEDIA_PRODUCT_TRANSITION", setFLACInfo);
setFLACInfo([{ playbackContext: <PlaybackContext>store.getState().playbackControls.playbackContext }]);

/**
 *  Tags & Info Columns
 */
const observer = new MutationObserver((mutationsList) => {
	for (const mutation of mutationsList) {
		if (mutation.type === "childList") {
			for (const node of mutation.addedNodes) {
				if (isElement(node)) {
					const trackRows = node.querySelectorAll('div[data-test="tracklist-row"]');
					if (trackRows.length !== 0) updateTrackRows(trackRows);
				}
			}
		}
	}
});
const updateTrackRows = async (trackRows: NodeListOf<Element>) => {
	if (settings.displayInfoColumns) setInfoColumnHeaders();
	for (const trackRow of trackRows) {
		const trackId = trackRow.getAttribute("data-track-id");
		if (trackId == null) return;

		const trackItem = await TrackItemCache.ensure(trackId);
		if (trackItem?.contentType !== "track") continue;

		if (settings.showTags) setQualityTags(trackRow, trackId, trackItem);
		if (settings.displayInfoColumns) setInfoColumns(trackRow, trackId, trackItem);
	}
};
export const updateObserver = () => {
	observer.disconnect();
	if (settings.showTags || settings.displayInfoColumns) {
		// Start observing the document with the configured parameters
		observer.observe(document.body, { childList: true, subtree: true });
	}
};
updateObserver();

export const onUnload = () => {
	observer.disconnect();
	unloadIntercept();
	safeUnload();
};
