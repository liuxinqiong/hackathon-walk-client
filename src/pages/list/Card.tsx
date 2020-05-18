import { Street } from "src/interfaces/street";
import { View, Map } from "@tarojs/components";
import Taro, { useMemo } from "@tarojs/taro";
import { AtRate } from "taro-ui";
import "./index.less";

type CardProps = {
  street: Street;
};

function Card({ street }: CardProps) {
  const streetInfo = useMemo(() => {
    if (!street) {
      return;
    }
    const points = street.coordinates.map(coordinate => {
      const point = {
        latitude: coordinate[0],
        longitude: coordinate[1]
      };
      return point;
    });
    const polyline = [
      {
        width: 4,
        color: "#336afe",
        points
      }
    ];
    const markers = street.pics.map((pic, index) => ({
      id: index,
      latitude: pic.coordinate[0],
      longitude: pic.coordinate[1],
      width: 48,
      height: 48,
      iconPath: pic.url
    }));

    const score = street.desc.reduce((prev, total) => prev + total.score, 0);
    const averageScore = score / street.desc.length;
    return { points, polyline, markers, score: averageScore };
  }, [street]);

  if (!streetInfo) {
    return null;
  }

  const { points, polyline, markers, score } = streetInfo;

  return (
    <View className="card">
      <Map
        className="map"
        longitude={points[0].longitude}
        latitude={points[0].latitude}
        subkey="5S6BZ-7YOC4-5LIUV-DWGIR-WPIVS-LNBRK"
        polyline={polyline}
        markers={markers}
        includePoints={points}
      ></Map>
      <View className="info">
        <View className="item">
          <View className="title">预计时间</View>
          <View className="data">60Min</View>
        </View>
        <View className="item">
          <View className="title">距离</View>
          <View className="data">5.6Km</View>
        </View>
        <View className="item">
          <View className="title">人流量</View>
          <View className="data">高</View>
        </View>
      </View>
      <View className="rate">
        <AtRate value={score}></AtRate>
      </View>
    </View>
  );
}

export default Card;
