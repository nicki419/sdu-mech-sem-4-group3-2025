import ReactSpeedometer, {CustomSegmentLabelPosition} from "react-d3-speedometer";
import React from "react";

interface SpeedometerProps {
    angle: number;
    darkMode: boolean;
}

const Speedometer: React.FC<SpeedometerProps> = ({ angle, darkMode }) => {
    const textColor = darkMode ? '#ffffff' : '#000000';
    const gaugeColor = '#1890ff';

    return (
    <div style={{ textAlign: 'center', marginRight: 24 }}>
        <div style={{ marginBottom: -13 }}>
            <strong>0</strong>
        </div>
        <ReactSpeedometer
            key={darkMode ? 'dark' : 'light'}
            value={angle}
            minValue={-90}
            maxValue={90}
            segments={18}
            needleColor={textColor}
            startColor={gaugeColor}
            endColor={gaugeColor}
            textColor={textColor}
            ringWidth={30}
            width={200}
            height={125}
            customSegmentLabels={[
                { text: "-90", position: CustomSegmentLabelPosition.Outside, color: textColor, fontSize: "12px" },
                { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                { text: "-45", position: CustomSegmentLabelPosition.Outside, color: textColor, fontSize: "12px" },
                { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                { text: "45", position: CustomSegmentLabelPosition.Outside, color: textColor, fontSize: "12px" },
                { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                { text: "90", position: CustomSegmentLabelPosition.Outside, color: textColor, fontSize: "12px" },
            ]}
            currentValueText={`${angle}°`}
        />
    </div>
    );
};

export default Speedometer;