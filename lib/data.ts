export interface Movie {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  year: number;
  duration: string;
  genre: string[];
  rating: string;
  image: string;
  heroImage?: string;
  category: string;
  tags?: string[];
  emoji?: string;
  videoUrl?: string;
}

export interface Row {
  id: string;
  title: string;
  emoji?: string;
  movies: Movie[];
}

const PEXELS_ROMANTIC = [
  'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1415131/pexels-photo-1415131.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1024975/pexels-photo-1024975.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1024984/pexels-photo-1024984.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/346804/pexels-photo-346804.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2526105/pexels-photo-2526105.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1024967/pexels-photo-1024967.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1805053/pexels-photo-1805053.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3408745/pexels-photo-3408745.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1576937/pexels-photo-1576937.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1024975/pexels-photo-1024975.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2253881/pexels-photo-2253881.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2253880/pexels-photo-2253880.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1415131/pexels-photo-1415131.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1576937/pexels-photo-1576937.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compress&cs=tinysrgb&w=600',
];

const img = (i: number) => PEXELS_ROMANTIC[i % PEXELS_ROMANTIC.length];

export const HERO_IMAGE = 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1920';

export const ALL_MOVIES: Movie[] = [
  // Row 1 - Continue Watching
  { id: 'first-date', title: 'First Date', description: 'The night that started everything. You wore that smile that made time stand still. An evening neither of us will ever forget — the nervousness, the laughter, the magic.', year: 2022, duration: '1h 45m', genre: ['Romance', 'Drama'], rating: '10/10', image: img(0), category: 'continue-watching', emoji: '🌹' },
  { id: 'goa-trip', title: 'Rishikesh Trip', description: 'Sun, sand, and your laughter echoing across the shore. The trip that made us realize we could be anywhere in the world as long as we were together.', year: 2026, duration: '2h 10m', genre: ['Adventure', 'Romance'], rating: '10/10', image: img(1), category: 'continue-watching', emoji: '🏔' },
  { id: 'late-night-calls', title: 'Late Night Calls', description: 'Those 3AM conversations where we solved the world\'s problems and discovered each other\'s deepest thoughts. Time zones didn\'t matter. Sleep didn\'t matter. Only you.', year: 2025, duration: '∞', genre: ['Romance', 'Comedy'], rating: '10/10', image: img(2), category: 'continue-watching', emoji: '🌙' },
  { id: 'random-laughs', title: 'Our Random Laughs', description: 'A compilation of every time we laughed until we couldn\'t breathe. Warning: May cause uncontrollable happiness, stomach pain from laughing, and an overwhelming desire to repeat everything.', year: 2026, duration: '3h 22m', genre: ['Comedy', 'Documentary'], rating: '10/10', image: img(3), category: 'continue-watching', emoji: '😂' },
  { id: 'our-fights', title: 'Our Fights 😂', description: 'A dramatic retelling of every argument that lasted approximately 15 minutes before one of us started laughing. Spoiler: Nobody won. Love always did.', year: 2024, duration: '18m', genre: ['Comedy', 'Drama'], rating: '10/10', image: img(4), category: 'continue-watching', emoji: '😤' },
  { id: 'birthday-surprise', title: 'Girlfriends Day Surprise', description: 'The moment crafted with love and nerves and a lot of planning. This is that moment — your day — a memory being made right now, just for you.', year: 2026, duration: '1h 0m', genre: ['Romance', 'Special'], rating: '∞', image: img(5), category: 'continue-watching', emoji: '🎂' },

  // Row 2 - Because You Exist
  { id: 'day-we-met', title: 'The Day We Met', description: 'Chapter one of the greatest story ever written. The universe conspired, schedules aligned, and somehow we ended up in the same place at the right moment. A masterpiece of coincidence.', year: 2024, duration: '2h 5m', genre: ['Romance', 'Drama'], rating: '10/10', image: img(6), category: 'because-you-exist', emoji: '✨' },
  { id: 'smile-wins', title: 'The Smile That Wins', description: 'A documentary about the one smile that has the power to fix any bad day, silence any argument, and remind me exactly why I am the luckiest person alive.', year: 2026, duration: '1h 30m', genre: ['Documentary', 'Romance'], rating: '10/10', image: img(7), category: 'because-you-exist', emoji: '😊' },
  { id: 'cute-habits', title: 'Your Cute Habits', description: 'The way you hum while reading. The way you overthink texts. The way you eat the last bite and then feel guilty. Every weird, wonderful, adorable habit that makes you irreplacably you.', year: 2025, duration: '1h 55m', genre: ['Documentary', 'Comedy'], rating: '10/10', image: img(8), category: 'because-you-exist', emoji: '🐱' },
  { id: 'favorite-memories', title: 'Favorite Memories', description: 'A carefully curated collection of moments that I replay in my mind constantly. These are the memories that make my heart full and my smile impossible to hide.', year: 2026, duration: '2h 40m', genre: ['Drama', 'Romance'], rating: '10/10', image: img(9), category: 'because-you-exist', emoji: '💝' },
  { id: 'moments-ill-never-forget', title: "Moments I'll Never Forget", description: 'Some memories are so perfect they feel like dreams. This is a tribute to every moment that lodged itself permanently into my heart — and refused to leave.', year: 2026, duration: '3h 15m', genre: ['Drama', 'Romance'], rating: '10/10', image: img(10), category: 'because-you-exist', emoji: '💫' },

  // Row 3 - Top Picks
  { id: 'reasons-i-love-you', title: 'Reasons I Love You', description: 'A list that started with ten reasons. Then became fifty. Then a hundred. And kept growing because with every passing day, you give me more reasons than I could ever count.', year: 2024, duration: '100 episodes', genre: ['Romance', 'Special'], rating: '10/10', image: img(11), category: 'top-picks', emoji: '❤️' },
  { id: 'hidden-voice-notes', title: 'Hidden Voice Notes', description: 'The voice notes I recorded when I was missing you too much and couldn\'t find the right words to text. Press play. Listen. Feel.', year: 2025, duration: '45m', genre: ['Romance', 'Personal'], rating: '10/10', image: img(12), category: 'top-picks', emoji: '🎙️' },
  { id: 'cute-videos', title: 'Cute Videos', description: 'Every video that made me go "I need to show her this" — a collection of things that made me think of you, feel happy because of you, or smile because you exist.', year: 2026, duration: '2h 0m', genre: ['Comedy', 'Heartwarming'], rating: '10/10', image: img(13), category: 'top-picks', emoji: '🎬' },
  { id: 'favorite-photos', title: 'Favorite Photos', description: 'A gallery of my absolute favorites. The candid ones. The silly ones. The ones you didn\'t know I took. The ones where you weren\'t looking but you were still the most beautiful thing in the frame.', year: 2025, duration: '1h 30m', genre: ['Documentary', 'Visual'], rating: '10/10', image: img(14), category: 'top-picks', emoji: '📸' },
  { id: 'letters', title: 'Letters', description: 'Words I wrote at midnight when feelings were too big to keep inside. Letters I may never have sent, but every word is real and every sentence is you.', year: 2026, duration: '∞', genre: ['Drama', 'Romance'], rating: '10/10', image: img(15), category: 'top-picks', emoji: '💌' },

  // Row 4 - Comedy Specials
  { id: 'weird-faces', title: 'Your Weird Faces', description: 'An award-winning collection of expressions that should absolutely be illegal but are somehow the most endearing thing I\'ve ever witnessed. Oscars coming soon.', year: 2025, duration: '1h 10m', genre: ['Comedy', 'Documentary'], rating: '10/10', image: img(16), category: 'comedy', emoji: '😜' },
  { id: 'embarrassing-moments', title: 'My Embarrassing Moments', description: 'A raw, unfiltered look at every time I tried to be smooth and spectacularly failed. Watched exclusively by you, who somehow still chose me anyway. Incredible.', year: 2024, duration: '2h 5m', genre: ['Comedy', 'Reality'], rating: '10/10', image: img(17), category: 'comedy', emoji: '🤦' },
  { id: 'funny-videos', title: 'Funny Videos', description: 'The ones that made you snort-laugh. The ones that made you send "I\'m deceased 💀". An unfiltered celebration of the joy we share in the smallest, silliest things.', year: 2025, duration: '3h 0m', genre: ['Comedy', 'Compilation'], rating: '10/10', image: img(18), category: 'comedy', emoji: '🤣' },
  { id: 'blooper-reel', title: 'Blooper Reel', description: 'Every plan that went sideways. Every attempt at being romantic that turned into chaos. Every perfect disaster we somehow made into a perfect memory.', year: 2026, duration: '1h 45m', genre: ['Comedy', 'Behind-the-Scenes'], rating: '10/10', image: img(19), category: 'comedy', emoji: '🎬' },
  { id: 'unexpected-laughs', title: 'Unexpected Laughs', description: 'The kind of laughter that comes out of nowhere and takes over completely — in serious moments, quiet moments, random moments. The laughter I never want to lose.', year: 2024, duration: '2h 20m', genre: ['Comedy', 'Romance'], rating: '10/10', image: img(20), category: 'comedy', emoji: '😹' },

  // Row 5 - Coming Soon
  { id: 'future-trips', title: 'Future Trips', description: 'Pre-production has begun. Locations scouted. Tickets not yet booked. Dreams: abundant. This episode is still being written — by us, together, one adventure at a time.', year: 2025, duration: 'TBD', genre: ['Adventure', 'Coming Soon'], rating: 'N/A', image: img(21), category: 'coming-soon', emoji: '✈️' },
  { id: 'dream-house', title: 'Dream House', description: 'Coming soon to a neighborhood near us. Featuring: morning coffee on our balcony, cooking disasters, weekend laziness, and the warmth of a home built with love.', year: 2025, duration: 'TBD', genre: ['Drama', 'Coming Soon'], rating: 'N/A', image: img(22), category: 'coming-soon', emoji: '🏠' },
  { id: 'wedding-trailer', title: 'Wedding Trailer 😂', description: 'Very early development. Script is still being written. One thing is certain: the lead actress is breathtaking, and the groom will definitely cry. A lot.', year: 2026, duration: 'TBD', genre: ['Romance', 'Coming Soon'], rating: '∞', image: img(23), category: 'coming-soon', emoji: '💍' },
  { id: 'growing-old-together', title: 'Growing Old Together', description: 'A multi-decade saga. Episode count: infinite. Genre: everything. The story where we sit on a porch at 80, still laughing at the same stupid things, still choosing each other.', year: 2024, duration: 'A Lifetime', genre: ['Drama', 'Romance', 'Comedy'], rating: '∞', image: img(24), category: 'coming-soon', emoji: '👵🧓' },
  { id: 'forever', title: 'Forever', description: 'The final episode of a series that never truly ends. Beyond seasons and time and every limit ever imagined. This one plays on repeat, endlessly, and I would not change a single frame.', year: 9999, duration: '∞', genre: ['Romance', 'Eternal'], rating: '∞', image: img(25), category: 'coming-soon', emoji: '♾️' },
];

