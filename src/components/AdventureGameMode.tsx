import React, { useState } from "react";
import { 
  Compass, Shield, Trophy, Sparkles, Coins, Gem, ArrowLeft, Check, 
  ChevronRight, Lock, Swords, RefreshCw, AlertCircle, Play, Heart, Star, Award, Sparkle
} from "lucide-react";
import { Student } from "../types";
import { motion, AnimatePresence } from "motion/react";

// Extend Student for our Adventure State
export interface AdventureStudent extends Student {
  gems?: number;
  unlockedWorlds?: string[];
  currentWorld?: string;
  character?: {
    name: string;
    outfit: string;
    headwear: string;
    accessory: string;
    themeColor: string;
  };
  inventory?: string[];
  adventureLevelIndex?: number;
  completedAdventureLevels?: string[];
}

interface AdventureGameModeProps {
  student: AdventureStudent;
  onBack: () => void;
  onUpdateStudent: (updated: Student) => void;
}

// Fantasy game assets for cosmetic customization
const SHOP_ITEMS = [
  { id: "wizard_staff", type: "accessory", name: "Staff of Phonics", cost: 40, icon: "🔮", desc: "Channels powerful letters and vowels." },
  { id: "spyglass", type: "accessory", name: "Riddle Spyglass", cost: 60, icon: "🔍", desc: "Reveals secrets hidden in passages." },
  { id: "light_saber", type: "accessory", name: "Saber of Logic", cost: 150, icon: "⚡", desc: "Laser-focused numeracy calculations." },
  
  { id: "wizard_hat", type: "headwear", name: "Wizard Hood", cost: 50, icon: "🧙", desc: "Increases critical thinking capacity." },
  { id: "space_helmet", type: "headwear", name: "Astro Helmet", cost: 100, icon: "🧑‍🚀", desc: "Allows breathing in zero-vocabulary vacuums." },
  { id: "crown", type: "headwear", name: "Crown of Mastery", cost: 250, icon: "👑", desc: "The ultimate symbol of academic mastery." },
  
  { id: "explorer_tunic", type: "outfit", name: "Explorer Robes", cost: 30, icon: "⛺", desc: "Comfortable and durable for long-reading quests." },
  { id: "superhero_cape", type: "outfit", name: "Cape of Knowledge", cost: 120, icon: "🦸", desc: "Flutters majestically when spelling words." },
  { id: "mech_armor", type: "outfit", name: "Cyber Exo-Armor", cost: 200, icon: "🤖", desc: "High-tech defense against math trolls." }
];

// Definition of an individual adventure level
export interface AdventureLevel {
  id: string;
  levelNumber: number;
  chapter: string;
  chapterName: string;
  name: string;
  icon: string;
  bg: string;
  storyIntro: string;
  objective: string;
  enemyName?: string;
  enemyEmoji?: string;
  type: "spell" | "math" | "logic" | "comprehension" | "boss";
  difficulty: "Beginner" | "Easy" | "Medium" | "Hard" | "Epic";
  rewardCoins: number;
  rewardXP: number;
  rewardGems: number;
  
  // Riddle configuration
  prompt?: string;
  answer?: string;
  
  // Multiple Choice configuration
  question?: string;
  options?: string[];
  correctIdx?: number;
  
  clue: string;
}

