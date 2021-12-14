import ContentLoader from 'react-content-loader';

export default function GroupIntroBarLoader() {
    return (
        <ContentLoader
            speed={2}
            width={298}
            height={20}
            viewBox="0 0 298 20"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            <rect x="0" y="6" rx="5" ry="5" width="298" height="14" />
        </ContentLoader>
    );
}
