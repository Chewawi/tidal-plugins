import { $, html } from "@neptune/voby";
import { getSettings } from "@inrixia/lib/storage";
import { SwitchSetting } from "@inrixia/lib/components/SwitchSetting";

export const settings = getSettings({
	displayMaxContextButton: true,
});

export const Settings = () => html`<div>
	<${SwitchSetting}
		checked=${settings.displayMaxContextButton}
		onClick=${() => (settings.displayMaxContextButton = !settings.displayMaxContextButton)}
		title="Display RealMAX Button on Context Menu's"
	/>
</div>`;
