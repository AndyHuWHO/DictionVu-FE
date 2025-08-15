// components/media/MediaPager.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, LayoutChangeEvent } from "react-native";
import PagerView, { PagerViewOnPageSelectedEvent } from "react-native-pager-view";
import VideoItem from "./VideoItem";
import { useIsFocused } from "@react-navigation/native";
import { MediaItem } from "@/redux/features/mediaUpload/types";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setCurrentIndex } from "@/redux/features/mediaFeed/mediaFeedSlice";

type Props = {
  media: MediaItem[];
  context?: "feed" | "word";
};

export default function MediaPager({ media, context }: Props) {
  const pagerRef = useRef<PagerView>(null);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const currentIndex = useSelector((s: RootState) => s.mediaFeed.currentIndex);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [pvHeight, setPvHeight] = useState<number | null>(null);

  // Measure the PagerView itself
  const onPagerLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h && h !== pvHeight) setPvHeight(h);
  };

  // Keep indices in bounds if media changes
  useEffect(() => {
    if (media.length === 0) return;
    if (context === "feed") {
      if (currentIndex > media.length - 1) {
        dispatch(setCurrentIndex(Math.max(0, media.length - 1)));
      }
    } else {
      if (visibleIndex > media.length - 1) {
        setVisibleIndex(Math.max(0, media.length - 1));
      }
    }
  }, [media.length, context, currentIndex, visibleIndex, dispatch]);

  const initialPage = useMemo(() => {
    return context === "feed" ? Math.min(currentIndex, Math.max(0, media.length - 1)) : 0;
  }, [context, currentIndex, media.length]);

  // Keep pager synced if currentIndex changes externally
  useEffect(() => {
    if (context !== "feed") return;
    const page = Math.min(currentIndex, Math.max(0, media.length - 1));
    pagerRef.current?.setPageWithoutAnimation(page);
  }, [currentIndex, media.length, context]);

  const onPageSelected = useCallback(
    (e: PagerViewOnPageSelectedEvent) => {
      const idx = e.nativeEvent.position;
      if (context === "feed") {
        console.log("Page selected in feed context:", idx);
        if (idx !== currentIndex) dispatch(setCurrentIndex(idx));
      } else {
        if (idx !== visibleIndex) setVisibleIndex(idx);
      }
    },
    [context, currentIndex, visibleIndex, dispatch]
  );

  return (
    <PagerView
      ref={pagerRef}
      style={{ flex: 1 }}
      onLayout={onPagerLayout}
      orientation="vertical"
      overdrag={false}
      offscreenPageLimit={1}
      onPageSelected={onPageSelected}
      initialPage={initialPage}
      scrollEnabled={true}
    >
      {pvHeight === null ? (
        // Render a lightweight placeholder page so PagerView can mount and report layout
        <View key="placeholder" style={{ flex: 1 }} />
      ) : (
        media.map((item, index) => (
          // Pages fill the PagerView exactly
          <View key={item.id} style={{ flex: 1, width: "100%" }}>
            <VideoItem
              media={item}
              isVisible={context === "feed" ? index === currentIndex : index === visibleIndex}
              isTabFocused={isFocused}
              height={pvHeight}  // pass the measured pager height to your item
            />
          </View>
        ))
      )}
    </PagerView>
  );
}
