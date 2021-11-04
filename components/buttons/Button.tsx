/**
 * This Button component supports 3 different kinds of buttons:
 * 1. default simple button
 * 2. outlined button
 * 3. disabled button
 * @param {string} text - The text of the button
 * @param {string} color - The text and background color of the button
 * @param {boolean} [isOutlined] - Specify if the button style is outlined
 * @param {boolean} [isDisabled] - Specify if the button style is disabled
 * @example
 * <Button text={"Edit Profile"} color={COLORS.nft} isOutlined={true}/>
 */
const Button = (props: { text: string; color: string; isOutlined?: boolean; isDisabled?: boolean }) => {
    var { text, color, isOutlined, isDisabled } = props;

    // default = simple button filled with specified color
    const defaultClassName = `bg-${color} hover:bg-white hover:bg-opacity-70 text-white font-medium text-xs hover:text-${color} py-1 px-3 border border-${color} hover:border hover:border-${color} hover:border-opacity-40 rounded`;

    const outlinedClassName = `bg-${color}-bg hover:bg-${color} hover:bg-opacity-70 text-${color} text-opacity-70 font-medium text-xs hover:text-white py-1 px-3 border border-${color} border-opacity-40 hover:border-transparent rounded`;

    const disabledClassName = `bg-${color} text-${color} text-opacity-40 text-xs font-medium py-1 px-3 rounded bg-opacity-5 cursor-not-allowed`;

    var className = defaultClassName;

    if (isDisabled) {
        className = disabledClassName;
    } else if (isOutlined) {
        className = outlinedClassName;
    }

    return (
        <div>
            <button className={className}>{props.text}</button>
        </div>
    );
};

export default Button;
