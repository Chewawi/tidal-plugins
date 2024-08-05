import { setStyle } from "./css/setStyle";

const styles = `
.context-button {
	align-items: center;
	display: flex;
	font-weight: 500;
	padding: 20px 16px;
	width: 100%;
    height: 45px;
	flex-grow: 1;
	color: #b878ff;
    position: relative;
}
.context-button:hover {
	background-color: #9e46ff;
	color: #fff;
}
.context-button::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: var(--progress, 0); /* Initially set to 0 */
    background: rgba(255, 255, 255, 0.25); /* Loading bar color */
    z-index: 1;
}
.context-button.loading {
    background-color: #9e46ff;
    cursor: not-allowed;
    color: #fff;
}
.context-button span {
    z-index: 2;
    position: relative;
}
`;

setStyle(styles, "content-button");
