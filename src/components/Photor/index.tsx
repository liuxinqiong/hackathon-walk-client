import Taro, { useCallback } from "@tarojs/taro";
import { View, Camera } from "@tarojs/components";

import "./index.less";

type PhotorProps = {
  onSuccess: (result: any) => void;
};

function Photor({ onSuccess }: PhotorProps) {
  const handleTakePhoto = useCallback(() => {
    const cameraContext = Taro.createCameraContext();
    cameraContext.takePhoto({
      success: tempImagePath => {
        onSuccess && onSuccess(tempImagePath);
      }
    });
  }, [onSuccess]);
  return (
    <View className="take custom-class">
      <Camera className="camera"></Camera>
      <View className="buttons">
        <View className="button-border" onClick={handleTakePhoto}>
          <View className="button-circle"></View>
        </View>
      </View>
    </View>
  );
}

Photor.externalClasses = ["custom-class"];

export default Photor;
