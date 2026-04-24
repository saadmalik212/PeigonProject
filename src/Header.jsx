export default function Header() {
  return (
    <div className="w-full bg-white shadow-md">
      <div className="w-full flex justify-between items-center ">
        {/* Left Image */}
        <div className="flex-1 flex justify-start">
          <img 
            src="/one.png" 
            alt="one" 
            className="w-64 h-64 object-contain"
          />
        </div>

        {/* Center Image */}
        <div className="flex-1 flex justify-center">
          <img 
            src="/asad.PNG" 
            alt="asad" 
            className="w-64 h-64 object-contain"
          />
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-end">
          <img 
            src="/Two.jpeg" 
            alt="two" 
            className="h-64 w-64 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
