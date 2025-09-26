function IdentityCard({ identity }) {
  return (
    <div className="border-2 border-green-500 p-4 mb-4 rounded-lg">
      <h2 className="text-xl mb-2">Your Assigned Identity</h2>
      <ul>
        <li>Age: {identity.age}</li>
        <li>Job: {identity.job}</li>
        <li>Personality: {identity.personality}</li>
        <li>Quirk: {identity.quirk}</li>
      </ul>
    </div>
  );
}
export default IdentityCard;
