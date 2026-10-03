import LinksEditModal from "@/app/[locale]/(main)/(private)/(default)/profile/_components/LinksEditModal";
import NameEdit from "@/app/[locale]/(main)/(private)/(default)/profile/_components/NameEdit";
import AvatarGroup from "@/app/[locale]/(main)/_components/common/AvatarGroup";
import MenuPopup from "@/app/[locale]/(main)/_components/common/MenuPopup";
import ModalPopup from "@/app/[locale]/(main)/_components/common/ModalPopup";
import Header from "@/app/[locale]/(main)/_components/common/ModalPopup/Header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/features/auth/hooks";
import { useUpdateProfileMutation } from "@/features/user/hooks/use-update-profile-mutation";
import {
  updateProfileSchema,
  type UpdateProfileDto,
} from "@/schema/user.schema";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import BioEditModal from "../BioEdit/index";

const ProfileSettings = ({ onClose }: { onClose: () => void }) => {
  const t = useTranslations();
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [activeModal, setActiveModal] = useState<
    "main" | "name" | "bio" | "links"
  >("main");

  const [previewAvatar, setPreviewAvatar] = useState<File | null>(null);
  const [previewBio, setPreviewBio] = useState<string | null | undefined>(
    user?.bio,
  );
  const [previewName, setPreviewName] = useState<string | null | undefined>(
    user?.name,
  );

  // For labelWebsite and website, we manage them locally in the main view or via links modal
  const [labelWebsite, setLabelWebsite] = useState<string | null | undefined>(
    user?.labelWebsite,
  );
  const [website, setWebsite] = useState<string | null | undefined>(
    user?.website,
  );

  const [isPrivate, setIsPrivate] = useState<boolean>(user?.isPrivate ?? false);

  const { mutate: updateProfileMutation, isPending } =
    useUpdateProfileMutation();

  if (!user) return null;

  const handleUploadFile = () => inputRef.current?.click();

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];
    if (image) setPreviewAvatar(image);
  };

  const handleUpdateLink = (title: string, url: string) => {
    setLabelWebsite(title);
    setWebsite(url);
  };

  const handleRemoveLink = () => {
    setLabelWebsite(null);
    setWebsite(null);
  };

  const updateUser = async () => {
    const payload: UpdateProfileDto = {
      name: previewName ?? undefined,
      bio: previewBio ?? undefined,
      labelWebsite: labelWebsite ?? undefined,
      website: website ?? undefined,
      isPrivate,
    };

    const parsed = updateProfileSchema.safeParse(payload);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      toast.error(firstError.message);
      return;
    }

    updateProfileMutation(payload, {
      onSuccess: () => {
        toast.success(
          t("profileSettings.saveSuccess") || "Cập nhật thành công",
        );
        onClose();
      },
      onError: (err: any) => {
        toast.error(
          err.message || t("profileSettings.saveError") || "Có lỗi xảy ra",
        );
      },
    });
  };

  return (
    <ModalPopup onClose={onClose}>
      <div className="relative">
        <div
          className="absolute -inset-[50px] bg-transparent z-[-1]"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="relative bg-background rounded-xl overflow-hidden max-h-[90vh] flex flex-col">
          {activeModal === "main" && (
            <>
              <div className="md:hidden block p-4 pb-0">
                <Header
                  headerText={t("profileSettings.title")}
                  onClose={onClose}
                />
              </div>

              <div className="flex-1 overflow-y-auto px-4">
                {/* Tên */}
                <div className="flex items-center justify-between py-4">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => setActiveModal("name")}>
                    <h3 className="font-semibold mb-1 text-sm">
                      {t("profileSettings.name")}
                    </h3>
                    <p className="text-sm">{previewName || user.name}</p>
                  </div>

                  <input
                    type="file"
                    ref={inputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleChangeImage}
                  />

                  <MenuPopup
                    className="hover:!bg-transparent !p-0 size-14 cursor-pointer border rounded-full"
                    mode="long"
                    buttonActive={
                      <AvatarGroup
                        size={14}
                        url={
                          (previewAvatar &&
                            URL.createObjectURL(previewAvatar)) ||
                          user.avatar ||
                          ""
                        }
                        fallBack={user?.username?.slice(0, 2).toUpperCase()}
                      />
                    }
                    customPopup="-translate-x-1/2">
                    <DropdownMenuItem onClick={handleUploadFile}>
                      {t("profileSettings.uploadAvatar")}
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem>
                      <span className="text-red-500">
                        {t("profileSettings.removeAvatar")}
                      </span>
                    </DropdownMenuItem> */}
                  </MenuPopup>
                </div>
                <Separator />

                {/* Tên người dùng */}
                <div className="py-4">
                  <h3 className="font-semibold mb-1 text-sm">Tên người dùng</h3>
                  <p className="text-sm">{user.username}</p>
                </div>
                <Separator />

                {/* Tiểu sử */}
                <div
                  onClick={() => setActiveModal("bio")}
                  className="py-4 cursor-pointer">
                  <h3 className="font-semibold mb-1 text-sm">
                    {t("profileSettings.bio")}
                  </h3>
                  <p className="text-sm">
                    {previewBio || user.bio || "Thêm tiểu sử"}
                  </p>
                </div>
                <Separator />

                {/* Liên kết */}
                <div
                  className="py-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setActiveModal("links")}>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">
                      {t("profileSettings.links")}
                    </h3>
                    {labelWebsite && website && (
                      <p className="text-sm mt-1">{labelWebsite}</p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
                <Separator />

                {/* Privacy */}
                <div className="py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">
                      {t("profileSettings.profilePrivacy")}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {isPrivate
                          ? t("profileSettings.private")
                          : t("profileSettings.public")}
                      </span>
                      <Switch
                        checked={isPrivate}
                        onCheckedChange={setIsPrivate}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("profileSettings.profilePrivacyDesc")}
                  </p>
                </div>
              </div>

              {/* Done Button */}
              <div className="p-4 pt-2">
                <Button
                  onClick={updateUser}
                  disabled={isPending}
                  className="w-full bg-black hover:bg-black/90 text-white h-12 rounded-xl font-semibold">
                  {isPending ? "Đang lưu..." : t("profileSettings.done")}
                </Button>
              </div>
            </>
          )}

          {activeModal === "bio" && (
            <BioEditModal
              bioText={previewBio ?? user.bio ?? ""}
              onSave={setPreviewBio}
              setActiveModal={setActiveModal}
            />
          )}

          {activeModal === "name" && (
            <NameEdit
              nameText={previewName ?? user.username}
              onSave={setPreviewName}
              setActiveModal={setActiveModal}
            />
          )}

          {activeModal === "links" && (
            <LinksEditModal
              links={
                labelWebsite && website
                  ? [{ title: labelWebsite, url: website }]
                  : []
              }
              onAddLink={(link) => handleUpdateLink(link.title, link.url)}
              onRemoveLink={handleRemoveLink}
              onUpdateLink={(index, field, value) => {
                if (field === "title") setLabelWebsite(value);
                if (field === "url") setWebsite(value);
              }}
              setActiveModal={setActiveModal}
            />
          )}
        </div>
      </div>
    </ModalPopup>
  );
};

export default ProfileSettings;