// Complete 12 Progressive Levels split into 3 Chapters
const ADVENTURE_LEVELS: AdventureLevel[] = [
  {
    id: "level_1",
    levelNumber: 1,
    chapter: "chapter_1",
    chapterName: "Chapter 1: Phonics Forest",
    name: "The Talking Scroll",
    icon: "📜",
    bg: "from-emerald-500 to-teal-700",
    storyIntro: "Deep in the Phonics Forest, a rustling gold scroll is caught in thorn vines. It whispers a jumbled spelling of the most powerful word in the kingdom!",
    objective: "Unscramble the letters to activate your explorer spellbook.",
    enemyName: "Forest Sprite",
    enemyEmoji: "🧚",
    type: "spell",
    difficulty: "Beginner",
    rewardCoins: 25,
    rewardXP: 50,
    rewardGems: 2,
    prompt: "Type the unscrambled word from letters: L-A-R-E-N",
    answer: "learn",
    clue: "Opposite of teaching, and what you do every day on LearnLift!"
  },
  {
    id: "level_2",
    levelNumber: 2,
    chapter: "chapter_1",
    chapterName: "Chapter 1: Phonics Forest",
    name: "Fairy Gate Decryption",
    icon: "🧚‍♀️",
    bg: "from-emerald-500 to-teal-700",
    storyIntro: "A shimmering gatekeeper blocks the paths. She only eats sugary things, and needs you to point out the sweet vocabulary word on the sign.",
    objective: "Help her identify the sweet treat by finding the sweet synonym.",
    enemyName: "Gatekeeper Pixie",
    enemyEmoji: "✨",
    type: "comprehension",
    difficulty: "Easy",
    rewardCoins: 25,
    rewardXP: 50,
    rewardGems: 2,
    question: "The fairy's code states: 'I love berries that are SWEET, but hate ones that are BITTER.' Which berries does she eat?",
    options: ["Sugary strawberries", "Sour cranberries", "Salty nuts", "Tough oak leaves"],
    correctIdx: 0,
    clue: "Sugary is a synonym for sweet!"
  },
  {
    id: "level_3",
    levelNumber: 3,
    chapter: "chapter_1",
    chapterName: "Chapter 1: Phonics Forest",
    name: "Whispering Goblet",
    icon: "🍃",
    bg: "from-emerald-500 to-teal-700",
    storyIntro: "A cheeky goblin named Whisper holds your map! He will hand it back if you solve his basic phonetic spelling riddle.",
    objective: "Spell the three-letter word to retrieve your explorer map.",
    enemyName: "Whisper the Goblin",
    enemyEmoji: "👺",
    type: "spell",
    difficulty: "Easy",
    rewardCoins: 30,
    rewardXP: 60,
    rewardGems: 2,
    prompt: "Whisper sings: 'I have three letters. I start with C, end with T, and make a meow sound.' What am I?",
    answer: "cat",
    clue: "A furry companion who chases mice and loves milk!"
  },
  {
    id: "level_4",
    levelNumber: 4,
    chapter: "chapter_1",
    chapterName: "Chapter 1: Phonics Forest",
    name: "BOSS: The Rune Golem",
    icon: "🗿",
    bg: "from-emerald-500 to-teal-700",
    storyIntro: "A massive rock monster blockades the mountain entrance. Letters are glowing on its obsidian chest. You must combine the spell elements to break its rune lock!",
    objective: "Decrypt the compound word code to deactivate the Golem.",
    enemyName: "Rune Golem",
    enemyEmoji: "🗿",
    type: "boss",
    difficulty: "Medium",
    rewardCoins: 60,
    rewardXP: 100,
    rewardGems: 5,
    prompt: "Combine the word elements 'RAIN' and 'BOW' into one compound word:",
    answer: "rainbow",
    clue: "A colorful arch of light that appears in the sky after it rains."
  },
  {
    id: "level_5",
    levelNumber: 5,
    chapter: "chapter_2",
    chapterName: "Chapter 2: Math Mountain",
    name: "Unbalance the Scale",
    icon: "⚖️",
    bg: "from-sky-500 to-indigo-700",
    storyIntro: "You reach the snowy base of Math Mountain. A frozen iron gate is locked by an un-balanced scale glyph.",
    objective: "Solve the missing math balance to unlock the gate.",
    enemyName: "Ice Slime",
    enemyEmoji: "🌀",
    type: "math",
    difficulty: "Medium",
    rewardCoins: 35,
    rewardXP: 70,
    rewardGems: 3,
    prompt: "Fill in the blank value: 14 + ? = 32",
    answer: "18",
    clue: "Try subtracting 14 from 32 to get the difference!"
  },
  {
    id: "level_6",
    levelNumber: 6,
    chapter: "chapter_2",
    chapterName: "Chapter 2: Math Mountain",
    name: "Pattern of the Glyphs",
    icon: "🔮",
    bg: "from-sky-500 to-indigo-700",
    storyIntro: "Blinking ice crystals on the cave walls glow in a mathematical pattern. An ice bridge will only manifest if you predict the next number.",
    objective: "Calculate the sequence rule and input the next correct number.",
    enemyName: "Cave Bat",
    enemyEmoji: "🦇",
    type: "logic",
    difficulty: "Medium",
    rewardCoins: 35,
    rewardXP: 70,
    rewardGems: 3,
    prompt: "Input the next number in this doubling sequence: 3, 6, 12, 24, ?",
    answer: "48",
    clue: "Each number in the series is twice (multiplied by 2) the previous number!"
  },
  {
    id: "level_7",
    levelNumber: 7,
    chapter: "chapter_2",
    chapterName: "Chapter 2: Math Mountain",
    name: "The Rope Bridge Yeti",
    icon: "🌉",
    bg: "from-sky-500 to-indigo-700",
    storyIntro: "A friendly, furry Yeti sits on the high rope bridge. He will let you cross safely if you teach him a rule about numbers.",
    objective: "Help the Yeti understand multiplying numbers.",
    enemyName: "Snowy Yeti",
    enemyEmoji: "🧌",
    type: "comprehension",
    difficulty: "Medium",
    rewardCoins: 40,
    rewardXP: 80,
    rewardGems: 3,
    question: "If you multiply any even number (2, 4, 6, 8) by 5, the last digit of the answer is always:",
    options: ["Zero (0)", "Five (5)", "Three (3)", "Nine (9)"],
    correctIdx: 0,
    clue: "Think of simple examples: 2 x 5 = 10, 4 x 5 = 20, 6 x 5 = 30. What number is at the end?"
  },
  {
    id: "level_8",
    levelNumber: 8,
    chapter: "chapter_2",
    chapterName: "Chapter 2: Math Mountain",
    name: "BOSS: The Frost Giant",
    icon: "❄️",
    bg: "from-sky-500 to-indigo-700",
    storyIntro: "A cold blizzard sweeps the peak as Blizzard-Jaw, the Frost Giant King, steps forth throwing numerical snowballs! You must answer his rapid calculation to deflect them.",
    objective: "Do the arithmetic to cast your fire counter-spell.",
    enemyName: "Blizzard-Jaw",
    enemyEmoji: "👹",
    type: "boss",
    difficulty: "Epic",
    rewardCoins: 75,
    rewardXP: 120,
    rewardGems: 6,
    prompt: "Solve: (8 x 5) - 15",
    answer: "25",
    clue: "First do 8 times 5, then subtract 15 from that result!"
  },
  {
    id: "level_9",
    levelNumber: 9,
    chapter: "chapter_3",
    chapterName: "Chapter 3: Vocabulary Valley",
    name: "The Synonym Stone",
    icon: "🪨",
    bg: "from-amber-500 to-orange-700",
    storyIntro: "You reach the sunny sand dunes of Vocabulary Valley. A glowing sandstone tablet blocks the oasis path.",
    objective: "Unscramble the ancient letters to describe something massive.",
    enemyName: "Cactus Golem",
    enemyEmoji: "🌵",
    type: "spell",
    difficulty: "Hard",
    rewardCoins: 50,
    rewardXP: 90,
    rewardGems: 4,
    prompt: "Unscramble a synonym for 'VERY LARGE': I-M-M-S-E-E-N",
    answer: "immense",
    clue: "Starts with I, has a double M, ends with E, and means extremely big!"
  },
  {
    id: "level_10",
    levelNumber: 10,
    chapter: "chapter_3",
    chapterName: "Chapter 3: Vocabulary Valley",
    name: "The Pyramid Sentinel",
    icon: "🦁",
    bg: "from-amber-500 to-orange-700",
    storyIntro: "At the gate of the Valley Pyramid, a stone Sphinx statue awakes. She asks you a reading-comprehension context question.",
    objective: "Select the correct meaning of the word based on the provided hint.",
    enemyName: "Valley Sphinx",
    enemyEmoji: "🦁",
    type: "comprehension",
    difficulty: "Hard",
    rewardCoins: 50,
    rewardXP: 90,
    rewardGems: 4,
    question: "The sentinel's scroll says: 'A diligent student studies daily. A lazy student sleeps.' What does 'diligent' mean?",
    options: ["Silly and playful", "Hardworking and attentive", "Sleepy and tired", "Angry and frustrated"],
    correctIdx: 1,
    clue: "The text contrasts 'lazy' with 'diligent' (someone who works hard daily)."
  },
  {
    id: "level_11",
    levelNumber: 11,
    chapter: "chapter_3",
    chapterName: "Chapter 3: Vocabulary Valley",
    name: "Oasis of Antonyms",
    icon: "🌴",
    bg: "from-amber-500 to-orange-700",
    storyIntro: "To fill your canteen at the shimmering oasis pool, you must answer the guardian nymph's cold antonym puzzle.",
    objective: "Spell the opposite word of warm to soothe the hot desert wind.",
    enemyName: "Oasis Nymph",
    enemyEmoji: "🧜‍♀️",
    type: "spell",
    difficulty: "Hard",
    rewardCoins: 55,
    rewardXP: 100,
    rewardGems: 4,
    prompt: "Unscramble the antonym (opposite) of 'WARM': I-H-C-L-L-Y",
    answer: "chilly",
    clue: "Starts with C, ends with Y, and describes cold weather!"
  },
  {
    id: "level_12",
    levelNumber: 12,
    chapter: "chapter_3",
    chapterName: "Chapter 3: Vocabulary Valley",
    name: "BOSS: The Desert Emperor",
    icon: "🔱",
    bg: "from-amber-500 to-orange-700",
    storyIntro: "The ultimate challenge! The golden Sphinx Lord challenges you to the supreme test of vocabulary comprehension to claim the golden crown of LearnLift!",
    objective: "Answer the champion question to seal your victory.",
    enemyName: "Sphinx Emperor",
    enemyEmoji: "👑",
    type: "boss",
    difficulty: "Epic",
    rewardCoins: 120,
    rewardXP: 200,
    rewardGems: 10,
    question: "Which of these words best describes a person who is 'full of courage, heroic, and never afraid of danger'?",
    options: ["Cautious and careful", "Valiant and heroic", "Timid and shy", "Anxious and scared"],
    correctIdx: 1,
    clue: "Think of heroic knights; a word starting with V that means extremely brave."
  }
];

