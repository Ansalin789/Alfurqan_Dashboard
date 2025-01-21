import React from 'react';
import Modal from 'react-modal';

// Define the props interface
interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose }) => {
    // Modal logic
    return (
        <Modal isOpen={isOpen} onRequestClose={onClose}>
            <div>
                <h2>Filter Options</h2>
                {/* Add filter options here */}
                <button onClick={onClose}>Close</button>
            </div>
        </Modal>
    );
};

export default FilterModal;
