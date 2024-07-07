import React, { useState, useEffect } from 'react';
import OverviewIcon from "../../public/overview.svg";
import MutualFundIcon from "../../public/mutualfund.svg";

const iconMap = {
    "mutualfund": MutualFundIcon,
    "overview": OverviewIcon,
};

const DynamicIcons = ({ iconName}) => {
    const Icon = iconMap[iconName.toLowerCase()];

    if (!Icon) {
        console.warn(`Icon not found: ${iconName}`);
        return null;
    }

    return <Icon />;
};

export default DynamicIcons;