import FootprintDetail from './FootprintDetail';

export default function SingleFootprint() {
    const ImgStyle = {
        backgroundImage: `url(https://i.imgur.com/GdWEt4z.jpg)`,
    };

    return (
        <div className="flex flex-col max-w-screen-sm m-auto gap-y-4">
            <div
                className="w-full bg-center bg-no-repeat bg-cover rounded-full aspect-w-1 aspect-h-1"
                style={ImgStyle}
            />
            <FootprintDetail />
        </div>
    );
}
