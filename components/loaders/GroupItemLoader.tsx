import ContentLoader from 'react-content-loader';

export default function GroupItemLoader() {
    return (
        <ContentLoader
            speed={2}
            width={64}
            height={88}
            viewBox="0 0 64 88"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            <circle cx="32" cy="32" r="26" />
            <rect x="2" y="64" rx="5" ry="5" width="60" height="18" />
        </ContentLoader>
    );
}
