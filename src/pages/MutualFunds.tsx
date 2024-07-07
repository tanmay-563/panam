
const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
};

const thTdStyle = {
    border: '1px solid #ddd',
    padding: '8px',
};

const thStyle = {
    backgroundColor: '#f2f2f2',
};

const MutualFunds = ({data}) => {
    // return(
    //     <div>
    //         MF
    //     </div>
    // )

    return (
        <div>
            <h1>Data from Google Sheets!</h1>
            <table style={tableStyle}>
                <thead>
                <tr>
                    <th style={{ ...thTdStyle, ...thStyle }}>Column 1</th>
                    <th style={{ ...thTdStyle, ...thStyle }}>Column 2</th>
                    <th style={{ ...thTdStyle, ...thStyle }}>Column 3</th>
                    <th style={{ ...thTdStyle, ...thStyle }}>Column 4</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} style={thTdStyle}>{cell}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default MutualFunds;
