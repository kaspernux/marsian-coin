export function Input({ type = "text", placeholder, value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="px-3 py-2 rounded border border-gray-600 bg-gray-900 text-white"
    />
  );
}
