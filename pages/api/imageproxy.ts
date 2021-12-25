import { NextApiRequest, NextApiResponse } from 'next';
import { withSentry } from '@sentry/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const url = decodeURIComponent(String(req.query.url));
    const result = await fetch(url);
    const body = await result.body;
    res.setHeader('Content-Type', result.headers.get('content-type') || 'application/octet-stream');
    await res.send(body);
}

export default withSentry(handler);
