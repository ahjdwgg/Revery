interface requestParams {
    // address: string;
    // platform: string;
    // identity: string;
    id: string;
    // type: string;
}

const requestBuffer: requestParams = {
    // address: '',
    // platform: '',
    // identity: '',
    id: '',
    // type: '',
};

const updateBuffer = (id: string) => {
    // requestBuffer.address = address;
    // requestBuffer.platform = platform;
    // requestBuffer.identity = identity;
    requestBuffer.id = id;
    // requestBuffer.type = type;
};

const checkBuffer = (id: string) => {
    return (
        // requestBuffer.address === address &&
        // requestBuffer.platform === platform &&
        // requestBuffer.identity === identity &&
        requestBuffer.id === id
        // requestBuffer.type === type
    );
};

const buffer = {
    updateBuffer,
    checkBuffer,
};

export default buffer;
