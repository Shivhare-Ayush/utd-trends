import { Skeleton } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import SingleGradesInfo from '@/components/common/SingleGradesInfo/SingleGradesInfo';
import SingleProfInfo from '@/components/common/SingleProfInfo/SingleProfInfo';
import type { RMPInterface } from '@/pages/api/ratemyprofessorScraper';
import type { GenericFetchedData } from '@/types/GenericFetchedData';
import type { GradesType } from '@/types/GradesType';
import { type SearchQuery, searchQueryLabel } from '@/types/SearchQuery';

const fallbackSrc = 'https://profiles.utdallas.edu/img/default.png';

interface ProfessorInterface {
  _id: string;
  email: string;
  first_name: string;
  image_uri: string;
  last_name: string;
  office: {
    building: string;
    room: string;
    map_uri: string;
  };
  
  //office_hours: any[];
  phone_number: string;
  profile_uri: string;
  sections: string[];
  titles: string[];
}

type ProfessorOverviewProps = {
  professor: SearchQuery;
  grades: GenericFetchedData<GradesType>;
  rmp: GenericFetchedData<RMPInterface>;
};
async function predictNationality(lastName: string): Promise<{ country: string; probability: number; accent: string }> {
  const res = await fetch('/api/predict-nationality', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ lastName }),
  });

  if (!res.ok) {
    throw new Error('Failed to predict nationality');
  }

  const data = await res.json();

  const countryToAccentMap: Record<string, string> = {
    US: 'American',
    GB: 'British',
    IN: 'Indian',
    PK: 'Pakistani',
    BD: 'Bangladeshi',
    IR: 'Iranian',
    CN: 'Chinese',
    HK: 'Hong Kong',
    TW: 'Taiwanese',
    JP: 'Japanese',
    KR: 'Korean',
    DE: 'German',
    FR: 'French',
    IT: 'Italian',
    ES: 'Spanish',
    RU: 'Russian',
    CA: 'Canadian',
    AU: 'Australian',
    BR: 'Brazilian',
    MX: 'Mexican',
    TR: 'Turkish',
    VN: 'Vietnamese',
    PH: 'Filipino',
    SA: 'Saudi',
    AE: 'Emirati',
    EG: 'Egyptian',
    ZA: 'South African',
    NG: 'Nigerian',
    GH: 'Ghanaian',
    KE: 'Kenyan',
    ET: 'Ethiopian',
    IL: 'Israeli',
    AR: 'Argentinian',
    CO: 'Colombian',
    MY: 'Malaysian',
    SG: 'Singaporean',
    ID: 'Indonesian',
    TH: 'Thai',
    UA: 'Ukrainian',
    PL: 'Polish',
    RO: 'Romanian',
    SE: 'Swedish',
    NO: 'Norwegian',
    NL: 'Dutch',
    GR: 'Greek',
    BE: 'Belgian',
    CH: 'Swiss',
    NZ: 'New Zealander',
    MA: 'Moroccan',
    DZ: 'Algerian',
    TN: 'Tunisian',
    LK: 'Sri Lankan',
    NP: 'Nepali',
    SD: 'Sudanese',
    IQ: 'Iraqi',
    SY: 'Syrian',
    LB: 'Lebanese',
    QA: 'Qatari',
    KW: 'Kuwaiti',
    OM: 'Omani',
    JO: 'Jordanian',
    PS: 'Palestinian',
    CZ: 'Czech',
    HU: 'Hungarian',
    SK: 'Slovak',
    BG: 'Bulgarian',
    RS: 'Serbian',
    HR: 'Croatian',
    KZ: 'Kazakh',
    UZ: 'Uzbek',
    AF: 'Afghan',
    MM: 'Burmese',
    KH: 'Cambodian',
    LA: 'Laotian',
    MN: 'Mongolian',
    CL: 'Chilean',
    PE: 'Peruvian',
    VE: 'Venezuelan',
    BO: 'Bolivian',
    PY: 'Paraguayan',
    UY: 'Uruguayan',
    CR: 'Costa Rican',
    PA: 'Panamanian',
    GT: 'Guatemalan',
    HN: 'Honduran',
    SV: 'Salvadoran',
    NI: 'Nicaraguan',
    CU: 'Cuban',
    DO: 'Dominican',
    JM: 'Jamaican',
    HT: 'Haitian',
    TT: 'Trinidadian',
    ZW: 'Zimbabwean',
    TZ: 'Tanzanian',
    UG: 'Ugandan',
    CM: 'Cameroonian',
    SN: 'Senegalese',
    CI: 'Ivorian',
    ML: 'Malian',
    BF: 'Burkinabe',
  };

  const accent = countryToAccentMap[data.country] || 'Unknown';

  return { ...data, accent };
}



