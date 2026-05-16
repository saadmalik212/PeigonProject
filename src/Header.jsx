export default function Header() {
  return (
    <div className="w-full bg-black shadow-md overflow-hidden">
      {/* 1. flex-row maintain rakha hai taake mobile par bhi images sath rahein.
          2. gap-0 aur p-0 se extra space khatam.
      */}
      <div className="w-full flex flex-row justify-center items-center p-0 gap-0">
        
        {/* Left Image */}
        <div className="flex">
          <img 
            src="/one.png" 
            alt="one" 
            className="w-32 h-32 md:w-64 md:h-64 object-contain"
          />
        </div>

        {/* Center Image */}
        <div className="flex">
          <img 
            src="/asad.PNG" 
            alt="asad" 
            className="w-32 h-32 md:w-64 md:h-64 object-contain"
          />
        </div>

        {/* Right Image */}
        <div className="flex">
          <img 
            src="/Two.jpeg" 
            alt="two" 
            className="w-32 h-32 md:w-64 md:h-64 object-contain"
          />
        </div>
      </div>
    </div>
  );
}