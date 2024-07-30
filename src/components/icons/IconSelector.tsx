import React, { useState } from 'react';
import {iconMap} from "./Icons";
import {useField} from "formik";
const IconSelector = ({ onSelect, expand }) => {
    const [selectedIcon, setSelectedIcon] = useState(null);

    const handleIconClick = (icon) => {
        setSelectedIcon(icon);
        onSelect(icon);
    };

    return (
        <div className={`icon-selector ${expand ? 'expand': ''}`}>
            {Object.keys(iconMap).filter(key => !key.startsWith('_')).map((key) => (
                <div
                    key={key}
                    className={`icon-item ${selectedIcon === key ? 'selected' : ''}`}
                    onClick={() => handleIconClick(key)}
                >
                    {iconMap[key]}
                </div>
            ))}
        </div>
    );
};

export default IconSelector;
