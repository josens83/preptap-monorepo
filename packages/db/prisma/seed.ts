import { PrismaClient, ExamType, QuestionType, UserRole, SchoolLevel } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create demo users
  const hashedPassword = await bcrypt.hash("password123", 10);

  const student = await prisma.user.upsert({
    where: { email: "student@preptap.com" },
    update: {},
    create: {
      email: "student@preptap.com",
      password: hashedPassword,
      role: UserRole.STUDENT,
      profile: {
        create: {
          displayName: "김학생",
          schoolLevel: SchoolLevel.HIGH,
          targetExam: ExamType.SUNEUNG,
          targetScore: 90,
        },
      },
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: "teacher@preptap.com" },
    update: {},
    create: {
      email: "teacher@preptap.com",
      password: hashedPassword,
      role: UserRole.TEACHER,
      profile: {
        create: {
          displayName: "이선생님",
        },
      },
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@preptap.com" },
    update: {},
    create: {
      email: "admin@preptap.com",
      password: hashedPassword,
      role: UserRole.ADMIN,
      profile: {
        create: {
          displayName: "관리자",
        },
      },
    },
  });

  console.log("✓ Created demo users");

  // Seed questions for different exams
  await seedSuneungQuestions();
  await seedToeicQuestions();
  await seedTepsQuestions();
  await seedToeflQuestions();
  await seedIeltsQuestions();

  console.log("✓ Created sample questions");

  // Create a sample course
  const course = await prisma.course.upsert({
    where: { slug: "toeic-grammar-intensive" },
    update: {},
    create: {
      title: "TOEIC Part 5 문법 집중 코스",
      slug: "toeic-grammar-intensive",
      description: "TOEIC Part 5의 고빈출 문법 유형을 2주 완성",
      level: SchoolLevel.UNIVERSITY,
      examType: ExamType.TOEIC,
      price: 49000, // 49,000원
      isPublished: true,
      duration: 14,
    },
  });

  console.log("✓ Created sample course");

  // Create sample practice sessions and results
  await createSamplePracticeData(student.id);

  console.log("✓ Created sample practice sessions");

  console.log("✅ Seed completed!");
  console.log("\n📝 Demo accounts:");
  console.log("   Student: student@preptap.com / password123");
  console.log("   Teacher: teacher@preptap.com / password123");
  console.log("   Admin: admin@preptap.com / password123");
}

