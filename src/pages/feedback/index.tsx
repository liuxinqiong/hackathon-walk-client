import Taro, {
  useState,
  useEffect,
  useRouter,
  useMemo,
  useCallback
} from "@tarojs/taro";
import { View, Map } from "@tarojs/components";
import { AtButton, AtTextarea, AtRate } from "taro-ui";

import { Street } from "src/interfaces/street";
import "./index.less";
import url from "../../constants/url";
import { getJSON, postJSON } from "../../utils/request";

function Feedback() {
  const router = useRouter();
  const id = router.params.id;
  const [street, setStreet] = useState<null | Street>(null);
  const [desc, setDesc] = useState<string>("");
  const [score, setScore] = useState<number>(5);

  useEffect(() => {
    if (!id) {
      return;
    }
    getJSON(`${url.queryById}?id=${id}`, null).then(res => {
      const newStreet = res.data.data;
      setStreet(newStreet);
    });
  }, [id]);

  const streetInfo = useMemo(() => {
    if (!street) {
      return null;
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

    const scores = street.desc.reduce((prev, total) => prev + total.score, 0);
    const averageScore = scores / street.desc.length;
    return { points, polyline, markers, score: averageScore };
  }, [street]);

  const handleSubmit = useCallback(() => {
    if (!street) {
      return;
    }
    postJSON(url.addDesc, {
      id: street._id,
      desc: {
        score,
        desc
      }
    }).then(() => {
      Taro.reLaunch({
        url: "/pages/index/index"
      });
    });
  }, [street, score, desc]);

  if (!streetInfo) {
    return null;
  }

  const { points, polyline, markers } = streetInfo;

  return (
    <View className="panel">
      <Map
        className="map"
        longitude={points[0].longitude}
        latitude={points[0].latitude}
        subkey="5S6BZ-7YOC4-5LIUV-DWGIR-WPIVS-LNBRK"
        polyline={polyline}
        markers={markers}
        includePoints={points}
      />
      <View className="info">
        <View className="time">
          <View className="item">
            <View className="title">预计用时</View>
            <View className="data">60Min</View>
          </View>
          <View className="item">
            <View className="title">实际用时</View>
            <View className="data">72Min</View>
          </View>
        </View>
        <View className="submit">
          <View className="score">
            <View className="text">评分</View>
            <AtRate
              value={score}
              onChange={(val: any) => setScore(val)}
            ></AtRate>
          </View>
          <View className="textarea">
            <AtTextarea
              height={68}
              value={desc}
              onChange={val => setDesc(val)}
            ></AtTextarea>
          </View>
          <View className="buttons">
            <AtButton type="primary" onClick={handleSubmit}>
              提交
            </AtButton>
          </View>
        </View>
      </View>
    </View>
  );
}

Feedback.config = {
  navigationBarTitleText: "真棒"
};
