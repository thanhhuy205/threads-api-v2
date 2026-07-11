import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import {
    ActionType,
    FollowStatus,
    FriendRequestStatus,
    PostMediaStatus,
    PostMediaType,
    PostScoreLabel,
    PostType,
    PrismaClient,
    ReplyPermission,
    ReportStatus,
    ReportTargetType,
    UserStatus,
    VisibilityPost,
} from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

// ─── Prisma Setup ─────────────────────────────────────────────────────────────
const adapter = new PrismaMariaDb({
    port: Number(process.env.DB_PORT) || 3306,
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "threads_api",
});
const prisma = new PrismaClient({ adapter } as any);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}
function rand(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomDate(daysAgo: number): Date {
    return new Date(Date.now() - Math.random() * daysAgo * 86_400_000);
}
function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}
function slugify(str: string): string {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d").replace(/Đ/g, "D")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();
}

// ─── 50 New Avatar URLs (from Excel scrape) ──────────────────────────────────
const NEW_AVATAR_URLS: string[] = [
    "https://i.pinimg.com/736x/f0/8a/6c/f08a6c4e092e38630b3bddd99490d112.jpg",
    "https://i.pinimg.com/originals/05/43/5e/05435e00dba47316ed0cff6b6fd0e719.jpg",
    "https://i.pinimg.com/originals/74/6e/82/746e82e2e3db23fb056983fbda44a2ae.jpg",
    "https://i.pinimg.com/originals/61/f1/77/61f177bfe460713326ca3c0774603232.jpg",
    "https://i.pinimg.com/originals/39/48/42/39484206ddc8b6f3a63b055050992bd8.jpg",
    "https://i.pinimg.com/originals/89/04/6f/89046f21c26ff67702462333ef9c8f4f.jpg",
    "https://i.pinimg.com/originals/24/93/eb/2493eb80afd0125545be09b2ca5c78a6.jpg",
    "https://i.pinimg.com/originals/f7/92/a9/f792a9e0c74f2adba666202e612aa044.jpg",
    "https://i.pinimg.com/originals/8d/aa/21/8daa21455a89d721b369e8e84ce8d932.png",
    "https://i.pinimg.com/originals/72/c5/fb/72c5fbac1ce48e3d582557ce02c904fa.jpg",
    "https://i.pinimg.com/originals/90/b7/88/90b788ce28453aabcdebbfaa0bee4b59.jpg",
    "https://i.pinimg.com/originals/40/c7/31/40c731ce4a1719619658e22f91c37e01.jpg",
    "https://i.pinimg.com/originals/c4/aa/dd/c4aadd975669945ef3abab99109533d2.jpg",
    "https://i.pinimg.com/originals/c1/83/46/c18346c61c720b9d9b979791076dafd8.jpg",
    "https://i.pinimg.com/originals/a1/00/0d/a1000d3248ee4f09308298a89ccf9a58.jpg",
    "https://i.pinimg.com/originals/ab/a0/5b/aba05bdb0fd0c2047cc35a12cbc187db.jpg",
    "https://i.pinimg.com/736x/3b/45/8e/3b458ebb0169b352c3236723aee111d7.jpg",
    "https://i.pinimg.com/originals/48/19/63/4819639b23a325eed2915b73e237c73c.jpg",
    "https://i.pinimg.com/originals/be/1a/51/be1a51d8b020d9dde1bd6809ef25c75d.jpg",
    "https://i.pinimg.com/736x/28/e9/a9/28e9a9bd39c8a2604a25cd8a0e216ae6.jpg",
    "https://i.pinimg.com/originals/d0/95/4a/d0954a044b56a19a3901803754583402.jpg",
    "https://i.pinimg.com/originals/f4/f8/d9/f4f8d9d29a3b954b862ba8185c545d81.jpg",
    "https://i.pinimg.com/originals/e4/09/82/e40982b13d1f601ec283218af1cf4e12.jpg",
    "https://i.pinimg.com/originals/48/3b/d8/483bd82cbb9dc376927f322df6d9148a.jpg",
    "https://i.pinimg.com/originals/25/55/c3/2555c31f9cd1850781cd9005364e4539.jpg",
    "https://i.pinimg.com/originals/f3/c8/36/f3c8369e872851c9694438cab21175e0.jpg",
    "https://i.pinimg.com/originals/4a/e5/f1/4ae5f1eaf1a24b2107e43dd9e9314e32.jpg",
    "https://i.pinimg.com/originals/11/68/76/116876e0b562211890d9df2b5d148137.jpg",
    "https://i.pinimg.com/originals/23/4c/6d/234c6dddd80abc19d03a0a172762ecd5.jpg",
    "https://i.pinimg.com/originals/af/d9/3d/afd93df49183a83128b76ecde1f731c9.jpg",
    "https://i.pinimg.com/originals/ed/af/50/edaf50d564da101ca120df3b4683c05e.png",
    "https://i.pinimg.com/originals/77/3b/81/773b818f0f3fd9ec861a0540f3b2dea8.jpg",
    "https://i.pinimg.com/originals/e4/35/35/e435350fbe98e83441c0cf002d977f46.jpg",
    "https://i.pinimg.com/originals/75/4c/02/754c02fc07d9d3bc6bec3cfd8c85101d.jpg",
    "https://i.pinimg.com/originals/b2/de/13/b2de13e62ac900333703569ac57e8d2c.jpg",
    "https://i.pinimg.com/originals/80/dc/de/80dcdea3bbb68097bf483c5c458f1291.jpg",
    "https://i.pinimg.com/originals/98/1d/a8/981da847f16bbb848ea0672b9d1e2d6b.jpg",
    "https://i.pinimg.com/originals/54/2d/10/542d10b23031df172919adfc8665f501.jpg",
    "https://i.pinimg.com/originals/1c/bf/af/1cbfaf2d46bd2bddce7199a5acfb696c.jpg",
    "https://i.pinimg.com/originals/a0/93/a6/a093a630bd8a020c9d0602543389b5cc.jpg",
    "https://i.pinimg.com/originals/2e/bf/33/2ebf33d5e3ac9a8d9466cf28217d0773.jpg",
    "https://i.pinimg.com/originals/7c/43/de/7c43de0e1c3ec9cf3b194f73df101c79.jpg",
    "https://i.pinimg.com/originals/7e/c6/37/7ec637afa9e9c3c450ee9dd49db2aa4f.jpg",
    "https://i.pinimg.com/originals/ab/42/53/ab425337c44fc2be3cf7709ba29e49f9.jpg",
    "https://i.pinimg.com/originals/e6/a8/30/e6a830b72051520bd270e6125abfeca6.jpg",
    "https://i.pinimg.com/originals/7d/c5/63/7dc56380074f212a9af6833a1040134c.jpg",
    "https://i.pinimg.com/originals/45/c9/eb/45c9eb371a21d1b8574e68058343267c.jpg",
    "https://i.pinimg.com/originals/30/31/76/3031766f7bb08e71edf38a3f596db52a.jpg",
    "https://i.pinimg.com/originals/6a/c9/b7/6ac9b738bb24a0236143d78951e282a7.jpg",
    "https://i.pinimg.com/originals/dc/31/4b/dc314b2d82265d8694fe3f5668938b2e.jpg",
];

