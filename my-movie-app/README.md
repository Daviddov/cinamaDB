# 🎬 CinemaDB - אפליקציית גילוי סרטים

![CinemaDB Logo](https://via.placeholder.com/800x400/1a1a1a/FFD700?text=CinemaDB+🎬)

## 📖 תיאור הפרויקט

CinemaDB היא אפליקציית ווב מודרנית לגילוי סרטים, הבנויה עם React ו-Framer Motion. האפליקציה מאפשרת למשתמשים לחפש סרטים, לצפות בפרטים מלאים, לנהל רשימת מועדפים ולגלות סרטים חדשים ומעניינים.

## ✨ תכונות עיקריות

### 🔍 חיפוש מתקדם
- חיפוש סרטים לפי שם, תיאור או שחקנים
- סינון לפי ז'אנרים שונים
- הצגת סרטים פופולריים וטרנדיים
- טעינה חלקה של תוצאות נוספות (Infinite Scroll)

### 📱 עיצוב רספונסיבי
- תמיכה מלאה במכשירים ניידים וטאבלטים
- מעברים חלקים ואנימציות מתקדמות
- מצב בהיר וכהה (Light/Dark Theme)
- עיצוב מודרני עם גרדיאנטים זהובים

### ❤️ ניהול מועדפים
- הוספת והסרת סרטים מרשימת המועדפים
- שמירה מקומית ב-LocalStorage
- דף מועדפים נפרד עם אפשרויות ניהול

### 🎭 פרטי סרטים מלאים
- מידע מפורט על כל סרט
- רשימת שחקנים וצוות
- דירוגים וביקורות
- פרטים כספיים (תקציב והכנסות)
- קישורים לאתרים רשמיים

### 🎥 גלריית וידאו
- צפייה בטריילרים מ-YouTube
- סרטונים נוספים (Teasers, Behind the Scenes)
- נגן וידאו מוטמע עם בקרות מלאות

## 🛠️ טכנולוגיות

### Frontend
- **React 18** - ספרית UI מודרנית
- **React Router** - ניווט ונתיבים
- **Framer Motion** - אנימציות מתקדמות
- **Axios** - בקשות HTTP
- **Lucide React** - אייקונים מודרניים

### APIs
- **TMDB API** - מאגר הסרטים הגדול בעולם
- **YouTube API** - הטמעת סרטונים

### Styling
- **CSS Custom Properties** - משתנים דינמיים
- **CSS Grid & Flexbox** - פריסה מתקדמת
- **Google Fonts** - פונט Heebo לעברית

## 🚀 התקנה והרצה

### דרישות מוקדמות
```bash
Node.js >= 16.0.0
npm >= 8.0.0
```

### שלבי התקנה

1. **שכפול הפרויקט**
```bash
git clone https://github.com/your-username/cinema-db.git
cd cinema-db
```

2. **התקנת Dependencies**
```bash
npm install
```

3. **הגדרת משתני סביבה**
```bash
# צור קובץ .env בתיקיית הבסיס
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
```

4. **הרצת הפרויקט**
```bash
npm run dev
```

האפליקציה תיפתח בכתובת: `http://localhost:5173`

### קבלת API Key מ-TMDB

1. בקר באתר [TMDB](https://www.themoviedb.org/)
2. צור חשבון חדש או התחבר לחשבון קיים
3. עבור להגדרות API בפרופיל שלך
4. בקש API Key חדש
5. העתק את המפתח לקובץ `.env`

## 📁 מבנה הפרויקט

```
src/
├── components/           # רכיבים משותפים
│   ├── Header.jsx       # כותרת עליונה וניווט
│   ├── movies/          # רכיבים הקשורים לסרטים
│   │   ├── MovieCard.jsx      # כרטיס סרט בודד
│   │   ├── GenreFilter.jsx    # סינון לפי ז'אנרים
│   │   ├── TrailerModal.jsx   # מודאל טריילר
│   │   └── TrailerGallery.jsx # גלריית סרטונים
│   └── ui/              # רכיבי UI בסיסיים
│       └── Toast.jsx    # הודעות למשתמש
├── pages/               # דפי האפליקציה
│   ├── HomePage.jsx     # עמוד ראשי
│   ├── MoviesPage.jsx   # דף חיפוש והצגת סרטים
│   ├── MovieDetailPage.jsx  # דף פרטי סרט
│   └── FavoritesPage.jsx    # דף מועדפים
├── services/            # שירותי API
│   └── tmdbApi.js      # חיבור ל-TMDB API
├── hooks/               # React Hooks מותאמים
│   └── useMovies.js    # ניהול state של סרטים
├── contexts/            # React Contexts
│   └── ModalContext.jsx # ניהול מודאלים
├── App.jsx             # רכיב הבסיס
├── main.jsx           # נקודת הכניסה
└── index.css          # סגנונות גלובליים
```

## 🎨 תכונות עיצוב

### ערכת צבעים
- **זהב ראשי**: `#FFD700`
- **זהב משני**: `#FFA500`
- **אקסנט**: `#FF6B35`
- **רקע כהה**: `#0A0A0A`
- **משטח**: `#1A1A1A`

### אנימציות
- מעברים חלקים בין דפים
- אפקטי Hover מתקדמים
- טעינה מדורגת של רשימות
- אנימציות Skeleton לזמן טעינה

### רספונסיביות
- נקודות שבירה: 768px, 1024px, 1200px
- Grid דינמי המתאים למסך
- תפריט נייד ידידותי
- טקסט ותמונות מותאמים

## 🔧 סקריפטים זמינים

```bash
npm run dev          # הרצה במצב פיתוח
npm run build        # בניית גרסת ייצור
npm run preview      # צפייה בגרסת ייצור
npm run lint         # בדיקת קוד
```

## 📱 תמיכה בדפדפנים

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Internet Explorer - לא נתמך

## 🌟 תכונות מתקדמות

### Performance
- **Code Splitting** - טעינה עצלה של קומפוננטים
- **Image Optimization** - דחיסה וגדלים מותאמים
- **API Caching** - שמירה זמנית של תוצאות
- **Debounced Search** - חיפוש אופטימלי

### Accessibility
- **ARIA Labels** - תמיכה בקוראי מסך
- **Keyboard Navigation** - ניווט מלא במקלדת
- **High Contrast** - ניגודיות גבוהה
- **RTL Support** - תמיכה מלאה בעברית

