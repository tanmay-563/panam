import React from 'react'
import {Link} from "react-router-dom";
import {menu} from "../listData"
import DynamicIcons from "./DynamicIcons";
import {getDisplayName} from "../utils/common";
const Menu = ({
                  instruments,
                  metadata,
                  selectedMenuItem,
                  setSelectedMenuItem}
) => {
    const instrumentMetadata = metadata?.instrument || {};

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
                            <DynamicIcons name={listItem.icon}></DynamicIcons>
                            <span className="listItemTitle">{listItem.title}</span>
                        </Link>
                    ))}
                </div>
            ))}
            <div className="item">
                <span className="title">Transactions</span>
                {instruments?.map((listItem, index) => (
                    <Link
                        to={`/transactions/${listItem}`}
                        key={listItem}
                        className={`listItem ${selectedMenuItem === listItem ? 'selected' : ''}`}
                        onClick={() => setSelectedMenuItem(listItem)}>
                        <DynamicIcons name={listItem}></DynamicIcons>
                        <span className="listItemTitle">{getDisplayName(instrumentMetadata, listItem)}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Menu