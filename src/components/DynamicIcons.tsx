import React from 'react';
import OverviewIcon from "../../public/overview.svg";
import MutualFundIcon from "../../public/mutualfund.svg";
import EpfIcon from "../../public/epf.svg";
import FdIcon from "../../public/fd.svg";
import SgbIcon from "../../public/sgb.svg"
import LicIcon from "../../public/lic.svg";
import NpsIcon from "../../public/nps.svg"
import GenericIcon from "../../public/generic.svg"

const iconMap = {
    "mutualfund": MutualFundIcon,
    "overview": OverviewIcon,
    "epf": EpfIcon,
    "fd": FdIcon,
    "sgb": SgbIcon,
    "lic": LicIcon,
    "nps": NpsIcon,
    "generic": GenericIcon,
};
// TODO setup dynamic loading

const DynamicIcons = ({ name: name}) => {
    let Icon = iconMap[name.toLowerCase()];

    if (!Icon) {
        Icon = iconMap["generic"];
    }

    return <Icon />;
};

export default DynamicIcons;