// // prisma/seed.ts
// import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// import {
//   DifficultyLevel,
//   FriendRequestStatus,
//   PrismaClient,
// } from "@prisma/client";
// import * as bcrypt from "bcrypt";
// import dotenv from "dotenv";
// dotenv.config();

// const adapter = new PrismaMariaDb({
//   port: Number(process.env.DB_PORT) || 3306,
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "password",
//   database: process.env.DB_NAME || "threads_api",
// });
// const prisma = new PrismaClient({
//   adapter,
// });
// const newUsers = [
//   { email: "user001@example.com", username: "user001", name: "User 001" },
//   { email: "user002@example.com", username: "user002", name: "User 002" },
//   { email: "user003@example.com", username: "user003", name: "User 003" },
//   { email: "user004@example.com", username: "user004", name: "User 004" },
//   { email: "user005@example.com", username: "user005", name: "User 005" },
//   { email: "user006@example.com", username: "user006", name: "User 006" },
//   { email: "user007@example.com", username: "user007", name: "User 007" },
//   { email: "user008@example.com", username: "user008", name: "User 008" },
//   { email: "user009@example.com", username: "user009", name: "User 009" },
//   { email: "user010@example.com", username: "user010", name: "User 010" },
//   { email: "user011@example.com", username: "user011", name: "User 011" },
//   { email: "user012@example.com", username: "user012", name: "User 012" },
//   { email: "user013@example.com", username: "user013", name: "User 013" },
//   { email: "user014@example.com", username: "user014", name: "User 014" },
//   { email: "user015@example.com", username: "user015", name: "User 015" },
//   { email: "user016@example.com", username: "user016", name: "User 016" },
//   { email: "user017@example.com", username: "user017", name: "User 017" },
//   { email: "user018@example.com", username: "user018", name: "User 018" },
//   { email: "user019@example.com", username: "user019", name: "User 019" },
//   { email: "user020@example.com", username: "user020", name: "User 020" },
//   { email: "user021@example.com", username: "user021", name: "User 021" },
//   { email: "user022@example.com", username: "user022", name: "User 022" },
//   { email: "user023@example.com", username: "user023", name: "User 023" },
//   { email: "user024@example.com", username: "user024", name: "User 024" },
//   { email: "user025@example.com", username: "user025", name: "User 025" },
//   { email: "user026@example.com", username: "user026", name: "User 026" },
//   { email: "user027@example.com", username: "user027", name: "User 027" },
//   { email: "user028@example.com", username: "user028", name: "User 028" },
//   { email: "user029@example.com", username: "user029", name: "User 029" },
//   { email: "user030@example.com", username: "user030", name: "User 030" },
//   { email: "user031@example.com", username: "user031", name: "User 031" },
//   { email: "user032@example.com", username: "user032", name: "User 032" },
//   { email: "user033@example.com", username: "user033", name: "User 033" },
//   { email: "user034@example.com", username: "user034", name: "User 034" },
//   { email: "user035@example.com", username: "user035", name: "User 035" },
//   { email: "user036@example.com", username: "user036", name: "User 036" },
//   { email: "user037@example.com", username: "user037", name: "User 037" },
//   { email: "user038@example.com", username: "user038", name: "User 038" },
//   { email: "user039@example.com", username: "user039", name: "User 039" },
//   { email: "user040@example.com", username: "user040", name: "User 040" },
//   { email: "user041@example.com", username: "user041", name: "User 041" },
//   { email: "user042@example.com", username: "user042", name: "User 042" },
//   { email: "user043@example.com", username: "user043", name: "User 043" },
//   { email: "user044@example.com", username: "user044", name: "User 044" },
//   { email: "user045@example.com", username: "user045", name: "User 045" },
//   { email: "user046@example.com", username: "user046", name: "User 046" },
//   { email: "user047@example.com", username: "user047", name: "User 047" },
//   { email: "user048@example.com", username: "user048", name: "User 048" },
//   { email: "user049@example.com", username: "user049", name: "User 049" },
//   { email: "user050@example.com", username: "user050", name: "User 050" },
// ];
// async function seed() {
//   const targetUser = await prisma.user.findUnique({
//     where: { username: "minhvn.photo" },
//     select: { id: true, username: true },
//   });

//   if (!targetUser) {
//     console.log("Không tìm thấy user minhvn.photo");
//     return;
//   }

//   console.log(`Target: ${targetUser.username} (${targetUser.id})`);

//   const hashedPassword = await bcrypt.hash("Password123!", 10);
//   const createdUsers: { id: string; username: string }[] = [];

//   for (const u of newUsers) {
//     try {
//       const created = await prisma.user.create({
//         data: {
//           email: u.email,
//           username: u.username,
//           name: u.name,
//           password: hashedPassword,
//         },
//         select: { id: true, username: true },
//       });
//       createdUsers.push(created);
//     } catch {
//       const existing = await prisma.user.findUnique({
//         where: { username: u.username },
//         select: { id: true, username: true },
//       });
//       if (existing) createdUsers.push(existing);
//     }
//   }

//   console.log(`✅ Users ready: ${createdUsers.length}`);

//   const first25 = createdUsers.slice(0, 25); // minhvn.photo gửi đến 25 người này
//   const last25 = createdUsers.slice(25, 50); // 25 người này gửi đến minhvn.photo

//   let created = 0;
//   let skipped = 0;

//   for (const receiver of first25) {
//     try {
//       await prisma.friendRequest.create({
//         data: {
//           senderId: targetUser.id,
//           receiverId: receiver.id,
//           status: FriendRequestStatus.PENDING,
//         },
//       });
//       created++;
//     } catch {
//       skipped++;
//     }
//   }

//   for (const sender of last25) {
//     try {
//       await prisma.friendRequest.create({
//         data: {
//           senderId: sender.id,
//           receiverId: targetUser.id,
//           status: FriendRequestStatus.PENDING,
//         },
//       });
//       created++;
//     } catch {
//       skipped++;
//     }
//   }

//   console.log(`✅ Friend requests — created: ${created}, skipped: ${skipped}`);

//   const sentCount = await prisma.friendRequest.count({
//     where: { senderId: targetUser.id, status: FriendRequestStatus.PENDING },
//   });
//   const receivedCount = await prisma.friendRequest.count({
//     where: { receiverId: targetUser.id, status: FriendRequestStatus.PENDING },
//   });

//   console.log(`\n📊 minhvn.photo:`);
//   console.log(`  Gửi đi:  ${sentCount} PENDING`);
//   console.log(`  Nhận về: ${receivedCount} PENDING`);
// }
// seed()
//   .catch(console.error)
//   .finally(() => prisma.$disconnect());
// // async function seed() {
// //   const targetUser = await prisma.user.findUnique({
// //     where: { username: "minhvn.photo" },
// //     select: { id: true, username: true },
// //   });

// //   if (!targetUser) {
// //     console.log("Không tìm thấy user minhvn.photo");
// //     return;
// //   }

// //   const otherUsers = await prisma.user.findMany({
// //     where: { username: { not: "minhvn.photo" } },
// //     select: { id: true, username: true },
// //   });

// //   console.log(`Target: ${targetUser.username} (${targetUser.id})`);
// //   console.log(`Other users: ${otherUsers.length}`);

// //   let created = 0;
// //   let skipped = 0;

// //   const shuffled = otherUsers.sort(() => Math.random() - 0.5);

// //   // Nửa đầu: họ gửi đến minhvn.photo (minhvn.photo là receiver)
// //   const receivers = shuffled.slice(0, Math.ceil(shuffled.length / 2));
// //   for (const sender of receivers) {
// //     try {
// //       await prisma.friendRequest.create({
// //         data: {
// //           senderId: sender.id,
// //           receiverId: targetUser.id,
// //           status: FriendRequestStatus.PENDING,
// //         },
// //       });
// //       created++;
// //     } catch {
// //       skipped++;
// //     }
// //   }

// //   // Nửa sau: minhvn.photo gửi đến họ (minhvn.photo là sender)
// //   const senders = shuffled.slice(Math.ceil(shuffled.length / 2));
// //   for (const receiver of senders) {
// //     try {
// //       await prisma.friendRequest.create({
// //         data: {
// //           senderId: targetUser.id,
// //           receiverId: receiver.id,
// //           status: FriendRequestStatus.PENDING,
// //         },
// //       });
// //       created++;
// //     } catch {
// //       skipped++;
// //     }
// //   }

// //   console.log(`✅ Created: ${created}, Skipped (duplicate): ${skipped}`);

// //   // Summary
// //   const receivedCount = await prisma.friendRequest.count({
// //     where: { receiverId: targetUser.id, status: FriendRequestStatus.PENDING },
// //   });
// //   const sentCount = await prisma.friendRequest.count({
// //     where: { senderId: targetUser.id, status: FriendRequestStatus.PENDING },
// //   });

// //   console.log(`\n📊 ${targetUser.username}:`);
// //   console.log(`  Nhận: ${receivedCount} PENDING requests`);
// //   console.log(`  Gửi:  ${sentCount} PENDING requests`);
// // }

// // seed()
// //   .catch(console.error)
// //   .finally(() => prisma.$disconnect());
// // async function main() {
// //     // Lấy tất cả user hiện có để phân bổ bài viết
// //     const users = await prisma.user.findMany({
// //         where: { deletedAt: null, status: "ACTIVE" },
// //         select: { id: true },
// //         take: 10,
// //     });

// //     if (users.length === 0) {
// //         throw new Error("Không có user nào trong DB. Hãy seed user trước.");
// //     }

// //     const uid = (i: number) => users[i % users.length].id;

// //     const posts = [
// //         // ─── TÂM LÝ HỌC ───────────────────────────────────────────────────────
// //         {
// //             userId: uid(0),
// //             learningGoal:
// //                 "Hiểu tại sao con người thường đưa ra quyết định tệ dù biết rõ hậu quả.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ rằng nếu biết điều gì là sai thì sẽ không làm. Nhưng thực tế não bộ tách biệt vùng nhận thức (biết) và vùng kiểm soát hành vi (làm). Đây là hai hệ thống hoàn toàn độc lập.",
// //             coreExplanation:
// //                 "Nhà tâm lý học Daniel Kahneman gọi đây là hệ thống 1 (phản xạ, cảm xúc) và hệ thống 2 (lý trí, chậm). Khi stress hoặc mệt mỏi, hệ thống 1 chiếm quyền kiểm soát. Đó là lý do bạn ăn khuya dù đang ăn kiêng, hay nổi giận dù biết mình sai. Giải pháp không phải là 'cố gắng hơn' mà là thiết kế môi trường để hệ thống 1 tự đi đúng hướng — ví dụ đặt trái cây lên bàn thay vì bánh kẹo.",
// //             understandingCheck:
// //                 "Nếu bạn muốn tập thể dục đều hơn, thay vì dựa vào ý chí, bạn có thể thay đổi môi trường xung quanh như thế nào?",
// //             summary: "Tại sao biết mà vẫn làm sai — hệ thống 1 và 2 của não bộ",
// //             tags: ["tâm lý học", "hành vi", "ra quyết định"],
// //             difficultyLevel: DifficultyLevel.BEGINNER,
// //             readingTime: 3,
// //         },
// //         {
// //             userId: uid(1),
// //             learningGoal:
// //                 "Hiểu hiệu ứng Dunning-Kruger và tại sao người kém nhất lại tự tin nhất.",
// //             commonConfusion:
// //                 "Người ta hay nghĩ Dunning-Kruger có nghĩa là 'người ngu thì nghĩ mình thông minh'. Thực ra nghiên cứu gốc tinh tế hơn: người có năng lực thấp thiếu khả năng siêu nhận thức để nhận ra giới hạn của mình — họ không biết những gì họ không biết.",
// //             coreExplanation:
// //                 "Dunning và Kruger cho sinh viên làm bài kiểm tra logic, ngữ pháp và hài hước. Nhóm điểm thấp nhất ước tính mình nằm top 60%, trong khi thực tế top 12%. Ngược lại, nhóm giỏi nhất lại đánh giá thấp bản thân vì họ nghĩ 'ai cũng làm được vậy'. Điều này giải thích tại sao chuyên gia thường do dự hơn người mới học trong việc đưa ra tuyên bố chắc chắn.",
// //             understandingCheck:
// //                 "Bạn đang học một kỹ năng mới. Khi nào bạn nên lo lắng hơn: lúc cảm thấy mình hiểu hoàn toàn, hay lúc nhận ra ngày càng nhiều điều mình chưa biết?",
// //             summary: "Dunning-Kruger — tại sao càng ít biết càng tự tin hơn",
// //             tags: ["tâm lý học", "nhận thức", "siêu nhận thức"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 4,
// //         },
// //         {
// //             userId: uid(2),
// //             learningGoal:
// //                 "Hiểu tại sao nỗi đau từ mất mát lớn hơn niềm vui từ được lợi tương đương.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ cảm xúc của họ cân bằng — được 100 đồng vui bao nhiêu thì mất 100 đồng buồn bấy nhiêu. Nhưng nghiên cứu cho thấy nỗi đau mất mát mạnh gấp đôi niềm vui từ được lợi tương đương.",
// //             coreExplanation:
// //                 "Kahneman và Tversky gọi đây là Loss Aversion — xu hướng né tránh mất mát. Về mặt tiến hóa, tổ tiên chúng ta mất thức ăn hay chỗ ở là chết, nên não học cách phản ứng mạnh hơn với nguy cơ mất mát. Điều này giải thích tại sao người ta giữ cổ phiếu thua lỗ quá lâu (không muốn 'chốt lỗ'), hay tại sao nhà hàng ghi 'tiết kiệm 50k' thay vì 'chỉ 50k thêm' lại bán được nhiều hơn.",
// //             understandingCheck:
// //                 "Một công ty muốn thuyết phục nhân viên đóng góp nhiều hơn vào quỹ hưu trí. Họ nên đóng khung thông điệp theo hướng 'được lợi' hay 'tránh mất mát'?",
// //             summary: "Loss Aversion — tại sao mất đau hơn được vui gấp đôi",
// //             tags: ["tâm lý học", "kinh tế hành vi", "ra quyết định"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 4,
// //         },

// //         // ─── LỊCH SỬ ────────────────────────────────────────────────────────────
// //         {
// //             userId: uid(3),
// //             learningGoal:
// //                 "Hiểu tại sao Đế chế La Mã sụp đổ và bài học nào còn giá trị đến hôm nay.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ La Mã sụp đổ vì bị người man rợ tấn công. Thực ra đó chỉ là giọt nước tràn ly — đế chế đã tự suy yếu từ bên trong qua hàng thế kỷ trước khi thành Rome thất thủ năm 476.",
// //             coreExplanation:
// //                 "Sử gia Edward Gibbon liệt kê nhiều nguyên nhân: khủng hoảng kinh tế do chi tiêu quân sự quá mức, mất ổn định chính trị (hơn 20 hoàng đế bị ám sát trong 50 năm), dịch bệnh Antonine giết 5 triệu người, và quan trọng nhất là sự phân chia giai cấp khiến công dân không còn đồng nhất với đế chế. Người giàu trốn thuế, quân đội được trả bằng vàng pha, đồng tiền mất giá. Không có một cú đánh nào — chỉ là sự xói mòn dần dần của niềm tin và thể chế.",
// //             understandingCheck:
// //                 "So sánh với một tổ chức hay quốc gia hiện đại: dấu hiệu nào cho thấy một thực thể đang suy yếu từ bên trong thay vì từ tác động bên ngoài?",
// //             summary:
// //                 "Vì sao La Mã sụp đổ — không phải một trận đánh mà là sự xói mòn",
// //             tags: ["lịch sử", "đế chế La Mã", "văn minh"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 5,
// //         },
// //         {
// //             userId: uid(0),
// //             learningGoal:
// //                 "Hiểu tại sao Thế chiến 1 bùng nổ từ một vụ ám sát có vẻ nhỏ ở Sarajevo.",
// //             commonConfusion:
// //                 "Học sinh thường nghĩ Thế chiến 1 xảy ra 'vì Archduke Ferdinand bị bắn'. Nhưng đây là ngụy biện nhân-quả đơn giản hóa quá mức — châu Âu đã là thùng thuốc súng trước đó nhiều thập kỷ.",
// //             coreExplanation:
// //                 "Năm 1914 châu Âu có 4 cấu trúc nguy hiểm cùng lúc: hệ thống liên minh ràng buộc (một nước tuyên chiến kéo cả khối vào), chủ nghĩa dân tộc sôi sục ở Balkan, cuộc đua vũ trang Anh-Đức, và các kế hoạch quân sự cứng nhắc như Kế hoạch Schlieffen không có chỗ cho ngoại giao. Vụ ám sát chỉ là mồi lửa — nhưng mồi lửa bật vào kho thuốc súng đã sẵn sàng. Nhà sử học Christopher Clark gọi các lãnh đạo châu Âu lúc đó là 'những kẻ mộng du' — dẫn cả lục địa vào chiến tranh mà không ai thực sự muốn.",
// //             understandingCheck:
// //                 "Nếu không có vụ ám sát ở Sarajevo, liệu Thế chiến 1 có xảy ra không? Điều gì quyết định kết quả đó?",
// //             summary: "Thế chiến 1 — thùng thuốc súng châu Âu và mồi lửa Sarajevo",
// //             tags: ["lịch sử", "thế chiến", "địa chính trị"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 5,
// //         },
// //         {
// //             userId: uid(1),
// //             learningGoal:
// //                 "Hiểu Con đường Tơ lụa thực sự là gì và tại sao nó quan trọng hơn chỉ là thương mại.",
// //             commonConfusion:
// //                 "Hầu hết mọi người nghĩ Con đường Tơ lụa chỉ là tuyến đường vận chuyển lụa từ Trung Quốc sang châu Âu. Thực ra đây là mạng lưới phức tạp trải dài 6.400 km, và lụa chỉ là một trong hàng trăm thứ được trao đổi.",
// //             coreExplanation:
// //                 "Từ thế kỷ 2 TCN đến thế kỷ 15, Con đường Tơ lụa truyền đi không chỉ hàng hóa mà còn: bệnh dịch hạch (gây ra Cái Chết Đen ở châu Âu), hệ thống số Arab-Hindu đến châu Âu, kỹ thuật làm giấy và thuốc súng từ Trung Quốc, Phật giáo từ Ấn Độ sang Đông Á, và đạo Hồi từ Trung Đông sang Trung Á. Không có Con đường Tơ lụa, nền văn minh hiện đại sẽ rất khác — kể cả toán học bạn học ở trường cũng phụ thuộc vào hành trình này.",
// //             understandingCheck:
// //                 "Internet ngày nay có điểm gì giống và khác Con đường Tơ lụa trong việc lan truyền ý tưởng và văn hóa?",
// //             summary:
// //                 "Con đường Tơ lụa — mạng lưới kết nối thế giới đầu tiên của nhân loại",
// //             tags: ["lịch sử", "thương mại", "văn hóa"],
// //             difficultyLevel: DifficultyLevel.BEGINNER,
// //             readingTime: 4,
// //         },

// //         // ─── KHOA HỌC ────────────────────────────────────────────────────────────
// //         {
// //             userId: uid(2),
// //             learningGoal:
// //                 "Hiểu tại sao bầu trời màu xanh và hoàng hôn màu đỏ cam bằng cùng một nguyên lý.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ bầu trời xanh vì không khí có màu xanh, hoặc vì ánh sáng phản chiếu từ đại dương. Thực ra cả hai hiện tượng này đều sai.",
// //             coreExplanation:
// //                 "Ánh sáng mặt trời là tổng hợp mọi màu sắc. Khi đi qua khí quyển, các phân tử không khí tán xạ ánh sáng theo hiện tượng Rayleigh — ánh sáng xanh (bước sóng ngắn) bị tán xạ mạnh gấp ~10 lần ánh sáng đỏ (bước sóng dài). Ban ngày nhìn lên trời thấy ánh sáng xanh tán xạ khắp nơi. Lúc hoàng hôn ánh sáng đi qua lớp khí quyển dày hơn — ánh sáng xanh bị tán xạ hết dọc đường, chỉ còn màu đỏ cam đến mắt bạn.",
// //             understandingCheck:
// //                 "Nếu bạn đứng trên Mặt Trăng (không có khí quyển) và nhìn về phía Mặt Trời, bầu trời sẽ có màu gì? Tại sao?",
// //             summary: "Tại sao bầu trời xanh và hoàng hôn đỏ — tán xạ Rayleigh",
// //             tags: ["vật lý", "quang học", "khí quyển"],
// //             difficultyLevel: DifficultyLevel.BEGINNER,
// //             readingTime: 3,
// //         },
// //         {
// //             userId: uid(3),
// //             learningGoal:
// //                 "Hiểu CRISPR-Cas9 là gì và tại sao nó thay đổi hoàn toàn y học và nông nghiệp.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ chỉnh sửa gene là khái niệm khoa học viễn tưởng phức tạp, hoặc nhầm với nhân bản vô tính. CRISPR thực ra đơn giản hơn nhiều về mặt khái niệm — như dùng kéo và keo để cắt-dán văn bản, nhưng trên DNA.",
// //             coreExplanation:
// //                 "CRISPR là cơ chế miễn dịch tự nhiên của vi khuẩn để 'nhớ mặt' virus. Nhà khoa học Jennifer Doudna và Emmanuelle Charpentier (Nobel Y học 2020) nhận ra có thể lập trình lại cơ chế này để cắt DNA ở bất kỳ vị trí nào họ muốn. Ứng dụng: chữa bệnh hồng cầu hình liềm, tạo lúa chịu hạn, tiêu diệt tế bào ung thư. Thách thức lớn nhất không phải kỹ thuật mà là đạo đức — chỉnh sửa gene mầm (germline) sẽ di truyền sang đời sau.",
// //             understandingCheck:
// //                 "Nếu CRISPR có thể loại bỏ gene gây bệnh Alzheimer khỏi phôi thai, nhưng thay đổi này sẽ truyền cho mọi thế hệ sau, bạn nghĩ nên làm không? Tại sao đây là câu hỏi khó?",
// //             summary:
// //                 "CRISPR-Cas9 — kéo phân tử đang viết lại tương lai của sinh vật sống",
// //             tags: ["sinh học", "gene", "y học"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 5,
// //         },
// //         {
// //             userId: uid(0),
// //             learningGoal:
// //                 "Hiểu tại sao mọi thứ đều được tạo từ các nguyên tử nhưng chúng ta không xuyên qua tường.",
// //             commonConfusion:
// //                 "Nguyên tử chủ yếu là khoảng không rỗng — hạt nhân nhỏ hơn sân vận động, electron chạy quanh ở cách rất xa. Vậy tại sao vật chất trông đặc và rắn? Nhiều người nghĩ đó là vì nguyên tử 'chạm vào nhau'.",
// //             coreExplanation:
// //                 "Vật chất cứng vì lực điện từ, không phải tiếp xúc vật lý. Các electron mang điện âm đẩy nhau — khi bạn đặt tay lên bàn, electron của tay và bàn đẩy nhau đủ mạnh để bạn không rơi xuống. Thực ra bàn tay bạn chưa bao giờ thực sự 'chạm' vào bàn — chúng chỉ cách nhau vài angstrom và lực đẩy điện từ tạo ra cảm giác rắn chắc. Bạn đang nổi trên một tấm đệm vô hình của lực điện từ.",
// //             understandingCheck:
// //                 "Nếu lực điện từ đột ngột biến mất, điều gì sẽ xảy ra với mọi vật thể xung quanh bạn?",
// //             summary: "Tại sao bạn không xuyên qua tường dù nguyên tử hầu như rỗng",
// //             tags: ["vật lý", "nguyên tử", "lực điện từ"],
// //             difficultyLevel: DifficultyLevel.BEGINNER,
// //             readingTime: 3,
// //         },