async function seedSuneungQuestions() {
  const questions = [
    {
      examType: ExamType.SUNEUNG,
      part: "독해",
      type: QuestionType.MCQ,
      stem: "다음 글의 주제로 가장 적절한 것은?",
      passage: `Climate change is one of the most pressing issues of our time. Rising temperatures, melting ice caps, and extreme weather events are just a few of the consequences we are facing. Scientists agree that human activities, particularly the burning of fossil fuels, are the primary cause of these changes. To address this global challenge, immediate action is required from governments, businesses, and individuals alike.`,
      difficulty: 0.6,
      tags: ["reading", "main-idea", "environment"],
      choices: {
        create: [
          { label: "A", text: "기후 변화의 원인과 해결 방안", isCorrect: true },
          { label: "B", text: "화석 연료의 경제적 이점", isCorrect: false },
          { label: "C", text: "과학자들의 연구 방법론", isCorrect: false },
          { label: "D", text: "극한 기후의 역사적 사례", isCorrect: false },
        ],
      },
      explanation: {
        create: {
          text: "이 글은 기후 변화의 심각성과 그 원인(인간 활동)을 설명하고, 정부·기업·개인의 즉각적인 행동이 필요하다고 주장합니다. 따라서 주제는 '기후 변화의 원인과 해결 방안'입니다.",
        },
      },
    },
    {
      examType: ExamType.SUNEUNG,
      part: "문법",
      type: QuestionType.MCQ,
      stem: "다음 빈칸에 들어갈 말로 가장 적절한 것은?",
      passage: `The conference ______ postponed due to the unexpected snowstorm.`,
      difficulty: 0.4,
      tags: ["grammar", "passive-voice", "verb"],
      choices: {
        create: [
          { label: "A", text: "was", isCorrect: true },
          { label: "B", text: "were", isCorrect: false },
          { label: "C", text: "is", isCorrect: false },
          { label: "D", text: "are", isCorrect: false },
        ],
      },
      explanation: {
        create: {
          text: "주어 'The conference'는 단수이고, 문맥상 과거 시제가 필요하므로 'was'가 정답입니다.",
        },
      },
    },
    {
      examType: ExamType.SUNEUNG,
      part: "어휘",
      type: QuestionType.MCQ,
      stem: "다음 문장에서 밑줄 친 단어와 의미가 가장 가까운 것은?",
      passage: `The artist's work was *innovative* and received widespread acclaim.`,
      difficulty: 0.5,
      tags: ["vocabulary", "synonym"],
      choices: {
        create: [
          { label: "A", text: "traditional", isCorrect: false },
          { label: "B", text: "creative", isCorrect: true },
          { label: "C", text: "expensive", isCorrect: false },
          { label: "D", text: "complex", isCorrect: false },
        ],
      },
      explanation: {
        create: {
          text: "'innovative'는 '혁신적인, 창의적인'이라는 뜻으로, 'creative'와 가장 유사합니다.",
        },
      },
    },
    {
      examType: ExamType.SUNEUNG,
      part: "독해",
      type: QuestionType.MCQ,
      stem: "다음 글의 빈칸에 들어갈 말로 가장 적절한 것은?",
      passage: `Success is not final, failure is not fatal: it is the ______ to continue that counts.`,
      difficulty: 0.7,
      tags: ["reading", "inference", "idiom"],
      choices: {
        create: [
          { label: "A", text: "ability", isCorrect: false },
          { label: "B", text: "courage", isCorrect: true },
          { label: "C", text: "money", isCorrect: false },
          { label: "D", text: "time", isCorrect: false },
        ],
      },
      explanation: {
        create: {
          text: "성공과 실패 모두 결정적이지 않다는 맥락에서, 계속 나아가는 '용기(courage)'가 중요하다는 의미입니다.",
        },
      },
    },
    {
      examType: ExamType.SUNEUNG,
      part: "독해",
      type: QuestionType.MCQ,
      stem: "다음 글에서 필자의 주장으로 가장 적절한 것은?",
      passage: `Reading books is more than just a hobby; it is a gateway to knowledge, imagination, and empathy. Through books, we can experience different cultures, understand diverse perspectives, and develop critical thinking skills. In an age dominated by screens and quick content, taking the time to read a book is an act of mindfulness and self-improvement.`,
      difficulty: 0.55,
      tags: ["reading", "author-opinion"],
      choices: {
        create: [
          { label: "A", text: "독서는 여가 시간의 선택 사항이다", isCorrect: false },
          { label: "B", text: "독서는 지식과 공감 능력을 키우는 중요한 활동이다", isCorrect: true },
          { label: "C", text: "디지털 콘텐츠가 책보다 우수하다", isCorrect: false },
          { label: "D", text: "비판적 사고는 독서와 무관하다", isCorrect: false },
        ],
      },
      explanation: {
        create: {
          text: "필자는 독서가 단순한 취미를 넘어 지식, 상상력, 공감 능력을 키우는 중요한 활동이라고 주장합니다.",
        },
      },
    },
  ];

  for (const q of questions) {
    await prisma.question.create({ data: q });
  }
}