export const MOVIE_ROWS: Row[] = [
  { id: 'continue-watching', title: 'Continue Watching', emoji: '▶️', movies: ALL_MOVIES.filter(m => m.category === 'continue-watching') },
  { id: 'because-you-exist', title: 'Because You Exist', emoji: '❤️', movies: ALL_MOVIES.filter(m => m.category === 'because-you-exist') },
  { id: 'top-picks', title: 'Top Picks For You', emoji: '⭐', movies: ALL_MOVIES.filter(m => m.category === 'top-picks') },
  { id: 'comedy', title: 'Comedy Specials', emoji: '😂', movies: ALL_MOVIES.filter(m => m.category === 'comedy') },
  { id: 'coming-soon', title: 'Coming Soon', emoji: '🔜', movies: ALL_MOVIES.filter(m => m.category === 'coming-soon') },
];

export const REASONS_I_LOVE_YOU = [
  "Your smile can fix literally any bad day I'm having.",
  "The way you laugh — especially when something surprises you.",
  "How passionately you care about the things you love.",
  "You make even ordinary days feel special.",
  "The way you overthink everything but it's always because you care.",
  "Your eyes — they tell stories before you even speak.",
  "How you can make any room feel warmer just by being in it.",
  "The way you remember small details that matter to me.",
  "You're stronger than you think, and braver than you know.",
  "How kind you are — to everyone, always.",
  "The way you say my name.",
  "Your weird, wonderful, completely unique sense of humor.",
  "How beautiful you look when you're concentrating.",
  "The way you scrunch your nose when something's confusing.",
  "How fiercely you love the people close to you.",
  "You make me want to be a better person every single day.",
  "The way we can talk for hours and it still feels too short.",
  "How you find magic in small, everyday things.",
  "Your voice — it's the most comforting sound I know.",
  "The way you comfort people when they're hurting.",
  "How you look when you're excited about something.",
  "The random things that make you happy.",
  "How creative you are, even when you don't realize it.",
  "The way you care about the world.",
  "Your strength when things get hard.",
  "How perfectly imperfect you are.",
  "The way time feels different when I'm with you.",
  "How you make me feel understood without having to explain myself.",
  "The tiny habits that are completely, uniquely you.",
  "How you can be so soft and so strong at the same time.",
  "The way you handle things that would break most people.",
  "How your presence changes everything.",
  "The warmth you carry with you everywhere.",
  "How you listen — really listen.",
  "The way you dream, and how big those dreams are.",
  "How honest you are, even when it's hard.",
  "The way you make ordinary moments extraordinary.",
  "How you make every place feel like home.",
  "The light that lives in your eyes.",
  "How completely you changed my definition of beautiful.",
  "The way you trust me.",
  "How you never give up on the things that matter.",
  "The way you make me feel like I'm the luckiest person alive.",
  "How you carry kindness like it's second nature.",
  "The way you've shown me what real love feels like.",
  "How you find humor in hard moments.",
  "The way you hold on.",
  "How you see the good in people, including me.",
  "The way the world makes more sense when you're in it.",
  "How you exist, perfectly, in this universe — mine.",
  "The sound of your laugh echoing in my memory.",
  "How you remind me to slow down and notice things.",
  "The way your mind works — brilliant and surprising.",
  "How you show up, every time, for the people you love.",
  "The feeling of home I get when I'm near you.",
  "How you've become the best part of every story I tell.",
  "The way you turn my worries into nothing.",
  "How your voice calms me when nothing else can.",
  "The way you've made my ordinary life feel like a movie.",
  "How you handle my worst days with patience.",
  "The way you've changed what I think happiness means.",
  "How you remember things I thought I'd forgotten.",
  "The safety I feel in your presence.",
  "How brave you are, even when you're scared.",
  "The way you make hard things easier.",
  "How beautifully you love.",
  "The fact that you exist — the greatest miracle of all.",
  "How completely and totally yourself you are.",
  "The way you've become my favorite thought.",
  "How nothing feels right without you.",
  "The way you showed me I was worth loving.",
  "How looking at you still feels like the first time.",
  "The peace you bring into my life.",
  "How everything is better with you in it.",
  "The way you've woven yourself into every good thing in my life.",
  "How you make me feel chosen, every single day.",
  "The way you've redefined what I thought was possible.",
  "How you make me believe in all the good things.",
  "The way your happiness becomes my happiness.",
  "How effortlessly you fill every silence.",
  "The wonder I feel every time I think about how we met.",
  "How you've never let me feel alone.",
  "The way your kindness ripples outward and touches everyone.",
  "How the universe clearly knew what it was doing when it brought us together.",
  "The way you give without expecting anything back.",
  "How unbelievably gorgeous you are — inside and out.",
  "The way you've changed my world just by being in it.",
  "How every day with you is one I want to remember.",
  "The way you fight for what you believe in.",
  "How your heart is the most beautiful place I've ever been.",
  "The way you've made love feel effortless.",
  "How you've become the answer to every question.",
  "The way I fall more in love with you every single day.",
  "How you make every ordinary moment worth keeping forever.",
  "The fact that no list will ever be long enough.",
  "How you are, simply and completely, my favorite person.",
  "The way you make my whole world make sense.",
  "How I can't imagine a single day without you in it.",
  "The way this entire website — this whole love story — is and will always be about you.",
  "How you are, and will always be, everything.",
];

