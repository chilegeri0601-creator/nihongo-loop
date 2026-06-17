const NihongoI18n = (() => {
  const storageKey = "nihongoLoopLanguage";
  const defaultLanguage = "zh-CN";
  const languages = [
    ["zh-CN", "简体中文"],
    ["zh-TW", "繁體中文"],
    ["en", "English"],
    ["vi", "Tiếng Việt"],
    ["ne", "नेपाली"],
    ["mn", "Монгол"],
  ];

  const messages = {
    "zh-CN": {
      "language.label": "语言",
      "common.home": "首页",
      "common.modules": "功能",
      "common.progress": "进度",
      "common.login": "登录",
      "common.register": "注册",
      "common.backHome": "返回首页",
      "common.switchAccount": "切换账号",
      "common.connecting": "连接中",
      "common.online": "后端已连接",
      "common.offline": "离线演示",
      "common.demoUser": "演示用户",
      "common.test": "测验",
      "common.training": "训练",
      "common.startTest": "开始测验",
      "common.enterTest": "进入测验",
      "module.vocabulary": "单词",
      "module.grammar": "语法",
      "module.reading": "阅读",
      "module.listening": "听力",
      "module.vocabularyDone": "已掌握",
      "module.grammarDone": "已学会",
      "module.readingDone": "已完成",
      "module.listeningDone": "已听懂",
      "index.title": "Nihongo Loop | 学习首页",
      "index.brandSub": "学习首页",
      "index.loaderTitle": "必胜、加载中",
      "index.loaderText": "正在整理你的学习首页。",
      "index.audience": "面向 N1-N5 的 JLPT 学习中心",
      "index.heroTitle": "今天从哪个模块开始？",
      "index.heroLead": "登录后这里会保存你的等级、打卡、单词、语法和各项训练进度。所有学习项目都已经拆成独立页面。",
      "index.startVocab": "开始背单词",
      "index.today": "今日学习",
      "index.inProgress": "进行中",
      "index.streakPrefix": "连续打卡",
      "index.streakSuffix": "天",
      "index.notCheckedIn": "今天还没有完成打卡",
      "index.checkedIn": "今日打卡完成，明天继续保持节奏",
      "index.checkin": "打卡",
      "index.checkedButton": "已打卡",
      "index.modulesTitle": "学习功能",
      "index.modulesLead": "每个模块都是独立页面，按 N5-N1 分级学习。",
      "index.vocabDesc": "单词表、选择题学习、发音和掌握状态。",
      "index.grammarDesc": "句型分类、接续、例句、易错点和小测。",
      "index.readingDesc": "短文、通知、观点文、长文定位训练。",
      "index.listeningDesc": "时间地点、请求、计划变更、观点听力。",
      "index.levelTitle": "等级路径与进度",
      "index.levelLead": "选择当前备考等级后，下方会展示每个学习项目的进度条。",
      "index.progressTitle": "{level} 学习进度",
      "index.footerDesc": "面向 N1-N5 的日语考级学习工具",
      "index.backModules": "回到功能入口",
      "roadmap.N5": "6 周建立假名、基础单词、入门语法和慢速听力的学习节奏。",
      "roadmap.N4": "7 周巩固日常表达，提升短文阅读和基础听力反应速度。",
      "roadmap.N3": "8 周连接基础到中级，强化长句理解、文章结构和听力关键词。",
      "roadmap.N2": "8 周完成高频词、核心语法、真题阅读与听力场景训练。",
      "roadmap.N1": "10 周面向高阶词汇、抽象阅读、复杂语法和考试节奏冲刺。",
      "login.title": "登录 | Nihongo Loop",
      "login.brandSub": "日本語ループ",
      "login.visualTitle": "先登录，再把今天的学习节奏接上。",
      "login.visualLead": "账号会保存你的打卡、等级、单词掌握和语法学习记录。",
      "login.welcome": "欢迎回来",
      "login.welcomeSub": "登录后继续今天的日语学习任务",
      "login.create": "创建学习账号",
      "login.createSub": "注册后同步打卡、错题和等级进度",
      "login.forgot": "找回密码",
      "login.forgotSub": "输入注册邮箱，生成本地演示验证码",
      "login.reset": "设置新密码",
      "login.resetSub": "输入验证码和新密码，完成后自动登录",
      "login.nickname": "昵称",
      "login.email": "邮箱",
      "login.resetCode": "找回验证码",
      "login.password": "密码",
      "login.confirmPassword": "确认密码",
      "login.submitLogin": "登录并继续学习",
      "login.submitRegister": "注册并生成计划",
      "login.submitForgot": "获取找回验证码",
      "login.submitReset": "重置密码并登录",
      "login.forgotButton": "忘记密码？",
      "login.noteDemo": "可以使用 demo@nihongo.loop / demo123456 体验。",
      "login.noteRegister": "注册成功后会自动回到首页。",
      "login.noteForgot": "当前为本地原型，验证码会直接显示在页面里。",
      "login.noteReset": "验证码 15 分钟内有效。",
      "login.account": "当前账号：{name}",
      "login.backIndex": "返回首页",
      "vocab.title": "单词学习",
      "vocab.lead": "按 N1-N5 等级练词卡、看例句、做独立测验，并把错题和掌握状态保存到后端。",
      "vocab.startTest": "开始单词测验",
      "vocab.completeToday": "完成今日单词学习",
      "grammar.title": "语法学习",
      "grammar.lead": "按 N5 到 N1 分级，把句型拆成“什么时候用、怎么接、例句、易错点”，让初学者也能一眼看懂。",
      "grammar.startTest": "开始语法测验",
      "reading.title": "阅读学习",
      "reading.lead": "按等级训练短文精读、长文定位、题干关键词和计时阅读。",
      "listening.title": "听力学习",
      "listening.lead": "按场景练主旨、人物关系、数字时间和关键词捕捉。",
      "test.title": "测验",
      "test.lead": "这里只做测验，不显示学习讲解内容。",
    },
    "zh-TW": {
      "language.label": "語言",
      "common.home": "首頁",
      "common.modules": "功能",
      "common.progress": "進度",
      "common.login": "登入",
      "common.register": "註冊",
      "common.backHome": "返回首頁",
      "common.switchAccount": "切換帳號",
      "common.connecting": "連線中",
      "common.online": "後端已連線",
      "common.offline": "離線演示",
      "common.demoUser": "演示使用者",
      "common.test": "測驗",
      "common.training": "訓練",
      "common.startTest": "開始測驗",
      "common.enterTest": "進入測驗",
      "module.vocabulary": "單字",
      "module.grammar": "文法",
      "module.reading": "閱讀",
      "module.listening": "聽力",
      "module.vocabularyDone": "已掌握",
      "module.grammarDone": "已學會",
      "module.readingDone": "已完成",
      "module.listeningDone": "已聽懂",
      "index.title": "Nihongo Loop | 學習首頁",
      "index.brandSub": "學習首頁",
      "index.loaderTitle": "必勝，載入中",
      "index.loaderText": "正在整理你的學習首頁。",
      "index.audience": "面向 N1-N5 的 JLPT 學習中心",
      "index.heroTitle": "今天從哪個模組開始？",
      "index.heroLead": "登入後這裡會保存你的等級、打卡、單字、文法和各項訓練進度。所有學習項目都已拆成獨立頁面。",
      "index.startVocab": "開始背單字",
      "index.today": "今日學習",
      "index.inProgress": "進行中",
      "index.streakPrefix": "連續打卡",
      "index.streakSuffix": "天",
      "index.notCheckedIn": "今天還沒有完成打卡",
      "index.checkedIn": "今日打卡完成，明天繼續保持節奏",
      "index.checkin": "打卡",
      "index.checkedButton": "已打卡",
      "index.modulesTitle": "學習功能",
      "index.modulesLead": "每個模組都是獨立頁面，按 N5-N1 分級學習。",
      "index.vocabDesc": "單字表、選擇題學習、發音和掌握狀態。",
      "index.grammarDesc": "句型分類、接續、例句、易錯點和小測。",
      "index.readingDesc": "短文、通知、觀點文、長文定位訓練。",
      "index.listeningDesc": "時間地點、請求、計畫變更、觀點聽力。",
      "index.levelTitle": "等級路徑與進度",
      "index.levelLead": "選擇目前備考等級後，下方會展示每個學習項目的進度條。",
      "index.progressTitle": "{level} 學習進度",
      "index.footerDesc": "面向 N1-N5 的日語考級學習工具",
      "index.backModules": "回到功能入口",
      "login.title": "登入 | Nihongo Loop",
      "login.brandSub": "日本語ループ",
      "login.visualTitle": "先登入，再接上今天的學習節奏。",
      "login.visualLead": "帳號會保存你的打卡、等級、單字掌握和文法學習記錄。",
      "login.welcome": "歡迎回來",
      "login.welcomeSub": "登入後繼續今天的日語學習任務",
      "login.create": "建立學習帳號",
      "login.createSub": "註冊後同步打卡、錯題和等級進度",
      "login.forgot": "找回密碼",
      "login.forgotSub": "輸入註冊信箱，產生本地演示驗證碼",
      "login.reset": "設定新密碼",
      "login.resetSub": "輸入驗證碼和新密碼，完成後自動登入",
      "login.nickname": "暱稱",
      "login.email": "信箱",
      "login.resetCode": "找回驗證碼",
      "login.password": "密碼",
      "login.confirmPassword": "確認密碼",
      "login.submitLogin": "登入並繼續學習",
      "login.submitRegister": "註冊並產生計畫",
      "login.submitForgot": "取得找回驗證碼",
      "login.submitReset": "重設密碼並登入",
      "login.forgotButton": "忘記密碼？",
      "login.noteDemo": "可以使用 demo@nihongo.loop / demo123456 體驗。",
      "login.noteRegister": "註冊成功後會自動回到首頁。",
      "login.noteForgot": "目前為本地原型，驗證碼會直接顯示在頁面裡。",
      "login.noteReset": "驗證碼 15 分鐘內有效。",
      "login.account": "目前帳號：{name}",
      "login.backIndex": "返回首頁",
      "vocab.title": "單字學習",
      "vocab.lead": "按 N1-N5 等級練詞卡、看例句、做獨立測驗，並把錯題和掌握狀態保存到後端。",
      "vocab.startTest": "開始單字測驗",
      "vocab.completeToday": "完成今日單字學習",
      "grammar.title": "文法學習",
      "grammar.lead": "按 N5 到 N1 分級，把句型拆成「什麼時候用、怎麼接、例句、易錯點」，讓初學者也能一眼看懂。",
      "grammar.startTest": "開始文法測驗",
      "reading.title": "閱讀學習",
      "reading.lead": "按等級訓練短文精讀、長文定位、題幹關鍵詞和計時閱讀。",
      "listening.title": "聽力學習",
      "listening.lead": "按場景練主旨、人物關係、數字時間和關鍵詞捕捉。",
      "test.title": "測驗",
      "test.lead": "这里只做測驗，不顯示學習講解內容。",
    },
    en: {
      "language.label": "Language",
      "common.home": "Home",
      "common.modules": "Modules",
      "common.progress": "Progress",
      "common.login": "Log in",
      "common.register": "Sign up",
      "common.backHome": "Back home",
      "common.switchAccount": "Switch account",
      "common.connecting": "Connecting",
      "common.online": "Backend online",
      "common.offline": "Offline demo",
      "common.demoUser": "Demo user",
      "common.test": "Quiz",
      "common.training": "Training",
      "common.startTest": "Start quiz",
      "common.enterTest": "Enter quiz",
      "module.vocabulary": "Vocabulary",
      "module.grammar": "Grammar",
      "module.reading": "Reading",
      "module.listening": "Listening",
      "module.vocabularyDone": "mastered",
      "module.grammarDone": "learned",
      "module.readingDone": "completed",
      "module.listeningDone": "understood",
      "index.title": "Nihongo Loop | Learning Home",
      "index.brandSub": "Learning home",
      "index.loaderTitle": "Loading your study loop",
      "index.loaderText": "Preparing your learning dashboard.",
      "index.audience": "JLPT study center for N1-N5 learners",
      "index.heroTitle": "Which module starts today?",
      "index.heroLead": "After login, this page saves your level, check-ins, vocabulary, grammar, and training progress. Every learning module now has its own page.",
      "index.startVocab": "Start vocabulary",
      "index.today": "Today's study",
      "index.inProgress": "In progress",
      "index.streakPrefix": "Check-in streak",
      "index.streakSuffix": "days",
      "index.notCheckedIn": "You have not checked in today",
      "index.checkedIn": "Checked in today. Keep the rhythm tomorrow",
      "index.checkin": "Check in",
      "index.checkedButton": "Checked in",
      "index.modulesTitle": "Learning modules",
      "index.modulesLead": "Each module is an independent page, organized from N5 to N1.",
      "index.vocabDesc": "Word lists, quiz learning, pronunciation, and mastery status.",
      "index.grammarDesc": "Sentence patterns, connections, examples, mistakes, and mini quizzes.",
      "index.readingDesc": "Short passages, notices, opinion texts, and long-passage scanning.",
      "index.listeningDesc": "Time, place, requests, plan changes, and opinion listening.",
      "index.levelTitle": "Level path and progress",
      "index.levelLead": "Choose your JLPT level to see real progress for each module.",
      "index.progressTitle": "{level} progress",
      "index.footerDesc": "A Japanese JLPT learning tool for N1-N5",
      "index.backModules": "Back to modules",
      "roadmap.N5": "Build kana, basic vocabulary, beginner grammar, and slow listening habits in 6 weeks.",
      "roadmap.N4": "Strengthen everyday expressions, short reading, and basic listening speed in 7 weeks.",
      "roadmap.N3": "Bridge basic and intermediate Japanese with longer sentences, structure, and listening keywords.",
      "roadmap.N2": "Cover high-frequency vocabulary, core grammar, exam reading, and listening scenes in 8 weeks.",
      "roadmap.N1": "Sprint through advanced vocabulary, abstract reading, complex grammar, and exam pacing in 10 weeks.",
      "login.title": "Log in | Nihongo Loop",
      "login.brandSub": "Japanese Loop",
      "login.visualTitle": "Log in and continue today's rhythm.",
      "login.visualLead": "Your account saves check-ins, levels, vocabulary mastery, and grammar records.",
      "login.welcome": "Welcome back",
      "login.welcomeSub": "Log in to continue today's Japanese study",
      "login.create": "Create study account",
      "login.createSub": "Sync check-ins, mistakes, and level progress after signup",
      "login.forgot": "Recover password",
      "login.forgotSub": "Enter your email to create a local demo code",
      "login.reset": "Set a new password",
      "login.resetSub": "Enter the code and new password to log in",
      "login.nickname": "Nickname",
      "login.email": "Email",
      "login.resetCode": "Recovery code",
      "login.password": "Password",
      "login.confirmPassword": "Confirm password",
      "login.submitLogin": "Log in and continue",
      "login.submitRegister": "Sign up and create plan",
      "login.submitForgot": "Get recovery code",
      "login.submitReset": "Reset password and log in",
      "login.forgotButton": "Forgot password?",
      "login.noteDemo": "Try demo@nihongo.loop / demo123456.",
      "login.noteRegister": "After signup, you will return to the home page.",
      "login.noteForgot": "This local prototype shows the code on the page.",
      "login.noteReset": "The code is valid for 15 minutes.",
      "login.account": "Current account: {name}",
      "login.backIndex": "Back home",
      "vocab.title": "Vocabulary learning",
      "vocab.lead": "Practice cards, examples, independent quizzes, mistakes, and mastery by N1-N5 level.",
      "vocab.startTest": "Start vocabulary quiz",
      "vocab.completeToday": "Finish today's vocabulary",
      "grammar.title": "Grammar learning",
      "grammar.lead": "Learn N5-N1 patterns with usage, structure, examples, and common mistakes.",
      "grammar.startTest": "Start grammar quiz",
      "reading.title": "Reading learning",
      "reading.lead": "Practice passages, scanning, keywords, and timed reading by level.",
      "listening.title": "Listening learning",
      "listening.lead": "Practice main ideas, relationships, time, numbers, and keywords by scene.",
      "test.title": "Quiz",
      "test.lead": "This page is only for quizzes, without study explanations.",
    },
    vi: {
      "language.label": "Ngôn ngữ",
      "common.home": "Trang chủ",
      "common.modules": "Tính năng",
      "common.progress": "Tiến độ",
      "common.login": "Đăng nhập",
      "common.register": "Đăng ký",
      "common.backHome": "Về trang chủ",
      "common.switchAccount": "Đổi tài khoản",
      "common.connecting": "Đang kết nối",
      "common.online": "Máy chủ đã kết nối",
      "common.offline": "Bản demo ngoại tuyến",
      "common.demoUser": "Người dùng demo",
      "common.test": "Bài kiểm tra",
      "common.training": "Luyện tập",
      "common.startTest": "Bắt đầu kiểm tra",
      "common.enterTest": "Vào kiểm tra",
      "module.vocabulary": "Từ vựng",
      "module.grammar": "Ngữ pháp",
      "module.reading": "Đọc hiểu",
      "module.listening": "Nghe hiểu",
      "module.vocabularyDone": "đã thuộc",
      "module.grammarDone": "đã học",
      "module.readingDone": "đã hoàn thành",
      "module.listeningDone": "đã nghe hiểu",
      "index.title": "Nihongo Loop | Trang học tập",
      "index.brandSub": "Trang học tập",
      "index.loaderTitle": "Đang tải Nihongo Loop",
      "index.loaderText": "Đang chuẩn bị trang học của bạn.",
      "index.audience": "Trung tâm học JLPT cho N1-N5",
      "index.heroTitle": "Hôm nay bắt đầu từ phần nào?",
      "index.heroLead": "Sau khi đăng nhập, trang này lưu cấp độ, điểm danh, từ vựng, ngữ pháp và tiến độ luyện tập của bạn.",
      "index.startVocab": "Học từ vựng",
      "index.today": "Học hôm nay",
      "index.inProgress": "Đang học",
      "index.streakPrefix": "Chuỗi điểm danh",
      "index.streakSuffix": "ngày",
      "index.notCheckedIn": "Hôm nay bạn chưa điểm danh",
      "index.checkedIn": "Đã điểm danh hôm nay. Ngày mai tiếp tục nhé",
      "index.checkin": "Điểm danh",
      "index.checkedButton": "Đã điểm danh",
      "index.modulesTitle": "Tính năng học",
      "index.modulesLead": "Mỗi phần là một trang riêng, chia theo N5-N1.",
      "index.vocabDesc": "Danh sách từ, câu hỏi lựa chọn, phát âm và trạng thái ghi nhớ.",
      "index.grammarDesc": "Mẫu câu, cách nối, ví dụ, lỗi thường gặp và kiểm tra nhanh.",
      "index.readingDesc": "Đoạn ngắn, thông báo, bài quan điểm và luyện tìm ý trong bài dài.",
      "index.listeningDesc": "Thời gian, địa điểm, yêu cầu, thay đổi kế hoạch và nghe ý kiến.",
      "index.levelTitle": "Lộ trình cấp độ và tiến độ",
      "index.levelLead": "Chọn cấp độ JLPT để xem tiến độ thật của từng phần.",
      "index.progressTitle": "Tiến độ {level}",
      "index.footerDesc": "Công cụ học tiếng Nhật JLPT N1-N5",
      "index.backModules": "Về tính năng",
      "login.title": "Đăng nhập | Nihongo Loop",
      "login.brandSub": "Vòng lặp tiếng Nhật",
      "login.visualTitle": "Đăng nhập để tiếp tục nhịp học hôm nay.",
      "login.visualLead": "Tài khoản lưu điểm danh, cấp độ, từ đã thuộc và ngữ pháp.",
      "login.welcome": "Chào mừng quay lại",
      "login.welcomeSub": "Đăng nhập để tiếp tục học tiếng Nhật hôm nay",
      "login.create": "Tạo tài khoản học",
      "login.createSub": "Đồng bộ điểm danh, lỗi sai và tiến độ cấp độ",
      "login.forgot": "Lấy lại mật khẩu",
      "login.forgotSub": "Nhập email để tạo mã demo tại chỗ",
      "login.reset": "Đặt mật khẩu mới",
      "login.resetSub": "Nhập mã và mật khẩu mới để đăng nhập",
      "login.nickname": "Biệt danh",
      "login.email": "Email",
      "login.resetCode": "Mã khôi phục",
      "login.password": "Mật khẩu",
      "login.confirmPassword": "Xác nhận mật khẩu",
      "login.submitLogin": "Đăng nhập và học tiếp",
      "login.submitRegister": "Đăng ký và tạo kế hoạch",
      "login.submitForgot": "Lấy mã khôi phục",
      "login.submitReset": "Đặt lại và đăng nhập",
      "login.forgotButton": "Quên mật khẩu?",
      "login.noteDemo": "Có thể thử demo@nihongo.loop / demo123456.",
      "login.noteRegister": "Sau khi đăng ký sẽ tự về trang chủ.",
      "login.noteForgot": "Bản demo sẽ hiện mã ngay trên trang.",
      "login.noteReset": "Mã có hiệu lực trong 15 phút.",
      "login.account": "Tài khoản hiện tại: {name}",
      "login.backIndex": "Về trang chủ",
      "vocab.title": "Học từ vựng",
      "vocab.lead": "Luyện thẻ từ, ví dụ, kiểm tra riêng, lỗi sai và trạng thái ghi nhớ theo N1-N5.",
      "vocab.startTest": "Kiểm tra từ vựng",
      "vocab.completeToday": "Hoàn thành từ vựng hôm nay",
      "grammar.title": "Học ngữ pháp",
      "grammar.lead": "Học mẫu câu N5-N1 với cách dùng, cấu trúc, ví dụ và lỗi thường gặp.",
      "grammar.startTest": "Kiểm tra ngữ pháp",
      "reading.title": "Học đọc hiểu",
      "reading.lead": "Luyện đọc đoạn, tìm ý, từ khóa và đọc có tính giờ theo cấp độ.",
      "listening.title": "Học nghe hiểu",
      "listening.lead": "Luyện ý chính, quan hệ nhân vật, thời gian, số và từ khóa theo tình huống.",
      "test.title": "Bài kiểm tra",
      "test.lead": "Trang này chỉ làm bài kiểm tra, không hiển thị phần giảng.",
    },
    ne: {
      "language.label": "भाषा",
      "common.home": "गृहपृष्ठ",
      "common.modules": "मोड्युल",
      "common.progress": "प्रगति",
      "common.login": "लग इन",
      "common.register": "दर्ता",
      "common.backHome": "गृहपृष्ठमा फर्कनुहोस्",
      "common.switchAccount": "खाता बदल्नुहोस्",
      "common.connecting": "जडान हुँदै",
      "common.online": "ब्याकएन्ड जोडियो",
      "common.offline": "अफलाइन डेमो",
      "common.demoUser": "डेमो प्रयोगकर्ता",
      "common.test": "क्विज",
      "common.training": "अभ्यास",
      "common.startTest": "क्विज सुरु",
      "common.enterTest": "क्विजमा जानुहोस्",
      "module.vocabulary": "शब्दावली",
      "module.grammar": "व्याकरण",
      "module.reading": "पढाइ",
      "module.listening": "सुनाइ",
      "module.vocabularyDone": "सिकिएको",
      "module.grammarDone": "पूरा भएको",
      "module.readingDone": "पूरा भएको",
      "module.listeningDone": "बुझिएको",
      "index.title": "Nihongo Loop | अध्ययन गृह",
      "index.brandSub": "अध्ययन गृह",
      "index.loaderTitle": "लोड हुँदैछ",
      "index.loaderText": "तपाईंको अध्ययन पृष्ठ तयार हुँदैछ।",
      "index.audience": "N1-N5 का लागि JLPT अध्ययन केन्द्र",
      "index.heroTitle": "आज कुन मोड्युलबाट सुरु गर्ने?",
      "index.heroLead": "लग इन गरेपछि तपाईंको स्तर, चेक-इन, शब्दावली, व्याकरण र अभ्यास प्रगति सुरक्षित हुन्छ।",
      "index.startVocab": "शब्दावली सुरु",
      "index.today": "आजको अध्ययन",
      "index.inProgress": "जारी छ",
      "index.streakPrefix": "लगातार चेक-इन",
      "index.streakSuffix": "दिन",
      "index.notCheckedIn": "आज चेक-इन भएको छैन",
      "index.checkedIn": "आज चेक-इन भयो। भोलि पनि जारी राख्नुहोस्",
      "index.checkin": "चेक-इन",
      "index.checkedButton": "चेक-इन भयो",
      "index.modulesTitle": "अध्ययन मोड्युल",
      "index.modulesLead": "हरेक मोड्युल अलग पृष्ठ हो, N5 देखि N1 सम्म।",
      "index.vocabDesc": "शब्द सूची, विकल्प अभ्यास, उच्चारण र सिकाइ स्थिति।",
      "index.grammarDesc": "वाक्य ढाँचा, जोडाइ, उदाहरण, गल्ती र सानो क्विज।",
      "index.readingDesc": "छोटो पाठ, सूचना, विचार पाठ र लामो पाठ खोज अभ्यास।",
      "index.listeningDesc": "समय, स्थान, अनुरोध, योजना परिवर्तन र विचार सुनाइ।",
      "index.levelTitle": "स्तर मार्ग र प्रगति",
      "index.levelLead": "JLPT स्तर छानेपछि प्रत्येक मोड्युलको वास्तविक प्रगति देखिन्छ।",
      "index.progressTitle": "{level} प्रगति",
      "index.footerDesc": "N1-N5 JLPT जापानी अध्ययन उपकरण",
      "index.backModules": "मोड्युलमा फर्कनुहोस्",
      "login.title": "लग इन | Nihongo Loop",
      "login.brandSub": "जापानी लूप",
      "login.visualTitle": "लग इन गरेर आजको अध्ययन जारी राख्नुहोस्।",
      "login.visualLead": "खाताले चेक-इन, स्तर, शब्दावली र व्याकरण रेकर्ड सुरक्षित गर्छ।",
      "login.welcome": "फेरि स्वागत छ",
      "login.welcomeSub": "आजको जापानी अध्ययन जारी राख्न लग इन गर्नुहोस्",
      "login.create": "अध्ययन खाता बनाउनुहोस्",
      "login.createSub": "चेक-इन, गल्ती र स्तर प्रगति सिंक गर्नुहोस्",
      "login.forgot": "पासवर्ड फिर्ता",
      "login.forgotSub": "स्थानीय डेमो कोड बनाउन इमेल हाल्नुहोस्",
      "login.reset": "नयाँ पासवर्ड सेट गर्नुहोस्",
      "login.resetSub": "कोड र नयाँ पासवर्ड हालेर लग इन गर्नुहोस्",
      "login.nickname": "नाम",
      "login.email": "इमेल",
      "login.resetCode": "रिकभरी कोड",
      "login.password": "पासवर्ड",
      "login.confirmPassword": "पासवर्ड पुष्टि",
      "login.submitLogin": "लग इन गरेर जारी",
      "login.submitRegister": "दर्ता गरी योजना बनाउनुहोस्",
      "login.submitForgot": "रिकभरी कोड लिनुहोस्",
      "login.submitReset": "पासवर्ड रिसेट गरी लग इन",
      "login.forgotButton": "पासवर्ड बिर्सनुभयो?",
      "login.noteDemo": "demo@nihongo.loop / demo123456 प्रयोग गर्न सकिन्छ।",
      "login.noteRegister": "दर्तापछि गृहपृष्ठमा फर्किन्छ।",
      "login.noteForgot": "डेमोमा कोड यही पृष्ठमा देखिन्छ।",
      "login.noteReset": "कोड १५ मिनेट मान्य हुन्छ।",
      "login.account": "हालको खाता: {name}",
      "login.backIndex": "गृहपृष्ठमा फर्कनुहोस्",
      "vocab.title": "शब्दावली अध्ययन",
      "vocab.lead": "N1-N5 अनुसार कार्ड, उदाहरण, क्विज, गल्ती र सिकाइ स्थिति अभ्यास गर्नुहोस्।",
      "vocab.startTest": "शब्दावली क्विज",
      "vocab.completeToday": "आजको शब्दावली पूरा",
      "grammar.title": "व्याकरण अध्ययन",
      "grammar.lead": "N5-N1 ढाँचा प्रयोग, संरचना, उदाहरण र गल्ती सहित सिक्नुहोस्।",
      "grammar.startTest": "व्याकरण क्विज",
      "reading.title": "पढाइ अभ्यास",
      "reading.lead": "स्तर अनुसार पाठ, खोज, मुख्य शब्द र समयबद्ध पढाइ अभ्यास।",
      "listening.title": "सुनाइ अभ्यास",
      "listening.lead": "दृश्य अनुसार मुख्य अर्थ, सम्बन्ध, समय, संख्या र शब्द समात्ने अभ्यास।",
      "test.title": "क्विज",
      "test.lead": "यो पृष्ठ क्विजको लागि मात्र हो, व्याख्या देखाइँदैन।",
    },
    mn: {
      "language.label": "Хэл",
      "common.home": "Нүүр",
      "common.modules": "Модулиуд",
      "common.progress": "Ахиц",
      "common.login": "Нэвтрэх",
      "common.register": "Бүртгүүлэх",
      "common.backHome": "Нүүр рүү",
      "common.switchAccount": "Бүртгэл солих",
      "common.connecting": "Холбогдож байна",
      "common.online": "Сервер холбогдсон",
      "common.offline": "Офлайн демо",
      "common.demoUser": "Демо хэрэглэгч",
      "common.test": "Шалгалт",
      "common.training": "Дасгал",
      "common.startTest": "Шалгалт эхлэх",
      "common.enterTest": "Шалгалт руу",
      "module.vocabulary": "Үгсийн сан",
      "module.grammar": "Дүрэм",
      "module.reading": "Унших",
      "module.listening": "Сонсох",
      "module.vocabularyDone": "цээжилсэн",
      "module.grammarDone": "сурсан",
      "module.readingDone": "дууссан",
      "module.listeningDone": "ойлгосон",
      "index.title": "Nihongo Loop | Сургалтын нүүр",
      "index.brandSub": "Сургалтын нүүр",
      "index.loaderTitle": "Ачаалж байна",
      "index.loaderText": "Таны сургалтын хуудсыг бэлдэж байна.",
      "index.audience": "N1-N5 JLPT суралцагчдын төв",
      "index.heroTitle": "Өнөөдөр аль модулиас эхлэх вэ?",
      "index.heroLead": "Нэвтэрсний дараа түвшин, чек-ин, үгсийн сан, дүрэм болон дасгалын ахиц хадгалагдана.",
      "index.startVocab": "Үгсийн сан эхлэх",
      "index.today": "Өнөөдрийн сургалт",
      "index.inProgress": "Явагдаж байна",
      "index.streakPrefix": "Дараалсан чек-ин",
      "index.streakSuffix": "өдөр",
      "index.notCheckedIn": "Өнөөдөр чек-ин хийгээгүй",
      "index.checkedIn": "Өнөөдөр чек-ин хийлээ. Маргааш үргэлжлүүлээрэй",
      "index.checkin": "Чек-ин",
      "index.checkedButton": "Чек-ин хийсэн",
      "index.modulesTitle": "Сургалтын модулиуд",
      "index.modulesLead": "Модуль бүр тусдаа хуудастай, N5-аас N1 хүртэл.",
      "index.vocabDesc": "Үгийн жагсаалт, сонголттой дасгал, дуудлага, цээжилсэн төлөв.",
      "index.grammarDesc": "Өгүүлбэрийн хэв, холбоос, жишээ, нийтлэг алдаа, жижиг шалгалт.",
      "index.readingDesc": "Богино текст, зарлал, саналын текст, урт текст хайх дасгал.",
      "index.listeningDesc": "Цаг, газар, хүсэлт, төлөвлөгөөний өөрчлөлт, санал сонсох.",
      "index.levelTitle": "Түвшин ба ахиц",
      "index.levelLead": "JLPT түвшнээ сонгоод модуль бүрийн бодит ахицыг харна.",
      "index.progressTitle": "{level} ахиц",
      "index.footerDesc": "N1-N5 JLPT япон хэлний сургалтын хэрэгсэл",
      "index.backModules": "Модулиуд руу",
      "login.title": "Нэвтрэх | Nihongo Loop",
      "login.brandSub": "Япон хэлний давталт",
      "login.visualTitle": "Нэвтрээд өнөөдрийн хэмнэлээ үргэлжлүүл.",
      "login.visualLead": "Бүртгэл чек-ин, түвшин, үгсийн сан, дүрмийн бичлэгийг хадгална.",
      "login.welcome": "Тавтай морил",
      "login.welcomeSub": "Өнөөдрийн япон хэлний сургалтаа үргэлжлүүлэхээр нэвтэрнэ үү",
      "login.create": "Сургалтын бүртгэл үүсгэх",
      "login.createSub": "Чек-ин, алдаа, түвшний ахицыг синк хийнэ",
      "login.forgot": "Нууц үг сэргээх",
      "login.forgotSub": "Демо код үүсгэхийн тулд имэйл оруулна уу",
      "login.reset": "Шинэ нууц үг тохируулах",
      "login.resetSub": "Код болон шинэ нууц үгээ оруулаад нэвтэрнэ үү",
      "login.nickname": "Нэр",
      "login.email": "Имэйл",
      "login.resetCode": "Сэргээх код",
      "login.password": "Нууц үг",
      "login.confirmPassword": "Нууц үг давтах",
      "login.submitLogin": "Нэвтрээд үргэлжлүүлэх",
      "login.submitRegister": "Бүртгүүлж төлөвлөгөө үүсгэх",
      "login.submitForgot": "Сэргээх код авах",
      "login.submitReset": "Нууц үг шинэчилж нэвтрэх",
      "login.forgotButton": "Нууц үгээ мартсан?",
      "login.noteDemo": "demo@nihongo.loop / demo123456 ашиглаж болно.",
      "login.noteRegister": "Бүртгүүлсний дараа нүүр рүү буцна.",
      "login.noteForgot": "Демо код энэ хуудсан дээр шууд гарна.",
      "login.noteReset": "Код 15 минут хүчинтэй.",
      "login.account": "Одоогийн бүртгэл: {name}",
      "login.backIndex": "Нүүр рүү",
      "vocab.title": "Үгсийн сан сурах",
      "vocab.lead": "N1-N5 түвшнээр карт, жишээ, шалгалт, алдаа, цээжилсэн төлөв дасгал.",
      "vocab.startTest": "Үгсийн сангийн шалгалт",
      "vocab.completeToday": "Өнөөдрийн үгсийг дуусгах",
      "grammar.title": "Дүрэм сурах",
      "grammar.lead": "N5-N1 хэвийг хэрэглээ, бүтэц, жишээ, нийтлэг алдаатай нь сурна.",
      "grammar.startTest": "Дүрмийн шалгалт",
      "reading.title": "Унших дасгал",
      "reading.lead": "Түвшнээр текст, хайлт, түлхүүр үг, хугацаатай уншлага дасгал.",
      "listening.title": "Сонсох дасгал",
      "listening.lead": "Нөхцөлөөр гол санаа, харилцаа, цаг, тоо, түлхүүр үг дасгал.",
      "test.title": "Шалгалт",
      "test.lead": "Энэ хуудас зөвхөн шалгалтад зориулагдсан, тайлбар харуулахгүй.",
    },
  };

  const sourceKeyMap = {
    首页: "common.home",
    功能: "common.modules",
    进度: "common.progress",
    登录: "common.login",
    注册: "common.register",
    返回首页: "common.backHome",
    连接中: "common.connecting",
    后端已连接: "common.online",
    离线演示: "common.offline",
    测验: "common.test",
    训练: "common.training",
    开始测验: "common.startTest",
    进入测验: "common.enterTest",
    单词: "module.vocabulary",
    语法: "module.grammar",
    阅读: "module.reading",
    听力: "module.listening",
    已掌握: "module.vocabularyDone",
    已学会: "module.grammarDone",
    已完成: "module.readingDone",
    已听懂: "module.listeningDone",
  };

  const phraseBundles = {
    "zh-TW": {
      学习: "學習",
      分类: "分類",
      词卡: "詞卡",
      复习队列: "複習佇列",
      错题本: "錯題本",
      学习中: "學習中",
      测验中: "測驗中",
      训练中: "訓練中",
      待训练: "待訓練",
      未开始: "未開始",
      未学习: "未學習",
      待复习: "待複習",
      播放音频: "播放音訊",
      重播音频: "重播音訊",
      上一题: "上一題",
      下一题: "下一題",
      上一条: "上一條",
      下一条: "下一條",
      完成: "完成",
      去测验: "去測驗",
      重新选择: "重新選擇",
      查看原文和提示: "查看原文和提示",
      学习提示: "學習提示",
      学习模式: "學習模式",
      测验模式: "測驗模式",
      当前分类: "目前分類",
      当前单元: "目前單元",
      当前小组: "目前小組",
      本组练习: "本組練習",
      什么时候用: "什麼時候用",
      怎么接: "怎麼接",
      全等级进度: "全等級進度",
      语法点: "文法點",
      标记学会: "標記學會",
      标记已听懂: "標記已聽懂",
      开始单词测验: "開始單字測驗",
      开始语法测验: "開始文法測驗",
      完成今日单词学习: "完成今日單字學習",
      正在载入单词: "正在載入單字",
      正在载入语法: "正在載入文法",
      正在载入测验: "正在載入測驗",
      准备题目中: "準備題目中。",
    },
    en: {
      学习: "Learning",
      分类: "Categories",
      词卡: "Cards",
      复习队列: "Review queue",
      错题本: "Mistake book",
      学习中: "Learning",
      测验中: "In quiz",
      训练中: "Training",
      待训练: "To train",
      未开始: "Not started",
      未学习: "Not studied",
      待复习: "To review",
      播放音频: "Play audio",
      重播音频: "Replay audio",
      播放发音: "Play pronunciation",
      重播发音: "Replay pronunciation",
      上一题: "Previous",
      下一题: "Next",
      上一条: "Previous",
      下一条: "Next",
      完成: "Finish",
      去测验: "Quiz",
      重新选择: "Choose again",
      查看原文和提示: "Show transcript and tips",
      学习提示: "Study tip",
      学习模式: "Study mode",
      测验模式: "Quiz mode",
      当前分类: "Current category",
      当前单元: "Current unit",
      当前小组: "Current group",
      本组练习: "This group",
      什么时候用: "When to use",
      怎么接: "Structure",
      全等级进度: "Level progress",
      语法点: "Grammar point",
      标记学会: "Mark learned",
      标记已听懂: "Mark understood",
      开始单词测验: "Start vocabulary quiz",
      开始语法测验: "Start grammar quiz",
      完成今日单词学习: "Finish today's vocabulary",
      正在载入单词: "Loading vocabulary",
      正在载入语法: "Loading grammar",
      正在载入测验: "Loading quiz",
      准备题目中: "Preparing questions.",
      "准备单词表、发音和选择题。": "Preparing word lists, pronunciation, and quizzes.",
      "整理分类、接续和小测。": "Organizing categories, structures, and mini quizzes.",
      "正在整理等级、分类和例句。": "Organizing levels, categories, and examples.",
      "这里是独立测验页面，不显示学习讲解内容。": "This is a separate quiz page without study explanations.",
      "这里只做测验，不显示学习讲解内容。": "This page is only for quizzes, without study explanations.",
      "请只根据上面的日语文本选择正确答案。": "Choose the correct answer using only the Japanese text above.",
      "答对了。下面可以看中文意思和解析。": "Correct. You can now view the meaning and explanation.",
      答案解析: "Answer explanation",
      回答正确: "Correct",
      中文意思: "Meaning",
      読解問題: "Reading question",
      已学会: "Learned",
    },
    vi: {
      学习: "Học",
      分类: "Phân loại",
      词卡: "Thẻ từ",
      复习队列: "Hàng ôn tập",
      错题本: "Sổ lỗi sai",
      学习中: "Đang học",
      测验中: "Đang kiểm tra",
      训练中: "Đang luyện",
      待训练: "Chờ luyện",
      未开始: "Chưa bắt đầu",
      未学习: "Chưa học",
      待复习: "Cần ôn",
      播放音频: "Phát âm thanh",
      重播音频: "Phát lại âm thanh",
      上一题: "Câu trước",
      下一题: "Câu tiếp",
      上一条: "Mục trước",
      下一条: "Mục tiếp",
      完成: "Hoàn thành",
      去测验: "Làm kiểm tra",
      重新选择: "Chọn lại",
      查看原文和提示: "Xem bản gốc và gợi ý",
      学习提示: "Gợi ý học",
      学习模式: "Chế độ học",
      测验模式: "Chế độ kiểm tra",
      当前分类: "Phân loại hiện tại",
      当前单元: "Bài hiện tại",
      当前小组: "Nhóm hiện tại",
      本组练习: "Luyện nhóm này",
      什么时候用: "Khi nào dùng",
      怎么接: "Cấu trúc",
      全等级进度: "Tiến độ cấp độ",
      语法点: "Điểm ngữ pháp",
      标记学会: "Đánh dấu đã học",
      标记已听懂: "Đánh dấu đã hiểu",
    },
    ne: {
      学习: "अध्ययन",
      分类: "वर्ग",
      词卡: "कार्ड",
      复习队列: "दोहोर्‍याउने सूची",
      错题本: "गल्ती पुस्तिका",
      学习中: "अध्ययन हुँदै",
      测验中: "क्विज हुँदै",
      训练中: "अभ्यास हुँदै",
      待训练: "अभ्यास बाँकी",
      未开始: "सुरु भएको छैन",
      未学习: "अध्ययन नभएको",
      待复习: "दोहोर्‍याउन बाँकी",
      播放音频: "अडियो बजाउनुहोस्",
      重播音频: "अडियो फेरि बजाउनुहोस्",
      上一题: "अघिल्लो",
      下一题: "अर्को",
      上一条: "अघिल्लो",
      下一条: "अर्को",
      完成: "समाप्त",
      去测验: "क्विज",
      重新选择: "फेरि छान्नुहोस्",
      查看原文和提示: "मूल पाठ र संकेत हेर्नुहोस्",
      学习提示: "अध्ययन संकेत",
      学习模式: "अध्ययन मोड",
      测验模式: "क्विज मोड",
      当前分类: "हालको वर्ग",
      当前单元: "हालको एकाइ",
      当前小组: "हालको समूह",
      本组练习: "यो समूह",
      什么时候用: "कहिले प्रयोग गर्ने",
      怎么接: "संरचना",
      全等级进度: "स्तर प्रगति",
      语法点: "व्याकरण बिन्दु",
      标记学会: "सिकियो भनेर चिन्ह लगाउनुहोस्",
      标记已听懂: "बुझियो भनेर चिन्ह लगाउनुहोस्",
    },
    mn: {
      学习: "Сурах",
      分类: "Ангилал",
      词卡: "Карт",
      复习队列: "Давтах жагсаалт",
      错题本: "Алдааны дэвтэр",
      学习中: "Суралцаж байна",
      测验中: "Шалгалт хийж байна",
      训练中: "Дасгал хийж байна",
      待训练: "Дасгал хүлээж байна",
      未开始: "Эхлээгүй",
      未学习: "Сураагүй",
      待复习: "Давтах",
      播放音频: "Аудио тоглуулах",
      重播音频: "Аудио дахин тоглуулах",
      上一题: "Өмнөх",
      下一题: "Дараах",
      上一条: "Өмнөх",
      下一条: "Дараах",
      完成: "Дуусгах",
      去测验: "Шалгалт",
      重新选择: "Дахин сонгох",
      查看原文和提示: "Эх текст ба зөвлөмж",
      学习提示: "Сурах зөвлөмж",
      学习模式: "Сурах горим",
      测验模式: "Шалгалтын горим",
      当前分类: "Одоогийн ангилал",
      当前单元: "Одоогийн нэгж",
      当前小组: "Одоогийн бүлэг",
      本组练习: "Энэ бүлэг",
      什么时候用: "Хэзээ хэрэглэх",
      怎么接: "Бүтэц",
      全等级进度: "Түвшний ахиц",
      语法点: "Дүрмийн цэг",
      标记学会: "Сурснаар тэмдэглэх",
      标记已听懂: "Ойлгосноор тэмдэглэх",
    },
  };

  const learningTerms = {
    en: {
      "我": "I",
      "你": "you",
      "您": "you",
      "他": "he",
      "她": "she",
      "我们": "we",
      "你们": "you",
      "他们": "they",
      "那个（远处）": "that over there",
      "哪一个": "which one",
      "那里（远处）": "over there",
      "人": "person",
      "男人": "man",
      "女人": "woman",
      "孩子": "child",
      "家人": "family",
      "父亲（我的）": "my father",
      "母亲（我的）": "my mother",
      "哥哥（我的）": "my older brother",
      "姐姐（我的）": "my older sister",
      "弟弟": "younger brother",
      "妹妹": "younger sister",
      "公司职员": "company employee",
      "医生": "doctor",
      "名字": "name",
      "白天、中午": "daytime / noon",
      "夜晚": "night",
      "现在": "now",
      "每天": "every day",
      "每天早上": "every morning",
      "每天晚上": "every night",
      "上周": "last week",
      "这周": "this week",
      "下周": "next week",
      "今年": "this year",
      "年、岁": "year / age",
      "月亮、月份": "moon / month",
      "星期、周": "week",
      "时间": "time",
      "点钟": "o'clock",
      "分钟": "minute",
      "半": "half",
      "休息、假日": "rest / holiday",
      "生日": "birthday",
      "大学": "university",
      "教室": "classroom",
      "房间": "room",
      "城镇": "town",
      "国家": "country",
      "日本": "Japan",
      "中国": "China",
      "外国": "foreign country",
      "机场": "airport",
      "银行": "bank",
      "邮局": "post office",
      "商店": "shop",
      "餐厅": "restaurant",
      "公园": "park",
      "派出所": "police box",
      "桌子": "desk",
      "椅子": "chair",
      "钟表": "clock / watch",
      "电话": "telephone",
      "手机": "mobile phone",
      "照片": "photo",
      "纸": "paper",
      "信": "letter",
      "邮票": "stamp",
      "铅笔": "pencil",
      "笔": "pen",
      "笔记本": "notebook",
      "词典": "dictionary",
      "报纸": "newspaper",
      "杂志": "magazine",
      "地图": "map",
      "钥匙": "key",
      "伞": "umbrella",
      "鞋": "shoes",
      "衣服": "clothes",
      "包": "bag",
      "钱包": "wallet",
      "眼镜": "glasses",
      "食物": "food",
      "饮料": "drink",
      "米饭、饭": "rice / meal",
      "早饭": "breakfast",
      "午饭": "lunch",
      "晚饭": "dinner",
      "面包": "bread",
      "肉": "meat",
      "鱼": "fish",
      "蔬菜": "vegetables",
      "水果": "fruit",
      "鸡蛋": "egg",
      "牛奶": "milk",
      "酒": "alcohol",
      "电车": "train",
      "公交车": "bus",
      "出租车": "taxi",
      "自行车": "bicycle",
      "飞机": "airplane",
      "汽车": "car",
      "道路": "road",
      "右边": "right side",
      "左边": "left side",
      "前面": "front",
      "后面": "back / behind",
      "里面": "inside",
      "外面": "outside",
      "上面": "above / on top",
      "下面": "below / under",
      "附近": "nearby",
      "旁边": "next to",
      "天气": "weather",
      "雨": "rain",
      "雪": "snow",
      "风": "wind",
      "天空": "sky",
      "山": "mountain",
      "河流": "river",
      "海": "sea",
      "树": "tree",
      "花": "flower",
      "手": "hand",
      "脚、腿": "foot / leg",
      "眼睛": "eye",
      "嘴": "mouth",
      "耳朵": "ear",
      "头": "head",
      "咖啡": "coffee",
      "有、在（无生命）": "to exist / to have (inanimate)",
      "有、在（有生命）": "to exist / to have (animate)",
      "回去": "to return",
      "听、问": "to listen / to ask",
      "说话": "to speak",
      "见面": "to meet",
      "卖": "to sell",
      "使用": "to use",
      "制作、做": "to make / to do",
      "休息、请假": "to rest / to take a day off",
      "睡觉": "to sleep",
      "起床、起来": "to get up",
      "洗": "to wash",
      "进入": "to enter",
      "出去、离开": "to go out / to leave",
      "打开": "to open",
      "关闭": "to close",
      "站立": "to stand",
      "坐": "to sit",
      "等待": "to wait",
      "拿、持有": "to hold / to carry",
      "拿取": "to take",
      "拍照": "to take a photo",
      "走路": "to walk",
      "跑": "to run",
      "游泳": "to swim",
      "玩": "to play",
      "借入": "to borrow",
      "借出": "to lend",
      "教、告诉": "to teach / to tell",
      "学习（技能）": "to learn",
      "忘记": "to forget",
      "明白": "to understand",
      "开始": "to begin",
      "结束": "to end",
      "便宜的": "cheap",
      "热的（天气）": "hot weather",
      "冷的（天气）": "cold weather",
      "烫的、热的": "hot to the touch",
      "冷的、凉的": "cold / cool",
      "温暖的": "warm",
      "凉爽的": "cool",
      "难的": "difficult",
      "简单的": "easy",
      "有趣的": "interesting",
      "无聊的": "boring",
      "忙的": "busy",
      "开心的、有趣的": "fun / enjoyable",
      "近的": "near",
      "远的": "far",
      "早的": "early",
      "晚的、慢的": "late / slow",
      "多的": "many",
      "少的": "few",
      "长的": "long",
      "短的": "short",
      "重的": "heavy",
      "轻的": "light",
      "宽广的": "wide / spacious",
      "狭窄的": "narrow",
      "好的": "good",
      "坏的": "bad",
      "红色的": "red",
      "蓝色的": "blue",
      "白色的": "white",
      "黑色的": "black",
      "精神、健康": "energetic / healthy",
      "漂亮、干净": "beautiful / clean",
      "安静": "quiet",
      "热闹": "lively",
      "喜欢": "to like",
      "讨厌": "to dislike",
      "擅长": "good at",
      "不擅长": "not good at",
      "没关系、不要紧": "all right / no problem",
      "简单": "simple",
      "非常": "very",
      "一点、少量": "a little",
      "很多": "many / a lot",
      "经常、好好地": "often / well",
      "不太（接否定）": "not very",
      "马上": "soon / right away",
      "已经、再": "already / again",
      "还、尚未": "still / not yet",
      "总是": "always",
      "有时": "sometimes",
      "一起": "together",
      "请": "please",
      "谢谢": "thank you",
      "不好意思、对不起": "excuse me / sorry",
      "是、好的": "yes / okay",
      "不是、不": "no / not",
      "喂（电话）": "hello (on the phone)",
      "日元": "yen",
      "地面": "ground",
      "......天": "... days",
      "（针对）...月": "... month",
      "如何": "how",
      "这个": "this",
      "那个": "that",
      "这里": "here",
      "那里": "there",
      "谁": "who",
      "什么": "what",
      "哪里": "where",
      "什么时候": "when",
      "为什么": "why",
      "怎样": "how",
      "在": "is at",
      "谁在家？": "Who is at home?",
      "这句话讲了什么？": "What does this sentence say?",
      "妈妈在家": "Mom is at home",
      "妈妈": "mother",
      "爸爸": "father",
      "父亲": "father",
      "母亲": "mother",
      "学生": "student",
      "老师": "teacher",
      "朋友": "friend",
      "家": "home",
      "学校": "school",
      "公司": "company",
      "医院": "hospital",
      "店": "shop",
      "车站": "station",
      "图书馆": "library",
      "书": "book",
      "水": "water",
      "茶": "tea",
      "饭": "meal",
      "早上": "morning",
      "早晨": "morning",
      "今天": "today",
      "明天": "tomorrow",
      "昨天": "yesterday",
      "去": "go",
      "来": "come",
      "看": "look/read",
      "听": "listen",
      "说": "speak",
      "写": "write",
      "读": "read",
      "学习": "study",
      "工作": "work",
      "吃": "eat",
      "喝": "drink",
      "买": "buy",
      "高的": "high/tall",
      "贵的": "expensive",
      "大的": "big",
      "小的": "small",
      "新的": "new",
      "旧的": "old",
      "方便": "convenient",
      "预约": "reservation",
      "传达": "convey",
      "告诉": "tell",
      "确认": "confirmation",
      "支撑": "support",
      "支持": "support",
      "代替": "substitute",
      "替换": "replace",
      "处理": "handle",
      "操作": "operate",
      "对待": "treat",
      "补充": "supplement",
      "弥补": "make up for",
      "改善": "improvement",
      "限制": "limit",
      "频率": "frequency",
      "概念": "concept",
      "暗示": "suggestion",
      "启发": "insight",
      "抽象": "abstract",
      "名词": "noun",
      "代词": "pronoun",
      "动词": "verb",
      "形容词": "i-adjective",
      "形容动词": "na-adjective",
      "助词": "particle",
      "副词": "adverb",
      "接续词": "conjunction",
      "连体词": "adnominal",
      "表达": "expression",
      "疑问词": "question word",
      "外来语": "loanword",
      "助数词/接尾词": "counter / suffix",
      "接尾词": "suffix",
      "前缀": "prefix",
      "词汇": "vocabulary",
      "副词/表达": "adverb / expression",
      "名词/接尾词": "noun / suffix",
      "名词/前缀": "noun / prefix",
      "动词/表达": "verb / expression",
      "名词/サ变": "noun / suru verb",
      "我是学生。": "I am a student.",
      "你是老师吗？": "Are you a teacher?",
      "这本书是新的。": "This book is new.",
      "那个包是谁的？": "Whose bag is that?",
      "那个人是老师。": "That person is a teacher.",
      "你读哪本书？": "Which book do you read?",
      "这是日语书。": "This is a Japanese book.",
      "那是我的笔记本。": "That is my notebook.",
      "那是车站。": "That is the station.",
      "哪一把是你的伞？": "Which umbrella is yours?",
      "在那里学习。": "Study there.",
      "在这里学习。": "Study here.",
      "那里有椅子。": "There is a chair there.",
      "那边有图书馆。": "There is a library over there.",
      "洗手间在哪里？": "Where is the restroom?",
      "那个人是谁？": "Who is that person?",
      "这是什么？": "What is this?",
      "教室里有人。": "There is a person in the classroom.",
      "那个男人是老师。": "That man is a teacher.",
      "女人在路上走。": "A woman walks on the road.",
      "公园里有孩子。": "There is a child in the park.",
      "和朋友看电影。": "Watch a movie with a friend.",
      "和家人吃饭。": "Eat a meal with family.",
      "我父亲是公司职员。": "My father is a company employee.",
      "我母亲很会做饭。": "My mother is good at cooking.",
      "爸爸很精神。": "Dad is energetic.",
      "给妈妈打电话。": "Call mom.",
      "我哥哥是大学生。": "My older brother is a university student.",
      "我姐姐在日本。": "My older sister is in Japan.",
      "弟弟是小学生。": "My younger brother is an elementary school student.",
      "妹妹喜欢狗。": "My younger sister likes dogs.",
      "向老师提问。": "Ask the teacher a question.",
      "哥哥是公司职员。": "My older brother is a company employee.",
      "父亲是医生。": "My father is a doctor.",
      "请写名字。": "Please write your name.",
      "早上喝咖啡。": "I drink coffee in the morning.",
      "中午吃面包。": "Eat bread at noon.",
      "晚上学习日语。": "Study Japanese at night.",
      "今天很热。": "Today is hot.",
      "昨天看了电影。": "I watched a movie yesterday.",
      "明天去学校。": "Go to school tomorrow.",
      "现在几点？": "What time is it now?",
      "每天读日语。": "Read Japanese every day.",
      "每天早上七点起床。": "Get up at seven every morning.",
      "每天晚上读书。": "Read books every night.",
      "上周见了朋友。": "I met a friend last week.",
      "这周很忙。": "This week is busy.",
      "下周有考试。": "There is an exam next week.",
      "今年去日本。": "Go to Japan this year.",
      "一年有十二个月。": "There are twelve months in a year.",
      "月亮很漂亮。": "The moon is beautiful.",
      "一周学习五天。": "Study five days a week.",
      "没有时间。": "There is no time.",
      "七点起床。": "Get up at seven.",
      "等十分钟。": "Wait ten minutes.",
      "六点半回去。": "Go back at six thirty.",
      "星期天休息。": "Rest on Sunday.",
      "今天是妈妈的生日。": "Today is mom's birthday.",
      "去学校。": "Go to school.",
      "哥哥在大学学习。": "My older brother studies at university.",
      "教室里有桌子。": "There is a desk in the classroom.",
      "在家休息。": "Rest at home.",
      "打扫房间。": "Clean the room.",
      "这个城镇很安静。": "This town is quiet.",
      "日本是小国家。": "Japan is a small country.",
      "去日本。": "Go to Japan.",
      "从中国来了。": "Came from China.",
      "有外国朋友。": "I have foreign friends.",
      "车站在哪里？": "Where is the station?",
      "在机场等朋友。": "Wait for a friend at the airport.",
      "在银行取钱。": "Withdraw money at the bank.",
      "在邮局买邮票。": "Buy stamps at the post office.",
      "在图书馆读书。": "Read books at the library.",
      "去医院。": "Go to the hospital.",
      "在店里买面包。": "Buy bread at the shop.",
      "在餐厅吃午饭。": "Eat lunch at the restaurant.",
      "在公园散步。": "Take a walk in the park.",
      "去公司。": "Go to the company.",
      "在派出所问路。": "Ask for directions at the police box.",
      "桌上有书。": "There is a book on the desk.",
      "坐在椅子上。": "Sit on a chair.",
      "看钟表。": "Look at the clock.",
      "给朋友打电话。": "Call a friend.",
      "用手机拍照。": "Take a photo with a mobile phone.",
      "拍照片。": "Take a photo.",
      "在纸上写名字。": "Write your name on paper.",
      "给朋友写信。": "Write a letter to a friend.",
      "买三张邮票。": "Buy three stamps.",
      "用铅笔写。": "Write with a pencil.",
      "这支笔很好写。": "This pen is easy to write with.",
      "在笔记本上写汉字。": "Write kanji in a notebook.",
      "用词典查单词。": "Look up words in a dictionary.",
      "早上读报纸。": "Read the newspaper in the morning.",
      "买了杂志。": "Bought a magazine.",
      "请看地图。": "Please look at the map.",
      "忘记钥匙了。": "I forgot my key.",
      "因为下雨，所以带伞。": "Because it is raining, bring an umbrella.",
      "买了新鞋。": "Bought new shoes.",
      "穿白色衣服。": "Wear white clothes.",
      "包里有书。": "There is a book in the bag.",
      "钱包丢了。": "I lost my wallet.",
      "戴眼镜。": "Wear glasses.",
      "读日语书。": "Read a Japanese book.",
      "喜欢的食物是什么？": "What food do you like?",
      "喝冷饮。": "Drink a cold drink.",
      "吃饭。": "Eat a meal.",
      "吃早饭。": "Eat breakfast.",
      "午饭是什么？": "What is lunch?",
      "做晚饭。": "Make dinner.",
      "买面包和牛奶。": "Buy bread and milk.",
      "吃肉。": "Eat meat.",
      "喜欢鱼。": "Like fish.",
      "吃很多蔬菜。": "Eat many vegetables.",
      "买水果。": "Buy fruit.",
      "吃一个鸡蛋。": "Eat one egg.",
      "喝牛奶。": "Drink milk.",
      "喝茶。": "Drink tea.",
      "请给我水。": "Please give me water.",
      "父亲不喝酒。": "My father does not drink alcohol.",
      "这本书有点贵。": "This book is a little expensive.",
      "预约了酒店。": "I reserved a hotel.",
      "把计划告诉老师。": "Tell the teacher the plan.",
      "这个应用很方便。": "This app is convenient.",
      "确认邮件内容。": "Check the email contents.",
      "家人支持着我。": "My family supports me.",
      "代替朋友去。": "Go in place of a friend.",
      "这个应用会自动处理学习计划。": "This app handles study plans automatically.",
      "通过练习弥补弱点。": "Make up for weak points through practice.",
      "改善了学习方法。": "Improved the study method.",
      "限制时间做题。": "Answer questions with a time limit.",
      "提高复习频率。": "Increase review frequency.",
      "理解抽象概念。": "Understand abstract concepts.",
      "这个结果暗示了重要之处。": "This result suggests an important point.",
      "练习阅读抽象文章。": "Practice reading abstract texts."
    },
    vi: {
      "我": "tôi",
      "你": "bạn",
      "他": "anh ấy",
      "她": "cô ấy",
      "我们": "chúng tôi",
      "这个": "cái này",
      "那个": "cái đó",
      "谁": "ai",
      "什么": "cái gì",
      "哪里": "ở đâu",
      "在": "ở",
      "谁在家？": "Ai ở nhà?",
      "这句话讲了什么？": "Câu này nói về điều gì?",
      "妈妈在家": "Mẹ ở nhà",
      "妈妈": "mẹ",
      "爸爸": "bố",
      "父亲": "bố",
      "母亲": "mẹ",
      "学生": "học sinh",
      "老师": "giáo viên",
      "朋友": "bạn bè",
      "家": "nhà",
      "学校": "trường học",
      "书": "sách",
      "水": "nước",
      "早上": "buổi sáng",
      "早晨": "buổi sáng",
      "去": "đi",
      "来": "đến",
      "学习": "học",
      "高的": "cao",
      "贵的": "đắt",
      "方便": "tiện lợi",
      "预约": "đặt trước",
      "传达": "truyền đạt",
      "告诉": "nói cho biết",
      "确认": "xác nhận",
      "支撑": "chống đỡ",
      "支持": "ủng hộ",
      "代替": "thay thế",
      "替换": "thay đổi",
      "处理": "xử lý",
      "操作": "thao tác",
      "对待": "đối xử",
      "补充": "bổ sung",
      "弥补": "bù đắp",
      "改善": "cải thiện",
      "限制": "giới hạn",
      "频率": "tần suất",
      "概念": "khái niệm",
      "暗示": "gợi ý",
      "启发": "gợi mở",
      "抽象": "trừu tượng",
      "名词": "danh từ",
      "代词": "đại từ",
      "动词": "động từ",
      "形容词": "tính từ i",
      "形容动词": "tính từ na",
      "助词": "trợ từ",
      "名词/サ变": "danh từ / động từ suru"
    },
    ne: {
      "我": "म",
      "你": "तिमी",
      "他": "उहाँ",
      "她": "उहाँ",
      "我们": "हामी",
      "这个": "यो",
      "那个": "त्यो",
      "谁": "को",
      "什么": "के",
      "哪里": "कहाँ",
      "在": "मा छ",
      "谁在家？": "घरमा को छ?",
      "这句话讲了什么？": "यो वाक्यले के भन्छ?",
      "妈妈在家": "आमा घरमा हुनुहुन्छ",
      "妈妈": "आमा",
      "爸爸": "बुबा",
      "父亲": "बुबा",
      "母亲": "आमा",
      "学生": "विद्यार्थी",
      "老师": "शिक्षक",
      "朋友": "साथी",
      "家": "घर",
      "学校": "विद्यालय",
      "书": "किताब",
      "水": "पानी",
      "早上": "बिहान",
      "早晨": "बिहान",
      "去": "जानु",
      "来": "आउनु",
      "学习": "पढ्नु",
      "高的": "अग्लो",
      "贵的": "महँगो",
      "方便": "सुविधाजनक",
      "预约": "बुकिङ",
      "传达": "पुर्‍याउनु",
      "告诉": "बताउनु",
      "确认": "पुष्टि",
      "支撑": "समर्थन",
      "支持": "समर्थन",
      "代替": "सट्टा",
      "替换": "बदल्नु",
      "处理": "व्यवहार गर्नु",
      "操作": "सञ्चालन",
      "对待": "व्यवहार",
      "补充": "थप्नु",
      "弥补": "पूर्ति गर्नु",
      "改善": "सुधार",
      "限制": "सीमा",
      "频率": "आवृत्ति",
      "概念": "अवधारणा",
      "暗示": "सङ्केत",
      "启发": "प्रेरणा",
      "抽象": "अमूर्त",
      "名词": "संज्ञा",
      "代词": "सर्वनाम",
      "动词": "क्रिया",
      "形容词": "विशेषण",
      "形容动词": "na-विशेषण",
      "助词": "particle",
      "名词/サ变": "संज्ञा / suru क्रिया"
    },
    mn: {
      "我": "би",
      "你": "чи",
      "他": "тэр",
      "她": "тэр",
      "我们": "бид",
      "这个": "энэ",
      "那个": "тэр",
      "谁": "хэн",
      "什么": "юу",
      "哪里": "хаана",
      "在": "байна",
      "谁在家？": "Гэрт хэн байна?",
      "这句话讲了什么？": "Энэ өгүүлбэр юуны тухай вэ?",
      "妈妈在家": "Ээж гэрт байна",
      "妈妈": "ээж",
      "爸爸": "аав",
      "父亲": "аав",
      "母亲": "ээж",
      "学生": "сурагч",
      "老师": "багш",
      "朋友": "найз",
      "家": "гэр",
      "学校": "сургууль",
      "书": "ном",
      "水": "ус",
      "早上": "өглөө",
      "早晨": "өглөө",
      "去": "явах",
      "来": "ирэх",
      "学习": "сурах",
      "高的": "өндөр",
      "贵的": "үнэтэй",
      "方便": "тохиромжтой",
      "预约": "захиалга",
      "传达": "дамжуулах",
      "告诉": "хэлэх",
      "确认": "баталгаажуулах",
      "支撑": "түших",
      "支持": "дэмжих",
      "代替": "орлох",
      "替换": "солих",
      "处理": "зохицуулах",
      "操作": "ажиллуулах",
      "对待": "хандах",
      "补充": "нөхөх",
      "弥补": "нөхөх",
      "改善": "сайжруулах",
      "限制": "хязгаар",
      "频率": "давтамж",
      "概念": "ойлголт",
      "暗示": "сануулга",
      "启发": "сэдэл",
      "抽象": "хийсвэр",
      "名词": "нэр үг",
      "代词": "төлөөний үг",
      "动词": "үйл үг",
      "形容词": "i-тэмдэг нэр",
      "形容动词": "na-тэмдэг нэр",
      "助词": "particle",
      "名词/サ变": "нэр үг / suru үйл үг"
    }
  };

  const traditionalLearningTerms = {
    "婴儿": "嬰兒",
    "预约": "預約",
    "确认": "確認",
    "频率": "頻率",
    "启发": "啟發",
    "传达": "傳達",
    "告诉": "告訴",
    "处理": "處理",
    "补充": "補充",
    "弥补": "彌補",
    "学习": "學習",
    "语法": "語法",
    "阅读": "閱讀",
    "听力": "聽力",
    "单词": "單詞",
    "错题": "錯題",
    "测验": "測驗",
    "练习": "練習",
    "进度": "進度"
    ,"名词": "名詞"
    ,"代词": "代詞"
    ,"动词": "動詞"
    ,"形容词": "形容詞"
    ,"形容动词": "形容動詞"
    ,"助词": "助詞"
    ,"副词": "副詞"
    ,"接续词": "接續詞"
    ,"中文意思": "中文意思"
    ,"妈妈": "媽媽"
    ,"爸爸": "爸爸"
    ,"父亲": "父親"
    ,"母亲": "母親"
    ,"学生": "學生"
    ,"老师": "老師"
    ,"家": "家"
    ,"在": "在"
  };

  const genericLearningPhrases = {
    en: {
      "中文意思：": "Meaning: ",
      "正确答案是：": "Correct answer: ",
      "答案不对。": "Not correct. ",
      "答对了。": "Correct. ",
      "还差一点。": "Almost. ",
      "请只根据上面的日语文本选择正确答案。": "Choose the correct answer using only the Japanese text above.",
      "不要把": "Do not treat ",
      "完全等同": " as exactly the same",
      "这里": "Here",
      "表示": "means",
      "用来": "is used to",
      "提示": "mark",
      "话题": "topic",
      "主语": "subject",
      "介绍": "introduce",
      "人物": "people",
      "物品": "things",
      "身份": "identity",
      "句子": "sentence",
      "主要内容": "main idea"
    },
    vi: {
      "中文意思：": "Nghĩa: ",
      "正确答案是：": "Đáp án đúng: ",
      "答案不对。": "Chưa đúng. ",
      "答对了。": "Đúng rồi. ",
      "还差一点。": "Gần đúng. "
    },
    ne: {
      "中文意思：": "अर्थ: ",
      "正确答案是：": "सही उत्तर: ",
      "答案不对。": "सही भएन। ",
      "答对了。": "सही। ",
      "还差一点。": "अलि पुगेन। "
    },
    mn: {
      "中文意思：": "Утга: ",
      "正确答案是：": "Зөв хариулт: ",
      "答案不对。": "Буруу байна. ",
      "答对了。": "Зөв. ",
      "还差一点。": "Бага зэрэг дутуу. "
    }
  };

  const uiPhrases = {
    "zh-TW": {
      全部: "全部",
      暂无语法点: "暫無文法點",
      "请切换其他等级。": "請切換其他等級。",
      "整理分类、接续和小测。": "整理分類、接續和小測。",
      阅读单元: "閱讀單元",
      读解: "讀解",
      读解问题: "讀解問題",
      已听懂: "已聽懂",
      回答正确: "回答正確",
      答案解析: "答案解析",
      "答对了。下面可以看中文意思和解析。": "答對了。下面可以看中文意思和解析。",
      "学习页只保留播放、标记和切换题目；集中答题请进入独立测验页。": "學習頁只保留播放、標記和切換題目；集中答題請進入獨立測驗頁。",
      "像考试一样做阅读理解": "像考試一樣做閱讀理解",
      "这里只做内容训练": "這裡只做內容訓練",
      "先在这里完成短句理解，也可以进入独立测验页集中练习。": "先在這裡完成短句理解，也可以進入獨立測驗頁集中練習。",
      "读完材料和步骤后，进入独立测验页答题。": "讀完材料和步驟後，進入獨立測驗頁答題。",
      "当前浏览器暂不支持语音播放": "目前瀏覽器暫不支援語音播放",
      "已标记学会，继续下一条。": "已標記學會，繼續下一條。",
      本次背会: "本次背會",
      正确率: "正確率",
      进入错题本的单词: "進入錯題本的單字",
      这一单元没有错题: "這一單元沒有錯題",
      "很稳，可以进入下一个单元。": "很穩，可以進入下一個單元。",
      返回学习: "返回學習",
      查看错题本: "查看錯題本",
      再做错题测试: "再做錯題測試",
      再测一次: "再測一次",
      回到单词页: "回到單字頁",
      先休息: "先休息",
    },
    en: {
      全部: "All",
      暂无语法点: "No grammar points yet",
      "请切换其他等级。": "Switch to another level.",
      "整理分类、接续和小测。": "Organizing categories, structures, and mini quizzes.",
      阅读单元: "Reading units",
      读解: "Reading",
      读解问题: "Reading question",
      已听懂: "Understood",
      回答正确: "Correct",
      答案解析: "Answer explanation",
      "答对了。下面可以看中文意思和解析。": "Correct. You can now view the meaning and explanation.",
      "学习页只保留播放、标记和切换题目；集中答题请进入独立测验页。": "The study page keeps playback, marking, and switching only. Use the separate quiz page for focused answers.",
      "像考试一样做阅读理解": "Practice reading like an exam",
      "这里只做内容训练": "Content training only",
      "先在这里完成短句理解，也可以进入独立测验页集中练习。": "Complete short-sentence reading here, or use the separate quiz page for focused practice.",
      "读完材料和步骤后，进入独立测验页答题。": "After reading the material and steps, answer in the separate quiz page.",
      "当前浏览器暂不支持语音播放": "This browser does not support speech playback yet.",
      "已标记学会，继续下一条。": "Marked as learned. Moving to the next item.",
      本次背会: "Learned this time",
      正确率: "Accuracy",
      进入错题本的单词: "Words added to the mistake book",
      这一单元没有错题: "No mistakes in this unit",
      "很稳，可以进入下一个单元。": "Nice and steady. You can move to the next unit.",
      返回学习: "Back to study",
      查看错题本: "View mistake book",
      再做错题测试: "Retake mistake quiz",
      再测一次: "Quiz again",
      回到单词页: "Back to vocabulary",
      先休息: "Rest first",
    },
    vi: {
      全部: "Tất cả",
      暂无语法点: "Chưa có điểm ngữ pháp",
      "请切换其他等级。": "Hãy đổi sang cấp độ khác.",
      "整理分类、接续和小测。": "Đang sắp xếp phân loại, cấu trúc và bài nhỏ.",
      阅读单元: "Bài đọc",
      读解: "Đọc hiểu",
      读解问题: "Câu hỏi đọc hiểu",
      已听懂: "Đã hiểu",
      回答正确: "Đúng",
      答案解析: "Giải thích đáp án",
      "答对了。下面可以看中文意思和解析。": "Đúng rồi. Bên dưới có nghĩa và giải thích.",
      "学习页只保留播放、标记和切换题目；集中答题请进入独立测验页。": "Trang học chỉ để phát, đánh dấu và đổi câu. Hãy vào trang kiểm tra riêng để làm bài tập trung.",
      "像考试一样做阅读理解": "Làm đọc hiểu như bài thi",
      "这里只做内容训练": "Chỉ luyện nội dung ở đây",
      "先在这里完成短句理解，也可以进入独立测验页集中练习。": "Hoàn thành đọc câu ngắn ở đây, hoặc vào trang kiểm tra riêng để luyện tập trung.",
      "读完材料和步骤后，进入独立测验页答题。": "Sau khi đọc tài liệu và bước làm, vào trang kiểm tra riêng để trả lời.",
      "当前浏览器暂不支持语音播放": "Trình duyệt hiện chưa hỗ trợ phát giọng nói.",
      "已标记学会，继续下一条。": "Đã đánh dấu học xong, chuyển sang mục tiếp theo.",
      本次背会: "Đã nhớ lần này",
      正确率: "Tỉ lệ đúng",
      进入错题本的单词: "Từ đã vào sổ lỗi",
      这一单元没有错题: "Bài này không có lỗi",
      "很稳，可以进入下一个单元。": "Rất ổn, có thể sang bài tiếp theo.",
      返回学习: "Quay lại học",
      查看错题本: "Xem sổ lỗi",
      再做错题测试: "Làm lại lỗi sai",
      再测一次: "Kiểm tra lại",
      回到单词页: "Về trang từ vựng",
      先休息: "Nghỉ trước",
    },
    ne: {
      全部: "सबै",
      暂无语法点: "अहिले व्याकरण बिन्दु छैन",
      "请切换其他等级。": "कृपया अर्को स्तर छान्नुहोस्।",
      阅读单元: "पठन युनिट",
      读解: "पठन",
      读解问题: "पठन प्रश्न",
      已听懂: "बुझियो",
      回答正确: "सही",
      答案解析: "उत्तर व्याख्या",
      "答对了。下面可以看中文意思和解析。": "सही। तल अर्थ र व्याख्या हेर्न सकिन्छ।",
      "当前浏览器暂不支持语音播放": "यो ब्राउजरले अहिले आवाज बजाउन समर्थन गर्दैन।",
      "已标记学会，继续下一条。": "सिकियो भनेर चिन्ह लगाइयो। अर्कोमा जाँदैछ।",
      本次背会: "यस पटक याद भयो",
      正确率: "सही दर",
      进入错题本的单词: "गल्ती पुस्तिकामा गएका शब्द",
      这一单元没有错题: "यो युनिटमा गल्ती छैन",
      返回学习: "अध्ययनमा फर्कनुहोस्",
      查看错题本: "गल्ती पुस्तिका हेर्नुहोस्",
      再测一次: "फेरि परीक्षा",
      回到单词页: "शब्द पृष्ठमा फर्कनुहोस्",
      先休息: "पहिले आराम",
    },
    mn: {
      全部: "Бүгд",
      暂无语法点: "Одоогоор дүрмийн цэг алга",
      "请切换其他等级。": "Өөр түвшин сонгоно уу.",
      阅读单元: "Унших нэгж",
      读解: "Унших",
      读解问题: "Унших асуулт",
      已听懂: "Ойлгосон",
      回答正确: "Зөв",
      答案解析: "Хариултын тайлбар",
      "答对了。下面可以看中文意思和解析。": "Зөв. Доор утга ба тайлбарыг харж болно.",
      "当前浏览器暂不支持语音播放": "Энэ хөтөч одоогоор яриа тоглуулахгүй.",
      "已标记学会，继续下一条。": "Сурснаар тэмдэглээд дараагийнх руу орлоо.",
      本次背会: "Энэ удаа цээжилсэн",
      正确率: "Зөв хувь",
      进入错题本的单词: "Алдааны дэвтэрт орсон үг",
      这一单元没有错题: "Энэ нэгжид алдаа алга",
      返回学习: "Сурах руу буцах",
      查看错题本: "Алдааны дэвтэр харах",
      再测一次: "Дахин шалгах",
      回到单词页: "Үгийн хуудас руу буцах",
      先休息: "Эхлээд амрах",
    },
  };

  function toTraditionalText(value) {
    return String(value ?? "").replace(
      /婴儿|预约|确认|频率|启发|传达|告诉|处理|补充|弥补|学习|语法|阅读|听力|单词|错题|测验|练习|进度|名词|代词|动词|形容词|形容动词|助词|副词|接续词|中文意思|妈妈|爸爸|父亲|母亲|学生|老师|家|在/g,
      (match) => traditionalLearningTerms[match] || match
    );
  }

  function translateLearningPattern(source, lang, dictionary) {
    let match = source.match(/^用「(.+)」造句。$/);
    if (match) {
      if (lang === "en") return `Make a sentence with “${match[1]}”.`;
      if (lang === "vi") return `Hãy đặt câu với “${match[1]}”.`;
      if (lang === "ne") return `“${match[1]}” प्रयोग गरेर वाक्य बनाउनुहोस्।`;
      if (lang === "mn") return `“${match[1]}”-г ашиглан өгүүлбэр зохио.`;
    }
    if (lang !== "en") return "";

    const word = (value) => dictionary[value] || value;
    const withArticle = (value) => {
      const text = word(value);
      if (/^(a|an|the|my|your|his|her|our|their)\b/i.test(text)) return text;
      if (/s$|children|people|clothes|glasses|shoes|vegetables/i.test(text)) return text;
      return `${/^[aeiou]/i.test(text) ? "an" : "a"} ${text}`;
    };

    match = source.match(/^(.+)里有(.+)。$/);
    if (match) return `There is ${withArticle(match[2])} in the ${word(match[1])}.`;
    match = source.match(/^(.+)上有(.+)。$/);
    if (match) return `There is ${withArticle(match[2])} on the ${word(match[1])}.`;
    match = source.match(/^(.+)下面有(.+)。$/);
    if (match) return `There is ${withArticle(match[2])} under the ${word(match[1])}.`;
    match = source.match(/^(.+)后面有(.+)。$/);
    if (match) return `There is ${withArticle(match[2])} behind the ${word(match[1])}.`;
    match = source.match(/^(.+)前有(.+)。$/);
    if (match) return `There is ${withArticle(match[2])} in front of the ${word(match[1])}.`;
    match = source.match(/^(.+)有(.+)。$/);
    if (match && /那里|那边|左边|右边|附近|旁边|教室|公园|包|桌|椅子|院子|学校/.test(match[1])) {
      const place = word(match[1]);
      return place === match[1] ? `There is ${withArticle(match[2])}.` : `There is ${withArticle(match[2])} near ${place}.`;
    }
    match = source.match(/^(.+)是(.+)。$/);
    if (match) return `${word(match[1])} is ${withArticle(match[2])}.`;
    match = source.match(/^(.+)很(.+)。$/);
    if (match) return `${word(match[1])} is very ${word(match[2])}.`;
    return "";
  }

  function translateLearningText(value) {
    const source = String(value ?? "");
    const lang = currentLanguage();
    if (!source || lang === defaultLanguage) return source;
    if (lang === "zh-TW") return toTraditionalText(source);
    const dictionary = learningTerms[lang] || {};
    const phrases = genericLearningPhrases[lang] || {};
    if (dictionary[source]) return dictionary[source];
    if (phrases[source]) return phrases[source];
    const patterned = translateLearningPattern(source, lang, dictionary);
    if (patterned) return patterned;
    let translated = source;
    Object.entries({ ...phrases, ...dictionary })
      .sort((a, b) => b[0].length - a[0].length)
      .forEach(([from, to]) => {
        translated = translated.split(from).join(to);
      });
    return translated;
  }

  function uiText(value, params = {}) {
    const source = format(value, params);
    if (currentLanguage() === defaultLanguage) return source;
    const phrase = uiPhrases[currentLanguage()]?.[source];
    if (phrase) return phrase;
    const known = translateKnownSource(source);
    if (known !== source) return known;
    return translateLearningText(source);
  }

  const originalText = new WeakMap();
  let applying = false;
  let applyQueued = false;

  function currentLanguage() {
    return localStorage.getItem(storageKey) || defaultLanguage;
  }

  function format(template, params = {}) {
    return String(template || "").replace(/\{(\w+)\}/g, (_, key) => params[key] ?? "");
  }

  function t(key, params = {}) {
    const lang = currentLanguage();
    return format(messages[lang]?.[key] || messages[defaultLanguage][key] || key, params);
  }

  function moduleNameFromSource(value) {
    const modules = {
      单词: t("module.vocabulary"),
      语法: t("module.grammar"),
      阅读: t("module.reading"),
      听力: t("module.listening"),
    };
    return modules[value] || value;
  }

  function translateKnownSource(source) {
    const lang = currentLanguage();
    const trimmed = source.trim();
    if (!trimmed || lang === defaultLanguage) return source;
    const key = sourceKeyMap[trimmed];
    if (key) return t(key);
    const exact = phraseBundles[lang]?.[trimmed];
    if (exact) return exact;
    let match = trimmed.match(/^第 (\d+) 题$/);
    if (match) {
      if (lang === "en") return `Question ${match[1]}`;
      if (lang === "zh-TW") return `第 ${match[1]} 題`;
      if (lang === "vi") return `Câu ${match[1]}`;
      if (lang === "ne") return `प्रश्न ${match[1]}`;
      if (lang === "mn") return `${match[1]}-р асуулт`;
    }
    match = trimmed.match(/^阅读题 (\d+)$/);
    if (match) {
      if (lang === "en") return `Reading question ${match[1]}`;
      if (lang === "zh-TW") return `閱讀題 ${match[1]}`;
      if (lang === "vi") return `Câu đọc hiểu ${match[1]}`;
      if (lang === "ne") return `पठन प्रश्न ${match[1]}`;
      if (lang === "mn") return `Унших асуулт ${match[1]}`;
    }
    match = trimmed.match(/^第 (\d+) 单元$/);
    if (match) {
      if (lang === "en") return `Unit ${match[1]}`;
      if (lang === "zh-TW") return `第 ${match[1]} 單元`;
      if (lang === "vi") return `Bài ${match[1]}`;
      if (lang === "ne") return `युनिट ${match[1]}`;
      if (lang === "mn") return `${match[1]}-р нэгж`;
    }
    match = trimmed.match(/^继续第 (\d+) 单元$/);
    if (match) {
      if (lang === "en") return `Continue Unit ${match[1]}`;
      if (lang === "zh-TW") return `繼續第 ${match[1]} 單元`;
      if (lang === "vi") return `Tiếp tục bài ${match[1]}`;
      if (lang === "ne") return `युनिट ${match[1]} जारी राख्नुहोस्`;
      if (lang === "mn") return `${match[1]}-р нэгжийг үргэлжлүүлэх`;
    }
    match = trimmed.match(/^继续学习第 (\d+) 单元$/);
    if (match) {
      if (lang === "en") return `Continue studying Unit ${match[1]}`;
      if (lang === "zh-TW") return `繼續學習第 ${match[1]} 單元`;
      if (lang === "vi") return `Tiếp tục học bài ${match[1]}`;
      if (lang === "ne") return `युनिट ${match[1]} अध्ययन जारी राख्नुहोस्`;
      if (lang === "mn") return `${match[1]}-р нэгжийг үргэлжлүүлэн сурах`;
    }
    match = trimmed.match(/^要继续第 (\d+) 单元吗？$/);
    if (match) {
      if (lang === "en") return `Continue to Unit ${match[1]}?`;
      if (lang === "zh-TW") return `要繼續第 ${match[1]} 單元嗎？`;
      if (lang === "vi") return `Tiếp tục sang bài ${match[1]} không?`;
      if (lang === "ne") return `युनिट ${match[1]} मा जारी राख्ने?`;
      if (lang === "mn") return `${match[1]}-р нэгж рүү үргэлжлүүлэх үү?`;
    }
    match = trimmed.match(/^每单元 (\d+) 题$/);
    if (match) {
      if (lang === "en") return `${match[1]} questions per unit`;
      if (lang === "zh-TW") return `每單元 ${match[1]} 題`;
      if (lang === "vi") return `${match[1]} câu mỗi bài`;
      if (lang === "ne") return `प्रति युनिट ${match[1]} प्रश्न`;
      if (lang === "mn") return `Нэг нэгжид ${match[1]} асуулт`;
    }
    match = trimmed.match(/^(N[1-5]) 所有单元完成啦$/);
    if (match) {
      if (lang === "en") return `${match[1]} all units complete`;
      if (lang === "zh-TW") return `${match[1]} 所有單元完成啦`;
      if (lang === "vi") return `Đã hoàn thành tất cả bài ${match[1]}`;
      if (lang === "ne") return `${match[1]} का सबै युनिट पूरा भयो`;
      if (lang === "mn") return `${match[1]} бүх нэгж дууслаа`;
    }
    match = trimmed.match(/^(.+)测验完成$/);
    if (match) {
      if (lang === "en") return `${match[1]} quiz complete`;
      if (lang === "zh-TW") return `${match[1]}測驗完成`;
      if (lang === "vi") return `Hoàn thành kiểm tra ${match[1]}`;
      if (lang === "ne") return `${match[1]} परीक्षा पूरा भयो`;
      if (lang === "mn") return `${match[1]} шалгалт дууслаа`;
    }
    match = trimmed.match(/^进入 (N[1-5]) (单词|语法|阅读|听力)测验$/);
    if (match) return `${t("common.enterTest")} ${match[1]} ${moduleNameFromSource(match[2])} ${t("common.test")}`;
    match = trimmed.match(/^开始(单词|语法|阅读|听力)测验$/);
    if (match) return `${t("common.startTest")} ${moduleNameFromSource(match[1])}`;
    match = trimmed.match(/^(N[1-5]) (单词|语法|阅读|听力)(训练|学习|测验)$/);
    if (match) return `${match[1]} ${moduleNameFromSource(match[2])} ${match[3] === "测验" ? t("common.test") : t("common.training")}`;
    match = trimmed.match(/^正在载入 (N[1-5]) (单词|语法|测验)$/);
    if (match) return lang === "en" ? `Loading ${match[1]} ${match[2] === "单词" ? "vocabulary" : match[2] === "语法" ? "grammar" : "quiz"}` : `${match[1]} ${phraseBundles[lang]?.[`正在载入${match[2]}`] || phraseBundles[lang]?.正在载入测验 || trimmed}`;
    match = trimmed.match(/^当前单元：第 (\d+)-(\d+) 题$/);
    if (match) {
      if (lang === "en") return `Current unit: Questions ${match[1]}-${match[2]}`;
      if (lang === "zh-TW") return `目前單元：第 ${match[1]}-${match[2]} 題`;
      if (lang === "vi") return `Bài hiện tại: câu ${match[1]}-${match[2]}`;
      if (lang === "ne") return `हालको युनिट: प्रश्न ${match[1]}-${match[2]}`;
      if (lang === "mn") return `Одоогийн нэгж: ${match[1]}-${match[2]} асуулт`;
    }
    match = trimmed.match(/^已从第 (\d+) 题继续$/);
    if (match) {
      if (lang === "en") return `Resumed from question ${match[1]}`;
      if (lang === "zh-TW") return `已從第 ${match[1]} 題繼續`;
      if (lang === "vi") return `Tiếp tục từ câu ${match[1]}`;
      if (lang === "ne") return `प्रश्न ${match[1]} बाट जारी`;
      if (lang === "mn") return `${match[1]}-р асуултаас үргэлжиллээ`;
    }
    match = trimmed.match(/^还差一点。正确答案是：(.+)$/);
    if (match) return lang === "en" ? `Almost. Correct answer: ${match[1]}` : trimmed;
    match = trimmed.match(/^错题复习完成：本次答对 (\d+) 个，仍需复习 (\d+) 个。答对的单词会更新记录，掌握后会离开错题本。$/);
    if (match) {
      if (lang === "en") return `Mistake review complete: ${match[1]} correct, ${match[2]} still need review. Correct words are updated and leave the mistake book after mastery.`;
      if (lang === "zh-TW") return `錯題複習完成：本次答對 ${match[1]} 個，仍需複習 ${match[2]} 個。答對的單字會更新記錄，掌握後會離開錯題本。`;
      if (lang === "vi") return `Hoàn thành ôn lỗi: đúng ${match[1]} từ, còn ${match[2]} từ cần ôn. Từ trả lời đúng sẽ được cập nhật và rời sổ lỗi sau khi nắm vững.`;
      if (lang === "ne") return `गल्ती पुनरावृत्ति पूरा: ${match[1]} सही, ${match[2]} अझै दोहोर्याउनुपर्ने। सही शब्दहरूको रेकर्ड अपडेट हुन्छ र सिकेपछि गल्ती पुस्तिकाबाट हट्छ।`;
      if (lang === "mn") return `Алдаа давтах дууслаа: ${match[1]} зөв, ${match[2]} үг давтах хэрэгтэй. Зөв хариулсан үгс шинэчлэгдэж, цээжилсний дараа алдааны дэвтрээс гарна.`;
    }
    match = trimmed.match(/^本单元背会 (\d+) 个，待复习 (\d+) 个。答错的单词已经进入错题本，下次可以继续查看。$/);
    if (match) {
      if (lang === "en") return `This unit: ${match[1]} learned, ${match[2]} to review. Wrong words were added to the mistake book for next time.`;
      if (lang === "zh-TW") return `本單元背會 ${match[1]} 個，待複習 ${match[2]} 個。答錯的單字已經進入錯題本，下次可以繼續查看。`;
      if (lang === "vi") return `Bài này: đã nhớ ${match[1]} từ, cần ôn ${match[2]} từ. Từ sai đã vào sổ lỗi để xem lại lần sau.`;
      if (lang === "ne") return `यो युनिट: ${match[1]} शब्द याद भयो, ${match[2]} दोहोर्याउन बाँकी। गलत शब्दहरू अर्को पटक हेर्न गल्ती पुस्तिकामा गए।`;
      if (lang === "mn") return `Энэ нэгж: ${match[1]} үг цээжилсэн, ${match[2]} үг давтах. Буруу үгс дараа харахаар алдааны дэвтэрт орлоо.`;
    }
    match = trimmed.match(/^你已经完成 (N[1-5]) (.+)测验，可以回到学习页继续复习。$/);
    if (match) {
      if (lang === "en") return `You completed the ${match[1]} ${match[2]} quiz. Return to the study page to keep reviewing.`;
      if (lang === "zh-TW") return `你已經完成 ${match[1]} ${match[2]} 測驗，可以回到學習頁繼續複習。`;
      if (lang === "vi") return `Bạn đã hoàn thành bài kiểm tra ${match[1]} ${match[2]}. Hãy quay lại trang học để ôn tiếp.`;
      if (lang === "ne") return `तपाईंले ${match[1]} ${match[2]} परीक्षा पूरा गर्नुभयो। पुनरावृत्ति जारी राख्न अध्ययन पृष्ठमा फर्कनुहोस्।`;
      if (lang === "mn") return `Та ${match[1]} ${match[2]} шалгалтыг дуусгалаа. Давтахын тулд сурах хуудас руу буцна уу.`;
    }
    match = trimmed.match(/^当前 (N[1-5]) 没有需要复习的错题，可以先回到单词页继续学习或做单元测验。$/);
    if (match) {
      if (lang === "en") return `There are no ${match[1]} mistakes to review right now. Return to vocabulary study or take a unit quiz.`;
      if (lang === "zh-TW") return `目前 ${match[1]} 沒有需要複習的錯題，可以先回到單字頁繼續學習或做單元測驗。`;
      if (lang === "vi") return `Hiện không có lỗi ${match[1]} cần ôn. Hãy quay lại học từ vựng hoặc làm kiểm tra bài.`;
      if (lang === "ne") return `अहिले ${match[1]} मा दोहोर्याउनुपर्ने गल्ती छैन। शब्द पृष्ठमा फर्केर पढ्नुहोस् वा युनिट परीक्षा गर्नुहोस्।`;
      if (lang === "mn") return `Одоогоор ${match[1]} түвшинд давтах алдаа алга. Үгийн хуудас руу буцах эсвэл нэгжийн шалгалт хийж болно.`;
    }
    return source;
  }

  function shouldTranslateTextNode(node) {
    const parent = node.parentElement;
    if (!parent || !node.nodeValue.trim()) return false;
    if (parent.closest("script, style, svg, input, textarea, select, option, [data-no-i18n], [data-i18n]")) return false;
    return /[\u4e00-\u9fff]/.test(originalText.get(node) || node.nodeValue);
  }

  function applyDynamicText(root = document) {
    const walker = document.createTreeWalker(root.body || root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (!shouldTranslateTextNode(node)) return;
      const current = node.nodeValue;
      const source = originalText.get(node) || current;
      originalText.set(node, source);
      const leading = source.match(/^\s*/)?.[0] || "";
      const trailing = source.match(/\s*$/)?.[0] || "";
      const translated = translateKnownSource(source.trim());
      const nextValue = `${leading}${translated}${trailing}`;
      if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
    });
  }

  function apply(root = document) {
    applying = true;
    document.documentElement.lang = currentLanguage();
    root.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    root.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
    });
    root.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
    });
    const titleKey = document.body?.dataset.pageTitle;
    if (titleKey) document.title = t(titleKey);
    applyDynamicText(root);
    applying = false;
  }

  function scheduleApply() {
    if (applying || applyQueued) return;
    applyQueued = true;
    window.requestAnimationFrame(() => {
      applyQueued = false;
      apply();
    });
  }

  function makeSwitcher(compact = false) {
    const wrapper = document.createElement("label");
    wrapper.className = compact ? "language-switcher mobile-language-switcher" : "language-switcher";
    const label = document.createElement("span");
    label.dataset.i18n = "language.label";
    const select = document.createElement("select");
    select.setAttribute("aria-label", t("language.label"));
    languages.forEach(([code, name]) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = name;
      select.append(option);
    });
    select.value = currentLanguage();
    select.addEventListener("change", () => setLanguage(select.value));
    wrapper.append(label, select);
    return wrapper;
  }

  function mountSwitcher() {
    if (document.querySelector(".language-switcher")) return;
    const headerActions = document.querySelector(".site-header .header-actions");
    const mobileMenu = document.querySelector(".mobile-menu");
    if (headerActions) {
      headerActions.prepend(makeSwitcher(false));
    } else {
      const floating = makeSwitcher(false);
      floating.classList.add("floating-language-switcher");
      document.body.append(floating);
    }
    if (mobileMenu) mobileMenu.prepend(makeSwitcher(true));
  }

  function setLanguage(language) {
    const nextLanguage = languages.some(([code]) => code === language) ? language : defaultLanguage;
    localStorage.setItem(storageKey, nextLanguage);
    document.querySelectorAll(".language-switcher select").forEach((select) => {
      select.value = nextLanguage;
      select.setAttribute("aria-label", t("language.label"));
    });
    apply();
    window.dispatchEvent(new CustomEvent("nihongo:languagechange", { detail: { language: nextLanguage } }));
  }

  document.addEventListener("DOMContentLoaded", () => {
    mountSwitcher();
    apply();
    const observer = new MutationObserver(() => scheduleApply());
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  });

  return { languages, t, apply, currentLanguage, setLanguage, translateLearningText, uiText };
})();

window.NihongoI18n = NihongoI18n;
