import DonationDetail from './DonationDetail';
import { GitcoinResponse } from '../../common/types';

export default function SingleDonation() {
    const Gitcoin: GitcoinResponse = {
        data: {
            grant: {
                active: true,
                title: 'KERNEL [Panvala League]',
                slug: 'kernel-panvala-league',
                description:
                    "KERNEL is a peer-to-peer learning community creating the kinds of collaboration required to power the core of Web 3. We provide a free and open source syllabus anyone can learn from at any time, and curate a cohort of ~250 unique people 3 times every year to engage in more relatable, humane kinds of mutual education and improvement.\r\n\r\nWe are a family of 800 (and counting) builders who represent a great many different languages, cultures, perspectives and experiences. Our first and foremost goal is building lifelong bonds. Through open, honest and humble dialogue, we explore together how to be more giving, intentional, and responsible stewards of our shared future. It's incredible fun, trust us :)\r\n\r\n250 talented peers from 48 countries joined the KERNEL Genesis Block in Summer 2020 to build 75+ Web 3 companies. Then, 250 more joined for KERNEL Block II in Winter 2021. They were supported by 100+ KERNEL Mentors, Stewards, and Speakers. 275 peers joined in Block III, which is still underway. Already, the quality of the work being done is beyond exciting. More importantly, though, the human connections we are creating are coming to form the heart of a new and wider understanding of value for each of us.\r\n\r\nKERNEL speakers and mentors include Vitalik Buterin, Linda Xie, Juan Benet, Simona Pop, Mariano Conti, Andy Tudhope, Dandelion Mane, Robert Leshner, Morgan Beller and 50+ more. Together, we go through 16 Web 3 and personal lessons, build companies out of ideas, and grow our understanding of ourselves through Web 3.\r\n\r\nDonate PAN\r\n\r\nKERNEL is a proud member of the Panvala League. If you are simply donating (during a Gitcoin Grants round, perhaps), we'd love for it to be in PAN.  If you don’t own any PAN, you can buy some at market price on Uniswap here or buy some using a limit order on Mesa here.\r\n\r\nIf you are a KERNEL Fellow, you can also consider staking PAN here on behalf of KERNEL here, thereby increasing our PAN Matching multiple.\r\n\r\nLastly, donations are appreciated, but we'd love nothing more than for you to join us in KERNEL. Please say hello here.\r\n",
                reference_url: 'https://kernel.community/',
                logo: 'https://c.gitcoin.co/grants/69aee667dfb9cf6516781b3bc8390fa6/kb4.png',
                admin_address: '0x7DAC9Fc15C1Db4379D75A6E3f330aE849dFfcE18',
                token_address: '0x0000000000000000000000000000000000000000',
                token_symbol: 'Any Token',
                contract_address: '0x0',
            },
            txs: [
                {
                    donor: '0x8c23b96f2fb77aae1ac2832debee30f09da7af3c',
                    adminAddr: '0x7dac9fc15c1db4379d75a6e3f330ae849dffce18',
                    tokenAddr: '0x6b175474e89094c44da98b954eedeac495271d0f',
                    symbol: 'DAI',
                    decimals: 18,
                    amount: '500000000000000000000',
                    timeStamp: '0x614aacf8',
                    txHash: '0x797b5f62e1f90cbcd91fb03a6a3bb78285a6db26b9afcac72d2464c0816c3c58',
                    approach: 'zkSync',
                    formatedAmount: '500.0',
                },
            ],
        },
    };

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
