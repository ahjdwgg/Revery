export function imgRegSrc(oldStr: string): { newStr: string; srcArr: string[] } {
    let imgReg = /<img.*?(?:>|\/>)/gi;
    let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
    let imgArr = oldStr.match(imgReg) || [];
    let srcArr: string[] = [];
    imgArr.forEach((item) => {
        let tem = srcReg.exec(item);
        if (tem) {
            srcArr.push(tem[1]);
        }
    });

    oldStr = oldStr.replaceAll('">,<img', '"><img');

    return {
        newStr: oldStr.replaceAll(imgReg, ''),
        srcArr: srcArr,
    };
}

export function mdImgRegSrc(oldStr: string): { newStr: string; srcArr: string[] } {
    let imgReg = /!\[(.*?)\]\(.*?\)/gi;
    let srcReg = /\((.+?)\)/gi;
    let imgArr = oldStr.match(imgReg) || [];
    let srcArr: string[] = [];
    imgArr.forEach((item) => {
        let tem = srcReg.exec(item);
        if (tem) {
            srcArr.push(tem[1]);
        }
    });

    return {
        newStr: oldStr.replaceAll(imgReg, ''),
        srcArr: srcArr,
    };
}
