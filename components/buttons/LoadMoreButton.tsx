import Button from './Button';
import React from 'react';
import { InView } from 'react-intersection-observer';

interface LoadMoreButtonProps {
    color: string;
    width: string;
    height: string;
    isLoading: boolean;
    onClick: () => void;
}

const LoadMoreButton = ({ color, width, height, isLoading, onClick }: LoadMoreButtonProps) => {
    const handleViewChange = (inView: boolean) => {
        if (inView) {
            onClick();
        }
    };
    return (
        <>
            {isLoading ? (
                <Button isOutlined={false} color={color} icon={'loading'} width={width} height={height} />
            ) : (
                <InView onChange={handleViewChange} triggerOnce={true}>
                    <Button
                        isOutlined={false}
                        color={color}
                        text={'Load more'}
                        width={width}
                        height={height}
                        onClick={onClick}
                    />
                </InView>
            )}
        </>
    );
};

export default LoadMoreButton;
