import React from "react";
import GaugeChart from "react-gauge-chart";

const styles = {
    dial: {
        display: "inline-block",
        width: `150px`,
        height: `auto`,
        color: "#000",
        border: "0.5px solid #fff",
        padding: "2px"
    },
    title: {
        fontSize: "1em",
        color: "#000"
    }
};

const RiskMeter = ({ 
    id, 
    value, 
    title 
}: {
    id: string,
    value: number,
    title: string
}) => {
    let percent = value / 100;
    switch(value) {
        case 0:
            percent = 0;
            break;
        case 1:
            percent = 0.075;
            break;
        case 2:
            percent = 0.225;
            break;
        case 3:
            percent = 0.4;
            break;
        case 4:
            percent = 0.6;
            break;
        case 5:
            percent = 0.775;
            break;
        case 6:
            percent = 0.925;
            break;
    }
  
    return (
        <div style={styles.dial}>
            <GaugeChart
                id={id}
                nrOfLevels={6}
                arcsLength={[0.15, 0.15, 0.2, 0.2, 0.15, 0.15]}
                colors={["#EB5757", "#EB7B57", "#F2994A", "#F2C94C", "#6FCF97", "#27AE60"]}
                arcPadding={0.02}
                cornerRadius={2}
                arcWidth={0.4}
                percent={percent}
                textColor={"#ffffff"}
                hideText={true}
                needleColor={"#000000"}
                formatTextValue={(value: any) => value}
            />
            <div className="font-Inter text-black text-center text-md font-bold">{title}</div>
        </div>
    );
  };
  
  export default RiskMeter;