import ContentLoader from 'react-content-loader';

export default function FootprintItemLoader() {
    return (
        <ContentLoader speed={2} width={358} height={76} backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
            <circle cx="38" cy="38" r="38" />
            <rect x="84" y="6" rx="4" ry="4" width="200" height="14" />
            <rect x="84" y="30" rx="4" ry="4" width="142" height="14" />
            <rect x="84" y="54" rx="4" ry="4" width="274" height="14" />
        </ContentLoader>
    );
}
