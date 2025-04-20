import React, { useRef, useEffect, useState } from 'react';
import CustomNavbar from '../components/CustomNavbar';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Checkbox from '@mui/material/Checkbox';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import BookIcon from '@mui/icons-material/Book';
import CommentIcon from '@mui/icons-material/Comment';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';

const ProfessorMatch: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [professors, setProfessors] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current card index
  const [comments, setComments] = useState<any[]>([]); // Store fetched comments
  const [loading, setLoading] = useState(false); // Loading state for the button
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog

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
                ratings: profDetails.ratings?.edges || [], // Include ratings data
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

  function addToPlanner(professor: any) {
    const planner = JSON.parse(localStorage.getItem('planner') || '[]');
    const isAlreadyAdded = planner.some((item: any) => item.id === professor.id);

    if (isAlreadyAdded) {
      alert(`${professor.name} is already in your planner.`);
    } else {
      planner.push(professor);
      localStorage.setItem('planner', JSON.stringify(planner));
      alert(`${professor.name} has been added to your planner.`);
    }
  }

  const fetchComments = async (professor: any) => {
    setLoading(true); // Show loading state
    try {
      const response = await fetch(
        `/api/ratemyprofessorScraper?profFirst=${encodeURIComponent(
          professor.name.split(' ')[0]
        )}&profLast=${encodeURIComponent(professor.name.split(' ').slice(1).join(' '))}`
      );
      const data = await response.json();
      if (data.message === 'success' && data.data?.ratings?.edges) {
        setComments(data.data.ratings.edges); // Update comments state
        setDialogOpen(true); // Open the dialog
      } else {
        setComments([]); // No comments found
        alert('No comments found for this professor.');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      alert('Failed to fetch comments.');
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false); // Close the dialog
  };

  // Handle scroll event to update the current index
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;
      const cardHeight = scrollRef.current.scrollHeight / professors.length;
      const newIndex = Math.round(scrollTop / cardHeight);
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center p-7 pb-0 overflow-hidden"
      style={{ backgroundImage: "url('/noisyBG.svg')" }}
    >
      {/* Nav on top */}
      <CustomNavbar />
      {/* Main content area */}  
      <div className="flex flex-col items-center justify-center w-min h-min min-h-20 min-w-20 bg-white/10 rounded-full border-2 border-black/20 p-6 absolute left-10 my-auto">
        {Array(professors.length)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full mb-5 ${
                index === currentIndex ? 'bg-neutral-950' : 'bg-neutral-300'
              }`}
              style={{ marginBottom: index === professors.length - 1 ? 0 : 10 }} // Add spacing between dots
            ></div>
          ))}
      </div>
      <div className="mt-4 w-2/5 h-screen rounded-3xl p-6 border-2 border-black/20 flex flex-col justify-center bg-clipped">
        {/* Scrollable card list */}
        <div
          ref={scrollRef}
          onScroll={handleScroll} // Attach the scroll handler
          className="flex-1 overflow-y-auto snap-y snap-mandatory space-y-20 scrollbar-hide flex flex-col items-center"
        >
          {professors.map((professor) => (
            // Professor card
            <div
              key={professor.id}
              className="h-[500px] snap-start w-full max-w-md bg-white/10 rounded-3xl border-2 border-black/20 px-6 py-10 flex flex-col items-center text-center space-y-2"
              style={{ height: 'calc(100vh - 200px)' }}
            >
              <div className=" justify-center flex w-full mb-4 gap-4">
                <div className="flex flex-col items-center">
                  <IconButton
                      onClick={() => fetchComments(professor)}
                      disabled={loading}
                      className="h-8 w-8 rounded-full text-wrap mx-3"
                    >
                    <CommentIcon
                        fontSize="large"
                        className="text-black"
                    /> 
                    </IconButton>
                    <span className="text-black font-bold text-l">RMP</span>
                </div>
                <Image
                  src={professor.imageSrc || '/default.jpg'}
                  alt={professor.name}
                  width={200}
                  height={200}
                  className="rounded-2xl object-cover border-b-4 border-black border-2"
                />
                {/* Bookmark icon */}
                <span>
                  <Checkbox className="text-black mx-auto"
                    checked={false}
                    onClick={(e) => {
                      e.stopPropagation(); // prevents opening/closing the card when clicking on the compare checkbox
                      addToPlanner(professor);
                    }}
                    icon={<BookOutlinedIcon sx={{ fontSize: '38px'}}/>}
                    checkedIcon={<BookIcon sx={{ fontSize: '38px'}}/>}
                    sx={{ '& .MuiSvgIcon-root': { fontSize: '38px' } }} // Adjust the overall size
                  />
                </span>
              </div>

              {/* Info block */}
              <div className="flex flex-col items-center text-black font-inter-thin">
                <p className="text-xl font-bold">{professor.name}</p>
                <p className=" text-gray-700">{professor.subject}</p>
                <a href={`mailto:${professor.email}`} className="text-xs underline">
                  {professor.email}
                </a>
                <p className="text-xs">
                  Office:{' '}
                  <a href={professor.officeLink} className="underline ">
                    {professor.office}
                  </a>
                </p>
                <a href={professor.profileLink} className="text-xs underline">
                  Faculty Profile
                </a>
                <p className="text-sm mt-2">
                  <span className="font-semibold">Accent:</span> {professor.accent ?? 'Unknown'} (
                  {professor.accentConfidence ?? 0}%)
                </p>
              </div>

              {/* Ratings row */}
              <div className="flex justify-center gap-10 mb-2 ">
                <div className="flex flex-col items-center">
                  <div className="bg-[#8FEC5D] text-black font-bold px-4 py-2 w-20 rounded-full shadow-sm border border-black border-b-2 text-sm">
                    {professor.grade}
                  </div>
                  <p className="text-xs text-neutral-600 font-inter mt-0.5">Grade</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="bg-[#FFB74D] text-black font-bold px-4 py-2 w-20 rounded-full shadow-sm border border-black border-b-2 text-sm">
                    {professor.rmp}
                  </div>
                  <p className="text-xs text-neutral-600 font-inter mt-0.5">Rating</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comments Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Student Comments</DialogTitle>
        <DialogContent>
          {comments.length > 0 ? (
            comments.map((comment: any, index: number) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                  <p>
                    <strong>Grade:</strong> {comment.node.grade || 'N/A'}
                  </p>
                  <p>
                    <strong>Would Take Again:</strong>{' '}
                    {comment.node.wouldTakeAgain ? 'Yes' : 'No'}
                  </p>
                  <p>
                    <strong>Date:</strong> {comment.node.date || 'Unknown'}
                  </p>
                </div>
                <p className="text-md">
                  <strong>Comment:</strong> {comment.node.comment || 'No comment provided'}
                </p>
                {index < comments.length - 1 && <Divider className="my-4" />} {/* Add divider */}
              </div>
            ))
          ) : (
            <p>No comments available.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProfessorMatch;