export const ACHIEVEMENTS = [
  { id: 'stole-heart', icon: '🏆', title: 'Stole My Heart', description: 'Unlocked the moment you smiled at me for the first time.', rarity: 'Legendary', movieId: 'day-we-met' },
  { id: 'cutest-human', icon: '🏆', title: "World's Cutest Human", description: 'Achieved by simply existing and being completely irresistible.', rarity: 'Legendary', movieId: 'cute-habits' },
  { id: 'drama-queen', icon: '🏆', title: 'Professional Drama Queen', description: 'For every overreaction that somehow made the story better. 😂', rarity: 'Rare', movieId: 'our-fights' },
  { id: 'sleep-champion', icon: '🏆', title: 'Sleep Champion', description: 'Can fall asleep anywhere, anytime, in any position. Olympic level.', rarity: 'Epic', movieId: 'late-night-calls' },
  { id: 'foodie-queen', icon: '🏆', title: 'Foodie Queen', description: 'Extensive menu knowledge. Strong opinions on what we\'re ordering. Always right.', rarity: 'Rare', movieId: 'random-laughs' },
  { id: 'adventure-partner', icon: '🏆', title: 'Adventure Partner', description: 'For every trip, every road taken, every spontaneous decision that became a perfect memory.', rarity: 'Epic', movieId: 'goa-trip' },
  { id: 'my-sunshine', icon: '🏆', title: 'My Personal Sunshine', description: 'Activated every time you walk into a room and everything gets better.', rarity: 'Legendary', movieId: 'smile-wins' },
  { id: 'memory-maker', icon: '🏆', title: 'Master Memory Maker', description: 'For turning ordinary days into stories worth telling forever.', rarity: 'Legendary', movieId: 'favorite-memories' },
];