// ─── Post image pool (reuse from existing seed + extras) ─────────────────────
const POST_IMAGE_POOL: string[] = [
    "https://i.pinimg.com/originals/ae/19/03/ae19036a6f218c4ee806f9484e8f8bc7.jpg",
    "https://i.pinimg.com/originals/1c/6e/ad/1c6ead48da71e94d15b2e7fc720772bb.jpg",
    "https://i.pinimg.com/originals/f2/97/5b/f2975b617cbbe8aa1ff1fa8260dfa08c.jpg",
    "https://i.pinimg.com/originals/d1/e3/f1/d1e3f1b29aa7d2378feb6cb5f35a612a.jpg",
    "https://i.pinimg.com/originals/2f/a4/21/2fa42164b6645ae188f65b7b2c860a58.jpg",
    "https://i.pinimg.com/originals/cc/2e/80/cc2e80aaea0744b78a2d1b5f540df4de.jpg",
    "https://i.pinimg.com/originals/d2/bc/5f/d2bc5f6cda8307394ec973ecbe3abd7f.jpg",
    "https://i.pinimg.com/originals/43/b3/09/43b309faea1d5c10a314416ce781df85.jpg",
    "https://i.pinimg.com/originals/d0/0e/48/d00e48167fe543568e48fb8de0ab0f80.jpg",
    "https://i.pinimg.com/originals/37/23/b4/3723b4b86d094380006c943e97a4e7b7.jpg",
    "https://i.pinimg.com/originals/7d/2e/3b/7d2e3bbb19e19272999c87e0e27c5a8f.jpg",
    "https://i.pinimg.com/originals/bc/37/d1/bc37d15cea46f2fc4779467eacd57056.jpg",
    "https://i.pinimg.com/originals/b7/9d/17/b79d171d8c87987eb55eb23bad7a55e8.jpg",
    "https://i.pinimg.com/originals/e8/28/c1/e828c1db9eefe800f0b1574a5be37a1c.jpg",
    "https://i.pinimg.com/originals/55/6e/14/556e14eb303ea2e511026a0a07a39352.jpg",
    "https://i.pinimg.com/originals/a7/16/25/a71625dd5e77b47870877105f52caa8a.jpg",
    "https://i.pinimg.com/originals/c4/86/e4/c486e4134e8f34fa1be2697be9ac370d.jpg",
    "https://i.pinimg.com/originals/0e/83/20/0e83209912fcf0b0ddc39abfeb30b748.jpg",
    "https://i.pinimg.com/originals/f5/6b/c1/f56bc117f5229c0bc48aa2aa127cb261.jpg",
    "https://i.pinimg.com/originals/26/1a/ea/261aeae9a0954118705912f3edc1fa2a.jpg",
    "https://i.pinimg.com/originals/57/2a/00/572a003324ff394f2759a66bcd9ca8be.jpg",
    "https://i.pinimg.com/originals/27/95/16/27951626cf0d26d8968570bb4a4c0e4d.jpg",
    "https://i.pinimg.com/originals/83/ea/09/83ea093666a58ce5af07e5091a792c49.jpg",
    "https://i.pinimg.com/originals/4c/d3/98/4cd398d4bb2c495f27be4752bf14c19f.jpg",
    "https://i.pinimg.com/originals/9f/d8/54/9fd8542fa6e5adb6e44e028a0889918c.jpg",
    "https://i.pinimg.com/originals/55/18/65/5518655a26f0835eae4b02717aec8827.jpg",
    "https://i.pinimg.com/originals/d4/3c/0c/d43c0c76ca8daecfd75713f1ee16c116.jpg",
    "https://i.pinimg.com/originals/1f/3d/8f/1f3d8fe94aeb47d470c4e8d7356876c6.jpg",
];

