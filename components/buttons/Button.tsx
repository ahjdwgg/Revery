import Expand from './icons/expand';
import Plus from './icons/plus';
import Minus from './icons/minus';
import { BUTTON_ICONS } from '../variables';
/**
 * This Button component supports 4 different kinds of buttons:
 * 1. default simple button
 * 2. outlined button
 * 3. disabled button
 * 4. button with an icon
 * @param {string} color - The text and background color of the button
 * @param {string} [text] - The text of the button
 * @param {string} [icon] - The icon on the button
 * @param {boolean} [isOutlined] - Specify if the button style is outlined
 * @param {boolean} [isDisabled] - Specify if the button style is disabled
 * @example
 * <Button text={"Edit Profile"} color={COLORS.nft} isOutlined={true}/>
 */
const Button = (props: { color: string; text?: string; icon?: string; isOutlined?: boolean; isDisabled?: boolean }) => {
    var { color, text, icon, isOutlined, isDisabled } = props;

    // default = simple button filled with specified color
    const defaultClassName = `bg-${color} hover:bg-white hover:bg-opacity-70 text-white font-medium text-xs hover:text-${color} py-1 px-3 border border-${color} hover:border hover:border-${color} hover:border-opacity-40 rounded`;

    const outlinedClassName = `h-6 bg-${color}-bg hover:bg-${color} hover:bg-opacity-70 text-${color} text-opacity-70 font-medium text-xs hover:text-white py-sm px-3 border border-${color} border-opacity-40 hover:border-transparent rounded`;

    const disabledClassName = `h-6 bg-${color} text-${color} text-opacity-40 text-xs font-medium py-sm px-3 rounded bg-opacity-5 cursor-not-allowed`;

    var className = defaultClassName;

    if (isDisabled) {
        className = disabledClassName;
    } else if (isOutlined) {
        className = outlinedClassName;
    }

    if (icon != undefined) {
        className = (className + ` h-6 w-6`).replace('px-3', 'px-1.5');
    }

    var iconSVG = null;

    if (icon != undefined) {
        switch (icon) {
            case BUTTON_ICONS.expand:
                iconSVG = <Expand />;
                break;
            case BUTTON_ICONS.plus:
                iconSVG = <Plus />;
                break;
            case BUTTON_ICONS.minus:
                iconSVG = <Minus />;
                break;
        }
    }

    return (
        <div>
            <button className={className}>
                {props.text} {iconSVG}
            </button>
        </div>
    );
};

export default Button;
//
// const style = {
//     default:
// }

// const ICON = {
//     expand: (
//         <svg
//             className="fill-current"
//             width="10"
//             height="10"
//             viewBox="0 0 11 10"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//         >
//             <path d="M4.88251 9.39076C4.88251 9.04649 4.63115 8.79513 4.28689 8.79513H3.94262L2.40164 8.90442L3.60383 7.76234L5.05738 6.31972C5.17213 6.20496 5.23224 6.05742 5.23224 5.89349C5.23224 5.5219 4.97541 5.25961 4.60929 5.25961C4.43989 5.25961 4.29235 5.32518 4.1776 5.43994L2.72404 6.89349L1.58743 8.09568L1.69672 6.5383V6.15578C1.69672 5.81152 1.44536 5.55469 1.10109 5.55469C0.751366 5.55469 0.5 5.81152 0.5 6.15578L0.5 9.01917C0.5 9.63666 0.855191 9.99731 1.47268 9.99731H4.28689C4.62568 9.99731 4.88251 9.74048 4.88251 9.39076ZM10.5 3.84431V0.980921C10.5 0.363435 10.1393 0.002779 9.52186 0.002779H6.71311C6.36885 0.002779 6.11202 0.25961 6.11202 0.609336C6.11202 0.953599 6.36339 1.20496 6.71311 1.20496H7.05191L8.59836 1.09568L7.39617 2.23775L5.94262 3.68037C5.8224 3.79513 5.76776 3.94267 5.76776 4.1066C5.76776 4.47272 6.01913 4.74048 6.39071 4.74048C6.55464 4.74048 6.70765 4.67491 6.8224 4.56016L8.27049 3.1066L9.4071 1.90442L9.29781 3.4618V3.84431C9.29781 4.18857 9.54918 4.43994 9.89891 4.43994C10.2432 4.43994 10.5 4.18857 10.5 3.84431Z" />
//         </svg>
//     ),
//     plus: (
//         <svg
//             className="fill-current"
//             width="10"
//             height="10"
//             viewBox="0 0 10 10"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//         >
//             <path d="M9.66658 4.33325H5.66658V0.333252H4.33325V4.33325H0.333252V5.66659H4.33325V9.66659H5.66658V5.66659H9.66658V4.33325Z" />
//         </svg>
//     ),
//     minus: (
//         <svg
//             className="fill-current"
//             width="10"
//             height="10"
//             viewBox="0 0 10 2"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//         >
//             <path d="M0.333252 0.333252H9.66659V1.66659H0.333252V0.333252Z" />
//         </svg>
//     ),
// };