async function seedToeicQuestions() {
  const questions = [
    {
      examType: ExamType.TOEIC,
      part: "Part 5",
      type: QuestionType.MCQ,
      stem: "The new product line has been ______ successful since its launch.",
      difficulty: 0.4,
      tags: ["grammar", "adverb", "toeic-part5"],
      choices: {
        create: [
          { label: "A", text: "extreme", isCorrect: false },
          { label: "B", text: "extremely", isCorrect: true },
          { label: "C", text: "extremes", isCorrect: false },
          { label: "D", text: "extremity", isCorrect: false },
        ],
      },
      explanation: {
        create: {
          text: "형용사 'successful'을 수식하려면 부사 'extremely'가 필요합니다.",
        },
      },
    },
    {
      examType: ExamType.TOEIC,
      part: "Part 5",
      type: QuestionType.MCQ,
      stem: "All employees ______ attend the mandatory safety training next week.",
      difficulty: 0.5,
      tags: ["grammar", "modal-verb", "toeic-part5"],
      choices: {
        create: [
          { label: "A", text: "must", isCorrect: true },
          { label: "B", text: "could", isCorrect: false },
          { label: "C", text: "might", isCorrect: false },
          { label: "D", text: "would", isCorrect: false },
        ],
      },
      explanation: {
        create: {
          text: "'mandatory'(필수적인)이라는 단어가 있으므로, 의무를 나타내는 'must'가 정답입니다.",
        },
      },
    },
    {
      examType: ExamType.TOEIC,
      part: "Part 6",
      type: QuestionType.MCQ,
      stem: "Choose the best word to complete the sentence.",
      passage: `Dear Valued Customer, We are pleased to inform you that your order has been ______ and will arrive within 3-5 business days.`,
      difficulty: 0.45,
      tags: ["vocabulary", "business", "toeic-part6"],
      choices: {
        create: [
          { label: "A", text: "processed", isCorrect: true },
          { label: "B", text: "processing", isCorrect: false },
          { label: "C", text: "process", isCorrect: false },
          { label: "D", text: "processes", isCorrect: false },
        ],
      },
      explanation: {
        create: {
          text: "'has been' 뒤에는 과거분사가 와야 하며, '처리되었다'는 의미로 'processed'가 정답입니다.",
        },
      },
    },
    {
      examType: ExamType.TOEIC,
      part: "Part 7",
      type: QuestionType.READING,
      stem: "What is the main purpose of the email?",
      passage: `Subject: Quarterly Sales Meeting\n\nDear Team,\n\nOur quarterly sales meeting is scheduled for March 15th at 2 PM in Conference Room B. Please prepare a brief presentation on your department's performance and bring any questions or concerns you may have.\n\nBest regards,\nSarah Johnson`,
      difficulty: 0.35,
      tags: ["reading", "email", "purpose", "toeic-part7"],
      choices: {
        create: [
          { label: "A", text: "To announce a new product", isCorrect: false },
          { label: "B", text: "To schedule a quarterly meeting", isCorrect: true },
          { label: "C", text: "To request time off", isCorrect: false },
          { label: "D", text: "To provide sales training", isCorrect: false },
        ],
      },
      explanation: {
        create: {
          text: "이메일의 주요 목적은 분기별 판매 회의 일정을 알리는 것입니다.",
        },
      },
    },
    {
      examType: ExamType.TOEIC,
      part: "Part 5",
      type: QuestionType.MCQ,
      stem: "The manager asked ______ to submit the report by Friday.",
      difficulty: 0.5,
      tags: ["grammar", "pronoun", "toeic-part5"],
      choices: {
        create: [
          { label: "A", text: "we", isCorrect: false },
          { label: "B", text: "us", isCorrect: true },
          { label: "C", text: "our", isCorrect: false },
          { label: "D", text: "ours", isCorrect: false },
        ],
      },
      explanation: {
        create: {
          text: "동사 'asked'의 목적어로 목적격 대명사 'us'가 필요합니다.",
        },
      },
    },
  ];

  for (const q of questions) {
    await prisma.question.create({ data: q });
  }
}

