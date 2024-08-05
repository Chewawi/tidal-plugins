import { setStyle } from "@inrixia/lib/css/setStyle";

const styles = `
div[class*="titleCell--"] {
    width: auto; !important
}

.quality-tag-container {
	overflow: none;
	display: inline-flex;
	height: 24px;
	font-size: 12px;
	line-height: 24px;
}
.quality-tag {
	justify-content: center;
	align-items: center;
	padding: 0 8px;
	border-radius: 6px;
	background-color: #222222;
	box-sizing: border-box;
	transition: background-color 0.2s;
	margin-left: 5px;
}
`;

setStyle(styles, "tidal-tags-styles");
