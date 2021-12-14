import ContentLoader from 'react-content-loader';

export default function ProfileLoader() {
    return (
        <ContentLoader
            speed={2}
            width={702}
            height={224}
            viewBox="0 0 702 224"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            <circle cx="50" cy="66" r="50" />
            <rect x="124" y="24" rx="5" ry="5" width="200" height="24" />
            <rect x="124" y="90" rx="5" ry="5" width="142" height="18" />
            <rect x="124" y="60" rx="5" ry="5" width="94" height="18" />
            <rect x="337" y="24" rx="5" ry="5" width="56" height="24" />
            <rect x="240" y="60" rx="5" ry="5" width="94" height="18" />
            <rect x="278" y="90" rx="5" ry="5" width="142" height="18" />
            <rect x="124" y="124" rx="5" ry="5" width="570" height="18" />
            <rect x="124" y="150" rx="5" ry="5" width="380" height="18" />
            <circle cx="136" cy="192" r="12" />
            <circle cx="166" cy="192" r="12" />
            <circle cx="196" cy="192" r="12" />
        </ContentLoader>
    );
}
