// components/media/MediaList.tsx
import { FlatList, ViewToken, LayoutChangeEvent } from "react-native";
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
  const currentIndex = useSelector(
    (state: RootState) => state.mediaFeed.currentIndex
  );
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
        // console.log("current index before updating: ", currentIndex);
        if (context === "feed" && currentIndex !== viewableItems[0].index) {
          // console.log("updating current index to:", viewableItems[0].index);
          dispatch(setCurrentIndex(viewableItems[0].index));
        }
      }
    },
    [currentIndex, context, dispatch]
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 20,
  }).current;

  // const flatListRef = useRef<FlatList<MediaItem>>(null);
  // flatListRef.current?.scrollToOffset({
  //   offset: currentIndex * (availableHeight ?? 0),
  //   animated: false,
  // });

  return (
    <FlatList
      disableIntervalMomentum={true}
      data={media}
      keyExtractor={(item) => item.id}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      // decelerationRate={0.00}
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
              context === "feed"
                ? index === currentIndex
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

// import {
//   FlatList,
//   ViewToken,
//   LayoutChangeEvent,
//   StyleSheet,
//   Dimensions,
//   NativeSyntheticEvent,        // ✅
//   NativeScrollEvent,           // ✅
// } from "react-native";
// import { useRef, useState, useCallback } from "react";
// import VideoItem from "./VideoItem";
// import { useIsFocused } from "@react-navigation/native";
// import { MediaItem } from "@/redux/features/mediaUpload/types";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { useDispatch } from "react-redux";
// import { setCurrentIndex } from "@/redux/features/mediaFeed/mediaFeedSlice";

// type Props = {
//   media: MediaItem[];
//   context?: "feed" | "word";
// };

// export default function MediaList({ media, context }: Props) {
//   const [visibleIndex, setVisibleIndex] = useState<number>(0);
//   const [availableHeight, setAvailableHeight] = useState<number | null>(null);
//   const heightRef = useRef(0);                                  // ✅
//   const currentIndex = useSelector((state: RootState) => state.mediaFeed.currentIndex);
//   const isFocused = useIsFocused();
//   const dispatch = useDispatch();

//   const determineHeight = (event: LayoutChangeEvent) => {
//     const { height } = event.nativeEvent.layout;
//     setAvailableHeight(height);
//     heightRef.current = height;                                 // ✅
//   };

//   // NOTE: we keep this as a no-op to preserve your structure, but we no longer
//   // drive the index from viewability (that timing causes the “peek”).
//   // ✅ (modified: stop dispatching index changes here)
//   const onViewableItemsChanged = useCallback(
//     ({ viewableItems }: { viewableItems: ViewToken[] }) => {
//       if (viewableItems.length > 0 && viewableItems[0].index !== null) {
//         // For non-feed contexts we still mirror a local index, but final index
//         // changes are driven by momentum end for both contexts.
//         setVisibleIndex((prev) => prev); // intentionally no-op to avoid timing issues ✅
//       }
//     },
//     []
//   );

//   const viewabilityConfig = useRef({
//     itemVisiblePercentThreshold: 20,
//   }).current;

//   // ✅ compute the snapped page exactly when scrolling finishes
//   const handleSnapEnd = useCallback(
//     (e: NativeSyntheticEvent<NativeScrollEvent>) => {
//       const offsetY = e.nativeEvent.contentOffset.y;
//       const h = heightRef.current || availableHeight || 1;
//       const idx = Math.round(offsetY / h);

//       if (context === "feed") {
//         if (idx !== currentIndex) {
//           dispatch(setCurrentIndex(idx));
//         }
//       } else {
//         if (idx !== visibleIndex) {
//           setVisibleIndex(idx);
//         }
//       }
//     },
//     [availableHeight, context, currentIndex, dispatch, visibleIndex]
//   );

//   return (
//     <FlatList
//       data={media}
//       keyExtractor={(item) => item.id}
//       pagingEnabled
//       showsVerticalScrollIndicator={false}
//       decelerationRate={0}                         // keep your current setting
//       // decelerationRate="fast"
//       snapToAlignment="start"
//       onLayout={determineHeight}
//       snapToInterval={availableHeight ?? 0}
//       getItemLayout={(data, index) => ({
//         length: availableHeight ?? 0,
//         offset: (availableHeight ?? 0) * index,
//         index,
//       })}
//       // ✅ rely on exact snap end instead of viewability timing
//       onMomentumScrollEnd={handleSnapEnd}          // ✅
//       onScrollEndDrag={handleSnapEnd}              // ✅ (fallback for very light flicks)
//       disableIntervalMomentum                       // ✅ prevents residual glide past intervals
//       removeClippedSubviews                         // ✅ avoids rendering bleed of previous item
//       windowSize={3}                                // ✅ tighter rendering window (prev, current, next)
//       maxToRenderPerBatch={2}                       // ✅
//       initialNumToRender={1}                        // ✅
//       updateCellsBatchingPeriod={16}                // ✅
//       scrollEventThrottle={16}                      // ✅
//       onViewableItemsChanged={onViewableItemsChanged}
//       viewabilityConfig={viewabilityConfig}
//       renderItem={({ item, index }) =>
//         availableHeight !== null ? (
//           <VideoItem
//             media={item}
//             isVisible={context === "feed" ? index === currentIndex : index === visibleIndex}
//             isTabFocused={isFocused}
//             height={availableHeight}
//           />
//         ) : null
//       }
//     />
//   );
// }
