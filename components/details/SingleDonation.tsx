import DonationDetail from './DonationDetail';
import { AnyObject } from 'rss3/types/extend';

export default function SingleDonation(props: { Gitcoin: AnyObject }) {
    let { Gitcoin } = props;

    const ImgStyle = {
        backgroundImage: `url(${Gitcoin.grant.logo})`,
    };

    return (
        <div className="flex flex-col max-w-screen-sm m-auto gap-y-4">
            <div className="w-full bg-center bg-no-repeat bg-cover rounded aspect-w-1 aspect-h-1" style={ImgStyle} />
            <DonationDetail detail={Gitcoin} />
        </div>
    );
}
