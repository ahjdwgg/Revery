import ContentLoader from 'react-content-loader';

export default function DonationItemLoader() {
    return (
        <ContentLoader
            speed={2}
            width={560}
            height={165}
            viewBox="0 0 560 165"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            <rect x="160" y="45" rx="5" ry="5" width="364" height="18" />
            <rect x="160" y="80" rx="5" ry="5" width="32" height="16" />
            <rect x="0" y="16" rx="5" ry="5" width="128" height="128" />
            <rect x="160" y="104" rx="5" ry="5" width="56" height="16" />
            <rect x="324" y="80" rx="5" ry="5" width="72" height="16" />
            <rect x="234" y="104" rx="5" ry="5" width="48" height="16" />
            <rect x="324" y="80" rx="5" ry="5" width="72" height="16" />
            <rect x="234" y="80" rx="5" ry="5" width="72" height="16" />
            <rect x="324" y="104" rx="5" ry="5" width="48" height="16" />
            <rect x="414" y="80" rx="5" ry="5" width="109" height="16" />
            <rect x="414" y="104" rx="5" ry="5" width="73" height="16" />
        </ContentLoader>
    );
}
