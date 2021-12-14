import ContentLoader from 'react-content-loader';

export default function GroupIntroBarLoader() {
    return (
        <ContentLoader
            speed={2}
            width={300}
            height={40}
            viewBox="0 0 300 40"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            <rect x="0" y="6" rx="5" ry="5" width="300" height="28" />
        </ContentLoader>
    );
}