export const BUCKET_LIST = [
  { id: 'goa', title: 'Goa Together', description: 'Not the quick trip — the real one. Sunsets, seafood, and no plans.', image: img(0), progress: 60, status: 'In Progress' },
  { id: 'rishikesh', title: 'Rishikesh', description: 'Mountains, river rafting, and watching the Ganga Aarti together.', image: img(1), progress: 20, status: 'Planned' },
  { id: 'manali', title: 'Manali', description: 'Snow, hot chocolate, and getting completely lost together.', image: img(2), progress: 10, status: 'Dreaming' },
  { id: 'cafe-hopping', title: 'Cafe Hopping', description: 'Every hidden cafe in the city. All the aesthetics. All the photos.', image: img(3), progress: 45, status: 'In Progress' },
  { id: 'movie-marathon', title: 'Movie Marathon', description: 'A whole weekend. No leaving the bed. All the movies. All the snacks.', image: img(4), progress: 70, status: 'Ongoing' },
  { id: 'dream-house', title: 'Dream House', description: 'Morning coffee. Our playlist. A home that feels like us.', image: img(22), progress: 5, status: 'Coming Soon' },
  { id: 'wedding', title: 'Wedding', description: 'The day I get to stand in front of everyone and say: this is the person I choose.', image: img(23), progress: 1, status: 'Someday' },
  { id: 'grow-old', title: 'Growing Old Together', description: 'The long game. The big plan. The only future I want.', image: img(24), progress: 100, status: 'Forever' },
];

