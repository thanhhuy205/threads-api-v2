const ContentNotFetch = () => {
  return (
    <div className="relative w-full !bg-transparent flex flex-col justify-between items-center z-1">
      {/* Signature notched divider at the bottom */}
      <div className="relative w-full h-[23px] !bg-transparent flex justify-between items-end z-1">
        <div className="absolute -left-3 -bottom-[12px] overflow-hidden w-[36px] h-[36px] z-1">
          <div className="shadow-[0_0_12px_0_rgba(0,0,0,0.04),_0_0_0_48px_var(--color-background)] overflow-hidden absolute w-[48px] h-[48px] bottom-[12px] left-[12px] rounded-full border"></div>
        </div>

        <div className="absolute -right-3 -bottom-[12px] overflow-hidden w-[36px] h-[36px] z-1">
          <div className="absolute shadow-[0_0_12px_0_rgba(0,0,0,0.04),_0_0_0_48px_var(--color-background)] overflow-hidden w-[48px] h-[48px] bottom-[12px] right-[12px] rounded-full border"></div>
        </div>
      </div>
    </div>
  );
};

export default ContentNotFetch;
