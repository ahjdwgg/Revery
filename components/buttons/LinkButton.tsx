import { COLORTOSTYLE } from './variables';

/**
 * This component is used for profile link buttons
 * @param {string} text - The text of the button
 * @param {string} [color] - The text and background color of the button
 * @example
 * <LinkButton text={"Edit Profile"} color={COLORS.primary}/>
 */
const LinkButton = (props: { text: string; color?: string }) => {
    var { text, color } = props;

    // if color is not specified in props, use 'primary' as default
    color = color ? color : 'primary';

    var bgStyle = '';
    var textStyle = '';

    if (color != undefined) {
        for (let styleItem of COLORTOSTYLE) {
            if (styleItem.name == color) {
                bgStyle = styleItem.bgDefault;
                textStyle = styleItem.text;
            }
        }
    }

    const linkButtonClassName = `${bgStyle} ${textStyle} text-xs font-medium py-1 px-3 rounded bg-opacity-5`;

    return (
        <div>
            <button className={linkButtonClassName}>{props.text}</button>
        </div>
    );
};

export default LinkButton;
