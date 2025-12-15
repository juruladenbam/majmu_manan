import { useState, useEffect } from 'react';
import type { Bacaan } from '@project/shared';

export interface Bookmark {
  slug: string;
  judul: string;
  bookmarkedAt: string;
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const item = window.localStorage.getItem('bookmarks');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error('Failed to load bookmarks from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Failed to save bookmarks to localStorage', error);
    }
  }, [bookmarks]);

  const addBookmark = (bacaan: Bacaan) => {
    setBookmarks(prev => {
      if (prev.find(b => b.slug === bacaan.slug)) {
        return prev; // Already bookmarked
      }
      const newBookmark: Bookmark = {
        slug: bacaan.slug,
        judul: bacaan.judul,
        bookmarkedAt: new Date().toISOString(),
      };
      return [...prev, newBookmark];
    });
  };

  const removeBookmark = (slug: string) => {
    setBookmarks(prev => prev.filter(b => b.slug !== slug));
  };

  const isBookmarked = (slug: string) => {
    return bookmarks.some(b => b.slug === slug);
  };

  return { bookmarks, addBookmark, removeBookmark, isBookmarked };
}
