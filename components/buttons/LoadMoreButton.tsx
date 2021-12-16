import Button from './Button';
import React, { ReactNode } from 'react';
import { InView } from 'react-intersection-observer';

interface LoadMoreButtonProps {
    color: string;
    width: string;
    height: string;
    isLoading: boolean;
    children?: ReactNode;
    onClick: () => void;
}

const LoadMoreButton = ({ color, width, height, isLoading, children, onClick }: LoadMoreButtonProps) => {
    const handleViewChange = (inView: boolean) => {
        if (inView) {
            onClick();
        }
    };
    return (
        <>
            {isLoading ? (
                <>{children}</>
            ) : (
                <div className="flex flex-row justify-center w-full py-8 opacity-0">
                    <InView
                        onChange={handleViewChange}
                        triggerOnce={true}
                        rootMargin="1500px 0px" // load beforehand for better user experience
                    >
                        <Button
                            isOutlined={false}
                            color={color}
                            text={'Load more'}
                            width={width}
                            height={height}
                            onClick={onClick}
                        />
                    </InView>
                </div>
            )}
        </>
    );
};

export default LoadMoreButton;
