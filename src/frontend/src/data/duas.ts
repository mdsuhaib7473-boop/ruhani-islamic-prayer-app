export type AuthenticityTag = "Sahih" | "Hasan" | "Weak" | "Quran";

export interface Dua {
  id: number;
  name?: string;
  category: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  translationHi?: string;
  translationUr?: string;
  source: string;
  note?: string;
  when: string;
  benefit: string;
  tag: AuthenticityTag;
}

export const CATEGORIES = [
  "All",
  "Morning",
  "Evening",
  "After Salah",
  "Eating",
  "Sleep",
  "Home",
  "Protection",
  "Travel",
  "Masjid",
  "Weather",
  "Purification",
  "Family & Children",
  "Rizq & Barakah",
  "Knowledge & Wisdom",
  "Health & Sickness",
  "General",
  "Stress & Anxiety",
  "Forgiveness",
  "Food",
];

export const duas: Dua[] = [
  {
    id: 1,
    category: "Morning",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    transliteration:
      "Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namutu wa ilayka'n-nushur",
    translation:
      "O Allah, by You we enter the morning, by You we enter the evening, by You we live, by You we die, and to You is the resurrection.",
    translationHi:
      "ऐ अल्लाह, तेरे ही नाम पर हम सुबह करते हैं, तेरे ही नाम पर जीते और मरते हैं",
    translationUr:
      "اے اللہ، تیرے ہی نام پر صبح کرتے ہیں، تیرے نام پر جیتے اور مرتے ہیں",
    source: "Abu Dawud 5068",
    when: "Upon waking each morning",
    benefit:
      "Begins the day in remembrance of Allah and acknowledgment of His power over life",
    tag: "Sahih",
  },
  {
    id: 2,
    category: "Morning",
    arabic:
      "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration:
      "Bismillahi'l-ladhi la yadurru ma'a ismihi shay'un fi'l-ardi wa la fi's-sama'i wa huwa's-Sami'u'l-'Alim",
    translation:
      "In the name of Allah, with Whose name nothing is harmed on earth or in heaven, and He is the All-Hearing, All-Knowing.",
    translationHi:
      "अल्लाह के नाम से — जिसके नाम से ज़मीन-आसमान में कोई चीज़ नुकसान नहीं दे सकती",
    translationUr:
      "اللہ کے نام سے — جس کے نام سے زمین آسمان میں کوئی نقصان نہیں دے سکتی",
    source: "Abu Dawud 5088, Tirmidhi 3388",
    when: "Morning and evening, 3 times each",
    benefit: "Protects from all harm throughout the day",
    tag: "Sahih",
  },
  {
    id: 3,
    category: "Morning",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
    transliteration:
      "Asbahna wa asbahal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah",
    translation:
      "We have entered morning and the kingdom belongs to Allah; praise be to Allah, there is no god but Allah alone with no partner.",
    translationHi:
      "हम सुबह हुए और अल्लाह का राज्य सुबह हुआ, तमाम तारीफ़ें अल्लाह के लिए हैं",
    translationUr:
      "ہم نے صبح کی اور اللہ کی بادشاہی نے صبح کی، تمام تعریفیں اللہ کے لیے ہیں",
    source: "Sahih Muslim 2723",
    when: "At the start of morning",
    benefit: "Affirms divine sovereignty and sets a mindset of gratitude",
    tag: "Sahih",
  },
  {
    id: 4,
    category: "Evening",
    arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
    transliteration:
      "Allahumma bika amsayna wa bika asbahna wa bika nahya wa bika namutu wa ilayka'l-masir",
    translation:
      "O Allah, by You we enter the evening, by You we enter the morning, by You we live, by You we die, and to You is the return.",
    translationHi:
      "अल्लाह — उसके सिवा कोई पूज्य नहीं, वो जीवित और सदा क़ायम है (आयत अल-कुर्सी)",
    translationUr:
      "اللہ کے سوا کوئی معبود نہیں، وہ زندہ اور قائم ہے — آیت الکرسی",
    source: "Abu Dawud 5068",
    when: "At the start of the evening",
    benefit: "Closes the day in remembrance and submission to Allah",
    tag: "Sahih",
  },
  {
    id: 5,
    category: "Evening",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A'udhu bikalimatillahi't-tammati min sharri ma khalaq",
    translation:
      "I seek refuge in the perfect words of Allah from the evil of what He has created.",
    translationHi: "मैं अल्लाह की संपूर्ण बातों में पनाह लेता हूं उसकी बनाई चीज़ों की बुराई से",
    translationUr:
      "میں اللہ کی مکمل کلمات کی پناہ لیتا ہوں اس کی مخلوق کی برائی سے",
    source: "Sahih Muslim 2708",
    when: "In the evening and when stopping at a place",
    benefit: "Protects from harm, evil creatures, and the unseen",
    tag: "Sahih",
  },
  {
    id: 6,
    category: "After Salah",
    arabic:
      "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ",
    transliteration:
      "Allahu la ilaha illa huwa'l-Hayyu'l-Qayyum, la ta'khudhuhu sinatun wa la nawm, lahu ma fis-samawati wa ma fil-ard...",
    translation:
      "Allah — there is no god except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. (Ayat al-Kursi)",
    translationHi:
      "अल्लाह — उसके सिवा कोई पूज्य नहीं, जीवित और क़ायम है। न ऊंघ आती है उसे न नींद (आयत الکرسی)",
    translationUr:
      "اللہ کے سوا کوئی معبود نہیں، زندہ و قائم ہے، نہ اونگھ نہ نیند — آیت الکرسی",
    source: "Quran 2:255",
    when: "After every obligatory prayer",
    benefit:
      "Whoever recites it after prayer, only death separates them from Paradise",
    tag: "Quran",
  },
  {
    id: 7,
    category: "After Salah",
    arabic: "سُبْحَانَ اللَّهِ ٣٣ وَالْحَمْدُ لِلَّهِ ٣٣ وَاللَّهُ أَكْبَرُ ٣٤",
    transliteration: "SubhanAllah (33), Alhamdulillah (33), Allahu Akbar (34)",
    translation:
      "Glory be to Allah (33 times), Praise be to Allah (33 times), Allah is the Greatest (34 times).",
    translationHi:
      "सुब्हानल्लाह (33 बार)، अल्हम्दुलिल्लाह (33 बार)، अल्लाहु अकबर (34 बार)",
    translationUr:
      "سبحان اللہ (33 بار)، الحمد للہ (33 بار)، اللہ اکبر (34 بار)",
    source: "Sahih Muslim 597",
    when: "After each obligatory prayer",
    benefit: "Sins forgiven even if like the foam of the sea",
    tag: "Sahih",
  },
  {
    id: 8,
    category: "Eating",
    arabic: "بِسْمِ اللَّهِ",
    transliteration: "Bismillah",
    translation: "In the name of Allah.",
    translationHi: "अल्लाह के नाम से",
    translationUr: "اللہ کے نام سے",
    source: "Abu Dawud 3767",
    when: "Before eating or drinking",
    benefit: "Keeps Shaytan from partaking in one's food",
    tag: "Sahih",
  },
  {
    id: 9,
    category: "Eating",
    arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَأَطْعِمْنَا خَيْرًا مِنْهُ",
    transliteration: "Allahumma barik lana fihi wa at'imna khayran minhu",
    translation: "O Allah, bless it for us and feed us better than it.",
    translationHi: "ऐ अल्लाह, हमारे लिए इसमें बरकत दे और हमें इससे बेहतर खिला",
    translationUr: "اے اللہ، ہمیں اس میں برکت دے اور اس سے بہتر کھلا",
    source: "Abu Dawud 3730",
    when: "Before consuming milk or dairy",
    benefit: "Calls for divine blessing in one's sustenance",
    tag: "Sahih",
  },
  {
    id: 10,
    category: "Eating",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَٰذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    transliteration:
      "Alhamdulillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah",
    translation:
      "Praise be to Allah Who has fed me this and provided it for me without any might or power on my part.",
    translationHi:
      "तमाम तारीफें अल्लाह के लिए जिसने हमें बिना किसी ताक़त के खाना खिलाया",
    translationUr: "تمام تعریفیں اللہ کے لیے جس نے بغیر کوشش کے کھانا دیا",
    source: "Abu Dawud 4023, Tirmidhi 3458",
    when: "After finishing a meal",
    benefit: "Previous sins forgiven as a reward for this gratitude",
    tag: "Hasan",
  },
  {
    id: 11,
    category: "Sleep",
    arabic: "بِسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya",
    translation: "In Your name, O Allah, I die and I live.",
    translationHi: "अल्लाह के नाम पर, मैं मरता और जीता हूं",
    translationUr: "اللہ کے نام پر، میں مرتا اور جیتا ہوں",
    source: "Sahih Bukhari 6312",
    when: "Just before sleeping",
    benefit:
      "Places one's sleep and awakening under Allah's name and protection",
    tag: "Sahih",
  },
  {
    id: 12,
    category: "Sleep",
    arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
    transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak",
    translation:
      "O Allah, protect me from Your punishment on the Day You resurrect Your servants.",
    translationHi: "ऐ अल्लाह, क़यामत के दिन मुझे अपने अज़ाब से बचा",
    translationUr: "اے اللہ، قیامت کے دن مجھے اپنے عذاب سے بچا",
    source: "Abu Dawud 5045",
    when: "Before sleeping, recite 3 times",
    benefit: "Seeks Allah's protection from punishment on the Day of Judgment",
    tag: "Sahih",
  },
  {
    id: 13,
    category: "Sleep",
    arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ لَا إِلَٰهَ إِلَّا أَنْتَ أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ",
    transliteration:
      "Subhanakal-lahumma wa bihamdika la ilaha illa anta astaghfiruka wa atubu ilayk",
    translation:
      "Glory be to You, O Allah, and praise. There is no god but You. I seek Your forgiveness and turn to You in repentance.",
    translationHi:
      "ऐ अल्लाह, तू पाक है, तेरी तारीफ़ है, माफ़ी मांगता हूं और तेरी तरफ़ लौटता हूं",
    translationUr:
      "اے اللہ، تو پاک ہے، تیری تعریف ہے، معافی مانگتا ہوں اور توبہ کرتا ہوں",
    source: "Sahih Bukhari 834",
    when: "Before sleeping or after any gathering",
    benefit: "Expiates sins committed in a gathering",
    tag: "Sahih",
  },
  {
    id: 14,
    category: "Home",
    arabic: "بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
    transliteration:
      "Bismillahi walajna wa bismillahi kharajna wa 'ala Allahi rabbina tawakkalna",
    translation:
      "In the name of Allah we enter, in the name of Allah we leave, and upon Allah our Lord we rely.",
    translationHi:
      "अल्लाह के नाम पर आए, अल्लाह के नाम पर गए और अल्लाह पर भरोसा किया",
    translationUr:
      "اللہ کے نام پر آئے، اللہ کے نام پر گئے اور اللہ پر بھروسہ کیا",
    source: "Abu Dawud 5096",
    when: "When entering and leaving the home",
    benefit: "Places the home under divine protection and blessing",
    tag: "Hasan",
  },
  {
    id: 15,
    category: "Home",
    arabic:
      "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا",
    transliteration:
      "Allahumma inni as'aluka khayral-mawliji wa khayral-makhraji, bismillahi walajna, wa bismillahi kharajna",
    translation:
      "O Allah, I ask You for the best entrance and the best exit. In the name of Allah we enter and in the name of Allah we leave.",
    translationHi: "ऐ अल्लाह, आने-जाने की बेहतरी मांगता हूं — बिस्मिल्लाह करके आए और गए",
    translationUr:
      "اے اللہ، آنے جانے کی بھلائی مانگتا ہوں — بسم اللہ کہہ کر آئے اور گئے",
    source: "Abu Dawud 5096",
    when: "When entering or leaving the home",
    benefit: "Invites goodness and blessing with every entry and exit",
    tag: "Hasan",
  },
  {
    id: 16,
    category: "Protection",
    arabic: "حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    transliteration:
      "Hasbiyallahu la ilaha illa huwa 'alayhi tawakkaltu wa huwa rabbul-'arshil-'azim",
    translation:
      "Sufficient for me is Allah; there is no god but He. In Him I put my trust, and He is the Lord of the Mighty Throne.",
    translationHi: "मुझे अल्लाह काफ़ी है, उसके सिवा कोई पूज्य नहीं, उसी पर भरोसा है",
    translationUr:
      "میرے لیے اللہ کافی ہے، اس کے سوا کوئی معبود نہیں، اسی پر بھروسہ",
    source: "Abu Dawud 5081 (Quran 9:129)",
    when: "When feeling overwhelmed or in need of protection",
    benefit: "Allah suffices whoever relies on Him completely",
    tag: "Quran",
  },
  {
    id: 17,
    category: "Protection",
    arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
    transliteration: "A'udhu billahi mina'sh-shaytani'r-rajim",
    translation: "I seek refuge in Allah from the accursed devil.",
    translationHi: "शैतान मर्दूद से अल्लाह की शरण लेता हूं",
    translationUr: "مردود شیطان سے اللہ کی پناہ لیتا ہوں",
    source: "Quran 16:98",
    when: "Before reciting Quran, when feeling anger or temptation",
    benefit: "Wards off Shaytan and evil whispers",
    tag: "Quran",
  },
  {
    id: 18,
    category: "General",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration:
      "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar",
    translation:
      "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
    translationHi:
      "ऐ हमारे रब, दुनिया में भी भलाई दे, आख़िरत में भी भलाई दे और जहन्नम से बचा",
    translationUr:
      "اے ہمارے رب، دنیا میں بھی بھلائی دے، آخرت میں بھی بھلائی دے اور جہنم سے بچا",
    source: "Quran 2:201",
    when: "Any time; especially after prayers and in Tawaf",
    benefit: "Most comprehensive dua combining good of this world and the next",
    tag: "Quran",
  },
  {
    id: 19,
    category: "General",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
    transliteration:
      "Allahumma inni as'aluka'l-'afiyata fid-dunya wa'l-akhirah",
    translation:
      "O Allah, I ask You for well-being in this world and the Hereafter.",
    translationHi: "ऐ अल्लाह, मैं दुनिया और आख़िरत में आफियत मांगता हूं",
    translationUr: "اے اللہ، میں دنیا اور آخرت میں عافیت مانگتا ہوں",
    source: "Tirmidhi 3514",
    when: "Regularly, especially in the morning",
    benefit: "Aafia (well-being) is among the greatest gifts from Allah",
    tag: "Hasan",
  },
  {
    id: 20,
    category: "General",
    arabic: "اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَعَافِنِي وَارْزُقْنِي",
    transliteration: "Allahumma'ghfir li warhamni wahdini wa 'afini warzuqni",
    translation:
      "O Allah, forgive me, have mercy on me, guide me, grant me well-being, and provide for me.",
    translationHi: "ऐ अल्लाह, माफ़ कर, रहम कर, हिदायत दे, आफियत दे, रिज़्क़ दे",
    translationUr: "اے اللہ، معاف کر، رحم کر، ہدایت دے، عافیت دے، رزق دے",
    source: "Sahih Muslim 2697",
    when: "Any time; a comprehensive short dua",
    benefit:
      "Covers five essential needs: forgiveness, mercy, guidance, health, and provision",
    tag: "Sahih",
  },
  {
    id: 21,
    category: "General",
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
    transliteration: "Rabbi'shrah li sadri wa yassir li amri",
    translation:
      "My Lord, expand for me my breast [with assurance] and ease for me my task.",
    translationHi: "मेरे रब, मेरा सीना खोल दे और मेरा काम आसान कर दे",
    translationUr: "میرے رب، میرا سینہ کھول دے اور میرا کام آسان کر دے",
    source: "Quran 20:25-26",
    when: "Before an important task, speech, or challenge",
    benefit: "Opens the heart and eases all affairs",
    tag: "Quran",
  },
  {
    id: 22,
    category: "General",
    arabic: "لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    transliteration: "La ilaha illa anta subhanaka inni kuntu mina'z-zalimin",
    translation:
      "There is no god but You; glory be to You. Indeed, I have been of the wrongdoers (Dua of Prophet Yunus).",
    translationHi: "तेरे सिवा कोई पूज्य नहीं, तू पाक है, मैं ज़ालिमों में से था — दुआए यूनुस",
    translationUr:
      "تیرے سوا کوئی معبود نہیں، تو پاک ہے، میں ظالموں میں تھا — دعاء یونس",
    source: "Quran 21:87",
    when: "In times of distress and hardship",
    benefit:
      "No Muslim calls upon Allah with these words except that Allah answers",
    tag: "Quran",
  },
  {
    id: 23,
    name: "Dua on Waking Up",
    category: "Morning",
    arabic: "اَلْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration:
      "Alhamdu lillahil-lathi ahyana ba'da ma amatana wa ilayhin-nushur",
    translation:
      "All praise is for Allah who gave us life after having taken it from us, and unto Him is the resurrection.",
    translationHi: "तमाम तारीफ़ें अल्लाह के लिए जिसने मौत के बाद ज़िंदगी दी",
    translationUr: "تمام تعریفیں اللہ کے لیے جس نے موت کے بعد زندگی دی",
    source: "Sahih al-Bukhari",
    when: "Immediately upon waking from sleep",
    benefit:
      "Greets the new day with praise and awareness of Allah's gift of life",
    tag: "Sahih",
  },
  {
    id: 24,
    name: "Morning Remembrance",
    category: "Morning",
    arabic: "اَللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    transliteration:
      "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu, wa ilaykan-nushur",
    translation:
      "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the final return.",
    translationHi:
      "ऐ अल्लाह, तेरे ही नाम पर सुबह करते हैं — तेरे ही नाम पर जीते और मरते हैं",
    translationUr:
      "اے اللہ، تیرے ہی نام پر صبح کرتے ہیں — تیرے نام پر جیتے اور مرتے ہیں",
    source: "Sunan at-Tirmidhi",
    when: "In the morning as part of daily adhkar",
    benefit: "Anchors the entire day in reliance upon Allah",
    tag: "Sahih",
  },
  {
    id: 25,
    name: "Evening Remembrance",
    category: "Evening",
    arabic: "اَللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
    transliteration:
      "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namutu, wa ilaykal-masir",
    translation:
      "O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the return.",
    translationHi:
      "ऐ अल्लाह, तेरे ही नाम पर शाम करते हैं — तेरे ही नाम पर जीते और मरते हैं",
    translationUr:
      "اے اللہ، تیرے ہی نام پر شام کرتے ہیں — تیرے نام پر جیتے اور مرتے ہیں",
    source: "Sunan at-Tirmidhi",
    when: "In the evening as part of daily adhkar",
    benefit: "Closes the day with gratitude and reliance on Allah",
    tag: "Sahih",
  },
  {
    id: 26,
    name: "After Salam",
    category: "After Salah",
    arabic: "اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ تَبَارَكْتَ ذَا الْجَلاَلِ وَالإِكْرَامِ",
    transliteration:
      "Allahumma antas-salam, wa minkas-salam, tabarakta ya dhal-jalali wal-ikram",
    translation:
      "O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of majesty and honor.",
    translationHi:
      "ऐ अल्लाह, तू सलामती है और तुझसे ही सलामती है — बरकत वाले हो तू ऐ शान वाले",
    translationUr:
      "اے اللہ، تو سلامتی ہے اور تجھ سے ہی سلامتی — برکت والے ہو تو اے شان والے",
    source: "Sahih Muslim",
    when: "Immediately after giving salam at the end of prayer",
    benefit: "Glorifies Allah and completes prayer with excellence",
    tag: "Sahih",
  },
  {
    id: 27,
    name: "Before Eating",
    category: "Eating",
    arabic: "بِسْمِ اللهِ",
    transliteration: "Bismillah",
    translation: "In the name of Allah.",
    translationHi: "अल्लाह के नाम से",
    translationUr: "اللہ کے نام سے",
    source: "Sahih al-Bukhari, Sahih Muslim",
    when: "Before starting any meal",
    benefit:
      "Invites Allah's blessing into the meal and prevents Shaytan from sharing it",
    tag: "Sahih",
  },
  {
    id: 28,
    name: "If Forgot Bismillah",
    category: "Eating",
    arabic: "بِسْمِ اللهِ فِي أَوَّلِهِ وَآخِرِهِ",
    transliteration: "Bismillahi fi awwalihi wa akhirihi",
    translation: "In the name of Allah at its beginning and at its end.",
    translationHi: "अल्लाह के नाम से इसके शुरू और आख़िर में",
    translationUr: "اللہ کے نام سے اس کے شروع اور آخر میں",
    source: "Sunan Abi Dawud",
    when: "When you remember mid-meal that you forgot to say Bismillah",
    benefit: "Corrects the omission and restores blessing in the food",
    tag: "Hasan",
  },
  {
    id: 29,
    name: "After Eating",
    category: "Eating",
    arabic: "اَلْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    transliteration:
      "Alhamdu lillahil-lathi at'amana wa saqana wa ja'alana muslimin",
    translation:
      "All praise is for Allah who fed us, gave us drink, and made us Muslims.",
    translationHi: "तमाम तारीफ़ें अल्लाह के लिए जिसने खिलाया, पिलाया और मुसलमान बनाया",
    translationUr:
      "تمام تعریفیں اللہ کے لیے جس نے کھلایا، پلایا اور مسلمان بنایا",
    source: "Sunan Abi Dawud",
    when: "After finishing a meal",
    benefit: "Expresses gratitude for sustenance and the blessing of Islam",
    tag: "Sahih",
  },
  {
    id: 30,
    name: "Before Sleeping",
    category: "Sleep",
    arabic: "اَللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا",
    transliteration: "Allahumma bismika amutu wa ahya",
    translation: "O Allah, with Your name I die and I live.",
    translationHi: "ऐ अल्लाह, तेरे नाम पर मरता और जीता हूं",
    translationUr: "اے اللہ، تیرے نام پر مرتا اور جیتا ہوں",
    source: "Sahih al-Bukhari",
    when: "Just before closing one's eyes to sleep",
    benefit: "Surrenders sleep and waking to Allah",
    tag: "Sahih",
  },
  {
    id: 31,
    name: "Entering Home",
    category: "Home",
    arabic:
      "اَللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلَجِ وَخَيْرَ الْمَخْرَجِ بِسْمِ اللهِ وَلَجْنَا وَبِسْمِ اللهِ خَرَجْنَا وَعَلَى اللهِ رَبِّنَا تَوَكَّلْنَا",
    transliteration:
      "Allahumma inni as'aluka khayral-mawlaji wa khayral-makhraji, bismillahi walajna wa bismillahi kharajna wa alallahi rabbina tawakkalna",
    translation:
      "O Allah, I ask You for goodness in my entry and my departure. In the name of Allah we enter, in the name of Allah we leave, and upon Allah our Lord we rely.",
    translationHi:
      "ऐ अल्लाह, आने-जाने की बेहतरी मांगता हूं — अल्लाह के नाम से आए और गए और उस पर भरोसा",
    translationUr:
      "اے اللہ، آنے جانے کی بھلائی مانگتا ہوں — اللہ کے نام سے آئے گئے اور اسی پر بھروسہ",
    source: "Sunan Abi Dawud",
    when: "Upon entering the home",
    benefit: "Brings peace and blessing into the household",
    tag: "Hasan",
  },
  {
    id: 32,
    name: "Leaving Home",
    category: "Home",
    arabic: "بِسْمِ اللهِ تَوَكَّلْتُ عَلَى اللهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ",
    transliteration:
      "Bismillahi, tawakkaltu alallah, la hawla wa la quwwata illa billah",
    translation:
      "In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.",
    translationHi:
      "अल्लाह के नाम से, अल्लाह पर भरोसा किया, ताक़त और क़ुव्वत सिर्फ़ अल्लाह से है",
    translationUr: "اللہ کے نام سے، اللہ پر بھروسہ کیا، طاقت و قوت صرف اللہ سے",
    source: "Sunan Abi Dawud, Sunan at-Tirmidhi",
    when: "When stepping out of the home",
    benefit: "Guaranteed guidance, sufficiency, and protection on going out",
    tag: "Sahih",
  },
  {
    id: 33,
    name: "Ayatul Kursi",
    category: "Protection",
    arabic:
      "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    translation:
      "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His throne extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
    translationHi:
      "अल्लाह के सिवा कोई पूज्य नहीं, वो जीवित क़ायम है — न ऊंघ आती है न नींद — आयत अल-कुर्सी",
    translationUr:
      "اللہ کے سوا کوئی معبود نہیں، زندہ و قائم ہے — نہ اونگھ نہ نیند — آیت الکرسی",
    source: "Quran 2:255",
    when: "After every obligatory prayer and before sleeping",
    benefit:
      "Greatest verse in the Quran; protects one from Shaytan until dawn",
    tag: "Quran",
  },
  {
    id: 34,
    name: "Dua for Anxiety & Distress",
    category: "General",
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
    transliteration:
      "Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-ajzi wal-kasal, wal-bukhli wal-jubn, wa dhala'id-dayni wa ghalabatir-rijal",
    translation:
      "O Allah, I seek refuge in You from worry and grief, from incapacity and laziness, from miserliness and cowardice, from the burden of debt and from being overpowered by men.",
    translationHi:
      "ऐ अल्लाह, ग़म, दुख, कमज़ोरी, सुस्ती, बुज़दिली, क़र्ज़ और लोगों के ज़ुल्म से पनाह मांगता हूं",
    translationUr:
      "اے اللہ، غم، دکھ، کمزوری، سستی، بزدلی، قرض اور لوگوں کے ظلم سے پناہ مانگتا ہوں",
    source: "Sahih al-Bukhari",
    when: "During times of worry, stress, or anxiety",
    benefit: "Removes grief, anxiety, and debt-related distress",
    tag: "Sahih",
  },
  {
    id: 35,
    name: "Dua for Parents",
    category: "General",
    arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    transliteration: "Rabbir-hamhuma kama rabbayani saghira",
    translation:
      "My Lord, have mercy upon them as they brought me up when I was small.",
    translationHi: "ऐ मेरे रब, उन पर वैसे रहम फ़रमा जैसे उन्होंने मुझे बचपन में पाला",
    translationUr:
      "اے میرے رب، ان پر ویسا رحم فرما جیسے انہوں نے مجھے بچپن میں پالا",
    source: "Quran 17:24",
    when: "After every prayer and whenever remembering one's parents",
    benefit:
      "Fulfills the child's duty and earns mercy for parents in the Hereafter",
    tag: "Quran",
  },
  {
    id: 36,
    name: "Before Traveling",
    category: "Travel",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    transliteration:
      "Subhanal-lathi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila rabbina lamunqalibun",
    translation:
      "Glory be to He who subjected this to us, and we were not capable of that, and indeed to our Lord we will return.",
    translationHi:
      "पाक है वो जिसने इसे हमारे लिए वश में किया — हम इसके लायक़ न थे — हम रब की तरफ़ लौटेंगे",
    translationUr:
      "پاک ہے وہ جس نے اسے مسخر کیا — ہم اس کے قابل نہ تھے — ہم رب کی طرف لوٹیں گے",
    source: "Quran 43:13–14; Sahih Muslim 1342",
    when: "When boarding a vehicle, plane, or beginning any journey",
    benefit:
      "Acknowledges Allah's blessing over transport and reminds of the return to Allah",
    tag: "Quran",
  },
  {
    id: 37,
    name: "Returning from Travel",
    category: "Travel",
    arabic: "آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ",
    transliteration: "Ayibuna ta'ibuna 'abiduna lirabbina hamidun",
    translation: "We return, repent, worship and praise our Lord.",
    translationHi:
      "हम लौटते हैं, तौबा करते हैं, इबादत करते हैं और अपने रब की तारीफ़ करते हैं",
    translationUr:
      "ہم لوٹتے ہیں، توبہ کرتے ہیں، عبادت کرتے ہیں اور اپنے رب کی تعریف کرتے ہیں",
    source: "Sahih Muslim",
    when: "Upon returning home from a journey",
    benefit:
      "Marks return from travel with repentance, worship, and praise of Allah",
    tag: "Sahih",
  },
  {
    id: 38,
    name: "Entering Masjid",
    category: "Masjid",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    transliteration: "Allahumma aftah li abwaba rahmatik",
    translation: "O Allah, open for me the gates of Your mercy.",
    translationHi: "ऐ अल्लाह, मेरे लिए अपनी रहमत के दरवाज़े खोल दे",
    translationUr: "اے اللہ، میرے لیے اپنی رحمت کے دروازے کھول دے",
    source: "Sahih Muslim",
    when: "When entering the masjid, step in with the right foot",
    benefit: "Opens the doors of divine mercy for the visitor of Allah's house",
    tag: "Sahih",
  },
  {
    id: 39,
    name: "Leaving Masjid",
    category: "Masjid",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    transliteration: "Allahumma inni as'aluka min fadlik",
    translation: "O Allah, I ask You from Your bounty.",
    translationHi: "ऐ अल्लाह, मैं तुझसे तेरा फ़ज़्ल माँगता हूं",
    translationUr: "اے اللہ، میں تجھ سے تیرا فضل مانگتا ہوں",
    source: "Sahih Muslim",
    when: "When leaving the masjid, step out with the left foot",
    benefit: "Seeks Allah's provision and bounty after worship",
    tag: "Sahih",
  },
  {
    id: 40,
    name: "When it Rains",
    category: "Weather",
    arabic: "اللَّهُمَّ صَيِّباً نَافِعاً",
    transliteration: "Allahumma sayyiban nafi'an",
    translation: "O Allah, make it a beneficial rain.",
    translationHi: "ऐ अल्लाह, इसे फ़ायदेमंद बारिश बना",
    translationUr: "اے اللہ، اسے فائدہ مند بارش بنا",
    source: "Sahih al-Bukhari",
    when: "When rain begins to fall",
    benefit: "Rain is a mercy; this dua asks for it to be beneficial",
    tag: "Sahih",
  },
  {
    id: 41,
    name: "After Rain",
    category: "Weather",
    arabic: "مُطِرْنَا بِفَضْلِ اللَّهِ وَرَحْمَتِهِ",
    transliteration: "Mutirna bifadlillahi wa rahmatih",
    translation: "We have been given rain by the grace and mercy of Allah.",
    translationHi: "हमें अल्लाह के फ़ज़्ल और रहमत से बारिश मिली",
    translationUr: "ہمیں اللہ کے فضل اور رحمت سے بارش ملی",
    source: "Sahih al-Bukhari",
    when: "After rain has fallen",
    benefit: "Attributes the blessing of rain to Allah, not nature",
    tag: "Sahih",
  },
  {
    id: 42,
    name: "Before Wudu",
    category: "Purification",
    arabic: "بِسْمِ اللَّهِ",
    transliteration: "Bismillah",
    translation: "In the name of Allah.",
    translationHi: "अल्लाह के नाम से — वुज़ू शुरू करते वक़्त पढ़ें",
    translationUr: "اللہ کے نام سے — وضو شروع کرتے وقت پڑھیں",
    source: "Sunan Abi Dawud",
    when: "Before beginning wudu",
    benefit: "Wudu without Bismillah is incomplete in some scholarly opinions",
    tag: "Hasan",
  },
  {
    id: 43,
    name: "After Wudu (Shahada)",
    category: "Purification",
    arabic:
      "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    transliteration:
      "Ash-hadu an la ilaha illallahu wahdahu la sharika lah, wa ash-hadu anna Muhammadan abduhu wa rasuluh",
    translation:
      "I bear witness that there is no god but Allah alone with no partner, and I bear witness that Muhammad is His servant and messenger.",
    translationHi:
      "मैं गवाही देता हूं कि अल्लाह के सिवा कोई पूज्य नहीं और मुहम्मद ﷺ उसके बंदे और रसूल हैं",
    translationUr:
      "میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اس کے بندے اور رسول ہیں",
    source: "Sahih Muslim",
    when: "Immediately after completing wudu",
    benefit:
      "The eight gates of Paradise are opened for whoever says this after wudu",
    tag: "Sahih",
  },
  {
    id: 54,
    name: "After Wudu (Repentance)",
    category: "Purification",
    arabic: "اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ",
    transliteration:
      "Allahumma aj'alni minat-tawwabin wa aj'alni minal-mutatahhirin",
    translation:
      "O Allah, make me among those who repent and purify themselves.",
    translationHi: "ऐ अल्लाह, मुझे तौबा करने वालों और पाक रहने वालों में शामिल कर",
    translationUr:
      "اے اللہ، مجھے توبہ کرنے والوں اور پاک رہنے والوں میں شامل کر",
    source: "Jami at-Tirmidhi",
    when: "After completing wudu",
    benefit:
      "Asks Allah to count you among the blessed who repent often and stay pure",
    tag: "Hasan",
  },
  {
    id: 44,
    name: "Sayyid al-Istighfar",
    category: "General",
    arabic:
      "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    transliteration:
      "Allahumma anta rabbi la ilaha illa ant, khalaqtani wa ana abduk, wa ana ala ahdika wa wa'dika mastata't, a'udhu bika min sharri ma sana't, abu'u laka bini'matika alayya wa abu'u bidhanbi faghfir li fa'innahu la yaghfirudh-dhunuba illa ant",
    translation:
      "O Allah, You are my Lord, there is no god but You. You created me and I am Your servant, and I am faithful to my covenant and promise to You as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for none forgives sins but You.",
    translationHi:
      "ऐ अल्लाह, तू मेरा रब है, तेरे सिवा कोई पूज्य नहीं — सय्यिद उल-इस्तिग़फ़ार",
    translationUr:
      "اے اللہ، تو میرا رب ہے، تیرے سوا کوئی معبود نہیں — سید الاستغفار",
    source: "Sahih al-Bukhari",
    when: "In the morning and evening; whoever says it with conviction and dies that day enters Paradise",
    benefit:
      "The master of forgiveness; sins erased if said sincerely morning or evening",
    tag: "Sahih",
  },
  {
    id: 45,
    name: "Dua for Mirror",
    category: "General",
    arabic: "اللَّهُمَّ أَنْتَ حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي",
    transliteration: "Allahumma anta hassanta khalqi fahassin khuluqi",
    translation:
      "O Allah, just as You made my appearance beautiful, make my character beautiful too.",
    translationHi: "ऐ अल्लाह, जैसी तूने मेरी शक्ल बनाई, वैसा ही मेरा अख़लाक़ भी बना दे",
    translationUr:
      "اے اللہ، جیسی تو نے میری شکل بنائی، ویسے میرے اخلاق بھی اچھے بنا",
    source: "Musnad Ahmad",
    when: "When looking in a mirror",
    benefit: "Reminds one that true beauty is in character, not appearance",
    tag: "Hasan",
  },
  {
    id: 46,
    name: "Visiting the Sick",
    category: "Health & Sickness",
    arabic: "لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ",
    transliteration: "La ba'sa tahurun insha'Allah",
    translation: "Do not worry, it will be a purification, Allah willing.",
    translationHi: "कोई बात नहीं, यह पाकी का ज़रिया है इंशाअल्लाह",
    translationUr: "کوئی بات نہیں، یہ پاکی کا ذریعہ ہے ان شاء اللہ",
    source: "Sahih al-Bukhari",
    when: "When visiting someone who is ill — say this to the patient",
    benefit: "Comforts the sick and reminds them that illness is an expiation",
    tag: "Sahih",
  },
  {
    id: 47,
    name: "Dua for the Sick",
    category: "Health & Sickness",
    arabic:
      "اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ اشْفِهِ وَأَنْتَ الشَّافِي لَا شِفَاءَ إِلَّا شِفَاؤُكَ شِفَاءً لَا يُغَادِرُ سَقَمًا",
    transliteration:
      "Allahumma rabban-nas, adhhibil-ba's, ishfihi wa antas-shafi, la shifa'a illa shifa'uka shifa'an la yughadiru saqama",
    translation:
      "O Allah, Lord of mankind, remove the affliction and cure him, for You are the Healer. There is no cure except Your cure, a cure that leaves no illness behind.",
    translationHi:
      "ऐ अल्लाह, लोगों के रब, तकलीफ़ दूर कर, शिफ़ा दे — तू ही असली शिफ़ा देने वाला है",
    translationUr:
      "اے اللہ، لوگوں کے رب، تکلیف دور کر، شفا دے — تو ہی حقیقی شفا دینے والا ہے",
    source: "Sahih al-Bukhari, Sahih Muslim",
    when: "When placing your hand on the forehead of someone who is sick",
    benefit:
      "Supplicates the Lord of all people for complete and lasting recovery",
    tag: "Sahih",
  },
  {
    id: 48,
    name: "Dua for Righteous Children",
    category: "Family & Children",
    arabic: "رَبِّ هَبْ لِي مِنَ الصَّالِحِينَ",
    transliteration: "Rabbi hab li minas-salihin",
    translation: "My Lord, grant me a child from the righteous.",
    translationHi: "ऐ मेरे रब, मुझे नेक और सालिह औलाद दे",
    translationUr: "اے میرے رب، مجھے نیک اور صالح اولاد عطا فرما",
    source: "Quran 37:100",
    when: "When hoping for a righteous child or family member",
    benefit:
      "Dua of Prophet Ibrahim; righteous children are the greatest legacy",
    tag: "Quran",
  },
  {
    id: 49,
    name: "Dua for Family",
    category: "Family & Children",
    arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    transliteration:
      "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqina imama",
    translation:
      "Our Lord, grant us from our spouses and offspring comfort to our eyes and make us leaders of the righteous.",
    translationHi:
      "ऐ हमारे रब, हमें बीवी-बच्चों से आंखों की ठंडक दे और हमें मुत्तक़ीन का इमाम बना",
    translationUr:
      "اے ہمارے رب، ہمیں بیوی بچوں سے آنکھوں کی ٹھنڈک دے اور متقین کا امام بنا",
    source: "Quran 25:74",
    when: "Daily; especially for those seeking harmony in family life",
    benefit:
      "Asks for joy through family and the honour of being an imam of the righteous",
    tag: "Quran",
  },
  {
    id: 50,
    name: "Dua for Barakah in Rizq",
    category: "Rizq & Barakah",
    arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Allahumma barik lana fima razaqtana wa qina adhaban-nar",
    translation:
      "O Allah, bless us in what You have provided us and protect us from the punishment of the Fire.",
    translationHi: "ऐ अल्लाह, जो रिज़्क़ दिया उसमें बरकत दे और हमें जहन्नम से बचा",
    translationUr: "اے اللہ، جو رزق دیا اس میں برکت دے اور جہنم سے بچا",
    source: "Sunan Abi Dawud; Ibn Majah",
    note: "Often recited after meals",
    when: "After a meal or when grateful for one's provision",
    benefit:
      "Calls for barakah in sustenance and protection from the Fire in one dua",
    tag: "Hasan",
  },
  {
    id: 51,
    name: "Dua for Debt Relief",
    category: "Rizq & Barakah",
    arabic: "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
    transliteration:
      "Allahumma-kfini bihalalika 'an haramika wa aghnini bifadlika 'amman siwak",
    translation:
      "O Allah, suffice me with what You have made lawful against what You have made unlawful, and enrich me with Your bounty above all others.",
    translationHi:
      "ऐ अल्लाह, हलाल के ज़रिये हराम से बेनियाज़ कर और अपने फ़ज़्ल से सबसे बेनियाज़ कर",
    translationUr:
      "اے اللہ، حلال کے ذریعے حرام سے بے نیاز کر اور فضل سے سب سے بے نیاز کر",
    source: "Sunan at-Tirmidhi",
    when: "When burdened by debt or financial hardship",
    benefit: "Seeks halal sufficiency and independence from all except Allah",
    tag: "Hasan",
  },
  {
    id: 52,
    name: "Dua for Knowledge",
    category: "Knowledge & Wisdom",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    transliteration: "Rabbi zidni ilma",
    translation: "My Lord, increase me in knowledge.",
    translationHi: "ऐ मेरे रब, मुझे इल्म में बढ़ा",
    translationUr: "اے میرے رب، مجھے علم میں بڑھا",
    source: "Quran 20:114",
    when: "Before studying, reading, or seeking knowledge",
    benefit:
      "Simple yet profound; the only thing Allah commanded the Prophet to ask more of",
    tag: "Quran",
  },
  {
    id: 53,
    name: "Dua Before Studying",
    category: "Knowledge & Wisdom",
    arabic: "اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي وَعَلِّمْنِي مَا يَنْفَعُنِي وَزِدْنِي عِلْمًا",
    transliteration:
      "Allahumma infa'ni bima allamtani wa allimni ma yanfa'uni wa zidni ilma",
    translation:
      "O Allah, benefit me with what You have taught me, teach me what will benefit me, and increase me in knowledge.",
    translationHi:
      "ऐ अल्लाह, जो इल्म दिया उससे फ़ायदा दे, जो मुफ़ीद हो वो सिखा और इल्म बढ़ा",
    translationUr:
      "اے اللہ، جو علم دیا اس سے فائدہ دے، فائدہ مند علم سکھا اور علم بڑھا",
    source: "Sunan at-Tirmidhi (Hasan/Weak – commonly used)",
    when: "Before studying, attending a class, or opening a book",
    benefit: "Asks for knowledge that is both beneficial and acted upon",
    tag: "Weak",
  },
  {
    id: 60,
    name: "3 Quls (Morning/Evening)",
    category: "Protection",
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    transliteration:
      "Qul huwallahu ahad, Qul a'udhu birabbil-falaq, Qul a'udhu birabbin-nas",
    translation:
      "Say: He is Allah, the One (Surah Ikhlas); Say: I seek refuge with the Lord of the daybreak (Surah Falaq); Say: I seek refuge with the Lord of mankind (Surah Nas)",
    translationHi: "कहो: वह अल्लाह एक है... (सूरह इख्लास, फलक, नास)",
    translationUr: "کہو: وہ اللہ ایک ہے... (سورہ اخلاص، فلق، ناس)",
    source: "Sunan Abi Dawud (Sahih)",
    when: "Morning and evening, 3 times each",
    benefit: "Complete protection from all harm throughout the day and night",
    tag: "Sahih",
  },
  {
    id: 61,
    name: "Protection at Night",
    category: "Protection",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A'udhu bikalimatillahit-tammati min sharri ma khalaq",
    translation:
      "I seek refuge in the perfect words of Allah from the evil of what He created",
    translationHi: "मैं अल्लाह के संपूर्ण शब्दों में उसकी सृष्टि की बुराई से पनाह मांगता हूँ",
    translationUr:
      "میں اللہ کے کامل کلمات کی پناہ مانگتا ہوں ہر اس چیز کی برائی سے جو اس نے پیدا کی",
    source: "Sahih Muslim",
    when: "When stopping at a place, before sleeping, or when feeling afraid",
    benefit:
      "Protection from evil, harmful creatures, and all that Allah has created",
    tag: "Sahih",
  },
  {
    id: 62,
    name: "Dua for Anxiety",
    category: "Stress & Anxiety",
    arabic:
      "اللَّهُمَّ إِنِّي عَبْدُكَ ابْنُ عَبْدِكَ ابْنُ أَمَتِكَ نَاصِيَتِي بِيَدِكَ مَاضٍ فِيَّ حُكْمُكَ عَدْلٌ فِيَّ قَضَاؤُكَ أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ سَمَّيْتَ بِهِ نَفْسَكَ أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ أَوْ عَلَّمْتَهُ أَحَدًا مِنْ خَلْقِكَ أَوِ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ أَنْ تَجْعَلَ الْقُرْآنَ رَبِيعَ قَلْبِي وَنُورَ صَدْرِي وَجِلَاءَ حُزْنِي وَذَهَابَ هَمِّي",
    transliteration:
      "Allahumma inni abduka ibn abdika ibn amatika nasiyati biyadika madin fiyya hukmuka adlun fiyya qada'uka as'aluka bikulli ismin huwa laka sammayta bihi nafsaka aw anzaltahu fi kitabika aw allamtahu ahadan min khalqika aw ista'tharta bihi fi ilmil-ghaybi indaka an taj'alal-Qur'ana rabi'a qalbi wa nura sadri wa jila'a huzni wa dhahaba hammi",
    translation:
      "O Allah, I am Your servant, son of Your servant, son of Your maidservant. My forelock is in Your hand, Your command over me is forever executed, Your decree over me is just. I ask You by every name belonging to You which You named Yourself with, or revealed in Your Book, or taught to any of Your creation, or have preserved in the knowledge of the unseen with You, that You make the Quran the life of my heart and the light of my breast, and a departure for my sorrow and a release for my anxiety.",
    translationHi:
      "हे अल्लाह, मैं तेरा बंदा हूँ, तेरे बंदे का बेटा हूँ... क़ुरआन को मेरे दिल की बहार बना दे और मेरी उदासी को दूर कर दे",
    translationUr:
      "اے اللہ، میں تیرا بندہ ہوں، تیرے بندے کا بیٹا ہوں... قرآن کو میرے دل کی بہار بنا دے اور میری پریشانی دور فرما",
    source: "Musnad Ahmad (Hasan)",
    when: "When feeling overwhelmed, anxious, sad, or distressed",
    benefit:
      "Removes grief and anxiety; Allah replaces sorrow with joy and ease",
    tag: "Hasan",
  },
  {
    id: 63,
    name: "Ease Hardship",
    category: "Stress & Anxiety",
    arabic: "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا",
    transliteration:
      "Allahumma la sahla illa ma ja'altahu sahla, wa anta taj'alul hazna idha shi'ta sahla",
    translation:
      "O Allah, nothing is easy except what You make easy, and You make the difficult easy if You wish",
    translationHi:
      "हे अल्लाह, कोई चीज़ आसान नहीं सिवाय उसके जो तू आसान कर दे, और तू जब चाहे मुश्किल को आसान बना देता है",
    translationUr:
      "اے اللہ، کوئی چیز آسان نہیں مگر جسے تو آسان بنا دے، اور تو جب چاہے مشکل کو آسان کر دیتا ہے",
    source: "Ibn Hibban (Hasan)",
    when: "When facing a difficult situation, before a challenge, or when feeling stuck",
    benefit: "Allah eases difficulties and makes hardships manageable",
    tag: "Hasan",
  },
  {
    id: 64,
    name: "Short Istighfar",
    category: "Forgiveness",
    arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
    transliteration: "Astaghfirullah wa atubu ilayh",
    translation: "I seek forgiveness from Allah and repent to Him",
    translationHi: "मैं अल्लाह से माफी मांगता हूँ और उसकी तरफ तौबा करता हूँ",
    translationUr: "میں اللہ سے مغفرت مانگتا ہوں اور اس کی طرف توبہ کرتا ہوں",
    source: "Sahih al-Bukhari",
    when: "Any time, especially after sins, morning and evening",
    benefit: "Erases sins; the Prophet ﷺ recited this 100 times daily",
    tag: "Sahih",
  },
  {
    id: 65,
    name: "After Eating (Full Dua)",
    category: "Food",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    transliteration:
      "Alhamdu lillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah",
    translation:
      "All praise is for Allah who fed me this and provided it for me without any might or power on my part",
    translationHi:
      "तमाम तारीफें उस अल्लाह के लिए जिसने मुझे यह खाना खिलाया और मुझे यह रिज्क दिया बिना मेरी किसी ताकत या कोशिश के",
    translationUr:
      "تمام تعریف اس اللہ کے لیے جس نے مجھے یہ کھانا کھلایا اور میری کسی طاقت اور کوشش کے بغیر مجھے یہ رزق عطا فرمایا",
    source: "Sunan at-Tirmidhi (Sahih)",
    when: "After finishing a meal",
    benefit: "All past sins forgiven upon reciting this dua after eating",
    tag: "Sahih",
  },
];
