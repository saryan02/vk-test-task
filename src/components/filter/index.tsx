import React from "react";

export type FilterProps = {
    onSortChange: (sort: 'asc' | 'desc' | '') => void;
};

const Filter: React.FC<FilterProps> = ({ onSortChange }) => (
    <div>
        <select onChange={(e) => onSortChange(e.target.value as 'asc' | 'desc' | '')} defaultValue="">
            <option value="">Без сортировки</option>
            <option value="asc">По возрастанию звёзд</option>
            <option value="desc">По убыванию звёзд</option>
        </select>
    </div>
);

export default Filter;
