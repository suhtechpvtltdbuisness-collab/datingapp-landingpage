export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    id: "report",
    question: "How do I report someone?",
    answer: "Open their profile or your chat with them, tap the ⋯ menu, then choose Report. Pick a reason and add any details. They won't be told who reported them, and our moderation team reviews every report.",
  },
  {
    id: "block",
    question: "What happens when I block or unmatch someone?",
    answer: "They disappear from your matches and chats, and they can't see your profile or message you again. You can block someone even if you never matched with them.",
  },
  {
    id: "verification",
    question: "What does the verified badge mean?",
    answer: "The badge means the person passed our selfie check, so their face matches their profile photos. It lowers the risk of fakes but doesn't guarantee anyone's intentions, so keep using your judgement.",
  },
  {
    id: "id-data",
    question: "What happens to my ID after verification?",
    answer: "We use your ID only to confirm who you are. It's never shown on your profile or shared with other members. You can see how long we keep it, and ask us to delete it, in our Privacy Policy.",
  },
  {
    id: "scam",
    question: "Someone asked me for money. What should I do?",
    answer: "Don't send it, even if their story sounds urgent or convincing. Asking for money, gift cards, or crypto is a classic sign of a romance scam. Report the profile so our team can review it.",
  },
  {
    id: "emergency",
    question: "Can the app help me in an emergency?",
    answer: "We aren't an emergency service and can't send help. If you're in danger, call your local emergency number right away (for example 112 in India or the EU, or 911 in the US). Once you're safe, report the person in the app so we can take action.",
  },
];