export const TIMELINE_EVENTS = [
  { id: 1, year: '2022', title: 'We Met', description: 'Two people, one moment, infinite possibilities.', emoji: '✨', image: img(6) },
  { id: 2, year: '2022', title: 'First Chat', description: 'The first message that changed everything.', emoji: '💬', image: img(12) },
  { id: 3, year: '2022', title: 'First Selfie', description: 'The photo that proved we were both smiling at the same thing.', emoji: '📸', image: img(14) },
  { id: 4, year: '2022', title: 'First Date', description: 'Nervous hands, big smiles, and butterflies that never left.', emoji: '🌹', image: img(0) },
  { id: 5, year: '2023', title: 'First Trip', description: 'The adventure that showed us how good we are together.', emoji: '🏖️', image: img(1) },
  { id: 6, year: '2023', title: 'First Fight 😂', description: '18 minutes of drama. A lifetime of laughing about it after.', emoji: '😤', image: img(4) },
  { id: 7, year: '2024', title: 'Birthday', description: 'The day I wanted to make you feel as special as you make me feel every day.', emoji: '🎂', image: img(5) },
  { id: 8, year: 'Today', title: 'Right Now', description: 'You. This moment. My heart, completely full.', emoji: '❤️', image: img(9) },
];

export const VOICE_NOTES = [
  { id: 'good-morning', title: 'Good Morning', icon: '☀️', duration: '0:32', description: 'For every morning I wish I could be there to say it in person.', color: '#FF9500' },
  { id: 'i-miss-you', title: 'I Miss You', icon: '💙', duration: '0:45', description: 'Recorded at 11PM when the missing got too loud to ignore.', color: '#007AFF' },
  { id: 'happy-birthday', title: 'Happy Birthday', icon: '🎂', duration: '1:10', description: 'Everything I wanted to say today, in my own voice, just for you.', color: '#E50914' },
  { id: 'sleep-well', title: 'Sleep Well', icon: '🌙', duration: '0:28', description: 'For the nights when falling asleep feels hard. I\'m always with you.', color: '#5E5CE6' },
  { id: 'thank-you', title: 'Thank You', icon: '🙏', duration: '0:55', description: 'For everything you are and everything you do. Thank you, endlessly.', color: '#34C759' },
  { id: 'forever', title: 'Forever', icon: '♾️', duration: '1:30', description: 'The promise I make to you today, and every day after.', color: '#E50914' },
];

