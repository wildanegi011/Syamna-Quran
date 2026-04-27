"use client";

import React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface ModulePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function ModulePagination({
    currentPage,
    totalPages,
    onPageChange,
    className
}: ModulePaginationProps) {
    if (totalPages <= 1) return null;

    // Logic for generating page numbers with ellipsis
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter((page) => {
        // Show first, last, and relative pages
        if (totalPages <= 7) return true;
        return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
    });

    return (
        <div className={cn("mt-20 flex flex-col items-center gap-6", className)}>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                            className={cn(
                                "cursor-pointer transition-all active:scale-95",
                                currentPage === 1 && "opacity-20 pointer-events-none"
                            )}
                            text="Sebelumnya"
                        />
                    </PaginationItem>

                    {pages.map((page, idx, array) => (
                        <React.Fragment key={page}>
                            {idx > 0 && array[idx - 1] !== page - 1 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
                            <PaginationItem>
                                <PaginationLink
                                    isActive={currentPage === page}
                                    onClick={() => onPageChange(page)}
                                    className="cursor-pointer transition-all active:scale-90"
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        </React.Fragment>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                            className={cn(
                                "cursor-pointer transition-all active:scale-95",
                                currentPage === totalPages && "opacity-20 pointer-events-none"
                            )}
                            text="Selanjutnya"
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            
            <p className="text-[10px] font-headline font-black uppercase tracking-[0.3em] text-foreground/20">
                Halaman {currentPage} dari {totalPages}
            </p>
        </div>
    );
}
