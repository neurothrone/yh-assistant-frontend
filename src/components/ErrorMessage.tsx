interface ErrorMessageProps {
  title: string;
  message: string;
}

export const ErrorMessage = ({ title, message }: ErrorMessageProps) => {
  return (
    <div className="bg-[#3d1919] text-white p-5 rounded-md shadow-lg max-w-md w-full border border-[#4f2222]">
      <h2 className="text-xl font-semibold mb-3 text-red-300">{title}</h2>
      <p className="text-gray-200">{message}</p>
    </div>
  );
};
