const User = require('../models/Users');

exports.searchUsers = async (req, res) => {
  const { q } = req.query;
  const currentUserId = req.user.userId;

  if (!q) {
    return res.status(200).json([]);
  }

  try {
    const users = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    }).select('name _id role email');

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching for users', error });
  }
};
