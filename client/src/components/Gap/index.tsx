import { View } from "@tarojs/components";
import { memo } from "react";

type GapProps = { height?: string; background?: string };

export default memo((props: GapProps) => {
  const { background = "#F7F8FB", height = "8px" } = props;
  return (
    <View
      style={{
        height,
        background
      }}
    ></View>
  );
});
