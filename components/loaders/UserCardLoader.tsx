import ContentLoader from 'react-content-loader';

export default function UserCardLoader() {
    return (
        <ContentLoader
            speed={2}
            width={297}
            height={60}
            viewBox="0 0 297 60"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            <circle cx="26" cy="30" r="18" />
            <rect x="50" y="10" rx="5" ry="5" width="75" height="20" />
            <rect x="130" y="10" rx="5" ry="5" width="75" height="20" />
            <rect x="50" y="36" rx="5" ry="5" width="240" height="16" />
        </ContentLoader>
    );
}
