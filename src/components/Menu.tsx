import React from 'react'
import {Link} from "react-router-dom";
import {menu} from "../listData"
import DynamicIcons from "./DynamicIcons";

const Menu = () => {
    return (
        <div className="menu">
            {menu.map((item) => (
                <div className="item" key={item.id}>
                    <span className="title">{item.title}</span>
                    {item.listItems.map((listItem) => (
                        <Link to={listItem.url} className="listItem" key={listItem.id}>
                            <DynamicIcons iconName={listItem.icon}></DynamicIcons>
                            <span className="listItemTitle">{listItem.title}</span>
                        </Link>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default Menu