// //         // ─── TRIẾT HỌC ──────────────────────────────────────────────────────────
// //         {
// //             userId: uid(1),
// //             learningGoal:
// //                 "Hiểu tư tưởng khắc kỷ (Stoicism) và cách áp dụng vào cuộc sống hiện đại.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ khắc kỷ là 'không có cảm xúc' hay 'chịu đựng mọi thứ trong im lặng'. Thực ra đây là hiểu sai — Stoicism dạy cách phân biệt điều trong và ngoài tầm kiểm soát, không phải triệt tiêu cảm xúc.",
// //             coreExplanation:
// //                 "Marcus Aurelius, Epictetus và Seneca dạy một nguyên lý cốt lõi: có những thứ phụ thuộc vào chúng ta (suy nghĩ, phản ứng, nỗ lực) và những thứ không (ý kiến người khác, thời tiết, kết quả). Chìa khóa hạnh phúc là tập trung 100% năng lượng vào nhóm đầu và chấp nhận nhóm sau. Khi bị phê bình oan, người khắc kỷ không hỏi 'tại sao tôi bị đối xử như vậy' mà hỏi 'phản ứng tốt nhất của tôi là gì'. Đây là cơ sở của nhiều liệu pháp tâm lý hiện đại như CBT.",
// //             understandingCheck:
// //                 "Liệt kê 3 điều bạn thường lo lắng. Điều nào thực sự trong tầm kiểm soát của bạn và điều nào không?",
// //             summary:
// //                 "Stoicism — triết học 2000 tuổi vẫn là liệu pháp tâm lý hiệu quả nhất",
// //             tags: ["triết học", "khắc kỷ", "tâm lý học"],
// //             difficultyLevel: DifficultyLevel.BEGINNER,
// //             readingTime: 4,
// //         },
// //         {
// //             userId: uid(2),
// //             learningGoal:
// //                 "Hiểu nghịch lý Thuyền Theseus và tại sao nó đặt ra câu hỏi sâu về bản sắc.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ đây chỉ là bài toán logic vô nghĩa. Thực ra nghịch lý này chạm đến câu hỏi triết học căn bản nhất: điều gì làm cho 'bạn' là 'bạn' qua thời gian?",
// //             coreExplanation:
// //                 "Nếu thay từng tấm ván trên thuyền Theseus cho đến khi không còn tấm ván gốc nào — đây có còn là cùng một con thuyền không? Câu hỏi này áp dụng cho cơ thể bạn: mỗi 7-10 năm hầu hết tế bào trong cơ thể bạn được thay mới hoàn toàn. Bạn năm 30 tuổi có cùng nguyên tử với bạn năm 20 tuổi không? Có ba câu trả lời triết học: (1) bản sắc là liên tục vật lý, (2) bản sắc là liên tục tâm lý/ký ức, (3) bản sắc là khái niệm chúng ta tự áp đặt lên thực tại.",
// //             understandingCheck:
// //                 "Nếu khoa học có thể upload toàn bộ ký ức và tính cách của bạn vào một robot — robot đó có phải là 'bạn' không? Câu trả lời của bạn phụ thuộc vào quan điểm nào về bản sắc?",
// //             summary:
// //                 "Nghịch lý Thuyền Theseus — điều gì làm nên bản sắc của một thực thể?",
// //             tags: ["triết học", "bản sắc", "siêu hình học"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 4,
// //         },

// //         // ─── KINH TẾ ────────────────────────────────────────────────────────────
// //         {
// //             userId: uid(3),
// //             learningGoal:
// //                 "Hiểu lạm phát thực sự là gì, nguyên nhân và tại sao một chút lạm phát lại tốt.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ lạm phát đơn giản là 'giá tăng' và lạm phát luôn xấu. Thực ra một mức lạm phát thấp và ổn định (2-3%) là dấu hiệu kinh tế khỏe mạnh và được các ngân hàng trung ương chủ động hướng đến.",
// //             coreExplanation:
// //                 "Lạm phát xảy ra khi cung tiền tăng nhanh hơn hàng hóa và dịch vụ. Một chút lạm phát tốt vì: (1) khuyến khích chi tiêu và đầu tư thay vì giữ tiền mặt, (2) giúp điều chỉnh lương linh hoạt hơn, (3) cho phép ngân hàng trung ương có dư địa cắt lãi suất khi cần kích thích kinh tế. Giảm phát (giá giảm) nghe có vẻ tốt nhưng thực ra nguy hiểm hơn — người dân hoãn mua sắm chờ giá rẻ hơn, doanh nghiệp thu ít tiền hơn, cắt nhân viên, tạo vòng xoáy suy thoái. Nhật Bản đã trải qua 'thập kỷ mất mát' chính vì bẫy giảm phát.",
// //             understandingCheck:
// //                 "Tại sao ngân hàng trung ương không cố gắng đưa lạm phát về 0% thay vì 2%?",
// //             summary:
// //                 "Lạm phát — không phải kẻ thù, và tại sao 0% còn nguy hiểm hơn 2%",
// //             tags: ["kinh tế", "lạm phát", "chính sách tiền tệ"],
// //             difficultyLevel: DifficultyLevel.BEGINNER,
// //             readingTime: 4,
// //         },
// //         {
// //             userId: uid(0),
// //             learningGoal:
// //                 "Hiểu tại sao các nước giàu tài nguyên thiên nhiên thường phát triển chậm hơn.",
// //             commonConfusion:
// //                 "Theo logic thông thường, dầu mỏ hay kim cương nhiều = đất nước giàu. Nhưng dữ liệu thực tế cho thấy điều ngược lại — Nigeria, Venezuela, Angola giàu tài nguyên nhưng kém phát triển hơn Singapore, Hàn Quốc, Đài Loan — những nơi gần như không có tài nguyên.",
// //             coreExplanation:
// //                 "Các nhà kinh tế gọi đây là 'lời nguyền tài nguyên' (Resource Curse). Khi đất nước kiếm tiền dễ từ tài nguyên: (1) chính phủ ít phụ thuộc thuế dân nên ít chịu áp lực minh bạch, (2) tầng lớp tinh hoa tranh giành kiểm soát nguồn thu thay vì tạo ra giá trị, (3) đồng nội tệ tăng giá khiến xuất khẩu khác kém cạnh tranh (Dutch Disease). Na Uy là ngoại lệ nhờ thành lập Quỹ Dầu khí độc lập từ sớm để tách rời chính trị khỏi nguồn thu tài nguyên.",
// //             understandingCheck:
// //                 "Điều gì làm Na Uy tránh được 'lời nguyền tài nguyên' mà nhiều nước khác không làm được?",
// //             summary:
// //                 "Lời nguyền tài nguyên — tại sao nước giàu dầu mỏ lại thường nghèo",
// //             tags: ["kinh tế", "phát triển", "tài nguyên"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 5,
// //         },
// //         {
// //             userId: uid(1),
// //             learningGoal:
// //                 "Hiểu nguyên lý lợi thế so sánh và tại sao thương mại quốc tế có lợi cho tất cả.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ thương mại chỉ có lợi cho nước sản xuất hiệu quả hơn. Nhưng kinh tế học cho thấy ngay cả khi một nước tệ hơn ở mọi mặt, thương mại vẫn có lợi cho cả hai bên.",
// //             coreExplanation:
// //                 "David Ricardo (1817) đưa ra ví dụ: Bồ Đào Nha sản xuất cả vải và rượu hiệu quả hơn Anh. Nhưng nếu Bồ Đào Nha tập trung vào rượu (lợi thế tương đối lớn hơn) và nhập vải từ Anh, cả hai nước đều có nhiều hơn. Nguyên lý: không phải 'giỏi hơn' mà là 'giỏi hơn ở cái gì'. Ứng dụng cá nhân: dù bạn là CEO giỏi cả lập trình lẫn quản lý, bạn vẫn nên thuê lập trình viên để tập trung vào điều tạo ra giá trị cao nhất.",
// //             understandingCheck:
// //                 "Áp dụng lợi thế so sánh vào cuộc sống cá nhân: làm thế nào để quyết định nên tự làm gì và nên thuê người khác làm gì?",
// //             summary:
// //                 "Lợi thế so sánh — tại sao thương mại có lợi dù bạn tệ hơn mọi mặt",
// //             tags: ["kinh tế", "thương mại quốc tế", "Ricardo"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 4,
// //         },

// //         // ─── LẬP TRÌNH ──────────────────────────────────────────────────────────
// //         {
// //             userId: uid(2),
// //             learningGoal:
// //                 "Hiểu Event Loop trong JavaScript và tại sao JS có thể xử lý nhiều việc dù chỉ có một thread.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ 'async/await' hay 'Promise' nghĩa là JavaScript chạy đa luồng. Thực ra JS vẫn chỉ có một thread — điều kỳ diệu xảy ra nhờ Event Loop phối hợp với Web APIs của browser hoặc libuv của Node.",
// //             coreExplanation:
// //                 "Khi bạn gọi setTimeout, fetch hay đọc file, JS giao việc đó cho Web API (browser) hoặc libuv (Node) rồi tiếp tục chạy code khác. Khi tác vụ hoàn thành, callback được đẩy vào queue. Event Loop liên tục kiểm tra: nếu call stack trống, lấy callback từ queue ra chạy. Đó là tại sao console.log('B') chạy trước setTimeout callback dù timeout là 0ms — call stack chưa trống. Microtask queue (Promise) có độ ưu tiên cao hơn macrotask queue (setTimeout).",
// //             understandingCheck:
// //                 "Đoạn code sau in ra thứ tự gì và tại sao: console.log('1'); setTimeout(()=>console.log('2'),0); Promise.resolve().then(()=>console.log('3')); console.log('4');",
// //             summary:
// //                 "Event Loop JavaScript — tại sao single-thread vẫn xử lý được async",
// //             tags: ["lập trình", "javascript", "async"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 5,
// //         },
// //         {
// //             userId: uid(3),
// //             learningGoal:
// //                 "Hiểu tại sao rebase git nguy hiểm hơn merge và khi nào nên dùng cái nào.",
// //             commonConfusion:
// //                 "Nhiều developer mới dùng rebase và merge như nhau vì kết quả trông giống nhau — code được tích hợp. Nhưng rebase viết lại lịch sử commit, gây ra vấn đề nghiêm trọng nếu dùng trên branch đã được push.",
// //             coreExplanation:
// //                 "Merge tạo một commit mới kết hợp hai nhánh, giữ nguyên lịch sử. Rebase 'cắt' các commit của bạn và 'dán' lại lên đỉnh của nhánh đích — commit mới có hash khác dù nội dung giống. Vấn đề: nếu người khác đã pull branch của bạn trước khi bạn rebase, git của họ thấy hai phiên bản khác nhau của cùng thay đổi và tạo ra conflict hỗn loạn. Quy tắc vàng: chỉ rebase branch local chưa push, hoặc feature branch riêng của bạn. Không bao giờ rebase main/master.",
// //             understandingCheck:
// //                 "Bạn đang làm việc trên feature-branch và muốn cập nhật code mới nhất từ main. Nên dùng rebase hay merge? Điều gì thay đổi nếu branch đó chỉ có một mình bạn dùng?",
// //             summary:
// //                 "Git rebase vs merge — khi nào nguy hiểm và quy tắc vàng cần nhớ",
// //             tags: ["lập trình", "git", "version control"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 4,
// //         },
// //         {
// //             userId: uid(0),
// //             learningGoal:
// //                 "Hiểu Garbage Collection hoạt động như thế nào và tại sao vẫn có thể bị memory leak.",
// //             commonConfusion:
// //                 "Nhiều developer nghĩ ngôn ngữ có GC (JavaScript, Python, Java) là không thể bị memory leak. Thực ra GC chỉ dọn dẹp những object không còn ai tham chiếu — nếu code vô tình giữ tham chiếu, GC sẽ không bao giờ dọn được.",
// //             coreExplanation:
// //                 "GC hiện đại dùng thuật toán Mark-and-Sweep: bắt đầu từ 'roots' (biến global, call stack), đánh dấu mọi object có thể đến được, xóa phần còn lại. Memory leak xảy ra khi: (1) event listener không được remove khi component unmount, (2) closure giữ reference đến object lớn, (3) cache tự tăng không giới hạn, (4) global variable vô tình được gán. Trong React, useEffect không cleanup subscription là nguyên nhân phổ biến nhất.",
// //             understandingCheck:
// //                 "Trong React, tại sao việc không return cleanup function trong useEffect khi subscribe WebSocket có thể gây memory leak?",
// //             summary:
// //                 "Garbage Collection và memory leak — tại sao có GC vẫn bị rò rỉ bộ nhớ",
// //             tags: ["lập trình", "memory", "performance"],
// //             difficultyLevel: DifficultyLevel.ADVANCED,
// //             readingTime: 5,
// //         },

// //         // ─── SỨC KHỎE ────────────────────────────────────────────────────────────
// //         {
// //             userId: uid(1),
// //             learningGoal:
// //                 "Hiểu tại sao ngủ đủ giấc quan trọng hơn bất kỳ loại thực phẩm bổ sung nào.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ có thể 'bù giấc' cuối tuần sau khi thức khuya cả tuần. Nghiên cứu cho thấy điều này không hoạt động — não bộ không phục hồi hoàn toàn từ thiếu ngủ tích lũy chỉ bằng ngủ bù.",
// //             coreExplanation:
// //                 "Trong khi ngủ não kích hoạt hệ thống lymph não (glymphatic system) để 'rửa' các chất độc tích lũy trong ngày, bao gồm beta-amyloid — protein liên quan đến Alzheimer. Giai đoạn ngủ sâu REM cũng là lúc não củng cố ký ức, xử lý cảm xúc và sản xuất hormone tăng trưởng. Thiếu ngủ kinh niên tăng nguy cơ tiểu đường type 2 (insulin resistance tăng sau 3 ngày thiếu ngủ), bệnh tim và suy giảm miễn dịch. Matthew Walker (Why We Sleep) gọi giấc ngủ là 'superpower miễn phí nhất thế giới'.",
// //             understandingCheck:
// //                 "Nếu bạn chỉ có thể thay đổi một thói quen sức khỏe, và bạn hiện ngủ 5-6 tiếng/đêm, tại sao ưu tiên ngủ đủ giấc lại có thể hiệu quả hơn thêm bổ sung hay tập gym?",
// //             summary: "Giấc ngủ — siêu năng lực miễn phí và lý do không thể bù giấc",
// //             tags: ["sức khỏe", "giấc ngủ", "não bộ"],
// //             difficultyLevel: DifficultyLevel.BEGINNER,
// //             readingTime: 4,
// //         },
// //         {
// //             userId: uid(2),
// //             learningGoal:
// //                 "Hiểu hệ vi sinh vật đường ruột (gut microbiome) ảnh hưởng đến não và tâm trạng như thế nào.",
// //             commonConfusion:
// //                 "Hầu hết mọi người nghĩ cảm xúc xuất phát từ não và ruột chỉ tiêu hóa thức ăn. Thực ra có 'trục não-ruột' hai chiều — và ruột được gọi là 'bộ não thứ hai' vì có 500 triệu tế bào thần kinh.",
// //             coreExplanation:
// //                 "90% serotonin (hormone hạnh phúc) được sản xuất trong ruột, không phải não. Hệ vi sinh vật đường ruột gồm 38 nghìn tỷ vi khuẩn giao tiếp với não qua dây thần kinh phế vị, hệ miễn dịch và hormone. Nghiên cứu cho thấy thay đổi hệ vi sinh (qua kháng sinh mạnh, chế độ ăn ultra-processed) tương quan với tăng nguy cơ trầm cảm và lo âu. Thực phẩm lên men (yogurt, kimchi, kombucha), chất xơ đa dạng từ rau củ nuôi dưỡng hệ vi sinh có lợi.",
// //             understandingCheck:
// //                 "Nếu kháng sinh tiêu diệt cả vi khuẩn có hại lẫn có lợi, điều gì nên làm sau một đợt dùng kháng sinh dài để phục hồi hệ vi sinh?",
// //             summary:
// //                 "Gut microbiome — 38 nghìn tỷ vi khuẩn đang điều khiển tâm trạng của bạn",
// //             tags: ["sức khỏe", "dinh dưỡng", "vi sinh vật"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 5,
// //         },

// //         // ─── TOÁN HỌC ────────────────────────────────────────────────────────────
// //         {
// //             userId: uid(3),
// //             learningGoal:
// //                 "Hiểu tại sao xác suất điều kiện thường đánh lừa cả chuyên gia và gây hậu quả nghiêm trọng.",
// //             commonConfusion:
// //                 "Người ta thường nhầm P(A|B) với P(B|A). Ví dụ kinh điển: xét nghiệm dương tính với bệnh hiếm không có nghĩa là bạn có 99% khả năng bị bệnh, dù độ chính xác xét nghiệm là 99%.",
// //             coreExplanation:
// //                 "Định lý Bayes giải quyết điều này. Giả sử bệnh tỷ lệ 1/10.000 người. Xét nghiệm chính xác 99%. Nếu 1 triệu người xét nghiệm: ~100 người thực sự bệnh (99 dương tính đúng), nhưng ~9.999 người khỏe mạnh vẫn dương tính sai. Tổng 10.098 người dương tính, chỉ 99 thực sự bệnh — xác suất thực chỉ ~1%. Điều này ảnh hưởng đến quyết định y tế, pháp lý (Nghịch lý Prosecutor) và chính sách hàng ngày.",
// //             understandingCheck:
// //                 "Một email spam filter có độ chính xác 99%. Nếu chỉ 0.1% email thực sự là spam, xác suất một email bị lọc thực sự là spam là bao nhiêu?",
// //             summary:
// //                 "Định lý Bayes — tại sao xét nghiệm 99% chính xác vẫn có thể sai thường xuyên",
// //             tags: ["toán học", "xác suất", "thống kê"],
// //             difficultyLevel: DifficultyLevel.ADVANCED,
// //             readingTime: 6,
// //         },
// //         {
// //             userId: uid(0),
// //             learningGoal:
// //                 "Hiểu tại sao 0.999... (vô hạn số 9) bằng đúng 1, không phải 'gần bằng 1'.",
// //             commonConfusion:
// //                 "Hầu hết mọi người nghĩ 0.999... chỉ 'gần bằng' 1 nhưng không bao giờ bằng — luôn còn một khoảng cách vô cùng nhỏ. Thực ra trong hệ thống số thực chuẩn, chúng hoàn toàn bằng nhau.",
// //             coreExplanation:
// //                 "Có nhiều cách chứng minh: (1) Nếu x = 0.999..., thì 10x = 9.999..., trừ đi: 9x = 9, suy ra x = 1. (2) 1/3 = 0.333..., nhân 3: 3/3 = 0.999..., mà 3/3 = 1. (3) Trong số thực, hai số bằng nhau khi và chỉ khi không tồn tại số nào nằm giữa chúng — không có số nào nằm giữa 0.999... và 1. Điều này phản ảnh bản chất của số thực: mọi số có thể biểu diễn bằng vô hạn chữ số thập phân.",
// //             understandingCheck:
// //                 "Dùng phương pháp phân số để chứng minh 0.999... = 1. Bước nào bạn thấy 'không tự nhiên' nhất và tại sao?",
// //             summary:
// //                 "0.999... = 1 hoàn toàn — không phải xấp xỉ, là đẳng thức chính xác",
// //             tags: ["toán học", "số thực", "vô cực"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 4,
// //         },

// //         // ─── XÃ HỘI HỌC ──────────────────────────────────────────────────────────
// //         {
// //             userId: uid(1),
// //             learningGoal:
// //                 "Hiểu tại sao người chứng kiến đông người thường ít giúp đỡ hơn khi chỉ có một người.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ đám đông đồng nghĩa an toàn hơn — nếu có chuyện xảy ra, chắc chắn ai đó sẽ giúp. Nghiên cứu tâm lý học cho thấy điều ngược lại hoàn toàn.",
// //             coreExplanation:
// //                 "Hiệu ứng người ngoài cuộc (Bystander Effect) được phát hiện sau vụ Kitty Genovese (1964) — bị tấn công 30 phút trong khi 38 hàng xóm chứng kiến nhưng không ai gọi cảnh sát. Có hai cơ chế: (1) Phân tán trách nhiệm — mỗi người nghĩ 'người khác sẽ giúp', (2) Ảnh hưởng xã hội — không ai hành động nên mọi người đoán đây không phải tình huống khẩn cấp. Nghiên cứu Darley & Latané: 85% giúp khi một mình, chỉ 31% giúp khi ở trong nhóm 5 người. Giải pháp: chỉ định cụ thể một người ('Anh áo xanh kia, gọi 115 ngay!').",
// //             understandingCheck:
// //                 "Nếu bạn đột ngột ngã ở giữa đám đông đông người, làm thế nào để tăng khả năng ai đó sẽ giúp bạn?",
// //             summary:
// //                 "Bystander Effect — tại sao đông người chứng kiến lại ít ai ra tay giúp",
// //             tags: ["xã hội học", "tâm lý đám đông", "hành vi"],
// //             difficultyLevel: DifficultyLevel.BEGINNER,
// //             readingTime: 4,
// //         },
// //         {
// //             userId: uid(2),
// //             learningGoal:
// //                 "Hiểu tại sao ngôn ngữ chúng ta nói ảnh hưởng đến cách chúng ta nghĩ và nhìn thế giới.",
// //             commonConfusion:
// //                 "Nhiều người cho rằng ngôn ngữ chỉ là công cụ diễn đạt ý tưởng — ý tưởng tồn tại độc lập và ngôn ngữ chỉ là 'lớp áo'. Giả thuyết Sapir-Whorf cho rằng điều ngược lại: ngôn ngữ định hình tư duy.",
// //             coreExplanation:
// //                 "Các ví dụ thực nghiệm thú vị: người Pirahã (Amazonia) không có khái niệm số cụ thể (chỉ có 'ít', 'nhiều') và gặp khó khăn với các bài toán đếm chính xác. Người Kuuk Thaayorre (Úc) dùng hướng tuyệt đối thay vì tương đối ('bàn tay phía đông') và có định hướng không gian cực kỳ tốt. Tiếng Nga có hai từ khác nhau cho xanh lam nhạt và đậm — người Nga phân biệt màu xanh nhanh hơn người Anh trong thí nghiệm. Ngôn ngữ không hoàn toàn kiểm soát tư duy nhưng tạo ra 'đường mòn quen thuộc' cho não.",
// //             understandingCheck:
// //                 "Nếu học một ngôn ngữ mới thực sự thay đổi cách bạn tư duy, điều đó có nghĩa gì cho việc học ngôn ngữ? Ngôn ngữ nào bạn nghĩ sẽ thay đổi tư duy nhiều nhất?",
// //             summary:
// //                 "Ngôn ngữ định hình tư duy — giả thuyết Sapir-Whorf và bằng chứng thực nghiệm",
// //             tags: ["ngôn ngữ học", "tâm lý học", "văn hóa"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 5,
// //         },

