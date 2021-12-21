import ContentLoader from 'react-content-loader';

export default function NFTItemLoader() {
    return (
        <ContentLoader speed={2} width={208} height={208} backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
            <rect x="0" y="0" rx="5" ry="5" width="208" height="208" />
        </ContentLoader>
    );
}
