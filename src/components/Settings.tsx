import {useEffect, useRef} from "react";
import ExternalLinkIcon from "../../public/external_link.svg";

const Settings = ({   data,
                      showSettings,
                      setShowSettings
}) => {
    const sheetMetadata = data?.metadata?.sheetMetadata;
    let sheetUrl = "";
    try{
        sheetUrl = sheetMetadata.filter((item) => item.name = "sheetUrl")[0].value
    }
    catch (e){}
    const settingsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            let settingsIconElement = document.getElementById("settings-icon");
            if (settingsRef.current && !settingsRef.current.contains(event.target)
                && !settingsIconElement.contains(event.target)) {
                setShowSettings(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])

    return (
        <div className={`settings-container ${showSettings ? 'show': 'hide'}`} ref={settingsRef}>
            <div className="settings-content">
                <div>
                    <ExternalLinkIcon/>
                    <div onClick={() => window.open(sheetUrl, "_blank")} className="sheets-link">
                        Open sheets
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings