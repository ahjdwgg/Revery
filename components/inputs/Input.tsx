import { ChangeEvent, ChangeEventHandler, Component } from 'react';

/**
 * This Input component supports 4 different kinds of buttons:
 * 1. single line input
 * 2. textarea input
 * 3. single line input with prefix
 * 4. single line input with suffix
 * @param {string} placeholder - The placeholder text in the input
 * @param {string} isSingleLine - Specify if the input is singlelined
 * @param {string} [prefix] - The prefix of the input
 * @param {string} [suffix] - The suffix of the input
 * @param {boolean} [isDisabled] - Specify if the input is disabled
 * @param {string} [value] - default/original value in the field
 * @example
 * <Input placeholder={'Enter your bio link'} isSingleLine={true} prefix={"https://"}/>
 */

interface InputProps {
    placeholder: string;
    isSingleLine: boolean;
    prefix?: string;
    suffix?: string;
    isDisabled?: boolean;
    value?: string;
    onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

interface InputState {
    value: string;
}

class Input extends Component<InputProps, InputState> {
    constructor(props: InputProps) {
        super(props);

        this.state = {
            value: props.value || '',
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { onChange } = this.props;
        this.setState({
            value: event.target.value,
        });

        if (typeof onChange === 'function') {
            onChange(event);
        }
    }

    render() {
        const { placeholder, prefix, suffix, isDisabled, isSingleLine } = this.props;
        const { value } = this.state;

        return (
            <div className={style.wrapper}>
                {prefix && <span className={style.additional}>{prefix}</span>}
                {isSingleLine && (
                    <input
                        type="text"
                        placeholder={placeholder}
                        className={style.input}
                        value={value}
                        onChange={this.handleChange}
                        disabled={isDisabled}
                    />
                )}
                {!isSingleLine && (
                    <textarea
                        className={style.textarea}
                        placeholder={placeholder}
                        value={value}
                        onChange={this.handleChange}
                        disabled={isDisabled}
                    />
                )}
                {suffix && <span className={style.additional}>{suffix}</span>}
            </div>
        );
    }
}

export default Input;

const style = {
    wrapper: 'flex pl-4 pr-5 py-2 text-base font-regular border border-gray-300 rounded box-border',
    additional: 'flex ml-0 mr-1 font-medium opacity-40',
    input: 'placeholder-black placeholder-opacity-20 flex w-full font-normal bg-input-bg border-none outline-none resize-none',
    textarea:
        'placeholder-black placeholder-opacity-20 flex w-full font-normal bg-input-bg border-none outline-none resize-none h-40',
};
