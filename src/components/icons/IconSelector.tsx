import React, {useEffect, useState} from 'react';
import {iconMap} from "./Icons";

const IconSelector = ({ expand, values, setShowIconSelector, iconSelectorRef }) => {
    const [selectedIcon, setSelectedIcon] = useState(null);

    const handleIconClick = (icon) => {
        setSelectedIcon(icon);
        values.icon = icon;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (iconSelectorRef.current && !iconSelectorRef.current.contains(event.target)) {
                setShowIconSelector('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [expand])

    useEffect(()=>{
        setSelectedIcon('')
    }, [values])

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