const ProfessorOverview = ({
  professor,
  grades,
  rmp,
}: ProfessorOverviewProps) => {
  const [profData, setProfData] = useState<
    GenericFetchedData<ProfessorInterface>
  >({ state: 'loading' });

  const [src, setSrc] = useState(fallbackSrc);
  const [nationality, setNationality] = useState<{
    country: string;
    probability: number;
    accent: string;
  } | null>(null);
  


  useEffect(() => {
    setProfData({ state: 'loading' });
  
    fetch(
      '/api/professor?profFirst=' +
        encodeURIComponent(String(professor.profFirst)) +
        '&profLast=' +
        encodeURIComponent(String(professor.profLast)),
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message !== 'success') {
          throw new Error(response.message);
        }
  
        const professorData = response.data as ProfessorInterface;
        setProfData({
          state: 'done',
          data: professorData,
        });
  
        const imageUrl = professorData.image_uri;
        setSrc(imageUrl);
  
        // 👇 NEW: Call the nationality prediction API
        predictNationality(professorData.last_name)
          .then((result) => setNationality(result))
          .catch((err) => {
            console.error('Failed to predict nationality:', err);
            setNationality(null);
          });
      })
      .catch((error) => {
        setProfData({ state: 'error' });
        console.error('Professor data fetch failed:', error);
      });
  }, [professor]);
  
  

  return (
    <div className="flex flex-col gap-2">
      {profData.state === 'loading' ? (
        <Skeleton variant="circular" className="w-32 h-32 self-center" />
      ) : (
        <Image
          src={src}
          alt="Headshot"
          height={280}
          width={280}
          className="w-32 h-32 rounded-full self-center"
          onLoad={(result) => {
            if (result.currentTarget.naturalWidth === 0) {
              // Broken image
              setSrc(fallbackSrc);
            }
          }}
          onError={() => {
            setSrc(fallbackSrc);
          }}
        />
      )}
      <div className="flex flex-col items-center">
        {profData.state === 'loading' && (
          <>
            <Skeleton className="text-2xl font-bold w-[15ch]" />
            <Skeleton className="w-[25ch]" />
            <Skeleton className="w-[20ch]" />
            <Skeleton className="w-[10ch]" />
          </>
        )}
        {profData.state === 'done' && typeof profData.data !== 'undefined' && (
          <>
            <p className="text-2xl font-bold self-center">
              {searchQueryLabel(professor)}
            </p>

            {nationality && nationality.accent !== 'Unknown' && (
              <p>
                <b>Predicted Accent:</b> {nationality.accent} ({(nationality.probability * 100).toFixed(1)}%)
              </p>
            )}

            {nationality && nationality.accent === 'Unknown' && (
              <p>
                <i>Accent could not be predicted</i>
              </p>
            )}



            {profData.data.email !== '' && (
              <Link
                href={'mailto:' + profData.data.email}
                target="_blank"
                className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
              >
                {profData.data.email}
              </Link>
            )}

            {profData.data.office.map_uri !== '' &&
              profData.data.office.building !== '' &&
              profData.data.office.room !== '' && (
                <p>
                  Office:{' '}
                  <Link
                    href={profData.data.office.map_uri}
                    target="_blank"
                    className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                  >
                    <b>
                      {profData.data.office.building +
                        ' ' +
                        profData.data.office.room}
                    </b>
                  </Link>
                </p>
              )}
            {profData.data.profile_uri !== '' && (
              <Link
                href={profData.data.profile_uri}
                target="_blank"
                className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
              >
                Faculty Profile
              </Link>
            )}
          </>
        )}
      </div>
      <SingleGradesInfo
        title="# of Students (Overall)"
        course={professor}
        grades={grades}
        gradesToUse="unfiltered"
      />
      <SingleProfInfo rmp={rmp} />
    </div>
  );
};

export default ProfessorOverview;
