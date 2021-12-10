import React from 'react';
import ImageHolder from '../ImageHolder';
import { BiCalendar, BiLocationPlus } from 'react-icons/bi';

interface FootprintProps {
    imageUrl: string;
    startDate: string | undefined;
    endDate: string | undefined;
    city: string | undefined;
    country: string | undefined;
    username: string;
    activity: string;
    clickEvent?: () => void;
}

// const formatDate = (ts: string): string => {
//     return new Date(parseInt(ts) * 1000).toLocaleDateString('en-US');
// };

const FootprintCard = ({
    imageUrl,
    startDate,
    endDate,
    city,
    country,
    username,
    activity,
    clickEvent = () => {},
}: FootprintProps) => {
    // Calc display date
    let displayDate;
    if (startDate && endDate) {
        displayDate = startDate;
        if (endDate !== startDate) {
            displayDate += ' ~ ' + endDate;
        }
    } else {
        displayDate = 'No activity time';
    }

    // Calc location
    const location = city || country || 'Metaverse';

    return (
        <div className="flex flex-row justify-start gap-2 p-4 cursor-pointer" onClick={clickEvent}>
            <section className="flex flex-row flex-shrink-0 w-max h-max">
                <ImageHolder imageUrl={imageUrl} isFullRound={true} size={76} />
            </section>
            <section className="flex flex-col justify-around flex-1 text-sm leading-normal text-body-text">
                <div className="flex flex-row items-center gap-2">
                    <BiCalendar className="text-primary" />
                    <span className="flex-1 w-0 truncate">{displayDate}</span>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <BiLocationPlus className="text-primary" />
                    <span className="flex-1 w-0 truncate">{location}</span>
                </div>
                <div className="flex flex-row gap-2 font-medium">
                    <div className="text-primary">{username} attended</div>
                    <div className="flex-1 w-0 truncate">{activity}</div>
                </div>
            </section>
        </div>
    );
};

export default FootprintCard;
