import Expand from './icons/expand';
import Plus from './icons/plus';
import Minus from './icons/minus';
import { BUTTON_ICONS, COLORTOSTYLE } from './variables';
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

    var bgDefaultStyle = '';
    var bgBgStyle = '';
    var textStyle = '';
    var borderStyle = '';
    var hoverTextStyle = '';
    var hoverBorderStyle = '';
    var hoverBgStyle = '';

    if (color != undefined) {
        for (let styleItem of COLORTOSTYLE) {
            if (styleItem.name == color) {
                bgDefaultStyle = styleItem.bgDefault;
                bgBgStyle = styleItem.bgBg;
                textStyle = styleItem.text;
                borderStyle = styleItem.border;
                hoverTextStyle = styleItem.hoverText;
                hoverBorderStyle = styleItem.hoverBorder;
                hoverBgStyle = styleItem.hoverBg;
            }
        }
    }

    // default = simple button filled with specified color
    const defaultClassName = `${bgDefaultStyle} ${hoverBgStyle} hover:bg-opacity-70 text-white font-medium text-xs ${hoverTextStyle} hover:text-opacity-80 py-1 px-3 border ${borderStyle} hover:border ${hoverBorderStyle} hover:border-opacity-80 rounded`;

    const outlinedClassName = `h-6 ${bgBgStyle} ${textStyle} text-opacity-70 font-medium text-xs hover:text-opacity-80 py-sm px-3 border ${borderStyle} border-opacity-40 hover:border-opacity-80 rounded`;

    const disabledClassName = `h-6 ${bgDefaultStyle} ${textStyle} text-opacity-40 text-xs font-medium py-sm px-3 rounded bg-opacity-5 cursor-not-allowed`;

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
