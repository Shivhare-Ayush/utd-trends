import React, { useRef } from 'react';
import CustomNavbar from '../components/CustomNavbar';
import Image from 'next/image';
import Checkbox from '@mui/material/Checkbox';
import BookIcon from '@mui/icons-material/Book';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import { useRouter } from 'next/router';
import type { GenericFetchedData } from '../types/GenericFetchedData';
import type { SectionsType } from '../types/SectionsType';
import type { RMPInterface } from './api/ratemyprofessorScraper';
import type { GradesType } from '../types/GradesType';




type ProfessorMatchProps = { 
  addToPlanner: (course: any) => void;
  sections: { [key: string]: GenericFetchedData<SectionsType> };
  grades: { [key: string]: GenericFetchedData<GradesType> };
  rmp: { [key: string]: GenericFetchedData<RMPInterface> };
  
};

const ProfessorMatch = ({
  sections,
  grades,
  rmp,
  addToPlanner,
}: ProfessorMatchProps) => {
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
      imageSrc: "/John_Cole.webp",
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
      className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center p-7 pb-0 overflow-hidden"
      style={{ backgroundImage: "url('/noisyBG.svg')" }}
    >
      {/* Nav on top */}
      <CustomNavbar />
      {/* Main content area */}
      <div className="mt-4 w-2/5 h-screen rounded-3xl p-6 border-2 border-black/20 flex flex-col justify-center bg-clipped">        {/* Scrollable card list */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto snap-y snap-mandatory space-y-20 scrollbar-hide flex flex-col items-center"
          >
          {professors.map((professor) => (
            // Professor card 
            <div
              key={professor.id}
              className="h-[500px] snap-start w-full max-w-md bg-white/10 rounded-3xl border-2 border-black/20 px-6 py-10 flex flex-col items-center text-center space-y-2"
              style={{ height: 'calc(100vh - 200px)' }}
            >
              <div className=" justify-between flex w-full mb-4">
              <button className="bg-red-500 rounded-sm w-6 h-8"/>
                <Image
                  src={professor.imageSrc}
                  alt={professor.name}
                  width={200}
                  height={200}
                  className="rounded-2xl object-cover border-b-4 border-black border-2"
                />
                {/* Bookmark icon */}
                <span>
                <Checkbox          
                  checked={false}
                  onClick={(e) => {
                    e.stopPropagation(); // prevents opening/closing the card when clicking on the compare checkbox
                    addToPlanner(professor);
                    }
                  }
                  icon={<BookOutlinedIcon />}
                  checkedIcon={<BookIcon />}
                />
              </span>
              </div>

              {/* Info block */}
              <div className="flex flex-col items-center text-black font-inter-thin">
                <p className="text-xl font-bold">{professor.name}</p>
                <p className=" text-gray-700">{professor.subject}</p>
                <a href={`mailto:${professor.email}`} className="text-xs underline">{professor.email}</a>
                <p className="text-xs">
                  Office: <a href={professor.officeLink} className="underline ">{professor.office}</a>
                </p>
                <a href={professor.profileLink} className="text-xs underline">Faculty Profile</a>
                <p className="text-sm mt-2">
                  <span className="font-semibold">Accent:</span> {professor.accent} ({professor.accentConfidence}%)
                </p>
              </div>

              {/* Ratings row */}
              <div className="flex justify-center gap-10 mb-2 ">
                <div className='flex flex-col items-center'>
                  <div className="bg-[#8FEC5D] text-black font-bold px-4 py-2 w-20 rounded-full shadow-sm border border-black border-b-2 text-sm">
                  {professor.grade}
                  </div>
                  <p className="text-xs font-inter mt-0.5">Grade</p>
                </div>
                
                <div className='flex flex-col items-center'>
                  <div className="bg-[#FFB74D] text-black font-bold px-4 py-2 w-20 rounded-full shadow-sm border border-black border-b-2 text-sm">
                  {professor.rmp}
                  </div>
                  <p className="text-xs font-inter mt-0.5">RMP</p>
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
