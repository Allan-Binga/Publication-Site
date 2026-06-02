function Spinner({
  className = "",
  color = "border-white",
}) {
  return (
    <div
      className={`
                w-4
                h-4
                border-2
                ${color}
                border-t-transparent
                rounded-full
                animate-spin
                ${className}
            `}
    />
  );
}

export default Spinner;