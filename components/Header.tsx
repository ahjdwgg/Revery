import React, { useState, useRef, useEffect } from 'react';

function Header(props: any) {
    const [top, setTop] = useState(true);

    // detect whether user has scrolled the page down by 10px
    useEffect(() => {
        const scrollHandler = () => {
            window.pageYOffset > 10 ? setTop(false) : setTop(true);
        };
        window.addEventListener('scroll', scrollHandler);
        return () => window.removeEventListener('scroll', scrollHandler);
    }, [top]);

    return (
        <header
            className={`fixed w-full z-30 transition duration-300 ease-in-out ${
                !top && 'bg-white border-b border-black shadow-lg'
            }`}
        >
            <div className="max-w-6xl px-2 mx-auto">
                <div className="flex items-center justify-between h-12 md:h-16">
                    <nav className="hidden w-full md:flex md:flex-grow">{props.children}</nav>
                </div>
            </div>
        </header>
    );
}

export default Header;