// //         // ─── VŨ TRỤ HỌC ──────────────────────────────────────────────────────────
// //         {
// //             userId: uid(3),
// //             learningGoal:
// //                 "Hiểu tại sao vũ trụ đang giãn nở nhanh hơn theo thời gian thay vì chậm lại.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ nếu Big Bang tạo ra vụ nổ ban đầu thì sự giãn nở phải chậm dần vì hấp dẫn kéo mọi thứ lại. Nhưng năm 1998 phát hiện chấn động: vũ trụ đang tăng tốc giãn nở.",
// //             coreExplanation:
// //                 "Hai nhóm thiên văn học độc lập đo khoảng cách đến các supernova Type Ia (nến chuẩn) và nhận ra chúng xa hơn dự đoán — nghĩa là vũ trụ giãn nhanh hơn dự kiến. Nguyên nhân được gọi là 'năng lượng tối' (dark energy) — một dạng năng lượng chiếm 68% vũ trụ nhưng chúng ta chưa biết nó là gì. Nếu xu hướng này tiếp tục, sau hàng tỷ năm các thiên hà sẽ xa nhau đến mức ánh sáng của chúng không bao giờ đến được Milky Way — vũ trụ trở nên tối tăm và cô đơn hoàn toàn.",
// //             understandingCheck:
// //                 "Nếu năng lượng tối mạnh hơn nữa, một kịch bản gọi là 'Big Rip' có thể xảy ra. Bạn hãy đoán Big Rip là gì dựa trên những gì đã học?",
// //             summary:
// //                 "Năng lượng tối và vũ trụ tăng tốc — 68% vũ trụ là thứ chúng ta không biết gì",
// //             tags: ["vũ trụ học", "vật lý", "năng lượng tối"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 5,
// //         },
// //         {
// //             userId: uid(0),
// //             learningGoal:
// //                 "Hiểu nghịch lý Fermi — nếu có hàng tỷ hành tinh có thể có sự sống, tại sao chúng ta chưa gặp ai?",
// //             commonConfusion:
// //                 "Nhiều người nghĩ chưa tìm thấy người ngoài hành tinh vì vũ trụ quá lớn và chúng ta chưa tìm đủ. Nhưng nghịch lý Fermi chỉ ra vấn đề sâu hơn: theo tính toán, chúng ta ĐÃ nên thấy bằng chứng rồi.",
// //             coreExplanation:
// //                 "Enrico Fermi (1950) hỏi đơn giản: 'Mọi người đang ở đâu?' Dải Ngân hà có 200-400 tỷ ngôi sao, nhiều hành tinh có thể có nước lỏng, vũ trụ 13.8 tỷ tuổi — đủ thời gian cho một nền văn minh tiên tiến hàng tỷ năm thuộc địa hóa toàn dải ngân hà. Các lý giải chính: (1) Bức tường lọc vĩ đại (Great Filter) — có rào cản tiến hóa cực kỳ khó vượt qua, hoặc phía trước chúng ta, (2) Nền văn minh tự hủy diệt trước khi đủ tiến bộ, (3) Họ đang ẩn náu, (4) Khái niệm 'giao tiếp' của họ khác hoàn toàn.",
// //             understandingCheck:
// //                 "Nếu chúng ta phát hiện dấu vết vi khuẩn trên sao Hỏa, điều đó là tin tốt hay tin xấu cho nhân loại theo logic nghịch lý Fermi? Tại sao?",
// //             summary:
// //                 "Nghịch lý Fermi — nếu người ngoài hành tinh tồn tại, tại sao im lặng tuyệt đối?",
// //             tags: ["vũ trụ học", "ngoài hành tinh", "thiên văn học"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 5,
// //         },

