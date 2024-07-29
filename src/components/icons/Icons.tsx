import {GiPlantWatering, GiReceiveMoney} from "react-icons/gi";
import {GrOverview} from "react-icons/gr";
import { FaSackDollar } from "react-icons/fa6";
import {FaLock, FaPiggyBank, FaShieldAlt, FaMoneyBill} from "react-icons/fa";
import {AiFillGold} from "react-icons/ai";
import { CgEditBlackPoint } from "react-icons/cg";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { MdOutlineStackedLineChart } from "react-icons/md";
import React from "react";

export const iconMap = {
    "plant": <GiPlantWatering/>,
    "_overview": <GrOverview/>,
    "piggy": <FaPiggyBank />,
    "shield": <FaShieldAlt/>,
    "gold": <AiFillGold />,
    "lock": <FaLock/>,
    "receivemoney": <GiReceiveMoney/>,
    "_generic": <CgEditBlackPoint/>,
    "rupeecircle": <RiMoneyRupeeCircleFill/>,
    "lines": <MdOutlineStackedLineChart/>,
    "moneybill": <FaMoneyBill/>,
    "dollarsack": <FaSackDollar/>,
};