async function seedTepsQuestions() {
  const questions = [
    {
      examType: ExamType.TEPS,
      part: "Grammar",
      type: QuestionType.MCQ,
      stem: "Choose the grammatically correct sentence.",
      difficulty: 0.6,
      tags: ["grammar", "sentence-structure", "teps"],
      choices: {
        create: [
          {
            label: "A",
            text: "Despite of the rain, we continued our journey.",
            isCorrect: false,
          },
          { label: "B", text: "Despite the rain, we continued our journey.", isCorrect: true },
          {
            label: "C",
            text: "Despite for the rain, we continued our journey.",
            isCorrect: false,
          },
          {
            label: "D",
            text: "Despite with the rain, we continued our journey.",
            isCorrect: false,
          },
        ],
      },
      explanation: {
        create: {
          text: "'Despite'는 전치사이므로 바로 명사가 옵니다. 'despite of'는 틀린 표현입니다.",
        },
      },
    },
    {
      examType: ExamType.TEPS,
      part: "Vocabulary",
      type: QuestionType.MCQ,
      stem: "Choose the word closest in meaning to 'meticulous'.",
      difficulty: 0.65,
      tags: ["vocabulary", "synonym", "teps"],
      choices: {
        create: [
          { label: "A", text: "careless", isCorrect: false },
          { label: "B", text: "careful", isCorrect: true },
          { label: "C", text: "quick", isCorrect: false },
          { label: "D", text: "simple", isCorrect: false },
        ],
      },
      explanation: {
        create: {
          text: "'meticulous'는 '꼼꼼한, 세심한'이라는 뜻으로 'careful'과 가장 유사합니다.",
        },
      },
    },
    {
      examType: ExamType.TEPS,
      part: "Reading",
      type: QuestionType.READING,
      stem: "What can be inferred about the author's opinion?",
      passage: `Technological advancements have undoubtedly improved our lives in countless ways. However, we must be cautious about becoming overly dependent on technology at the expense of human connection and critical thinking skills.`,
      difficulty: 0.7,
      tags: ["reading", "inference", "opinion", "teps"],
      choices: {
        create: [
          { label: "A", text: "Technology should be completely avoided", isCorrect: false },
          {
            label: "B",
            text: "Technology has both benefits and potential drawbacks",
            isCorrect: true,
          },
          { label: "C", text: "Technology has no impact on human skills", isCorrect: false },
          { label: "D", text: "Technology only has negative effects", isCorrect: false },
        ],
      },
      explanation: {
        create: {
          text: "저자는 기술의 이점을 인정하면서도 과도한 의존에 대해 경고하고 있어, 장단점이 있다는 견해를 보입니다.",
        },
      },
    },
  ];

  for (const q of questions) {
    await prisma.question.create({ data: q });
  }
}

async function seedToeflQuestions() {
  const questions = [
    {
      examType: ExamType.TOEFL,
      part: "Reading",
      type: QuestionType.READING,
      stem: "According to the passage, what is the primary function of photosynthesis?",
      passage: `Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water. Photosynthesis in plants generally involves the green pigment chlorophyll and generates oxygen as a by-product. This process is essential for life on Earth as it is the primary source of oxygen in the atmosphere.`,
      difficulty: 0.5,
      tags: ["reading", "science", "toefl"],
      choices: {
        create: [
          { label: "A", text: "To produce carbon dioxide", isCorrect: false },
          { label: "B", text: "To synthesize nutrients using sunlight", isCorrect: true },
          { label: "C", text: "To consume oxygen", isCorrect: false },
          { label: "D", text: "To destroy chlorophyll", isCorrect: false },
        ],
      },
      explanation: {
        create: {
          text: "지문에서 광합성은 햇빛을 이용해 영양분을 합성하는 과정이라고 명시되어 있습니다.",
        },
      },
    },
    {
      examType: ExamType.TOEFL,
      part: "Listening",
      type: QuestionType.AUDIO,
      stem: "What is the main topic of the lecture?",
      audioUrl: "https://example.com/toefl-lecture-1.mp3",
      difficulty: 0.6,
      tags: ["listening", "lecture", "toefl"],
      choices: {
        create: [
          { label: "A", text: "The history of art", isCorrect: false },
          { label: "B", text: "The impact of climate change", isCorrect: true },
          { label: "C", text: "Economic theories", isCorrect: false },
          { label: "D", text: "Computer programming", isCorrect: false },
        ],
      },
      explanation: {
        create: {
          text: "강의의 주제는 기후 변화의 영향에 관한 것입니다. (실제 오디오 필요)",
        },
      },
    },
  ];

  for (const q of questions) {
    await prisma.question.create({ data: q });
  }
}

