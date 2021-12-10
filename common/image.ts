export function imgRegSrc(oldStr: string): string[] {
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
    return srcArr;
}