export default function AdventureGameMode({ student, onBack, onUpdateStudent }: AdventureGameModeProps) {
  // Read and safely initialize progressive states
  const currentGems = student.gems ?? 10;
  const currentCharacter = student.character ?? {
    name: student.name.split(" ")[0],
    outfit: "explorer_tunic",
    headwear: "wizard_hat",
    accessory: "wizard_staff",
    themeColor: "Sapphire Blue"
  };
  const currentInventory = student.inventory ?? ["explorer_tunic", "wizard_hat", "wizard_staff"];
  
  // Track progressive level variables in student profile
  const completedLevels = student.completedAdventureLevels ?? [];
  const activeLevelNumber = student.adventureLevelIndex ?? 1; // 1-indexed, starting at Level 1

  // Navigation tab
  const [activeTab, setActiveTab] = useState<"map" | "character" | "bosses">("map");
  
  // Custom Character Creator states
  const [charName, setCharName] = useState(currentCharacter.name);
  const [selectedOutfit, setSelectedOutfit] = useState(currentCharacter.outfit);
  const [selectedHeadwear, setSelectedHeadwear] = useState(currentCharacter.headwear);
  const [selectedAccessory, setSelectedAccessory] = useState(currentCharacter.accessory);
  const [selectedColor, setSelectedColor] = useState(currentCharacter.themeColor);

  // Active level selection
  const [selectedLevel, setSelectedLevel] = useState<AdventureLevel | null>(null);
  const [questInput, setQuestInput] = useState("");
  const [questChoice, setQuestChoice] = useState<number | null>(null);
  const [questResult, setQuestResult] = useState<{ success: boolean; msg: string; coins?: number; xp?: number; gems?: number } | null>(null);
  const [hintShown, setHintShown] = useState(false);

  // Daily Chest rewards state
  const [chestClaimed, setChestClaimed] = useState(false);
  const [chestReward, setChestReward] = useState<{ coins: number; gems: number } | null>(null);

  // Boss Battle state for the re-fight Arena
  const [bossArenaSelection, setBossArenaSelection] = useState<AdventureLevel | null>(null);
  const [arenaHealthBoss, setArenaHealthBoss] = useState(100);
  const [arenaHealthPlayer, setArenaHealthPlayer] = useState(100);
  const [arenaResult, setArenaResult] = useState<"won" | "lost" | null>(null);
  const [arenaActive, setArenaActive] = useState(false);

  // Trigger state synchronization with Server Database
  const saveState = (updatedStudent: AdventureStudent) => {
    onUpdateStudent(updatedStudent);
  };

  // Claim Daily Chest
  const handleClaimChest = () => {
    if (chestClaimed) return;
    const coinsReward = Math.floor(Math.random() * 20) + 30;
    const gemsReward = Math.floor(Math.random() * 4) + 4;
    
    setChestReward({ coins: coinsReward, gems: gemsReward });
    setChestClaimed(true);

    const updated: AdventureStudent = {
      ...student,
      coins: student.coins + coinsReward,
      gems: currentGems + gemsReward,
      xp: student.xp + 30
    };
    saveState(updated);
  };

  // Buy item from shop
  const handleBuyItem = (item: typeof SHOP_ITEMS[0]) => {
    if (currentInventory.includes(item.id)) return;
    if (student.coins < item.cost) {
      alert("❌ Not enough coins! Defeat more levels to earn bounty gold!");
      return;
    }

    const updated: AdventureStudent = {
      ...student,
      coins: student.coins - item.cost,
      inventory: [...currentInventory, item.id]
    };
    saveState(updated);
  };

  // Save customized character designs
  const handleSaveCharacter = () => {
    const updated: AdventureStudent = {
      ...student,
      character: {
        name: charName,
        outfit: selectedOutfit,
        headwear: selectedHeadwear,
        accessory: selectedAccessory,
        themeColor: selectedColor
      }
    };
    saveState(updated);
    alert("✨ Your customized Hero character has been saved & equipped!");
  };

  // Submit level decrypt solution
  const handleSubmitLevelQuest = () => {
    if (!selectedLevel) return;

    let isCorrect = false;
    if (selectedLevel.type === "comprehension") {
      isCorrect = questChoice === selectedLevel.correctIdx;
    } else {
      isCorrect = questInput.trim().toLowerCase() === selectedLevel.answer?.toLowerCase();
    }

    if (isCorrect) {
      // Success Rewards
      const coinsEarned = selectedLevel.rewardCoins;
      const xpEarned = selectedLevel.rewardXP;
      const gemsEarned = selectedLevel.rewardGems;

      // Unlocks and progressions
      const isAlreadyCompleted = completedLevels.includes(selectedLevel.id);
      const newCompleted = isAlreadyCompleted 
        ? completedLevels 
        : [...completedLevels, selectedLevel.id];

      // Move player level forward if they beat their latest unlocked level
      const playerReachedMax = selectedLevel.levelNumber === activeLevelNumber;
      const nextLevelNum = playerReachedMax 
        ? Math.min(activeLevelNumber + 1, 13) 
        : activeLevelNumber;

      const isLevelUp = student.xp + xpEarned >= (student.level * 400);

      const updated: AdventureStudent = {
        ...student,
        xp: student.xp + xpEarned,
        coins: student.coins + coinsEarned,
        gems: currentGems + gemsEarned,
        level: student.level + (isLevelUp ? 1 : 0),
        completedAdventureLevels: newCompleted,
        adventureLevelIndex: nextLevelNum
      };

      setQuestResult({
        success: true,
        msg: `🎉 Splendid! Your answer is 100% correct. You solved the puzzle and advanced!`,
        coins: coinsEarned,
        xp: xpEarned,
        gems: gemsEarned
      });

      // Synchronize changes automatically
      saveState(updated);
    } else {
      // Failed - trigger TRY AGAIN loop with positive feedback
      setQuestResult({
        success: false,
        msg: `❌ Not quite right! The defensive shields deflected your spell. Use the explorer clue and Try Again!`
      });
    }
  };

  // Try Again resets only result and input to give another opportunity
  const handleTryAgainQuest = () => {
    setQuestResult(null);
    setQuestInput("");
    setQuestChoice(null);
  };

  // Advance automatically to the next sequential level
  const handleAdvanceToNextLevel = () => {
    if (!selectedLevel) return;
    const currentNum = selectedLevel.levelNumber;
    
    // If completed the final level, congratulate and return to map
    if (currentNum === 12) {
      alert("🏆 MASTER OF LEARN_LIFT! You have conquered all 12 progressive adventure levels!");
      setSelectedLevel(null);
      setQuestResult(null);
      setQuestInput("");
      setQuestChoice(null);
      return;
    }

    // Load next level
    const nextLevel = ADVENTURE_LEVELS.find(l => l.levelNumber === currentNum + 1);
    if (nextLevel) {
      setSelectedLevel(nextLevel);
      setQuestResult(null);
      setQuestInput("");
      setQuestChoice(null);
      setHintShown(false);
    } else {
      setSelectedLevel(null);
    }
  };

  // Boss Battle Arena re-challenge flows
  const startBossArenaBattle = (bossLevel: AdventureLevel) => {
    setBossArenaSelection(bossLevel);
    setArenaHealthBoss(100);
    setArenaHealthPlayer(100);
    setArenaResult(null);
    setArenaActive(true);
    setQuestInput("");
    setQuestChoice(null);
    setQuestResult(null);
  };

  const handleArenaBossAttack = (choiceIndex?: number, textAnswer?: string) => {
    if (!bossArenaSelection) return;
    let correct = false;
    
    if (bossArenaSelection.type === "comprehension") {
      correct = choiceIndex === bossArenaSelection.correctIdx;
    } else {
      const ans = textAnswer || questInput;
      correct = ans.trim().toLowerCase() === bossArenaSelection.answer?.toLowerCase();
    }

    if (correct) {
      // Boss takes damage
      const nextBossHp = Math.max(arenaHealthBoss - 50, 0);
      setArenaHealthBoss(nextBossHp);
      if (nextBossHp === 0) {
        setArenaResult("won");
        // Give bonus re-challenge loot
        const updated: AdventureStudent = {
          ...student,
          coins: student.coins + 30,
          xp: student.xp + 40
        };
        saveState(updated);
      } else {
        alert("💥 DIRECT HIT! Your spell damaged the boss! Finish him off!");
      }
    } else {
      // Player takes damage
      const nextPlayerHp = Math.max(arenaHealthPlayer - 50, 0);
      setArenaHealthPlayer(nextPlayerHp);
      if (nextPlayerHp === 0) {
        setArenaResult("lost");
      } else {
        alert("⚠️ OUCH! The boss countered with frost-magic! Watch out!");
      }
    }
  };

  // Dynamic Character Avatar styling helper
  const renderAvatarDetails = (outfit: string, head: string, acc: string, col: string) => {
    const colorClass = 
      col === "Sapphire Blue" ? "bg-indigo-600 border-indigo-700" :
      col === "Emerald Green" ? "bg-emerald-600 border-emerald-700" :
      col === "Ruby Red" ? "bg-rose-600 border-rose-700" : "bg-violet-600 border-violet-700";

    const headwearEmoji = SHOP_ITEMS.find(i => i.id === head)?.icon || "🎓";
    const outfitEmoji = SHOP_ITEMS.find(i => i.id === outfit)?.icon || "👕";
    const accEmoji = SHOP_ITEMS.find(i => i.id === acc)?.icon || "🪄";

    return (
      <div className="flex flex-col items-center justify-center relative p-6 bg-slate-50 border border-slate-200/80 rounded-3xl w-44 h-44 shadow-inner">
        {/* Headwear */}
        <div className="absolute top-8 text-4xl z-20 animate-bounce">{headwearEmoji}</div>
        
        {/* Body Base */}
        <div className={`w-14 h-14 rounded-full ${colorClass} border-3 flex items-center justify-center relative z-10 mt-6`}>
          <span className="text-xl">🧑</span>
        </div>

        {/* Outfit overlay */}
        <div className="absolute bottom-11 text-2xl z-20">{outfitEmoji}</div>

        {/* Accessory in hand */}
        <div className="absolute right-7 bottom-14 text-3xl z-25">{accEmoji}</div>

        {/* Ground Platform */}
        <div className="w-24 h-4 bg-slate-200/60 rounded-full mt-4 flex items-center justify-center border border-slate-300/30 shadow-2xs" />
      </div>
    );
  };

  return (
    <div className="max-w-5xl w-full mx-auto px-4 py-6 font-sans flex flex-col gap-6 text-left relative" id="adventure_game_container">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs" id="game_header_panel">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition-colors cursor-pointer"
            id="back_to_portal_btn"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-1.5" id="game_title">
              <span>🏰 Hero's Progressive Adventure</span>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                Lv. {student.level}
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Scale mountains, spell scrolls, and conquer the riddle bosses!</p>
          </div>
        </div>

        {/* Game Currency Wallet */}
        <div className="flex items-center gap-3 w-full md:w-auto" id="game_currency_wallet">
          <div className="bg-amber-50 border border-amber-100 px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-500 fill-amber-300" />
            <span className="text-sm font-black text-amber-700">{student.coins}</span>
            <span className="text-[10px] text-amber-500 font-bold">Coins</span>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5">
            <Gem className="w-4 h-4 text-indigo-500 fill-indigo-300" />
            <span className="text-sm font-black text-indigo-700">{currentGems}</span>
            <span className="text-[10px] text-indigo-500 font-bold">Gems</span>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-black text-emerald-700">{student.xp}</span>
            <span className="text-[10px] text-emerald-500 font-bold">XP</span>
          </div>
        </div>
      </div>

      {/* GAME MODE NAVIGATION TABS */}
      <div className="flex bg-slate-200/60 p-1.5 rounded-2xl max-w-md gap-1.5" id="game_mode_tabs">
        <button
          onClick={() => { setActiveTab("map"); setSelectedLevel(null); }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "map" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
          id="tab_map_btn"
        >
          <Compass className="w-4 h-4" />
          <span>Adventure Map</span>
        </button>

        <button
          onClick={() => { setActiveTab("character"); }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "character" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
          id="tab_character_btn"
        >
          <Shield className="w-4 h-4" />
          <span>Character Creator</span>
        </button>

        <button
          onClick={() => { setActiveTab("bosses"); setBossArenaSelection(null); setArenaActive(false); }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "bosses" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
          id="tab_bosses_btn"
        >
          <Swords className="w-4 h-4" />
          <span>Boss Arena</span>
        </button>
      </div>

      {/* VIEW: JOURNEY ADVENTURE MAP */}
      {activeTab === "map" && !selectedLevel && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="view_adventure_map">
          
          {/* Map Nodes Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Daily Chest Widget */}
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/5 border border-amber-200/60 p-5 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
              <div className="flex items-start gap-3.5">
                <span className="text-4xl animate-bounce">🎁</span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Daily Mystery Treasure Chest</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    {chestClaimed ? "You have claimed today's rewards! Return tomorrow for another key." : "Claim surprise gold coins and gems to stock up your character gear!"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleClaimChest}
                disabled={chestClaimed}
                className="px-5 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-black rounded-xl shadow-md shadow-amber-200 transition-all cursor-pointer"
                id="claim_chest_btn"
              >
                {chestClaimed ? "Opened & Claimed" : "Unlock Chest! 🗝️"}
              </button>
            </div>

            {/* Treasure Hunt Claim Reveal Message */}
            <AnimatePresence>
              {chestReward && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-emerald-50 border border-emerald-200/80 p-4.5 rounded-3xl flex justify-between items-center"
                >
                  <p className="text-xs font-bold text-emerald-900">
                    🎉 Jackpot! You claimed <strong className="text-amber-600">+{chestReward.coins} Coins</strong> and <strong className="text-indigo-600">+{chestReward.gems} Gems</strong>!
                  </p>
                  <button 
                    onClick={() => setChestReward(null)}
                    className="text-xs text-emerald-700 hover:underline font-bold"
                  >
                    Nice!
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* PROGRESSIVE JOURNEY PATH */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span>🗺️ Progressive Path (Levels 1 - 12)</span>
                </h2>
                <div className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-xl">
                  Progress: {completedLevels.length} / 12 Solved
                </div>
              </div>

              {/* Linear Grouping by Chapters */}
              {["chapter_1", "chapter_2", "chapter_3"].map((chap, idx) => {
                const chapName = chap === "chapter_1" ? "Chapter 1: Phonics Forest" : chap === "chapter_2" ? "Chapter 2: Math Mountain" : "Chapter 3: Vocabulary Valley";
                const chapThemeBg = chap === "chapter_1" ? "bg-emerald-600" : chap === "chapter_2" ? "bg-indigo-600" : "bg-orange-600";
                const chapLevels = ADVENTURE_LEVELS.filter(l => l.chapter === chap);

                return (
                  <div key={chap} className="bg-slate-50 border border-slate-200/60 rounded-3xl p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${chapThemeBg}`} />
                        <span>{chapName}</span>
                      </h3>
                      {chap === "chapter_2" && activeLevelNumber < 5 && (
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}
                      {chap === "chapter_3" && activeLevelNumber < 9 && (
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {chapLevels.map((lvl) => {
                        const isCompleted = completedLevels.includes(lvl.id);
                        const isActive = lvl.levelNumber === activeLevelNumber;
                        const isLocked = lvl.levelNumber > activeLevelNumber;

                        return (
                          <div
                            key={lvl.id}
                            className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all relative ${
                              isCompleted 
                                ? "bg-white border-emerald-200 hover:border-emerald-300" 
                                : isActive 
                                ? "bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/20" 
                                : "bg-slate-100/50 border-slate-200 opacity-60"
                            }`}
                          >
                            {/* Badges */}
                            <div className="flex justify-between items-start">
                              <span className="text-2xl">{lvl.icon}</span>
                              {isCompleted ? (
                                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-0.5">
                                  <Check className="w-2.5 h-2.5 stroke-3" /> Completed
                                </span>
                              ) : isActive ? (
                                <span className="bg-indigo-100 text-indigo-800 text-[9px] font-black uppercase px-2 py-0.5 rounded-md animate-pulse">
                                  Next Active
                                </span>
                              ) : (
                                <span className="bg-slate-200 text-slate-500 p-1 rounded-md">
                                  <Lock className="w-3 h-3" />
                                </span>
                              )}
                            </div>

                            <div className="mt-3 space-y-1">
                              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                                <span>Lvl {lvl.levelNumber}: {lvl.name}</span>
                              </h4>
                              <p className="text-[10px] text-slate-500 font-semibold line-clamp-1">
                                {lvl.objective}
                              </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                              <span className="text-[9px] font-black uppercase text-slate-400">
                                💰 {lvl.rewardCoins} | 💎 {lvl.rewardGems}
                              </span>

                              {isLocked ? (
                                <button
                                  disabled
                                  className="px-3 py-1.5 bg-slate-100 text-slate-400 text-[10px] font-bold rounded-lg flex items-center gap-1"
                                >
                                  <span>Locked</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedLevel(lvl);
                                    setQuestResult(null);
                                    setQuestInput("");
                                    setQuestChoice(null);
                                    setHintShown(false);
                                  }}
                                  className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                                    isCompleted 
                                      ? "bg-slate-200 hover:bg-slate-300 text-slate-700" 
                                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-100"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <>
                                      <span>Replay</span>
                                      <RefreshCw className="w-2.5 h-2.5" />
                                    </>
                                  ) : (
                                    <>
                                      <span>Embark</span>
                                      <ChevronRight className="w-2.5 h-2.5" />
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Hero stats checklist (4 Cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-4 text-center flex flex-col items-center">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md">
              Hero Avatar status
            </span>
            
            {renderAvatarDetails(currentCharacter.outfit, currentCharacter.headwear, currentCharacter.accessory, currentCharacter.themeColor)}
            
            <div>
              <h3 className="font-black text-slate-900 text-base">{currentCharacter.name}</h3>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Explorer Level {student.level}</p>
            </div>

            <div className="w-full border-t border-slate-100 my-1" />

            <div className="w-full text-left space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Objectives</h4>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Check className="w-4 h-4 text-emerald-500 stroke-3 shrink-0" />
                  <span>Customize your character look</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  {completedLevels.length >= 4 ? (
                    <Check className="w-4 h-4 text-emerald-500 stroke-3 shrink-0" />
                  ) : (
                    <span className="w-4 h-4 border-2 border-slate-200 rounded-md block shrink-0" />
                  )}
                  <span>Conquer Rune Golem (Level 4)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  {completedLevels.length >= 12 ? (
                    <Check className="w-4 h-4 text-emerald-500 stroke-3 shrink-0" />
                  ) : (
                    <span className="w-4 h-4 border-2 border-slate-200 rounded-md block shrink-0" />
                  )}
                  <span>Defeat Sphinx Emperor (Level 12)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: ACTIVE LEVEL puzzle workspace */}
      {activeTab === "map" && selectedLevel && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="level_workspace">
          
          {/* Back button link */}
          <div className="lg:col-span-12">
            <button
              onClick={() => { setSelectedLevel(null); setQuestResult(null); }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
              id="exit_level_btn"
            >
              &larr; Return to Journey Map
            </button>
          </div>

          {/* Left Panel: Storytelling and enemy (4 columns) */}
          <div className="lg:col-span-4 space-y-4">
            <div className={`p-5 rounded-3xl bg-gradient-to-br ${selectedLevel.bg} text-white space-y-3 shadow-md`}>
              <span className="text-4xl">{selectedLevel.icon}</span>
              <span className="text-[10px] font-black uppercase bg-white/20 px-2 py-0.5 rounded-md block w-max">
                {selectedLevel.chapterName}
              </span>
              <h2 className="text-lg font-black">{selectedLevel.name}</h2>
              <p className="text-xs text-white/90 leading-relaxed font-medium">
                {selectedLevel.storyIntro}
              </p>
            </div>

            {/* Monster / Encounter stats */}
            <div className="bg-white border border-slate-200/80 p-5 rounded-3xl space-y-3.5 text-center flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Encounter Obstacle</span>
              
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl border border-slate-100 shadow-inner animate-bounce">
                {selectedLevel.enemyEmoji || "👾"}
              </div>

              <div>
                <p className="text-xs font-extrabold text-slate-800">{selectedLevel.enemyName || "Obstacle"}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Guard Strength: {selectedLevel.difficulty}</p>
              </div>
            </div>
          </div>

          {/* Right Panel: Challenge and try again controls (8 columns) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Rewards teaser */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md">
                    Quest Type: {selectedLevel.type}
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-2">{selectedLevel.objective}</h3>
                </div>

                <div className="flex gap-2">
                  <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
                    👑 +{selectedLevel.rewardCoins} Coins
                  </span>
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
                    💎 +{selectedLevel.rewardGems} Gems
                  </span>
                </div>
              </div>

              {/* Story Prompt Bubble */}
              <div className="p-5 bg-slate-50 border border-slate-200/60 rounded-2xl text-slate-800 text-sm leading-relaxed font-bold">
                {selectedLevel.question ? (
                  <p>{selectedLevel.question}</p>
                ) : (
                  <p className="text-center py-2">Solve this riddle: <span className="text-indigo-700 block mt-1.5 text-base font-extrabold">{selectedLevel.prompt}</span></p>
                )}
              </div>

              {/* Interactive Inputs */}
              {!questResult && (
                <div className="space-y-4">
                  {selectedLevel.options ? (
                    // Multiple Choice
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="mcq_options">
                      {selectedLevel.options.map((opt, idx) => {
                        const isChosen = questChoice === idx;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setQuestChoice(idx)}
                            className={`p-3.5 text-left text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                              isChosen 
                                ? "border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600/30" 
                                : "border-slate-200 hover:border-slate-300 bg-white"
                            }`}
                          >
                            <span className="mr-2 text-indigo-600">Option {idx + 1}:</span>
                            <span className="text-slate-800 font-semibold">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    // Text spelling or math answer input
                    <div className="space-y-2 max-w-sm">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Your Decrypted Spellword</label>
                      <input
                        type="text"
                        placeholder="Type solution here..."
                        value={questInput}
                        onChange={(e) => setQuestInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSubmitLevelQuest(); }}
                        className="w-full bg-slate-50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs font-bold outline-none transition-all uppercase"
                        id="spell_solution_input"
                      />
                    </div>
                  )}

                  {/* Hint details */}
                  <div className="pt-2">
                    {hintShown ? (
                      <p className="text-xs text-amber-600 font-bold bg-amber-50 border border-amber-100 p-3.5 rounded-xl">
                        💡 Explorer Clue: {selectedLevel.clue}
                      </p>
                    ) : (
                      <button
                        onClick={() => setHintShown(true)}
                        className="text-xs font-black text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Need an Explorer Clue? &rarr;
                      </button>
                    )}
                  </div>

                  {/* Submit buttons */}
                  <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                    <button
                      onClick={handleSubmitLevelQuest}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer"
                      id="submit_answer_btn"
                    >
                      Cast Decryption Spell
                    </button>
                  </div>
                </div>
              )}

              {/* Feedback outcome area */}
              <AnimatePresence>
                {questResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-5 rounded-2xl flex flex-col gap-3 ${
                      questResult.success 
                        ? "bg-emerald-50 border border-emerald-200/60 text-emerald-950" 
                        : "bg-rose-50 border border-rose-200/60 text-rose-950"
                    }`}
                    id="quest_outcome_banner"
                  >
                    <div className="flex items-start gap-3.5 text-xs font-bold">
                      <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${questResult.success ? "text-emerald-600" : "text-rose-500"}`} />
                      <div>
                        <p className="font-extrabold text-sm">{questResult.success ? "Success!" : "Deflected!"}</p>
                        <p className="text-xs font-medium text-slate-600 mt-1">{questResult.msg}</p>
                      </div>
                    </div>

                    {/* Rewards Popup */}
                    {questResult.success ? (
                      <div className="space-y-4">
                        <div className="flex gap-2.5 text-[10px] font-black uppercase text-emerald-800 bg-white/60 p-2.5 rounded-lg w-max">
                          <span>💰 +{questResult.coins} Coins</span>
                          <span>💎 +{questResult.gems} Gems</span>
                          <span>🌟 +{questResult.xp} XP</span>
                        </div>
                        <div className="flex gap-2.5">
                          <button
                            onClick={handleAdvanceToNextLevel}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl transition-all shadow-md shadow-indigo-100 cursor-pointer"
                            id="advance_next_level_btn"
                          >
                            Advance to Next Level 🚀
                          </button>
                          <button
                            onClick={() => { setSelectedLevel(null); setQuestResult(null); }}
                            className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
                          >
                            Return to Map
                          </button>
                        </div>
                      </div>
                    ) : (
                      // TRY AGAIN OPTION as requested: another opportunity to complete before progressing
                      <div className="pt-2">
                        <button
                          onClick={handleTryAgainQuest}
                          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1 cursor-pointer"
                          id="try_again_btn"
                        >
                          <span>Try Again 🔄</span>
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>
      )}

      {/* VIEW: CHARACTER CREATOR & SHOP */}
      {activeTab === "character" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="view_character_creator">
          {/* Avatar creator - 5 columns */}
          <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col items-center gap-6">
            <h3 className="font-black text-slate-900 text-sm text-center">Customize Your Hero Avatar</h3>
            
            {renderAvatarDetails(selectedOutfit, selectedHeadwear, selectedAccessory, selectedColor)}

            {/* Settings input forms */}
            <div className="w-full space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hero Name</label>
                <input
                  type="text"
                  value={charName}
                  onChange={(e) => setCharName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3.5 py-2 text-xs font-bold outline-none transition-all"
                  id="character_name_input"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base Skin Aura</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Sapphire Blue", "Emerald Green", "Ruby Red", "Violet Light"].map(c => {
                    const isSelected = selectedColor === c;
                    return (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`p-2 rounded-xl text-center text-[10px] font-extrabold border transition-all cursor-pointer ${
                          isSelected ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-white text-slate-600"
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleSaveCharacter}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                id="save_outfit_btn"
              >
                <Check className="w-4 h-4" />
                <span>Equip & Save Outfit</span>
              </button>
            </div>
          </div>

          {/* Cosmetics Shop / Closet - 7 columns */}
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-extrabold text-slate-900 text-base">The Guild Armoury & Wardrobe</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Spend your collected quest gold coins to acquire premium magic cosmetics!</p>
            </div>

            {/* Shop Item Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto">
              {SHOP_ITEMS.map((item) => {
                const ownsItem = currentInventory.includes(item.id);
                const isEquipped = selectedOutfit === item.id || selectedHeadwear === item.id || selectedAccessory === item.id;

                return (
                  <div 
                    key={item.id}
                    className={`p-4 border rounded-2xl flex flex-col justify-between h-40 transition-all ${
                      ownsItem 
                        ? "border-slate-200 bg-slate-50/50" 
                        : "border-slate-100 hover:border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex gap-2.5 items-start">
                        <span className="text-3xl bg-white border border-slate-100 p-2 rounded-xl block shrink-0">{item.icon}</span>
                        <div>
                          <p className="text-xs font-black text-slate-900">{item.name}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{item.type}</p>
                        </div>
                      </div>

                      {!ownsItem && (
                        <span className="bg-amber-50 text-amber-700 font-extrabold text-[10px] px-2 py-0.5 rounded-md shrink-0 flex items-center gap-0.5">
                          🪙 {item.cost}
                        </span>
                      )}
                    </div>

                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed my-2">
                      {item.desc}
                    </p>

                    {ownsItem ? (
                      <button
                        onClick={() => {
                          if (item.type === "outfit") setSelectedOutfit(item.id);
                          if (item.type === "headwear") setSelectedHeadwear(item.id);
                          if (item.type === "accessory") setSelectedAccessory(item.id);
                        }}
                        className={`w-full py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                          isEquipped 
                            ? "bg-indigo-600 text-white" 
                            : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                        }`}
                      >
                        {isEquipped ? "👑 Equipped" : "🧥 Dress Up"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuyItem(item)}
                        disabled={student.coins < item.cost}
                        className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white rounded-lg text-[10px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Coins className="w-3 h-3" />
                        <span>Purchase Item</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: EPIC BOSS ARENA TAB */}
      {activeTab === "bosses" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="view_boss_arena">
          
          {/* Active Arena Battle Simulation */}
          {arenaActive && bossArenaSelection ? (
            <div className="lg:col-span-12">
              <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center gap-8">
                {/* Space Matrix Background */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

                {arenaResult ? (
                  <div className="py-12 text-center max-w-md mx-auto space-y-6 relative z-10">
                    {arenaResult === "won" ? (
                      <>
                        <div className="text-6xl animate-bounce">🏆</div>
                        <div>
                          <h2 className="text-2xl font-black text-amber-400">VICTORY SECURED!</h2>
                          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                            You successfully vanquished the mighty {bossArenaSelection.enemyName}! Your spelling and calculation accuracy turned the tide of battle.
                          </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2 text-left">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Arena Re-fight Rewards</h4>
                          <div className="grid grid-cols-2 gap-2 text-center font-black text-xs uppercase pt-2">
                            <span className="bg-amber-500/10 text-amber-400 px-2 py-1.5 rounded-lg border border-amber-500/20">💰 +30 Coins</span>
                            <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1.5 rounded-lg border border-emerald-500/20">🌟 +40 XP</span>
                          </div>
                        </div>

                        <button
                          onClick={() => { setArenaActive(false); setBossArenaSelection(null); }}
                          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer"
                        >
                          Back to Boss List
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="text-6xl">💀</div>
                        <div>
                          <h2 className="text-2xl font-black text-red-500">DEFEATED!</h2>
                          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                            The {bossArenaSelection.enemyName} overpowered your spellshield! Review the study topics and try again.
                          </p>
                        </div>

                        <button
                          onClick={() => startBossArenaBattle(bossArenaSelection)}
                          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer"
                        >
                          Relaunch Boss Raid
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="w-full space-y-8 relative z-10">
                    {/* Healthbars */}
                    <div className="flex flex-col sm:flex-row justify-between items-stretch gap-6 border-b border-slate-800 pb-6 w-full">
                      {/* Player */}
                      <div className="flex-1 text-left space-y-2">
                        <div className="flex justify-between items-center text-xs font-black">
                          <span className="text-indigo-400 uppercase tracking-wider">{currentCharacter.name} (YOU)</span>
                          <span>{arenaHealthPlayer}% HP</span>
                        </div>
                        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${arenaHealthPlayer}%` }} />
                        </div>
                      </div>

                      <div className="flex items-center justify-center text-xl font-black text-amber-500 shrink-0">VS</div>

                      {/* Boss */}
                      <div className="flex-1 text-right space-y-2">
                        <div className="flex justify-between items-center text-xs font-black">
                          <span>{arenaHealthBoss}% HP</span>
                          <span className="text-red-400 uppercase tracking-wider">{bossArenaSelection.enemyName} (BOSS)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full rounded-full transition-all duration-300" style={{ width: `${arenaHealthBoss}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Arena Graphic Stage */}
                    <div className="h-44 bg-slate-950 rounded-2xl flex justify-around items-center border border-slate-800 relative">
                      <div className="absolute top-2 left-3 text-[10px] text-slate-600 font-bold uppercase tracking-widest">Raid Arena</div>
                      
                      {/* Player */}
                      <div className="text-center space-y-2 flex flex-col items-center">
                        <div className="text-5xl animate-pulse">🧑‍🚀</div>
                        <p className="text-[10px] text-indigo-300 font-black uppercase">{currentCharacter.name}</p>
                      </div>

                      <div className="text-3xl text-indigo-500 animate-ping">⚡</div>

                      {/* Boss */}
                      <div className="text-center space-y-2 flex flex-col items-center">
                        <div className="text-6xl animate-bounce">{bossArenaSelection.enemyEmoji}</div>
                        <p className="text-[10px] text-red-400 font-black uppercase">{bossArenaSelection.enemyName}</p>
                      </div>
                    </div>

                    {/* Question Space */}
                    <div className="max-w-xl mx-auto space-y-5 bg-slate-950/40 p-5 border border-slate-800/80 rounded-2xl">
                      <div className="text-center">
                        <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Deflection Challenge</span>
                        <h3 className="text-sm font-bold text-slate-200 mt-2">
                          {bossArenaSelection.question || bossArenaSelection.prompt}
                        </h3>
                      </div>

                      {bossArenaSelection.options ? (
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          {bossArenaSelection.options.map((o, idx) => (
                            <button
                              key={o}
                              onClick={() => handleArenaBossAttack(idx)}
                              className="p-3 bg-slate-900 border border-slate-800 hover:border-indigo-600 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-300 transition-colors cursor-pointer"
                            >
                              {o}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex gap-2 max-w-md mx-auto pt-2">
                          <input
                            id="arena_input"
                            type="text"
                            placeholder="Type spell answer here..."
                            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold outline-none uppercase"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleArenaBossAttack(undefined, e.currentTarget.value);
                                e.currentTarget.value = "";
                              }
                            }}
                          />
                          <button
                            onClick={() => {
                              const inp = document.getElementById("arena_input") as HTMLInputElement;
                              if (inp) {
                                handleArenaBossAttack(undefined, inp.value);
                                inp.value = "";
                              }
                            }}
                            className="px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer"
                          >
                            Spell Fireball
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Boss list display
            <div className="lg:col-span-12 space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="font-extrabold text-slate-900 text-base">The Boss Arena</h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Conquer progressive world levels on the map to unlock these grand guardians for re-matches and gold rewards!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {ADVENTURE_LEVELS.filter(l => l.type === "boss").map((bossLvl) => {
                  const unlocked = completedLevels.includes(bossLvl.id) || activeLevelNumber > bossLvl.levelNumber;

                  return (
                    <div 
                      key={bossLvl.id}
                      className={`border rounded-3xl p-5 flex flex-col justify-between h-64 transition-all ${
                        unlocked 
                          ? "bg-slate-900 border-slate-800 text-white shadow-md hover:border-amber-500/50" 
                          : "bg-slate-50 border-slate-100 opacity-60 text-slate-400"
                      }`}
                    >
                      <div className="space-y-3 text-left">
                        <div className="flex justify-between items-center">
                          <span className="text-4xl">{bossLvl.enemyEmoji}</span>
                          {unlocked ? (
                            <span className="bg-amber-400/20 border border-amber-400/30 text-amber-400 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                              Unlocked
                            </span>
                          ) : (
                            <span className="bg-slate-200 text-slate-500 p-1.5 rounded-lg text-xs">
                              <Lock className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="text-sm font-black">{bossLvl.enemyName}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{bossLvl.chapterName}</p>
                        </div>

                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed line-clamp-3">
                          {bossLvl.storyIntro}
                        </p>
                      </div>

                      {unlocked ? (
                        <button
                          onClick={() => startBossArenaBattle(bossLvl)}
                          className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Swords className="w-3.5 h-3.5" />
                          <span>Initiate Duel</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full py-2 bg-slate-200 text-slate-400 font-bold text-xs rounded-xl flex items-center justify-center gap-1"
                        >
                          <span>Locked (Reach Lvl {bossLvl.levelNumber})</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
