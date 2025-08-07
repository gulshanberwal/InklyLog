export function SubtleSpinner() {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-white dark:bg-gray-900">
      <div className="h-10 w-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