// ─── Vietnamese name helpers ──────────────────────────────────────────────────
const HO_LIST = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"];
const TEN_NU = ["Anh", "Chi", "Giang", "Hà", "Hằng", "Hoa", "Hương", "Lan", "Linh", "Mai", "Ngân", "Nhi", "Phương", "Tâm", "Thảo", "Thu", "Trang", "Trinh", "Uyên", "Vân", "Ánh", "Châu", "Hiền", "Ngọc", "Quỳnh", "Thanh", "Vy", "Yến"];
const TEN_DEM_NU = ["Thị", "Ngọc", "Thu", "Thanh", "Kim", "Bích", "Lan", "Phương", "Mỹ", "Hà", "Bảo", "Diệu", "Hồng", "Minh", "Như"];
const BIO_TEMPLATES: Array<(n: string) => string> = [
    (n) => `${n} | Sống chậm, yêu đời 🌸`,
    (_) => `Coder ban ngày ☀️ | Dreamer ban đêm 🌙`,
    (n) => `${n} đây! Yêu cà phê, sách và mèo 📚☕🐱`,
    (_) => `UI/UX Designer | Figma addict 🎯 | HCM City`,
    (n) => `${n} | Content Creator 📱 | du lịch & ẩm thực`,
    (_) => `Freelancer. Đang làm việc từ Đà Lạt 🌿`,
    (n) => `${n} | Sinh viên IT | Mê AI & Machine Learning 🤖`,
    (_) => `Photographer 📸 | Sài Gòn → Hà Nội → Đà Nẵng`,
];

// ─── Report reason templates ──────────────────────────────────────────────────
interface ReportScenario {
    reason: string;
    adminNote: string;
    assistantNote: string;
    confidence: number;
    isDisinformation: boolean;
    isHidden: boolean;
    isDisinformationPost: boolean;
    status: ReportStatus;
    label: PostScoreLabel;
    hpDelta: number;
    expDelta: number;
    isToxic: boolean;
    isSpam: boolean;
}

