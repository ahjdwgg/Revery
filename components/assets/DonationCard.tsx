interface DonationCardProps {
    imageUrl: string;
    name: string;
    contribCount: number;
    contribDetails: {
        token: string;
        amount: number;
    }[];
}

const DonationCard = ({ imageUrl, name, contribCount, contribDetails }: DonationCardProps) => {
    const imageStyle = {
        backgroundImage: `url(${imageUrl})`,
    };

    return (
        <div className="flex flex-row items-center justify-start w-full border-2 rounded text-body-text bg-body-bg border-donation-bg">
            <div className="flex-shrink m-0.5 w-64 h-32 bg-cover bg-center bg-no-repeat rounded" style={imageStyle} />
            <div className="flex-1 px-8 w-45">
                <p className="w-full mb-2 text-lg font-semibold truncate">{name}</p>
                <div className="flex flex-row w-full overflow-y-auto gap-x-6">
                    <div className="text-donation">
                        <div className="font-semibold">{contribCount}</div>
                        <div className="font-normal">Contrib</div>
                    </div>
                    {contribDetails.map((contrib, i) => (
                        <div key={i} className="text-donation">
                            <div className="font-semibold">{contrib.amount}</div>
                            <div className="font-normal">{contrib.token}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DonationCard;
