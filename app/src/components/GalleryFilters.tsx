import React from 'react';

interface GalleryFiltersProps {
    isOpen: boolean;
    onClose: () => void;
 
}

const GalleryFilters: React.FC<GalleryFiltersProps> = () => {
    return (
        <div className="gallery-filters">
            {/* Add your filter components here */}
        </div>
    );
};

export default GalleryFilters;