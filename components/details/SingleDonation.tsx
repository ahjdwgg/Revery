import DonationDetail from './DonationDetail';
import { AnyObject } from 'rss3/types/extend';
import config from '../../common/config';

export default function SingleDonation(props: { Gitcoin: AnyObject }) {
    let { Gitcoin } = props;

    const ImgStyle = {
        backgroundImage: `url(${Gitcoin.grant.logo || config.undefinedImageAlt})`,
    };

    return (
        <div className="flex flex-col max-w-screen-sm m-auto gap-y-4">
            <div className="w-full bg-center bg-no-repeat bg-cover rounded aspect-w-1 aspect-h-1" style={ImgStyle} />
            <DonationDetail detail={Gitcoin} />
        </div>
    );
}
