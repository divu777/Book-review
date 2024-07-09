import Header from "./Header";
import book1 from "./../assets/book1.png";
const Landing = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex justify-evenly h-2/4 p-6">
        <div className=" w-1/4 flex flex-col gap-2">
          <h1 className="text-8xl">Read & Review</h1>
          <h3 className="text-3xl opacity-70">To Succeed You Must Read.</h3>
        </div>
        <div className="w-3/5 flex justify-evenly">
          <img
            src={book1}
            className="h-96 z-20  "
            style={{ boxShadow: "10px 10px 10px 3px rgba(179,165,143,1)" }}
          />
          <img src={book1} className="h-96 z-20 "></img>
          <img src={book1} className="h-96 z-20 "></img>
        </div>
      </div>
      <div className="flex flex-col h-1/4">
        <div
          className="w-full bg-gray-200 h-12"
          style={{ background: "#eae1d4", color: "#eae1d4" }}
        ></div>
        <div
          className=" tracking-wider text-xl w-full flex justify-center font-semibold uppercase shadow-2xl h-8"
          style={{ background: "#f8f3ed" }}
        >
          Shelf
        </div>
      </div>
    </div>
  );
};

export default Landing;
