import axios from 'axios';
import config from './config';

const IPFS = {
    upload: (file: File | Blob) => {
        return new Promise<string>(async (resolve, reject) => {
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                try {
                    const response = await axios.post(config.ipfs.upload.api.url, formData, {
                        baseURL: config.ipfs.upload.endpoint,
                        maxBodyLength: Infinity,
                        headers: {
                            'Content-Type': `multipart/form-data;`,
                        },
                    });
                    resolve('ipfs://' + response.data.Hash);
                } catch (e) {
                    reject(e);
                }
            }
        });
    },
};

export default IPFS;
