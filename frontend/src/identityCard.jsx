/* eslint-disable react/prop-types */
export default function IdentityCard({ identity }) {
  return (
    <div
      className="mt-10 p-6 border-2 border-green-500 rounded-xl shadow-xl w-96 
                 bg-gray-900 text-green-300 animate-fadeIn relative overflow-hidden"
    >
      <h2 className="text-2xl font-bold mb-4">🆔 Identity Card</h2>
      <div className="space-y-2">
        <p><span className="font-bold">Personality:</span> {identity.personality}</p>
        <p><span className="font-bold">Profession:</span> {identity.profession}</p>
        <p><span className="font-bold">Hobby:</span> {identity.hobby}</p>
        <p><span className="font-bold">Quirk:</span> {identity.quirk}</p>
      </div>
      <p className="mt-4 text-xs text-green-500">ID: {identity.id}</p>
    </div>
  );
}
