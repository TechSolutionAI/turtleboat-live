import React from "react";
// import { serializeCoord } from "../utils";
import WonderSquare from "./WonderSquare";
import { ModuleItem } from "@/types/module.type";

interface WonderSquareGroupProps {
  coords: number[][];
  squareSize: number;
  data: ModuleItem[],
  style?: React.CSSProperties,
  ventureId: string;
}


const WonderSquareGroup = ({ coords, squareSize, data, style, ventureId }: WonderSquareGroupProps) => {

  const step = 38;
  const group: any = [];
  let moduleList: any[] = [];

  coords.map((item, index) => {
    if (index < data.length) {
      moduleList.push({
        _id: data[index].module._id,
        isCheck: data[index].isCheck,
        isLock: data[index].isLock,
        title: data[index].module.title,
        ventureId: ventureId
      });
    } else {
      moduleList.push({
        _id: '',
        isCheck: false,
        isLock: true,
        title: '',
        ventureId: ventureId
      });
    }
  });

  coords.map((item, index) => {
    group.push(
      <div
        className={`ws-position-wrapper absolute ${moduleList[index]._id == '' ? '' : 'cursor-pointer'}`}
        style={{
          top: `${item[0] * step + item[1] * step}px`,
          left: `${item[0] * step - item[1] * step}px`,
        }}
        key={`push_${index}`}
      >
        <WonderSquare
          size={squareSize}
          data={moduleList[index]}
        />
      </div>
    );
  })

  return (
    <div style={style} className="wondersquare-group">
      {group}
    </div>
  );
};

export default WonderSquareGroup;