async function seedIeltsQuestions() {
  const questions = [
    {
      examType: ExamType.IELTS,
      part: "Reading",
      type: QuestionType.READING,
      stem: "Which of the following best describes the author's attitude?",
      passage: `The preservation of biodiversity is crucial for maintaining ecosystem balance. Each species, no matter how small, plays a vital role in the intricate web of life. When we lose a species, we risk destabilizing entire ecosystems, which can have far-reaching consequences for human survival.`,
      difficulty: 0.65,
      tags: ["reading", "attitude", "environment", "ielts"],
      choices: {
        create: [
          { label: "A", text: "Indifferent", isCorrect: false },
          { label: "B", text: "Concerned and urgent", isCorrect: true },
          { label: "C", text: "Optimistic", isCorrect: false },
          { label: "D", text: "Neutral", isCorrect: false },
        ],
      },
      explanation: {
        create: {
          text: "저자는 생물 다양성 보존의 중요성을 강조하며 종의 멸종이 가져올 위험에 대해 우려하는 태도를 보입니다.",
        },
      },
    },
    {
      examType: ExamType.IELTS,
      part: "Writing Task 2",
      type: QuestionType.MCQ,
      stem: "Which thesis statement is most appropriate for an essay about online education?",
      difficulty: 0.7,
      tags: ["writing", "thesis", "education", "ielts"],
      choices: {
        create: [
          {
            label: "A",
            text: "Online education is good.",
            isCorrect: false,
          },
          {
            label: "B",
            text: "While online education offers flexibility and accessibility, it also presents challenges in maintaining student engagement and ensuring quality instruction.",
            isCorrect: true,
          },
          {
            label: "C",
            text: "Everyone likes online classes.",
            isCorrect: false,
          },
          {
            label: "D",
            text: "Schools should use computers.",
            isCorrect: false,
          },
        ],
      },
      explanation: {
        create: {
          text: "효과적인 논제문은 주제에 대한 명확한 입장과 논의할 주요 포인트를 제시해야 합니다. B가 가장 적절합니다.",
        },
      },
    },
    {
      examType: ExamType.IELTS,
      part: "Speaking",
      type: QuestionType.MCQ,
      stem: "Which response best demonstrates advanced vocabulary and fluency?",
      difficulty: 0.6,
      tags: ["speaking", "vocabulary", "fluency", "ielts"],
      choices: {
        create: [
          {
            label: "A",
            text: "I like movies. They are fun.",
            isCorrect: false,
          },
          {
            label: "B",
            text: "I'm particularly drawn to thought-provoking films that explore complex social issues and challenge conventional perspectives.",
            isCorrect: true,
          },
          {
            label: "C",
            text: "Movies good.",
            isCorrect: false,
          },
          {
            label: "D",
            text: "I watch many movies every day.",
            isCorrect: false,
          },
        ],
      },
      explanation: {
        create: {
          text: "B는 고급 어휘('particularly drawn to', 'thought-provoking', 'conventional perspectives')와 복잡한 문장 구조를 사용하여 유창함을 보여줍니다.",
        },
      },
    },
  ];

  for (const q of questions) {
    await prisma.question.create({ data: q });
  }
}

