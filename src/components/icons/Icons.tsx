import {GiReceiveMoney, GiMoneyStack} from "react-icons/gi";
import {GrOverview, GrGrow} from "react-icons/gr";
import { FaSackDollar } from "react-icons/fa6";
import {FaLock, FaPiggyBank, FaShieldAlt, FaMoneyBill, FaHome, FaHandHoldingMedical} from "react-icons/fa";
import {AiFillGold, AiFillDollarCircle} from "react-icons/ai";
import { CgEditBlackPoint } from "react-icons/cg";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { MdOutlineStackedLineChart } from "react-icons/md";
import { MdElderly } from "react-icons/md";
import React from "react";

export const iconMap = {
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
    "dollarcircle": <AiFillDollarCircle/>,
    "moneystack": <GiMoneyStack/>,
    "plant": <GrGrow/>,
    "home": <FaHome/>,
    "elderly": <MdElderly/>,
    "medical": <FaHandHoldingMedical/>,
};