const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "and", "or", "but", "if", "then", "so", "to", "of", "in", "on", "at",
  "for", "with", "about", "as", "by", "from", "this", "that", "it", "its",
  "what", "when", "where", "why", "how", "who", "which", "did", "do",
  "does", "can", "could", "should", "would", "will", "we", "i", "you",
  "cover", "covered", "class", "lecture", "course",
]);

const TITLE_WEIGHT = 5;
const RECENCY_FALLBACK_COUNT = 5;
const DEFAULT_CHAR_BUDGET = 60000;

function extractKeywords(question) {
  return (question.toLowerCase().match(/[a-z0-9']+/g) || []).filter(
    (word) => word.length >= 3 && !STOPWORDS.has(word)
  );
}

function countOccurrences(haystackLower, needle) {
  if (!needle) return 0;
  let count = 0;
  let index = haystackLower.indexOf(needle);
  while (index !== -1) {
    count += 1;
    index = haystackLower.indexOf(needle, index + needle.length);
  }
  return count;
}

function scoreLecture(lecture, keywords) {
  const titleLower = lecture.lecture_title.toLowerCase();
  const bodyLower = lecture.extracted_text.toLowerCase();
  let score = 0;
  for (const keyword of keywords) {
    score += countOccurrences(titleLower, keyword) * TITLE_WEIGHT;
    score += countOccurrences(bodyLower, keyword);
  }
  return score;
}

function byDateDescending(a, b) {
  return a.lecture_date < b.lecture_date ? 1 : a.lecture_date > b.lecture_date ? -1 : 0;
}

export function selectRelevantLectures(question, lectures, charBudget = DEFAULT_CHAR_BUDGET) {
  const keywords = extractKeywords(question);

  let ranked;
  if (keywords.length === 0) {
    ranked = [...lectures].sort(byDateDescending);
  } else {
    const scored = lectures.map((lecture) => ({
      lecture,
      score: scoreLecture(lecture, keywords),
    }));

    const anyMatch = scored.some((entry) => entry.score > 0);
    if (!anyMatch) {
      ranked = [...lectures].sort(byDateDescending).slice(0, RECENCY_FALLBACK_COUNT);
    } else {
      scored.sort((a, b) => b.score - a.score || byDateDescending(a.lecture, b.lecture));
      ranked = scored.filter((entry) => entry.score > 0).map((entry) => entry.lecture);
    }
  }

  const selected = [];
  let totalChars = 0;
  for (const lecture of ranked) {
    const chunkLength = lecture.extracted_text.length;
    if (selected.length > 0 && totalChars + chunkLength > charBudget) {
      break;
    }
    selected.push(lecture);
    totalChars += chunkLength;
  }

  return selected.sort((a, b) => (a.lecture_date < b.lecture_date ? -1 : a.lecture_date > b.lecture_date ? 1 : 0));
}
