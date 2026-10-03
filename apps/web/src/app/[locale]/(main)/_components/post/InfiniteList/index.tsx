import {
  CSSProperties,
  forwardRef,
  type ComponentProps,
  type ForwardedRef,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
  useEffect,
  useState,
} from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

interface InfiniteListProps<T> {
  data: T[];
  endReached?: () => void;
  startReached?: () => void;
  itemContent: (index: number, item: T) => ReactNode;
  continuePage: boolean;
  FooterComponent?: ReactNode;
  skeleton?: ReactNode;
  useWindowScroll?: boolean;
  contentNotFoundItem?: ReactNode | string;
  contentNotFoundCheck?: boolean;
  styles?: CSSProperties;
  initialTopMostItemIndex?: ComponentProps<
    typeof Virtuoso
  >["initialTopMostItemIndex"];
  enableInitialTopMostItemIndex?: boolean;
}

function InfiniteListInner<T>(
  {
    data,
    endReached,
    startReached,
    itemContent,
    continuePage,
    FooterComponent,
    skeleton,
    styles,
    initialTopMostItemIndex,
    enableInitialTopMostItemIndex = false,
    useWindowScroll = true,
    contentNotFoundItem = "Không còn dữ liệu",
    contentNotFoundCheck = true,
  }: InfiniteListProps<T>,
  ref: ForwardedRef<VirtuosoHandle>,
) {
  const [customScrollParent, setCustomScrollParent] =
    useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!useWindowScroll) {
      return;
    }

    const desktopMediaQuery = window.matchMedia("(min-width: 768px)");
    const updateScrollParent = () => {
      setCustomScrollParent(
        desktopMediaQuery.matches
          ? document.querySelector<HTMLElement>("[data-main-scroll-container]")
          : null,
      );
    };

    const animationFrame = window.requestAnimationFrame(updateScrollParent);
    desktopMediaQuery.addEventListener("change", updateScrollParent);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      desktopMediaQuery.removeEventListener("change", updateScrollParent);
    };
  }, [useWindowScroll]);

  return (
    <Virtuoso
      useWindowScroll={useWindowScroll && !customScrollParent}
      customScrollParent={
        useWindowScroll ? (customScrollParent ?? undefined) : undefined
      }
      data={data}
      ref={ref}
      {...(enableInitialTopMostItemIndex && initialTopMostItemIndex
        ? { initialTopMostItemIndex }
        : {})}
      endReached={endReached ? () => endReached() : undefined}
      startReached={startReached ? () => startReached() : undefined}
      itemContent={itemContent}
      followOutput={false}
      style={styles}
      components={{
        Footer: () =>
          !continuePage
            ? FooterComponent ||
              (contentNotFoundCheck ? (
                <div className="text-center text-muted-foreground">
                  {contentNotFoundItem}
                </div>
              ) : (
                " "
              ))
            : skeleton || <div>Loading…</div>,
      }}
    />
  );
}

const InfiniteList = forwardRef(InfiniteListInner) as <T>(
  props: InfiniteListProps<T> & RefAttributes<VirtuosoHandle>,
) => ReactElement;

export default InfiniteList;
