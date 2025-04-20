import type { NextApiRequest, NextApiResponse } from 'next';

type NationalityResponse = {
  country: string;
  probability: number;
};

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NationalityResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { lastName } = req.body;

  if (!lastName) {
    return res.status(400).json({ error: 'Missing lastName' });
  }

  try {
    const apiRes = await fetch(`https://api.nationalize.io/?name=${encodeURIComponent(lastName)}`);
    const data = await apiRes.json();

    if (!data.country || data.country.length === 0) {
      return res.status(200).json({ country: 'Unknown', probability: 0 });
    }

    const top = data.country[0]; // most probable nationality

    return res.status(200).json({
      country: top.country_id,
      probability: top.probability,
    });
  } catch (err) {
    console.error('Error calling Nationalize API:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
