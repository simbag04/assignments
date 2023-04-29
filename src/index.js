import { assign } from "./assignment";
import { capabilities } from "./capabilities";
import { lineup } from "./lineup";
import { Member } from "./member";
import { matrixGenerator } from "./matrix-generator";
import { domController } from "./dom-controller";
import './styles.css';

let costs = [
    [38, 97, 52, 48, 43, 13, 25],
    [53, 52, 86, 48, 23, 68, 78],
    [8, 7, 70, 69, 5, 30, 88],
    [52, 12, 25, 64, 92, 36, 70],
    [73, 95, 48, 51, 27, 95, 84],
    [94, 79, 70, 37, 7, 36, 98],
    [72, 82, 43, 85, 88, 26, 82]
]

// add members
// localStorage.clear();

domController.buildLayout();