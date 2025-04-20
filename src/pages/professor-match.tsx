import React, { useRef, useEffect, useState } from 'react';
import CustomNavbar from '../components/CustomNavbar';
import Image from 'next/image';
import { useRouter } from 'next/router';

const ProfessorMatch: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [professors, setProfessors] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfessorDetails = async () => {
      if (!router.query.professors) return;

      try {
        const decoded = decodeURIComponent(router.query.professors as string);
        const parsed = JSON.parse(decoded);

        const enriched = await Promise.all(
          parsed.map(async (prof: any) => {
            try {
              const res = await fetch(
                `/api/professor?profFirst=${encodeURIComponent(prof.name.split(' ')[0])}&profLast=${encodeURIComponent(prof.name.split(' ').slice(1).join(' '))}`
              );
              const profData = await res.json();
              const profDetails = profData?.data ?? {};

              return {
                ...prof,
                email: profDetails.email || '',
                office: profDetails.office?.building && profDetails.office?.room
                  ? `${profDetails.office.building} ${profDetails.office.room}`
                  : '',
                officeLink: profDetails.office?.map_uri || '',
                profileLink: profDetails.profile_uri || '',
                imageSrc: profDetails.image_uri || '/default.jpg',
              };
            } catch (error) {
              console.error('Error enriching professor:', error);
              return prof;
            }
          })
        );

        setProfessors(enriched);
      } catch (error) {
        console.error('Failed to parse professor data from query:', error);
      }
    };

    fetchProfessorDetails();
  }, [router.query.professors]);

  return (
    <div
      className="h-screen w-screen overflow-hidden bg-cover bg-center bg-no-repeat flex flex-col items-center"
      style={{ backgroundImage: "url('/noisyBG.svg')" }}
    >
      <div className="w-full px-4 pt-1/4">
        <CustomNavbar />
      </div>

      <div className="mt-4 w-2/5 h-[80vh] rounded-3xl p-6 shadow-lg backdrop-blur-md bg-transparent border-[3px] border-black/20 shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex flex-col">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto snap-y snap-mandatory space-y-20 px-10 py-10 scrollbar-hide"
        >
          {professors.map((professor, index) => (
            <div
              key={index}
              className="h-[500px] snap-start w-full max-w-md mx-auto bg-white/10 rounded-3xl border border-black/20 backdrop-blur-md shadow-md px-6 py-10 flex flex-col items-center text-center space-y-2"
              style={{ height: 'calc(100vh - 200px)' }}
            >
              {/* Bookmark icon */}
              <div className="absolute top-4 right-4">
                <div className="bg-indigo-500 w-6 h-8 rounded-sm" />
              </div>

              {/* Image */}
              <Image
                src={professor.imageSrc || '/default.jpg'}
                alt={professor.name}
                width={200}
                height={200}
                className="rounded-2xl object-cover shadow-md mt-6"
              />

              {/* Info block */}
              <div className="flex flex-col items-center space-y-1">
                <p className="text-xl font-bold">{professor.name}</p>
                <p className="text-sm text-gray-700">{professor.subject}</p>
                <a href={`mailto:${professor.email}`} className="text-xs text-blue-700 underline">{professor.email}</a>
                <p className="text-xs">
                  Office: <a href={professor.officeLink} className="underline">{professor.office}</a>
                </p>
                <a href={professor.profileLink} className="text-xs underline">Faculty Profile</a>
                <p className="text-sm mt-2">
                  <span className="font-semibold">Accent:</span> {professor.accent ?? 'Unknown'} ({professor.accentConfidence ?? 0}%)
                </p>
              </div>

              {/* Ratings row */}
              <div className="flex justify-center gap-6 mb-2">
                <div className="bg-green-400 text-black font-bold px-4 py-2 rounded-full shadow-sm border border-black text-sm">
                  {professor.grade ?? 'N/A'}
                  <p className="text-xs font-normal mt-0.5">Grade</p>
                </div>
                <div className="bg-orange-300 text-black font-bold px-4 py-2 rounded-full shadow-sm border border-black text-sm">
                  {professor.rmp ?? 'N/A'}
                  <p className="text-xs font-normal mt-0.5">RMP</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessorMatch;