const REPORT_SCENARIOS: ReportScenario[] = [
    {
        reason: "Bài viết chứa ngôn từ thù hận, xúc phạm nhóm dân tộc thiểu số một cách trực tiếp",
        adminNote: "Xác nhận vi phạm. Đã ẩn bài và cảnh cáo user lần 1.",
        assistantNote: "Phát hiện ngôn ngữ kích động thù địch với độ tin cậy cao. Khuyến nghị xử lý ngay.",
        confidence: 0.94,
        isDisinformation: false, isHidden: true, isDisinformationPost: false,
        status: ReportStatus.RESOLVED, label: PostScoreLabel.TOXIC,
        hpDelta: -3, expDelta: 0, isToxic: true, isSpam: false,
    },
    {
        reason: "Thông tin sai lệch về vaccine COVID gây hoang mang cộng đồng",
        adminNote: "Bài viết chia sẻ link không có nguồn gốc tin cậy. Đã dán nhãn misinformation.",
        assistantNote: "Nội dung mâu thuẫn với thông tin y tế chính thống. Độ tin cậy sai lệch: 0.89.",
        confidence: 0.89,
        isDisinformation: true, isHidden: true, isDisinformationPost: true,
        status: ReportStatus.RESOLVED, label: PostScoreLabel.TOXIC,
        hpDelta: -3, expDelta: 0, isToxic: false, isSpam: false,
    },
    {
        reason: "Spam quảng cáo sản phẩm giảm cân, đăng lặp lại nhiều lần",
        adminNote: "Tài khoản có dấu hiệu spam thương mại. Đang theo dõi thêm.",
        assistantNote: "Phát hiện pattern spam: nội dung trùng lặp >80% với 6 bài khác trong 24h.",
        confidence: 0.97,
        isDisinformation: false, isHidden: true, isDisinformationPost: false,
        status: ReportStatus.RESOLVED, label: PostScoreLabel.NOISE,
        hpDelta: -1, expDelta: 0, isToxic: false, isSpam: true,
    },
    {
        reason: "Bài viết đăng thông tin cá nhân của người khác mà không được đồng ý",
        adminNote: "Vi phạm chính sách bảo mật thông tin. Xóa bài và cảnh cáo.",
        assistantNote: "Phát hiện số điện thoại và địa chỉ cá nhân trong nội dung bài viết.",
        confidence: 0.91,
        isDisinformation: false, isHidden: true, isDisinformationPost: false,
        status: ReportStatus.RESOLVED, label: PostScoreLabel.TOXIC,
        hpDelta: -3, expDelta: 0, isToxic: true, isSpam: false,
    },
    {
        reason: "Nội dung có dấu hiệu lừa đảo tài chính, kêu gọi đầu tư với lợi nhuận phi thực tế",
        adminNote: "Đang điều tra thêm. Tạm ẩn bài trong khi xem xét.",
        assistantNote: "Nội dung khớp với pattern lừa đảo đầu tư đã biết. Confidence: 0.86.",
        confidence: 0.86,
        isDisinformation: true, isHidden: true, isDisinformationPost: false,
        status: ReportStatus.PENDING, label: PostScoreLabel.NOISE,
        hpDelta: -1, expDelta: 0, isToxic: false, isSpam: false,
    },
    {
        reason: "Bài viết sử dụng hình ảnh người khác mà không xin phép, vi phạm bản quyền",
        adminNote: "Chủ sở hữu hình ảnh đã xác nhận không cấp phép sử dụng.",
        assistantNote: "Hình ảnh có metadata không khớp với profile người đăng. Khả năng lấy ảnh không phép.",
        confidence: 0.78,
        isDisinformation: false, isHidden: false, isDisinformationPost: false,
        status: ReportStatus.PENDING, label: PostScoreLabel.NEUTRAL,
        hpDelta: 0, expDelta: 0, isToxic: false, isSpam: false,
    },
    {
        reason: "Kích động bạo lực chính trị, kêu gọi biểu tình trái phép",
        adminNote: "Báo cáo đến cơ quan chức năng. Tài khoản bị khóa tạm thời.",
        assistantNote: "Phát hiện ngôn ngữ kích động bạo lực nghiêm trọng. Ưu tiên xử lý ngay lập tức.",
        confidence: 0.95,
        isDisinformation: false, isHidden: true, isDisinformationPost: false,
        status: ReportStatus.RESOLVED, label: PostScoreLabel.TOXIC,
        hpDelta: -3, expDelta: 0, isToxic: true, isSpam: false,
    },
    {
        reason: "Quảng cáo dịch vụ bán hàng giả, hàng nhái thương hiệu nổi tiếng",
        adminNote: "Link sản phẩm dẫn đến website không rõ nguồn gốc. Đã xóa.",
        assistantNote: "URL trong bài viết thuộc danh sách blacklist website lừa đảo đã biết.",
        confidence: 0.88,
        isDisinformation: false, isHidden: true, isDisinformationPost: false,
        status: ReportStatus.RESOLVED, label: PostScoreLabel.NOISE,
        hpDelta: -1, expDelta: 0, isToxic: false, isSpam: true,
    },
    {
        reason: "Thông tin sai về tình hình lũ lụt, tạo hoảng loạn không cần thiết",
        adminNote: "Đã xác minh với nguồn tin chính thức. Thông tin không chính xác.",
        assistantNote: "Nội dung mâu thuẫn với báo cáo chính thức từ cơ quan khí tượng thủy văn.",
        confidence: 0.82,
        isDisinformation: true, isHidden: true, isDisinformationPost: true,
        status: ReportStatus.RESOLVED, label: PostScoreLabel.NOISE,
        hpDelta: -1, expDelta: 0, isToxic: false, isSpam: false,
    },
    {
        reason: "Nội dung mang tính phân biệt giới tính, hạ thấp phụ nữ",
        adminNote: "Vi phạm tiêu chuẩn cộng đồng. Cảnh cáo lần 2.",
        assistantNote: "Phát hiện ngôn ngữ misogynistic. Độ tin cậy: 0.83.",
        confidence: 0.83,
        isDisinformation: false, isHidden: false, isDisinformationPost: false,
        status: ReportStatus.PENDING, label: PostScoreLabel.TOXIC,
        hpDelta: -3, expDelta: 0, isToxic: true, isSpam: false,
    },
    // --- Less severe, pending/dismissed ---
    {
        reason: "Bài viết có vẻ không thực tế, có thể là nội dung AI tạo ra toàn bộ",
        adminNote: null as any,
        assistantNote: "Phát hiện đặc điểm của nội dung do AI sinh ra. Confidence: 0.61. Cần review thêm.",
        confidence: 0.61,
        isDisinformation: false, isHidden: false, isDisinformationPost: false,
        status: ReportStatus.DISMISSED, label: PostScoreLabel.NEUTRAL,
        hpDelta: 0, expDelta: 0, isToxic: false, isSpam: false,
    },
    {
        reason: "Tôi không thích nội dung này, không liên quan đến tôi",
        adminNote: "Không vi phạm tiêu chuẩn cộng đồng. Bác bỏ báo cáo.",
        assistantNote: "Không phát hiện vi phạm rõ ràng. Khả năng báo cáo không có căn cứ.",
        confidence: 0.12,
        isDisinformation: false, isHidden: false, isDisinformationPost: false,
        status: ReportStatus.DISMISSED, label: PostScoreLabel.SOLID,
        hpDelta: 0, expDelta: 2, isToxic: false, isSpam: false,
    },
    {
        reason: "Bài đăng ảnh người thật mà không hỏi ý kiến, vi phạm quyền riêng tư",
        adminNote: null as any,
        assistantNote: "Đang xem xét. Cần xác minh thêm từ các bên liên quan.",
        confidence: 0.55,
        isDisinformation: false, isHidden: false, isDisinformationPost: false,
        status: ReportStatus.PENDING, label: PostScoreLabel.NEUTRAL,
        hpDelta: 0, expDelta: 0, isToxic: false, isSpam: false,
    },
    {
        reason: "Phát tán link độc hại, có thể là phishing để đánh cắp tài khoản ngân hàng",
        adminNote: "Xác nhận link phishing. Xóa ngay và ban tài khoản 30 ngày.",
        assistantNote: "URL khớp 100% với database phishing đã biết. Hành động khẩn cấp.",
        confidence: 0.99,
        isDisinformation: false, isHidden: true, isDisinformationPost: false,
        status: ReportStatus.RESOLVED, label: PostScoreLabel.TOXIC,
        hpDelta: -3, expDelta: 0, isToxic: true, isSpam: false,
    },
    {
        reason: "Bài viết chỉ trích cá nhân, bôi nhọ danh dự người khác không có bằng chứng",
        adminNote: "Đang xem xét. Đã yêu cầu người báo cáo cung cấp thêm bằng chứng.",
        assistantNote: "Nội dung có tính chất tấn công cá nhân. Confidence moderate: 0.67.",
        confidence: 0.67,
        isDisinformation: false, isHidden: false, isDisinformationPost: false,
        status: ReportStatus.PENDING, label: PostScoreLabel.NOISE,
        hpDelta: -1, expDelta: 0, isToxic: false, isSpam: false,
    },
];

