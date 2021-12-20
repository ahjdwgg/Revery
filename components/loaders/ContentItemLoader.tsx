import ContentLoader from 'react-content-loader';

export default function ContentItemLoader() {
    return (
        <ContentLoader
            speed={2}
            className="w-full h-36"
            viewBox="0 0 702 148"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            <circle cx="16" cy="24" r="16" />
            <rect x="38" y="14" rx="5" ry="5" width="160" height="20" />
            <rect x="39" y="50" rx="5" ry="5" width="200" height="20" />
            <rect x="38" y="90" rx="5" ry="5" width="664" height="20" />
            <rect x="210" y="14" rx="5" ry="5" width="50" height="20" />
            <rect x="274" y="14" rx="5" ry="5" width="120" height="20" />
            <rect x="38" y="120" rx="5" ry="5" width="480" height="20" />
        </ContentLoader>
    );
}
