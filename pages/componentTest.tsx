import type { NextPage } from 'next';
import Button from '../components/buttons/Button';
import LinkButton from '../components/buttons/LinkButton';
import { COLORS } from '../components/buttons/variables';

const ComponentTest: NextPage = () => {
    return (
        <div>
            <Button isOutlined={false} color={COLORS.donation} icon={'minus'} />
            <Button isOutlined={true} color={COLORS.donation} icon={'plus'} />
            <Button isOutlined={true} color={COLORS.donation} icon={'expand'} />
            <Button isOutlined={true} color={COLORS.nft} text={'Edit'} />
            <Button isOutlined={true} color={COLORS.donation} text={'Edit'} />
            <Button isOutlined={true} color={COLORS.footprint} text={'Edit'} />
            <Button isOutlined={false} color={COLORS.primary} text={'Edit Profile'} />
            <Button isOutlined={false} isDisabled={true} color={COLORS.primary} text={'Edit Profile'} />
            <LinkButton text={'mypersonalsite.com'} color={COLORS.primary} />
        </div>
    );
};

export default ComponentTest;