// ─── Topic definitions (có ý nghĩa, count > 50) ──────────────────────────────
interface TopicDef {
    name: string;
    count: number;
}
const TOPIC_DEFINITIONS: TopicDef[] = [
    { name: "ẩm thực", count: 312 },
    { name: "cà phê", count: 287 },
    { name: "du lịch", count: 265 },
    { name: "skincare", count: 243 },
    { name: "thời trang", count: 198 },
    { name: "lập trình", count: 187 },
    { name: "sức khỏe", count: 176 },
    { name: "âm nhạc", count: 165 },
    { name: "phim ảnh", count: 154 },
    { name: "chạy bộ", count: 143 },
    { name: "gym", count: 138 },
    { name: "startup", count: 127 },
    { name: "công nghệ", count: 119 },
    { name: "đọc sách", count: 108 },
    { name: "nấu ăn", count: 103 },
    { name: "thú cưng", count: 97 },
    { name: "mèo", count: 94 },
    { name: "chó", count: 88 },
    { name: "nhiếp ảnh", count: 83 },
    { name: "thiết kế", count: 78 },
    { name: "học tiếng anh", count: 74 },
    { name: "làm đẹp", count: 71 },
    { name: "yoga", count: 68 },
    { name: "thiền định", count: 64 },
    { name: "meme", count: 62 },
    { name: "game", count: 59 },
    { name: "anime", count: 57 },
    { name: "kpop", count: 55 },
    { name: "tài chính cá nhân", count: 53 },
    { name: "sống xanh", count: 51 },
    // topics also attached to reported posts
    { name: "sức khoẻ tâm thần", count: 89 },
    { name: "tình yêu", count: 134 },
    { name: "gia đình", count: 76 },
    { name: "học tập", count: 92 },
    { name: "việc làm", count: 85 },
    { name: "nhà ở", count: 63 },
    { name: "xe cộ", count: 58 },
    { name: "thể thao", count: 147 },
    { name: "bóng đá", count: 121 },
    { name: "kinh doanh", count: 96 },
];

// Post contents for reported posts (realistic but reportable-ish)
const REPORTED_POST_CONTENTS: string[] = [
    "Uống nước muối mỗi sáng chữa được ung thư, đây là bí quyết dân gian bị giấu hàng chục năm. Chia sẻ trước khi bị xóa!",
    "Tôi đã đầu tư 10 triệu và nhận về 50 triệu sau 2 tuần. Hệ thống này không ai biết. Inbox tôi ngay!",
    "Người [dân tộc X] lười biếng và không đáng được sống trong xã hội văn minh. Đây là sự thật không ai dám nói.",
    "Đây là số điện thoại và địa chỉ của thằng lừa đảo: 09xxx, số nhà xxx đường yyy. Mọi người lên đây cho nó một bài học.",
    "COVID chỉ là chiêu trò của các công ty dược phẩm. Vaccine gắn chip 5G để theo dõi. Đừng tiêm!",
    "Lũ lụt ở miền Trung đã làm 500 người chết hôm nay!!! Chính phủ đang che giấu. SHARE NGAY!!!",
    "Con gái không cần học cao, cứ ở nhà đẻ con nuôi chồng là đủ rồi. Đây mới là thiên chức phụ nữ.",
    "Click vào link này để nhận 500k từ ngân hàng Nhà Nước: bit.ly/xxx. Chương trình kết thúc hôm nay!",
    "Tôi biết [tên người cụ thể] đã làm gì hồi đó. Số điện thoại của hắn: 03xxx. Hãy gọi cho hắn nói chuyện đi.",
    "Biểu tình tối nay lúc 8pm tại quảng trường. Mang theo gậy và đá. Chia sẻ cho nhóm!!!",
    "Bán hàng chính hãng Gucci, LV giá 500k. Đặt hàng inbox, ship toàn quốc. 100% authentic.",
    "AI đã viết bài luận cho mình và thầy cho 9 điểm. Dịch vụ làm thuê bài tập mọi môn, giá rẻ, inbox ngay!",
    "Hình ảnh [người nổi tiếng] trong tình trạng không phù hợp. Không ai biết sự thật này cả...",
    "Thuốc giảm cân thần kỳ giảm 10kg/tháng mà không cần ăn kiêng hay tập thể dục. DM để order.",
    "Mình đã thoát khỏi trầm cảm nhờ uống nước lá cây X, không cần gặp bác sĩ. Thuốc tây chỉ làm bệnh nặng hơn.",
];

