import { COLORTOSTYLE } from './variables';
import { BiLinkAlt } from 'react-icons/bi';

interface LinkButtonInterface {
    text: string;
    color?: string;
    link?: boolean;
    onClick?: (param?: any) => void;
}

/**
 * This component is used for profile link buttons
 * @param {string} text - The text of the button
 * @param {string} [color] - The text and background color of the button
 * @param {boolean} link - whether display the link icon
 * @example
 * <LinkButton text={"Edit Profile"} color={COLORS.primary}/>
 */
const LinkButton = (props: LinkButtonInterface) => {
    let { text, color, link, onClick } = props;

    // if color is not specified in props, use 'primary' as default
    color = color ? color : 'primary';

    let bgStyle = '';
    let textStyle = '';

    if (color != undefined) {
        for (let styleItem of COLORTOSTYLE) {
            if (styleItem.name == color) {
                bgStyle = styleItem.bgDefault;
                textStyle = styleItem.text;
            }
        }
    }

    const linkButtonClassName = `${bgStyle} ${textStyle} flex flex-row items-center px-2 py-1 text-xs font-medium rounded cursor-pointer bg-opacity-5 gap-x-1`;

    return (
        <div>
            <button onClick={onClick} className={linkButtonClassName}>
                {link && <BiLinkAlt />}
                {props.text}
            </button>
        </div>
    );
};

export default LinkButton;
