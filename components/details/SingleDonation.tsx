import DonationDetail from './DonationDetail';
import { GitcoinResponse } from '../../common/types';

export default function SingleDonation(props: { Gitcoin: GitcoinResponse }) {
    let { Gitcoin } = props;

    const ImgStyle = {
        backgroundImage: `url(${Gitcoin.data.grant.logo})`,
    };

    return (
        <div className="flex flex-col max-w-screen-sm m-auto gap-y-4">
            <div className="w-full bg-center bg-no-repeat bg-cover rounded aspect-w-1 aspect-h-1" style={ImgStyle} />
            <DonationDetail detail={Gitcoin} />
        </div>
    );
}