// ─── Daily Quest definitions ──────────────────────────────────────────────────
interface QuestDef {
    description: string;
    karmaReward: number;
    requirement: number;
    action: ActionType;
}
const QUEST_DEFINITIONS: QuestDef[] = [
    { description: "Đăng 1 bài viết hôm nay để nhận karma ✍️", karmaReward: 1, requirement: 1, action: ActionType.POST_CREATED },
    { description: "Đăng 3 bài viết trong ngày — thử thách creator 🔥", karmaReward: 2, requirement: 3, action: ActionType.POST_CREATED },
    { description: "Thả tim 5 bài viết của người khác 💛", karmaReward: 1, requirement: 5, action: ActionType.LIKE_CREATED },
    { description: "Thả tim 10 bài viết — lan toả năng lượng tích cực ❤️", karmaReward: 2, requirement: 10, action: ActionType.LIKE_CREATED },
    { description: "Follow 1 người dùng mới hôm nay 👣", karmaReward: 1, requirement: 1, action: ActionType.FOLLOW_FOLLOWING_CREATED },
    { description: "Follow 3 người dùng mới — mở rộng mạng lưới 🌐", karmaReward: 1, requirement: 3, action: ActionType.FOLLOW_FOLLOWING_CREATED },
    { description: "Quote lại 1 bài viết hay với nhận xét của bạn 💬", karmaReward: 1, requirement: 1, action: ActionType.QUOTE_CREATED },
    { description: "Tham gia 1 nhóm mới hôm nay ⭕", karmaReward: 1, requirement: 1, action: ActionType.JOIN_CIRCLE },
    { description: "Mời 1 người bạn vào nhóm 📩", karmaReward: 1, requirement: 1, action: ActionType.INVITE_SENT },
    { description: "Mời 3 người bạn vào nhóm — người kết nối cộng đồng 🤝", karmaReward: 2, requirement: 3, action: ActionType.INVITE_SENT },
    { description: "Chia sẻ 1 bài viết lên feed của bạn 🔁", karmaReward: 1, requirement: 1, action: ActionType.SHARE_CREATED },
    { description: "Chia sẻ 5 bài viết — amplifier của ngày hôm nay 📢", karmaReward: 2, requirement: 5, action: ActionType.SHARE_CREATED },
    { description: "Tạo 1 bài viết đẹp với AI caption ✨", karmaReward: 1, requirement: 1, action: ActionType.GENERATE_CAPTION_MD },
    { description: "Tạo 1 ảnh bằng AI cho bài viết của bạn 🎨", karmaReward: 2, requirement: 1, action: ActionType.GENERATE_IMAGE },
    { description: "Được 1 người follow lại bạn hôm nay 🌟", karmaReward: 1, requirement: 1, action: ActionType.FLOW_FOLLOWER_CREATED },
    { description: "Lời mời tham gia nhóm của bạn được chấp nhận 🎉", karmaReward: 2, requirement: 1, action: ActionType.INVITE_ACCEPTED },
];

// ─── PART A: Seed 50 new users ────────────────────────────────────────────────
async function seedNewUsers(): Promise<{ id: string; username: string; name: string; avatar: string | null; bio: string | null }[]> {
    const hashedPassword = await bcrypt.hash("12345678", 10);
    const existing = await prisma.user.findMany({ select: { username: true, email: true } });
    const usedUsernames = new Set(existing.map(u => u.username));
    const usedEmails = new Set(existing.map(u => u.email));

    const userList: any[] = [];
    for (let i = 0; i < 50; i++) {
        const avatar = NEW_AVATAR_URLS[i % NEW_AVATAR_URLS.length];
        const ho = pick(HO_LIST);
        const tenDem = pick(TEN_DEM_NU);
        const ten = pick(TEN_NU);
        const fullName = `${ho} ${tenDem} ${ten}`;
        const base = slugify(fullName);

        let username = `${base}${String(300 + i).padStart(3, "0")}`;
        let attempt = 0;
        while (usedUsernames.has(username)) {
            attempt++;
            username = `${base}${String(300 + i).padStart(3, "0")}x${attempt}`;
        }
        usedUsernames.add(username);

        let email = `${username}@gmail.com`;
        while (usedEmails.has(email)) email = `${username}_${rand(100, 999)}@gmail.com`;
        usedEmails.add(email);

        userList.push({
            email, username,
            password: hashedPassword,
            name: fullName,
            bio: pick(BIO_TEMPLATES)(ten),
            avatar,
            status: UserStatus.ACTIVE,
            isPrivate: Math.random() < 0.05,
            followersCount: 0, followingCount: 0, postsCount: 0,
            verifiedAt: Math.random() < 0.35 ? new Date(Date.now() - Math.random() * 1.5e10) : null,
        });
    }

    await prisma.user.createMany({ data: userList, skipDuplicates: true });
    const users = await prisma.user.findMany({
        where: { email: { in: userList.map(u => u.email) } },
        select: { id: true, username: true, name: true, avatar: true, bio: true },
    });
    return users as any;
}

