export function MoodResult({ mood }) {
  return (
    <div className={`p-6 rounded-xl shadow-lg text-center ${mood.color}`}>
      <div className="text-6xl">{mood.emoji}</div>
      <div className="text-2xl font-semibold mt-2">{mood.label}</div>
    </div>
  );
}
