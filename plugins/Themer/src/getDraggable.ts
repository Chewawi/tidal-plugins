import { getStyle, setStyle } from "@inrixia/lib/css/setStyle";

import { getStorage } from "@inrixia/lib/storage";
import { settings } from "./Settings";

const storage = getStorage({
	css: "",
});

export const draggableId = "__Themer__Draggable";
export const draggableStyleId = `${draggableId}__Style`;
export const getDraggable = () => {
	let draggable = document.getElementById(draggableId);
	if (!draggable) {
		draggable = document.createElement("div");
		draggable.id = draggableId;
		draggable.style.width = "300px";
		draggable.style.height = "200px";
		draggable.style.position = "absolute";
		draggable.style.top = "100px";
		draggable.style.left = "100px";
		draggable.style.border = "1px solid #ccc";
		draggable.style.backgroundColor = "#f9f9f9";
		draggable.style.resize = "both";
		draggable.style.overflow = "auto";
		draggable.style.padding = "10px";
		draggable.style.cursor = "move";
		draggable.style.zIndex = "1000";
		draggable.style.borderRadius = "8px";
		draggable.style.backgroundColor = "#5b5b5b";
		draggable.style.borderWidth = "0px";

		// Create and style the textarea
		let textarea = document.createElement("textarea");
		textarea.style.width = "100%";
		textarea.style.height = "100%";
		textarea.style.boxSizing = "border-box";
		textarea.style.borderRadius = "8px";
		textarea.style.borderWidth = "0px";
		textarea.style.backgroundColor = "#181818";
		textarea.style.color = "white";
		textarea.style.padding = "10px";
		textarea.style.boxShadow = "inset 0 0 20px 0px rgba(0, 0, 0, 0.5)";
		textarea.rows = 10;
		textarea.cols = 50;
		textarea.placeholder = "Enter css styles here...";
		setStyle((textarea.value = storage.css), draggableStyleId);
		textarea.addEventListener("keyup", (e) => setStyle((storage.css = (<HTMLTextAreaElement>e.target).value), draggableStyleId));

		draggable.appendChild(textarea);
		document.body.appendChild(draggable);
	}
	draggable.style.display = settings.showEditor ? "" : "none";
	return draggable;
};