// ─── PART B: Seed 100 reported posts ─────────────────────────────────────────
async function seedReportedPosts(allUsers: { id: string; username: string; name: string; avatar: string | null; bio: string | null }[]): Promise<void> {
    // Need topics first
    const topicIds = await getOrCreateTopics();

    let imgIdx = 1000;
    let created = 0;

    for (let i = 0; i < 100; i++) {
        const author = pick(allUsers);
        const scenario = REPORT_SCENARIOS[i % REPORT_SCENARIOS.length];
        const content = REPORTED_POST_CONTENTS[i % REPORTED_POST_CONTENTS.length]
            + (i > 14 ? ` (biến thể ${Math.ceil(i / 15)})` : "");
        const createdAt = randomDate(60);
        const numImages = rand(1, 3);

        // Create post with all flags set
        const post = await prisma.post.create({
            data: {
                userId: author.id,
                content,
                type: PostType.POST,
                visibility: VisibilityPost.PUBLIC,
                replyPermission: ReplyPermission.EVERYONE,
                userSnapshot: {
                    id: author.id, username: author.username,
                    name: author.name, avatar: author.avatar, bio: author.bio,
                },
                likesCount: rand(0, 50),
                repliesCount: rand(0, 20),
                repostsCountAndQuoteCount: rand(0, 10),
                viewsCount: rand(100, 5000),
                isHidden: scenario.isHidden,
                isDisinformation: scenario.isDisinformationPost,
                createdAt, updatedAt: createdAt,
            },
            select: { id: true, publicId: true },
        });

        // Post media (1–3 images)
        const mediaItems = Array.from({ length: numImages }, (_, m) => ({
            postId: post.id,
            url: POST_IMAGE_POOL[imgIdx++ % POST_IMAGE_POOL.length],
            type: PostMediaType.IMAGE,
            width: pick([720, 1080]),
            height: pick([720, 1080, 1350]),
            key: `reported_${post.id}_${m}_${Date.now() + imgIdx}`,
            status: PostMediaStatus.UPLOADED,
        }));
        await prisma.postMedia.createMany({ data: mediaItems });

        // Assign topic to post
        const topicId = topicIds[i % topicIds.length];
        await prisma.topicsPost.create({
            data: { postId: post.id, topicId, isPublic: true },
        }).catch(() => { }); // ignore if duplicate

        // Post mention: tag 1–2 random users
        const mentionedUsers = shuffle(allUsers.filter(u => u.id !== author.id)).slice(0, rand(1, 2));
        await prisma.postMention.createMany({
            data: mentionedUsers.map(u => ({ postId: post.id, userId: u.id })),
            skipDuplicates: true,
        });

        // Create 1–3 reports from different users
        const reporters = shuffle(allUsers.filter(u => u.id !== author.id)).slice(0, rand(1, 3));
        for (const reporter of reporters) {
            await prisma.report.create({
                data: {
                    reporterId: reporter.id,
                    targetType: ReportTargetType.POST,
                    targetId: post.publicId,
                    reason: scenario.reason,
                    status: scenario.status,
                    assistantNote: scenario.assistantNote,
                    confidence: scenario.confidence,
                    isDisinformation: scenario.isDisinformation,
                    adminNote: scenario.adminNote ?? null,
                },
            });
        }

        // Find circle member for quality log (optional — skip if no circle member for this user)
        const circleMember = await prisma.circleMember.findFirst({
            where: { userId: author.id },
            select: { id: true, circleId: true },
        });

        if (circleMember) {
            await prisma.circlePostQualityLog.create({
                data: {
                    circleId: circleMember.circleId,
                    circleMemberId: circleMember.id,
                    postId: post.id,
                    score: scenario.isToxic ? rand(0, 2) : (scenario.isSpam ? rand(1, 3) : rand(3, 6)),
                    label: scenario.label,
                    hpDelta: scenario.hpDelta,
                    expDelta: scenario.expDelta,
                    reason: scenario.assistantNote,
                    confidence: scenario.confidence,
                    isToxic: scenario.isToxic,
                    isSpam: scenario.isSpam,
                },
            }).catch(() => { }); // skip if post already logged in that circle
        }

        created++;
        if (created % 10 === 0) process.stdout.write(`\r   → ${created}/100 reported posts`);
    }}

// ─── PART C: Seed follows (mỗi user follow ít nhất 5 người) ──────────────────
async function seedFollows(allUsers: { id: string }[]): Promise<void> {
    const existingFollows = await prisma.follow.findMany({
        select: { userId: true, followingId: true },
    });
    const followSet = new Set(existingFollows.map(f => `${f.userId}_${f.followingId}`));

    let total = 0;
    const batchData: any[] = [];

    for (const user of allUsers) {
        // Each user follows 5–15 random others
        const targets = shuffle(allUsers.filter(u => u.id !== user.id)).slice(0, rand(5, 15));
        for (const target of targets) {
            const key = `${user.id}_${target.id}`;
            if (!followSet.has(key)) {
                followSet.add(key);
                batchData.push({
                    userId: user.id,
                    followingId: target.id,
                    isFollowing: true,
                    status: FollowStatus.ACCEPTED,
                });
                total++;
            }
        }
    }

    // Insert in batches of 500
    for (let i = 0; i < batchData.length; i += 500) {
        await prisma.follow.createMany({ data: batchData.slice(i, i + 500), skipDuplicates: true });
        process.stdout.write(`\r   → ${Math.min(i + 500, batchData.length)}/${batchData.length} follows`);
    }    for (const user of allUsers) {
        const [followerCount, followingCount] = await Promise.all([
            prisma.follow.count({ where: { followingId: user.id, status: FollowStatus.ACCEPTED } }),
            prisma.follow.count({ where: { userId: user.id, status: FollowStatus.ACCEPTED } }),
        ]);
        await prisma.user.update({
            where: { id: user.id },
            data: { followersCount: followerCount, followingCount },
        });
    }}