// //         // ─── THÊM CÁC CHỦ ĐỀ ĐA DẠNG ────────────────────────────────────────────
// //         {
// //             userId: uid(1),
// //             learningGoal:
// //                 "Hiểu tại sao âm nhạc gây ra cảm xúc mạnh và dopamine phóng thích như ma túy.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ âm nhạc chỉ là 'tiếng ồn có cấu trúc' và phản ứng cảm xúc là thuần túy chủ quan, văn hóa. Nhưng khoa học thần kinh cho thấy có cơ chế sinh học phổ quát.",
// //             coreExplanation:
// //                 "Khi nghe đoạn nhạc yêu thích gây 'chills' (cảm giác lạnh dọc sống lưng), não phóng thích dopamine — cùng cơ chế với thức ăn ngon và quan hệ tình dục. Vùng nucleus accumbens (trung tâm khoái cảm) kích hoạt. Đặc biệt hơn, não khoái cảm nhất ở giây phút ngay TRƯỚC đỉnh âm nhạc — kỳ vọng và xây dựng căng thẳng là phần quan trọng hơn chính đỉnh đó. Đó là tại sao nhạc bất ngờ phá vỡ kỳ vọng (như jazz hay progressive rock) thường gây cảm xúc mạnh nhất ở người nghe có kinh nghiệm.",
// //             understandingCheck:
// //                 "Nếu bạn nghe một bài hát quá nhiều lần và nó không còn gây 'chills' nữa, điều đó giải thích gì về cơ chế khoái cảm của não?",
// //             summary:
// //                 "Âm nhạc và dopamine — tại sao nhạc tác động não giống như ma túy",
// //             tags: ["âm nhạc", "khoa học thần kinh", "cảm xúc"],
// //             difficultyLevel: DifficultyLevel.BEGINNER,
// //             readingTime: 4,
// //         },
// //         {
// //             userId: uid(2),
// //             learningGoal:
// //                 "Hiểu tại sao ngôn ngữ cơ thể chiếm hơn 50% giao tiếp và cách đọc nó chính xác.",
// //             commonConfusion:
// //                 "Nhiều người nghe quy tắc '7-38-55%' của Mehrabian (7% lời nói, 38% giọng điệu, 55% ngôn ngữ cơ thể) và nghĩ có thể 'bỏ qua' lời nói. Nhưng Mehrabian chưa bao giờ nói vậy — nghiên cứu của ông chỉ áp dụng cho biểu đạt cảm xúc, không phải mọi giao tiếp.",
// //             coreExplanation:
// //                 "Ngôn ngữ cơ thể quan trọng nhưng không thể tách rời ngữ cảnh. Khoanh tay có thể nghĩa là phòng thủ, hoặc chỉ đơn giản là lạnh. Đọc ngôn ngữ cơ thể chính xác đòi hỏi: (1) quan sát chùm dấu hiệu, không phải từng cử chỉ đơn lẻ, (2) biết baseline của người đó (hành vi bình thường của họ là gì), (3) xem xét ngữ cảnh môi trường. Dấu hiệu đáng tin cậy nhất là vi biểu cảm (microexpressions) — kéo dài 1/25 giây trước khi người ta kịp kiểm soát.",
// //             understandingCheck:
// //                 "Tại sao thám tử hay nhà đàm phán giỏi không kết luận từ một cử chỉ đơn lẻ mà cần quan sát 'chùm' (cluster) tín hiệu?",
// //             summary:
// //                 "Ngôn ngữ cơ thể — cách đọc đúng và những hiểu lầm phổ biến nhất",
// //             tags: ["giao tiếp", "tâm lý học", "kỹ năng mềm"],
// //             difficultyLevel: DifficultyLevel.BEGINNER,
// //             readingTime: 4,
// //         },
// //         {
// //             userId: uid(3),
// //             learningGoal:
// //                 "Hiểu tại sao thiền định thay đổi cấu trúc não về mặt vật lý, không chỉ là thư giãn.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ thiền định chỉ là 'ngồi yên nghĩ về không có gì' hoặc là thực hành tôn giáo không có cơ sở khoa học. Nghiên cứu hình ảnh não học đã thay đổi hoàn toàn nhận thức này.",
// //             coreExplanation:
// //                 "Nhà khoa học thần kinh Sara Lazar (Harvard) phát hiện người thiền định lâu dài có vỏ não trước trán dày hơn — vùng liên quan đến chú ý và ra quyết định. Chỉ sau 8 tuần chương trình MBSR (Mindfulness-Based Stress Reduction), hạch hạnh nhân (amygdala) — trung tâm phản ứng sợ hãi — nhỏ lại về mặt vật lý và phản ứng yếu hơn với stress. Thể tích hippocampus (ký ức và học tập) tăng. Đây là bằng chứng rõ ràng về tính neuroplasticity — não có thể thay đổi cấu trúc theo kinh nghiệm.",
// //             understandingCheck:
// //                 "Nếu thiền định thực sự co nhỏ amygdala, điều đó có nghĩa gì cho người bị lo âu hay PTSD?",
// //             summary:
// //                 "Thiền định và neuroplasticity — thay đổi cấu trúc não sau 8 tuần",
// //             tags: ["thiền định", "khoa học thần kinh", "sức khỏe tâm thần"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 4,
// //         },
// //         {
// //             userId: uid(0),
// //             learningGoal:
// //                 "Hiểu tại sao hiệu ứng cánh bướm không có nghĩa là một con bướm thực sự gây bão.",
// //             commonConfusion:
// //                 "Hầu hết mọi người hiểu cánh bướm theo nghĩa đen: con bướm vỗ cánh ở Brazil gây bão ở Texas. Thực ra đây là ẩn dụ cho tính nhạy cảm với điều kiện ban đầu trong hệ thống hỗn loạn.",
// //             coreExplanation:
// //                 "Edward Lorenz (1963) phát hiện khi chạy mô phỏng thời tiết hai lần với số liệu ban đầu chỉ khác nhau 0.000127, kết quả sau vài tuần khác hoàn toàn. Đây không phải ngẫu nhiên — mà là đặc tính của hệ thống phi tuyến: sai số nhỏ tăng theo hàm mũ. Điều này có nghĩa dự báo thời tiết dài hạn (>2 tuần) về cơ bản là bất khả thi, không phải vì thiếu dữ liệu hay máy tính không đủ mạnh, mà vì bản chất của hệ thống. Nhiều hệ thống kinh tế, xã hội và sinh thái có tính chất tương tự.",
// //             understandingCheck:
// //                 "Nếu hệ thống hỗn loạn không thể dự báo dài hạn, điều này có nghĩa gì cho các mô hình kinh tế dự báo 10-20 năm?",
// //             summary:
// //                 "Hiệu ứng cánh bướm và lý thuyết hỗn loạn — tại sao dự báo dài hạn là bất khả thi",
// //             tags: ["toán học", "lý thuyết hỗn loạn", "dự báo"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 4,
// //         },
// //         {
// //             userId: uid(1),
// //             learningGoal:
// //                 "Hiểu tại sao nước sôi ở 100°C ở mực nước biển nhưng chỉ 90°C trên đỉnh núi cao.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ nhiệt độ sôi là tính chất cố định của nước. Thực ra điểm sôi phụ thuộc vào áp suất khí quyển — và điều này có hậu quả thực tế quan trọng khi nấu ăn ở nơi cao.",
// //             coreExplanation:
// //                 "Nước sôi khi áp suất hơi của nó bằng áp suất khí quyển bên ngoài. Trên đỉnh núi cao (Everest ~8850m), áp suất khí quyển chỉ bằng 1/3 mực nước biển — nước sôi ở ~70°C. Điều này không đủ nhiệt để nấu chín thức ăn đúng cách: trứng luộc ở Everest sẽ vẫn còn sống vì protein cần nhiệt độ cao hơn để biến chất. Đó là lý do nồi áp suất (tăng áp suất → tăng điểm sôi → nấu nhanh hơn) và máy bay phải hạ áp trong khoang để phi hành đoàn pha cà phê ngon.",
// //             understandingCheck:
// //                 "Một nồi áp suất tăng điểm sôi của nước lên 120°C. Điều đó có nghĩa gì cho thời gian nấu ăn so với nồi thường?",
// //             summary: "Điểm sôi và áp suất — tại sao nước sôi sớm hơn trên núi cao",
// //             tags: ["vật lý", "hóa học", "đời sống"],
// //             difficultyLevel: DifficultyLevel.BEGINNER,
// //             readingTime: 3,
// //         },
// //         {
// //             userId: uid(2),
// //             learningGoal:
// //                 "Hiểu tại sao đọc sách giấy và sách điện tử có sự khác biệt trong việc ghi nhớ.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ nội dung là quan trọng, còn phương tiện đọc (giấy hay màn hình) không ảnh hưởng đến hiểu và ghi nhớ. Nghiên cứu nhận thức cho thấy điều ngược lại.",
// //             coreExplanation:
// //                 "Anne Mangen (Đại học Stavanger) nghiên cứu cho thấy người đọc sách giấy nhớ trình tự sự kiện và chi tiết tốt hơn đáng kể so với đọc trên màn hình. Lý do: (1) sách giấy cung cấp 'địa điểm không gian' — bạn biết thông tin đó ở góc trái trang 120, giúp hồi phục ký ức dễ hơn, (2) màn hình khuyến khích đọc lướt kiểu F-pattern, (3) cảm giác xúc giác và mùi giấy kích hoạt nhiều giác quan hơn, củng cố mã hóa ký ức. Tuy nhiên, sách điện tử có lợi thế cho việc tìm kiếm, tra cứu và mang theo nhiều cuốn.",
// //             understandingCheck:
// //                 "Nếu bạn đang học cho kỳ thi quan trọng và muốn ghi nhớ tốt nhất, bạn nên chọn định dạng sách nào và tại sao?",
// //             summary:
// //                 "Sách giấy vs sách điện tử — khoa học thần kinh của việc ghi nhớ khi đọc",
// //             tags: ["khoa học thần kinh", "học tập", "đọc sách"],
// //             difficultyLevel: DifficultyLevel.BEGINNER,
// //             readingTime: 4,
// //         },
// //         {
// //             userId: uid(3),
// //             learningGoal:
// //                 "Hiểu tại sao kim cương — dù cứng nhất thế giới — có thể bị đập vỡ bằng búa.",
// //             commonConfusion:
// //                 "Nhiều người nhầm lẫn giữa 'cứng' (hardness) và 'bền' (toughness). Kim cương cứng nhất thế giới (10/10 thang Mohs) nhưng lại khá giòn — tức là dễ vỡ khi bị va đập mạnh theo đúng hướng.",
// //             coreExplanation:
// //                 "Độ cứng là khả năng chống trầy xước (kim cương không thể bị trầy bởi bất kỳ vật liệu nào khác). Độ bền là khả năng chống biến dạng hay vỡ dưới lực tác động. Kim cương có cấu trúc tinh thể với các mặt phân cắt (cleavage planes) — nếu đập đúng góc 45° với mặt phân cắt sẽ tách đôi hoàn hảo. Đây chính là kỹ thuật thợ kim hoàn dùng khi cắt kim cương thô. Vật liệu bền nhất không phải cứng nhất: thép, gốm zirconia hay một số polyme có thể bền hơn kim cương nhiều.",
// //             understandingCheck:
// //                 "Nhận lồng sắt trong rào chắn xe hơi mềm và biến dạng thay vì vỡ khi va chạm. Điều đó thể hiện tính bền (toughness) hay cứng (hardness)? Tại sao điều này an toàn hơn?",
// //             summary:
// //                 "Kim cương cứng nhất nhưng không bền nhất — hardness vs toughness",
// //             tags: ["hóa học", "vật liệu học", "khoa học"],
// //             difficultyLevel: DifficultyLevel.BEGINNER,
// //             readingTime: 3,
// //         },
// //         {
// //             userId: uid(0),
// //             learningGoal:
// //                 "Hiểu tại sao con người là loài động vật duy nhất tự lừa dối bản thân một cách có hệ thống.",
// //             commonConfusion:
// //                 "Hầu hết mọi người nghĩ tự lừa dối là điểm yếu tâm lý cần loại bỏ. Nhưng từ góc độ tiến hóa, một mức độ tự lừa dối nhất định có thể là lợi thế sinh tồn.",
// //             coreExplanation:
// //                 "Robert Trivers (nhà sinh vật tiến hóa) đề xuất: tự lừa dối bản thân giúp chúng ta lừa người khác tốt hơn — vì chúng ta tin vào lời nói của mình thật sự, tín hiệu phi ngôn ngữ nhất quán hơn. Nghiên cứu cho thấy người có chút 'optimism bias' (đánh giá cao khả năng tích cực của mình) thường kiên trì hơn, ít trầm cảm hơn và thậm chí sống lâu hơn. Nhưng cực đoan dẫn đến Dunning-Kruger, xung đột và quyết định tồi. Não có hai hệ thống: hệ thống nhận thức (biết sự thật) và hệ thống tự trình bày (tin vào câu chuyện có lợi hơn).",
// //             understandingCheck:
// //                 "Tại sao người có trầm cảm nhẹ thường ĐÁNH GIÁ CHÍNH XÁC HƠN khả năng của mình so với người bình thường khỏe mạnh? Điều này có vẻ mâu thuẫn không?",
// //             summary: "Tự lừa dối — lợi thế tiến hóa hay điểm yếu tâm lý?",
// //             tags: ["tâm lý học", "tiến hóa", "nhận thức"],
// //             difficultyLevel: DifficultyLevel.ADVANCED,
// //             readingTime: 5,
// //         },
// //         {
// //             userId: uid(1),
// //             learningGoal:
// //                 "Hiểu tại sao người Nhật sống lâu nhất thế giới và những yếu tố thực sự đằng sau.",
// //             commonConfusion:
// //                 "Nhiều người quy việc người Nhật sống lâu cho cá và trà xanh. Nhưng nghiên cứu về các vùng 'Blue Zone' (nơi người già nhất thế giới) cho thấy bức tranh phức tạp hơn nhiều.",
// //             coreExplanation:
// //                 "Okinawa (trước thập niên 1990) là Blue Zone nổi tiếng với tuổi thọ cao nhất. Các yếu tố thực sự bao gồm: (1) Ikigai — lý do sống, cảm giác mục đích, (2) Moai — nhóm bạn bè gắn kết suốt đời chia sẻ chi phí và hỗ trợ tinh thần, (3) Ăn đến 80% no (hara hachi bu), (4) Vận động nhẹ tự nhiên hàng ngày, không phải gym. Đáng chú ý: khi người Okinawa di cư sang Mỹ và áp dụng lối sống Mỹ, tuổi thọ của họ giảm về mức trung bình Mỹ trong một thế hệ — cho thấy gene không phải yếu tố chính.",
// //             understandingCheck:
// //                 "Nếu lối sống quan trọng hơn gene trong tuổi thọ, điều đó có ý nghĩa gì cho cách chúng ta thiết kế đô thị, chính sách y tế và văn hóa công sở?",
// //             summary: "Bí quyết sống lâu của người Nhật — không phải cá hay trà xanh",
// //             tags: ["sức khỏe", "lối sống", "tuổi thọ"],
// //             difficultyLevel: DifficultyLevel.BEGINNER,
// //             readingTime: 4,
// //         },
// //         {
// //             userId: uid(2),
// //             learningGoal:
// //                 "Hiểu tại sao mọi bản đồ thế giới đều sai và không thể tồn tại bản đồ đúng.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ bản đồ Mercator (bản đồ phổ biến nhất) là đại diện chính xác của Trái Đất. Thực ra bản đồ 2D của hình cầu 3D về mặt toán học là bất khả thi mà không làm méo mó gì đó.",
// //             coreExplanation:
// //                 "Khi 'mở phẳng' quả cầu, bạn buộc phải chọn: giữ chính xác diện tích (equal-area), hoặc hình dạng (conformal), hoặc khoảng cách, nhưng không thể đồng thời cả ba. Mercator giữ nguyên hình dạng và góc (tốt cho hàng hải) nhưng méo diện tích cực kỳ: Greenland trông to bằng châu Phi, thực tế nhỏ hơn 14 lần. Châu Phi thực sự lớn hơn Mỹ, Trung Quốc, Ấn Độ và châu Âu cộng lại. Bản đồ Peters giữ đúng diện tích nhưng méo hình dạng. Không bản đồ nào 'đúng' — chỉ là đánh đổi khác nhau.",
// //             understandingCheck:
// //                 "Tại sao các nhà hàng hải thế kỷ 15-17 vẫn dùng bản đồ Mercator dù nó méo diện tích? Với mục đích của họ, đây có phải là lựa chọn tốt không?",
// //             summary: "Mọi bản đồ thế giới đều sai — định lý toán học không thể tránh",
// //             tags: ["địa lý", "toán học", "hình học"],
// //             difficultyLevel: DifficultyLevel.BEGINNER,
// //             readingTime: 4,
// //         },
// //         {
// //             userId: uid(3),
// //             learningGoal:
// //                 "Hiểu tại sao đa nhiệm (multitasking) không tồn tại và làm giảm hiệu suất đến 40%.",
// //             commonConfusion:
// //                 "Hầu hết mọi người tin mình có thể đa nhiệm tốt và tự hào về khả năng này. Khoa học thần kinh cho thấy não người không thực sự làm hai việc nhận thức cùng lúc — chỉ chuyển đổi nhanh giữa chúng.",
// //             coreExplanation:
// //                 "Earl Miller (MIT) nghiên cứu cho thấy khi 'đa nhiệm', não thực ra thực hiện task-switching — chuyển đổi nhanh giữa các nhiệm vụ, không phải song song. Mỗi lần chuyển đổi có 'chi phí': thời gian tái định hướng và lỗi tăng. Nghiên cứu cho thấy năng suất giảm tới 40% và tỷ lệ lỗi tăng 50% khi đa nhiệm so với làm tuần tự. Ngoài ra, người tự nhận 'đa nhiệm giỏi' thường tệ hơn người khác trong mọi bài kiểm tra đa nhiệm — vì họ ít tự kiểm soát hơn.",
// //             understandingCheck:
// //                 "Nếu đa nhiệm giảm hiệu suất, tại sao các cuộc họp vẫn thường cho phép người tham dự dùng laptop? Điều gì thực sự xảy ra với chú ý của họ?",
// //             summary: "Đa nhiệm là ảo tưởng — não bạn chỉ đang chuyển kênh rất nhanh",
// //             tags: ["khoa học thần kinh", "năng suất", "tâm lý học"],
// //             difficultyLevel: DifficultyLevel.BEGINNER,
// //             readingTime: 3,
// //         },
// //         {
// //             userId: uid(0),
// //             learningGoal:
// //                 "Hiểu tại sao blockchain có giá trị và khi nào thì không cần dùng blockchain.",
// //             commonConfusion:
// //                 "Có hai nhóm: nhóm nghĩ blockchain là 'giải pháp cho mọi vấn đề', nhóm kia nghĩ là 'scam hoàn toàn'. Cả hai đều sai — blockchain là cấu trúc dữ liệu với trade-off rất cụ thể.",
// //             coreExplanation:
// //                 "Blockchain có giá trị khi: (1) nhiều bên không tin nhau cần chia sẻ dữ liệu, (2) không có bên trung gian đáng tin, (3) tính bất biến lịch sử giao dịch quan trọng. Ví dụ tốt: chuyển tiền xuyên biên giới không qua ngân hàng, chuỗi cung ứng xác minh nguồn gốc thực phẩm. Blockchain không cần thiết khi: đã có bên trung gian tin cậy, dữ liệu cần sửa đổi linh hoạt, hiệu suất quan trọng (blockchain cực kỳ chậm). 99% 'ứng dụng blockchain' của doanh nghiệp thực ra chỉ là database thông thường được marketing tốt hơn.",
// //             understandingCheck:
// //                 "Một bệnh viện muốn dùng blockchain để lưu hồ sơ bệnh nhân. Đây có phải là use case tốt không? Hãy phân tích dựa trên các tiêu chí trên.",
// //             summary: "Blockchain — khi nào thực sự cần và khi nào chỉ là buzzword",
// //             tags: ["công nghệ", "blockchain", "tư duy phản biện"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 5,
// //         },
// //         {
// //             userId: uid(1),
// //             learningGoal:
// //                 "Hiểu tại sao ngủ mơ (REM) quan trọng và điều gì xảy ra khi bị thiếu giai đoạn này.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ giấc mơ là ngẫu nhiên và vô nghĩa, hoặc là thông điệp bí ẩn như Freud từng cho. Khoa học thần kinh hiện đại cho thấy giấc mơ có chức năng sinh học cụ thể.",
// //             coreExplanation:
// //                 "Matthew Walker và các nhà khoa học thần kinh xác định REM sleep có ba chức năng chính: (1) xử lý và lưu trữ ký ức cảm xúc — 'cắt phần thô cảm xúc' khỏi ký ức để bạn nhớ sự kiện nhưng giảm đau, (2) kết nối ký ức xuyên ngữ cảnh — não 'thử' các kết hợp ngẫu nhiên, thỉnh thoảng tạo ra insight sáng tạo, (3) mô phỏng xã hội an toàn. Người bị thiếu REM (do rượu, thuốc ngủ hay thiếu ngủ) thường trở nên kém kiểm soát cảm xúc và mất khả năng đọc tín hiệu xã hội từ người khác.",
// //             understandingCheck:
// //                 "Tại sao rượu — dù giúp ngủ nhanh hơn — lại khiến chất lượng giấc ngủ tệ hơn về mặt chức năng não?",
// //             summary: "Giấc mơ REM — não đang 'sơ cứu' cảm xúc và tạo ra sáng tạo",
// //             tags: ["giấc ngủ", "khoa học thần kinh", "cảm xúc"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 4,
// //         },
// //         {
// //             userId: uid(2),
// //             learningGoal:
// //                 "Hiểu tại sao các thứ ngôn ngữ lập trình khác nhau tồn tại và không có ngôn ngữ 'tốt nhất'.",
// //             commonConfusion:
// //                 "Developer mới thường hỏi 'nên học ngôn ngữ nào tốt nhất' và tranh luận Python vs JavaScript vs Java. Câu trả lời đúng là: không có ngôn ngữ tốt nhất, chỉ có ngôn ngữ phù hợp nhất cho bài toán.",
// //             coreExplanation:
// //                 "Mỗi ngôn ngữ sinh ra để giải quyết vấn đề cụ thể: C cho hệ thống nhúng cần kiểm soát bộ nhớ tuyệt đối, Python cho data science vì syntax rõ ràng và thư viện phong phú, JavaScript bắt buộc cho web browser vì lịch sử, Rust cho an toàn bộ nhớ không cần GC, SQL cho truy vấn dữ liệu quan hệ. Trade-off thường là: tốc độ thực thi vs tốc độ phát triển, kiểm soát vs an toàn, linh hoạt vs cấu trúc. Lập trình viên giỏi chọn công cụ theo bài toán, không phải trung thành mù quáng với một ngôn ngữ.",
// //             understandingCheck:
// //                 "Bạn được giao xây dựng hệ thống điều khiển cho robot phẫu thuật (yêu cầu an toàn tuyệt đối và tốc độ thực thi) vs một chatbot prototype nhanh. Ngôn ngữ nào phù hợp cho mỗi trường hợp?",
// //             summary:
// //                 "Tại sao có nhiều ngôn ngữ lập trình — không có ngôn ngữ tốt nhất, chỉ có phù hợp nhất",
// //             tags: ["lập trình", "ngôn ngữ lập trình", "tư duy kỹ thuật"],
// //             difficultyLevel: DifficultyLevel.BEGINNER,
// //             readingTime: 4,
// //         },
// //         {
// //             userId: uid(3),
// //             learningGoal:
// //                 "Hiểu tại sao thống kê có thể chứng minh bất cứ điều gì và cách đọc số liệu một cách phê phán.",
// //             commonConfusion:
// //                 "Nhiều người tin số liệu thống kê là 'sự thật khách quan' và không thể bị bóp méo như lời nói. Thực ra có nhiều cách hoàn toàn hợp lệ về mặt toán học để trình bày cùng một dữ liệu và đưa đến kết luận trái ngược.",
// //             coreExplanation:
// //                 "Các kỹ thuật phổ biến: (1) Chọn baseline thích hợp — tỷ lệ tội phạm tăng 100% nghe khủng khiếp, nhưng nếu từ 1 đến 2 vụ/năm thì không đáng lo, (2) Nhầm tương quan với nhân quả, (3) Dùng trung bình thay vì trung vị khi phân phối lệch — thu nhập trung bình tăng không có nghĩa người nghèo khá hơn, (4) P-hacking — thử nhiều biến cho đến khi tìm được p < 0.05. Darrell Huff trong 'How to Lie with Statistics' (1954) đã mô tả tất cả những kỹ thuật này — và chúng vẫn còn được dùng phổ biến đến nay.",
// //             understandingCheck:
// //                 "Một quảng cáo nói 'dùng kem X, 90% người dùng thấy da sáng hơn sau 2 tuần'. Bạn cần hỏi những câu gì để đánh giá độ tin cậy của con số này?",
// //             summary:
// //                 "Thống kê có thể chứng minh bất cứ điều gì — cách đọc số liệu không bị lừa",
// //             tags: ["thống kê", "tư duy phản biện", "truyền thông"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 5,
// //         },
// //         {
// //             userId: uid(0),
// //             learningGoal:
// //                 "Hiểu tại sao trí tuệ nhân tạo hiện đại giỏi một số việc vượt người nhưng thất bại hoàn toàn ở những việc trẻ 3 tuổi làm được.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ AI mạnh hơn người thì 'thông minh hơn' theo nghĩa chung. Thực ra AI hiện nay (LLM, vision models) có điểm mạnh và điểm yếu rất phi đối xứng so với trí tuệ người.",
// //             coreExplanation:
// //                 "AI hiện nay xuất sắc ở: nhận dạng pattern trong dữ liệu lớn, nhớ và tổng hợp thông tin, tính toán và cờ vua. Nhưng thất bại ở: common sense về vật lý ('cái gì xảy ra nếu tôi kéo cái này?'), nhân quả thực sự vs tương quan, học từ vài ví dụ (few-shot thực sự), và embodied cognition — hiểu thế giới qua cơ thể. Một đứa trẻ 3 tuổi biết không nên đặt tay vào lửa sau một lần học, biết cốc nước sẽ đổ nếu nghiêng — không cần hàng triệu ví dụ. AI cần hàng tỷ token để 'học' nhưng vẫn có thể fail ở tình huống mới hoàn toàn.",
// //             understandingCheck:
// //                 "Nếu AI được đào tạo trên toàn bộ văn bản internet nhưng vẫn không hiểu physical causality tốt như trẻ 3 tuổi, điều đó nói gì về bản chất của trí tuệ?",
// //             summary:
// //                 "AI vượt người ở đâu và thua trẻ 3 tuổi ở đâu — bản chất phi đối xứng của trí tuệ nhân tạo",
// //             tags: ["AI", "trí tuệ nhân tạo", "khoa học nhận thức"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 5,
// //         },
// //         {
// //             userId: uid(1),
// //             learningGoal:
// //                 "Hiểu tại sao thói quen hình thành và tại sao ý chí một mình không đủ để thay đổi chúng.",
// //             commonConfusion:
// //                 "Hầu hết mọi người nghĩ thay đổi thói quen là vấn đề quyết tâm và ý chí. Khi thất bại, họ tự trách mình 'yếu đuối'. Nhưng khoa học thần kinh cho thấy thói quen được mã hóa ở cấp độ não sâu hơn ý thức.",
// //             coreExplanation:
// //                 "Thói quen hoạt động theo vòng lặp: Cue (gợi ý) → Routine (hành vi) → Reward (phần thưởng). Sau khi lặp lại đủ lần, hành vi được tự động hóa vào basal ganglia — vùng não cổ đại không bị kiểm soát bởi vỏ não trước trán (ý chí). Charles Duhigg trong 'The Power of Habit' giải thích: bạn không thể xóa thói quen, chỉ có thể thay thế routine giữ nguyên cue và reward. Smoker thèm thuốc vì cue (stress) → họ cần routine khác (đi bộ, nhai kẹo) cùng tạo ra reward tương tự (giảm stress).",
// //             understandingCheck:
// //                 "Bạn muốn bỏ thói quen check điện thoại ngay khi thức dậy. Dựa trên mô hình Cue-Routine-Reward, bạn sẽ thay đổi gì và giữ nguyên gì?",
// //             summary:
// //                 "Vòng lặp thói quen — tại sao ý chí không đủ và cách thay đổi đúng cách",
// //             tags: ["tâm lý học", "thói quen", "hành vi"],
// //             difficultyLevel: DifficultyLevel.BEGINNER,
// //             readingTime: 4,
// //         },
// //         {
// //             userId: uid(2),
// //             learningGoal:
// //                 "Hiểu tại sao các nền văn minh sụp đổ và bài học chung giữa Maya, Easter Island và La Mã.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ nền văn minh sụp đổ vì bị tấn công hay thiên tai đột ngột. Nghiên cứu của Jared Diamond và các nhà khảo cổ học cho thấy pattern phổ biến hơn là tự hủy hoại môi trường từ từ.",
// //             coreExplanation:
// //                 "Jared Diamond trong 'Collapse' xác định 5 yếu tố: phá hủy môi trường, biến đổi khí hậu, mất quan hệ thương mại, thù địch từ bên ngoài, và — quan trọng nhất — phản ứng của xã hội với vấn đề. Easter Island: chặt hết cây cọ để làm tượng Moai, mất nguồn gỗ đóng tàu đánh cá, sụp đổ nguồn thực phẩm. Maya: hạn hán kéo dài kết hợp với chiến tranh nội bộ tranh tài nguyên. Điểm chung: tầng lớp tinh hoa tiếp tục hưởng lợi trong khi hệ thống tổng thể suy yếu, nên không có động lực thay đổi cho đến khi quá muộn.",
// //             understandingCheck:
// //                 "Áp dụng mô hình của Diamond vào biến đổi khí hậu hiện đại: những điểm tương đồng và khác biệt nào bạn thấy với các nền văn minh đã sụp đổ?",
// //             summary:
// //                 "Tại sao nền văn minh sụp đổ — pattern chung từ Maya đến Easter Island",
// //             tags: ["lịch sử", "môi trường", "xã hội học"],
// //             difficultyLevel: DifficultyLevel.ADVANCED,
// //             readingTime: 6,
// //         },
// //         {
// //             userId: uid(3),
// //             learningGoal:
// //                 "Hiểu tại sao đồng hồ trên GPS phải điều chỉnh theo thuyết tương đối, không phải chỉ là vấn đề kỹ thuật.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ thuyết tương đối Einstein chỉ liên quan đến vật lý lý thuyết và hố đen — không ảnh hưởng đến công nghệ hàng ngày. Nhưng GPS của điện thoại bạn hoạt động dựa trực tiếp vào hai hiệu chỉnh tương đối tính mỗi ngày.",
// //             coreExplanation:
// //                 "Vệ tinh GPS bay ở độ cao 20.200 km với tốc độ ~14.000 km/h. Hai hiệu ứng tương đối tính xảy ra: (1) Tương đối tính đặc biệt (Special Relativity): tốc độ cao làm đồng hồ vệ tinh chạy chậm hơn 7 micro-giây/ngày so với mặt đất, (2) Tương đối tính tổng quát (General Relativity): trọng lực yếu hơn ở độ cao làm đồng hồ chạy nhanh hơn 45 micro-giây/ngày. Tổng cộng vệ tinh GPS phải được lập trình để 'chạy sai' 38 micro-giây/ngày. Nếu không hiệu chỉnh, sau một ngày GPS sai lệch ~11 km — điện thoại dẫn đường bạn vào ruộng thay vì đường.",
// //             understandingCheck:
// //                 "Nếu thuyết tương đối Einstein sai, GPS của điện thoại sẽ bắt đầu sai lệch ngay từ ngày đầu tiên. Điều này có nghĩa gì cho việc kiểm chứng lý thuyết khoa học?",
// //             summary:
// //                 "GPS và thuyết tương đối — Einstein đúng hay điện thoại bạn không hoạt động",
// //             tags: ["vật lý", "thuyết tương đối", "công nghệ"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 5,
// //         },
// //         {
// //             userId: uid(0),
// //             learningGoal:
// //                 "Hiểu tại sao kháng thuốc kháng sinh là mối đe dọa y tế nghiêm trọng hơn hầu hết dịch bệnh.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ kháng thuốc xảy ra vì cơ thể 'quen thuốc'. Thực ra không phải cơ thể người kháng thuốc — mà là vi khuẩn tiến hóa để kháng thuốc theo cơ chế chọn lọc tự nhiên Darwin.",
// //             coreExplanation:
// //                 "Khi dùng kháng sinh: 99.9% vi khuẩn chết, nhưng 0.1% có đột biến ngẫu nhiên cho phép sống sót. Chúng sinh sản nhanh (E.coli nhân đôi mỗi 20 phút) và truyền gene kháng thuốc — kể cả cho vi khuẩn khác loài qua horizontal gene transfer. Uống kháng sinh không đủ liệu trình là nguy hiểm nhất: vi khuẩn yếu nhất chết trước, vi khuẩn kháng thuốc nhất sống sót và sinh sôi. WHO cảnh báo năm 2050 kháng kháng sinh có thể giết 10 triệu người/năm — vượt cả ung thư. Mổ đơn giản, sinh con hay hóa trị sẽ trở thành rủi ro tử vong.",
// //             understandingCheck:
// //                 "Tại sao việc dùng kháng sinh cho chăn nuôi (để tăng cân nhanh, không phải chữa bệnh) lại là vấn đề toàn cầu chứ không chỉ là vấn đề của ngành nông nghiệp?",
// //             summary:
// //                 "Kháng kháng sinh — mối đe dọa đang thầm lặng xóa bỏ thành tựu y học 100 năm",
// //             tags: ["y học", "vi khuẩn", "sức khỏe cộng đồng"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 5,
// //         },
// //         {
// //             userId: uid(1),
// //             learningGoal:
// //                 "Hiểu tại sao vàng được chọn làm tiền tệ trong lịch sử — và tại sao chúng ta bỏ bản vị vàng.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ vàng có giá trị vì đẹp hoặc hiếm. Thực ra các nhà kinh tế đã phân tích chặt chẽ tại sao vàng (và bạc) được chọn là tiền tệ phổ quát trong hàng nghìn năm.",
// //             coreExplanation:
// //                 "Vàng có đặc tính lý tưởng cho tiền tệ: không gỉ sét hay phân hủy, có thể chia nhỏ, khan hiếm đủ để có giá trị nhưng không quá hiếm, và — quan trọng nhất — không thể tổng hợp nhân tạo (trước alchemy thất bại). Nhưng bản vị vàng có giới hạn nghiêm trọng: cung tiền bị ràng buộc bởi khai thác vàng vật lý, không thể điều chỉnh theo kinh tế. Đại Khủng hoảng 1929-33 tệ hơn nhiều vì các nước không thể in thêm tiền kích thích kinh tế. Nixon bỏ bản vị vàng năm 1971 để linh hoạt hơn — nhưng điều đó nghĩa là tiền tệ hiện đại chỉ có giá trị vì niềm tin vào chính phủ.",
// //             understandingCheck:
// //                 "Nếu tiền tệ hiện đại chỉ có giá trị vì niềm tin, điều gì xảy ra với đồng tiền của một nước khi niềm tin vào chính phủ sụp đổ? Bạn có thể nêu ví dụ lịch sử không?",
// //             summary:
// //                 "Tại sao vàng là tiền — và tại sao chúng ta bỏ bản vị vàng năm 1971",
// //             tags: ["kinh tế", "lịch sử", "tiền tệ"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 5,
// //         },
// //         {
// //             userId: uid(2),
// //             learningGoal:
// //                 "Hiểu tại sao màu sắc không tồn tại trong thế giới vật lý — chỉ tồn tại trong não bạn.",
// //             commonConfusion:
// //                 "Hầu hết mọi người nghĩ màu sắc là thuộc tính của vật thể — quả cà chua 'là' màu đỏ. Thực ra màu sắc là trải nghiệm chủ quan mà não tạo ra, không phải thuộc tính vật lý tồn tại bên ngoài não.",
// //             coreExplanation:
// //                 "Thế giới vật lý chỉ có sóng điện từ với các bước sóng khác nhau. Mắt người có 3 loại tế bào nón (cone) nhạy cảm với bước sóng khác nhau — não diễn giải tín hiệu từ ba loại cone thành 'màu sắc'. Người bị mù màu không nhìn thế giới 'sai' — họ có loại cone khác nhau, não diễn giải khác. Tôm hùm bọ ngựa có 16 loại cone — 'thấy' màu sắc chúng ta không thể tưởng tượng. Hiện tượng 'The Dress' (2015: váy xanh-đen hay trắng-vàng?) cho thấy cùng thông tin ánh sáng, não khác nhau tạo ra màu sắc khác nhau.",
// //             understandingCheck:
// //                 "Nếu màu sắc chỉ tồn tại trong não, điều đó có nghĩa gì cho câu hỏi 'màu đỏ tôi thấy có giống màu đỏ bạn thấy không'? Đây có phải câu hỏi có thể trả lời được không?",
// //             summary:
// //                 "Màu sắc không tồn tại trong thế giới thực — chúng là sáng tạo của não bạn",
// //             tags: ["thần kinh học", "triết học", "nhận thức"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 4,
// //         },
// //         {
// //             userId: uid(3),
// //             learningGoal:
// //                 "Hiểu tại sao thiếu vitamin D phổ biến ngay cả ở nơi nhiều nắng và hậu quả ẩn của nó.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ vitamin D thiếu hụt chỉ ở nước lạnh ít nắng. Nhưng nghiên cứu cho thấy người ở Việt Nam, Ấn Độ và vùng nhiệt đới vẫn thường xuyên thiếu vitamin D — vì tránh nắng.",
// //             coreExplanation:
// //                 "Da tổng hợp vitamin D khi tiếp xúc tia UVB — nhưng kính xe, kem chống nắng SPF 30+, quần áo che kín và thói quen ở trong nhà chặn hoàn toàn UVB. Việt Nam, với văn hóa tránh nắng để da trắng, có tỷ lệ thiếu vitamin D rất cao. Hậu quả không chỉ là xương: vitamin D là hormone ảnh hưởng đến 2000+ gene, liên quan đến hệ miễn dịch (nguy cơ nhiễm trùng, tự miễn), tâm trạng (thiếu D liên quan đến trầm cảm mùa đông), và ung thư. Thực phẩm tự nhiên có rất ít vitamin D — chủ yếu phải từ nắng hoặc bổ sung.",
// //             understandingCheck:
// //                 "Nếu bạn làm việc trong văn phòng cả ngày và đi xe có kính chắn nắng, bạn có thể làm gì để đảm bảo đủ vitamin D mà không cần phơi nắng trực tiếp?",
// //             summary:
// //                 "Thiếu vitamin D ở vùng nhiệt đới — khi tránh nắng trở thành vấn đề sức khỏe",
// //             tags: ["sức khỏe", "dinh dưỡng", "vitamin D"],
// //             difficultyLevel: DifficultyLevel.BEGINNER,
// //             readingTime: 4,
// //         },
// //         {
// //             userId: uid(0),
// //             learningGoal:
// //                 "Hiểu cách mạng công nghiệp lần 4 khác gì với 3 cuộc cách mạng trước và tại sao nó đáng lo ngại hơn.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ cách mạng công nghiệp lần 4 (AI, robot) chỉ là phiên bản nhanh hơn của các cuộc cách mạng trước. Nhưng có một điểm khác biệt cơ bản: lần đầu tiên máy móc thay thế khả năng nhận thức, không chỉ thể chất.",
// //             coreExplanation:
// //                 "Ba cuộc cách mạng trước: (1) Hơi nước — thay thế sức mạnh cơ bắp, (2) Điện — sản xuất hàng loạt, (3) Máy tính — tự động hóa quy trình lặp lại. Mỗi lần, công việc mất đi được bù đắp bằng công việc mới đòi hỏi kỹ năng nhận thức cao hơn. Lần 4: AI thay thế cả phân tích, sáng tạo và ra quyết định — công việc 'an toàn' truyền thống như luật sư, kế toán, bác sĩ chẩn đoán bị ảnh hưởng. Câu hỏi: khi máy giỏi nhận thức như người, công việc mới nào sẽ xuất hiện? Lịch sử cho thấy sẽ có, nhưng quá trình chuyển đổi tốn hàng thập kỷ và gây đau đớn xã hội.",
// //             understandingCheck:
// //                 "Nếu AI thay thế 30% công việc trong 20 năm tới, hệ thống giáo dục hiện tại đang chuẩn bị gì cho điều đó? Cần thay đổi gì?",
// //             summary:
// //                 "Cách mạng công nghiệp lần 4 — lần đầu tiên máy móc thay thế trí tuệ",
// //             tags: ["công nghệ", "kinh tế", "tương lai"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 5,
// //         },
// //         {
// //             userId: uid(1),
// //             learningGoal:
// //                 "Hiểu tại sao không khí chúng ta thở chủ yếu là nitrogen chứ không phải oxygen.",
// //             commonConfusion:
// //                 "Vì oxygen quan trọng cho sự sống, nhiều người nghĩ không khí chủ yếu là oxygen. Thực ra không khí chứa 78% nitrogen và chỉ 21% oxygen — và điều đó có lý do quan trọng.",
// //             coreExplanation:
// //                 "Nitrogen (N₂) ổn định hóa học cực kỳ cao — khó phản ứng. Đây chính xác là điều cần thiết: oxygen 100% sẽ gây cháy nổ ở mọi nơi (Apollo 1 cháy trong capsule oxygen thuần túy, giết 3 phi hành gia). Nitrogen 'pha loãng' oxygen xuống mức an toàn cho sự sống nhưng không quá ít để hô hấp. Thú vị hơn: tỷ lệ oxygen trong khí quyển không phải luôn 21% — 300 triệu năm trước đạt 35%, cho phép côn trùng khổng lồ tồn tại (chuồn chuồn sải cánh 70cm). Nếu oxygen tăng lên 25%, hầu hết thực vật trên Trái Đất sẽ bốc cháy tự phát.",
// //             understandingCheck:
// //                 "Tại sao việc tăng nồng độ oxygen trong phòng phẫu thuật (để hỗ trợ hô hấp bệnh nhân) đi kèm với nguy cơ cháy nổ tăng cao và cần quy trình an toàn đặc biệt?",
// //             summary:
// //                 "Tại sao không khí 78% nitrogen — oxygen 100% sẽ đốt cháy thế giới",
// //             tags: ["hóa học", "khí quyển", "khoa học"],
// //             difficultyLevel: DifficultyLevel.BEGINNER,
// //             readingTime: 3,
// //         },
// //         {
// //             userId: uid(2),
// //             learningGoal:
// //                 "Hiểu tại sao các công ty khởi nghiệp thành công nhất thường không bắt đầu với ý tưởng 'đột phá'.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ startup thành công bắt đầu bằng ý tưởng thiên tài độc đáo chưa ai nghĩ đến. Nghiên cứu về các startup thành công cho thấy phần lớn bắt đầu bằng execution xuất sắc trên ý tưởng đã có.",
// //             coreExplanation:
// //                 "Google không phải công cụ tìm kiếm đầu tiên (đã có Yahoo, AltaVista). Facebook không phải mạng xã hội đầu tiên (Friendster, MySpace). Airbnb không phải dịch vụ cho thuê nhà đầu tiên. Điều tạo ra khác biệt: (1) Timing — đúng lúc công nghệ/thị trường sẵn sàng, (2) Execution — thực thi tốt hơn, tập trung vào UX và vấn đề thực sự, (3) Network effects — đạt critical mass trước đối thủ. Paul Graham (Y Combinator) nói: tìm vấn đề thực sự bạn gặp, làm thứ gì đó 'không vô lý' cho một nhóm nhỏ người, sau đó mở rộng. 'Ý tưởng tốt nhưng execution tệ' thất bại hơn 'ý tưởng bình thường nhưng execution xuất sắc'.",
// //             understandingCheck:
// //                 "Nếu execution quan trọng hơn ý tưởng, điều đó có nghĩa gì cho quyết định có nên giữ bí mật ý tưởng startup hay nên chia sẻ rộng rãi để nhận feedback?",
// //             summary:
// //                 "Startup thành công không cần ý tưởng đột phá — execution mới là chìa khóa",
// //             tags: ["kinh doanh", "startup", "tư duy"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 4,
// //         },
// //         {
// //             userId: uid(3),
// //             learningGoal:
// //                 "Hiểu nguyên lý Pareto (80/20) và tại sao nó xuất hiện trong hầu hết mọi hệ thống tự nhiên.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ quy tắc 80/20 chỉ là 'quy tắc kinh nghiệm' hay quan sát tình cờ. Thực ra nó phản ánh cấu trúc sâu của nhiều hệ thống tự nhiên và xã hội — xuất phát từ phân phối power law.",
// //             coreExplanation:
// //                 "Vilfredo Pareto (1906) nhận thấy 20% dân số Ý sở hữu 80% đất đai. Sau đó phát hiện pattern này xuất hiện khắp nơi: 20% sản phẩm tạo 80% doanh thu, 20% bug gây 80% lỗi phần mềm, 20% khách hàng chiếm 80% lợi nhuận, 20% bài viết nhận 80% traffic. Cơ chế: hệ thống có 'preferential attachment' — thứ đã có nhiều sẽ càng nhận được nhiều (rich-get-richer). Ứng dụng thực tế: tìm 20% công việc tạo 80% kết quả và ưu tiên chúng, không cố gắng tối ưu mọi thứ đồng đều.",
// //             understandingCheck:
// //                 "Nếu bạn có 10 kỹ năng và muốn nâng cao thu nhập, theo nguyên lý Pareto bạn nên làm gì: cải thiện đồng đều 10 kỹ năng 10%, hay tập trung nâng 2 kỹ năng quan trọng nhất lên 50%?",
// //             summary:
// //                 "Nguyên lý Pareto 80/20 — tại sao bất bình đẳng xuất hiện trong mọi hệ thống",
// //             tags: ["toán học", "kinh tế", "tư duy chiến lược"],
// //             difficultyLevel: DifficultyLevel.BEGINNER,
// //             readingTime: 4,
// //         },
// //         {
// //             userId: uid(0),
// //             learningGoal:
// //                 "Hiểu tại sao thế kỷ 20 là bạo lực nhất lịch sử nhưng cũng là thế kỷ bạo lực giảm mạnh nhất.",
// //             commonConfusion:
// //                 "Hai quan điểm đối lập: (1) thế kỷ 20 là tàn khốc nhất với Holocaust, Thế chiến, Gulag; (2) con người ngày càng văn minh hơn. Cả hai đều đúng — nhưng cần nhìn đúng thước đo.",
// //             coreExplanation:
// //                 "Steven Pinker trong 'The Better Angels of Our Nature' dùng TỶ LỆ chết vì bạo lực/dân số, không số tuyệt đối. Thế chiến 2 giết 70 triệu người — khủng khiếp. Nhưng chiến tranh Mông Cổ thế kỷ 13 giết 40 triệu người khi dân số thế giới chỉ ~400 triệu — tỷ lệ cao hơn nhiều. Một người nguyên thủy có xác suất chết vì bạo lực cao hơn người thế kỷ 20 khoảng 5-10 lần. Xu hướng giảm: nhà nước độc quyền bạo lực (ổn định hơn chiến tranh bộ lạc liên tục), thương mại quốc tế tạo ra lợi ích từ hòa bình, giáo dục và đồng cảm mở rộng.",
// //             understandingCheck:
// //                 "Nếu số người chết vì chiến tranh tuyệt đối tăng nhưng tỷ lệ giảm, thế giới thực sự an toàn hơn hay nguy hiểm hơn? Thước đo nào phù hợp hơn?",
// //             summary:
// //                 "Thế kỷ 20 bạo lực nhất nhưng tỷ lệ bạo lực thấp nhất — nghịch lý Pinker",
// //             tags: ["lịch sử", "xã hội học", "bạo lực"],
// //             difficultyLevel: DifficultyLevel.ADVANCED,
// //             readingTime: 6,
// //         },
// //         {
// //             userId: uid(1),
// //             learningGoal:
// //                 "Hiểu tại sao việc dạy trẻ em 'cố gắng là được' có thể phản tác dụng theo nghiên cứu tâm lý.",
// //             commonConfusion:
// //                 "Nhiều phụ huynh khen con 'con thông minh quá' hay 'con giỏi quá' với ý định tốt. Carol Dweck (Stanford) phát hiện điều này thực ra gây hại cho trẻ về lâu dài.",
// //             coreExplanation:
// //                 "Dweck phân biệt Fixed Mindset (thông minh/tài năng là cố định) và Growth Mindset (năng lực phát triển qua nỗ lực). Trẻ được khen 'thông minh' phát triển Fixed Mindset: tránh thử thách vì sợ thất bại sẽ chứng minh mình 'không thông minh nữa', bỏ cuộc sớm khi gặp khó khăn. Trẻ được khen 'con đã cố gắng thật sự' phát triển Growth Mindset: xem thách thức là cơ hội học hỏi, kiên trì hơn khi gặp khó. Nghiên cứu 400 học sinh lớp 5: nhóm khen nỗ lực sau đó chọn bài khó hơn 65% so với nhóm khen thông minh.",
// //             understandingCheck:
// //                 "Nếu bạn là giáo viên, cách bạn phản ứng khi học sinh đạt điểm 10 dễ dàng nên khác như thế nào so với khi học sinh đạt điểm 7 sau khi nỗ lực rất nhiều?",
// //             summary:
// //                 "Fixed vs Growth Mindset — tại sao khen con thông minh lại phản tác dụng",
// //             tags: ["giáo dục", "tâm lý học", "phát triển trẻ em"],
// //             difficultyLevel: DifficultyLevel.BEGINNER,
// //             readingTime: 4,
// //         },
// //         {
// //             userId: uid(2),
// //             learningGoal:
// //                 "Hiểu tại sao internet tạo ra 'bong bóng lọc' và ảnh hưởng của nó đến dân chủ.",
// //             commonConfusion:
// //                 "Nhiều người nghĩ internet làm chúng ta tiếp cận nhiều quan điểm hơn bao giờ hết — và điều đó đúng về mặt kỹ thuật. Nhưng thuật toán cá nhân hóa tạo ra hiệu ứng ngược lại trong thực tế.",
// //             coreExplanation:
// //                 "Eli Pariser (2011) đặt tên 'filter bubble': thuật toán Facebook, Google, YouTube học từ hành vi của bạn và ưu tiên nội dung bạn có khả năng đồng ý và tương tác. Kết quả: hai người tìm kiếm cùng từ khóa nhận được kết quả khác nhau dựa trên lịch sử. Chúng ta thấy ít quan điểm trái chiều hơn, tin rằng 'ai cũng nghĩ như mình'. Vấn đề cho dân chủ: không thể đồng ý hay không đồng ý khi không biết người khác thực sự nghĩ gì — mỗi bên đang sống trong thực tế thông tin khác nhau.",
// //             understandingCheck:
// //                 "Nếu bạn muốn thoát khỏi bong bóng lọc của mình, những bước cụ thể nào bạn có thể thực hiện trong tuần tới?",
// //             summary:
// //                 "Bong bóng lọc — thuật toán đang chia thế giới thành các thực tại song song",
// //             tags: ["công nghệ", "xã hội học", "dân chủ"],
// //             difficultyLevel: DifficultyLevel.INTERMEDIATE,
// //             readingTime: 4,
// //         },
// //         {
// //             userId: uid(3),
// //             learningGoal:
// //                 "Hiểu tại sao nước là chất lỏng bất thường và các tính chất kỳ lạ của nó cần thiết cho sự sống.",
// //             commonConfusion:
// //                 "Hầu hết mọi người coi nước là 'chất lỏng bình thường'. Thực ra theo hóa học, nước có hành vi phi thường ở hầu hết mọi tính chất — và những bất thường đó là điều kiện tiên quyết cho sự sống trên Trái Đất.",
// //             coreExplanation:
// //                 "Các tính chất kỳ lạ của nước: (1) Đá nổi trên nước — hầu hết chất rắn đặc hơn dạng lỏng, nhưng nước đá nổi vì cấu trúc tinh thể kém đặc. Nếu đá chìm, hồ ao sẽ đóng băng từ đáy lên, giết chết mọi sự sống, (2) Nhiệt dung riêng cực cao — đại dương hấp thụ nhiều nhiệt mà không thay đổi nhiệt độ nhiều, ổn định khí hậu Trái Đất, (3) Sức căng bề mặt cao — cho phép côn trùng đứng trên nước, mao dẫn nước lên cây cao hàng chục mét, (4) Là dung môi phổ quát — hòa tan hầu hết hợp chất hữu cơ cần thiết cho sinh hóa.",
// //             understandingCheck:
// //                 "Nếu đá chìm thay vì nổi, hãy mô tả những thay đổi cụ thể nào sẽ xảy ra với hệ sinh thái hồ nước và khí hậu Trái Đất.",
// //             summary:
// //                 "Nước — chất lỏng kỳ lạ nhất vũ trụ và tại sao sự sống cần điều đó",
// //             tags: ["hóa học", "sinh học", "môi trường"],
// //             difficultyLevel: DifficultyLevel.BEGINNER,
// //             readingTime: 4,
// //         },
// //     ];

