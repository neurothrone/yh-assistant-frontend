interface ErrorMessageProps {
  title: string;
  message: string;
}

export const ErrorMessage = ({ title, message }: ErrorMessageProps) => {
  return (
    <div className="bg-red-600 text-white p-4 rounded-md shadow-md max-w-md w-full">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p>{message}</p>
    </div>
  );
};
