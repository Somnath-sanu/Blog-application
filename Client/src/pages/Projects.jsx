import video from "../assests/145514.mp4"

function Projects() {
  return (
    <div className='min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3'>
      <div className="object-contain border ">
        <video src={video} autoPlay loop muted></video>
      </div>
      <h1 className='text-3xl font-semibold'>Pojects</h1>
      <p className='text-md text-gray-500 text-5xl'>Will be Uploaded Soon !! </p>
      
    </div>
  )
}

export default Projects