// //     console.log(`Seeding ${posts.length} knowledge posts...`);

// //     for (const post of posts) {
// //         await prisma.knowledgePost.create({ data: post });
// //     }

// //     console.log(`✓ Đã seed ${posts.length} knowledge posts thành công!`);
// // }

// // main()
// //     .catch((e) => {
// //         console.error(e);
// //         process.exit(1);
// //     })
// //     .finally(async () => {
// //         await prisma.$disconnect();
// //     });

// // const vietnameseGirls = [
// //     {
// //         name: 'Nguyễn Thị Lan Anh',
// //         username: 'lananh.nguyen',
// //         email: 'lananh.nguyen@gmail.com',
// //         bio: 'Thích cà phê sáng và những buổi chiều đọc sách ☕📚',
// //         location: 'Hà Nội',
// //         website: 'https://lananh.blog',
// //         avatar: 'https://i.pravatar.cc/300?img=1',
// //     },
// //     {
// //         name: 'Trần Minh Châu',
// //         username: 'minchau.tran',
// //         email: 'minchau.tran@gmail.com',
// //         bio: 'Nhiếp ảnh phong cảnh | Du lịch bụi khắp miền Trung 🌄',
// //         location: 'Đà Nẵng',
// //         website: 'https://minchau.photos',
// //         avatar: 'https://i.pravatar.cc/300?img=2',
// //     },
// //     {
// //         name: 'Lê Thị Hương Giang',
// //         username: 'huonggiang.le',
// //         email: 'huonggiang.le@gmail.com',
// //         bio: 'Giáo viên tiếng Anh yêu âm nhạc indie 🎵',
// //         location: 'Huế',
// //         website: '',
// //         avatar: 'https://i.pravatar.cc/300?img=3',
// //     },
// //     {
// //         name: 'Phạm Thảo Nguyên',
// //         username: 'thaonguyen.pham',
// //         email: 'thaonguyen.pham@gmail.com',
// //         bio: 'Foodie | Review quán ăn vặt Sài Gòn 🍜',
// //         location: 'TP. Hồ Chí Minh',
// //         website: 'https://thaonguyen.food',
// //         avatar: 'https://i.pravatar.cc/300?img=4',
// //     },
// //     {
// //         name: 'Võ Khánh Linh',
// //         username: 'khanhlinh.vo',
// //         email: 'khanhlinh.vo@gmail.com',
// //         bio: 'UX Designer | Mê đồ handmade và cây cảnh 🌿',
// //         location: 'TP. Hồ Chí Minh',
// //         website: 'https://khanhlinh.design',
// //         avatar: 'https://i.pravatar.cc/300?img=5',
// //     },
// //     {
// //         name: 'Hoàng Thị Mai',
// //         username: 'hoangmai.hth',
// //         email: 'hoangmai.hth@gmail.com',
// //         bio: 'Sinh viên y khoa | Tập gym mỗi ngày 💪',
// //         location: 'Hải Phòng',
// //         website: '',
// //         avatar: 'https://i.pravatar.cc/300?img=6',
// //     },
// //     {
// //         name: 'Đặng Ngọc Bích',
// //         username: 'ngocbich.dang',
// //         email: 'ngocbich.dang@gmail.com',
// //         bio: 'Kế toán ban ngày, bán bánh homemade ban đêm 🍰',
// //         location: 'Cần Thơ',
// //         website: 'https://bichbakery.vn',
// //         avatar: 'https://i.pravatar.cc/300?img=7',
// //     },
// //     {
// //         name: 'Bùi Phương Anh',
// //         username: 'phuonganh.bui',
// //         email: 'phuonganh.bui@gmail.com',
// //         bio: 'Travel blogger | 30 tỉnh thành trong 2 năm ✈️',
// //         location: 'Hà Nội',
// //         website: 'https://phuonganh.travel',
// //         avatar: 'https://i.pravatar.cc/300?img=8',
// //     },
// //     {
// //         name: 'Đinh Thị Quỳnh',
// //         username: 'dinhquynh.dtq',
// //         email: 'dinhquynh.dtq@gmail.com',
// //         bio: 'Lập trình viên React | Cuồng anime và manga 🎌',
// //         location: 'Hà Nội',
// //         website: 'https://github.com/dinhquynh',
// //         avatar: 'https://i.pravatar.cc/300?img=9',
// //     },
// //     {
// //         name: 'Ngô Thị Diễm My',
// //         username: 'diemmy.ngo',
// //         email: 'diemmy.ngo@gmail.com',
// //         bio: 'MC sự kiện | Yoga mỗi sáng 🧘‍♀️',
// //         location: 'Biên Hòa',
// //         website: '',
// //         avatar: 'https://i.pravatar.cc/300?img=10',
// //     },
// //     {
// //         name: 'Trịnh Thanh Hà',
// //         username: 'thanhha.trinh',
// //         email: 'thanhha.trinh@gmail.com',
// //         bio: 'Nhà thiết kế thời trang tự do ✂️👗',
// //         location: 'TP. Hồ Chí Minh',
// //         website: 'https://thanhha.fashion',
// //         avatar: 'https://i.pravatar.cc/300?img=11',
// //     },
// //     {
// //         name: 'Phan Thị Ngọc Hân',
// //         username: 'ngochan.phan',
// //         email: 'ngochan.phan@gmail.com',
// //         bio: 'Bác sĩ thú y | Nuôi 3 mèo và 1 chó 🐾',
// //         location: 'Đà Lạt',
// //         website: '',
// //         avatar: 'https://i.pravatar.cc/300?img=12',
// //     },
// //     {
// //         name: 'Lưu Thị Kim Oanh',
// //         username: 'kimoanh.luu',
// //         email: 'kimoanh.luu@gmail.com',
// //         bio: 'Chuyên viên marketing | Yêu K-drama và trà sữa 🧋',
// //         location: 'Hà Nội',
// //         website: '',
// //         avatar: 'https://i.pravatar.cc/300?img=13',
// //     },
// //     {
// //         name: 'Tạ Hải Yến',
// //         username: 'haiyen.ta',
// //         email: 'haiyen.ta@gmail.com',
// //         bio: 'Giảng viên đại học | Nghiên cứu văn học Việt Nam cổ điển 📖',
// //         location: 'Hà Nội',
// //         website: 'https://haiyen.edu.vn',
// //         avatar: 'https://i.pravatar.cc/300?img=14',
// //     },
// //     {
// //         name: 'Vũ Thị Lan',
// //         username: 'vulan.vtl',
// //         email: 'vulan.vtl@gmail.com',
// //         bio: 'Diễn viên kịch nghiệp dư | Mê phim tài liệu 🎬',
// //         location: 'TP. Hồ Chí Minh',
// //         website: '',
// //         avatar: 'https://i.pravatar.cc/300?img=15',
// //     },
// //     {
// //         name: 'Huỳnh Thị Bảo Châu',
// //         username: 'baochau.huynh',
// //         email: 'baochau.huynh@gmail.com',
// //         bio: 'Chủ tiệm hoa tươi | Chia sẻ cách cắm hoa Ikebana 🌸',
// //         location: 'Cần Thơ',
// //         website: 'https://baochauflower.vn',
// //         avatar: 'https://i.pravatar.cc/300?img=16',
// //     },
// //     {
// //         name: 'Đỗ Minh Tuyết',
// //         username: 'minhttuyet.do',
// //         email: 'minhttuyet.do@gmail.com',
// //         bio: 'Kỹ sư phần mềm | Chạy marathon cuối tuần 🏃‍♀️',
// //         location: 'Hà Nội',
// //         website: 'https://github.com/minhttuyet',
// //         avatar: 'https://i.pravatar.cc/300?img=17',
// //     },
// //     {
// //         name: 'Cao Thị Thu Hằng',
// //         username: 'thuhang.cao',
// //         email: 'thuhang.cao@gmail.com',
// //         bio: 'Nhân viên ngân hàng | Sưu tầm tem thư và đồng xu cổ 🪙',
// //         location: 'Nam Định',
// //         website: '',
// //         avatar: 'https://i.pravatar.cc/300?img=18',
// //     },
// //     {
// //         name: 'Lý Thị Xuân',
// //         username: 'lyxuan.ltx',
// //         email: 'lyxuan.ltx@gmail.com',
// //         bio: 'Đầu bếp | Chuyên ẩm thực miền Tây Nam Bộ 🍲',
// //         location: 'Vĩnh Long',
// //         website: 'https://xuancook.vn',
// //         avatar: 'https://i.pravatar.cc/300?img=19',
// //     },
// //     {
// //         name: 'Mai Thị Hồng Nhung',
// //         username: 'hongnhung.mai',
// //         email: 'hongnhung.mai@gmail.com',
// //         bio: 'Streamer gaming | Main VALORANT và Liên Quân 🎮',
// //         location: 'TP. Hồ Chí Minh',
// //         website: 'https://twitch.tv/hongnhungvn',
// //         avatar: 'https://i.pravatar.cc/300?img=20',
// //     },
// //     {
// //         name: 'Nguyễn Hà Phương',
// //         username: 'haphuong.nguyen',
// //         email: 'haphuong.nguyen@gmail.com',
// //         bio: 'Stylist | Mê vintage và thrift shopping 👒',
// //         location: 'Hội An',
// //         website: '',
// //         avatar: 'https://i.pravatar.cc/300?img=21',
// //     },
// //     {
// //         name: 'Trần Thị Ngọc Trinh',
// //         username: 'ngooctrinh.tran',
// //         email: 'ngooctrinh.tran@gmail.com',
// //         bio: 'Kiến trúc sư cảnh quan | Mê đọc sách self-help 🌳',
// //         location: 'Hà Nội',
// //         website: '',
// //         avatar: 'https://i.pravatar.cc/300?img=22',
// //     },
// //     {
// //         name: 'Lê Ngọc Anh',
// //         username: 'ngocanh.le',
// //         email: 'ngocanh.le@gmail.com',
// //         bio: 'HR Manager | Coaching kỹ năng mềm cho sinh viên 🎯',
// //         location: 'Hà Nội',
// //         website: 'https://ngocanh.coach',
// //         avatar: 'https://i.pravatar.cc/300?img=23',
// //     },
// //     {
// //         name: 'Phạm Thị Mỹ Linh',
// //         username: 'mylinh.pham',
// //         email: 'mylinh.pham@gmail.com',
// //         bio: 'Nhiếp ảnh gia chân dung | Workshop mỗi tháng 📷',
// //         location: 'Đà Nẵng',
// //         website: 'https://mylinhphoto.com',
// //         avatar: 'https://i.pravatar.cc/300?img=24',
// //     },
// //     {
// //         name: 'Nguyễn Thị Bảo Ngọc',
// //         username: 'baongoc.nguyen',
// //         email: 'baongoc.nguyen@gmail.com',
// //         bio: 'Dược sĩ | Chia sẻ kiến thức sức khỏe và dinh dưỡng 💊',
// //         location: 'TP. Hồ Chí Minh',
// //         website: '',
// //         avatar: 'https://i.pravatar.cc/300?img=25',
// //     },
// //     {
// //         name: 'Võ Thị Thanh Thảo',
// //         username: 'thanhthao.vo',
// //         email: 'thanhthao.vo@gmail.com',
// //         bio: 'Nhà văn tự do | Đã xuất bản 2 tập truyện ngắn ✍️',
// //         location: 'Nha Trang',
// //         website: 'https://thanhthaowrites.com',
// //         avatar: 'https://i.pravatar.cc/300?img=26',
// //     },
// //     {
// //         name: 'Hoàng Khánh Huyền',
// //         username: 'khanhhuyen.hoang',
// //         email: 'khanhhuyen.hoang@gmail.com',
// //         bio: 'Luật sư | Tình nguyện viên pháp lý cộng đồng ⚖️',
// //         location: 'Hà Nội',
// //         website: '',
// //         avatar: 'https://i.pravatar.cc/300?img=27',
// //     },
// //     {
// //         name: 'Đặng Thị Tường Vy',
// //         username: 'tuongvy.dang',
// //         email: 'tuongvy.dang@gmail.com',
// //         bio: 'Content creator | Kênh YouTube về cuộc sống du học 🇰🇷',
// //         location: 'Seoul (gốc Cần Thơ)',
// //         website: 'https://youtube.com/@tuongvydang',
// //         avatar: 'https://i.pravatar.cc/300?img=28',
// //     },
// //     {
// //         name: 'Bùi Thị Cẩm Tú',
// //         username: 'camtu.bui',
// //         email: 'camtu.bui@gmail.com',
// //         bio: 'Chuyên viên tư vấn du học | Cựu sinh viên NUS 🎓',
// //         location: 'TP. Hồ Chí Minh',
// //         website: 'https://camtu.edu',
// //         avatar: 'https://i.pravatar.cc/300?img=29',
// //     },
// //     {
// //         name: 'Đinh Thị Phúc An',
// //         username: 'phucan.dinh',
// //         email: 'phucan.dinh@gmail.com',
// //         bio: 'Nha sĩ | Yêu leo núi và cắm trại dã ngoại 🏕️',
// //         location: 'Lâm Đồng',
// //         website: '',
// //         avatar: 'https://i.pravatar.cc/300?img=30',
// //     },
// // ]

