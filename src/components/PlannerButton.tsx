import React, {useState} from 'react';
import type { SearchQuery } from '../types/SearchQuery';
import Checkbox from '@mui/material/Checkbox';
import BookIcon from '@mui/icons-material/Book';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';


interface PlannerButtonProps {
  addToPlanner: (value: SearchQuery) => void;
  course: SearchQuery; // The course or professor details to add
}

const PlannerButton: React.FC<PlannerButtonProps> = ({ addToPlanner, course }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleAddToPlanner = () => {
    if (isChecked) {
      alert(`${course.prefix} ${course.number} is already in your planner.`);
      setIsChecked(!isChecked) 
      return;
    }
    setIsChecked(!isChecked) 
    addToPlanner(course);
    
    alert(`${course.prefix} ${course.number} has been added to your planner.`);
  };

  return (
    <span>
        <Checkbox className="text-black mx-auto"
            checked={isChecked}
            onClick={() => handleAddToPlanner()}
            icon={<BookOutlinedIcon sx={{ fontSize: '38px'}}/>}
            checkedIcon={<BookIcon sx={{ fontSize: '38px'}}/>}
            sx={{ '& .MuiSvgIcon-root': { fontSize: '38px' } }} // Adjust the overall size
        />
    </span>
  );
};

export default PlannerButton;