import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const url = decodeURIComponent(String(req.query.url));
    const result = await fetch(url);
    const body = await result.body;
    await res.send(body);
}
