import Taro, { useState, useEffect, useMemo } from "@tarojs/taro";
import { View, Map } from "@tarojs/components";
import { AtButton } from "taro-ui";

import { Street } from "src/types/street";
import "./index.less";
import url from "../../constants/url";
import { getJSON } from "../../utils/request";

function Index() {
  const [currentPosition, setCurrentPosition] = useState({
    latitude: 22.53332,
    longitude: 113.93041
  });
  const [includePoints, setIncludePoints] = useState<any>([]);
  const [markers, setMarkers] = useState<any>([]);
  const [polyline, setPolyline] = useState<any>([]);

  useEffect(() => {
    Taro.getLocation({
      type: "gcj02",
      success: res => {
        const { latitude, longitude } = res;
        console.log(latitude, longitude);
        setCurrentPosition({ latitude, longitude });
      }
    });
    getJSON(url.query, null).then(res => {
      const streets: Street[] = res.data.data;
      const newIncludePoints: any[] = [];
      const newPolyline: any[] = [];
      const newMarkers: any[] = [];
      for (let i = 0; i < streets.length; i += 1) {
        const street = streets[i];
        const points = street.coordinates.map(coordinate => {
          const point = {
            latitude: coordinate[0],
            longitude: coordinate[1]
          };
          newIncludePoints.push(point);
          return point;
        });
        newPolyline.push({
          width: 4,
          color: "#336afe",
          points
        });
        const picMarkers = street.pics.map((pic, index) => ({
          id: index,
          latitude: pic.coordinate[0],
          longitude: pic.coordinate[1],
          width: 48,
          height: 48,
          iconPath: pic.url
        }));
        newMarkers.push(...picMarkers);
      }
      setPolyline(newPolyline);
      setMarkers(newMarkers);
      setIncludePoints(newIncludePoints);
    });
  }, []);

  const allPoints = useMemo(() => {
    return [...includePoints, currentPosition];
  }, [currentPosition, includePoints]);

  return (
    <View className="index">
      <Map
        id="map"
        className="map"
        longitude={currentPosition.longitude}
        latitude={currentPosition.latitude}
        scale={18}
        subkey="5S6BZ-7YOC4-5LIUV-DWGIR-WPIVS-LNBRK"
        polyline={polyline}
        markers={markers}
        includePoints={allPoints}
        showCompass
        showLocation
      />
      <View className="buttons">
        <View className="item">
          <AtButton
            type="primary"
            onClick={() => {
              Taro.navigateTo({
                url: "/pages/list/index"
              });
            }}
          >
            周边跑
          </AtButton>
        </View>
        <View className="item">
          <AtButton type="primary">自定义路线</AtButton>
        </View>
      </View>
    </View>
  );
}

Index.config = {
  navigationBarTitleText: "首页"
};

export default Index;
