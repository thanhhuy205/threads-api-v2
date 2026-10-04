export const PAGE_TITLES_BY_PATH: Record<string, string> = {
  "/": "home",
  "/search": "search",
  "/favorites": "favorites",
  "/profile": "profile",
  "/profile/replies": "profile",
  "/profile/media": "profile",
  "/profile/reposts": "profile",
  "/activity": "activity",
  "/settings": "settings",
  "/settings/help": "help",
  "/settings/privacy": "privacy",
  "/settings/account": "account",
  "/settings/account_status": "account_status",
};

export const PAGE_CHILDREN_BY_PATH: Record<string, string> = {
  "/settings/help": "/settings",
  "/settings/privacy": "/settings",
  "/settings/account": "/settings",
  "/settings/account_status": "/settings",
};

export const NAV_LINKS = [
  "/",
  "/search",
  "/favorites",
  "/profile",
  "/activity",
];
