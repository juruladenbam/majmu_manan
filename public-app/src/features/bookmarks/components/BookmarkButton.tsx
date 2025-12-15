import { Button, Icon } from '@chakra-ui/react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useBookmarks } from '../hooks/useBookmarks';
import type { Bacaan } from '@project/shared';

interface BookmarkButtonProps {
  bacaan: Bacaan;
}

export const BookmarkButton = ({ bacaan }: BookmarkButtonProps) => {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const bookmarked = isBookmarked(bacaan.slug);

  const handleClick = () => {
    if (bookmarked) {
      removeBookmark(bacaan.slug);
    } else {
      addBookmark(bacaan);
    }
  };

  return (
    <Button 
      onClick={handleClick} 
      variant="ghost" 
      size="sm" 
      colorPalette={bookmarked ? 'yellow' : 'gray'}
    >
      <Icon as={bookmarked ? FaBookmark : FaRegBookmark} />
      {bookmarked ? 'Dibookmark' : 'Bookmark'}
    </Button>
  );
};
