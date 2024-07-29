import React, { useState } from 'react';
import {iconMap} from "./Icons";
const IconSelector = ({ onSelect }) => {
    const [selectedIcon, setSelectedIcon] = useState(null);

    const handleIconClick = (icon) => {
        setSelectedIcon(icon);
        onSelect(icon);
    };

    return (
        <div className="icon-selector">
            {Object.keys(iconMap).filter(key => !key.startsWith('_')).map((key) => (
                <div
                    key={key}
                    className={`icon-item ${selectedIcon === iconMap[key] ? 'selected' : ''}`}
                    onClick={() => handleIconClick(iconMap[key])}
                >
                    {iconMap[key]}
                </div>
            ))}
        </div>
    );
};

export default IconSelector;
