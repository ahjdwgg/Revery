import Expand from './icons/expand';
import Plus from './icons/plus';
import Minus from './icons/minus';
import { BUTTON_ICONS, COLORTOSTYLE } from './variables';

interface ButtonInterface {
    color: string;
    text?: string;
    fontSize?: string;
    icon?: string;
    isOutlined?: boolean;
    isDisabled?: boolean;
    width?: string;
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
 * @example
 * <Button text={"Edit Profile"} color={COLORS.nft} isOutlined={true}/>
 */
const Button = (props: ButtonInterface) => {
    var { color, text, fontSize, icon, isOutlined, isDisabled, width } = props;

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
    const defaultClassName = `${bgDefaultStyle} ${hoverBgStyle} text-white font-medium ${
        fontSize ? fontSize : 'text-xs'
    } ${hoverTextStyle} py-1 ${fontSize ? 'px-6' : 'px-3'} ${width} border ${borderStyle} ${hoverBorderStyle} rounded`;

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

    if (icon != undefined) {
        className = (className + ` h-6 w-6`).replace('px-3', 'px-1.5');
    }

    var iconSVG = null;

    if (icon != undefined) {
        if (icon == BUTTON_ICONS.expand) {
            iconSVG = <Expand />;
        } else if (icon == BUTTON_ICONS.plus) {
            iconSVG = <Plus />;
        } else if (icon == BUTTON_ICONS.minus) {
            iconSVG = <Minus />;
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
