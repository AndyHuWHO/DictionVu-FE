// components/media/MediaList.tsx
import { FlatList, View, ViewToken, LayoutChangeEvent } from "react-native";
import { useRef, useState, useCallback, useEffect } from "react";
import VideoItem from "./VideoItem";
import { MediaItem } from "@/redux/features/mediaUpload/types";
import { useIsFocused } from "@react-navigation/native";

type ContextConfig = {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
};

type Props = {
  media: MediaItem[];
  context?: "feed" | "liked" | "word";
  contextConfig?: ContextConfig;
};

export default function MediaList({ media, context, contextConfig }: Props) {
  const [visibleIndex, setVisibleIndex] = useState<number>(0);
  const [availableHeight, setAvailableHeight] = useState<number | null>(null);
  const isFocused = useIsFocused();

  const determineHeight = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0) {
      setAvailableHeight(height);
    }
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
    [contextConfig, context],
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 20,
  }).current;

  const renderItem = useCallback(
    ({ item, index }: { item: MediaItem; index: number }) => {
      return availableHeight !== null ? (
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
      ) : null;
    },
    [availableHeight, contextConfig, visibleIndex, isFocused],
  );

  const initialScrollIndex = Math.max(
    0,
    Math.min(contextConfig?.currentIndex ?? 0, media.length - 1),
  );

  return (
    <View style={{ flex: 1 }} onLayout={determineHeight}>
      {availableHeight !== null && (
        <FlatList
          style={{ flex: 1 }}
          data={media}
          renderItem={renderItem}
          initialScrollIndex={initialScrollIndex}
          disableIntervalMomentum
          initialNumToRender={2}
          windowSize={3}
          scrollsToTop={false}
          keyExtractor={(item) => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          snapToAlignment="start"
          snapToInterval={availableHeight}
          getItemLayout={(_, index) => ({
            length: availableHeight,
            offset: availableHeight * index,
            index,
          })}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
      )}
    </View>
  );
}