// // // // ─── main ────────────────────────────────────────────────────────────────────

// // async function main() {
// //     console.log('▶ Bắt đầu tạo 30 user nữ người Việt...\n')

// //     const hashedPassword = await bcrypt.hash('12345678', 10)

// //     let created = 0
// //     let skipped = 0

// //     for (const girl of vietnameseGirls) {
// //         const existing = await prisma.user.findFirst({
// //             where: {
// //                 OR: [{ email: girl.email }, { username: girl.username }],
// //             },
// //         })

// //         if (existing) {
// //             console.log(`  ⚠ Bỏ qua (đã tồn tại): ${girl.username}`)
// //             skipped++
// //             continue
// //         }

// //         const user = await prisma.user.create({
// //             data: {
// //                 email: girl.email,
// //                 username: girl.username,
// //                 password: hashedPassword,
// //                 name: girl.name,
// //                 bio: girl.bio,
// //                 avatar: girl.avatar,
// //                 location: girl.location,
// //                 website: girl.website || null,
// //                 role: UserRole.USER,
// //                 status: UserStatus.ACTIVE,
// //                 isPrivate: false,
// //                 verifiedAt: new Date(), // tài khoản đã xác thực
// //             },
// //         })

// //         console.log(`  ✔ [${String(created + 1).padStart(2, '0')}] ${user.name} (@${user.username}) — ${girl.location}`)
// //         created++
// //     }

// //     console.log(`\n✅ Hoàn tất! Đã tạo: ${created} | Bỏ qua: ${skipped}`)
// //     console.log('\nMật khẩu mặc định cho tất cả: Password@123')
// // }

// // main()
// //     .catch((e) => {
// //         console.error('❌ Seed thất bại:', e)
// //         process.exit(1)
// //     })
// //     .finally(() => prisma.$disconnect())
// // const slice = (users: { id: string }[], start: number, end: number) =>
// //     users.slice(start, end).map((u) => u.id)

// // async function createCircleWithMembers({
// //     name,
// //     visibility,
// //     creatorId,
// //     adminIds,
// //     memberIds,
// //     invitationRequestUserIds,
// //     invitationSentToUserIds,
// //     inviterId,
// // }: {
// //     name: string
// //     visibility: Visibility
// //     creatorId: string
// //     adminIds: string[]
// //     memberIds: string[]
// //     invitationRequestUserIds: string[]  // 3 user tự xin vào
// //     invitationSentToUserIds: string[]   // 3 user được mời
// //     inviterId: string                   // người gửi lời mời (OWNER hoặc ADMIN)
// // }) {
// //     console.log(`\n▶ Tạo circle "${name}" [${visibility}]...`)

// //     // 1. Tạo Circle
// //     const circle = await prisma.circle.create({
// //         data: {
// //             name,
// //             userId: creatorId,
// //             createById: creatorId,
// //             visibility,
// //         },
// //     })
// //     console.log(`  ✔ circle id=${circle.id}`)

// //     // 2. OWNER
// //     await prisma.circleMember.create({
// //         data: { circleId: circle.id, userId: creatorId, role: RoleMembership.OWNER },
// //     })

// //     // 3. ADMIN (2 người)
// //     await prisma.circleMember.createMany({
// //         data: adminIds.map((userId) => ({
// //             circleId: circle.id,
// //             userId,
// //             role: RoleMembership.ADMIN,
// //         })),
// //         skipDuplicates: true,
// //     })

// //     // 4. MEMBER (phần còn lại)
// //     await prisma.circleMember.createMany({
// //         data: memberIds.map((userId) => ({
// //             circleId: circle.id,
// //             userId,
// //             role: RoleMembership.MEMBER,
// //         })),
// //         skipDuplicates: true,
// //     })

// //     const total = 1 + adminIds.length + memberIds.length
// //     console.log(
// //         `  ✔ Members: 1 OWNER + ${adminIds.length} ADMIN + ${memberIds.length} MEMBER = ${total}`
// //     )

// //     // 5. InvitationRequest — user tự xin vào nhóm (3 trạng thái)
// //     const reqStatuses = ['PENDING', 'ACCEPTED', 'REJECTED'] as const
// //     await prisma.invitationRequest.createMany({
// //         data: invitationRequestUserIds.map((userId, i) => ({
// //             circleId: circle.id,
// //             userId,
// //             status: reqStatuses[i % 3],
// //         })),
// //         skipDuplicates: true,
// //     })
// //     console.log(
// //         `  ✔ InvitationRequest (xin vào): PENDING=${invitationRequestUserIds[0]?.slice(0, 8)}… | ACCEPTED | REJECTED`
// //     )

// //     // 6. CircleInvitation — owner/admin mời người dùng (3 trạng thái)
// //     const invStatuses = [
// //         CircleInvitationStatus.PENDING,
// //         CircleInvitationStatus.ACCEPTED,
// //         CircleInvitationStatus.REJECTED,
// //     ]
// //     await prisma.circleInvitation.createMany({
// //         data: invitationSentToUserIds.map((userId, i) => ({
// //             circleId: circle.id,
// //             userId,
// //             inviterId,
// //             status: invStatuses[i % 3],
// //         })),
// //         skipDuplicates: true,
// //     })
// //     console.log(
// //         `  ✔ CircleInvitation (được mời): PENDING | ACCEPTED | REJECTED`
// //     )

// //     return circle
// // }

// // // ─── main ────────────────────────────────────────────────────────────────────

// // async function main() {
// //     const users = await prisma.user.findMany({
// //         orderBy: { createdAt: 'asc' },
// //         take: 100,
// //         select: { id: true },
// //     })

// //     if (users.length < 100) {
// //         throw new Error(
// //             `Seed yêu cầu ít nhất 100 user, hiện chỉ có ${users.length}`
// //         )
// //     }

// //     const id = (i: number) => users[i].id

// //     /**
// //      * Phân bổ index (không trùng CircleMember giữa các nhóm):
// //      *
// //      * ┌─────────────────────────────────────────────────────────────────┐
// //      * │ PRIVATE (30 members) — users[0..29]                            │
// //      * │   OWNER   : users[0]                                           │
// //      * │   ADMIN   : users[1], users[2]                                 │
// //      * │   MEMBER  : users[3..29]  (27 người)                           │
// //      * │   InvReq  : users[30], [31], [32]  → PENDING/ACCEPTED/REJECTED │
// //      * │   CircInv : users[33], [34], [35]  → PENDING/ACCEPTED/REJECTED │
// //      * ├─────────────────────────────────────────────────────────────────┤
// //      * │ PUBLIC (50 members) — users[36..85]                            │
// //      * │   OWNER   : users[36]                                          │
// //      * │   ADMIN   : users[37], users[38]                               │
// //      * │   MEMBER  : users[39..85]  (47 người)                          │
// //      * │   InvReq  : users[86], [87], [88]                              │
// //      * │   CircInv : users[89], [90], [91]                              │
// //      * ├─────────────────────────────────────────────────────────────────┤
// //      * │ CIRCLE (20 members) — users[92..99] + users[30..43]            │
// //      * │   (users[30..35] chỉ là InvReq/CircInv của nhóm PRIVATE,      │
// //      * │    không phải CircleMember nên không vi phạm unique constraint) │
// //      * │   OWNER   : users[92]                                          │
// //      * │   ADMIN   : users[93], users[94]                               │
// //      * │   MEMBER  : users[95..99] (5) + users[30..41] (12) = 17 người  │
// //      * │             tổng = 1 + 2 + 17 = 20 ✔                          │
// //      * │   InvReq  : users[42], [43], [44]                              │
// //      * │   CircInv : users[45], [46], [47]                              │
// //      * └─────────────────────────────────────────────────────────────────┘
// //      */

// //     // ── 1. PRIVATE ──────────────────────────────────────────────────────────
// //     await createCircleWithMembers({
// //         name: 'Nhóm Riêng Tư (Private)',
// //         visibility: Visibility.PRIVATE,
// //         creatorId: id(0),
// //         adminIds: [id(1), id(2)],
// //         memberIds: slice(users, 3, 30),          // 27 → tổng 30
// //         invitationRequestUserIds: [id(30), id(31), id(32)],
// //         invitationSentToUserIds: [id(33), id(34), id(35)],
// //         inviterId: id(1),
// //     })

// //     // ── 2. PUBLIC ───────────────────────────────────────────────────────────
// //     await createCircleWithMembers({
// //         name: 'Nhóm Công Khai (Public)',
// //         visibility: Visibility.PUBLIC,
// //         creatorId: id(36),
// //         adminIds: [id(37), id(38)],
// //         memberIds: slice(users, 39, 86),         // 47 → tổng 50
// //         invitationRequestUserIds: [id(86), id(87), id(88)],
// //         invitationSentToUserIds: [id(89), id(90), id(91)],
// //         inviterId: id(37),
// //     })

// //     // ── 3. CIRCLE ───────────────────────────────────────────────────────────
// //     await createCircleWithMembers({
// //         name: 'Nhóm Vòng Tròn (Circle)',
// //         visibility: Visibility.CIRCLE,
// //         creatorId: id(92),
// //         adminIds: [id(93), id(94)],
// //         memberIds: [
// //             ...slice(users, 95, 100),  // users[95..99] = 5
// //             ...slice(users, 30, 42),   // users[30..41] = 12  → tổng member = 17, total = 20
// //         ],
// //         invitationRequestUserIds: [id(42), id(43), id(44)],
// //         invitationSentToUserIds: [id(45), id(46), id(47)],
// //         inviterId: id(93),
// //     })

// //     console.log('\n✅ Seed hoàn tất — 3 circles đã được tạo thành công!\n')
// //     console.log('Tổng kết:')
// //     console.log('  • Nhóm Riêng Tư  (PRIVATE) : 30 members, 3 InvReq, 3 CircInv')
// //     console.log('  • Nhóm Công Khai (PUBLIC)  : 50 members, 3 InvReq, 3 CircInv')
// //     console.log('  • Nhóm Vòng Tròn (CIRCLE)  : 20 members, 3 InvReq, 3 CircInv')
// // }

// // main()
// //     .catch((e) => {
// //         console.error('❌ Seed thất bại:', e)
// //         process.exit(1)
// //     })
// //     .finally(() => prisma.$disconnect())
// // const rootContents = [
// //     // Tech / Dev
// //     `Sau 3 năm làm backend, mình nhận ra rằng: code sạch không phải là viết ít dòng nhất — mà là code người khác đọc vào hiểu ngay mà không cần hỏi. 🧹`,
// //     `Hot take: TypeScript không làm bạn code nhanh hơn, nhưng nó làm bạn ngủ ngon hơn lúc 2am khi production bị lỗi 😅`,
// //     `Vừa refactor một đống code 3 năm tuổi không có test. Đây là góc nhìn của tôi sau khi sống sót qua 2 tuần địa ngục: thread 🧵`,
// //     `Hỏi thật: mọi người đang dùng gì để quản lý state trong 2025? Redux vẫn đang sống hay đã bị thay thế hoàn toàn rồi?`,
// //     `Điều không ai nói với bạn khi bắt đầu làm dev: phần khó nhất không phải là code — mà là đặt tên biến. Đây là hoàn toàn nghiêm túc. 😐`,
// //     `Just shipped a side project I've been building for 6 months. Zero users so far. Still the proudest I've been of anything I've built. 🚢`,
// //     `The best career advice I ever got: your job is not to write code. Your job is to solve problems. Code is just one tool.`,
// //     `AI tools are changing how I work, but not in the way I expected. I spend less time writing boilerplate and more time thinking about architecture. That's actually a good thing?`,
// //     `Unpopular opinion: most apps don't need a microservices architecture. A well-structured monolith will serve you for years. Don't over-engineer.`,
// //     `Database indexing saved our app from death today. One missing index → queries going from 8s to 40ms. Please index your columns, people. 🙏`,

// //     // Life / Travel
// //     `Đà Lạt 3 ngày 2 đêm với budget 1.5 triệu/người. Có thể làm được không? Cùng mình khám phá nhé 🌿`,
// //     `Tokyo solo trip tips không ai chia sẻ: luôn mua IC card ngay tại sân bay, tránh đổi tiền ở khách sạn, và 7-Eleven ngon hơn nhiều nhà hàng bình dân ở VN 🇯🇵`,
// //     `Coffee shop culture ở Hà Nội vs TP.HCM: người HN ngồi uống cà phê để suy nghĩ, người SG uống để làm việc. Cả hai đều đúng. ☕`,
// //     `Solo travelling changed me more than any therapy session ever did. There's something about being alone in an unfamiliar city that forces you to actually meet yourself.`,
// //     `The hidden cost of travelling that nobody budgets for: the week after you come back when nothing feels right and your bed feels too familiar.`,
// //     `Living abroad for 2 years now. The things I miss about home aren't the places — they're the sounds. My mom's voice in the kitchen. Rain on the roof at 3am.`,

// //     // Food
// //     `Công thức nước chấm bún bò Huế chuẩn của ngoại mình. Không phải bí mật gia truyền gì, chỉ là kiên nhẫn và mắm ruốc chất lượng 🫙`,
// //     `Ai bảo ăn healthy là phải nhạt nhẽo? Mình đã ăn plant-based 8 tháng và đây là 5 món mình không thể sống thiếu 🥑`,
// //     `Rating all 12 instant noodle brands I tried this month. Doing the lord's work so you don't have to 🍜`,
// //     `Controversial food opinion: Vietnamese coffee is objectively the best coffee culture in the world. The ratio of condensed milk to bitter espresso is an art form.`,

// //     // Wellness / Mindset
// //     `Mình đã bỏ điện thoại khỏi phòng ngủ được 6 tháng. Đây là những gì thay đổi: giấc ngủ tốt hơn, buổi sáng chậm hơn, và mình dần ngừng cảm thấy mình đang bỏ lỡ gì đó.`,
// //     `Burnout isn't about working too much. It's about working too much on things that don't align with your values. That distinction took me 3 years to understand.`,
// //     `Therapy taught me that most of my "productivity" habits were actually anxiety coping mechanisms. Restructuring that has been the hardest and best thing I've done.`,
// //     `30 days no social media. Here's what actually happened (spoiler: I did not suddenly become enlightened, but I did read 4 books) 📚`,

// //     // Design / Creative
// //     `Design trend mình ghét nhất năm nay: dark mode mà contrast quá thấp đến mức đọc không được. Tối thui ≠ đẹp. 🎨`,
// //     `Every good designer I know has a dedicated "ugly work" phase. The gap between your taste and your skill is real — the only way through it is volume.`,
// //     `Just redesigned our onboarding flow. Reduced drop-off by 34% with one change: removing a question we asked but never actually used. Delete > redesign.`,

// //     // Career / Work
// //     `Mình từ chối offer lương 3x để ở lại công ty cũ. Lý do: team tốt, scope lớn, và tôi còn đang học rất nhiều. Tiền quan trọng nhưng không phải tất cả.`,
// //     `3 điều mình ước ai đó nói trước khi mình nhảy startup: equity ≠ tiền thật, runway ngắn hơn bạn nghĩ, và culture fit quan trọng gấp đôi kỹ năng. 📌`,
// //     `Been a manager for 18 months. The skill nobody prepares you for: having hard conversations with people you genuinely like and respect.`,
// //     `Remote work isn't for everyone and that's okay. The people who thrive in it are usually the ones who had already figured out self-direction. It's a skill, not a personality type.`,

// //     // Random / Relatable
// //     `Tại sao cứ 9pm mình mới nảy ra ý tưởng hay nhất ngày và không còn energy để thực hiện? Ai giải thích được không? 😭`,
// //     `The audacity of my brain to give me my best ideas at 2am when I have a 9am meeting tomorrow.`,
// //     `Hot take: "I'll sleep when I'm dead" is the least productive mindset a founder can have. Sleep is when your brain solves problems. You're literally skipping the solver.`,
// //     `Mình có một quy tắc: không bao giờ ra quyết định quan trọng sau 10pm. Ngủ một đêm và xem lại sáng hôm sau. Chưa bao giờ hối hận vì điều này.`,

// //     // Music / Art / Culture
// //     `Nghe lại album cũ sau 5 năm mới thấy: âm nhạc không chỉ là âm thanh — nó là snapshot của một khoảnh khắc trong cuộc sống bạn. 🎵`,
// //     `There's a specific kind of loneliness that only vinyl collectors understand: when the record ends and you have to get up to flip it, but the song was too good to pause.`,
// //     `Film photography in 2025 feels like a radical act. You get 36 shots. You have to mean it. Slowing down is the whole point. 📷`,

// //     // Environment / Social
// //     `Sau chuyến đi Phú Quốc về, mình không thể không nghĩ đến lượng rác nhựa mình thấy trên biển. Cần làm gì đó, dù nhỏ thôi. 🌊`,
// //     `The climate conversation often forgets the global south — the people least responsible for emissions are the most affected. That's not a talking point. That's injustice.`,

// //     // Relationships
// //     `Bạn thân là người không cần cập nhật context mỗi lần gặp lại. Họ hiểu câu chuyện đang ở chỗ nào dù đã lâu không liên lạc. 🫂`,
// //     `Friendship advice: the people who show up when things are bad > the people who celebrate with you when things are good. Both matter, but scarcity reveals everything.`,
// //     `Long distance relationships taught me that presence isn't always physical. Sometimes it's a voice note at 7am that says "thought of you."`,

// //     // Finance
// //     `Mình bắt đầu đầu tư từ năm 22 tuổi với 1 triệu/tháng. 5 năm sau đây là những gì thực sự xảy ra (không phải highlight reel) 📊`,
// //     `Personal finance tip that saved me: before any purchase over $100, I wait 72 hours. 80% of the time I don't buy it. The other 20% I'm genuinely glad I did.`,

// //     // Misc hot topics
// //     `AI-generated content is flooding the internet and honestly my biggest fear isn't job loss — it's the erosion of genuine human voice online. Are you reading a person right now?`,
// //     `The paradox of choice is real: I have access to every song ever recorded and I still replay the same 40 songs on shuffle. 🔁`,
// //     `Học tiếng Anh không cần phải học ngữ pháp hoàn hảo trước. Cứ nói, cứ sai, cứ sửa. Perfection is the enemy of fluency. 🗣`,
// //     `Sau khi đọc "Deep Work" của Cal Newport, mình đã thay đổi toàn bộ cách làm việc. 4 tiếng tập trung thực sự > 8 tiếng liên tục bị ngắt quãng.`,
// //     `The gym taught me more about discipline than any self-help book. You can't read your way to a deadlift. You have to show up.`,
// // ];

// // const replyPools: string[] = [
// //     // Agreement
// //     `Đồng ý 100%. Đã trải qua điều này rồi và không thể nói hay hơn.`,
// //     `This is the content I come here for. Thank you for saying this out loud.`,
// //     `Chính xác những gì mình đang cần nghe hôm nay. 🙌`,
// //     `Saved this. Going to reread every time I need a reality check.`,
// //     `Mình share cái này cho team rồi. Quá đúng.`,
// //     `Người duy nhất trên internet đang nói thật 😭`,
// //     `Finally someone said it. I've been thinking about this for months.`,
// //     `Thread này đáng được nhiều người đọc hơn.`,

// //     // Questions / Discussion
// //     `Tò mò: bạn đến nhận thức này sau bao lâu làm việc?`,
// //     `Can you expand on this? Especially the part about [context]. I feel like there's a lot more to unpack.`,
// //     `Bạn có gợi ý tài nguyên nào để đọc thêm về cái này không?`,
// //     `What was the turning point for you?`,
// //     `Mình đang ở giai đoạn đầu của hành trình này. Bạn có lời khuyên gì cho người mới không?`,
// //     `Have you written more about this somewhere? Would love to read a longer piece.`,
// //     `Câu hỏi thật sự: điều gì khó nhất để áp dụng trong thực tế?`,
// //     `How long did it take before you noticed actual results?`,

// //     // Personal stories
// //     `Mình đã từng trải qua y hệt vậy. Cảm giác biết mình không phải một mình thật sự rất nhẹ nhõm.`,
// //     `This resonated deeply. I went through something similar last year and it changed everything.`,
// //     `Cái phần về [chi tiết] — mình cần ai đó nói điều đó 3 năm trước. Đã lãng phí bao nhiêu thời gian.`,
// //     `Reading this at 1am after a rough week. Needed this more than I knew.`,
// //     `Bạn vừa mô tả chính xác cuộc sống của mình trong 6 tháng vừa rồi wtf 😭`,
// //     `I screenshot this. Sending to my therapist next session lol.`,
// //     `Đây là lần đầu tiên mình comment trên một bài post vì cảm thấy quá đồng cảm.`,

// //     // Pushback / Different views
// //     `Không hoàn toàn đồng ý — tôi nghĩ có những trường hợp ngoại lệ quan trọng mà bạn đang bỏ qua.`,
// //     `Interesting take but I think the nuance here matters a lot. It really depends on context.`,
// //     `Có một góc nhìn khác: điều này có thể đúng với một số người nhưng không phải tất cả.`,
// //     `Counterpoint: what works for you in your context might not scale. Curious to hear your thoughts on edge cases.`,
// //     `Tôi nghĩ đây hơi oversimplify vấn đề. Reality phức tạp hơn nhiều.`,

// //     // Humor
// //     `Me reading this while doing exactly what you just said not to do 🙃`,
// //     `Bộ não mình: *đọc xong bài này* okay okay tôi hiểu rồi. Bộ não mình lúc 2am: 🤡`,
// //     `I am being called out and I don't appreciate it 😭`,
// //     `Mình đang làm điều ngược lại với mọi thứ bạn vừa nói và bài này tìm thấy mình một cách rất chính xác.`,
// //     `God said let there be a post that personally attacks me today and here we are`,
// //     `Tại sao cái này lại đúng đến mức đau thế? 😂`,
// //     `Thanks I hate it (mình đang nhìn vào gương qua bài post này)`,
// //     `The audacity of this post to be correct`,

