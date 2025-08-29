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
    setAvailableHeight(height);
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setVisibleIndex(viewableItems[0].index);
        // console.log(
        //   "current index before updating: ",
        //   contextConfig?.currentIndex
        // );
        if (
          contextConfig &&
          contextConfig.currentIndex !== viewableItems[0].index
        ) {
          // console.log("updating current index to:", viewableItems[0].index);
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

// import { FlatList, ViewToken, LayoutChangeEvent } from "react-native";
// import { useRef, useState, useCallback } from "react";
// import VideoItem from "./VideoItem";
// import { useIsFocused } from "@react-navigation/native";
// import { MediaItem } from "@/redux/features/mediaUpload/types";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { useDispatch } from "react-redux";
// import { setCurrentFeedIndex } from "@/redux/features/mediaFeed/mediaFeedSlice";

// type Props = {
//   media: MediaItem[];
//   context?: "feed" | "word" | "liked";
// };

// export default function MediaList({ media, context }: Props) {
//   const [visibleIndex, setVisibleIndex] = useState<number>(0);
//   const [availableHeight, setAvailableHeight] = useState<number | null>(null);
//   const currentIndex = useSelector(
//     (state: RootState) => state.mediaFeed.currentFeedIndex
//   );
//   const currentLikedIndex = useSelector(
//     (state: RootState) => state.mediaLiked.currentLikedIndex
//   );
//   const isFocused = useIsFocused();
//   const dispatch = useDispatch();

//   const determineHeight = (event: LayoutChangeEvent) => {
//     const { height } = event.nativeEvent.layout;
//     setAvailableHeight(height);
//   };

//   const onViewableItemsChanged = useCallback(
//     ({ viewableItems }: { viewableItems: ViewToken[] }) => {
//       if (viewableItems.length > 0 && viewableItems[0].index !== null) {
//         setVisibleIndex(viewableItems[0].index);
//         // console.log("current index before updating: ", currentIndex);
//         if (context === "feed" && currentIndex !== viewableItems[0].index) {
//           // console.log("updating current index to:", viewableItems[0].index);
//           dispatch(setCurrentFeedIndex(viewableItems[0].index));
//         }
//       }
//     },
//     [currentIndex, context, dispatch]
//   );

//   const viewabilityConfig = useRef({
//     itemVisiblePercentThreshold: 20,
//   }).current;

//   // const flatListRef = useRef<FlatList<MediaItem>>(null);
//   // flatListRef.current?.scrollToOffset({
//   //   offset: currentIndex * (availableHeight ?? 0),
//   //   animated: false,
//   // });

//   return (
//     <FlatList
//       disableIntervalMomentum={true}
//       data={media}
//       keyExtractor={(item) => item.id}
//       pagingEnabled
//       showsVerticalScrollIndicator={false}
//       // decelerationRate={0.00}
//       decelerationRate="fast"
//       snapToAlignment="start"
//       onLayout={determineHeight}
//       snapToInterval={availableHeight ?? 0}
//       getItemLayout={(data, index) => ({
//         length: availableHeight ?? 0,
//         offset: (availableHeight ?? 0) * index,
//         index,
//       })}
//       onViewableItemsChanged={onViewableItemsChanged}
//       viewabilityConfig={viewabilityConfig}
//       renderItem={({ item, index }) =>
//         availableHeight !== null ? (
//           <VideoItem
//             media={item}
//             isVisible={
//               context === "feed"
//                 ? index === currentIndex
//                 : index === visibleIndex
//             }
//             isTabFocused={isFocused}
//             height={availableHeight}
//           />
//         ) : null
//       }
//     />
//   );
// }
