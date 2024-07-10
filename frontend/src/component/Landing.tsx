import Header from "./Header";
import book1 from "./../assets/book1.png";
import book2 from "./../assets/book2.png";
import book3 from "./../assets/book3.png";
import book4 from "./../assets/book4.png";
import book5 from "./../assets/book5.png";
const Landing = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Header />
      <div className="flex flex-col justify-between items-center flex-grow px-8 py-16">
        <div className="text-center md:text-left mb-12 md:mb-0 md:w-1/2">
          <div className="flex items-center justify-center md:justify-start">
            <div>
              <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
                TO SUCCEED YOU MUST READ
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Not sure what to read next? Explore our catalog of public domain
                books with our editors.
              </p>
              <button className="bg-black text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-800 transition duration-300 transform hover:scale-105 absolute top-56 right-1/3">
                Explore Now <span className="ml-2">→</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center ">
          <img
            src={book1}
            className="object-cover transform hover:scale-110 transition duration-300 shadow-lg rounded-lg"
            alt="Book 1"
            style={{
              height: "500px",
            }}
          />
          <img
            src={book2}
            className=" object-cover transform hover:scale-110 transition duration-300 shadow-lg rounded-lg"
            alt="Book 2"
            style={{
              height: "500px",
            }}
          />
          <img
            src={book3}
            className=" object-cover transform hover:scale-110 transition duration-300 shadow-lg rounded-lg"
            alt="Book 3"
            style={{
              height: "500px",
            }}
          />
          <img
            src={book4}
            className=" object-cover transform hover:scale-110 transition duration-300 shadow-lg rounded-lg"
            alt="Book 4"
            style={{
              height: "500px",
            }}
          />
          <img
            src={book5}
            className=" object-cover transform hover:scale-110 transition duration-300 shadow-lg rounded-lg"
            alt="Book 5"
            style={{
              height: "500px",
            }}
          />
        </div>
        <div className="flex justify-between w-full mt-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">20k+</div>
            <div className="text-lg text-gray-700">Books</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">14</div>
            <div className="text-lg text-gray-700">Writer</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
