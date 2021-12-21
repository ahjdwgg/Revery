import ContentLoader from 'react-content-loader';

export default function GroupItemLoader() {
    return (
        <ContentLoader speed={2} width={64} height={84} backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
            <circle cx="32" cy="32" r="32" />
            <rect x="2" y="72" rx="4" ry="4" width="60" height="12" />
        </ContentLoader>
    );
}
