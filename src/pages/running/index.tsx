import Taro, {
  useState,
  useEffect,
  useRouter,
  useMemo,
  useCallback
} from "@tarojs/taro";
import { View, Map, Image, Swiper, SwiperItem } from "@tarojs/components";
import { AtButton, AtTextarea, AtFloatLayout } from "taro-ui";

import { Street } from "src/types/street";
import Photor from "../../components/Photor";
import "./index.less";
import url from "../../constants/url";
import { getJSON, postJSON } from "../../utils/request";

function Running() {
  const router = useRouter();
  const id = router.params.id;
  const [street, setStreet] = useState<null | Street>(null);
  const [cameraStatus, setCameraStatus] = useState<boolean>(false);
  const [tempImagePath, setTempImagePath] = useState<string | null>(null);
  const [tempPreview, setTempPreview] = useState<boolean>(false);
  const [photoText, setPhotoText] = useState<string>("");
  const [drawerStatus, setDrawerStatus] = useState<boolean>(false);

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

    const score = street.desc.reduce((prev, total) => prev + total.score, 0);
    const averageScore = score / street.desc.length;
    return { points, polyline, markers, score: averageScore };
  }, [street]);

  const [currentPosition, setCurrentPosition] = useState({
    latitude: 22.53332,
    longitude: 113.93041
  });

  useEffect(() => {
    Taro.getLocation({
      type: "gcj02",
      success: res => {
        const { latitude, longitude } = res;
        setCurrentPosition({ latitude, longitude });
      }
    });
  }, []);

  const onTakePhotoSuccess = useCallback(res => {
    setTempImagePath(res.tempImagePath);
    setCameraStatus(false);
    setTempPreview(true);
  }, []);

  const submitPhoto = useCallback(() => {
    if (!tempImagePath || !street) {
      return;
    }
    Taro.uploadFile({
      url: url.upload,
      name: "file",
      filePath: tempImagePath,
      success: res => {
        const realPath = JSON.parse(res.data).data[0].path;
        Taro.getLocation({
          type: "gcj02",
          success: (location: any) => {
            const { latitude, longitude } = location;
            const picItem = {
              url: realPath,
              coordinate: [latitude, longitude],
              desc: photoText
            };
            postJSON(url.addPic, {
              id: street._id,
              pic: picItem
            }).then(() => {
              setTempPreview(false);
              setTempImagePath(null);
              setPhotoText("");
              Taro.showToast({
                title: "打卡成功",
                icon: "success",
                duration: 2000
              });
              getJSON(`${url.queryById}?id=${id}`, null).then(
                (streetRes: any) => {
                  const newStreet = streetRes.data.data;
                  setStreet(newStreet);
                }
              );
            });
          }
        });
      }
    });
  }, [tempImagePath, photoText, street, id]);

  const handleMarkerTap = useCallback(() => {
    setDrawerStatus(true);
  }, []);

  if (!streetInfo) {
    return null;
  }

  const { points, polyline, markers } = streetInfo;

  if (cameraStatus) {
    return <Photor onSuccess={onTakePhotoSuccess} />;
  }

  if (tempPreview && tempImagePath) {
    return (
      <View className="preview">
        <Image className="image" src={tempImagePath}></Image>
        <View className="info">
          <View className="textarea">
            <AtTextarea
              height={68}
              value={photoText}
              onChange={val => setPhotoText(val)}
            ></AtTextarea>
          </View>
          <View className="buttons">
            <View className="cancel">
              <AtButton
                onClick={() => {
                  setTempPreview(false);
                  setTempImagePath(null);
                  setPhotoText("");
                }}
              >
                取消
              </AtButton>
            </View>
            <View className="sure">
              <AtButton type="primary" onClick={submitPhoto}>
                确认打卡
              </AtButton>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="panel">
      <Map
        className="map"
        longitude={currentPosition.longitude}
        latitude={currentPosition.latitude}
        showLocation
        subkey="5S6BZ-7YOC4-5LIUV-DWGIR-WPIVS-LNBRK"
        polyline={polyline}
        markers={markers}
        includePoints={points}
        onMarkerTap={handleMarkerTap}
      />
      <View className="info">
        <View className="time">
          <View className="item">
            <View className="title">预计用时</View>
            <View className="data">60Min</View>
          </View>
          <View className="item">
            <View className="title">当前用时</View>
            <View className="data">26Min</View>
          </View>
        </View>
        <View className="buttons">
          <View className="finished">
            <AtButton
              onClick={() => {
                if (!street) {
                  return;
                }
                Taro.navigateTo({
                  url: `/pages/feedback/index?id=${street._id}`
                });
              }}
            >
              结束
            </AtButton>
          </View>
          <View className="picture">
            <AtButton
              type="primary"
              onClick={() => {
                setCameraStatus(true);
              }}
            >
              拍照打卡
            </AtButton>
          </View>
        </View>
      </View>
      {street && (
        <AtFloatLayout
          isOpened={drawerStatus}
          onClose={() => {
            setDrawerStatus(false);
          }}
        >
          <View className="sw">
            <Swiper
              indicatorColor="#999"
              indicatorActiveColor="#333"
              circular
              indicatorDots
            >
              {street.pics.map(pic => (
                <SwiperItem key={pic.url}>
                  <Image src={pic.url} mode="aspectFit"></Image>
                  <View className="image-des">{pic.desc}</View>
                </SwiperItem>
              ))}
            </Swiper>
          </View>
        </AtFloatLayout>
      )}
    </View>
  );
}

Running.config = {
  navigationBarTitleText: "Running"
};

export default Running;
