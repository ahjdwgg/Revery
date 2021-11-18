import { BUTTON_ICONS, COLORS, COLORTOSTYLE } from './variables';
import { FiArrowUpRight } from 'react-icons/fi';
import { BiExpandAlt, BiPlus, BiMinus, BiCheck } from 'react-icons/bi';
import { ReactNode } from 'react';

interface ButtonInterface {
    color: string;
    text?: string;
    fontSize?: string;
    icon?: string;
    isOutlined?: boolean;
    isFullRound?: boolean;
    isDisabled?: boolean;
    width?: string;
    height?: string;
    onClick?: (param?: any) => void;
    children?: ReactNode;
}
/**
 * This Button component supports 4 different kinds of buttons:
 * 1. default simple button
 * 2. outlined button
 * 3. disabled button
 * 4. button with an icon
 * @param {string} color - The text and background color of the button
 * @param {string} [text] - The text of the button
 * @param {string} [fontSize] - The font size of the button
 * @param {string} [icon] - The icon on the button
 * @param {boolean} [isOutlined] - Specify if the button style is outlined
 * @param {boolean} [isDisabled] - Specify if the button style is disabled
 * @param {string} [width] - width if not wrapped around text
 * @param {function} [onClick] - button onClick function
 * @example
 * <Button text={"Edit Profile"} color={COLORS.nft} isOutlined={true}/>
 */
const Button = (props: ButtonInterface) => {
    var { color, text, children, fontSize, icon, isOutlined, isDisabled, isFullRound, width, height, onClick } = props;

    var bgDefaultStyle = '';
    var bgAltStyle = '';
    var textStyle = '';
    var borderStyle = '';
    var hoverTextStyle = '';
    var hoverBorderStyle = '';
    var hoverBgStyle = '';

    if (color != undefined) {
        for (let styleItem of COLORTOSTYLE) {
            if (styleItem.name == color) {
                bgDefaultStyle = styleItem.bgDefault;
                bgAltStyle = styleItem.bgAlt;
                textStyle = styleItem.text;
                borderStyle = styleItem.border;
                hoverTextStyle = styleItem.hoverText;
                hoverBorderStyle = styleItem.hoverBorder;
                hoverBgStyle = styleItem.hoverBg;
            }
        }
    }

    // default = simple button filled with specified color
    const defaultClassName = `flex flex-row gap-x-2 justify-center items-center ${bgDefaultStyle} ${hoverBgStyle} ${
        color == COLORS.metamask ? textStyle : 'text-white'
    } font-medium ${fontSize ? fontSize : 'text-xs'} ${hoverTextStyle} py-sm ${
        fontSize ? 'px-6' : 'px-3'
    } ${width} ${height} border ${borderStyle} ${hoverBorderStyle} rounded`;

    const outlinedClassName = `${bgAltStyle} ${textStyle} text-opacity-70 font-medium ${
        fontSize ? fontSize : 'text-xs'
    } hover:text-opacity-80 py-sm ${
        fontSize ? 'px-6' : 'px-3'
    } ${width} border ${borderStyle} border-opacity-70 hover:border-opacity-40 rounded`;

    const disabledClassName = `${bgDefaultStyle} ${textStyle} text-opacity-40 ${
        fontSize ? fontSize : 'text-xs'
    } font-medium py-sm ${fontSize ? 'px-6' : 'px-3'} ${width} rounded bg-opacity-5 cursor-not-allowed`;

    var className = defaultClassName;

    if (isDisabled) {
        className = disabledClassName;
    } else if (isOutlined) {
        className = outlinedClassName;
    }

    if (isFullRound) {
        className = className.replace('rounded', 'rounded-full');
    }

    var iconSVG = null;

    if (icon != undefined) {
        className = (className + ` h-6 w-6`).replace('py-sm px-3', 'p-0.5');
        iconSVG = iconSVGMap.get(icon);
    }

    return (
        <div className="flex items-center">
            <button onClick={onClick} className={className}>
                {props.text} {iconSVG} {children}
            </button>
        </div>
    );
};

var iconClass = 'w-full h-full';

const iconSVGMap = new Map([
    [BUTTON_ICONS.expand, <BiExpandAlt className={`${iconClass} p-0.5`} />],
    [BUTTON_ICONS.plus, <BiPlus className={iconClass} />],
    [BUTTON_ICONS.minus, <BiMinus className={iconClass} />],
    [BUTTON_ICONS.external, <FiArrowUpRight className={iconClass} />],
    [BUTTON_ICONS.check, <BiCheck className={iconClass} />],
]);

export default Button;
