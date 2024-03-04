import video from "../assests/130591.mp4";

function About() {
  return (
    <div className="min-h-screen flex items-center justify-center relative xl:bg-white">
      <div className="min-h-screen object-cover  w-full absolute hidden xl:inline-block flex-1 z-0">
        <video src={video} autoPlay loop muted></video>
      </div>
      <div className="xl:max-w-[45vw]   p-3 text-center absolute flex lg:justify-end  right-0 top-0      mx-auto pr-14 h-full flex-1 overflow-hidden z-1 shadow-sm">
        <div className="w-full overflow-y-auto">
          <h1 className="text-3xl font font-bold text-center my-7 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            About Somnath&apos;Blog
          </h1>
          <div className="text-md text-gray-700 flex flex-col gap-4 font-serif items-center justify-center w-full md:text-xl dark:text-white xl:dark:text-black">
            <p className="md:text-xl">
              Welcome to Somnath&apos;s Blog! I&apos;m a Full-stack Developer
              who empathetically creates engaging and functional websites.
            </p>

            <p>
              On this blog, you&apos;ll find weekly articles and tutorials
              covering topics such as web development, software engineering,
              programming languages, and even daily activities.
            </p>

            <p>
              I encourage you to leave comments on my posts and engage with
              other readers. You can like other people&apos;s comments and reply
              to them as well. I believe that a community of learners can help
              each other grow and improve.
            </p>
            <p>Get in touch! 😊</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
