import { PrismaClient, Prisma } from "@prisma/client";
import { createImageElement, createStickerElement, createTextElement } from "../src/lib/template-scene-factory";
import type { Scene, SceneBackground, TextElement } from "../src/types/template";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Story Experience: Story Templates (scene-library based, unrelated to the
// element-canvas Templates feature seeded below).
// ---------------------------------------------------------------------------

function photo(seed: number) {
  return `https://picsum.photos/seed/moment-${seed}/900/1400`;
}

function storyScene(scene: string, variant: string, data: unknown) {
  return { id: crypto.randomUUID(), scene, variant, data };
}

function coverScene(emoji: string) {
  return storyScene("cover", "classic", { emoji });
}

function timelineScene(moments: { photoSeed: number; title: string; caption: string }[]) {
  return storyScene("timeline", "cascade", {
    moments: moments.map((m) => ({
      id: crypto.randomUUID(),
      photoUrl: photo(m.photoSeed),
      title: m.title,
      caption: m.caption,
    })),
  });
}

function polaroidScene(photoSeed: number, caption: string) {
  return storyScene("polaroid", "tape", { photoUrl: photo(photoSeed), caption });
}

function letterScene(message: string) {
  return storyScene("letter", "classic", { message });
}

function journeyScene(from: string, to: string, transportation: "plane" | "car" | "train", photoSeed: number, caption: string) {
  return storyScene("journey", "plane-route", { from, to, transportation, photoUrl: photo(photoSeed), caption });
}

function calendarScene(date: string, title: string, caption: string) {
  return storyScene("calendar", "classic", { date, title, caption });
}

function endingScene(closingMessage: string) {
  return storyScene("ending", "classic", { closingMessage });
}

const STORY_TEMPLATES = [
  {
    name: "Love Story",
    category: "LOVE" as const,
    description: "A tender journey through your favorite memories together.",
    seedScenes: [
      coverScene("❤️"),
      timelineScene([
        { photoSeed: 101, title: "The day we met", caption: "I knew right away." },
        { photoSeed: 102, title: "Our first trip", caption: "Getting lost together, on purpose." },
      ]),
      letterScene("Every moment with you feels like a page from my favorite story. Thank you for choosing me, every day."),
      polaroidScene(103, "Just us."),
      endingScene("With love, always."),
    ],
  },
  {
    name: "Travel Journey",
    category: "TRAVEL" as const,
    description: "Retrace a trip worth remembering, one stop at a time.",
    seedScenes: [
      coverScene("✈️"),
      journeyScene("Home", "Somewhere new", "plane", 201, "Wheels up."),
      calendarScene("2024-06-15", "The best week of the year", "Every trip with you turns into a story worth telling."),
      polaroidScene(202, "Found this view and thought of you."),
      endingScene("Same time next year?"),
    ],
  },
  {
    name: "Birthday",
    category: "BIRTHDAY" as const,
    description: "A joyful celebration of another year of them.",
    seedScenes: [
      coverScene("🎂"),
      timelineScene([
        { photoSeed: 301, title: "Cake time", caption: "Make a wish." },
        { photoSeed: 302, title: "The whole crew", caption: "Everyone came for you." },
      ]),
      polaroidScene(303, "Best birthday yet."),
      endingScene("Wishing you a year as wonderful as you are."),
    ],
  },
  {
    name: "Anniversary",
    category: "ANNIVERSARY" as const,
    description: "Mark another year together with quiet, elegant warmth.",
    seedScenes: [
      coverScene("💕"),
      calendarScene("2020-09-12", "The day we said yes", "Another year of us — and I'd choose it all again."),
      letterScene("Here's to the life we're building, one ordinary beautiful day at a time."),
      polaroidScene(401, "Still my favorite person."),
      endingScene("Here's to forever."),
    ],
  },
  {
    name: "Family Memories",
    category: "FAMILY" as const,
    description: "A warm collection of moments with the people who raised you.",
    seedScenes: [
      coverScene("👨‍👩‍👧"),
      timelineScene([
        { photoSeed: 501, title: "Sunday dinners", caption: "Always room for one more." },
        { photoSeed: 502, title: "Growing up", caption: "Look how far we've come." },
        { photoSeed: 503, title: "Together again", caption: "" },
      ]),
      polaroidScene(504, "Home is wherever you all are."),
      endingScene("Grateful for this family, always."),
    ],
  },
  {
    name: "Graduation",
    category: "GRADUATION" as const,
    description: "Celebrate a milestone earned through years of hard work.",
    seedScenes: [
      coverScene("🎓"),
      calendarScene("2024-05-18", "The big day", "All that hard work, paying off right in front of us."),
      letterScene("So proud of who you've become and everything still ahead of you. This is just the beginning."),
      endingScene("Congratulations — you earned every bit of this."),
    ],
  },
  {
    name: "Thank You",
    category: "THANK_YOU" as const,
    description: "A simple, sincere thank you for someone who deserves one.",
    seedScenes: [
      coverScene("🙏"),
      letterScene("I don't say it enough, so I wanted to put it in writing: thank you, for everything you do."),
      polaroidScene(601, "So grateful for you."),
      endingScene("Thank you, truly."),
    ],
  },
];

function text(overrides: Partial<TextElement>) {
  return createTextElement(overrides);
}

function scene(id: string, background: SceneBackground, elements: Scene["elements"], durationMs = 4000): Scene {
  return { id, background, elements, durationMs };
}

/** Every prebuilt template gets at least one of these — a real placeholder
 *  photo the user taps to replace via the editor's on-canvas Replace overlay,
 *  not just text. Seeded from a distinct range (tpl-7xx) so it can't collide
 *  with the Story Templates' photo seeds above. */
function templatePhoto(seed: number, overrides: { x: number; y: number; width: number; height: number; rotation?: number }) {
  return createImageElement(`https://picsum.photos/seed/moment-tpl-${seed}/900/1400`, overrides);
}

const GRADIENTS = {
  primary: "linear-gradient(135deg, #8CD94A 0%, #B7F36A 100%)",
  love: "linear-gradient(135deg, #FF8A65 0%, #FFB199 100%)",
  birthday: "linear-gradient(135deg, #FFD166 0%, #FFE9A8 100%)",
  dreamy: "linear-gradient(135deg, #B79CED 0%, #D7C8FF 100%)",
};

// ---------------------------------------------------------------------------
// LOVE — 4 styles
// ---------------------------------------------------------------------------

function loveRomanticScenes(): Scene[] {
  return [
    scene("cover", { type: "gradient", value: GRADIENTS.love }, [
      text({ content: "For You", fontFamily: "script", fontSize: 56, color: "#1B1B1F", x: 10, y: 40, width: 80, height: 18 }),
      createStickerElement("💕", { x: 42, y: 62, width: 16, height: 16 }),
    ]),
    scene("middle", { type: "color", value: "#FAF9F6" }, [
      templatePhoto(701, { x: 15, y: 14, width: 70, height: 42 }),
      text({
        content: "Every moment with you feels like a page from my favorite story.",
        fontFamily: "body",
        fontSize: 20,
        color: "#1B1B1F",
        x: 12,
        y: 60,
        width: 76,
        height: 22,
      }),
    ]),
    scene("closing", { type: "gradient", value: GRADIENTS.dreamy }, [
      text({ content: "Forever yours", fontFamily: "script", fontSize: 48, color: "#1B1B1F", x: 10, y: 42, width: 80, height: 16 }),
    ]),
  ];
}

function loveModernScenes(): Scene[] {
  return [
    scene("cover", { type: "color", value: "#FFFFFF" }, [
      templatePhoto(702, { x: 10, y: 8, width: 80, height: 56 }),
      text({ content: "Us.", fontFamily: "body", fontSize: 34, color: "#1B1B1F", x: 15, y: 68, width: 70, height: 14 }),
    ]),
    scene("middle", { type: "color", value: "#FAF9F6" }, [
      createStickerElement("🤍", { x: 44, y: 22, width: 12, height: 12 }),
      text({
        content: "Simple, quiet, and completely yours.",
        fontFamily: "body",
        fontSize: 22,
        color: "#5F6368",
        x: 14,
        y: 44,
        width: 72,
        height: 18,
      }),
    ]),
    scene("closing", { type: "color", value: "#1B1B1F" }, [
      text({ content: "Always.", fontFamily: "body", fontSize: 34, color: "#FFFFFF", x: 20, y: 44, width: 60, height: 14 }),
    ]),
  ];
}

function loveVintageScenes(): Scene[] {
  return [
    scene("cover", { type: "color", value: "#FFE9A8" }, [
      text({ content: "Our Love Story", fontFamily: "display", fontSize: 32, color: "#1B1B1F", x: 10, y: 16, width: 80, height: 16 }),
      templatePhoto(703, { x: 18, y: 36, width: 64, height: 40, rotation: -3 }),
      createStickerElement("💌", { x: 72, y: 32, width: 12, height: 12, rotation: 12 }),
    ]),
    scene("middle", { type: "color", value: "#FAF9F6" }, [
      text({
        content: "Every letter I write to you starts the same way — with your name and my whole heart.",
        fontFamily: "display",
        fontSize: 22,
        color: "#1B1B1F",
        x: 12,
        y: 38,
        width: 76,
        height: 26,
      }),
    ]),
    scene("closing", { type: "color", value: "#FFE9A8" }, [
      text({ content: "Yours, always", fontFamily: "script", fontSize: 42, color: "#1B1B1F", x: 12, y: 44, width: 76, height: 16 }),
    ]),
  ];
}

function lovePlayfulScenes(): Scene[] {
  return [
    scene("cover", { type: "gradient", value: GRADIENTS.love }, [
      createStickerElement("💕", { x: 20, y: 18, width: 14, height: 14, rotation: -8 }),
      createStickerElement("🎀", { x: 66, y: 16, width: 14, height: 14, rotation: 10 }),
      text({ content: "You + Me", fontFamily: "script", fontSize: 50, color: "#FFFFFF", x: 10, y: 44, width: 80, height: 18 }),
    ]),
    scene("middle", { type: "color", value: "#FFF4F0" }, [
      templatePhoto(704, { x: 18, y: 14, width: 64, height: 38, rotation: 3 }),
      createStickerElement("💐", { x: 14, y: 56, width: 12, height: 12, rotation: -10 }),
      text({
        content: "Every day with you is my favorite.",
        fontFamily: "body",
        fontSize: 20,
        color: "#1B1B1F",
        x: 14,
        y: 64,
        width: 72,
        height: 16,
      }),
    ]),
    scene("closing", { type: "gradient", value: GRADIENTS.dreamy }, [
      text({ content: "xoxo", fontFamily: "script", fontSize: 54, color: "#FFFFFF", x: 15, y: 44, width: 70, height: 16 }),
    ]),
  ];
}

// ---------------------------------------------------------------------------
// BIRTHDAY — 4 styles
// ---------------------------------------------------------------------------

function birthdayConfettiScenes(): Scene[] {
  return [
    scene("cover", { type: "gradient", value: GRADIENTS.birthday }, [
      createStickerElement("🎂", { x: 40, y: 26, width: 20, height: 20 }),
      text({ content: "Happy Birthday!", fontFamily: "display", fontSize: 34, color: "#1B1B1F", x: 8, y: 52, width: 84, height: 16 }),
    ]),
    scene("middle", { type: "color", value: "#FAF9F6" }, [
      templatePhoto(705, { x: 16, y: 12, width: 68, height: 40 }),
      createStickerElement("🎈", { x: 18, y: 58, width: 12, height: 12, rotation: -8 }),
      text({
        content: "Wishing you a day as wonderful as you are.",
        fontFamily: "body",
        fontSize: 18,
        color: "#1B1B1F",
        x: 12,
        y: 66,
        width: 76,
        height: 16,
      }),
      createStickerElement("🎉", { x: 68, y: 58, width: 12, height: 12, rotation: 10 }),
    ]),
    scene("closing", { type: "gradient", value: GRADIENTS.birthday }, [
      text({ content: "Cheers to you!", fontFamily: "script", fontSize: 46, color: "#1B1B1F", x: 10, y: 42, width: 80, height: 16 }),
    ]),
  ];
}

function birthdayPhotoScenes(): Scene[] {
  return [
    scene("cover", { type: "color", value: "#FFFFFF" }, [
      templatePhoto(706, { x: 10, y: 10, width: 80, height: 54 }),
      text({ content: "Happy Birthday", fontFamily: "body", fontSize: 30, color: "#1B1B1F", x: 12, y: 68, width: 76, height: 14 }),
    ]),
    scene("middle", { type: "color", value: "#FFE9A8" }, [
      createStickerElement("🎂", { x: 42, y: 20, width: 16, height: 16 }),
      text({
        content: "Another year, another reason to celebrate you.",
        fontFamily: "body",
        fontSize: 20,
        color: "#1B1B1F",
        x: 13,
        y: 44,
        width: 74,
        height: 20,
      }),
    ]),
    scene("closing", { type: "color", value: "#1B1B1F" }, [
      text({ content: "Party on!", fontFamily: "display", fontSize: 34, color: "#FFE9A8", x: 16, y: 44, width: 68, height: 14 }),
    ]),
  ];
}

function birthdayElegantScenes(): Scene[] {
  return [
    scene("cover", { type: "color", value: "#1B1B1F" }, [
      text({ content: "Happy Birthday", fontFamily: "display", fontSize: 32, color: "#E3A400", x: 10, y: 42, width: 80, height: 16 }),
      createStickerElement("🥂", { x: 42, y: 62, width: 14, height: 14 }),
    ]),
    scene("middle", { type: "color", value: "#FAF9F6" }, [
      templatePhoto(707, { x: 15, y: 16, width: 70, height: 42 }),
      text({
        content: "Here's to another year of your brilliance.",
        fontFamily: "display",
        fontSize: 20,
        color: "#1B1B1F",
        x: 13,
        y: 62,
        width: 74,
        height: 18,
      }),
    ]),
    scene("closing", { type: "color", value: "#1B1B1F" }, [
      text({ content: "Cheers, always.", fontFamily: "display", fontSize: 30, color: "#E3A400", x: 14, y: 44, width: 72, height: 14 }),
    ]),
  ];
}

function birthdayKidsScenes(): Scene[] {
  return [
    scene("cover", { type: "gradient", value: GRADIENTS.birthday }, [
      createStickerElement("🎈", { x: 16, y: 18, width: 14, height: 14, rotation: -10 }),
      createStickerElement("🎈", { x: 68, y: 16, width: 14, height: 14, rotation: 8 }),
      text({ content: "It's My Birthday!", fontFamily: "script", fontSize: 38, color: "#1B1B1F", x: 10, y: 46, width: 80, height: 16 }),
    ]),
    scene("middle", { type: "color", value: "#D6EFFF" }, [
      templatePhoto(708, { x: 16, y: 12, width: 68, height: 38 }),
      createStickerElement("🍰", { x: 18, y: 56, width: 12, height: 12 }),
      createStickerElement("🎉", { x: 68, y: 56, width: 12, height: 12, rotation: -8 }),
      text({
        content: "Cake, confetti, and all my favorite people.",
        fontFamily: "body",
        fontSize: 18,
        color: "#1B1B1F",
        x: 12,
        y: 66,
        width: 76,
        height: 16,
      }),
    ]),
    scene("closing", { type: "gradient", value: GRADIENTS.birthday }, [
      text({ content: "Yay for me!", fontFamily: "script", fontSize: 40, color: "#1B1B1F", x: 12, y: 44, width: 76, height: 16 }),
    ]),
  ];
}

// ---------------------------------------------------------------------------
// ANNIVERSARY — 4 styles
// ---------------------------------------------------------------------------

function anniversaryDreamyScenes(): Scene[] {
  return [
    scene("cover", { type: "gradient", value: GRADIENTS.dreamy }, [
      text({ content: "Happy Anniversary", fontFamily: "display", fontSize: 30, color: "#1B1B1F", x: 8, y: 42, width: 84, height: 18 }),
    ]),
    scene("middle", { type: "color", value: "#FFFFFF" }, [
      createStickerElement("🥂", { x: 42, y: 14, width: 16, height: 16 }),
      templatePhoto(709, { x: 15, y: 26, width: 70, height: 38 }),
      text({
        content: "Another year of us — and I'd choose it all again.",
        fontFamily: "body",
        fontSize: 18,
        color: "#1B1B1F",
        x: 12,
        y: 68,
        width: 76,
        height: 16,
      }),
    ]),
    scene("closing", { type: "color", value: "#FAF9F6" }, [
      text({ content: "Here's to forever", fontFamily: "script", fontSize: 44, color: "#5EAD27", x: 10, y: 42, width: 80, height: 16 }),
    ]),
  ];
}

function anniversaryGoldenScenes(): Scene[] {
  return [
    scene("cover", { type: "color", value: "#1B1B1F" }, [
      text({ content: "Golden Years", fontFamily: "display", fontSize: 32, color: "#E3A400", x: 10, y: 42, width: 80, height: 16 }),
    ]),
    scene("middle", { type: "color", value: "#FAF9F6" }, [
      templatePhoto(710, { x: 15, y: 14, width: 70, height: 42 }),
      createStickerElement("🥂", { x: 44, y: 60, width: 14, height: 14 }),
      text({
        content: "Still choosing you, every single year.",
        fontFamily: "display",
        fontSize: 20,
        color: "#1B1B1F",
        x: 14,
        y: 68,
        width: 72,
        height: 16,
      }),
    ]),
    scene("closing", { type: "color", value: "#1B1B1F" }, [
      text({ content: "To forever", fontFamily: "display", fontSize: 32, color: "#E3A400", x: 14, y: 44, width: 72, height: 14 }),
    ]),
  ];
}

function anniversaryRusticScenes(): Scene[] {
  return [
    scene("cover", { type: "color", value: "#FFE9A8" }, [
      templatePhoto(711, { x: 16, y: 16, width: 68, height: 44, rotation: -2 }),
      text({ content: "Us, always", fontFamily: "script", fontSize: 36, color: "#1B1B1F", x: 14, y: 66, width: 72, height: 14 }),
    ]),
    scene("middle", { type: "color", value: "#FAF9F6" }, [
      text({
        content: "Here's to the life we're building, one ordinary beautiful day at a time.",
        fontFamily: "display",
        fontSize: 20,
        color: "#1B1B1F",
        x: 12,
        y: 40,
        width: 76,
        height: 24,
      }),
    ]),
    scene("closing", { type: "color", value: "#FFE9A8" }, [
      text({ content: "Here's to us", fontFamily: "script", fontSize: 40, color: "#1B1B1F", x: 12, y: 44, width: 76, height: 16 }),
    ]),
  ];
}

function anniversaryModernScenes(): Scene[] {
  return [
    scene("cover", { type: "color", value: "#FFFFFF" }, [
      text({ content: "Anniversary", fontFamily: "body", fontSize: 30, color: "#1B1B1F", x: 15, y: 44, width: 70, height: 14 }),
    ]),
    scene("middle", { type: "color", value: "#DDF7C8" }, [
      templatePhoto(712, { x: 15, y: 16, width: 70, height: 42 }),
      text({ content: "Simply, still you.", fontFamily: "body", fontSize: 20, color: "#1B1B1F", x: 18, y: 64, width: 64, height: 14 }),
    ]),
    scene("closing", { type: "color", value: "#FFFFFF" }, [
      text({ content: "Forever.", fontFamily: "body", fontSize: 32, color: "#1B1B1F", x: 20, y: 44, width: 60, height: 14 }),
    ]),
  ];
}

// ---------------------------------------------------------------------------
// MINIMAL — 4 styles
// ---------------------------------------------------------------------------

function minimalQuietScenes(): Scene[] {
  return [
    scene("cover", { type: "color", value: "#FFFFFF" }, [
      text({ content: "A little something", fontFamily: "display", fontSize: 30, color: "#1B1B1F", x: 10, y: 44, width: 80, height: 14 }),
    ]),
    scene("middle", { type: "color", value: "#FAF9F6" }, [
      templatePhoto(713, { x: 20, y: 16, width: 60, height: 38 }),
      text({
        content: "Simple words, meant sincerely.",
        fontFamily: "body",
        fontSize: 18,
        color: "#5F6368",
        x: 15,
        y: 60,
        width: 70,
        height: 14,
      }),
    ]),
    scene("closing", { type: "color", value: "#FFFFFF" }, [
      text({ content: "Always.", fontFamily: "script", fontSize: 40, color: "#1B1B1F", x: 15, y: 44, width: 70, height: 14 }),
    ]),
  ];
}

function minimalMonochromeScenes(): Scene[] {
  return [
    scene("cover", { type: "color", value: "#1B1B1F" }, [
      text({ content: "For You", fontFamily: "body", fontSize: 34, color: "#FFFFFF", x: 15, y: 44, width: 70, height: 14 }),
    ]),
    scene("middle", { type: "color", value: "#FFFFFF" }, [
      templatePhoto(714, { x: 15, y: 14, width: 70, height: 44 }),
      text({
        content: "No decorations needed. Just this.",
        fontFamily: "body",
        fontSize: 18,
        color: "#1B1B1F",
        x: 15,
        y: 62,
        width: 70,
        height: 14,
      }),
    ]),
    scene("closing", { type: "color", value: "#1B1B1F" }, [
      text({ content: "That's it.", fontFamily: "body", fontSize: 30, color: "#FFFFFF", x: 18, y: 44, width: 64, height: 14 }),
    ]),
  ];
}

function minimalSageScenes(): Scene[] {
  return [
    scene("cover", { type: "color", value: "#DDF7C8" }, [
      text({ content: "A quiet note", fontFamily: "body", fontSize: 28, color: "#1B1B1F", x: 15, y: 44, width: 70, height: 14 }),
    ]),
    scene("middle", { type: "color", value: "#FAF9F6" }, [
      templatePhoto(715, { x: 18, y: 16, width: 64, height: 40 }),
      text({
        content: "Just a small thing, made for you.",
        fontFamily: "body",
        fontSize: 18,
        color: "#5F6368",
        x: 16,
        y: 60,
        width: 68,
        height: 14,
      }),
    ]),
    scene("closing", { type: "color", value: "#DDF7C8" }, [
      text({ content: "Take care.", fontFamily: "body", fontSize: 28, color: "#1B1B1F", x: 18, y: 44, width: 64, height: 14 }),
    ]),
  ];
}

function minimalEditorialScenes(): Scene[] {
  return [
    scene("cover", { type: "color", value: "#FFFFFF" }, [templatePhoto(716, { x: 10, y: 8, width: 80, height: 60 })]),
    scene("middle", { type: "color", value: "#FFFFFF" }, [
      text({
        content: "A moment worth keeping.",
        fontFamily: "body",
        fontSize: 22,
        color: "#1B1B1F",
        x: 15,
        y: 46,
        width: 70,
        height: 16,
      }),
    ]),
    scene("closing", { type: "color", value: "#FFFFFF" }, [
      text({ content: "— fin", fontFamily: "display", fontSize: 26, color: "#5F6368", x: 30, y: 44, width: 40, height: 14 }),
    ]),
  ];
}

// ---------------------------------------------------------------------------
// SCRAPBOOK — 4 styles
// ---------------------------------------------------------------------------

function scrapbookHandmadeScenes(): Scene[] {
  return [
    scene("cover", { type: "color", value: "#FFE9A8" }, [
      createStickerElement("📸", { x: 40, y: 24, width: 18, height: 18, rotation: -6 }),
      text({ content: "Our Story", fontFamily: "script", fontSize: 50, color: "#1B1B1F", x: 10, y: 50, width: 80, height: 16, rotation: -2 }),
    ]),
    scene("middle", { type: "color", value: "#FAF9F6" }, [
      templatePhoto(717, { x: 16, y: 12, width: 64, height: 38, rotation: -3 }),
      createStickerElement("🧸", { x: 66, y: 56, width: 14, height: 14, rotation: 8 }),
      text({
        content: "A little scrapbook of moments, made just for you.",
        fontFamily: "body",
        fontSize: 18,
        color: "#1B1B1F",
        x: 12,
        y: 56,
        width: 70,
        height: 20,
        rotation: 1,
      }),
    ]),
    scene("closing", { type: "color", value: "#FFB199" }, [
      text({ content: "To be continued…", fontFamily: "script", fontSize: 40, color: "#1B1B1F", x: 10, y: 44, width: 80, height: 14 }),
    ]),
  ];
}

function scrapbookPolaroidScenes(): Scene[] {
  return [
    scene("cover", { type: "color", value: "#FAF9F6" }, [
      templatePhoto(718, { x: 20, y: 14, width: 56, height: 34, rotation: -4 }),
      createStickerElement("✨", { x: 70, y: 16, width: 12, height: 12 }),
      text({ content: "Memories", fontFamily: "script", fontSize: 36, color: "#1B1B1F", x: 15, y: 58, width: 70, height: 14 }),
    ]),
    scene("middle", { type: "color", value: "#FFFFFF" }, [
      templatePhoto(719, { x: 14, y: 10, width: 38, height: 30, rotation: -6 }),
      templatePhoto(720, { x: 48, y: 14, width: 38, height: 30, rotation: 5 }),
      text({ content: "Two of my favorites.", fontFamily: "body", fontSize: 18, color: "#1B1B1F", x: 16, y: 56, width: 68, height: 14 }),
    ]),
    scene("closing", { type: "color", value: "#FAF9F6" }, [
      text({ content: "More to come.", fontFamily: "script", fontSize: 34, color: "#1B1B1F", x: 14, y: 44, width: 72, height: 14 }),
    ]),
  ];
}

function scrapbookWashiScenes(): Scene[] {
  return [
    scene("cover", { type: "color", value: "#FFE1EE" }, [
      createStickerElement("🎀", { x: 18, y: 18, width: 12, height: 12, rotation: -10 }),
      createStickerElement("💌", { x: 66, y: 16, width: 12, height: 12, rotation: 10 }),
      text({ content: "For You", fontFamily: "script", fontSize: 44, color: "#1B1B1F", x: 14, y: 46, width: 72, height: 16 }),
    ]),
    scene("middle", { type: "color", value: "#FAF9F6" }, [
      templatePhoto(721, { x: 18, y: 14, width: 64, height: 38, rotation: 2 }),
      createStickerElement("✨", { x: 18, y: 56, width: 10, height: 10 }),
      text({
        content: "Little notes, big feelings.",
        fontFamily: "body",
        fontSize: 18,
        color: "#1B1B1F",
        x: 16,
        y: 64,
        width: 68,
        height: 14,
      }),
    ]),
    scene("closing", { type: "color", value: "#FFE1EE" }, [
      text({ content: "xo", fontFamily: "script", fontSize: 50, color: "#1B1B1F", x: 40, y: 44, width: 20, height: 16 }),
    ]),
  ];
}

function scrapbookWanderlustScenes(): Scene[] {
  return [
    scene("cover", { type: "color", value: "#D6EFFF" }, [
      templatePhoto(722, { x: 14, y: 12, width: 72, height: 42, rotation: -2 }),
      createStickerElement("📷", { x: 70, y: 16, width: 12, height: 12, rotation: 8 }),
      text({ content: "Wanderlust", fontFamily: "display", fontSize: 32, color: "#1B1B1F", x: 14, y: 60, width: 72, height: 14 }),
    ]),
    scene("middle", { type: "color", value: "#FAF9F6" }, [
      text({
        content: "Every trip with you turns into a story worth telling.",
        fontFamily: "body",
        fontSize: 20,
        color: "#1B1B1F",
        x: 12,
        y: 40,
        width: 76,
        height: 22,
      }),
      createStickerElement("⭐️", { x: 20, y: 66, width: 10, height: 10 }),
      createStickerElement("🌙", { x: 64, y: 66, width: 10, height: 10 }),
    ]),
    scene("closing", { type: "color", value: "#D6EFFF" }, [
      text({ content: "Until next time", fontFamily: "script", fontSize: 36, color: "#1B1B1F", x: 12, y: 44, width: 76, height: 16 }),
    ]),
  ];
}

const TEMPLATES = [
  // Love
  { name: "Romantic Hearts", category: "LOVE" as const, description: "A tender design for the person who has your heart.", seedScenes: loveRomanticScenes() },
  { name: "Modern Love", category: "LOVE" as const, description: "Clean, photo-forward, and quietly confident.", seedScenes: loveModernScenes() },
  { name: "Vintage Love Letter", category: "LOVE" as const, description: "Warm, handwritten-feel romance with a keepsake photo.", seedScenes: loveVintageScenes() },
  { name: "Playful Hearts", category: "LOVE" as const, description: "Bright, fun, and full of stickers.", seedScenes: lovePlayfulScenes() },
  // Birthday
  { name: "Confetti Birthday", category: "BIRTHDAY" as const, description: "A joyful, celebratory birthday design.", seedScenes: birthdayConfettiScenes() },
  { name: "Photo Birthday", category: "BIRTHDAY" as const, description: "Let the party photo do the talking.", seedScenes: birthdayPhotoScenes() },
  { name: "Elegant Birthday", category: "BIRTHDAY" as const, description: "A refined black-and-gold celebration.", seedScenes: birthdayElegantScenes() },
  { name: "Kids Birthday", category: "BIRTHDAY" as const, description: "Bright, playful, and full of balloons.", seedScenes: birthdayKidsScenes() },
  // Anniversary
  { name: "Dreamy Anniversary", category: "ANNIVERSARY" as const, description: "An elegant design to mark another year together.", seedScenes: anniversaryDreamyScenes() },
  { name: "Golden Years", category: "ANNIVERSARY" as const, description: "Rich, elegant, black-and-gold romance.", seedScenes: anniversaryGoldenScenes() },
  { name: "Rustic Anniversary", category: "ANNIVERSARY" as const, description: "Warm and homespun, built around one favorite photo.", seedScenes: anniversaryRusticScenes() },
  { name: "Modern Minimal Anniversary", category: "ANNIVERSARY" as const, description: "Clean and understated, sage and white.", seedScenes: anniversaryModernScenes() },
  // Minimal
  { name: "Quiet Simplicity", category: "MINIMAL" as const, description: "Clean, quiet, and understated.", seedScenes: minimalQuietScenes() },
  { name: "Monochrome", category: "MINIMAL" as const, description: "Bold black and white, no distractions.", seedScenes: minimalMonochromeScenes() },
  { name: "Soft Sage", category: "MINIMAL" as const, description: "A gentle, pastel-green note.", seedScenes: minimalSageScenes() },
  { name: "Editorial Minimal", category: "MINIMAL" as const, description: "One striking photo, one quiet line of text.", seedScenes: minimalEditorialScenes() },
  // Scrapbook
  { name: "Handmade Scrapbook", category: "SCRAPBOOK" as const, description: "A cozy, handmade, personal feel.", seedScenes: scrapbookHandmadeScenes() },
  { name: "Polaroid Memories", category: "SCRAPBOOK" as const, description: "Two favorite polaroids, side by side.", seedScenes: scrapbookPolaroidScenes() },
  { name: "Washi & Notes", category: "SCRAPBOOK" as const, description: "Cute, pastel, and full of little notes.", seedScenes: scrapbookWashiScenes() },
  { name: "Wanderlust", category: "SCRAPBOOK" as const, description: "A sky-blue scrapbook for shared adventures.", seedScenes: scrapbookWanderlustScenes() },
];

async function main() {
  await prisma.template.deleteMany({});
  for (const t of TEMPLATES) {
    await prisma.template.create({
      data: {
        name: t.name,
        category: t.category,
        description: t.description,
        seedScenes: t.seedScenes,
      },
    });
  }
  console.log(`Seeded ${TEMPLATES.length} templates.`);

  await prisma.storyTemplate.deleteMany({});
  for (const t of STORY_TEMPLATES) {
    await prisma.storyTemplate.create({
      data: {
        name: t.name,
        category: t.category,
        description: t.description,
        seedScenes: t.seedScenes as Prisma.InputJsonValue,
      },
    });
  }
  console.log(`Seeded ${STORY_TEMPLATES.length} story templates.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
