import Button from './Button';
import React from 'react';

interface LoadMoreButtonProps {
    color: string;
    width: string;
    height: string;
    isLoading: boolean;
    onClick: () => void;
}

const LoadMoreButton = ({ color, width, height, isLoading, onClick }: LoadMoreButtonProps) => {
    return (
        <>
            {isLoading ? (
                <Button isOutlined={false} color={color} icon={'loading'} width={width} height={height} />
            ) : (
                <Button
                    isOutlined={false}
                    color={color}
                    text={'Load more'}
                    width={width}
                    height={height}
                    onClick={onClick}
                />
            )}
        </>
    );
};

export default LoadMoreButton;
