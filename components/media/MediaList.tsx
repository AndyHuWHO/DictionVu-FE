import {
  FlatList,
  ViewToken,
  LayoutChangeEvent,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRef, useState, useCallback } from "react";
import VideoItem from "./VideoItem";
import { useIsFocused } from "@react-navigation/native";
import { MediaItem } from "@/redux/features/mediaUpload/types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { setCurrentIndex } from "@/redux/features/mediaFeed/mediaFeedSlice";

type Props = {
  media: MediaItem[];
  context?: "feed" | "word";
};

export default function MediaList({ media, context }: Props) {
  const [visibleIndex, setVisibleIndex] = useState<number>(0);
  const [availableHeight, setAvailableHeight] = useState<number | null>(null);
  const currentIndex = useSelector((state: RootState) => state.mediaFeed.currentIndex);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const determineHeight = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setAvailableHeight(height);
  };

  // const onViewableItemsChanged = useRef(
  //   ({ viewableItems }: { viewableItems: ViewToken[] }) => {
  //     if (viewableItems.length > 0 && viewableItems[0].index !== null) {
  //       setVisibleIndex(viewableItems[0].index);
  //       console.log("current index before updating: ", currentIndex);
  //       if (context === "feed" && currentIndex) {
  //         console.log("updating current index to:", viewableItems[0].index);
  //         dispatch(setCurrentIndex(viewableItems[0].index));
  //       }
  //     }
  //   }
  // ).current;

  const onViewableItemsChanged = useCallback(
  ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setVisibleIndex(viewableItems[0].index);
      console.log("current index before updating: ", currentIndex);
      if (context === "feed" && currentIndex !== viewableItems[0].index) {
        console.log("updating current index to:", viewableItems[0].index);
        dispatch(setCurrentIndex(viewableItems[0].index));
      }
    }
  },
  [currentIndex, context, dispatch]
);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 20,
  }).current;


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
            isVisible={context === "feed" ? index === currentIndex : index === visibleIndex}
            isTabFocused={isFocused}
            height={availableHeight}
          />
        ) : null
      }
    />
  );
}
