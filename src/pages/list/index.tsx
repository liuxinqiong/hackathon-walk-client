import Taro, { useState, useEffect } from "@tarojs/taro";
import { ScrollView, View } from "@tarojs/components";

import { Street } from "src/interfaces/street";
import "./index.less";
import { getJSON } from "../../utils/request";
import url from "../../constants/url";
import Card from "./Card";

function List() {
  const [streets, setStreets] = useState<Street[]>([]);
  useEffect(() => {
    getJSON(url.query, null).then(res => {
      const newStreets: Street[] = res.data.data;
      setStreets(newStreets);
    });
  }, []);
  return (
    <ScrollView className="panel">
      {streets.map(street => {
        return (
          <View
            key={street._id}
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/detail/index?id=${street._id}`
              });
            }}
          >
            <Card street={street}></Card>
          </View>
        );
      })}
    </ScrollView>
  );
}

List.config = {
  navigationBarTitleText: "周边跑"
};

export default List;
