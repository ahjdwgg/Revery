import { POAPResponse } from '../../common/types';
import FootprintDetail from './FootprintDetail';

export default function SingleFootprint() {
    let POAPInfo: POAPResponse = {
        data: {
            event: {
                id: 12526,
                fancy_id: 'rss3-fully-support-poap-2021',
                name: 'RSS3 Fully Supports POAP',
                event_url: 'https://rss3.bio',
                image_url: 'https://assets.poap.xyz/rss3-fully-support-poap-2021-logo-1635826323177.png',
                country: '',
                city: '',
                description:
                    'This POAP is used to commemorate the RSS3 protocol now fully supports the index of POAPs.',
                year: 2021,
                start_date: '0x61800f00',
                end_date: '0x61800f00',
                expiry_date: '0x61a79c00',
                supply: 183,
            },
            tokenId: '2443267',
            owner: '0xD3E8ce4841ed658Ec8dcb99B7a74beFC377253EA',
        },
    };

    const ImgStyle = {
        backgroundImage: `url(${POAPInfo.data.event.image_url})`,
    };

    return (
        <div className="flex flex-col max-w-screen-sm m-auto gap-y-4">
            <div
                className="w-full bg-center bg-no-repeat bg-cover rounded-full aspect-w-1 aspect-h-1"
                style={ImgStyle}
            />
            <FootprintDetail detail={POAPInfo.data} />
        </div>
    );
}
