import React from 'react'
import {Link} from "react-router-dom";
import {menu} from "../listData"
import DynamicIcons from "./DynamicIcons";

const Menu = ({instruments, selectedMenuItem, setSelectedMenuItem}) => {
    console.log(selectedMenuItem)
    return (
        <div className="menu">
            {menu.map((item) => (
                <div className="item" key={item.id}>
                    <span className="title">{item.title}</span>
                    {item.listItems.map((listItem) => (
                        <Link
                            to={listItem.url}
                            className={`listItem ${selectedMenuItem === listItem ? 'selected' : ''}`}
                            key={listItem.id}
                            onClick={() => setSelectedMenuItem(listItem)}>
                            <DynamicIcons iconName={listItem.icon}></DynamicIcons>
                            <span className="listItemTitle">{listItem.title}</span>
                        </Link>
                    ))}
                </div>
            ))}
            <div className="item">
                <span className="title">Transactions</span>
                {instruments.map((listItem, index) => (
                    <Link
                        to="/transactions"
                        className={`listItem ${selectedMenuItem === listItem ? 'selected' : ''}`}
                        key={index}
                        onClick={() => setSelectedMenuItem(listItem)}>
                        <DynamicIcons iconName={listItem}></DynamicIcons>
                        <span className="listItemTitle">{listItem}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Menu