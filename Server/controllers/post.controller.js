import { Post } from "../models/post.model.js";

export const create = async (req, res) => {
  // if (!req.isAdmin) {
  //   //! Added by middleware
  //   return res
  //     .status(403)
  //     .json({ msg: "You are not allowed to create a post" });
  // }

  const userId = req.userId;

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  try {
    const existingTitle = await Post.findOne({ title: req.body.title });

    if (existingTitle) {
      return res.status(400).json({ msg: "Title alredy exists" });
    }
    const newPost = await Post.create({
      ...req.body,
      slug,
      userId,
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.json(500).json({ error });
    console.log(error);
  }
};

export const getPosts = async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 4;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } }, 
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit); 

    const totalPosts = await Post.countDocuments(); 

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate() 
    );

    // console.log(oneMonthAgo) // 2024-01-27T18:30:00.000Z


    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts, //! Array 
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    res.json(500).json({ error });
    console.log(error);
  }
};



export const deletePost = async (req,res) => {
  if(req.userId !== req.params.userId){
    return res.status(403).json({msg: "You are not allowed to delete this post"})
  }

  try {
    await Post.findByIdAndDelete(req.params.postId)
    res.status(200).json({msg : "The post has been deleted"})
  } catch (error) {
    console.log(error)
  }
}

export const updatepost = async (req, res) => {
  if(req.userId !== req.params.userId){
    return res.status(403).json({msg: "You are not allowed to update this post"})
  }

  try {

    // console.log( req.params.postId);
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error)
  }
}