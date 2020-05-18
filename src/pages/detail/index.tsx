import Taro, { useState, useEffect, useRouter } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtTag, AtButton } from "taro-ui";

import { Street } from "src/interfaces/street";
import Card from "../list/Card";
import "./index.less";
import url from "../../constants/url";
import { getJSON } from "../../utils/request";

function Detail() {
  const router = useRouter();
  const id = router.params.id;
  const [street, setStreet] = useState<null | Street>(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    getJSON(`${url.queryById}?id=${id}`, null).then(res => {
      const newStreet = res.data.data;
      setStreet(newStreet);
    });
  }, [id]);

  if (!street) {
    return null;
  }

  return (
    <View className="panel">
      <Card street={street}></Card>
      <View className="info">
        <View className="tags">
          {street.tags.map(tag => (
            <View key={tag} className="tagWrapper">
              <AtTag circle>{tag}</AtTag>
            </View>
          ))}
        </View>
        <View className="desc">
          {street.desc.map(item => (
            <View className="item" key={item.desc}>
              <View className="avatar">
                <Image src="../../assets/user.png"></Image>
              </View>
              <View className="desc">{item.desc}</View>
            </View>
          ))}
        </View>
      </View>
      <View className="buttons">
        <AtButton
          type="primary"
          onClick={() => {
            Taro.navigateTo({
              url: `/pages/running/index?id=${street._id}`
            });
          }}
        >
          开始
        </AtButton>
      </View>
    </View>
  );
}

Detail.config = {
  navigationBarTitleText: "周边跑"
};

export default Detail;
