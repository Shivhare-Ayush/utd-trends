import React, { useRef } from 'react';
import CustomNavbar from '../components/CustomNavbar';
import Image from 'next/image';

const ProfessorMatch: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const professors = [
    {
      id: 1,
      name: "Jason Smith",
      subject: "Computer Science",
      email: "smith@utdallas.edu",
      office: "ECSW 2.150",
      officeLink: "https://utdallas.edu/maps",
      profileLink: "https://profiles.utdallas.edu/smith",
      imageSrc: "/default.jpg",
      accent: "American",
      accentConfidence: 96,
      grade: "A",
      rmp: "4.2",
    },
    {
      id: 2,
      name: "Professor Johnson",
      subject: "Mathematics",
      email: "johnson@utdallas.edu",
      office: "FO 3.210",
      officeLink: "https://utdallas.edu/maps",
      profileLink: "https://profiles.utdallas.edu/johnson",
      imageSrc: "/default.jpg",
      accent: "British",
      accentConfidence: 88,
      grade: "B+",
      rmp: "3.9",
    }
  ];

  return (
    <div
      className="h-screen w-screen overflow-hidden bg-cover bg-center bg-no-repeat flex flex-col items-center"
      style={{ backgroundImage: "url('/noisyBG.svg')" }}
    >
      {/* Nav on top */}
      <div className="w-full px-4 pt-1/4">
        <CustomNavbar />
      </div>

      {/* Frosted panel */}
      <div className="mt-4 w-2/5 h-[80vh] rounded-3xl p-6 shadow-lg backdrop-blur-md bg-transparent border-[3px] border-black/20 shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex flex-col">
        {/* Scrollable card list */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto snap-y snap-mandatory space-y-20 px-10 py-10 scrollbar-hide"
        >
          {professors.map((professor) => (
            <div
              key={professor.id}
              className="h-[500px] snap-start w-full max-w-md mx-auto bg-white/10 rounded-3xl border border-black/20 backdrop-blur-md shadow-md px-6 py-10 flex flex-col items-center text-center space-y-2"
              style={{ height: 'calc(100vh - 200px)' }}
            >
              {/* Bookmark icon */}
              <div className="absolute top-4 right-4">
                <div className="bg-indigo-500 w-6 h-8 rounded-sm" />
              </div>

              {/* Image */}
              <Image
                src={professor.imageSrc}
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
                  <span className="font-semibold">Accent:</span> {professor.accent} ({professor.accentConfidence}%)
                </p>
              </div>

              {/* Ratings row */}
              <div className="flex justify-center gap-6 mb-2">
                <div className="bg-green-400 text-black font-bold px-4 py-2 rounded-full shadow-sm border border-black text-sm">
                  {professor.grade}
                  <p className="text-xs font-normal mt-0.5">Grade</p>
                </div>
                <div className="bg-orange-300 text-black font-bold px-4 py-2 rounded-full shadow-sm border border-black text-sm">
                  {professor.rmp}
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