export const SPIN_WHEEL_REWARDS = [
  { id: 1, label: 'Movie Date 🎬', color: '#E50914' },
  { id: 2, label: 'Long Hug 🤗', color: '#FF6B35' },
  { id: 3, label: 'Ice Cream 🍦', color: '#FF9500' },
  { id: 4, label: 'Coffee Date ☕', color: '#8B5E3C' },
  { id: 5, label: '1 Kiss Coupon 💋', color: '#E91E8C' },
  { id: 6, label: 'Unlimited Cuddles 🥰', color: '#9B59B6' },
  { id: 7, label: 'Dinner Date 🍽️', color: '#2ECC71' },
  { id: 8, label: 'Surprise Gift 🎁', color: '#3498DB' },
];

export const SEARCH_RESULTS: Record<string, { title: string; subtitle: string; emoji: string }[]> = {
  love: [{ title: 'Everything ❤️', subtitle: 'All results. All of them. Every single one.', emoji: '❤️' }, { title: 'You', subtitle: 'The #1 result for every search I\'ll ever do.', emoji: '💫' }, { title: 'Us', subtitle: 'The greatest love story ever told.', emoji: '✨' }],
  angry: [{ title: '404 — Not Found', subtitle: 'She can never stay angry. Not possible. Scientifically impossible.', emoji: '😤' }],
  hug: [{ title: 'Unlimited Results', subtitle: 'Stock never runs low. Available 24/7. Free of charge.', emoji: '🤗' }],
  me: [{ title: 'The Luckiest Boy Alive', subtitle: '1 result. Completely accurate. Verified.', emoji: '🍀' }],
  beautiful: [{ title: 'You', subtitle: 'The only result that matters. Every time.', emoji: '💖' }, { title: 'Your Smile', subtitle: 'Scientifically proven to be devastating.', emoji: '😊' }],
  happy: [{ title: 'Every Moment With You', subtitle: 'Every. Single. One.', emoji: '☀️' }],
  home: [{ title: 'Wherever You Are', subtitle: 'That\'s where home is. Simple as that.', emoji: '🏡' }],
  perfect: [{ title: 'You (Duh)', subtitle: 'Only one result. No competition.', emoji: '💎' }],
  sad: [{ title: 'Loading Hug...', subtitle: 'Don\'t be sad. I\'m here. Always.', emoji: '🤗' }],
  funny: [{ title: 'Your Weird Faces', subtitle: '10/10 every time. No notes.', emoji: '😜' }, { title: 'Our Fights 😂', subtitle: 'Actually the funniest thing in this universe.', emoji: '😹' }],
};

export const LOVE_STATS = {
  daysTogether: 730,
  hoursTalking: 8760,
  photosTaken: 2847,
  videosEdited: 47,
  laughsShared: 99999,
  argumentsWon: 0,
  lovePercentage: '100,000,000%',
};

export const LOADING_QUOTES = [
  'Loading Happiness...',
  'Finding Cute Moments...',
  'Preparing Happy Tears...',
  'Buffering Love...',
  'Collecting Memories...',
  'Almost Ready...',
  'Organizing Feelings...',
  'Counting the Ways...',
  'Compiling All the Best Parts...',
  'Setting the Mood...',
];
