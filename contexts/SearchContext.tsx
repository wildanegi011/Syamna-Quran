"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface SearchContextType {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    clearSearch: () => void;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (open: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Clear search and close menu when navigating
    useEffect(() => {
        setSearchQuery("");
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const clearSearch = useCallback(() => {
        setSearchQuery("");
    }, []);

    return (
        <SearchContext.Provider value={{ 
            searchQuery, 
            setSearchQuery, 
            clearSearch,
            isMobileMenuOpen,
            setIsMobileMenuOpen
        }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
}
