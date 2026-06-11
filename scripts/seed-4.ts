import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import {
    PrismaClient,
    RoleMembership,
    UserStatus,
    Visibility,
} from "@prisma/client";
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
function rand(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomDate(daysAgo: number): Date {
    return new Date(Date.now() - Math.random() * daysAgo * 86_400_000);
}
function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface SeedUser {
    id: string;
    username: string;
    name: string;
    avatar: string | null;
    bio: string | null;
}

// ─── Level Config ─────────────────────────────────────────────────────────────
// Lv.1 Newborn  : 0 EXP   500 HP
// Lv.2 Growing  : 200 EXP 650 HP
// Lv.3 Thriving : 500 EXP 800 HP
// Lv.4 Veteran  : 1000 EXP 950 HP
// Lv.5 Legend   : 2000 EXP 1000 HP
const LEVEL_CONFIG: Record<number, { name: string; maxHp: number; minExp: number; maxExp: number }> = {
    1: { name: "Newborn", maxHp: 500, minExp: 0, maxExp: 199 },
    2: { name: "Growing", maxHp: 650, minExp: 200, maxExp: 499 },
    3: { name: "Thriving", maxHp: 800, minExp: 500, maxExp: 999 },
    4: { name: "Veteran", maxHp: 950, minExp: 1000, maxExp: 1999 },
    5: { name: "Legend", maxHp: 1000, minExp: 2000, maxExp: 5000 },
};

// ─── HP State ─────────────────────────────────────────────────────────────────
type HpState = "healthy" | "sick" | "dying" | "dead";

function calcCurrentHp(maxHp: number, state: HpState): number {
    switch (state) {
        case "healthy": return rand(Math.ceil(maxHp * 0.70), maxHp);
        case "sick": return rand(Math.ceil(maxHp * 0.50), Math.ceil(maxHp * 0.69));
        case "dying": return rand(Math.ceil(maxHp * 0.20), Math.ceil(maxHp * 0.49));
        case "dead": return 0;
    }
}

// ─── Circle Definitions ───────────────────────────────────────────────────────
interface CircleDef {
    name: string;
    description: string;
    visibility: Visibility;
    statusPeak: boolean;
    level: number;
    hpState: HpState;
}

const CIRCLES_DATA: CircleDef[] = [
    { name: "Hội Trader Việt 📉", description: "Cộng đồng đầu tư và giao dịch. Học từ lỗ.", visibility: Visibility.PUBLIC, statusPeak: false, level: 4, hpState: "dead" },
    { name: "Vpop Underground 🎤", description: "Nhạc indie Việt – underground – không mainstream.", visibility: Visibility.PRIVATE, statusPeak: false, level: 3, hpState: "dead" },
    { name: "Meme Cà Khịa 🔥", description: "Nơi sinh ra những meme thâm cay nhất mạng Việt.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "dead" },
    { name: "Hội Sách Ngoại Văn 📗", description: "Reading club sách tiếng Anh, Pháp, Nhật. Mỗi tháng 1 cuốn.", visibility: Visibility.PRIVATE, statusPeak: false, level: 2, hpState: "dead" },
    { name: "Saigon Night Runners 🌙", description: "Chạy bộ đêm khuya – 11pm đến 1am – Sài Gòn.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "dead" },
    { name: "Hội Mê Đồ Sneaker 👟", description: "Sneaker culture Việt Nam. Authenticate, trade, collect.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "dead" },
    { name: "Cộng Đồng Podcast VN 🎙️", description: "Làm podcast, nghe podcast, và tất cả về nội dung âm thanh.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "dead" },
    { name: "Hội Film Photography 📽️", description: "Nhiếp ảnh film – Analog – Darkroom. Chậm mà chắc.", visibility: Visibility.PRIVATE, statusPeak: false, level: 4, hpState: "dead" },
    { name: "Yoga Therapy VN 🌀", description: "Yoga trị liệu và phục hồi sức khỏe. Không cần kinh nghiệm.", visibility: Visibility.PRIVATE, statusPeak: false, level: 1, hpState: "dead" },
    { name: "Startup Graveyard 💀", description: "Kể chuyện startup thất bại để người khác không mắc lại.", visibility: Visibility.PUBLIC, statusPeak: false, level: 5, hpState: "dead" },
    { name: "Hội Bơi Lội Sáng Sớm 🏊", description: "Bơi 5am mỗi ngày. Nước lạnh nhưng tinh thần ấm.", visibility: Visibility.PUBLIC, statusPeak: false, level: 1, hpState: "dying" },
    { name: "Barista Club VN ☕", description: "Làm cà phê specialty tại nhà. Review máy, grinder, beans.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "dying" },
    { name: "Cộng Đồng Violinist VN 🎻", description: "Học violin từ người mới đến nâng cao. Chia sẻ sheet nhạc.", visibility: Visibility.PRIVATE, statusPeak: false, level: 2, hpState: "dying" },
    { name: "Hội Mê Đồ Handmade 🧵", description: "Tự làm quần áo, phụ kiện, nội thất. DIY hết mọi thứ.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "dying" },
    { name: "Digital Art Community VN 🖌️", description: "Illustration, concept art, character design. Chia sẻ tác phẩm.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "dying" },
    { name: "Hội Mê Bonsai & Kiểng 🎋", description: "Bonsai, cây kiểng, terrarium. Nghệ thuật cây xanh Việt Nam.", visibility: Visibility.PUBLIC, statusPeak: false, level: 1, hpState: "dying" },
    { name: "Cộng Đồng Jazz Việt 🎷", description: "Jazz, blues, soul Việt Nam. Từ tân thủ đến nghệ sĩ chuyên nghiệp.", visibility: Visibility.PRIVATE, statusPeak: false, level: 3, hpState: "dying" },
    { name: "Hội Tập Gym Buổi Sáng 💪", description: "6am wake up, gym lúc 7am. Kỷ luật mỗi ngày.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "dying" },
    { name: "Cộng Đồng Streamer Việt 🎮", description: "Hỗ trợ streamer mới, tips tăng viewer, setup streaming.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "sick" },
    { name: "Hội Review Game Indie 🕹️", description: "Game indie từ VN và thế giới. Honest review – no ads.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "sick" },
    { name: "Hội Nuôi Cá Cảnh 🐠", description: "Bể cá, thủy sinh, cá rồng. Kỹ thuật và kinh nghiệm nuôi.", visibility: Visibility.PUBLIC, statusPeak: false, level: 1, hpState: "sick" },
    { name: "Cộng Đồng Vận Động Viên Triathlon 🏅", description: "Bơi – Đạp xe – Chạy bộ. Training cho Triathlon VN.", visibility: Visibility.PRIVATE, statusPeak: false, level: 4, hpState: "sick" },
    { name: "Hội Mê Trà Sữa 🧋", description: "Review trà sữa, so sánh topping, tìm kiếm quán ngon mới.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "sick" },
    { name: "Cùng Học Lập Trình Web 💻", description: "HTML, CSS, JS, React. Học free – cùng nhau tiến bộ.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "sick" },
    { name: "Hội Mê Gốm Sứ & Đồ Thủ Công 🏺", description: "Làm gốm, sưu tập đồ thủ công. Chia sẻ kỹ thuật và tác phẩm.", visibility: Visibility.PRIVATE, statusPeak: false, level: 1, hpState: "sick" },
    { name: "Cộng Đồng Đầu Bếp Tự Học 🍽️", description: "Không học trường chef nhưng nấu ngon hơn nhà hàng.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "sick" },
    { name: "Hội Phim Kinh Dị Asian 👻", description: "Horror phim châu Á – Hàn, Nhật, Thái, Việt. Đủ thứ sợ.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "sick" },
    { name: "Cộng Đồng Chạy Bộ Cuối Tuần 🏃", description: "Chạy 5km đến marathon. Đăng ký giải cùng nhau.", visibility: Visibility.PUBLIC, statusPeak: true, level: 3, hpState: "sick" },
    { name: "Hội Yêu Thích Cocktail 🍹", description: "Pha cocktail tại nhà. Không cần bar chuyên nghiệp.", visibility: Visibility.PRIVATE, statusPeak: false, level: 2, hpState: "sick" },
    { name: "Cộng Đồng Đi Du Lịch Solo 🗺️", description: "Một mình vẫn vui. Tips, kinh nghiệm, kết bạn đồng hành.", visibility: Visibility.PUBLIC, statusPeak: true, level: 4, hpState: "sick" },
    { name: "Hội Học Guitar Acoustic 🎸", description: "Tự học guitar từ 0. Chord, finger style, tab nhạc.", visibility: Visibility.PUBLIC, statusPeak: false, level: 1, hpState: "sick" },
    { name: "Sài Gòn Foodies 🍜", description: "Hội những người yêu ẩm thực Sài Gòn. Review quán ăn, công thức nấu ăn.", visibility: Visibility.PUBLIC, statusPeak: true, level: 5, hpState: "healthy" },
    { name: "Du Lịch Việt Nam 🏔️", description: "Chia sẻ kinh nghiệm du lịch trong nước. Địa điểm đẹp, homestay giá tốt.", visibility: Visibility.PUBLIC, statusPeak: false, level: 4, hpState: "healthy" },
    { name: "OOTD Vietnam 👗", description: "Cộng đồng chia sẻ outfit, review đồ, và thời trang đường phố.", visibility: Visibility.PUBLIC, statusPeak: true, level: 4, hpState: "healthy" },
    { name: "Skincare & Beauty VN 💄", description: "Review skincare, chia sẻ routine, làm đẹp theo kiểu người Việt.", visibility: Visibility.PUBLIC, statusPeak: false, level: 5, hpState: "healthy" },
    { name: "Mèo Cún Việt Nam 🐱🐶", description: "Hội yêu thú cưng. Chia sẻ ảnh, kinh nghiệm chăm sóc.", visibility: Visibility.PUBLIC, statusPeak: true, level: 5, hpState: "healthy" },
    { name: "Nhạc Việt Xưa & Nay 🎵", description: "Từ nhạc vàng đến Vpop hiện đại. Chia sẻ bài hát hay.", visibility: Visibility.PRIVATE, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Phim & Series Chill 🎬", description: "Recommend phim, series, anime. Không spoil không được vào nhóm.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Gym & Fitness Girls 💪", description: "Cộng đồng nữ yêu thể thao. Chia sẻ lịch tập, chế độ ăn.", visibility: Visibility.PRIVATE, statusPeak: true, level: 4, hpState: "healthy" },
    { name: "Café Hopping HCM ☕", description: "Review cà phê, không gian làm việc tại HCM.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Hội Tự Nấu Ăn 🍳", description: "Chia sẻ công thức, tips nấu ăn ngon mà tiết kiệm.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Thiền & Wellness 🧘", description: "Meditation, yoga, sức khỏe tinh thần.", visibility: Visibility.PRIVATE, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Đọc Sách Cùng Nhau 📚", description: "Book club online. Mỗi tháng một cuốn, cùng đọc cùng thảo luận.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Digital Nomad VN 💻", description: "Cộng đồng làm việc remote ở Việt Nam.", visibility: Visibility.PUBLIC, statusPeak: true, level: 4, hpState: "healthy" },
    { name: "Vẽ & Sáng Tạo 🎨", description: "Triển lãm tác phẩm, chia sẻ kỹ thuật và cảm hứng sáng tác.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Mẹ Bỉm Sữa Thời Đại Mới 👶", description: "Hội các mẹ trẻ. Chia sẻ kinh nghiệm nuôi con, tâm sự.", visibility: Visibility.PRIVATE, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Khởi Nghiệp Việt 🚀", description: "Cộng đồng startup, freelancer và những người dám nghĩ dám làm.", visibility: Visibility.PUBLIC, statusPeak: true, level: 5, hpState: "healthy" },
    { name: "Nhiếp Ảnh Đường Phố 📸", description: "Street photography Việt Nam. Từ điện thoại đến máy film.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Hội Troll Sáng Tạo 😂", description: "Meme, video hài, và mọi thứ khiến bạn phun nước vào màn hình.", visibility: Visibility.PUBLIC, statusPeak: true, level: 3, hpState: "healthy" },
    { name: "K-Pop & K-Drama VN 🇰🇷", description: "Fandom Hàn Quốc Việt Nam. Tin tức idol, review drama.", visibility: Visibility.PUBLIC, statusPeak: false, level: 4, hpState: "healthy" },
    { name: "Tài Chính Cá Nhân 💰", description: "Học cách tiết kiệm, đầu tư và quản lý tài chính thông minh.", visibility: Visibility.PRIVATE, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Hà Nội Old Town Vibes 🏮", description: "Cộng đồng người Hà Nội. Ảnh đẹp, kỷ niệm, địa chỉ hay.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Zero Waste Lifestyle 🌿", description: "Sống xanh, giảm rác, yêu môi trường. Tips thực tế.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Nhảy Và Vũ Đạo 💃", description: "Từ ballroom đến street dance, K-pop cover đến traditional.", visibility: Visibility.PUBLIC, statusPeak: true, level: 3, hpState: "healthy" },
    { name: "Hội Cô Đơn Tự Nguyện 🫥", description: "Cho những ai thích một mình và ổn với điều đó.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Âm Nhạc Underground VN 🎸", description: "Indie, underground, alternative, jazz. Nghệ sĩ độc lập.", visibility: Visibility.PRIVATE, statusPeak: true, level: 4, hpState: "healthy" },
    { name: "Chill & Travel Backpack 🎒", description: "Phượt bụi, du lịch tự túc, budget travel.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Tarot & Spiritual VN ✨", description: "Tarot, astrology, crystals và những điều huyền bí.", visibility: Visibility.PRIVATE, statusPeak: false, level: 1, hpState: "healthy" },
    { name: "Gen Z Confess 🫣", description: "Tâm sự ẩn danh, drama đời thường.", visibility: Visibility.PUBLIC, statusPeak: true, level: 5, hpState: "healthy" },
    { name: "Nấu Chay Sáng Tạo 🥗", description: "Công thức ăn chay ngon và đẹp. Không cần ăn nhạt.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Đà Nẵng Connect 🌊", description: "Cộng đồng người Đà Nẵng. Sự kiện, địa điểm, review.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Hội Chạy Bộ Sài Gòn 🏃", description: "Running club Sài Gòn. 5am morning runs – cùng nhau khỏe.", visibility: Visibility.PUBLIC, statusPeak: true, level: 4, hpState: "healthy" },
    { name: "Yêu Thú Cưng HCM 🐾", description: "Hội thú cưng HCM. Chia sẻ ảnh, tìm bác sĩ tốt.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Cộng Đồng Gamer Việt 🎮", description: "FPS, MOBA, RPG – cùng nhau chơi và học hỏi.", visibility: Visibility.PUBLIC, statusPeak: true, level: 4, hpState: "healthy" },
    { name: "Lập Trình Việt Nam 💻", description: "Hỗ trợ học lập trình, chia sẻ resource, tìm việc tech.", visibility: Visibility.PUBLIC, statusPeak: false, level: 5, hpState: "healthy" },
    { name: "Marketing & Growth VN 📈", description: "Digital marketing, growth hacking, personal branding.", visibility: Visibility.PUBLIC, statusPeak: false, level: 4, hpState: "healthy" },
    { name: "Thời Trang Vintage VN 👒", description: "Thrift shop, vintage fashion, sustainable style.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Street Food Vietnam 🌮", description: "Khám phá ẩm thực đường phố Việt Nam từ Bắc vào Nam.", visibility: Visibility.PUBLIC, statusPeak: true, level: 5, hpState: "healthy" },
    { name: "Hội Những Người Thức Đêm 🌙", description: "Night owls club. Tám chuyện, làm việc, sáng tác lúc đêm.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Làm Vườn Tại Nhà 🌱", description: "Trồng rau, hoa, cây ăn quả trong nhà phố và chung cư.", visibility: Visibility.PUBLIC, statusPeak: false, level: 1, hpState: "healthy" },
    { name: "Phượt Xe Máy Xuyên Việt 🏍️", description: "Phượt xe máy xuyên Việt. Lộ trình, kinh nghiệm.", visibility: Visibility.PUBLIC, statusPeak: true, level: 4, hpState: "healthy" },
    { name: "Hội Mê Anime & Manga 🎌", description: "Fandom anime manga Việt Nam. Review, fanart, cosplay.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Cộng Đồng UX/UI Việt Nam 🎯", description: "UX/UI design community. Chia sẻ case study, roast portfolio.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Running Club Việt Nam 🏃‍♀️", description: "Cộng đồng chạy bộ cả nước. Kết nối runner mọi tỉnh thành.", visibility: Visibility.PUBLIC, statusPeak: true, level: 5, hpState: "healthy" },
    { name: "Hội Làm Bánh Tại Nhà 🍰", description: "Bánh ngọt, bánh mặn, bánh Việt Nam. Công thức và tips.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Hội Review Mỹ Phẩm Nội Địa 💅", description: "Review mỹ phẩm made in Vietnam. Thật – không quảng cáo.", visibility: Visibility.PUBLIC, statusPeak: true, level: 3, hpState: "healthy" },
    { name: "Học Tiếng Anh Cùng Nhau 🇬🇧", description: "Luyện tiếng Anh free. Speaking, writing, IELTS, TOEIC.", visibility: Visibility.PUBLIC, statusPeak: false, level: 4, hpState: "healthy" },
    { name: "Cộng Đồng Chạy Bộ Buổi Sáng 🌅", description: "5am run club. Kỷ luật, sức khỏe, cộng đồng.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Hội Đi Biển Cùng Nhau 🏖️", description: "Trip biển, lặn biển, surfing. Kết bạn đi cùng.", visibility: Visibility.PUBLIC, statusPeak: true, level: 2, hpState: "healthy" },
    { name: "Hội Yêu Thích Âm Nhạc Acoustic 🎵", description: "Guitar acoustic, ukulele, kalimba. Sống chậm hơn.", visibility: Visibility.PRIVATE, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Cùng Học Tiếng Hàn 🇰🇷", description: "Học tiếng Hàn từ con số 0. TOPIK, du học, Kdrama subs.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Hội Foodie Hà Nội 🍜", description: "Phở Hà Nội, bún chả, bánh mì chả cá. Review quán ngon HN.", visibility: Visibility.PUBLIC, statusPeak: true, level: 4, hpState: "healthy" },
    { name: "Cộng Đồng Nail Art Việt Nam 💅", description: "Nail nghệ thuật, tự làm tại nhà, học kỹ thuật nail.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Hội Mê Orchid & Cây Kiểng 🌸", description: "Lan, hoa lan, cây kiểng ngoại. Chăm cây đúng cách.", visibility: Visibility.PUBLIC, statusPeak: false, level: 1, hpState: "healthy" },
];

// ─── Seed Circles ─────────────────────────────────────────────────────────────
async function seedCircles(users: SeedUser[]): Promise<void> {
    console.log(`\n⭕ ===== PART 3: SEED ${CIRCLES_DATA.length} CIRCLES =====`);

    const statusIcon = (s: HpState) => {
        switch (s) {
            case "healthy": return "💚";
            case "sick": return "🟡";
            case "dying": return "🟠";
            case "dead": return "💀";
        }
    };

    for (const [i, def] of CIRCLES_DATA.entries()) {
        const owner = users[i % users.length];
        const cfg = LEVEL_CONFIG[def.level];
        const currentHp = calcCurrentHp(cfg.maxHp, def.hpState);
        const exp = rand(cfg.minExp, cfg.maxExp);

        // Create circle
        const circle = await prisma.circle.create({
            data: {
                name: def.name,
                description: def.description,
                visibility: def.visibility,
                statusPeak: def.statusPeak,
                createById: owner.id,
                createdAt: randomDate(120),
            },
            select: { id: true, publicId: true },
        });

        // Create CircleEnergy (correct level/exp/hp)
        await prisma.circleEnergy.create({
            data: {
                circleId: circle.id,
                level: def.level,
                exp,
                current: currentHp,
                max: cfg.maxHp,
                peak: cfg.maxHp,       // peak = theoretical max for that level
            },
        });

        // Creator as OWNER (không phải ADMIN — chỉ OWNER mới có full quyền)
        await prisma.circleMember.create({
            data: { circleId: circle.id, userId: owner.id, role: RoleMembership.OWNER },
        });

        // Pick 40–70 additional random members (never the owner)
        const memberPool = shuffle(users.filter(u => u.id !== owner.id));
        const memberCount = rand(40, Math.min(70, memberPool.length));
        const members = memberPool.slice(0, memberCount);

        // One extra admin among members
        await prisma.circleMember.createMany({
            data: members.map((u, mi) => ({
                circleId: circle.id,
                userId: u.id,
                role: mi === 0 ? RoleMembership.ADMIN : RoleMembership.MEMBER,
            })),
            skipDuplicates: true,
        });

        const totalMembers = memberCount + 1; // +1 owner
        const icon = def.statusPeak ? "🔥" : "  ";
        const vis = def.visibility === "PUBLIC" ? "🌐" : "🔒";
        console.log(
            `   ${String(i + 1).padStart(2)}. ${icon} ${vis} ${statusIcon(def.hpState)} [${def.hpState.toUpperCase().padEnd(7)}]` +
            ` Lv.${def.level} ${cfg.name.padEnd(8)} HP ${String(currentHp).padStart(4)}/${cfg.maxHp} EXP ${String(exp).padStart(4)}` +
            ` — ${totalMembers} members — ${def.name}`
        );
    }

    console.log(`\n   ✅ ${CIRCLES_DATA.length} circles seeded`);
    console.log(`   💀 Dead  : ${CIRCLES_DATA.filter(c => c.hpState === "dead").length}`);
    console.log(`   🟠 Dying : ${CIRCLES_DATA.filter(c => c.hpState === "dying").length}`);
    console.log(`   🟡 Sick  : ${CIRCLES_DATA.filter(c => c.hpState === "sick").length}`);
    console.log(`   💚 Healthy: ${CIRCLES_DATA.filter(c => c.hpState === "healthy").length}`);
}

// ─── Level-Up Ready Circles ───────────────────────────────────────────────────
// Các nhóm có EXP ĐÃ ĐẠT hoặc VƯỢT ngưỡng lên cấp tiếp theo.
// Người dùng chỉ cần bấm "Lên cấp" là được.
//
// Ngưỡng lên cấp:
//   Lv.1 → Lv.2 : cần 200 EXP   → exp = rand(200, 260)
//   Lv.2 → Lv.3 : cần 500 EXP   → exp = rand(500, 620)
//   Lv.3 → Lv.4 : cần 1000 EXP  → exp = rand(1000, 1250)
//   Lv.4 → Lv.5 : cần 2000 EXP  → exp = rand(2000, 2600)

interface LevelUpCircleDef {
    name: string;
    description: string;
    visibility: Visibility;
    statusPeak: boolean;
    currentLevel: number;   // level hiện tại (chưa lên)
    hpState: HpState;
}

// Thresholds để lên cấp (exp TỐI THIỂU cần đạt)
const LEVELUP_THRESHOLD: Record<number, { minExp: number; maxExp: number }> = {
    1: { minExp: 200, maxExp: 260 },  // sẵn sàng lên Lv.2
    2: { minExp: 500, maxExp: 620 },  // sẵn sàng lên Lv.3
    3: { minExp: 1000, maxExp: 1250 },  // sẵn sàng lên Lv.4
    4: { minExp: 2000, maxExp: 2600 },  // sẵn sàng lên Lv.5
};

// 40 circles: 10 mỗi cấp (Lv.1 → Lv.4)
const LEVELUP_CIRCLES: LevelUpCircleDef[] = [
    // ── Lv.1 → ready Lv.2 (10 nhóm) ─────────────────────────────────────────
    { name: "Hội Cắm Hoa Nghệ Thuật 🌷", description: "Ikebana, cắm hoa bàn tiệc, hoa cưới. Học kỹ thuật cắm hoa từ cơ bản.", visibility: Visibility.PUBLIC, statusPeak: false, currentLevel: 1, hpState: "healthy" },
    { name: "Cộng Đồng Nữ Chạy Bộ 🏃‍♀️", description: "Running club dành riêng cho nữ. An toàn, vui vẻ, không áp lực tốc độ.", visibility: Visibility.PUBLIC, statusPeak: false, currentLevel: 1, hpState: "healthy" },
    { name: "Hội Học Vẽ Từ Đầu 🖍️", description: "Dạy vẽ miễn phí từ con số 0. Không cần tài năng, chỉ cần kiên nhẫn.", visibility: Visibility.PUBLIC, statusPeak: false, currentLevel: 1, hpState: "healthy" },
    { name: "Câu Lạc Bộ Thiên Văn VN 🔭", description: "Quan sát sao, theo dõi hiện tượng thiên văn. Chia sẻ ảnh bầu trời đêm.", visibility: Visibility.PUBLIC, statusPeak: false, currentLevel: 1, hpState: "healthy" },
    { name: "Hội Thêu & Cross-Stitch 🧵", description: "Thêu tay, cross-stitch, embroidery. Mẫu thêu free và hỗ trợ người mới.", visibility: Visibility.PRIVATE, statusPeak: false, currentLevel: 1, hpState: "healthy" },
    { name: "Nhóm Học Tiếng Tây Ban Nha 🇪🇸", description: "Học tiếng Tây Ban Nha từ A1. Cùng luyện hội thoại mỗi tuần.", visibility: Visibility.PUBLIC, statusPeak: false, currentLevel: 1, hpState: "healthy" },
    { name: "Hội Mê Origami & Kirigami ✂️", description: "Gấp giấy nghệ thuật. Từ con hạc đến tác phẩm 3D phức tạp.", visibility: Visibility.PUBLIC, statusPeak: false, currentLevel: 1, hpState: "healthy" },
    { name: "Cộng Đồng Nội Trợ Thông Minh 🏠", description: "Tips dọn nhà, tổ chức không gian sống, Marie Kondo, tiết kiệm chi phí.", visibility: Visibility.PUBLIC, statusPeak: false, currentLevel: 1, hpState: "sick" },
    { name: "Hội Review Kem Dưỡng Da 🧴", description: "Honest review kem dưỡng da mọi phân khúc. Không nhận quảng cáo.", visibility: Visibility.PUBLIC, statusPeak: false, currentLevel: 1, hpState: "healthy" },
    { name: "Hội Tập Pilates Tại Nhà 🧘‍♀️", description: "Hướng dẫn pilates mat không cần dụng cụ. Thích hợp cho người mới bắt đầu.", visibility: Visibility.PRIVATE, statusPeak: false, currentLevel: 1, hpState: "healthy" },
    // ── Lv.2 → ready Lv.3 (10 nhóm) ─────────────────────────────────────────
    { name: "Hội Nuôi Rùa & Bò Sát 🐢", description: "Nuôi rùa, tắc kè, kỳ nhông. Kiến thức chăm sóc bò sát tại Việt Nam.", visibility: Visibility.PUBLIC, statusPeak: false, currentLevel: 2, hpState: "healthy" },
    { name: "Cộng Đồng Piano Self-Taught 🎹", description: "Tự học đàn piano không cần thầy. Sheet nhạc, video tutorial, hỗ trợ online.", visibility: Visibility.PUBLIC, statusPeak: false, currentLevel: 2, hpState: "healthy" },
    { name: "Hội Trekking & Leo Núi VN 🧗", description: "Trekking núi Việt Nam. Lịch leo, kinh nghiệm, gear review và kết đồng đội.", visibility: Visibility.PUBLIC, statusPeak: true, currentLevel: 2, hpState: "healthy" },
    { name: "Cộng Đồng Thiết Kế Nội Thất 🛋️", description: "Interior design, home decor, DIY nội thất. Từ ý tưởng đến thực hiện.", visibility: Visibility.PUBLIC, statusPeak: false, currentLevel: 2, hpState: "healthy" },
    { name: "Hội Làm Nến Thơm & Xà Phòng 🕯️", description: "Handmade candle, soap, bath bomb. Công thức và tips làm tại nhà.", visibility: Visibility.PUBLIC, statusPeak: false, currentLevel: 2, hpState: "healthy" },
    { name: "Cộng Đồng Nấu Ăn Hàn Quốc 🍱", description: "Công thức món Hàn tại nhà. Kimchi, tteokbokki, bibimbap đúng vị.", visibility: Visibility.PUBLIC, statusPeak: false, currentLevel: 2, hpState: "healthy" },
    { name: "Hội Sưu Tầm Vinyl Record 🎵", description: "Vinyl record collectors VN. Mua bán, đánh giá máy nghe, thưởng thức âm nhạc analog.", visibility: Visibility.PRIVATE, statusPeak: false, currentLevel: 2, hpState: "sick" },
    { name: "Hội Viết Lách & Sáng Tác ✍️", description: "Truyện ngắn, thơ, tản văn. Đọc và cho feedback lẫn nhau.", visibility: Visibility.PUBLIC, statusPeak: false, currentLevel: 2, hpState: "healthy" },
    { name: "Cộng Đồng Lập Trình Game VN 🕹️", description: "Unity, Unreal, Godot. Dev game indie Việt Nam. Từ beginner đến indie studio.", visibility: Visibility.PUBLIC, statusPeak: true, currentLevel: 2, hpState: "healthy" },
    { name: "Hội Mê Xe Đạp Địa Hình 🚵", description: "MTB, gravel, bikepacking. Cung đường đẹp, review xe, kỹ thuật đạp xe.", visibility: Visibility.PUBLIC, statusPeak: false, currentLevel: 2, hpState: "healthy" },
    // ── Lv.3 → ready Lv.4 (10 nhóm) ─────────────────────────────────────────
    { name: "Hội Barbell & Powerlifting 🏋️", description: "Squat, bench, deadlift. Kỹ thuật, lập trình tập luyện, thi đấu powerlifting VN.", visibility: Visibility.PUBLIC, statusPeak: true, currentLevel: 3, hpState: "healthy" },
    { name: "Cộng Đồng Photography Wedding 📷", description: "Nhiếp ảnh cưới Việt Nam. Workshop, portfolio review, kết nối photographer.", visibility: Visibility.PRIVATE, statusPeak: false, currentLevel: 3, hpState: "healthy" },
    { name: "Hội Mê Đồng Hồ & Accessories ⌚", description: "Sưu tầm đồng hồ, dây da, cufflink. Từ budget đến luxury.", visibility: Visibility.PUBLIC, statusPeak: false, currentLevel: 3, hpState: "healthy" },
    { name: "Cộng Đồng Data Science VN 📊", description: "Python, R, Machine Learning, AI. Cùng học và làm project thực tế.", visibility: Visibility.PUBLIC, statusPeak: true, currentLevel: 3, hpState: "healthy" },
    { name: "Hội Mê Đọc Tiểu Thuyết 📕", description: "Tiểu thuyết từ kinh điển đến đương đại. Thảo luận sâu, không spoil bừa.", visibility: Visibility.PUBLIC, statusPeak: false, currentLevel: 3, hpState: "healthy" },
    { name: "Cộng Đồng Spa & Massage VN 💆", description: "Kỹ thuật massage, aromatherapy, chăm sóc sức khỏe tại nhà.", visibility: Visibility.PRIVATE, statusPeak: false, currentLevel: 3, hpState: "sick" },
    { name: "Hội Làm Phim Ngắn Việt Nam 🎥", description: "Short film, documentary, content creator. Từ script đến post-production.", visibility: Visibility.PUBLIC, statusPeak: true, currentLevel: 3, hpState: "healthy" },
    { name: "Cộng Đồng Surfing Việt Nam 🏄", description: "Lướt sóng tại Việt Nam. Đà Nẵng, Mũi Né, Phú Quốc. Tips cho beginner.", visibility: Visibility.PUBLIC, statusPeak: false, currentLevel: 3, hpState: "healthy" },
    { name: "Hội Blockchain & Web3 VN ⛓️", description: "DeFi, NFT, smart contract. Học và thảo luận về công nghệ Web3 tại Việt Nam.", visibility: Visibility.PUBLIC, statusPeak: false, currentLevel: 3, hpState: "healthy" },
    { name: "Cộng Đồng Bonsai Nghệ Thuật 🌳", description: "Bonsai chuyên sâu. Tạo dáng, ghép cây, triển lãm. Dành cho người đam mê thật sự.", visibility: Visibility.PRIVATE, statusPeak: false, currentLevel: 3, hpState: "healthy" },
    // ── Lv.4 → ready Lv.5 (10 nhóm) ─────────────────────────────────────────
    { name: "Hội Đầu Tư Bất Động Sản 🏠", description: "Kinh nghiệm đầu tư BĐS Việt Nam. Phân tích thị trường, pháp lý, thực chiến.", visibility: Visibility.PRIVATE, statusPeak: true, currentLevel: 4, hpState: "healthy" },
    { name: "Cộng Đồng Nhiếp Ảnh Chuyên Nghiệp 🎞️", description: "Nhiếp ảnh commercial, fashion, landscape chuyên nghiệp. Portfolio & client tips.", visibility: Visibility.PUBLIC, statusPeak: true, currentLevel: 4, hpState: "healthy" },
    { name: "Hội Đầu Tư Chứng Khoán Thực Chiến 📈", description: "Phân tích kỹ thuật, cơ bản, quản lý danh mục. Chia sẻ thực tế không lý thuyết.", visibility: Visibility.PRIVATE, statusPeak: false, currentLevel: 4, hpState: "healthy" },
    { name: "Cộng Đồng Game Developer Senior 🎮", description: "Senior game dev Vietnam. Architecture, optimization, shipped game discussions.", visibility: Visibility.PRIVATE, statusPeak: true, currentLevel: 4, hpState: "healthy" },
    { name: "Hội Đầu Bếp Chuyên Nghiệp VN 🍽️", description: "Chef & culinary professional network. Technique sharing, job board, events.", visibility: Visibility.PRIVATE, statusPeak: false, currentLevel: 4, hpState: "healthy" },
    { name: "Cộng Đồng Brand Designer VN 🎨", description: "Branding, identity design, packaging. Portfolio critique & industry insights.", visibility: Visibility.PUBLIC, statusPeak: true, currentLevel: 4, hpState: "healthy" },
    { name: "Hội Sáng Lập Startup Series A 🚀", description: "Founder đã raise Series A trở lên. Chia sẻ kinh nghiệm thực chiến, không hoa mỹ.", visibility: Visibility.PRIVATE, statusPeak: true, currentLevel: 4, hpState: "healthy" },
    { name: "Cộng Đồng Bác Sĩ & Y Tế VN 🩺", description: "Medical professionals Vietnam. Case sharing, research, continuous education.", visibility: Visibility.PRIVATE, statusPeak: false, currentLevel: 4, hpState: "healthy" },
    { name: "Hội Nghệ Nhân Gốm Việt Nam 🏺", description: "Gốm nghệ thuật chuyên nghiệp. Kỹ thuật nung, men, triển lãm quốc tế.", visibility: Visibility.PRIVATE, statusPeak: false, currentLevel: 4, hpState: "sick" },
    { name: "Cộng Đồng AI Engineer VN 🤖", description: "LLM, diffusion model, MLOps. Senior AI/ML engineers trao đổi thực chiến.", visibility: Visibility.PRIVATE, statusPeak: true, currentLevel: 4, hpState: "healthy" },
];

async function seedCirclesLevelReady(users: SeedUser[]): Promise<void> {
    console.log(`\n⬆️  ===== PART 4: SEED ${LEVELUP_CIRCLES.length} LEVEL-UP READY CIRCLES =====`);
    console.log("   (EXP ĐÃ ĐẠT hoặc VƯỢT ngưỡng lên cấp — chỉ cần bấm Lên cấp)\n");

    // Offset user index so we don't repeat owners from seedCircles
    const USER_OFFSET = 84;

    for (const [i, def] of LEVELUP_CIRCLES.entries()) {
        const owner = users[(USER_OFFSET + i) % users.length];
        const cfg = LEVEL_CONFIG[def.currentLevel];
        const upCfg = LEVELUP_THRESHOLD[def.currentLevel];

        // EXP tại ngưỡng lên cấp (hoặc hơn một chút)
        const exp = rand(upCfg.minExp, upCfg.maxExp);

        // HP theo hpState và maxHp của cấp HIỆN TẠI
        const currentHp = calcCurrentHp(cfg.maxHp, def.hpState);

        const circle = await prisma.circle.create({
            data: {
                name: def.name,
                description: def.description,
                visibility: def.visibility,
                statusPeak: def.statusPeak,
                createById: owner.id,
                createdAt: randomDate(90),
            },
            select: { id: true },
        });

        // CircleEnergy: level = currentLevel, exp = tại ngưỡng lên
        await prisma.circleEnergy.create({
            data: {
                circleId: circle.id,
                level: def.currentLevel,
                exp,
                current: currentHp,
                max: cfg.maxHp,
                peak: cfg.maxHp,
            },
        });

        // Creator → OWNER
        await prisma.circleMember.create({
            data: { circleId: circle.id, userId: owner.id, role: RoleMembership.OWNER },
        });

        // 40–70 random members
        const memberPool = shuffle(users.filter(u => u.id !== owner.id));
        const memberCount = rand(40, Math.min(70, memberPool.length));
        const members = memberPool.slice(0, memberCount);

        await prisma.circleMember.createMany({
            data: members.map((u, mi) => ({
                circleId: circle.id,
                userId: u.id,
                role: mi === 0 ? RoleMembership.ADMIN : RoleMembership.MEMBER,
            })),
            skipDuplicates: true,
        });

        const nextLevel = def.currentLevel + 1;
        const nextName = LEVEL_CONFIG[nextLevel]?.name ?? "MAX";
        const sp = def.statusPeak ? "🔥" : "  ";
        const vis = def.visibility === "PUBLIC" ? "🌐" : "🔒";
        console.log(
            `   ${String(i + 1).padStart(2)}. ${sp} ${vis} Lv.${def.currentLevel}→${nextLevel} ` +
            `${cfg.name.padEnd(8)} → ${nextName.padEnd(8)} ` +
            `EXP ${String(exp).padStart(4)} HP ${String(currentHp).padStart(4)}/${cfg.maxHp} ` +
            `— ${memberCount + 1} members — ${def.name}`
        );
    }

    console.log(`\n   ✅ ${LEVELUP_CIRCLES.length} level-up ready circles seeded`);
    console.log(`   Lv.1→2 : ${LEVELUP_CIRCLES.filter(c => c.currentLevel === 1).length} nhóm`);
    console.log(`   Lv.2→3 : ${LEVELUP_CIRCLES.filter(c => c.currentLevel === 2).length} nhóm`);
    console.log(`   Lv.3→4 : ${LEVELUP_CIRCLES.filter(c => c.currentLevel === 3).length} nhóm`);
    console.log(`   Lv.4→5 : ${LEVELUP_CIRCLES.filter(c => c.currentLevel === 4).length} nhóm`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
// ─── Main ─────────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
    console.log("\n⭕ ===== SEED CIRCLES (users đã có sẵn) =====\n");

    // User đã có sẵn — chỉ findMany, không tạo mới
    const users = await prisma.user.findMany({
        where: { deletedAt: null, status: UserStatus.ACTIVE },
        select: { id: true, username: true, name: true, avatar: true, bio: true },
        orderBy: { createdAt: "asc" },
    });

    if (users.length === 0) throw new Error("Không tìm thấy user nào — hãy seed users trước!");
    console.log(`👤 Loaded ${users.length} users từ DB\n`);

    await seedCircles(users as SeedUser[]);
    await seedCirclesLevelReady(users as SeedUser[]);

    const [totalCircles, totalMembers, totalEnergy] = await Promise.all([
        prisma.circle.count(),
        prisma.circleMember.count(),
        prisma.circleEnergy.count(),
    ]);

    console.log(`
🎉 ===== XONG =====
   ⭕ Circles (total)   : ${totalCircles}
      ├─ batch thường   : ${CIRCLES_DATA.length} (dead/dying/sick/healthy)
      └─ level-up ready : ${LEVELUP_CIRCLES.length} (EXP ≥ ngưỡng lên cấp ✓)
   ⚡ CircleEnergy      : ${totalEnergy}
   👥 CircleMember      : ${totalMembers}
==================`);
}

main()
    .catch((e) => { console.error("❌ Seed thất bại:", e); process.exit(1); })
    .finally(() => prisma.$disconnect());