async function createSamplePracticeData(userId: string) {
  // Get some questions for practice sessions
  const questions = await prisma.question.findMany({
    take: 10,
    include: { choices: true },
  });

  if (questions.length === 0) {
    console.log("No questions found for practice sessions");
    return;
  }

  // Create 3 completed practice sessions with varying performance
  const sessions = [
    {
      score: 85,
      correctCount: 7,
      totalQuestions: 10,
      studyTimeMinutes: 15,
      daysAgo: 7,
    },
    {
      score: 70,
      correctCount: 7,
      totalQuestions: 10,
      studyTimeMinutes: 12,
      daysAgo: 3,
    },
    {
      score: 90,
      correctCount: 9,
      totalQuestions: 10,
      studyTimeMinutes: 18,
      daysAgo: 1,
    },
  ];

  for (const sessionData of sessions) {
    const startedAt = new Date();
    startedAt.setDate(startedAt.getDate() - sessionData.daysAgo);
    const finishedAt = new Date(startedAt);
    finishedAt.setMinutes(finishedAt.getMinutes() + sessionData.studyTimeMinutes);

    const session = await prisma.practiceSession.create({
      data: {
        userId,
        mode: "ADAPTIVE",
        startedAt,
        finishedAt,
        score: sessionData.score,
        configJson: {
          examType: questions[0].examType,
          questionCount: sessionData.totalQuestions,
        },
      },
    });

    // Create session items
    for (let i = 0; i < sessionData.totalQuestions; i++) {
      const question = questions[i % questions.length];
      const choices = question.choices;
      const correctChoice = choices.find((c) => c.isCorrect);
      const wrongChoice = choices.find((c) => !c.isCorrect);

      // Determine if this answer is correct based on target correctCount
      const isCorrect = i < sessionData.correctCount;
      const selectedChoice = isCorrect ? correctChoice : wrongChoice;

      await prisma.sessionItem.create({
        data: {
          sessionId: session.id,
          questionId: question.id,
          orderIndex: i,
          userAnswer: selectedChoice?.label || "A",
          isCorrect,
          elapsedMs: Math.floor(Math.random() * 60000) + 30000, // 30s - 90s
        },
      });

      // Add to spaced repetition if wrong
      if (!isCorrect) {
        await prisma.spacedItem.upsert({
          where: {
            userId_questionId: {
              userId,
              questionId: question.id,
            },
          },
          create: {
            userId,
            questionId: question.id,
            repetitions: 0,
            easeFactor: 2.5,
            interval: 1,
            nextReviewAt: new Date(),
          },
          update: {},
        });
      }
    }

    // Create weaknesses based on wrong answers
    const wrongTags = new Set<string>();
    const wrongItems = await prisma.sessionItem.findMany({
      where: {
        sessionId: session.id,
        isCorrect: false,
      },
      include: {
        question: true,
      },
    });

    wrongItems.forEach((item) => {
      item.question.tags.forEach((tag) => wrongTags.add(tag as string));
    });

    // Update weakness scores
    for (const tag of wrongTags) {
      const existingWeakness = await prisma.weakness.findUnique({
        where: {
          userId_tag: {
            userId,
            tag,
          },
        },
      });

      if (existingWeakness) {
        await prisma.weakness.update({
          where: { userId_tag: { userId, tag } },
          data: {
            totalAttempts: { increment: 1 },
            score: Math.max(0, existingWeakness.score - 0.1),
          },
        });
      } else {
        await prisma.weakness.create({
          data: {
            userId,
            tag,
            score: 0.5,
            totalAttempts: 1,
            correctCount: 0,
          },
        });
      }
    }
  }

  // Create one in-progress session
  await prisma.practiceSession.create({
    data: {
      userId,
      mode: "TIMED",
      startedAt: new Date(),
      configJson: {
        examType: questions[0].examType,
        questionCount: 20,
        timeLimit: 30,
      },
      items: {
        create: questions.slice(0, 5).map((q, idx) => ({
          questionId: q.id,
          orderIndex: idx,
        })),
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