// //     // Emojis / Short reactions
// //     `🔥🔥🔥`,
// //     `Cần bookmark cái này ngay. 📌`,
// //     `Screenshotting and printing this. Framing it. 🖼`,
// //     `💯 nothing else to add`,
// //     `Mình cần xăm cái này lên tay 😅`,
// //     `Real ones know 🤝`,
// //     `👏👏👏`,
// //     `Ơn giời cuối cùng cũng có người nói thẳng ra.`,

// //     // Tagging / Sharing intent
// //     `Đang tag mấy người bạn cần đọc cái này.`,
// //     `Gửi cái này cho crush xem có đồng quan điểm không lol`,
// //     `Đang screenshot để dành cho lần sau khi mình quên mất điều này.`,
// //     `Forwarding this to my entire team right now.`,
// //     `Mình vừa gửi link này cho 6 người. Không giải thích thêm.`,
// //     `The group chat is going to explode when I share this.`,

// //     // Follow-up questions
// //     `Phần 2 khi nào ra vậy?`,
// //     `Please write more about this.`,
// //     `Tiếp tục đi bạn ơi! Mình muốn nghe phần còn lại.`,
// //     `There's a book / article / resource on this that I think you'd love — DM me if interested.`,
// //     `Bạn có plan viết thêm về chủ đề này không?`,

// //     // Mixed / Thoughtful
// //     `Tôi đã suy nghĩ về điều này từ góc độ khác: khi chúng ta nói [X], chúng ta thường bỏ qua [Y]. Tò mò muốn biết bạn nghĩ gì.`,
// //     `What you said about the early stages really hits. I'm still in that phase and it's hard to see the light at the end.`,
// //     `Cái insight này tưởng đơn giản nhưng thực ra rất khó để internalize. Cảm ơn bạn đã nhắc.`,
// //     `I've been thinking about this all day since I first read it this morning. Can't shake it.`,
// //     `Bạn có thể nói về cách bạn bắt đầu không? Phần đầu luôn là khó nhất với mình.`,
// //     `There's research backing this up too — the empirical side is fascinating if you want to go deeper.`,
// //     `Mình đồng ý với tinh thần chung nhưng cách thực hiện thì tôi làm khác một chút. Có lẽ context của mỗi người khác nhau.`,
// //     `Beautifully put. I've tried to articulate this feeling for years and you just did it in two sentences.`,
// // ];

// // const quoteCommentaries: string[] = [
// //     `Bài này quan trọng. Mọi người nên đọc. 👇`,
// //     `Cái này cần nhiều người thấy hơn. Reposting với bình luận của tôi:`,
// //     `Adding to this: từ kinh nghiệm cá nhân, tôi có thể xác nhận điều này là đúng.`,
// //     `This deserves more attention. My two cents below 👇`,
// //     `Been sitting on this for a week. Time to add my perspective.`,
// //     `Context from my own experience that might help with this:`,
// //     `Đồng ý và muốn thêm một góc nhìn nữa từ phía mình:`,
// //     `Important thread. Amplifying because more people need to see this.`,
// //     `Mình không thể đọc cái này mà không share kèm ý kiến của mình.`,
// //     `The framing here is interesting. Here's how I think about it differently:`,
// //     `Coming back to share this because it's more relevant now than when it was first posted.`,
// //     `Đã chia sẻ và thêm vài dòng suy nghĩ. Cảm ơn OP vì bài viết này.`,
// //     `Building on this excellent point with a real example from my work:`,
// //     `Muốn share cái này cho community của mình và thêm một chút context:`,
// //     `This aged well. Sharing with commentary because it's even more relevant today.`,
// //     `My team and I discussed this exact thing last week. Here's where we landed:`,
// //     `Đây là bài viết đã thay đổi cách mình nhìn nhận vấn đề. Recommend mọi người đọc.`,
// //     `Couldn't agree more and wanted to add a practical angle to this.`,
// //     `Saving this and amplifying it because the reply section deserves more visibility too.`,
// //     `Resharing because this conversation is worth continuing. My take:`,
// // ];

// // // ---------------------------------------------------------------------------
// // // Helpers
// // // ---------------------------------------------------------------------------

// // function pick<T>(arr: T[]): T {
// //     return arr[Math.floor(Math.random() * arr.length)];
// // }

// // function pickN<T>(arr: T[], n: number): T[] {
// //     const shuffled = [...arr].sort(() => Math.random() - 0.5);
// //     return shuffled.slice(0, n);
// // }

// // function randInt(min: number, max: number) {
// //     return Math.floor(Math.random() * (max - min + 1)) + min;
// // }

// // function makeSnapshot(user: { id: string; username: string; name: string; avatar: string, bio: string | null, verifiedAt: Date }): UserSnapshot {
// //     return {
// //         id: user.id,
// //         username: user.username,
// //         name: user.name,
// //         avatar: user.avatar,
// //         bio: user.bio ?? undefined,
// //         verifiedAt: user.verifiedAt,
// //     };
// // }

// // // ---------------------------------------------------------------------------
// // // Main seed
// // // ---------------------------------------------------------------------------

// // async function main() {
// //     console.log('🌱 Seeding posts…\n');

// //     // --- 1. Load users ---
// //     const users = await prisma.user.findMany({
// //         select: { id: true, username: true, name: true, avatar: true, bio: true, verifiedAt: true },
// //     });

// //     if (users.length === 0) {
// //         throw new Error('No users found. Run user seed first.');
// //     }

// //     console.log(`👥 Found ${users.length} users`);

// //     // --- 2. Create 50 root posts ---
// //     console.log('📝 Creating 50 root posts…');

// //     const contentPool = [...rootContents].sort(() => Math.random() - 0.5);
// //     const rootPosts: Awaited<ReturnType<typeof prisma.post.create>>[] = [];

// //     for (let i = 0; i < 50; i++) {
// //         const author = pick(users);
// //         const content = contentPool[i % contentPool.length];

// //         const post = await prisma.post.create({
// //             data: {
// //                 userId: author.id,
// //                 content,
// //                 type: PostType.POST,
// //                 userSnapshot: makeSnapshot(author),
// //                 replyPermission: pick(['everyone', 'everyone', 'everyone', 'followers', 'mentioned']),
// //                 likesCount: randInt(5, 2400),
// //                 repliesCount: 0, // will update after
// //                 repostsCountAndQuoteCount: randInt(0, 180),
// //                 viewsCount: randInt(200, 45000),
// //             },
// //         });

// //         rootPosts.push(post);
// //         process.stdout.write(`\r  ✅ Root posts: ${i + 1} / 50`);
// //     }

// //     console.log('\n');

// //     // --- 3. Create ~30 replies per root post ---
// //     console.log('💬 Creating replies…');

// //     let totalReplies = 0;

// //     for (const rootPost of rootPosts) {
// //         const replyCount = randInt(25, 35);
// //         const replyAuthors = pickN(users, Math.min(replyCount, users.length));

// //         const firstLevelReplies: Awaited<ReturnType<typeof prisma.post.create>>[] = [];

// //         for (let r = 0; r < replyCount; r++) {
// //             const author = replyAuthors[r % replyAuthors.length];

// //             // 70% direct reply to root, 30% nested reply to a previous reply
// //             const isNested = r > 3 && Math.random() < 0.3 && firstLevelReplies.length > 0;
// //             const parent = isNested ? pick(firstLevelReplies) : rootPost;

// //             const reply = await prisma.post.create({
// //                 data: {
// //                     userId: author.id,
// //                     content: pick(replyPools),
// //                     type: PostType.REPLY,
// //                     parentId: parent.id,
// //                     parentPublicId: parent.publicId,
// //                     rootPostId: rootPost.id,
// //                     rootPublicId: rootPost.publicId,
// //                     originPostId: null,
// //                     userSnapshot: makeSnapshot(author),
// //                     replyPermission: 'everyone',
// //                     likesCount: randInt(0, 320),
// //                     repliesCount: 0,
// //                     repostsCountAndQuoteCount: randInt(0, 20),
// //                     viewsCount: randInt(50, 5000),
// //                 },
// //             });

// //             if (!isNested) firstLevelReplies.push(reply);
// //             totalReplies++;
// //         }

// //         // Update repliesCount on root post
// //         await prisma.post.update({
// //             where: { id: rootPost.id },
// //             data: { repliesCount: replyCount },
// //         });

// //         process.stdout.write(`\r  💬 Replies created: ${totalReplies}`);
// //     }

// //     console.log('\n');

// //     // --- 4. Create ~25 quote posts ---
// //     console.log('🔁 Creating quote posts…');

// //     const quotePosts = pickN(rootPosts, 25);

// //     for (let q = 0; q < quotePosts.length; q++) {
// //         const origin = quotePosts[q];
// //         const author = pick(users.filter((u) => u.id !== origin.userId));

// //         await prisma.post.create({
// //             data: {
// //                 userId: author.id,
// //                 content: pick(quoteCommentaries),
// //                 type: PostType.QUOTE,
// //                 isQuote: true,
// //                 originPostId: origin.id,
// //                 originPublicId: origin.publicId,
// //                 userSnapshot: makeSnapshot(author),
// //                 replyPermission: 'everyone',
// //                 likesCount: randInt(2, 480),
// //                 repliesCount: randInt(0, 15),
// //                 repostsCountAndQuoteCount: randInt(0, 30),
// //                 viewsCount: randInt(100, 8000),
// //             },
// //         });

// //         // Update repostsCountAndQuoteCount on origin
// //         await prisma.post.update({
// //             where: { id: origin.id },
// //             data: { repostsCountAndQuoteCount: { increment: 1 } },
// //         });

// //         process.stdout.write(`\r  🔁 Quote posts: ${q + 1} / ${quotePosts.length}`);
// //     }

// //     console.log('\n');

// //     // --- Summary ---
// //     const postCount = await prisma.post.count();
// //     console.log(`\n🎉 Done!`);
// //     console.log(`   📝 Root posts  : 50`);
// //     console.log(`   💬 Replies     : ${totalReplies}`);
// //     console.log(`   🔁 Quote posts : ${quotePosts.length}`);
// //     console.log(`   📦 Total posts : ${postCount}`);
// // }

// // main()
// //     .catch((e) => {
// //         console.error(e);
// //         process.exit(1);
// //     })
// //     .finally(() => prisma.$disconnect());
// // // Realistic post templates - mix Vietnamese and English
// // const postTemplates = [
// //     // Tech / Dev
// //     "Hôm nay debug cả ngày mới tìm ra bug, hoá ra chỉ thiếu một dấu chấm phẩy 😭 #coding #developer",
// //     "Just shipped a feature I've been working on for 2 weeks. The feeling is unmatched 🚀",
// //     "TypeScript đôi khi làm tôi phát điên nhưng không có nó thì còn phát điên hơn 😂",
// //     "Mọi người đang dùng framework gì cho side project? Tôi đang cân nhắc giữa Next.js và Nuxt",
// //     "Code review culture is so important. A good review can teach you more than any tutorial.",
// //     "3 giờ sáng vẫn còn code, deadline mai rồi 💀",
// //     "Prisma + PostgreSQL combo is genuinely underrated for indie projects",
// //     "Ai có kinh nghiệm với Redis Pub/Sub cho real-time features không? Đang implement notification system",
// //     "Clean code is not about being clever. It's about being clear.",
// //     "Vừa migrate từ REST sang GraphQL, đúng là có nhiều trade-offs hơn tôi nghĩ",

// //     // Life / Personal
// //     "Sáng nay cà phê ngon quá, cả ngày có động lực ☕",
// //     "Work from home sau 2 năm vẫn chưa quen được cái khoản tự kỷ luật 😅",
// //     "Cuối tuần mà vẫn ngồi nghĩ về công việc, ai cũng vậy không?",
// //     "Hà Nội mưa cả ngày, perfect excuse to stay in and read books 📚",
// //     "TGIF! What are everyone's plans for the weekend?",
// //     "Đôi khi chỉ cần một buổi chiều không làm gì, không nghĩ gì là đủ rồi",
// //     "Vừa đặt vé đi Đà Lạt tháng sau, ai có chỗ nào hay recommend không?",
// //     "The older I get, the more I appreciate slow mornings",
// //     "Gym 3 tháng liên tục không nghỉ ngày nào, cảm giác tự hào ghê 💪",
// //     "Cooking at home > eating out. Change my mind.",

// //     // Opinions / Thoughts
// //     "Hot take: meetings that could be emails are stealing people's most productive hours",
// //     "Người ta hay nói 'fake it till you make it' nhưng tôi nghĩ 'learn it till you become it' thực tế hơn",
// //     "The best investment you can make is in yourself. Sounds cliche but it's true.",
// //     "Quiet quitting không phải là lười, đôi khi chỉ là đang bảo vệ sức khoẻ tinh thần",
// //     "Social media làm cho chúng ta so sánh cuộc sống thật của mình với highlight reel của người khác",
// //     "Vulnerability is not weakness. It takes courage to be honest about struggles.",
// //     "Tôi thấy Gen Z có work-life balance mindset tốt hơn thế hệ trước rất nhiều",
// //     "Imposter syndrome hits different when you're the only one who knows how fake you feel 😭",
// //     "The world would be better if people were just a little kinder online",
// //     "Passion follows mastery, not the other way around. Stop waiting to feel passionate first.",

// //     // Questions / Engagement
// //     "Mọi người học tiếng Anh bằng cách nào hiệu quả nhất? Đang tìm cách cải thiện speaking",
// //     "Best productivity app you've used this year? I've tried too many and nothing sticks",
// //     "Netflix hay đang xem series gì hay không? Đã xem hết mọi thứ trong watchlist rồi 😭",
// //     "Ai có kinh nghiệm freelance không? Đang tính chuyển từ fulltime sang",
// //     "What's one book that genuinely changed how you think?",
// //     "Sài Gòn vs Hà Nội, mọi người thích sống ở đâu hơn và tại sao?",
// //     "Remote work or office? What do you prefer after experiencing both?",
// //     "Mọi người tự học AI/ML bằng tài liệu gì? Đang bắt đầu từ zero",

// //     // Casual / Humor
// //     "Me before coffee: 😵 Me after coffee: 😵‍💫",
// //     "Vừa xem lại code của mình 6 tháng trước... xin lỗi tôi của tương lai 😅",
// //     "The audacity of bugs appearing only in production 🙃",
// //     "Hôm nay productive không? Tôi thì productive trong việc lướt Twitter 💀",
// //     "When the designer says 'just make it pop' 🫠",
// //     "Monday energy: 💀 Friday energy: 💀 but different",
// //     "Ăn sáng 1 mình nhìn điện thoại vs ăn sáng cùng bạn bè nói chuyện thật... gen Z chúng mình đang mất dần cái gì đó rồi",
// //     "2024 taught me: done is better than perfect. Still unlearning perfectionism daily.",
// //     "Why do the best ideas always come in the shower?",
// //     "Đặt alarm 6am để tập thể dục, tắt alarm, ngủ tiếp. Mỗi. Sáng.",
// // ];

// // // Reply templates
// // const replyTemplates = [
// //     "Tôi cũng vậy! Đồng cảm quá 😂",
// //     "Agree 100%! Đã share cho team rồi",
// //     "This is so relatable omg",
// //     "Haha same!! Mỗi ngày đều như vậy",
// //     "Trời ơi đúng không thể đúng hơn 😭",
// //     "Hot take nhưng đúng 👏",
// //     "Bro cần ngủ đi 😭",
// //     "Skill issue thôi bạn ơi 😂",
// //     "Okay this made my day 😂",
// //     "Sự thật đau lòng nhưng phải công nhận",
// //     "Chờ tôi note lại cái này",
// //     "Đây là lý do tôi follow bạn 🔥",
// //     "Real talk fr fr",
// //     "Mình cũng đang như vậy, solidarity 🫂",
// //     "Unpopular opinion but I agree with this",
// //     "Cái cuối cùng là cái cần nhất 😂",
// //     "Touch grass bestie 🌿",
// //     "This post found me at the right time",
// //     "Nói thay cho bao nhiêu người luôn 👏",
// //     "Okay but seriously though, facts",
// // ];

// // // Quote post additions
// // const quoteAdditions = [
// //     "Thêm vào này:",
// //     "Có thêm một điều nữa là...",
// //     "True, và thực ra còn hơn thế:",
// //     "Relate quá, nhưng cũng cần nói thêm:",
// //     "Ý này hay, extend thêm chút:",
// // ];

// // async function main() {
// //     console.log("🌱 Fetching existing users...");

// //     const users = await prisma.user.findMany({
// //         where: { deletedAt: null, status: "ACTIVE" },
// //         select: { id: true, username: true, name: true },
// //         take: 50,
// //     });

// //     if (users.length === 0) {
// //         console.error("❌ No users found! Please seed users first.");
// //         process.exit(1);
// //     }

// //     console.log(`✅ Found ${users.length} users`);

// //     const shuffle = <T>(arr: T[]): T[] =>
// //         arr
// //             .map((v) => ({ v, sort: Math.random() }))
// //             .sort((a, b) => a.sort - b.sort)
// //             .map(({ v }) => v);

// //     const randomUser = () => users[Math.floor(Math.random() * users.length)];
// //     const randomItem = <T>(arr: T[]): T =>
// //         arr[Math.floor(Math.random() * arr.length)];

// //     const shuffledTemplates = shuffle([...postTemplates]);
// //     const targetThreads = Math.min(50, shuffledTemplates.length);

// //     console.log(`\n📝 Creating ${targetThreads} threads...`);

// //     const createdPosts: number[] = [];

// //     for (let i = 0; i < targetThreads; i++) {
// //         const author = randomUser();
// //         const content = shuffledTemplates[i];

// //         // Randomize created time within last 30 days
// //         const daysAgo = Math.floor(Math.random() * 30);
// //         const hoursAgo = Math.floor(Math.random() * 24);
// //         const createdAt = new Date(
// //             Date.now() - daysAgo * 86400000 - hoursAgo * 3600000
// //         );

// //         // Create root post
// //         const post = await prisma.post.create({
// //             data: {
// //                 userId: author.id,
// //                 content,
// //                 type: PostType.POST,
// //                 createdAt,
// //                 updatedAt: createdAt,
// //             },
// //         });

// //         createdPosts.push(post.id);
// //         process.stdout.write(`  ✓ Thread ${i + 1}/${targetThreads} (ID: ${post.id}) by @${author.username}\n`);

// //         // Add 1-5 replies
// //         const replyCount = Math.floor(Math.random() * 5) + 1;
// //         let lastReplyId = post.id;
// //         let rootId = post.id;

// //         for (let r = 0; r < replyCount; r++) {
// //             const replier = randomUser();
// //             const replyContent = randomItem(replyTemplates);
// //             const replyAt = new Date(createdAt.getTime() + (r + 1) * 600000 * (Math.random() + 0.5));

// //             const reply = await prisma.post.create({
// //                 data: {
// //                     userId: replier.id,
// //                     content: replyContent,
// //                     type: PostType.REPLY,
// //                     parentId: r === 0 ? post.id : lastReplyId,
// //                     rootPostId: rootId,
// //                     createdAt: replyAt,
// //                     updatedAt: replyAt,
// //                 },
// //             });

// //             // Update parent reply count
// //             await prisma.post.update({
// //                 where: { id: r === 0 ? post.id : lastReplyId },
// //                 data: { repliesCount: { increment: 1 } },
// //             });

// //             lastReplyId = reply.id;
// //         }

// //         // 30% chance of quote post
// //         if (Math.random() < 0.3 && i > 0) {
// //             const quotedId = createdPosts[Math.floor(Math.random() * createdPosts.length)];
// //             const quoter = randomUser();
// //             const quoteAt = new Date(createdAt.getTime() + Math.random() * 3600000 * 5);

// //             await prisma.post.create({
// //                 data: {
// //                     userId: quoter.id,
// //                     content: `${randomItem(quoteAdditions)} ${randomItem(replyTemplates)}`,
// //                     type: PostType.QUOTE,
// //                     originPostId: quotedId,
// //                     createdAt: quoteAt,
// //                     updatedAt: quoteAt,
// //                 },
// //             });

// //             await prisma.post.update({
// //                 where: { id: quotedId },
// //                 data: { repostsCountAndQuoteCount: { increment: 1 } },
// //             });
// //         }

// //         // 20% chance of repost
// //         if (Math.random() < 0.2 && i > 0) {
// //             const repostedId = createdPosts[Math.floor(Math.random() * createdPosts.length)];
// //             const reposter = randomUser();
// //             const repostAt = new Date(createdAt.getTime() + Math.random() * 3600000 * 3);

// //             // Get original content for snapshot
// //             const original = await prisma.post.findUnique({
// //                 where: { id: repostedId },
// //                 include: { user: { select: { id: true, username: true, name: true, avatar: true, bio: true, verifiedAt: true } } },
// //             });

// //             if (original) {
// //                 await prisma.post.create({
// //                     data: {
// //                         userId: reposter.id,
// //                         content: original.content,
// //                         type: PostType.REPOST,
// //                         originPostId: repostedId,
// //                         userSnapshot: {
// //                             id: original.user.id,
// //                             username: original.user.username,
// //                             name: original.user.name,
// //                             avatar: original.user.avatar,
// //                             bio: original.user.bio,
// //                             verifiedAt: original.user.verifiedAt,
// //                         },
// //                         createdAt: repostAt,
// //                         updatedAt: repostAt,
// //                     },
// //                 });

// //                 await prisma.post.update({
// //                     where: { id: repostedId },
// //                     data: { repostsCountAndQuoteCount: { increment: 1 } },
// //                 });
// //             }
// //         }

// //         // Add random likes
// //         const likeCount = Math.floor(Math.random() * 15);
// //         const likers = shuffle([...users]).slice(0, likeCount);

// //         for (const liker of likers) {
// //             if (liker.id === author.id) continue;
// //             try {
// //                 await prisma.like.create({
// //                     data: { userId: liker.id, postId: post.publicId },
// //                 });
// //             } catch { } // ignore duplicate
// //         }

// //         if (likeCount > 0) {
// //             await prisma.post.update({
// //                 where: { id: post.id },
// //                 data: { likesCount: likeCount },
// //             });
// //         }
// //     }

// //     const totalPosts = await prisma.post.count();
// //     const totalLikes = await prisma.like.count();

// //     console.log(`\n🎉 Done!`);
// //     console.log(`   📬 Total posts in DB: ${totalPosts}`);
// //     console.log(`   ❤️  Total likes in DB: ${totalLikes}`);
// //     console.log(`   🧵 Threads created: ${targetThreads}`);
// // }

// // main()
// //     .catch((e) => {
// //         console.error(e);
// //         process.exit(1);
// //     })
// //     .finally(() => prisma.$disconnect());

// // import * as bcrypt from 'bcrypt';

