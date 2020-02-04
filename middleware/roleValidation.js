const roleValidation = async (allowedRoles) => async (req, res, next) => {
  try {
    const { role } = req.user;
    if (!allowedRoles.includes(role)) {
      throw new ErorrHandling(400, 'You have no permission for this operation');
    };

    next();
  } catch (err) {
    next(err);
  };
};

module.exports = roleValidation;
