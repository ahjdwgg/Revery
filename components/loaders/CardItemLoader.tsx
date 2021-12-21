import ContentLoader from 'react-content-loader';

export default function CardItemLoader() {
    return (
        <ContentLoader speed={2} width={152} height={152} backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
            <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
            <rect x="82" y="0" rx="5" ry="5" width="70" height="70" />
            <rect x="0" y="82" rx="5" ry="5" width="70" height="70" />
            <rect x="82" y="82" rx="5" ry="5" width="70" height="70" />
        </ContentLoader>
    );
}
