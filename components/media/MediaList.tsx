// components/media/MediaList.tsx
import { FlatList, ViewToken, LayoutChangeEvent } from "react-native";
import { useRef, useState, useCallback, useEffect } from "react";
import VideoItem from "./VideoItem";
import { MediaItem } from "@/redux/features/mediaUpload/types";
import { useIsFocused } from "@react-navigation/native";

type ContextConfig = {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
};

type Props = {
  kid?: string;
  media: MediaItem[];
  context?: "feed" | "liked" | "word";
  contextConfig?: ContextConfig;
};

export default function MediaList({ kid, media, context, contextConfig }: Props) {
  const [visibleIndex, setVisibleIndex] = useState<number>(0);
  const [availableHeight, setAvailableHeight] = useState<number | null>(null);
  const isFocused = useIsFocused();

  const determineHeight = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setAvailableHeight(height);
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length === 1 && viewableItems[0].index !== null) {
        setVisibleIndex(viewableItems[0].index);
        if (
          contextConfig &&
          contextConfig.currentIndex !== viewableItems[0].index
        ) {
          contextConfig.setCurrentIndex(viewableItems[0].index);
        }
      }
    },
    [contextConfig, context]
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 20,
  }).current;
  
  return (
    <FlatList
      initialScrollIndex={
        contextConfig?.currentIndex && contextConfig.currentIndex > -1
          ? contextConfig.currentIndex
          : 0
      }
      disableIntervalMomentum
      windowSize={3}
      scrollsToTop={false}
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
            isVisible={
              contextConfig
                ? index === contextConfig.currentIndex
                : index === visibleIndex
            }
            isTabFocused={isFocused}
            height={availableHeight}
          />
        ) : null
      }
    />
  );
}