// // const users = [
// //     // --- Việt Nam ---
// //     { email: 'nguyenvanminh@gmail.com', username: 'minhvn.photo', name: 'Nguyễn Văn Minh', bio: 'Nhiếp ảnh gia tự do | Hà Nội 📷', location: 'Hà Nội', website: 'https://minhphoto.vn' },
// //     { email: 'tranthilan@gmail.com', username: 'lanthilan', name: 'Trần Thị Lan', bio: 'Coffee lover ☕ | Sống chậm thôi', location: 'TP. HCM', website: null },
// //     { email: 'phamquochung99@gmail.com', username: 'quochung.dev', name: 'Phạm Quốc Hùng', bio: 'Backend dev 🛠 | Open source fan', location: 'Đà Nẵng', website: 'https://github.com/quochung' },
// //     { email: 'lehuongtra@outlook.com', username: 'huongtrale', name: 'Lê Hương Trà', bio: 'Yêu bếp núc 🍜 | Foodie Saigon', location: 'TP. HCM', website: null },
// //     { email: 'votienbao@gmail.com', username: 'bao.travels', name: 'Võ Tiến Bảo', bio: 'Du lịch bụi khắp Đông Nam Á 🌏', location: 'Cần Thơ', website: 'https://baotravels.blog' },
// //     { email: 'dinhthanhmai@gmail.com', username: 'mai.designs', name: 'Đinh Thanh Mai', bio: 'UI/UX Designer | Figma addict 🎨', location: 'Hà Nội', website: 'https://maidsgn.com' },
// //     { email: 'buiminhtuan2k@gmail.com', username: 'tuanbikelife', name: 'Bùi Minh Tuấn', bio: 'Xe đạp, núi rừng & tự do 🚴', location: 'Đà Lạt', website: null },
// //     { email: 'ngothihuyen.hn@gmail.com', username: 'huyenngo.life', name: 'Ngô Thị Huyền', bio: 'Giáo viên tiếng Anh | Sách & cà phê 📚', location: 'Hà Nội', website: null },
// //     { email: 'hoangduchuy@gmail.com', username: 'duchuy_fit', name: 'Hoàng Đức Huy', bio: 'PT cá nhân 💪 | Healthy lifestyle', location: 'TP. HCM', website: 'https://duchuyfit.com' },
// //     { email: 'caothianhthu@gmail.com', username: 'anhthu.crochet', name: 'Cao Thị Anh Thư', bio: 'Handmade lover 🧶 | Mèo & len sợi', location: 'Huế', website: null },

// //     // --- International mix ---
// //     { email: 'james.wright@gmail.com', username: 'jwright.creates', name: 'James Wright', bio: 'Filmmaker & storyteller 🎬 | LA based', location: 'Los Angeles, CA', website: 'https://jwrightfilm.com' },
// //     { email: 'sofia.reyes93@gmail.com', username: 'sofiareyes', name: 'Sofía Reyes', bio: 'Bailarina 💃 | Madrid | Tacos > everything', location: 'Madrid, Spain', website: null },
// //     { email: 'luca.ferretti@icloud.com', username: 'lucaf.archi', name: 'Luca Ferretti', bio: 'Architecture student 🏛 | Milan | Coffee snob', location: 'Milan, Italy', website: null },
// //     { email: 'priya.sharma.in@gmail.com', username: 'priya.codes', name: 'Priya Sharma', bio: 'Full-stack dev 👩‍💻 | Chai > coffee always', location: 'Bangalore, India', website: 'https://priyasharma.dev' },
// //     { email: 'tommy.nguyen.sg@gmail.com', username: 'tommyngsg', name: 'Tommy Nguyen', bio: 'Finance by day, DJ by night 🎧 | Singapore', location: 'Singapore', website: null },
// //     { email: 'emily.chen.nyc@gmail.com', username: 'emchen.art', name: 'Emily Chen', bio: 'Illustrator & zine maker ✏️ | Brooklyn', location: 'New York, NY', website: 'https://emchen.art' },
// //     { email: 'carlos.mendoza.mx@gmail.com', username: 'carlitos.mxfit', name: 'Carlos Mendoza', bio: 'Crossfit coach 🏋️ | CDMX | Dog dad 🐕', location: 'Mexico City', website: null },
// //     { email: 'aisha.okonkwo@gmail.com', username: 'aisha.writes', name: 'Aisha Okonkwo', bio: 'Journalist & poet ✍️ | Lagos → London', location: 'London, UK', website: 'https://aishaink.com' },
// //     { email: 'henrik.larsson@outlook.com', username: 'henrikl.outdoors', name: 'Henrik Larsson', bio: 'Hiking, kayaking & fika ☕ | Göteborg', location: 'Gothenburg, SE', website: null },
// //     { email: 'yuki.tanaka.jp@gmail.com', username: 'yukitanaka_art', name: 'Yuki Tanaka', bio: '漫画家 🎌 | Tokyo | Ramen enthusiast', location: 'Tokyo, Japan', website: 'https://yukitanaka.jp' },

// //     { email: 'alex.morrison.ca@gmail.com', username: 'alexm.photo', name: 'Alex Morrison', bio: 'Landscape photography 🏔 | Vancouver', location: 'Vancouver, CA', website: 'https://alexmphotos.ca' },
// //     { email: 'nina.petrova.ru@gmail.com', username: 'ninaptrv', name: 'Nina Petrova', bio: 'Book translator 📖 | St. Petersburg | Cats 🐈', location: 'St. Petersburg', website: null },
// //     { email: 'kwame.asante.gh@gmail.com', username: 'kwame.builds', name: 'Kwame Asante', bio: 'Civil engineer 🏗 | Accra | Afrobeats fan', location: 'Accra, Ghana', website: null },
// //     { email: 'isabelle.martin@gmail.com', username: 'isa.patisserie', name: 'Isabelle Martin', bio: 'Pâtissière 🥐 | Lyon | Sucrée et salée', location: 'Lyon, France', website: 'https://isapatisserie.fr' },
// //     { email: 'rajan.patel.uk@gmail.com', username: 'rajanpatel_dev', name: 'Rajan Patel', bio: 'DevOps @ fintech 🚀 | London | Chess ♟', location: 'London, UK', website: null },
// //     { email: 'mia.hoffmann.de@gmail.com', username: 'miahoff.design', name: 'Mia Hoffmann', bio: 'Graphic designer 🎨 | Berlin | Vegan life 🌱', location: 'Berlin, Germany', website: 'https://miahoff.de' },
// //     { email: 'omar.hassan.eg@gmail.com', username: 'omar.h.writes', name: 'Omar Hassan', bio: 'Screenwriter ✍️ | Cairo → Dubai | Film buff', location: 'Dubai, UAE', website: null },
// //     { email: 'sarah.kim.kr@gmail.com', username: 'sarahkim.seoul', name: 'Sarah Kim', bio: 'K-beauty blogger 💄 | Seoul | Skincare junkie', location: 'Seoul, Korea', website: 'https://sarahkimbeauty.com' },
// //     { email: 'marco.esposito.it@gmail.com', username: 'marcoespo.run', name: 'Marco Esposito', bio: 'Marathon runner 🏃 | Naples | Pizza scout 🍕', location: 'Naples, Italy', website: null },
// //     { email: 'fatima.ali.pk@gmail.com', username: 'fatimaali.style', name: 'Fatima Ali', bio: 'Fashion designer 👗 | Lahore | Sustainable', location: 'Lahore, Pakistan', website: 'https://fatimaalifashion.com' },

// //     { email: 'daniel.osei.gh@gmail.com', username: 'danosei.tech', name: 'Daniel Osei', bio: 'iOS dev 📱 | Kumasi | Afrofusion cooking 🍲', location: 'Kumasi, Ghana', website: 'https://github.com/danosei' },
// //     { email: 'liu.yang.sh@gmail.com', username: 'liuyang_sh', name: 'Liu Yang', bio: '上海 | 咖啡 & 爵士乐 🎷 | Startup founder', location: 'Shanghai, China', website: null },
// //     { email: 'anna.kowalska@gmail.com', username: 'annakowalska.art', name: 'Anna Kowalska', bio: 'Ceramicist 🏺 | Kraków | Slow living advocate', location: 'Kraków, Poland', website: 'https://annakowalska.pl' },
// //     { email: 'jose.ruiz.es@gmail.com', username: 'joseruiz.chef', name: 'José Ruiz', bio: 'Chef & food critic 🍽 | Barcelona | Pintxos fan', location: 'Barcelona, Spain', website: null },
// //     { email: 'amara.diallo.sn@gmail.com', username: 'amaradiallo', name: 'Amara Diallo', bio: 'NGO worker 🌍 | Dakar | Music & community', location: 'Dakar, Senegal', website: null },
// //     { email: 'elena.ivanova.bg@gmail.com', username: 'elena.ivanova', name: 'Elena Ivanova', bio: 'Data scientist 📊 | Sofia | Hiking & jazz', location: 'Sofia, Bulgaria', website: 'https://elenaivanova.io' },
// //     { email: 'jake.thompson@gmail.com', username: 'jakethompson.fit', name: 'Jake Thompson', bio: 'Personal trainer 💪 | Austin TX | BBQ king 🔥', location: 'Austin, TX', website: null },
// //     { email: 'yuna.park.kr@gmail.com', username: 'yunapark.art', name: 'Yuna Park', bio: 'Webtoon artist 🎨 | Busan | Matcha addict 🍵', location: 'Busan, Korea', website: 'https://yunapark.krcomic' },
// //     { email: 'victor.obi.ng@gmail.com', username: 'victor.obi', name: 'Victor Obi', bio: 'Software architect ⚙️ | Lagos | Afrobeats 🎵', location: 'Lagos, Nigeria', website: 'https://victorobi.dev' },
// //     { email: 'rachel.green.uk@gmail.com', username: 'rachelg.books', name: 'Rachel Green', bio: 'Librarian & book blogger 📚 | Oxford | Tea ☕', location: 'Oxford, UK', website: 'https://rachelreads.co.uk' },

// //     { email: 'mikael.bjorn@gmail.com', username: 'mikaelbjorn', name: 'Mikael Björn', bio: 'Sound engineer 🎚 | Stockholm | Metal & nature', location: 'Stockholm, SE', website: null },
// //     { email: 'deepika.nair@gmail.com', username: 'deepika.nair', name: 'Deepika Nair', bio: 'UX researcher 🔍 | Chennai | Dance & coffee', location: 'Chennai, India', website: null },
// //     { email: 'gabriel.silva.br@gmail.com', username: 'gabsilva.foto', name: 'Gabriel Silva', bio: 'Fotógrafo 📸 | São Paulo | Samba & futebol ⚽', location: 'São Paulo, Brazil', website: 'https://gabsilva.com.br' },
// //     { email: 'nour.el.said.eg@gmail.com', username: 'nourels', name: 'Nour El-Said', bio: 'Architect 🏛 | Cairo | Street photography', location: 'Cairo, Egypt', website: null },
// //     { email: 'sophie.dumont@gmail.com', username: 'sophiedumont', name: 'Sophie Dumont', bio: 'Marketing manager 📣 | Paris | Yoga & wine 🍷', location: 'Paris, France', website: null },
// //     { email: 'arjun.mehta.in@gmail.com', username: 'arjunmehta.dev', name: 'Arjun Mehta', bio: 'ML engineer 🤖 | Mumbai | Chess & cricket 🏏', location: 'Mumbai, India', website: 'https://arjunmehta.dev' },
// //     { email: 'chloe.evans.au@gmail.com', username: 'chloeevans.au', name: 'Chloe Evans', bio: 'Marine biologist 🐠 | Sydney | Surf & science', location: 'Sydney, Australia', website: null },
// //     { email: 'igor.smirnov.ru@gmail.com', username: 'igorsmirnov', name: 'Igor Smirnov', bio: 'Game dev 🕹 | Moscow | Indie games & vodka', location: 'Moscow, Russia', website: 'https://igorgames.itch.io' },
// //     { email: 'amelia.jones.us@gmail.com', username: 'ameliaj.wellness', name: 'Amelia Jones', bio: 'Nutritionist 🥑 | Portland OR | Plant-based', location: 'Portland, OR', website: 'https://ameliawellness.com' },
// //     { email: 'tariq.hassan.ae@gmail.com', username: 'tariqh.biz', name: 'Tariq Hassan', bio: 'Entrepreneur 💼 | Dubai | Falcon & falcon 🦅', location: 'Dubai, UAE', website: 'https://tariqhassan.ae' },

// //     { email: 'zara.ahmed.uk@gmail.com', username: 'zaraahmed', name: 'Zara Ahmed', bio: 'Journalist 📰 | Manchester | Poetry & tea ☕', location: 'Manchester, UK', website: null },
// //     { email: 'paulo.lima.br@gmail.com', username: 'paulolima.beats', name: 'Paulo Lima', bio: 'Músico & produtor 🎹 | Rio | Bossa nova lover', location: 'Rio de Janeiro', website: 'https://paulolima.music' },
// //     { email: 'han.jiyeon.kr@gmail.com', username: 'jiyeonhan', name: 'Han Ji-yeon', bio: '여행 & 필름 카메라 📷 | 서울 | 커피 홀릭', location: 'Seoul, Korea', website: null },
// //     { email: 'tobias.muller.de@gmail.com', username: 'tobias.muller', name: 'Tobias Müller', bio: 'Physicist 🔬 | Hamburg | Cycling & sci-fi 📚', location: 'Hamburg, Germany', website: null },
// //     { email: 'grace.otieno.ke@gmail.com', username: 'graceotieno', name: 'Grace Otieno', bio: 'Nurse & advocate 💙 | Nairobi | Faith & family', location: 'Nairobi, Kenya', website: null },
// //     { email: 'rafael.moreno.co@gmail.com', username: 'rafamoreno.arq', name: 'Rafael Moreno', bio: 'Arquitecto 🏠 | Medellín | Café & cumbia ☕', location: 'Medellín, Colombia', website: null },
// //     { email: 'mei.lin.tw@gmail.com', username: 'meilin.tw', name: 'Mei Lin', bio: '台灣 🇹🇼 | 烘焙控 🍞 | 貓 & 茶 | Slow living', location: 'Taipei, Taiwan', website: 'https://meilinbakes.com' },
// //     { email: 'liam.obrien.ie@gmail.com', username: 'liamobrien.ie', name: 'Liam O\'Brien', bio: 'Pub quiz champion 🍺 | Dublin | Rugby & code', location: 'Dublin, Ireland', website: null },
// //     { email: 'sana.malik.pk@gmail.com', username: 'sana.malik.art', name: 'Sana Malik', bio: 'Digital artist 🎨 | Karachi | Inspired by chaos', location: 'Karachi, Pakistan', website: 'https://sanamalikart.com' },

// //     { email: 'elias.berg.no@gmail.com', username: 'eliasbergno', name: 'Elias Berg', bio: 'Fisherman & writer ✍️ | Bergen | Cold waters 🐟', location: 'Bergen, Norway', website: null },
// //     { email: 'camille.rousseau@gmail.com', username: 'camillerou', name: 'Camille Rousseau', bio: 'Photographe 📷 | Bordeaux | Vin & voyages 🍷', location: 'Bordeaux, France', website: 'https://camillerousseau.fr' },
// //     { email: 'adebayo.adeleke@gmail.com', username: 'bayo.codes', name: 'Adebayo Adeleke', bio: 'Frontend dev ⚡ | Abuja | Music & Manchester Utd', location: 'Abuja, Nigeria', website: 'https://github.com/bayocodes' },
// //     { email: 'natasha.brown.us@gmail.com', username: 'natasha.b.writes', name: 'Natasha Brown', bio: 'Copywriter & brand strategist ✏️ | Chicago', location: 'Chicago, IL', website: 'https://natashab.com' },
// //     { email: 'hyun.woo.kr@gmail.com', username: 'hyunwoo.music', name: 'Hyun-woo Choi', bio: '밴드 기타리스트 🎸 | 홍대 | 인디음악 & 고양이', location: 'Seoul, Korea', website: null },
// //     { email: 'giovanni.russo.it@gmail.com', username: 'gio.russo', name: 'Giovanni Russo', bio: 'Chef 👨‍🍳 | Roma | Pasta is religion 🍝', location: 'Rome, Italy', website: null },
// //     { email: 'astrid.h@gmail.com', username: 'astridh.dk', name: 'Astrid Hansen', bio: 'Interior designer 🛋 | Copenhagen | Hygge life', location: 'Copenhagen, DK', website: 'https://astridhansen.dk' },
// //     { email: 'jerome.nkosi.za@gmail.com', username: 'jerome.nkosi', name: 'Jerome Nkosi', bio: 'Entrepreneur & DJ 🎧 | Cape Town | Waves 🌊', location: 'Cape Town, SA', website: null },
// //     { email: 'valentina.cruz.ar@gmail.com', username: 'vale.cruz.ba', name: 'Valentina Cruz', bio: 'Psicóloga 🧠 | Buenos Aires | Mate & tango 💃', location: 'Buenos Aires, AR', website: null },
// //     { email: 'samuel.chen.us@gmail.com', username: 'samchen.product', name: 'Samuel Chen', bio: 'Product manager 📋 | San Francisco | VC curious', location: 'San Francisco, CA', website: 'https://samuelchen.xyz' },

// //     { email: 'ines.ferreira.pt@gmail.com', username: 'inesferreira.pt', name: 'Inês Ferreira', bio: 'Fadista & professora 🎵 | Lisboa | Mar & saudade', location: 'Lisbon, Portugal', website: null },
// //     { email: 'dmitri.volkov.ru@gmail.com', username: 'dmitrivolkov', name: 'Dmitri Volkov', bio: 'Cybersec researcher 🔐 | Novosibirsk | CTF ⚡', location: 'Novosibirsk, RU', website: 'https://github.com/dvolkov' },
// //     { email: 'akosua.boateng.gh@gmail.com', username: 'akosua.boateng', name: 'Akosua Boateng', bio: 'Fashion blogger 👗 | Accra | Kente & culture', location: 'Accra, Ghana', website: 'https://akosuastyle.com' },
// //     { email: 'finn.mccarthy.au@gmail.com', username: 'finnmccarthy.au', name: 'Finn McCarthy', bio: 'Surfer & barista ☀️ | Gold Coast | Saltwater', location: 'Gold Coast, AU', website: null },
// //     { email: 'lena.vogel.de@gmail.com', username: 'lenavogel.berlin', name: 'Lena Vogel', bio: 'Startup founder 🚀 | Berlin | Oat milk flat white', location: 'Berlin, Germany', website: 'https://lenavogel.com' },
// //     { email: 'kwabena.owusu.gh@gmail.com', username: 'kwabena.owusu', name: 'Kwabena Owusu', bio: 'Law student ⚖️ | Kumasi | Football & hip-hop', location: 'Kumasi, Ghana', website: null },
// //     { email: 'hana.suzuki.jp@gmail.com', username: 'hana.suzuki.jp', name: 'Hana Suzuki', bio: 'Florist & content creator 🌸 | Kyoto | Ikebana', location: 'Kyoto, Japan', website: 'https://hanasuzuki.jp' },
// //     { email: 'pedro.alves.br@gmail.com', username: 'pedroalves.br', name: 'Pedro Alves', bio: 'Dev & gamer 🎮 | Brasília | Pixel art lover', location: 'Brasília, Brazil', website: 'https://github.com/pedroalvesbr' },
// //     { email: 'nadia.el.amrani@gmail.com', username: 'nadia.elamrani', name: 'Nadia El Amrani', bio: 'Architect & artist 🏛 | Casablanca | Zellige 🕌', location: 'Casablanca, MA', website: null },
// //     { email: 'oscar.lindqvist@gmail.com', username: 'oscar.lq', name: 'Oscar Lindqvist', bio: 'Economist 📈 | Malmö | Running & podcast 🎙', location: 'Malmö, Sweden', website: null },

// //     { email: 'tiffany.wu.us@gmail.com', username: 'tiffanywu.eats', name: 'Tiffany Wu', bio: 'Food content creator 🍜 | LA | Dim sum always', location: 'Los Angeles, CA', website: 'https://tiffanywueats.com' },
// //     { email: 'esteban.vargas.cr@gmail.com', username: 'esteban.vargas', name: 'Esteban Vargas', bio: 'Biólogo 🌿 | San José | Bosques & pura vida 🦜', location: 'San José, CR', website: null },
// //     { email: 'layla.ibrahim.eg@gmail.com', username: 'layla.ibrahim', name: 'Layla Ibrahim', bio: 'UX designer 💡 | Cairo | Arabic calligraphy ✒️', location: 'Cairo, Egypt', website: 'https://layla.design' },
// //     { email: 'max.schneider.at@gmail.com', username: 'maxschneider.at', name: 'Max Schneider', bio: 'Ski instructor ⛷ | Innsbruck | Alps & espresso', location: 'Innsbruck, AT', website: null },
// //     { email: 'amina.touré.ml@gmail.com', username: 'amina.toure', name: 'Amina Touré', bio: 'Journalist & activist 📰 | Bamako | Words matter', location: 'Bamako, Mali', website: null },
// //     { email: 'oliver.james.uk@gmail.com', username: 'oliverjames.uk', name: 'Oliver James', bio: 'Economist → Podcaster 🎙 | London | Long-form', location: 'London, UK', website: 'https://oliverjamespod.com' },
// //     { email: 'zanele.dlamini.za@gmail.com', username: 'zanele.dlamini', name: 'Zanele Dlamini', bio: 'Artist & activist 🎨 | Joburg | Ubuntu spirit', location: 'Johannesburg, SA', website: 'https://zaneledlamini.art' },
// //     { email: 'takumi.ito.jp@gmail.com', username: 'takumi.ito', name: 'Takumi Itō', bio: 'バリスタ & カメラマン ☕📷 | 大阪 | Film only', location: 'Osaka, Japan', website: null },
// //     { email: 'beatriz.santos.pt@gmail.com', username: 'beabeatriz.pt', name: 'Beatriz Santos', bio: 'Enfermeira 💙 | Porto | Praia & vinho verde 🍃', location: 'Porto, Portugal', website: null },
// //     { email: 'keanu.makoa@gmail.com', username: 'keanumakoa', name: 'Keanu Makoa', bio: 'Canoe paddler & chef 🌺 | Honolulu | Aloha vibes', location: 'Honolulu, HI', website: null },
// // ];

// // async function main() {
// //     console.log('🌱 Seeding users...');

// //     const hashedPassword = await bcrypt.hash('12345678', 10);

// //     let created = 0;
// //     let skipped = 0;

// //     for (const u of users) {
// //         try {
// //             await prisma.user.upsert({
// //                 where: { email: u.email },
// //                 update: {},
// //                 create: {
// //                     email: u.email,
// //                     username: u.username,
// //                     password: hashedPassword,
// //                     name: u.name,
// //                     bio: u.bio,
// //                     location: u.location,
// //                     website: u.website ?? undefined,
// //                     role: UserRole.USER,
// //                     status: UserStatus.ACTIVE,
// //                     verifiedAt: new Date(),
// //                 },
// //             });
// //             created++;
// //             process.stdout.write(`\r  ✅ ${created + skipped} / ${users.length}`);
// //         } catch (e: any) {
// //             // Unique constraint → already exists
// //             if (e.code === 'P2002') {
// //                 skipped++;
// //             } else {
// //                 console.error(`\n  ❌ Failed for ${u.email}:`, e.message);
// //             }
// //         }
// //     }

// //     console.log(`\n\n🎉 Done! Created: ${created} | Skipped (already exist): ${skipped}`);
// // }

// // main()
// //     .catch((e) => {
// //         console.error(e);
// //         process.exit(1);
// //     })
// //     .finally(() => prisma.$disconnect());
