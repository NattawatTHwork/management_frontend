import React from 'react';
import { Button, Flex } from '@chakra-ui/react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  // Determine the range of pages to display (up to 3 pages)
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, startPage + 2);

  // Adjust startPage and endPage when reaching the last pages
  if (currentPage === totalPages && totalPages >= 3) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - 2);
  }

  return (
    <Flex justify="center" align="center" mt={4}>
      <Button onClick={handlePrevious} disabled={currentPage === 1} mr={2}>
        Previous
      </Button>

      {Array.from({ length: endPage - startPage + 1 }).map((_, index) => (
        <Button
          key={startPage + index}
          onClick={() => handlePageClick(startPage + index)}
          colorScheme={currentPage === startPage + index ? 'blue' : 'gray'}
          ml={2}
        >
          {startPage + index}
        </Button>
      ))}

      <Button onClick={handleNext} disabled={currentPage === totalPages} ml={2}>
        Next
      </Button>
    </Flex>
  );
};

export default Pagination;
