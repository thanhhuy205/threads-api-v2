import AvatarGroup from "@/app/[locale]/(main)/_components/common/AvatarGroup";
import UserAction from "@/app/[locale]/(main)/_components/user/UserAction";
import { CardContent } from "@/components/ui/card";
import type {
  MentionInput,
  PostTypeStatus,
  ScheduleDateRange,
} from "@/types/post";
import type { User } from "@/types/user";

interface UserPostFormProps {
  user: User;
  setContent: (value: string) => void;
  setTopic: (value: string) => void;
  setMentions: (value: MentionInput[]) => void;
  setPreviewImage: (value: File[] | null) => void;
  setPostType: (value: PostTypeStatus) => void;
  setScheduledDate: (value?: ScheduleDateRange) => void;
  setScheduledTimeFrom: (value?: string) => void;
  setScheduledTimeTo: (value?: string) => void;
  t: (key: string) => string;
}

const UserPostForm = ({
  user,
  setContent,
  setTopic,
  setMentions,
  setPreviewImage,
  setPostType,
  setScheduledDate,
  setScheduledTimeFrom,
  setScheduledTimeTo,
  t,
}: UserPostFormProps) => {
  const fallbackName = (user?.username ?? "").slice(0, 2).toUpperCase();

  return (
    <CardContent className="p-4 pt-5">
      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <AvatarGroup
            size={10}
            url={user?.avatar ?? ""}
            fallBack={fallbackName}
          />

          <div className="w-[2px] flex-1 bg-border my-2 min-h-[40px] rounded-full"></div>

          <AvatarGroup
            size={4}
            url={user?.avatar ?? ""}
            fallBack={fallbackName}
            className="object-cover"
            classNameFallback="object-cover text-[8px] text-center border"
          />
        </div>

        <div className="flex-1 pt-1 space-y-4 overflow-x-auto">
          <UserAction
            username={user?.username}
            onChangeContent={(data) => {
              setContent(data.content);
              setTopic(data.topic);
              setMentions(data.mentions);
              setPreviewImage(data.previewImage);
              setPostType(data.postType);
              setScheduledDate(data.scheduledDate);
              setScheduledTimeFrom(data.scheduledTimeFrom);
              setScheduledTimeTo(data.scheduledTimeTo);
            }}
          />

          {/* <div className="min-h-[20px] flex items-center text-muted-foreground/50 text-sm pt-3 cursor-pointer">
            {t("post.addToThread")}
          </div> */}
        </div>
      </div>
    </CardContent>
  );
};

export default UserPostForm;
