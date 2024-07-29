import React from 'react';
import {iconMap} from "./Icons";


const DynamicIcons = ({
                          name,
                          className = ''

}) => {
    let Icon = iconMap[name.toLowerCase()];

    if (!Icon) {
        Icon = iconMap["_generic"];
    }

    return <div className={className}> {Icon} </div> ;
};

export default DynamicIcons;