// ─── PART D: Seed friend requests (mỗi user ít nhất 2 bạn) ───────────────────
async function seedFriends(allUsers: { id: string }[]): Promise<void> {
    const existing = await prisma.friendRequest.findMany({
        select: { senderId: true, receiverId: true },
    });
    const friendSet = new Set(existing.map(f => `${f.senderId}_${f.receiverId}`));

    const batchData: any[] = [];
    // Track how many ACCEPTED friends each user has
    const acceptedCount: Record<string, number> = {};
    allUsers.forEach(u => { acceptedCount[u.id] = 0; });

    // First pass: ensure everyone gets at least 2 accepted friends
    const shuffledUsers = shuffle(allUsers);
    for (const user of shuffledUsers) {
        if (acceptedCount[user.id] >= 2) continue;

        const candidates = shuffle(allUsers.filter(u =>
            u.id !== user.id && acceptedCount[u.id] < 5
        )).slice(0, rand(2, 4));

        for (const friend of candidates) {
            const key = `${user.id}_${friend.id}`;
            const rKey = `${friend.id}_${user.id}`;
            if (!friendSet.has(key) && !friendSet.has(rKey)) {
                friendSet.add(key);
                batchData.push({
                    senderId: user.id,
                    receiverId: friend.id,
                    status: FriendRequestStatus.ACCEPTED,
                });
                acceptedCount[user.id] = (acceptedCount[user.id] || 0) + 1;
                acceptedCount[friend.id] = (acceptedCount[friend.id] || 0) + 1;
            }
        }
    }

    // Second pass: add some PENDING requests for realism
    const someUsers = shuffle(allUsers).slice(0, Math.floor(allUsers.length * 0.3));
    for (const user of someUsers) {
        const candidate = pick(allUsers.filter(u => u.id !== user.id));
        const key = `${user.id}_${candidate.id}`;
        const rKey = `${candidate.id}_${user.id}`;
        if (!friendSet.has(key) && !friendSet.has(rKey)) {
            friendSet.add(key);
            batchData.push({
                senderId: user.id,
                receiverId: candidate.id,
                status: FriendRequestStatus.PENDING,
            });
        }
    }

    for (let i = 0; i < batchData.length; i += 500) {
        await prisma.friendRequest.createMany({ data: batchData.slice(i, i + 500), skipDuplicates: true });
        process.stdout.write(`\r   → ${Math.min(i + 500, batchData.length)}/${batchData.length} friend requests`);
    }}

// ─── PART E: Seed topics + attach to existing posts ──────────────────────────
async function getOrCreateTopics(): Promise<number[]> {
    const topicIds: number[] = [];
    for (const def of TOPIC_DEFINITIONS) {
        const topic = await prisma.topic.upsert({
            where: { name: def.name },
            update: { count: def.count },
            create: { name: def.name, count: def.count },
            select: { id: true },
        });
        topicIds.push(topic.id);
    }
    return topicIds;
}

async function seedTopics(): Promise<void> {
    const topicIds = await getOrCreateTopics();
    // Attach topics to existing posts that don't have one yet
    const postsWithoutTopic = await prisma.post.findMany({
        where: {
            isDeleted: false,
            type: PostType.POST,
            topicsPosts: { none: {} },
        },
        select: { id: true },
        take: 300,
    });

    let attached = 0;
    for (const post of postsWithoutTopic) {
        const topicId = topicIds[attached % topicIds.length];
        await prisma.topicsPost.create({
            data: { postId: post.id, topicId, isPublic: true },
        }).catch(() => { });
        attached++;
    }}

// ─── PART F: Seed Daily Quests (admin only) ───────────────────────────────────
async function seedDailyQuests(): Promise<void> {
    // Find admin user
    const adminRole = await prisma.role.findUnique({ where: { name: "ADMIN" }, select: { id: true } });
    if (!adminRole) {        return;
    }
    const adminUserRole = await prisma.userRole.findFirst({
        where: { roleId: adminRole.id },
        select: { userId: true },
    });
    if (!adminUserRole) {        return;
    }
    const adminId = adminUserRole.userId;

    let created = 0;
    for (const def of QUEST_DEFINITIONS) {
        const existing = await prisma.dailyQuest.findFirst({ where: { action: def.action, description: def.description } });
        if (existing) {            continue;
        }
        await prisma.dailyQuest.create({
            data: {
                description: def.description,
                karmaReward: def.karmaReward,
                requirement: def.requirement,
                action: def.action,
                isActive: true,
                createById: adminId,
            },
        });
        created++;    }}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
    // A. Seed 50 new users with Excel avatars
    const newUsers = await seedNewUsers();

    // Load ALL users for relationship seeding
    const allUsers = await prisma.user.findMany({
        where: { deletedAt: null, status: UserStatus.ACTIVE },
        select: { id: true, username: true, name: true, avatar: true, bio: true },
    });
    // E. Topics (needed by B)
    await seedTopics();

    // B. 100 reported posts
    await seedReportedPosts(allUsers as any);

    // C. Follows
    await seedFollows(allUsers);

    // D. Friend requests
    await seedFriends(allUsers);

    // F. Daily quests
    await seedDailyQuests();

    // ── Summary ──────────────────────────────────────────────────────────────
    const [
        totalUsers, totalPosts, totalReports,
        totalFollows, totalFriends,
        totalTopics, totalQuests,
    ] = await Promise.all([
        prisma.user.count({ where: { status: UserStatus.ACTIVE, deletedAt: null } }),
        prisma.post.count({ where: { type: PostType.POST, isDeleted: false } }),
        prisma.report.count(),
        prisma.follow.count(),
        prisma.friendRequest.count({ where: { status: FriendRequestStatus.ACCEPTED } }),
        prisma.topic.count(),
        prisma.dailyQuest.count({ where: { isActive: true } }),
    ]);}

main()
    .catch((e) => { console.error("❌ Supplement seed failed:", e); process.exit(1); })
    .finally(() => prisma.$disconnect());