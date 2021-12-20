import ContentLoader from 'react-content-loader';

export default function UserCardLoader() {
    return (
        <ContentLoader
            speed={2}
            className="w-full h-14"
            viewBox="0 0 298 52"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            <circle cx="26" cy="26" r="18" />
            <rect x="50" y="10" rx="5" ry="5" width="75" height="14" />
            <rect x="130" y="10" rx="5" ry="5" width="75" height="14" />
            <rect x="50" y="30" rx="4" ry="4" width="238" height="12" />
        </ContentLoader>
    );
}
