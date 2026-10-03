// "use client";

// import { usePathname } from "next/navigation";
// import { useEffect } from "react";

// import { PAGE_TITLES_BY_PATH } from "@/constant/pageTitless";
// import { useTranslations } from "next-intl";

// const DEFAULT_TITLE = "PulseBoard";
// const DEFAULT_DESCRIPTION = "PulseBoard";

// const AUTH_TITLE_KEYS: Record<string, string> = {
//     "/login": "auth.login",
//     "/register": "auth.register",
//     "/forgot-password": "auth.forgotPasswordTitle",
//     "/reset-password": "auth.resetPasswordTitle",
//     "/verify-email": "auth.verifyEmailSent",
// };

// const EXTRA_TITLE_KEYS: Record<string, string> = {
//     "/friends": "feed.friends",
// };

// const resolveTitle = (pathname: string, translate: (key: string) => string) => {
//     if (AUTH_TITLE_KEYS[pathname]) {
//         return translate(AUTH_TITLE_KEYS[pathname]);
//     }

//     if (EXTRA_TITLE_KEYS[pathname]) {
//         return translate(EXTRA_TITLE_KEYS[pathname]);
//     }

//     if (pathname.startsWith("/messages")) {
//         return "Messages";
//     }

//     const isPostDetail = /^(\/[^/]+)?\/post\/[^/]+$/.test(pathname);
//     if (isPostDetail) {
//         return translate("post.viewPost");
//     }

//     const navKey = PAGE_TITLES_BY_PATH[pathname];
//     if (navKey) {
//         return translate(`nav.${navKey}`);
//     }

//     // Home route: "/" hoặc locale root như "/vi", "/en"
//     const segments = pathname.split("/").filter(Boolean);
//     const isHomeRoute =
//         pathname === "/" ||
//         (segments.length === 1 && /^[a-z]{2}(-[A-Z]{2})?$/.test(segments[0]));
//     if (isHomeRoute) {
//         return DEFAULT_TITLE;
//     }

//     const isProfileRoute = /^\/[^/]+$/.test(pathname) && !AUTH_TITLE_KEYS[pathname];
//     if (isProfileRoute) {
//         return translate("nav.profile");
//     }

//     return DEFAULT_TITLE;
// };

// const upsertMetaDescription = (content: string) => {
//     if (typeof document === "undefined") {
//         return;
//     }

//     let meta = document.querySelector("meta[name=\"description\"]") as
//         | HTMLMetaElement
//         | null;

//     if (!meta) {
//         meta = document.createElement("meta");
//         meta.setAttribute("name", "description");
//         document.head.appendChild(meta);
//     }

//     meta.setAttribute("content", content);
// };

// export default function PageMetadata() {
//     const pathname = usePathname();
//     const t = useTranslations();

//     useEffect(() => {
//         const title = resolveTitle(pathname, t);
//         const normalizedTitle = title || DEFAULT_TITLE;
//         const finalTitle =
//             normalizedTitle === DEFAULT_TITLE
//                 ? DEFAULT_TITLE
//                 : `${normalizedTitle} | ${DEFAULT_TITLE}`;

//         document.title = finalTitle;
//         upsertMetaDescription(`${normalizedTitle} | ${DEFAULT_DESCRIPTION}`);
//     }, [pathname, t]);

//     return null;
// }
