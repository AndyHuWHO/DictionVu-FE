import {
  FlatList,
  ViewToken,
  LayoutChangeEvent,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRef, useState } from "react";
import VideoItem from "./VideoItem";
import { useIsFocused } from "@react-navigation/native";
import { MediaItem } from "@/redux/features/mediaUpload/types";

type Props = {
  media: MediaItem[];
};

export default function MediaList({ media }: Props) {
  const [visibleIndex, setVisibleIndex] = useState<number>(0);
  const [availableHeight, setAvailableHeight] = useState<number | null>(null);
  // whether media tab is focused
  const isFocused = useIsFocused();

  const determineHeight = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setAvailableHeight(height);
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setVisibleIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 20,
  }).current;

  const { height: SCREEN_HEIGHT } = Dimensions.get("screen");

  return (
    <FlatList
      data={media}
      keyExtractor={(item) => item.id}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      decelerationRate="fast"
      snapToAlignment="start"
      onLayout={determineHeight}
      snapToInterval={availableHeight ?? 0}
      getItemLayout={(data, index) => ({
        length: availableHeight ?? 0,
        offset: (availableHeight ?? 0) * index,
        index,
      })}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      renderItem={({ item, index }) =>
        availableHeight !== null ? (
          <VideoItem
            media={item}
            isVisible={index === visibleIndex}
            isTabFocused={isFocused}
            height={availableHeight}
          />
        ) : null
      }
    />
  );
}
