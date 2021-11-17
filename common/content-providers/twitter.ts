import axios from 'axios';
import config from '../config';
import { Content } from './index';

export default {
    getAccountLink: (account: string) => {
        return `https://twitter.com/${account}`;
    },
    accountStyle: 'username',
    availableFields: ['Name', 'Bio', 'Screen Name', 'Website'],
    prefix: '@',
    suffix: '',
};
